import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import type { ServiceCategory } from '@/lib/db/schema';

/**
 * GET /api/services
 * Returns all active service categories with their subcategories
 */
export async function GET() {
  try {
    const result = await sql<ServiceCategory>`
      SELECT
        id,
        name_ro,
        name_en,
        slug,
        icon,
        parent_id,
        is_active,
        display_order
      FROM service_categories
      WHERE is_active = true
      ORDER BY display_order ASC, name_ro ASC
    `;

    const categories = result.rows;

    // Separate main categories and subcategories
    const mainCategories = categories.filter(cat => cat.parent_id === null);
    const subcategories = categories.filter(cat => cat.parent_id !== null);

    // Build hierarchical structure
    const categoriesWithChildren = mainCategories.map(main => ({
      ...main,
      subcategories: subcategories.filter(sub => sub.parent_id === main.id),
    }));

    return NextResponse.json({
      success: true,
      data: categoriesWithChildren,
      count: categories.length,
    });
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service categories' },
      { status: 500 }
    );
  }
}
