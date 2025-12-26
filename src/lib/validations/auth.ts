import { z } from 'zod';

/**
 * Authentication Validation Schemas
 * Using Zod for type-safe validation on client and server
 */

// =====================================================
// LOGIN SCHEMA
// =====================================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email este necesar')
    .email('Email invalid'),
  password: z
    .string()
    .min(1, 'Parola este necesară'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// =====================================================
// REGISTER SCHEMA
// =====================================================

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Numele trebuie să aibă cel puțin 2 caractere')
    .max(255, 'Numele este prea lung'),
  email: z
    .string()
    .min(1, 'Email este necesar')
    .email('Email invalid'),
  password: z
    .string()
    .min(8, 'Parola trebuie să aibă cel puțin 8 caractere')
    .max(100, 'Parola este prea lungă')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Parola trebuie să conțină cel puțin o literă mică, o literă mare și o cifră'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Confirmarea parolei este necesară'),
  role: z.enum(['customer', 'installer'], {
    message: 'Rol invalid',
  }),
  phone: z
    .string()
    .regex(/^(\+4|0)[0-9]{9}$/, 'Număr de telefon invalid (ex: 0712345678)')
    .optional()
    .or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Parolele nu se potrivesc',
  path: ['confirmPassword'],
});

export type RegisterInput = z.infer<typeof registerSchema>;

// =====================================================
// PASSWORD RESET SCHEMA
// =====================================================

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email este necesar')
    .email('Email invalid'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Parola trebuie să aibă cel puțin 8 caractere')
    .max(100, 'Parola este prea lungă')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Parola trebuie să conțină cel puțin o literă mică, o literă mare și o cifră'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Confirmarea parolei este necesară'),
  token: z.string().min(1, 'Token invalid'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Parolele nu se potrivesc',
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// =====================================================
// PROFILE UPDATE SCHEMA
// =====================================================

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Numele trebuie să aibă cel puțin 2 caractere')
    .max(255, 'Numele este prea lung')
    .optional(),
  phone: z
    .string()
    .regex(/^(\+4|0)[0-9]{9}$/, 'Număr de telefon invalid (ex: 0712345678)')
    .optional()
    .or(z.literal('')),
  avatar_url: z
    .string()
    .url('URL invalid')
    .optional()
    .or(z.literal('')),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// =====================================================
// CHANGE PASSWORD SCHEMA
// =====================================================

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Parola curentă este necesară'),
  newPassword: z
    .string()
    .min(8, 'Parola nouă trebuie să aibă cel puțin 8 caractere')
    .max(100, 'Parola este prea lungă')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Parola trebuie să conțină cel puțin o literă mică, o literă mare și o cifră'
    ),
  confirmNewPassword: z
    .string()
    .min(1, 'Confirmarea parolei este necesară'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Parolele nu se potrivesc',
  path: ['confirmNewPassword'],
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
