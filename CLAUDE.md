# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Cine-Repara** is an open marketplace connecting customers with trusted local installers in Romania. Built with Next.js 16.1, React 19, TypeScript 5 (strict mode), and Tailwind CSS v4, using PostgreSQL (Vercel Postgres) and NextAuth.js v5 for authentication.

## Development Commands

### Running the Application
```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Database Setup
Before running the app, set up your Vercel Postgres database:
1. Create a Vercel Postgres database in your Vercel dashboard
2. Copy `.env.example` to `.env.local` and fill in database credentials
3. Run migrations (see Database section below)

### Package Management
This project uses npm. Dependencies include:
- `@vercel/postgres` - Database client
- `next-auth@beta` - Authentication (v5)
- `bcryptjs` - Password hashing
- `zod` - Validation
- `@tanstack/react-query` - State management and data fetching
- `react-hot-toast` - Toast notifications

## Architecture

### Directory Structure
- `src/app/` - Next.js App Router pages and layouts
  - `(auth)/` - Authentication routes (login, register)
  - `(dashboard)/` - Protected dashboard routes
  - `(public)/` - Public routes (browse, installer profiles)
  - `api/` - API routes
    - `auth/[...nextauth]/` - NextAuth.js endpoints
    - `installer/` - Installer CRUD operations
    - `reviews/` - Review operations
    - `services/` - Service categories
    - `locations/` - Regions and cities
  - `layout.tsx` - Root layout with Geist font and Providers
  - `page.tsx` - Home page component
  - `error.tsx` - Global error page
  - `not-found.tsx` - 404 page
  - `sitemap.ts` - Dynamic sitemap generation
  - `robots.ts` - Robots.txt configuration
  - `globals.css` - Global styles with Tailwind and CSS variables
- `src/lib/` - Shared libraries
  - `db/` - Database client and migrations
    - `migrations/` - SQL migration files
    - `index.ts` - Database client
    - `schema.ts` - TypeScript types
  - `auth/` - NextAuth.js configuration
  - `validations/` - Zod validation schemas
  - `actions/` - Server actions
  - `utils/` - Utility functions (Romanian formatting, etc.)
- `src/components/` - React components
  - `ui/` - Base UI components (Button, Input, Card, Skeleton, etc.)
  - `installer/` - Installer-specific components
  - `review/` - Review components
  - `search/` - Search components
  - `providers/` - Context providers (React Query, Toaster)
  - `ErrorBoundary.tsx` - Error boundary component
- `src/types/` - TypeScript type definitions
- `public/` - Static assets served from root
- `middleware.ts` - NextAuth.js middleware for route protection

### Key Configurations

**TypeScript:**
- Path alias: `@/*` maps to `./src/*` (use for all imports from src)
- Strict mode enabled
- Target: ES2017

**Next.js:**
- React Compiler enabled (`reactCompiler: true` in next.config.ts)
- Uses App Router (not Pages Router)
- Server Components by default (add `"use client"` directive for client components)

**Styling:**
- Tailwind CSS v4 with PostCSS integration
- CSS variables in `globals.css` for theming:
  - `--background`, `--foreground` for light/dark modes
  - Dark mode uses `prefers-color-scheme: dark` media query
- Geist Sans (default) and Geist Mono (code) fonts via `next/font/google`

**ESLint:**
- Flat config format (ESLint v9)
- Extends: `next/core-web-vitals`, `next/typescript`
- Auto-ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Database

### Schema
The database includes tables for:
- `users` - Both customers and installers (role-based)
- `installer_profiles` - Extended installer information
- `service_categories` - Romanian service categories (hierarchical)
- `regions` and `cities` - Romanian locations (41 counties + cities)
- `installer_services` - Installer-to-service many-to-many
- `installer_service_areas` - Installer-to-city many-to-many
- `reviews` - Customer reviews with ratings
- `review_images`, `portfolio_images` - Image storage
- NextAuth.js tables: `sessions`, `accounts`, `verification_tokens`

### Running Migrations
Migrations are in `src/lib/db/migrations/`:
1. `001_initial_schema.sql` - All tables, indexes, views
2. `002_seed_categories.sql` - Romanian service categories
3. `003_seed_locations.sql` - Romanian regions and cities

To run migrations, execute the SQL files in order against your Vercel Postgres database.

## Authentication

### NextAuth.js v5 (Auth.js)
- Configuration: `src/lib/auth/auth.config.ts`
- Credentials provider with email/password
- Role-based access control (customer/installer)
- JWT strategy for sessions
- Route protection via middleware

### Usage
```typescript
// In Server Components
import { auth } from '@/lib/auth';
const session = await auth();

// Check role
if (session?.user.role === 'installer') {
  // Installer-specific logic
}
```

### Protected Routes
- `/dashboard/*` - Requires authentication
- Middleware redirects unauthenticated users to `/login`
- Authenticated users redirected from `/login` to their dashboard

## Validation

All forms use Zod schemas in `src/lib/validations/`:
- `auth.ts` - Login, register, password reset
- Type-safe validation on client and server
- Romanian error messages

## Key Technical Decisions

1. **Database**: PostgreSQL via Vercel Postgres (relational data, ACID compliance)
2. **Auth**: NextAuth.js v5 (industry standard, role-based)
3. **Validation**: Zod (type-safe, reusable)
4. **State Management**: React Query (@tanstack/react-query) for caching and data fetching
5. **Localization**: Romanian formatting utilities (ro-RO locale, RON currency, phone numbers)
6. **File Storage**: Vercel Blob (for image uploads - schema ready)
7. **Notifications**: React Hot Toast (user feedback)
8. **SEO**: Dynamic sitemap, robots.txt, Open Graph metadata

## Project Status

**ALL 6 PHASES COMPLETE** ✅ - Production Ready! (Completed: December 26, 2024)

**Phase 1 (Foundation & Authentication)**: ✅ COMPLETE
- ✅ Database schema created (13 tables, indexes, views)
- ✅ Romanian service categories and locations seeded
- ✅ NextAuth.js configured with role-based access
- ✅ Validation schemas created
- ✅ Middleware for route protection
- ✅ UI components (Button, Input, Label, Card)
- ✅ Login page with form validation
- ✅ Registration pages (customer and installer)
- ✅ Dashboard layouts for both user types
- ✅ Homepage with call-to-action

**Phase 2 (Installer Profiles & Services)**: ✅ COMPLETE
- ✅ Installer validation schemas (profile, services, locations)
- ✅ API routes for services, regions, cities
- ✅ Image upload API with Vercel Blob
- ✅ Installer GET/PATCH API routes
- ✅ Additional UI components (Select, Checkbox, Textarea)
- ✅ Multi-step profile wizard (4 steps)
- ✅ Service selection with hierarchical categories
- ✅ Location selection with region filtering
- ✅ Profile review and submission

**Phase 3 (Search & Discovery)**: ✅ COMPLETE
- ✅ Advanced search with 7 filters
- ✅ Public installer profiles (SEO-friendly URLs)
- ✅ Service category browsing
- ✅ Pagination and sorting
- ✅ Installer cards with ratings
- ✅ Location-based search
- ✅ Rating and price filters

**Phase 4 (Reviews & Ratings)**: ✅ COMPLETE
- ✅ 5-star rating system
- ✅ Detailed reviews with titles and comments
- ✅ Review photos (schema ready)
- ✅ Rating distribution statistics
- ✅ One review per customer per installer
- ✅ Review form validation
- ✅ Review display on installer profiles

**Phase 5 (Romanian Localization)**: ✅ COMPLETE
- ✅ Comprehensive formatting utilities
- ✅ Date/time formatting (ro-RO locale)
- ✅ Currency formatting (RON)
- ✅ Proper pluralization rules
- ✅ Phone number formatting
- ✅ Romanian error messages throughout

**Phase 6 (Polish & Optimization)**: ✅ COMPLETE
- ✅ React Query for state management
- ✅ Toast notifications (React Hot Toast)
- ✅ Loading skeletons
- ✅ Error boundaries and pages (404, 500)
- ✅ Dynamic sitemap and robots.txt
- ✅ SEO metadata optimization
- ✅ Next.js 16 compatibility
- ✅ Production-ready optimizations

**Project Statistics**:
- **Total Files**: ~85 files
- **Total Lines of Code**: ~8,500 LOC
- **Total Phases**: 6/6 (100% complete)
- **Status**: Production Ready 🚀

**Documentation**:
- [Complete Project Summary](./PROJECT_COMPLETE.md)
- [Phase 1 Details](./IMPLEMENTATION_SUMMARY.md)
- [Phase 2 Details](./PHASE2_SUMMARY.md)
- [Phase 3 Details](./PHASE3_SUMMARY.md)
- [Phase 4 Details](./PHASE4_SUMMARY.md)
- [Phase 5 Details](./PHASE5_SUMMARY.md)
- [Phase 6 Details](./PHASE6_SUMMARY.md)

## Testing

### Running Tests
```bash
npm test              # Run tests in watch mode
npm run test:ui       # Run tests with UI dashboard
npm run test:coverage # Generate coverage report
```

### Test Framework
This project uses **Vitest** with **React Testing Library** for comprehensive testing:
- **Vitest** - Fast unit test framework with native ESM support
- **React Testing Library** - Component testing with user-centric approach
- **@testing-library/jest-dom** - Custom DOM matchers
- **jsdom** - DOM environment for tests

### Test Structure
- **Unit tests**: `*.test.ts` / `*.test.tsx` files next to source files
- **Coverage target**: 70%+ for critical code
- **Test files**: 3 test suites with 69 tests currently passing

### Example Tests
See comprehensive test examples in:
- `src/components/ui/Button.test.tsx` - UI component tests (15 tests)
- `src/lib/validations/auth.test.ts` - Validation schema tests (17 tests)
- `src/lib/utils/format.test.ts` - Romanian formatting tests (37 tests)

### Writing New Tests
```typescript
// Component test example
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Test Coverage
Run `npm run test:coverage` to generate a detailed coverage report in the `coverage/` directory.
