'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState('0');
  const router = useRouter();

  // Profil güncelleme state'leri
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Puanlama modal'ı için state'ler
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Form alanlarını doldur
    setName(parsedUser.name || '');
    setEmail(parsedUser.email || '');
    setPhone(parsedUser.phone || '');
    setAddress(parsedUser.address || '');

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

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Kullanıcı bilgilerini localStorage'da güncelle
        const updatedUser = { ...user, name, email, phone, address };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage({ type: 'success', text: 'Profil bilgileriniz başarıyla güncellendi.' });
        
        // Şifre alanlarını temizle
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setMessage({ type: 'danger', text: data.error || 'Bir hata oluştu.' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    }
  };

  const handleRatingClick = (item) => {
    setSelectedItem(item);
    setRating('0');
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (rating === '0') {
      return;
    }

    try {
      const response = await fetch(`/api/order-items/${selectedItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: parseInt(rating) }),
      });

      if (response.ok) {
        // Siparişleri yeniden yükle
        const ordersRes = await fetch('/api/profile/orders');
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
          
          // Seçili siparişi güncelle
          const updatedOrder = ordersData.find(o => o.id === selectedOrder.id);
          if (updatedOrder) {
            setSelectedOrder(updatedOrder);
          }
        }
        setShowRatingModal(false);
      }
    } catch (error) {
      console.error('Puanlama sırasında hata:', error);
    }
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
          <div className="card mb-4">
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

          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Profil Güncelleme</h5>
              {message.text && (
                <div className={`alert alert-${message.type} mt-3`}>
                  {message.text}
                </div>
              )}
              <form onSubmit={handleUpdateProfile} className="mt-3">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Ad Soyad</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">E-posta</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Telefon</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Adres</label>
                  <textarea
                    className="form-control"
                    id="address"
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>
                <hr />
                <h6 className="mt-4">Şifre Değiştir</h6>
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">Mevcut Şifre</label>
                  <input
                    type="password"
                    className="form-control"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Şifre değiştirmek için doldurun"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">Yeni Şifre</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Bilgileri Güncelle
                </button>
              </form>
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
                      <th>Birim Fiyat</th>
                      <th>Toplam</th>
                      <th>Puan</th>
                      <th>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map(item => (
                      <tr key={item.id}>
                        <td>{item.product.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toFixed(2)} TL</td>
                        <td>{(item.price * item.quantity).toFixed(2)} TL</td>
                        <td>
                          {item.rating ? (
                            <span className="text-warning">
                              {'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}
                            </span>
                          ) : 'Puanlanmamış'}
                        </td>
                        <td>
                          {!item.rating && selectedOrder.status === 'completed' && (
                            <button 
                              className="btn btn-sm btn-outline-warning"
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

      {/* Puanlama Modalı */}
      {showRatingModal && selectedItem && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleRatingSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Ürünü Puanla</h5>
                  <button type="button" className="btn-close" onClick={() => setShowRatingModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">{selectedItem.product.name}</label>
                    <select 
                      className="form-select"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                    >
                      <option value="0">Puan Seçin...</option>
                      <option value="1">1 - Çok Kötü</option>
                      <option value="2">2 - Kötü</option>
                      <option value="3">3 - Orta</option>
                      <option value="4">4 - İyi</option>
                      <option value="5">5 - Çok İyi</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowRatingModal(false)}>
                    İptal
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={rating === '0'}>
                    Puanı Kaydet
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}