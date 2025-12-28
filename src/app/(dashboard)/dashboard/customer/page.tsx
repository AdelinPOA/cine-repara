import { auth } from '@/lib/auth';
import { QuickSearchCard } from '@/components/customer/QuickSearchCard';
import { CustomerReviewsList } from '@/components/customer/CustomerReviewsList';
import { FavoritesList } from '@/components/customer/FavoritesList';
import { SearchHistoryList } from '@/components/customer/SearchHistoryList';

export default async function CustomerDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Bine ați venit, {session.user.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Dashboard-ul dumneavoastră de client
        </p>
      </div>

      {/* Quick Search Card - Full Width */}
      <QuickSearchCard />

      {/* Two-column layout - Reviews and Favorites */}
      <div className="grid lg:grid-cols-2 gap-6">
        <CustomerReviewsList customerId={session.user.id} limit={10} />
        <FavoritesList customerId={session.user.id} limit={10} />
      </div>

      {/* Search History - Full Width */}
      <SearchHistoryList customerId={session.user.id} limit={10} />
    </div>
  );
}
