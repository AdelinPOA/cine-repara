import { MetadataRoute } from 'next';
import { sql } from '@/lib/db';
import { generateInstallerSlug } from '@/lib/utils/slugify';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cinerepara.ro';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/instalatori`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/servicii`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // Get all service categories
    const servicesResult = await sql`
      SELECT slug, updated_at
      FROM service_categories
      WHERE parent_id IS NULL
      ORDER BY display_order ASC
    `;

    const servicePages: MetadataRoute.Sitemap = servicesResult.rows.map((service: any) => ({
      url: `${baseUrl}/servicii/${service.slug}`,
      lastModified: service.updated_at || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Get all completed installer profiles
    const installersResult = await sql`
      SELECT
        ip.id,
        ip.business_name,
        ip.updated_at,
        u.name,
        (
          SELECT c.name
          FROM installer_service_areas isa
          JOIN cities c ON isa.city_id = c.id
          WHERE isa.installer_profile_id = ip.id
          ORDER BY c.name ASC
          LIMIT 1
        ) as city_name
      FROM installer_profiles ip
      JOIN users u ON ip.user_id = u.id
      WHERE ip.profile_completed = true
      ORDER BY ip.updated_at DESC
    `;

    const installerPages: MetadataRoute.Sitemap = installersResult.rows.map(
      (installer: any) => {
        const slug = generateInstallerSlug(
          installer.business_name || installer.name,
          installer.city_name || 'Romania',
          installer.id
        );

        return {
          url: `${baseUrl}/instalatori/${slug}`,
          lastModified: installer.updated_at || new Date(),
          changeFrequency: 'daily' as const,
          priority: 0.8,
        };
      }
    );

    return [...staticPages, ...servicePages, ...installerPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages only if database query fails
    return staticPages;
  }
}
