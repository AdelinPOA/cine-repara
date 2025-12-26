import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

/**
 * NextAuth.js v5 helpers
 *
 * Usage in Server Components:
 * const session = await auth();
 *
 * Usage in API Routes:
 * export const { GET, POST } = handlers;
 */

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
