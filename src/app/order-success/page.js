'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, User, ShoppingBag, Calendar, DollarSign } from 'lucide-react';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Güvenli fiyat formatı fonksiyonu
  const formatPrice = (price) => {
    if (!price) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  // Durum formatı fonksiyonu
  const formatStatus = (status) => {
    switch (status) {
      case 'PENDING': return 'Beklemede';
      case 'CONFIRMED': return 'Onaylandı';
      case 'PROCESSING': return 'Hazırlanıyor';
      case 'SHIPPED': return 'Kargoda';
      case 'DELIVERED': return 'Teslim Edildi';
      case 'CANCELLED': return 'İptal Edildi';
      default: return status;
    }
  };

  // Durum rengi fonksiyonu
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      case 'CONFIRMED': return 'text-blue-600 bg-blue-50';
      case 'PROCESSING': return 'text-purple-600 bg-purple-50';
      case 'SHIPPED': return 'text-indigo-600 bg-indigo-50';
      case 'DELIVERED': return 'text-green-600 bg-green-50';
      case 'CANCELLED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Sipariş detayları yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <CheckCircle size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Siparişiniz Başarıyla Oluşturuldu!</h1>
            <p className="text-green-100 text-lg">
              Sipariş numaranız: <span className="font-bold">#{orderId}</span>
            </p>
          </div>

          {/* Order Details */}
          {order && (
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Sipariş Detayları
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Toplam Tutar */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <DollarSign className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Toplam Tutar</p>
                      <p className="text-2xl font-bold text-blue-900">{formatPrice(order.total)} ₺</p>
                    </div>
                  </div>
                </div>

                {/* Sipariş Durumu */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Package className="w-8 h-8 text-gray-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Sipariş Durumu</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sipariş Tarihi */}
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-green-600 font-medium">Sipariş Tarihi</p>
                      <p className="text-lg font-bold text-green-900">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {order.orderItems && order.orderItems.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Sipariş Edilen Ürünler</h3>
                  <div className="space-y-3">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          {item.product?.imageUrl ? (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product.name}
                              className="w-12 h-12 rounded-lg object-cover mr-4"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">{item.product?.name || 'Ürün'}</p>
                            <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900">{formatPrice(item.price)} ₺</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Info Message */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Package className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Siparişinizin durumunu <strong>"Profilim"</strong> sayfasından takip edebilirsiniz. 
                      Herhangi bir sorun yaşarsanız bizimle iletişime geçebilirsiniz.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/profile" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  <User className="w-5 h-5 mr-2" />
                  Siparişlerimi Görüntüle
                </Link>
                <Link 
                  href="/products" 
                  className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 
                           rounded-lg hover:bg-blue-50 transition-colors duration-200 font-medium"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Alışverişe Devam Et
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">Yükleniyor...</span>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
} 