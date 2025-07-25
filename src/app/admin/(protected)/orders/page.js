'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Eye, Package, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Güvenli fiyat formatı fonksiyonu
  const formatPrice = (price) => {
    if (!price) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Siparişler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
        setSelectedOrder(updatedOrder);
      } else {
        const error = await res.json();
        alert(error.error || 'Durum güncellenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      alert('Durum güncellenirken bir hata oluştu.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Bekliyor' },
      CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800', icon: AlertCircle, label: 'Onaylandı' },
      PROCESSING: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Package, label: 'Hazırlanıyor' },
      SHIPPED: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: Package, label: 'Kargoda' },
      DELIVERED: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Teslim Edildi' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'İptal Edildi' },
      // Legacy status support
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Bekliyor' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Tamamlandı' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'İptal Edildi' },
    };
    
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle, label: status };
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    );
  };
  
  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Siparişler yükleniyor...</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <Package className="w-8 h-8 mr-3 text-blue-600" />
          Sipariş Yönetimi
        </h1>
        <div className="text-sm text-gray-500">
          Toplam {orders.length} sipariş
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.user?.name || order.user?.adSoyad || 'Silinmiş Kullanıcı'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatPrice(order.total)} ₺
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detaylar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {orders.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz sipariş yok</h3>
            <p className="mt-1 text-sm text-gray-500">Yeni siparişler geldiğinde burada görünecektir.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedOrder(null)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Sipariş Detayları (#{selectedOrder.id})
                  </h3>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h6 className="text-sm font-medium text-gray-900 mb-3">Durum Güncelle</h6>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          (selectedOrder.status === 'pending' || selectedOrder.status === 'PENDING')
                            ? 'bg-yellow-600 text-white' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                        onClick={() => handleStatusChange(selectedOrder.id, 'PENDING')}
                        disabled={updating}
                      >
                        <Clock className="w-4 h-4 inline mr-1" />
                        Bekliyor
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          (selectedOrder.status === 'completed' || selectedOrder.status === 'DELIVERED')
                            ? 'bg-green-600 text-white' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                        onClick={() => handleStatusChange(selectedOrder.id, 'DELIVERED')}
                        disabled={updating}
                      >
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Tamamlandı
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                          (selectedOrder.status === 'cancelled' || selectedOrder.status === 'CANCELLED')
                            ? 'bg-red-600 text-white' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        onClick={() => handleStatusChange(selectedOrder.id, 'CANCELLED')}
                        disabled={updating}
                      >
                        <XCircle className="w-4 h-4 inline mr-1" />
                        İptal Edildi
                      </button>
                    </div>
                  </div>

                  <div>
                    <h6 className="text-sm font-medium text-gray-900 mb-3">Müşteri Bilgileri</h6>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">İsim:</span> {selectedOrder.user?.name || selectedOrder.user?.adSoyad}</div>
                      <div><span className="font-medium">Email:</span> {selectedOrder.user?.email}</div>
                      <div><span className="font-medium">Telefon:</span> {selectedOrder.phone || selectedOrder.user?.telefon || 'Belirtilmemiş'}</div>
                      <div><span className="font-medium">Adres:</span> {selectedOrder.address || selectedOrder.user?.adres || 'Belirtilmemiş'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h6 className="text-sm font-medium text-gray-900 mb-3">Sipariş Ürünleri</h6>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Birim Fiyat</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adet</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Puan</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {(selectedOrder.items || selectedOrder.orderItems || []).map(item => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product?.name || 'Ürün'}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{formatPrice(item.price)} ₺</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)} ₺</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{item.rating ? `${item.rating} / 5` : 'Puanlanmamış'}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">Genel Toplam:</td>
                          <td colSpan="2" className="px-4 py-3 text-sm font-bold text-gray-900">{formatPrice(selectedOrder.total)} ₺</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                  onClick={() => setSelectedOrder(null)}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 