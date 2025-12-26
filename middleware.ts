import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/auth.config';

/**
 * NextAuth.js Middleware
 *
 * Protects routes and handles authentication:
 * - Redirects unauthenticated users from /dashboard to /login
 * - Redirects authenticated users from /login to their dashboard
 * - Role-based access control
 */

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
