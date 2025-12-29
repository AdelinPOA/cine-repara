import { z } from 'zod';

/**
 * Validation Schemas for Favorites API
 *
 * Security: Ensures type safety and prevents invalid data from reaching the database
 */

/**
 * Schema for adding a favorite installer
 *
 * Validates that installer_profile_id is a valid UUID
 */
export const addFavoriteSchema = z.object({
  installer_profile_id: z
    .string()
    .uuid('Invalid installer profile ID format - must be a valid UUID'),
});

/**
 * Type inference from schema
 */
export type AddFavoriteInput = z.infer<typeof addFavoriteSchema>;

/**
 * Safe parse helper for favorites
 * Returns validated data or formatted error
 */
export function validateAddFavorite(data: unknown): {
  success: boolean;
  data?: AddFavoriteInput;
  error?: string;
  details?: z.ZodIssue[];
} {
  const result = addFavoriteSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: 'Invalid favorite data',
    details: result.error.issues,
  };
}
