'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stockInfo, setStockInfo] = useState({});
  const router = useRouter();

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(cartData);
    
    // Stok bilgilerini getir
    const fetchStockInfo = async () => {
      try {
        const productIds = cartData.map(item => item.id);
        if (productIds.length === 0) return;
        
        const res = await fetch('/api/admin/products');
        const products = await res.json();
        
        const stockData = {};
        products.forEach(product => {
          stockData[product.id] = product.stock;
        });
        
        setStockInfo(stockData);
      } catch (error) {
        console.error('Stok bilgileri alınamadı:', error);
      }
    };

    fetchStockInfo();
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Stok kontrolü
    const availableStock = stockInfo[productId];
    if (availableStock !== undefined && newQuantity > availableStock) {
      setMessage({ 
        type: 'warning', 
        text: `Üzgünüz, bu ürün için yalnızca ${availableStock} adet stok mevcut.` 
      });
      return;
    }

    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    updateCart(newCart);
    setMessage({ type: '', text: '' });
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId);
    updateCart(newCart);
  };

  const handleCompletePurchase = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: cart }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.details) {
          // Stok hatası detaylarını göster
          throw new Error(data.details.join('\n'));
        }
        throw new Error(data.error || 'Sipariş oluşturulamadı.');
      }
      
      setMessage({ type: 'success', text: 'Siparişiniz başarıyla oluşturuldu!' });
      updateCart([]);

    } catch (err) {
      setMessage({ type: 'danger', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container my-5">
        <div className="alert alert-info">
          Sepetiniz boş. Alışverişe devam etmek için <a href="/products">ürünler sayfasına</a> göz atın.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Sepetim</h5>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Ürün</th>
                  <th>Fiyat</th>
                  <th>Adet</th>
                  <th>Toplam</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price.toFixed(2)} TL</td>
                    <td>
                      <div className="input-group" style={{ width: '150px' }}>
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={stockInfo[item.id] !== undefined && item.quantity >= stockInfo[item.id]}
                        >
                          +
                        </button>
                      </div>
                      {stockInfo[item.id] !== undefined && (
                        <small className="text-muted d-block">
                          Stokta: {stockInfo[item.id]} adet
                        </small>
                      )}
                    </td>
                    <td>{(item.price * item.quantity).toFixed(2)} TL</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Kaldır
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end"><strong>Toplam:</strong></td>
                  <td><strong>{totalPrice.toFixed(2)} TL</strong></td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="text-end mt-3">
            <button
              className="btn btn-primary"
              onClick={handleCompletePurchase}
              disabled={loading}
            >
              {loading ? 'İşleniyor...' : 'Siparişi Tamamla'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 