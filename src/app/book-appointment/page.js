'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

function BookAppointmentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    serviceType: searchParams.get('service') || '',
    description: '',
    date: '',
    time: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [availableSlots, setAvailableSlots] = useState({});

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/book-appointment');
      return;
    }
  }, [status, router]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/products', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (!res.ok) throw new Error('Hizmetler yüklenemedi');
        const data = await res.json();
        const serviceProducts = data.filter(product => product.category === 'servis');
        setServices(serviceProducts);
        
        const urlService = searchParams.get('service');
        if (urlService && serviceProducts.some(service => service.name === urlService)) {
          setFormData(prev => ({ ...prev, serviceType: urlService }));
        }
      } catch (err) {
        console.error('Hizmetler yüklenirken hata:', err);
      }
    };

    fetchServices();
  }, [searchParams]);

  // Seçilen tarihteki randevuları kontrol et
  useEffect(() => {
    const checkAvailability = async () => {
      if (!formData.date) return;

      try {
        const res = await fetch(`/api/appointments/availability?date=${formData.date}`);
        const data = await res.json();
        setAvailableSlots(data);
      } catch (err) {
        console.error('Müsaitlik kontrolü yapılırken hata:', err);
      }
    };

    checkAvailability();
  }, [formData.date]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError(''); // Her değişiklikte hata mesajını temizle
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Randevu oluşturulamadı.');
      }
      
      setSuccess('Randevunuz başarıyla oluşturuldu!');
      setFormData({ serviceType: '', description: '', date: '', time: '', phone: '', address: '' });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'unauthenticated') {
    return null; // useEffect zaten yönlendirme yapacak
  }

  // Saatleri oluştur
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Teknik Servis Randevusu
            </h2>
            
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                  Servis Tipi
                </label>
                <select
                  id="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Seçiniz...</option>
                  {services.map(service => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  İsteğe Bağlı
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Varsa özel notlarınızı buraya yazabilirsiniz..."
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon Numaranız
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresiniz
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Randevu Tarihi
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                    Randevu Saati
                  </label>
                  <select
                    id="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Seçiniz...</option>
                    {timeSlots.map(time => {
                      const slotCount = availableSlots[time] || 0;
                      const isAvailable = slotCount < 2;
                      return (
                        <option
                          key={time}
                          value={time}
                          disabled={!isAvailable}
                          className={!isAvailable ? 'text-gray-400' : ''}
                        >
                          {time} {!isAvailable ? '(Dolu)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Gönderiliyor...
                    </span>
                  ) : (
                    'Randevu Oluştur'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Yükleniyor...
            </h2>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BookAppointmentForm />
    </Suspense>
  );
} 