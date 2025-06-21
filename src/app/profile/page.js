'use client';

import React, { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (!storedUser) { window.location.href = '/login'; return; }
        
        setUser(storedUser);
        setName(storedUser.name || '');
        setEmail(storedUser.email || '');
        setPhone(storedUser.phone || '');
        setAddress(storedUser.address || '');

        const ordersRes = await fetch('/api/profile/orders', { cache: 'no-store' });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(ordersData);
        }
      } catch (error) { console.error("Veri yüklenirken hata:", error); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

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

  if (loading || !user) {
    return <div className="container text-center my-5">Yükleniyor...</div>;
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <h4 className="mb-3">{user.name}</h4>
              <p className="text-muted">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Profil Bilgileri</h5>
              {message.text && <div className={`alert alert-${message.type} mt-3`}>{message.text}</div>}
              <form onSubmit={handleUpdateProfile} className="mt-3">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Ad Soyad</label>
                  <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">E-posta</label>
                  <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Telefon</label>
                  <input type="tel" className="form-control" id="phone" value={phone || ''} onChange={e => setPhone(e.target.value)} />
                </div>
                 <div className="mb-3">
                  <label htmlFor="address" className="form-label">Teslimat Adresi</label>
                  <textarea className="form-control" id="address" rows={3} value={address || ''} onChange={e => setAddress(e.target.value)}></textarea>
                </div>
                <hr />
                <h6 className="mt-4">Şifre Değiştir</h6>
                <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Mevcut Şifre</label>
                    <input type="password" placeholder="Şifre değiştirmek için doldurun" className="form-control" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">Yeni Şifre</label>
                    <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Bilgileri Güncelle</button>
              </form>
            </div>
          </div>

          <div className="card mt-4">
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
                          <th>İşlem</th>
                      </tr>
                      </thead>
                      <tbody>
                      {orders.map(order => (
                          <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td>{order.total.toFixed(2)} TL</td>
                          <td>{order.status}</td>
                          <td>
                             <button className="btn btn-sm btn-outline-primary" onClick={() => openRatingModal(order)}>
                               Değerlendir
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

       {showRatingModal && selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <form onSubmit={handleRatingSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Siparişi Değerlendir (#{selectedOrder.id})</h5>
                  <button type="button" className="btn-close" onClick={() => setShowRatingModal(false)}></button>
                </div>
                <div className="modal-body">
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="mb-3">
                      <label className="form-label">{item.product.name}</label>
                      <select 
                        className="form-select"
                        value={ratings[item.id] || "0"}
                        onChange={(e) => handleRatingChange(item.id, e.target.value)}
                      >
                        <option value="0" disabled>Puan Seçin...</option>
                        <option value="1">1 - Çok Kötü</option>
                        <option value="2">2 - Kötü</option>
                        <option value="3">3 - Orta</option>
                        <option value="4">4 - İyi</option>
                        <option value="5">5 - Çok İyi</option>
                      </select>
                    </div>
                  ))}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowRatingModal(false)}>Kapat</button>
                  <button type="submit" className="btn btn-primary">Puanları Kaydet</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}