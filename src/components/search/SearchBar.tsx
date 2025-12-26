'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
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

interface City {
  id: number;
  name: string;
  region_id: number;
}

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [serviceId, setServiceId] = useState(searchParams.get('service_id') || '');
  const [regionId, setRegionId] = useState(searchParams.get('region_id') || '');
  const [cityId, setCityId] = useState(searchParams.get('city_id') || '');

  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
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

  // Load cities when region changes
  useEffect(() => {
    const loadCities = async () => {
      if (!regionId) {
        setCities([]);
        setCityId('');
        return;
      }

      try {
        const response = await fetch(`/api/locations/cities?region_id=${regionId}`);
        if (response.ok) {
          const data = await response.json();
          setCities(data.data || []);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    };

    loadCities();
  }, [regionId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (serviceId) params.set('service_id', serviceId);
    if (cityId) params.set('city_id', cityId);
    if (regionId && !cityId) params.set('region_id', regionId);

    router.push(`/instalatori?${params.toString()}`);
    setIsLoading(false);
  };

  const handleReset = () => {
    setSearch('');
    setServiceId('');
    setRegionId('');
    setCityId('');
    router.push('/instalatori');
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Search Input */}
        <div>
          <Input
            type="text"
            placeholder="Caută instalator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Service Filter */}
        <div>
          <Select
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
          <Select
            value={regionId}
            onChange={(e) => {
              setRegionId(e.target.value);
              setCityId('');
            }}
          >
            <option value="">Toate județele</option>
            {regions.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </Select>
        </div>

        {/* City Filter */}
        <div>
          <Select
            value={cityId}
            onChange={(e) => setCityId(e.target.value)}
            disabled={!regionId}
          >
            <option value="">
              {regionId ? 'Toate orașele' : 'Selectează județul'}
            </option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" isLoading={isLoading}>
          Caută
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Resetează
        </Button>
      </div>
    </form>
  );
}
