'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Form state'leri
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Puanlama modal'ı için state'ler
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Siparişleri getir
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/profile/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Her 30 saniyede bir siparişleri güncelle
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (newPassword && !currentPassword) {
      setMessage({ type: 'danger', text: 'Yeni şifre belirlemek için mevcut şifrenizi girmelisiniz.' });
      return;
    }
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, address, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setMessage({ type: 'success', text: 'Profiliniz başarıyla güncellendi.' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    }
  };
  
  const openRatingModal = (order) => {
    if (!order || !order.items) return;
    setSelectedOrder(order);
    const initialRatings = order.items.reduce((acc, item) => {
      acc[item.id] = String(item.rating || "0");
      return acc;
    }, {});
    setRatings(initialRatings);
    setShowRatingModal(true);
  };

  const handleRatingChange = (orderItemId, rating) => {
    setRatings(prev => ({ ...prev, [orderItemId]: rating }));
  };
  
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    for (const orderItemId in ratings) {
      const ratingValue = parseInt(ratings[orderItemId]);
      if (ratingValue > 0) {
         await fetch(`/api/order-items/${orderItemId}`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ rating: ratingValue }),
         });
      }
    }
    setShowRatingModal(false);
    window.location.reload();
  };

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
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Profil Bilgilerim</h5>
              <div className="mt-3">
                <p><strong>İsim:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Telefon:</strong> {user?.phone || 'Belirtilmemiş'}</p>
                <p><strong>Adres:</strong> {user?.address || 'Belirtilmemiş'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Sipariş Geçmişim</h5>
              {orders.length > 0 ? (
                <div className="table-responsive">
                  <table className="table mt-3">
                    <thead>
                      <tr>
                        <th>Sipariş ID</th>
                        <th>Tarih</th>
                        <th>Tutar</th>
                        <th>Durum</th>
                        <th>Detaylar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>{order.total.toFixed(2)} TL</td>
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
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <i className="bi bi-eye me-1"></i>
                              Detaylar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted mt-3">Henüz sipariş vermediniz.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sipariş Detay Modalı */}
      {selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Sipariş Detayları (#{selectedOrder.id})</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-light">
                  <p className="mb-1"><strong>Durum:</strong> <span className={`badge bg-${
                    selectedOrder.status === 'pending' ? 'warning text-dark' : 
                    selectedOrder.status === 'completed' ? 'success' : 
                    selectedOrder.status === 'cancelled' ? 'danger' : 'info'
                  }`}>
                    {selectedOrder.status === 'pending' ? 'Bekliyor' :
                     selectedOrder.status === 'completed' ? 'Tamamlandı' :
                     selectedOrder.status === 'cancelled' ? 'İptal Edildi' : selectedOrder.status}
                  </span></p>
                  <p className="mb-1"><strong>Tarih:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p className="mb-0"><strong>Toplam Tutar:</strong> {selectedOrder.total.toFixed(2)} TL</p>
                </div>
                <h6>Ürünler</h6>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th>Adet</th>
                      <th>Puan</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.product.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.rating ? `${item.rating} / 5` : 'Puanlanmamış'}</td>
                        <td>
                          {!item.rating && selectedOrder.status === 'completed' && (
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleRatingClick(item)}
                            >
                              <i className="bi bi-star me-1"></i>
                              Puanla
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
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