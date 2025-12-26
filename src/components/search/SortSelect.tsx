'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'rating';

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    params.set('page', '1'); // Reset to page 1 on sort change
    router.push(`/instalatori?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-gray-600">
        Sortează:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="rating">Rating (descrescător)</option>
        <option value="price_asc">Preț (crescător)</option>
        <option value="price_desc">Preț (descrescător)</option>
        <option value="reviews">Recenzii (descrescător)</option>
      </select>
    </div>
  );
}
