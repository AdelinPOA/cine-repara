'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

type Step = 'business' | 'services' | 'locations' | 'complete';

interface ServiceCategory {
  id: number;
  name_ro: string;
  name_en: string | null;
  slug: string;
  icon: string | null;
  parent_id: number | null;
  subcategories?: ServiceCategory[];
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
  region_name?: string;
}

export default function InstallerProfileWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>('business');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form data
  const [formData, setFormData] = useState({
    business_name: '',
    bio: '',
    years_experience: '',
    is_available: true,
    service_category_ids: [] as number[],
    primary_service_id: null as number | null,
    city_ids: [] as number[],
  });

  // Data from APIs
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);

  // Load service categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch('/api/services');
        const data = await response.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }
    loadCategories();
  }, []);

  // Load regions
  useEffect(() => {
    async function loadRegions() {
      try {
        const response = await fetch('/api/locations/regions');
        const data = await response.json();
        if (data.success) {
          setRegions(data.data);
        }
      } catch (error) {
        console.error('Failed to load regions:', error);
      }
    }
    loadRegions();
  }, []);

  // Load cities when region changes
  useEffect(() => {
    async function loadCities() {
      try {
        const url = selectedRegion
          ? `/api/locations/cities?region_id=${selectedRegion}`
          : '/api/locations/cities';
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          setCities(data.data);
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
      }
    }
    if (currentStep === 'locations') {
      loadCities();
    }
  }, [selectedRegion, currentStep]);

  const handleNext = () => {
    setErrors({});

    if (currentStep === 'business') {
      // Validate business info
      if (!formData.business_name) {
        setErrors({ business_name: 'Numele firmei este necesar' });
        return;
      }
      setCurrentStep('services');
    } else if (currentStep === 'services') {
      // Validate services
      if (formData.service_category_ids.length === 0) {
        setErrors({ services: 'Selectați cel puțin un serviciu' });
        return;
      }
      setCurrentStep('locations');
    } else if (currentStep === 'locations') {
      // Validate locations
      if (formData.city_ids.length === 0) {
        setErrors({ cities: 'Selectați cel puțin un oraș' });
        return;
      }
      setCurrentStep('complete');
    }
  };

  const handleBack = () => {
    if (currentStep === 'services') {
      setCurrentStep('business');
    } else if (currentStep === 'locations') {
      setCurrentStep('services');
    } else if (currentStep === 'complete') {
      setCurrentStep('locations');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Get current user's installer profile ID from session
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();

      if (!sessionData?.user?.id) {
        throw new Error('Not authenticated');
      }

      // Get installer profile ID
      const response = await fetch(`/api/installers/${sessionData.user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch installer profile');
      }

      const installerData = await response.json();
      const installerId = installerData.data?.id;

      if (!installerId) {
        throw new Error('Installer profile not found');
      }

      // Update profile
      const updateResponse = await fetch(`/api/installers/${installerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: formData.business_name,
          bio: formData.bio,
          years_experience: formData.years_experience ? parseInt(formData.years_experience) : null,
          is_available: formData.is_available,
          service_category_ids: formData.service_category_ids,
          primary_service_id: formData.primary_service_id,
          city_ids: formData.city_ids,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile');
      }

      // Success! Redirect to completed profile view
      router.push('/dashboard/installer');
      router.refresh();
    } catch (error: any) {
      console.error('Error submitting profile:', error);
      setErrors({ submit: error.message || 'A apărut o eroare' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceToggle = (categoryId: number) => {
    setFormData(prev => {
      const isSelected = prev.service_category_ids.includes(categoryId);
      const newIds = isSelected
        ? prev.service_category_ids.filter(id => id !== categoryId)
        : [...prev.service_category_ids, categoryId];

      // Clear primary if it's being deselected
      const newPrimary = isSelected && prev.primary_service_id === categoryId
        ? null
        : prev.primary_service_id;

      return {
        ...prev,
        service_category_ids: newIds,
        primary_service_id: newPrimary,
      };
    });
  };

  const handleCityToggle = (cityId: number) => {
    setFormData(prev => {
      const isSelected = prev.city_ids.includes(cityId);
      const newIds = isSelected
        ? prev.city_ids.filter(id => id !== cityId)
        : [...prev.city_ids, cityId];

      return { ...prev, city_ids: newIds };
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { key: 'business', label: 'Informații' },
            { key: 'services', label: 'Servicii' },
            { key: 'locations', label: 'Zone' },
            { key: 'complete', label: 'Finalizare' },
          ].map((step, index) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step.key
                      ? 'bg-blue-600 text-white'
                      : ['business', 'services', 'locations', 'complete'].indexOf(currentStep) >
                        ['business', 'services', 'locations', 'complete'].indexOf(step.key)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {['business', 'services', 'locations', 'complete'].indexOf(currentStep) >
                  ['business', 'services', 'locations', 'complete'].indexOf(step.key) ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs mt-2 text-center">{step.label}</span>
              </div>
              {index < 3 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    ['business', 'services', 'locations', 'complete'].indexOf(currentStep) > index
                      ? 'bg-green-600'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step: Business Info */}
      {currentStep === 'business' && (
        <Card>
          <CardHeader>
            <CardTitle>Informații despre afacere</CardTitle>
            <CardDescription>
              Furnizați detalii despre afacerea și experiența dumneavoastră
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="business_name" required>
                Numele firmei
              </Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                placeholder="ex: Instalații Termice SRL"
                error={errors.business_name}
              />
            </div>

            <div>
              <Label htmlFor="bio">Descriere</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Prezentați-vă experiența și serviciile oferite..."
                rows={4}
                error={errors.bio}
              />
              <p className="mt-1 text-xs text-gray-500">
                Maximum 1000 caractere
              </p>
            </div>

            <div>
              <Label htmlFor="years_experience">Ani de experiență</Label>
              <Input
                id="years_experience"
                type="number"
                min="0"
                max="70"
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
                placeholder="ex: 10"
                error={errors.years_experience}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleNext}>
              Continuă
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step: Services */}
      {currentStep === 'services' && (
        <Card>
          <CardHeader>
            <CardTitle>Servicii oferite</CardTitle>
            <CardDescription>
              Selectați serviciile pe care le oferiți clienților
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.services && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                {errors.services}
              </div>
            )}

            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={formData.service_category_ids.includes(category.id)}
                    onChange={() => handleServiceToggle(category.id)}
                    label={category.name_ro}
                  />

                  {/* Subcategories */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className="ml-7 mt-2 space-y-2">
                      {category.subcategories.map((sub) => (
                        <Checkbox
                          key={sub.id}
                          id={`category-${sub.id}`}
                          checked={formData.service_category_ids.includes(sub.id)}
                          onChange={() => handleServiceToggle(sub.id)}
                          label={sub.name_ro}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {formData.service_category_ids.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <Label htmlFor="primary_service">Serviciu principal (opțional)</Label>
                <Select
                  id="primary_service"
                  value={formData.primary_service_id || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      primary_service_id: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                >
                  <option value="">Niciun serviciu principal</option>
                  {formData.service_category_ids.map((id) => {
                    const category = categories
                      .flatMap((c) => [c, ...(c.subcategories || [])])
                      .find((c) => c.id === id);
                    return category ? (
                      <option key={id} value={id}>
                        {category.name_ro}
                      </option>
                    ) : null;
                  })}
                </Select>
                <p className="mt-1 text-xs text-gray-500">
                  Serviciul principal va fi evidențiat în profilul dumneavoastră
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Înapoi
            </Button>
            <Button onClick={handleNext}>
              Continuă
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step: Locations */}
      {currentStep === 'locations' && (
        <Card>
          <CardHeader>
            <CardTitle>Zone de acoperire</CardTitle>
            <CardDescription>
              Selectați orașele în care oferiți servicii
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.cities && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                {errors.cities}
              </div>
            )}

            <div>
              <Label htmlFor="region_filter">Filtrează după județ</Label>
              <Select
                id="region_filter"
                value={selectedRegion || ''}
                onChange={(e) => setSelectedRegion(e.target.value ? parseInt(e.target.value) : null)}
              >
                <option value="">Toate județele</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
              <div className="space-y-2">
                {cities.map((city) => (
                  <Checkbox
                    key={city.id}
                    id={`city-${city.id}`}
                    checked={formData.city_ids.includes(city.id)}
                    onChange={() => handleCityToggle(city.id)}
                    label={`${city.name}${city.region_name ? ` (${city.region_name})` : ''}`}
                  />
                ))}
              </div>
            </div>

            {formData.city_ids.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>{formData.city_ids.length}</strong> orașe selectate
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Înapoi
            </Button>
            <Button onClick={handleNext}>
              Continuă
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Step: Complete */}
      {currentStep === 'complete' && (
        <Card>
          <CardHeader>
            <CardTitle>Revizuire și finalizare</CardTitle>
            <CardDescription>
              Verificați informațiile înainte de a finaliza profilul
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errors.submit && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                {errors.submit}
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Informații despre afacere</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Nume firmă:</dt>
                  <dd className="font-medium">{formData.business_name}</dd>
                </div>
                {formData.years_experience && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Experiență:</dt>
                    <dd className="font-medium">{formData.years_experience} ani</dd>
                  </div>
                )}
              </dl>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Servicii oferite</h3>
              <div className="flex flex-wrap gap-2">
                {formData.service_category_ids.map((id) => {
                  const category = categories
                    .flatMap((c) => [c, ...(c.subcategories || [])])
                    .find((c) => c.id === id);
                  return category ? (
                    <span
                      key={id}
                      className={`px-3 py-1 rounded-full text-sm ${
                        id === formData.primary_service_id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {category.name_ro}
                      {id === formData.primary_service_id && ' ⭐'}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Zone de acoperire</h3>
              <p className="text-sm text-gray-600">
                {formData.city_ids.length} orașe selectate
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Înapoi
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              Finalizează profilul
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
