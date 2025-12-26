import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { reviewSchema } from '@/lib/validations/review';

/**
 * POST /api/reviews
 * Create a new review
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Trebuie să fiți autentificat' },
        { status: 401 }
      );
    }

    // Only customers can leave reviews
    if (session.user.role !== 'customer') {
      return NextResponse.json(
        { success: false, error: 'Doar clienții pot lăsa recenzii' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = reviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Date invalide',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Check if installer exists and profile is completed
    const installerCheck = await sql`
      SELECT id, profile_completed
      FROM installer_profiles
      WHERE id = ${data.installer_profile_id}
      LIMIT 1
    `;

    if (installerCheck.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Instalatorul nu a fost găsit' },
        { status: 404 }
      );
    }

    if (!installerCheck.rows[0].profile_completed) {
      return NextResponse.json(
        { success: false, error: 'Nu puteți evalua un profil incomplet' },
        { status: 400 }
      );
    }

    // Check if user already reviewed this installer
    const existingReview = await sql`
      SELECT id
      FROM reviews
      WHERE customer_id = ${session.user.id}
        AND installer_profile_id = ${data.installer_profile_id}
      LIMIT 1
    `;

    if (existingReview.rowCount && existingReview.rowCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ați lăsat deja o recenzie pentru acest instalator',
        },
        { status: 400 }
      );
    }

    // Check if service category exists
    const serviceCheck = await sql`
      SELECT id
      FROM service_categories
      WHERE id = ${data.service_category_id}
      LIMIT 1
    `;

    if (serviceCheck.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Categoria de serviciu nu există' },
        { status: 400 }
      );
    }

    // Insert review
    const result = await sql`
      INSERT INTO reviews (
        installer_profile_id,
        customer_id,
        service_category_id,
        rating,
        title,
        comment,
        work_completed_at
      )
      VALUES (
        ${data.installer_profile_id},
        ${session.user.id},
        ${data.service_category_id},
        ${data.rating},
        ${data.title},
        ${data.comment},
        ${data.work_completed_at || null}
      )
      RETURNING id, created_at
    `;

    const review = result.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        id: review.id,
        created_at: review.created_at,
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: 'Eroare la crearea recenziei' },
      { status: 500 }
    );
  }
}
