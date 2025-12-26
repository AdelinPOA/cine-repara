import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from './auth';

describe('Auth Validation Schemas', () => {
  describe('loginSchema', () => {
    it('validates correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('rejects missing email', () => {
      const invalidData = {
        password: 'Password123',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects missing password', () => {
      const invalidData = {
        email: 'test@example.com',
      };
      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts any non-empty password', () => {
      const validData = {
        email: 'test@example.com',
        password: '123',
      };
      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: 'customer' as const,
        phone: '0712345678',
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects when passwords do not match', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword123',
        role: 'customer' as const,
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('confirmPassword');
        expect(result.error.issues[0].message).toContain('nu se potrivesc');
      }
    });

    it('rejects weak password (no uppercase)', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'customer' as const,
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('password');
      }
    });

    it('rejects weak password (no lowercase)', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'PASSWORD123',
        confirmPassword: 'PASSWORD123',
        role: 'customer' as const,
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects weak password (no digit)', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'PasswordABC',
        confirmPassword: 'PasswordABC',
        role: 'customer' as const,
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts valid Romanian phone number', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: 'customer' as const,
        phone: '0712345678',
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts valid Romanian phone number with country code (+4)', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: 'customer' as const,
        phone: '+4712345678',
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid phone number format', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: 'customer' as const,
        phone: '123456',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts empty string for optional phone', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: 'customer' as const,
        phone: '',
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates role as customer', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: 'customer' as const,
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates role as installer', () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: 'installer' as const,
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid role', () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        role: 'admin',
      };
      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
