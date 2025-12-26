import { z } from 'zod';

/**
 * Review submission schema
 */
export const reviewSchema = z.object({
  installer_profile_id: z.string().uuid({
    message: 'ID instalator invalid',
  }),
  service_category_id: z.number().int().positive({
    message: 'Categoria de serviciu este necesară',
  }),
  rating: z
    .number()
    .int()
    .min(1, { message: 'Rating-ul minim este 1 stea' })
    .max(5, { message: 'Rating-ul maxim este 5 stele' }),
  title: z
    .string()
    .min(3, { message: 'Titlul trebuie să aibă cel puțin 3 caractere' })
    .max(100, { message: 'Titlul poate avea maxim 100 de caractere' }),
  comment: z
    .string()
    .min(10, { message: 'Comentariul trebuie să aibă cel puțin 10 caractere' })
    .max(2000, { message: 'Comentariul poate avea maxim 2000 de caractere' }),
  work_completed_at: z
    .string()
    .datetime({ message: 'Data lucrării este invalidă' })
    .optional(),
});

/**
 * Review update schema (for editing)
 */
export const reviewUpdateSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, { message: 'Rating-ul minim este 1 stea' })
    .max(5, { message: 'Rating-ul maxim este 5 stele' })
    .optional(),
  title: z
    .string()
    .min(3, { message: 'Titlul trebuie să aibă cel puțin 3 caractere' })
    .max(100, { message: 'Titlul poate avea maxim 100 de caractere' })
    .optional(),
  comment: z
    .string()
    .min(10, { message: 'Comentariul trebuie să aibă cel puțin 10 caractere' })
    .max(2000, { message: 'Comentariul poate avea maxim 2000 de caractere' })
    .optional(),
});

/**
 * Review image upload schema
 */
export const reviewImageSchema = z.object({
  review_id: z.string().uuid({
    message: 'ID recenzie invalid',
  }),
  image_url: z.string().url({
    message: 'URL imagine invalid',
  }),
  caption: z
    .string()
    .max(200, { message: 'Descrierea poate avea maxim 200 de caractere' })
    .optional(),
  display_order: z
    .number()
    .int()
    .min(0, { message: 'Ordinea de afișare trebuie să fie pozitivă' })
    .optional(),
});

/**
 * Helpful vote schema
 */
export const helpfulVoteSchema = z.object({
  review_id: z.string().uuid({
    message: 'ID recenzie invalid',
  }),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReviewUpdateInput = z.infer<typeof reviewUpdateSchema>;
export type ReviewImageInput = z.infer<typeof reviewImageSchema>;
export type HelpfulVoteInput = z.infer<typeof helpfulVoteSchema>;
