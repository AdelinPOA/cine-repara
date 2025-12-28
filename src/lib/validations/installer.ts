import { z } from 'zod';

/**
 * Installer Profile Validation Schemas
 * Using Zod for type-safe validation on client and server
 */

// =====================================================
// INSTALLER PROFILE SCHEMA
// =====================================================

export const installerProfileSchema = z.object({
  business_name: z
    .string()
    .min(2, 'Numele firmei trebuie să aibă cel puțin 2 caractere')
    .max(255, 'Numele firmei este prea lung')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(1000, 'Descrierea este prea lungă (maximum 1000 caractere)')
    .optional()
    .or(z.literal('')),
  years_experience: z
    .number()
    .int('Experiența trebuie să fie un număr întreg')
    .min(0, 'Experiența nu poate fi negativă')
    .max(70, 'Experiența este prea mare')
    .optional()
    .or(z.literal(0)),
  is_available: z.boolean().default(true),
});

export type InstallerProfileInput = z.infer<typeof installerProfileSchema>;

// =====================================================
// SERVICE SELECTION SCHEMA
// =====================================================

export const serviceSelectionSchema = z.object({
  service_category_ids: z
    .array(z.number())
    .min(1, 'Selectați cel puțin un serviciu'),
  primary_service_id: z
    .number()
    .optional()
    .nullable(),
}).refine(
  (data) => {
    if (data.primary_service_id) {
      return data.service_category_ids.includes(data.primary_service_id);
    }
    return true;
  },
  {
    message: 'Serviciul principal trebuie să fie unul din serviciile selectate',
    path: ['primary_service_id'],
  }
);

export type ServiceSelectionInput = z.infer<typeof serviceSelectionSchema>;

// =====================================================
// LOCATION SELECTION SCHEMA
// =====================================================

export const locationSelectionSchema = z.object({
  city_ids: z
    .array(z.number())
    .min(1, 'Selectați cel puțin un oraș în care activați'),
});

export type LocationSelectionInput = z.infer<typeof locationSelectionSchema>;

// =====================================================
// COMPLETE PROFILE SCHEMA
// =====================================================

export const completeProfileSchema = z.object({
  // Step 1: Business info
  business_name: installerProfileSchema.shape.business_name,
  bio: installerProfileSchema.shape.bio,
  years_experience: installerProfileSchema.shape.years_experience,
  is_available: installerProfileSchema.shape.is_available,

  // Step 2: Services
  service_category_ids: serviceSelectionSchema.shape.service_category_ids,
  primary_service_id: serviceSelectionSchema.shape.primary_service_id,

  // Step 3: Locations
  city_ids: locationSelectionSchema.shape.city_ids,
}).refine(
  (data) => {
    if (data.primary_service_id) {
      return data.service_category_ids.includes(data.primary_service_id);
    }
    return true;
  },
  {
    message: 'Serviciul principal trebuie să fie unul din serviciile selectate',
    path: ['primary_service_id'],
  }
);

export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;

// =====================================================
// PORTFOLIO IMAGE SCHEMA
// =====================================================

export const portfolioImageSchema = z.object({
  image_url: z.string().url('URL invalid'),
  title: z
    .string()
    .max(255, 'Titlul este prea lung')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(500, 'Descrierea este prea lungă')
    .optional()
    .or(z.literal('')),
  service_category_id: z.number().optional().nullable(),
});

export type PortfolioImageInput = z.infer<typeof portfolioImageSchema>;

// =====================================================
// CERTIFICATION SCHEMA
// =====================================================

export const certificationSchema = z.object({
  name: z
    .string()
    .min(2, 'Numele certificării trebuie să aibă cel puțin 2 caractere')
    .max(255, 'Numele certificării este prea lung'),
  issuing_authority: z
    .string()
    .max(255, 'Numele autorității este prea lung')
    .optional()
    .or(z.literal('')),
  issue_date: z.date().optional().nullable(),
  expiry_date: z.date().optional().nullable(),
  certificate_url: z
    .string()
    .url('URL invalid')
    .optional()
    .or(z.literal('')),
});

export type CertificationInput = z.infer<typeof certificationSchema>;
