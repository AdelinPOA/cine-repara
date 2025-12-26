/**
 * Convert Romanian text to URL-friendly slug
 * Handles Romanian diacritics (ă, â, î, ș, ț)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace Romanian diacritics
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate unique slug for installer
 * Format: business-name-city-id
 */
export function generateInstallerSlug(
  businessName: string,
  city: string,
  id: string
): string {
  const nameSlug = slugify(businessName);
  const citySlug = slugify(city);
  const shortId = id.substring(0, 8);

  return `${nameSlug}-${citySlug}-${shortId}`;
}

/**
 * Generate slug for service category
 */
export function generateServiceSlug(serviceName: string): string {
  return slugify(serviceName);
}
