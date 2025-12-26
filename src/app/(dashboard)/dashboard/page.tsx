import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

/**
 * Dashboard Root - Redirects to role-specific dashboard
 *
 * This page catches /dashboard requests and redirects to:
 * - /dashboard/customer for customers
 * - /dashboard/installer for installers
 */
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Redirect to role-specific dashboard
  const role = session.user.role;
  redirect(`/dashboard/${role}`);
}
