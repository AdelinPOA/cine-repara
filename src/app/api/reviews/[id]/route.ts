import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sql } from '@/lib/db';
import { reviewUpdateSchema } from '@/lib/validations/review';

/**
 * GET /api/reviews/[id]
 * Get a single review
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params;
    const result = await sql`
      SELECT
        r.*,
        u.name as customer_name,
        u.avatar_url as customer_avatar,
        sc.name_ro as service_name,
        (
          SELECT json_agg(
            json_build_object(
              'id', ri.id,
              'image_url', ri.image_url,
              'caption', ri.caption,
              'display_order', ri.display_order
            )
            ORDER BY ri.display_order ASC
          )
          FROM review_images ri
          WHERE ri.review_id = r.id
        ) as images
      FROM reviews r
      JOIN users u ON r.customer_id = u.id
      JOIN service_categories sc ON r.service_category_id = sc.id
      WHERE r.id = ${reviewId}
      LIMIT 1
    `;

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Recenzia nu a fost găsită' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { success: false, error: 'Eroare la încărcarea recenziei' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/reviews/[id]
 * Update a review
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Trebuie să fiți autentificat' },
        { status: 401 }
      );
    }

    const { id: reviewId } = await params;
    const body = await request.json();

    // Validate input
    const validation = reviewUpdateSchema.safeParse(body);
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

    // Check if review exists and belongs to user
    const reviewCheck = await sql`
      SELECT customer_id
      FROM reviews
      WHERE id = ${reviewId}
      LIMIT 1
    `;

    if (reviewCheck.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Recenzia nu a fost găsită' },
        { status: 404 }
      );
    }

    if (reviewCheck.rows[0].customer_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Nu puteți modifica această recenzie' },
        { status: 403 }
      );
    }

    // Build update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.rating !== undefined) {
      updates.push(`rating = $${paramIndex}`);
      values.push(data.rating);
      paramIndex++;
    }

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      values.push(data.title);
      paramIndex++;
    }

    if (data.comment !== undefined) {
      updates.push(`comment = $${paramIndex}`);
      values.push(data.comment);
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Nicio modificare specificată' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = NOW()`);

    const query = `
      UPDATE reviews
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, updated_at
    `;

    values.push(reviewId);

    const result = await sql.query(query, values);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: 'Eroare la actualizarea recenziei' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/reviews/[id]
 * Delete a review
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Trebuie să fiți autentificat' },
        { status: 401 }
      );
    }

    const { id: reviewId } = await params;

    // Check if review exists and belongs to user
    const reviewCheck = await sql`
      SELECT customer_id
      FROM reviews
      WHERE id = ${reviewId}
      LIMIT 1
    `;

    if (reviewCheck.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Recenzia nu a fost găsită' },
        { status: 404 }
      );
    }

    if (reviewCheck.rows[0].customer_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Nu puteți șterge această recenzie' },
        { status: 403 }
      );
    }

    // Delete review (cascades to images)
    await sql`
      DELETE FROM reviews
      WHERE id = ${reviewId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Recenzia a fost ștearsă',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: 'Eroare la ștergerea recenziei' },
      { status: 500 }
    );
  }
}
