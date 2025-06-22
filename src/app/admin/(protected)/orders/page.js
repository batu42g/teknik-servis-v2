'use client';

import React, { useState, useEffect, useCallback } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

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
  
  if (loading) return (
    <div className="d-flex justify-content-center py-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Yükleniyor...</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-3">
      <h1 className="h2 mb-3 border-bottom pb-2">Sipariş Yönetimi</h1>
      
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Müşteri</th>
              <th>Tarih</th>
              <th>Tutar</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user?.name || 'Silinmiş Kullanıcı'}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.total ? `${order.total.toFixed(2)} TL` : '-'}</td>
                <td>
                  <span className={`badge bg-${
                    order.status === 'pending' ? 'warning text-dark' : 
                    order.status === 'completed' ? 'success' : 
                    order.status === 'cancelled' ? 'danger' : 'info'
                  }`}>
                    {order.status === 'pending' ? 'Bekliyor' :
                     order.status === 'completed' ? 'Tamamlandı' :
                     order.status === 'cancelled' ? 'İptal Edildi' : order.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-info" 
                    onClick={() => setSelectedOrder(order)}
                  >
                    Detaylar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sipariş Detayları (#{selectedOrder.id})</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <h6>Durum Güncelle</h6>
                  <div className="btn-group">
                    <button
                      className={`btn btn${selectedOrder.status === 'pending' ? '' : '-outline'}-warning`}
                      onClick={() => handleStatusChange(selectedOrder.id, 'pending')}
                      disabled={updating}
                    >
                      Bekliyor
                    </button>
                    <button
                      className={`btn btn${selectedOrder.status === 'completed' ? '' : '-outline'}-success`}
                      onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                      disabled={updating}
                    >
                      Tamamlandı
                    </button>
                    <button
                      className={`btn btn${selectedOrder.status === 'cancelled' ? '' : '-outline'}-danger`}
                      onClick={() => handleStatusChange(selectedOrder.id, 'cancelled')}
                      disabled={updating}
                    >
                      İptal Edildi
                    </button>
                  </div>
                </div>

                <h6>Müşteri Bilgileri</h6>
                <p>
                  <strong>İsim:</strong> {selectedOrder.user?.name}<br/>
                  <strong>Email:</strong> {selectedOrder.user?.email}<br/>
                  <strong>Telefon:</strong> {selectedOrder.phone || 'Belirtilmemiş'}<br/>
                  <strong>Adres:</strong> {selectedOrder.address || 'Belirtilmemiş'}
                </p>
                <hr/>
                <h6>Ürünler</h6>
                <table className="table mt-3">
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th>Birim Fiyat</th>
                      <th>Adet</th>
                      <th>Toplam</th>
                      <th>Puan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items && selectedOrder.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.product.name}</td>
                        <td>{item.price ? `${item.price.toFixed(2)} ₺` : '-'}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price ? `${(item.price * item.quantity).toFixed(2)} ₺` : '-'}</td>
                        <td>{item.rating ? `${item.rating} / 5` : 'Puanlanmamış'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Genel Toplam:</strong></td>
                      <td colSpan="2"><strong>{selectedOrder.total ? `${selectedOrder.total.toFixed(2)} ₺` : '-'}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedOrder(null)}>
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