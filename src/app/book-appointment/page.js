'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function BookAppointmentForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

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
        if (res.status === 401) {
          router.push('/login?redirect=/book-appointment');
          return;
        }
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

  // Saatleri oluştur
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00'
  ];

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Teknik Servis Randevusu Al</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="serviceType" className="form-label">Servis Tipi</label>
                  <select className="form-select" id="serviceType" value={formData.serviceType} onChange={handleChange} required>
                    <option value="">Seçiniz...</option>
                    {services.map(service => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Sorun Açıklaması</label>
                  <textarea className="form-control" id="description" rows={3} value={formData.description} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Telefon Numaranız</label>
                  <input type="tel" className="form-control" id="phone" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Adresiniz</label>
                  <textarea className="form-control" id="address" rows={3} value={formData.address} onChange={handleChange} required></textarea>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="date" className="form-label">Randevu Tarihi</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="date" 
                      value={formData.date} 
                      onChange={handleChange} 
                      min={new Date().toISOString().split('T')[0]}
                      required 
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="time" className="form-label">Randevu Saati</label>
                    <select className="form-select" id="time" value={formData.time} onChange={handleChange} required>
                      <option value="">Seçiniz...</option>
                      {timeSlots.map(time => {
                        const slotCount = availableSlots[time] || 0;
                        const isAvailable = slotCount < 2;
                        return (
                          <option 
                            key={time} 
                            value={time}
                            disabled={!isAvailable}
                          >
                            {time} {!isAvailable ? '(Dolu)' : ''}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? 'Gönderiliyor...' : 'Randevu Oluştur'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Yeni bir loading komponenti
function LoadingState() {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title mb-4">Yükleniyor...</h2>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Yükleniyor...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Ana sayfa komponenti
export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <BookAppointmentForm />
    </Suspense>
  );
} 