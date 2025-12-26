import { type DefaultSession } from 'next-auth';
import { type UserRole } from '@/lib/db/schema';

/**
 * Extend NextAuth types to include custom user fields
 */

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      email: string;
      name: string;
      image?: string | null;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: UserRole;
    email: string;
    name: string;
    image?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    email: string;
    name: string;
  }
}
