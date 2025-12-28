import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { auth } from '@/lib/auth';

/**
 * DELETE /api/customers/[id]/favorites/[favoriteId]
 * Remove an installer from customer's favorites
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; favoriteId: string }> }
) {
  try {
    const session = await auth();
    const { id: customerId, favoriteId } = await params;

    // Verify user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow users to remove from their own favorites
    if (session.user.id !== customerId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Verify favorite belongs to customer
    const favoriteResult = await sql`
      SELECT * FROM customer_favorites
      WHERE id = ${parseInt(favoriteId, 10)} AND customer_id = ${customerId}
    `;

    if (favoriteResult.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Favorite not found or does not belong to you' },
        { status: 404 }
      );
    }

    // Delete favorite
    await sql`
      DELETE FROM customer_favorites
      WHERE id = ${parseInt(favoriteId, 10)}
    `;

    return NextResponse.json({
      success: true,
      message: 'Favorite removed successfully',
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to remove favorite',
      },
      { status: 500 }
    );
  }
}
