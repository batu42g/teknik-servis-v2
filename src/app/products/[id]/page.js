'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingCart, Star, ArrowLeft, Package, CheckCircle, XCircle, 
  Heart, Share2, Truck, Shield, RotateCcw, MessageCircle 
} from 'lucide-react';

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);
  const [ratingInfo, setRatingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;
      try {
        const [productRes, ratingRes] = await Promise.all([
          fetch(`/api/products/${params.id}`),
          fetch(`/api/products/${params.id}/rating`)
        ]);
        
        if (!productRes.ok) throw new Error('Ürün bulunamadı.');
        
        const productData = await productRes.json();
        setProduct(productData);
        if(ratingRes.ok) setRatingInfo(await ratingRes.json());

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const formatPrice = (price) => {
    if (!price) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Ürün yükleniyor...</span>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center py-20">
        <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ürün bulunamadı</h2>
        <p className="text-gray-600 mb-8">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <Link 
          href="/products"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ürünlere Geri Dön
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-blue-600 transition-colors">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-blue-600 transition-colors">Ürünler</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Ürün Görselleri */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={product.imageUrl || 'https://placehold.co/600x600.png?text=Görsel+Yok'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Ürün Bilgileri */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Değerlendirmeler */}
            {ratingInfo && ratingInfo.count > 0 && (
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < Math.round(ratingInfo.average) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {ratingInfo.average.toFixed(1)} ({ratingInfo.count} değerlendirme)
                </span>
              </div>
            )}
          </div>

          {/* Fiyat */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold text-blue-600">{formatPrice(product.price)} ₺</span>
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ürün Açıklaması</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'Bu ürün için açıklama mevcut değil.'}
            </p>
          </div>

          {/* Stok Durumu */}
          <div className="flex items-center space-x-2">
            {product.stock > 0 ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600 font-medium">Stokta ({product.stock} adet)</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-600 font-medium">Stokta Yok</span>
              </>
            )}
          </div>

          {/* Miktar Seçici */}
          {product.stock > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Miktar</label>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                <span className="w-16 h-10 border border-gray-300 rounded-lg flex items-center justify-center font-medium">
                  {quantity}
                </span>
                <button 
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Aksiyon Butonları */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={quantity === 0}
                className="flex-1 bg-black/60 text-white py-4 px-6 rounded-xl font-semibold text-lg 
                             hover:bg-black/80 transition-colors duration-300 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-3"
              >
                {product.stock <= 0 ? (
                  <>
                    <XCircle className="w-5 h-5 mr-2" />
                    Stokta Yok
                  </>
                ) : addedToCart ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Sepete Eklendi!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Sepete Ekle
                  </>
                )}
              </button>
              
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="w-6 h-6 text-gray-600" />
              </button>
              
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Özellikler */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Ücretsiz Kargo (250₺ ve üzeri)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">2 Yıl Garanti</span>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700">14 Gün İade Garantisi</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">7/24 Teknik Destek</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Geri Dön Butonu */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link 
          href="/products"
          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ürünlere Geri Dön
        </Link>
      </div>
    </div>
  );
} 