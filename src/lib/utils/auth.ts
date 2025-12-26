import type { UserRole } from '@/lib/db/schema';

/**
 * Get redirect path based on user role
 */
export function getRedirectPath(role: UserRole): string {
  return `/dashboard/${role}`;
}
