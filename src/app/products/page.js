'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Calendar, Package, Wrench, CheckCircle, XCircle, Eye } from 'lucide-react';

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

  // Güvenli fiyat formatı fonksiyonu
  const formatPrice = (price) => {
    if (!price) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

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

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Ürünler yükleniyor...</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Ürünler Bölümü */}
      <div className="mb-12">
        <div className="flex items-center mb-8">
          <Package className="w-8 h-8 mr-3 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Ürünlerimiz</h2>
        </div>
        
        {physicalProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {physicalProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {product.imageUrl && (
                  <Link href={`/products/${product.id}`} className="block cursor-pointer">
                    <div className="aspect-w-16 aspect-h-9">
                      <img 
                        src={product.imageUrl} 
                        className="w-full h-48 object-cover" 
                        alt={product.name}
                      />
                    </div>
                  </Link>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">{formatPrice(product.price)} ₺</span>
                      <div className="flex items-center mt-1">
                        {product.stock > 0 ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            <span className="text-sm text-green-600">Stokta: {product.stock}</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-500 mr-1" />
                            <span className="text-sm text-red-600">Stokta Yok</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Butonlar */}
                  <div className="space-y-3">
                    {/* Ürünü İncele Butonu */}
                    <Link
                      href={`/products/${product.id}`}
                      className="w-full px-4 py-3 bg-black/60 text-white rounded-lg font-semibold 
                               hover:bg-black/80 transition-colors duration-300 
                               flex items-center justify-center gap-2"
                    >
                      <Eye size={20} />
                      Ürünü İncele
                    </Link>
                    
                    {/* Sepete Ekle Butonu */}
                    <button
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 ease-out flex items-center justify-center ${
                        product.stock <= 0 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : addedToCart === product.id
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                    >
                      {product.stock <= 0 ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Stokta Yok
                        </>
                      ) : addedToCart === product.id ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Sepete Eklendi
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Sepete Ekle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz ürün yok</h3>
            <p className="mt-1 text-sm text-gray-500">Yeni ürünler eklendiğinde burada görünecektir.</p>
          </div>
        )}
      </div>

      {/* Servisler/Randevu Bölümü */}
      <div className="mb-12">
        <div className="flex items-center mb-8">
          <Wrench className="w-8 h-8 mr-3 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">Teknik Servis Hizmetlerimiz</h2>
        </div>
        
        {serviceProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceProducts.map(service => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {service.imageUrl && (
                  <div className="aspect-w-16 aspect-h-9 cursor-pointer" onClick={() => handleBookAppointment(service.name)}>
                    <img 
                      src={service.imageUrl} 
                      className="w-full h-48 object-cover" 
                      alt={service.name}
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{service.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Başlangıç Fiyatı:</span>
                    <div className="text-2xl font-bold text-green-600">{formatPrice(service.price)} ₺</div>
                  </div>
                  
                  <button
                    className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 ease-out flex items-center justify-center"
                    onClick={() => handleBookAppointment(service.name)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Randevu Al
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Wrench className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz servis yok</h3>
            <p className="mt-1 text-sm text-gray-500">Yeni servisler eklendiğinde burada görünecektir.</p>
          </div>
        )}
      </div>
    </div>
  );
} 