'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RatingInput } from './RatingInput';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface ReviewFormProps {
  installerId: string;
  installerName: string;
  onSuccess?: () => void;
}

export function ReviewForm({ installerId, installerName, onSuccess }: ReviewFormProps) {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: '',
    service_category_id: '',
    work_completed_at: '',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    // Load services offered by this installer
    const fetchServices = async () => {
      try {
        const response = await fetch(`/api/installers/${installerId}`);
        if (response.ok) {
          const data = await response.json();
          setServices(data.data.services || []);
        }
      } catch (err) {
        console.error('Error loading services:', err);
      }
    };

    fetchServices();
  }, [installerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setErrors({});

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          installer_profile_id: installerId,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
          service_category_id: parseInt(formData.service_category_id),
          work_completed_at: formData.work_completed_at || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details) {
          // Validation errors
          const newErrors: any = {};
          data.details.forEach((err: any) => {
            newErrors[err.path[0]] = err.message;
          });
          setErrors(newErrors);
        } else {
          setError(data.error || 'Eroare la trimiterea recenziei');
        }
        return;
      }

      // Success
      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
      }

      // Reset form
      setFormData({
        rating: 0,
        title: '',
        comment: '',
        service_category_id: '',
        work_completed_at: '',
      });
    } catch (err) {
      setError('Eroare de rețea. Vă rugăm să încercați din nou.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lasă o recenzie pentru {installerName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <RatingInput
              value={formData.rating}
              onChange={(rating) => setFormData({ ...formData, rating })}
              error={errors.rating}
              disabled={isLoading}
            />
          </div>

          {/* Service */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
              Serviciu prestat <span className="text-red-500">*</span>
            </label>
            <Select
              id="service"
              value={formData.service_category_id}
              onChange={(e) =>
                setFormData({ ...formData, service_category_id: e.target.value })
              }
              disabled={isLoading}
              error={errors.service_category_id}
            >
              <option value="">Selectează serviciul</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name_ro}
                </option>
              ))}
            </Select>
            {errors.service_category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.service_category_id}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Titlu <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Rezumați experiența dumneavoastră"
              disabled={isLoading}
              error={errors.title}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Comment */}
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Comentariu <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Descrieți în detaliu experiența dumneavoastră cu acest instalator..."
              rows={6}
              disabled={isLoading}
              error={errors.comment}
            />
            {errors.comment && <p className="mt-1 text-sm text-red-600">{errors.comment}</p>}
            <p className="mt-1 text-sm text-gray-500">
              {formData.comment.length} / 2000 caractere
            </p>
          </div>

          {/* Work Completion Date */}
          <div>
            <label
              htmlFor="work_completed_at"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Data finalizării lucrării (opțional)
            </label>
            <Input
              id="work_completed_at"
              type="date"
              value={formData.work_completed_at}
              onChange={(e) =>
                setFormData({ ...formData, work_completed_at: e.target.value })
              }
              disabled={isLoading}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Trimite recenzia
            </Button>
            <p className="text-sm text-gray-500">
              Recenzia dumneavoastră va fi publică și va ajuta alți utilizatori.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
