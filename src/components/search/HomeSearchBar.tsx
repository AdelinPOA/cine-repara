'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface ServiceCategory {
  id: number;
  name_ro: string;
  slug: string;
}

interface Region {
  id: number;
  name: string;
  code: string;
}

export function HomeSearchBar() {
  const router = useRouter();

  const [serviceId, setServiceId] = useState('');
  const [regionId, setRegionId] = useState('');
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load services and regions on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, regionsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/locations/regions'),
        ]);

        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          setServices(servicesData.data || []);
        }

        if (regionsRes.ok) {
          const regionsData = await regionsRes.json();
          setRegions(regionsData.data || []);
        }
      } catch (error) {
        console.error('Error loading search data:', error);
      }
    };

    loadData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const params = new URLSearchParams();
    if (serviceId) params.set('service_id', serviceId);
    if (regionId) params.set('region_id', regionId);

    router.push(`/instalatori?${params.toString()}`);
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Service Filter */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
            Ce serviciu cauți?
          </label>
          <Select
            id="service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            <option value="">Toate serviciile</option>
            {services
              .filter((s) => !s.slug.includes('/'))
              .map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name_ro}
                </option>
              ))}
          </Select>
        </div>

        {/* Region Filter */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-2">
            În ce județ?
          </label>
          <Select id="region" value={regionId} onChange={(e) => setRegionId(e.target.value)}>
            <option value="">Toate județele</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
            Caută instalatori
          </Button>
        </div>
      </div>
    </form>
  );
}
