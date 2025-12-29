'use server';

import { hash } from 'bcryptjs';
import { sql } from '@/lib/db';
import { registerSchema, type RegisterInput } from '@/lib/validations/auth';
import { redirect } from 'next/navigation';
import { signIn } from '@/lib/auth';
import type { UserRole } from '@/lib/db/schema';
import { checkRateLimit, getResetTime } from '@/lib/auth/ratelimit';

/**
 * Server action to register a new user
 * Creates user and installer_profile if role is installer
 */
export async function registerUser(data: RegisterInput) {
  try {
    // Validate input
    const validatedData = registerSchema.parse(data);

    // Rate limiting: Prevent registration spam and automated account creation
    // Check before database queries to minimize resources used by attackers
    const isAllowed = checkRateLimit(
      `register_${validatedData.email}`,
      5,
      15 * 60 * 1000
    ); // 5 attempts per 15 minutes

    if (!isAllowed) {
      const resetTime = getResetTime(`register_${validatedData.email}`);
      const minutesRemaining = resetTime ? Math.ceil(resetTime / 60000) : 15;

      return {
        error: `Prea multe încercări de înregistrare. Vă rugăm să încercați din nou în ${minutesRemaining} minute.`,
      };
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${validatedData.email}
    `;

    if (existingUser.rows.length > 0) {
      return {
        error: 'Un utilizator cu acest email există deja',
      };
    }

    // Hash password
    const passwordHash = await hash(validatedData.password, 10);

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, name, role, phone)
      VALUES (
        ${validatedData.email},
        ${passwordHash},
        ${validatedData.name},
        ${validatedData.role},
        ${validatedData.phone || null}
      )
      RETURNING id, email, name, role
    `;

    const user = result.rows[0];

    // If installer, create installer_profile
    if (validatedData.role === 'installer') {
      await sql`
        INSERT INTO installer_profiles (user_id, profile_completed)
        VALUES (${user.id}, false)
      `;
    }

    // Auto sign-in after registration
    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);

    if (error instanceof Error) {
      return {
        error: error.message,
      };
    }

    return {
      error: 'A apărut o eroare la înregistrare. Vă rugăm să încercați din nou.',
    };
  }
}
