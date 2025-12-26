import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { sql } from '@/lib/db';
import type { User } from '@/lib/db/schema';

/**
 * NextAuth.js v5 Configuration
 *
 * Provides authentication with:
 * - Email/password credentials
 * - Role-based access (customer/installer)
 * - Database sessions
 */

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    newUser: '/register',
  },

  callbacks: {
    /**
     * Control page access based on authentication status
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isOnAuth) {
        if (isLoggedIn) {
          // Redirect authenticated users to their dashboard
          const role = auth.user.role;
          return Response.redirect(new URL(`/dashboard/${role}`, nextUrl));
        }
        return true;
      }
      return true;
    },

    /**
     * Add custom fields to JWT token
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    /**
     * Add custom fields to session
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'customer' | 'installer';
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email și parola sunt necesare');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Query user from database
        const result = await sql<User>`
          SELECT id, email, password_hash, name, role, phone, avatar_url, email_verified
          FROM users
          WHERE email = ${email}
        `;

        const user = result.rows[0];

        if (!user) {
          throw new Error('Email sau parolă incorectă');
        }

        // Verify password
        const isPasswordValid = await compare(password, user.password_hash);

        if (!isPasswordValid) {
          throw new Error('Email sau parolă incorectă');
        }

        // Check if email is verified (optional, can be removed for MVP)
        // if (!user.email_verified) {
        //   throw new Error('Vă rugăm să vă verificați emailul');
        // }

        // Return user object (without password_hash)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar_url,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
