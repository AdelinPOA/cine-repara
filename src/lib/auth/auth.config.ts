import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { sql } from '@/lib/db';
import type { User } from '@/lib/db/schema';
import { checkRateLimit, getResetTime } from '@/lib/auth/ratelimit';

/**
 * Environment Variable Validation
 * CRITICAL: Validates required secrets before authentication initialization
 */
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const NEXTAUTH_URL = process.env.NEXTAUTH_URL;

// Validate NEXTAUTH_SECRET
if (!NEXTAUTH_SECRET) {
  throw new Error(
    'NEXTAUTH_SECRET environment variable is required. ' +
      'Generate with: openssl rand -base64 32'
  );
}

if (NEXTAUTH_SECRET.length < 32) {
  throw new Error(
    `NEXTAUTH_SECRET must be at least 32 characters long for security. ` +
      `Current length: ${NEXTAUTH_SECRET.length}. ` +
      'Generate a new secret with: openssl rand -base64 32'
  );
}

// Validate NEXTAUTH_URL (optional in development, required in production)
if (NEXTAUTH_URL && !NEXTAUTH_URL.match(/^https?:\/\/.+/)) {
  throw new Error(
    'NEXTAUTH_URL must be a valid URL starting with http:// or https://'
  );
}

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

        // Rate limiting: Prevent brute force attacks
        // Check before database query and password verification to minimize resources used by attackers
        const isAllowed = checkRateLimit(email, 5, 15 * 60 * 1000); // 5 attempts per 15 minutes

        if (!isAllowed) {
          const resetTime = getResetTime(email);
          const minutesRemaining = resetTime
            ? Math.ceil(resetTime / 60000)
            : 15;

          throw new Error(
            `Prea multe încercări eșuate. Vă rugăm să încercați din nou în ${minutesRemaining} minute.`
          );
        }

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

        // Check if email is verified
        // Security: Prevents accounts with unverified emails from being used
        // GDPR Compliance: Ensures valid consent through verified email
        if (!user.email_verified) {
          throw new Error(
            'Vă rugăm să vă verificați emailul înainte de autentificare. ' +
              'Verificați inbox-ul pentru linkul de confirmare.'
          );
        }

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

  secret: NEXTAUTH_SECRET, // Validated constant from environment check above
};
