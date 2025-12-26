import { handlers } from '@/lib/auth';

/**
 * NextAuth.js v5 Route Handlers
 *
 * Handles all authentication routes:
 * - GET  /api/auth/session
 * - POST /api/auth/signin
 * - POST /api/auth/signout
 * - GET  /api/auth/csrf
 * - etc.
 */

export const { GET, POST } = handlers;
