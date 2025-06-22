'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (!res.ok) throw new Error('Ürünler yüklenemedi.');
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Randevu Al fonksiyonu
  const handleBookAppointment = (serviceName) => {
    router.push(`/book-appointment?service=${encodeURIComponent(serviceName)}`);
  };

  // Sepete Ekle fonksiyonu
  const handleAddToCart = (productToAdd) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productToAdd.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...productToAdd, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    setAddedToCart(productToAdd.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  const physicalProducts = allProducts.filter(p => p.category === 'urun');
  const serviceProducts = allProducts.filter(p => p.category === 'servis');

  if (loading) return <div className="container my-5 text-center">Yükleniyor...</div>;

  return (
    <div className="container my-5">
      {/* Ürünler Bölümü */}
      <h2 className="mb-4">Ürünlerimiz</h2>
      <div className="row g-4">
        {physicalProducts.map(product => (
          <div key={product.id} className="col-md-4">
            <div className="card h-100">
              {product.imageUrl && (
                <img src={product.imageUrl} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">
                  <strong>Fiyat: </strong>{product.price.toFixed(2)} TL
                  <br />
                  <small className="text-muted">Stok: {product.stock}</small>
                </p>
                <button
                  className={`btn btn-primary ${addedToCart === product.id ? 'disabled' : ''}`}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                >
                  {product.stock <= 0 ? 'Stokta Yok' :
                    addedToCart === product.id ? 'Sepete Eklendi ✓' : 'Sepete Ekle'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Servisler/Randevu Bölümü */}
      <h2 className="mb-4 mt-5">Teknik Servis Hizmetlerimiz</h2>
      <div className="row g-4">
        {serviceProducts.map(service => (
          <div key={service.id} className="col-md-4">
            <div className="card h-100">
              {service.imageUrl && (
                <img src={service.imageUrl} className="card-img-top" alt={service.name} style={{ height: '200px', objectFit: 'cover' }} />
              )}
              <div className="card-body">
                <h5 className="card-title">{service.name}</h5>
                <p className="card-text">{service.description}</p>
                <p className="card-text">
                  <strong>Başlangıç Fiyatı: </strong>{service.price.toFixed(2)} TL
                </p>
                <button
                  className="btn btn-success"
                  onClick={() => handleBookAppointment(service.name)}
                >
                  Randevu Al
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 