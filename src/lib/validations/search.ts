import { z } from 'zod';

/**
 * Validation Schemas for Search History API
 *
 * Security: Ensures type safety and prevents invalid/malicious data
 */

/**
 * Schema for recording search history
 *
 * Validates search parameters with proper types and bounds
 */
export const searchHistorySchema = z
  .object({
    search_query: z
      .string()
      .max(255, 'Search query too long - maximum 255 characters')
      .nullable()
      .optional(),
    service_category_id: z
      .number()
      .int('Service category ID must be an integer')
      .positive('Service category ID must be positive')
      .nullable()
      .optional(),
    city_id: z
      .number()
      .int('City ID must be an integer')
      .positive('City ID must be positive')
      .nullable()
      .optional(),
    region_id: z
      .number()
      .int('Region ID must be an integer')
      .positive('Region ID must be positive')
      .nullable()
      .optional(),
    results_count: z
      .number()
      .int('Results count must be an integer')
      .min(0, 'Results count cannot be negative')
      .max(10000, 'Results count too large')
      .default(0),
  })
  .refine(
    (data) =>
      data.search_query ||
      data.service_category_id ||
      data.city_id ||
      data.region_id,
    {
      message: 'At least one search parameter is required',
      path: ['search_query'], // Attach error to search_query field
    }
  );

/**
 * Type inference from schema
 */
export type SearchHistoryInput = z.infer<typeof searchHistorySchema>;

/**
 * Safe parse helper for search history
 * Returns validated data or formatted error
 */
export function validateSearchHistory(data: unknown): {
  success: boolean;
  data?: SearchHistoryInput;
  error?: string;
  details?: z.ZodIssue[];
} {
  const result = searchHistorySchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    error: 'Invalid search history data',
    details: result.error.issues,
  };
}
