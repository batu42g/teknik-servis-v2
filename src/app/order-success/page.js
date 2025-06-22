'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Sipariş detaylarını getir
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/profile/orders`);
        if (response.ok) {
          const orders = await response.json();
          const currentOrder = orders.find(o => o.id === parseInt(orderId));
          if (currentOrder) {
            setOrder(currentOrder);
          }
        }
      } catch (error) {
        console.error('Sipariş detayları alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, router]);

  if (!orderId) return null;

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-success">
            <div className="card-body text-center">
              <div className="mb-4">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <h1 className="card-title h3 mb-4">Siparişiniz Başarıyla Oluşturuldu!</h1>
              <p className="lead mb-4">
                Sipariş numaranız: <strong>#{orderId}</strong>
              </p>
              {order && (
                <div className="alert alert-light mb-4">
                  <p className="mb-2">Sipariş Detayları:</p>
                  <p className="mb-1">Toplam Tutar: <strong>{order.total.toFixed(2)} TL</strong></p>
                  <p className="mb-1">Durum: <strong>{
                    order.status === 'pending' ? 'Beklemede' :
                    order.status === 'completed' ? 'Tamamlandı' :
                    order.status === 'cancelled' ? 'İptal Edildi' : order.status
                  }</strong></p>
                  <p className="mb-0">Tarih: <strong>{new Date(order.createdAt).toLocaleDateString()}</strong></p>
                </div>
              )}
              <p className="text-muted mb-4">
                Siparişinizin durumunu "Profilim" sayfasından takip edebilirsiniz.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link href="/profile" className="btn btn-primary">
                  <i className="bi bi-person me-2"></i>
                  Siparişlerimi Görüntüle
                </Link>
                <Link href="/products" className="btn btn-outline-primary">
                  <i className="bi bi-shop me-2"></i>
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
} 