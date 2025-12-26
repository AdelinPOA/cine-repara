import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function InstallerDashboardPage() {
  const session = await auth();

  if (session?.user.role !== 'installer') {
    redirect('/dashboard/customer');
  }

  // Redirect to profile completion page
  redirect('/dashboard/installer/profile');
}
