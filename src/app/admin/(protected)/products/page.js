'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Package, Plus, Edit3, Trash2, Eye, X, Save, Image as ImageIcon, ShoppingCart, Calendar, CheckCircle, XCircle } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({ name: '', description: '', price: 0, imageUrl: '', category: 'servis', stock: 0 });
  const [feedback, setFeedback] = useState({ show: false, type: '', message: '' });

  const showFeedback = (type, message) => {
    setFeedback({ show: true, type, message });
    setTimeout(() => setFeedback({ show: false, type: '', message: '' }), 4000);
  };

  // Güvenli fiyat formatı fonksiyonu
  const formatPrice = (price) => {
    if (!price) return '0.00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        showFeedback('error', 'Ürünler yüklenemedi');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      showFeedback('error', 'Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openModalForCreate = () => {
    console.log('Opening modal for create product');
    setEditingProduct(null);
    setProductData({ name: '', description: '', price: 0, imageUrl: '', category: 'servis', stock: 0 });
    setShowModal(true);
  };

  const openModalForEdit = (product) => {
    console.log('Opening modal for edit product:', product.id);
    setEditingProduct(product);
    setProductData(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          showFeedback('success', 'Ürün başarıyla silindi');
          fetchProducts();
        } else {
          showFeedback('error', 'Ürün silinemedi');
        }
      } catch (error) {
        console.error('Delete error:', error);
        showFeedback('error', 'Silme işlemi başarısız');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      console.log('Submitting product data:', productData);
      
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        setShowModal(false);
        showFeedback('success', editingProduct ? 'Ürün güncellendi' : 'Yeni ürün eklendi');
        fetchProducts();
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        showFeedback('error', errorData.error || 'İşlem başarısız');
      }
    } catch (error) {
      console.error('Submit error:', error);
      showFeedback('error', 'Bağlantı hatası');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Ürünler yükleniyor...</span>
    </div>
  );

  return (
    <div className="p-6">
      {/* Feedback Banner */}
      {feedback.show && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          feedback.type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-700' 
            : 'bg-red-50 border-red-400 text-red-700'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {feedback.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
            </div>
            <div className="ml-3">
              <p className="font-medium">{feedback.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="flex items-center">
          <Package className="w-8 h-8 mr-3 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Ürün Yönetimi</h1>
            <p className="text-gray-600 mt-1">Ürün ve hizmetlerinizi yönetin</p>
          </div>
        </div>
        <button 
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                   font-medium transition-all duration-200 shadow-lg hover:shadow-xl gap-2"
          onClick={openModalForCreate}
        >
          <Plus className="w-5 h-5" />
          Yeni Ürün/Hizmet Ekle
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Görsel</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">İsim</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Kategori</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Fiyat</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Stok</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">#{product.id}</td>
                  <td className="py-4 px-6">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkMyOC40MTgzIDMyIDMyIDI4LjQxODMgMzIgMjRDMzIgMTkuNTgxNyAyOC40MTgzIDE2IDI0IDE2QzE5LjU4MTcgMTYgMTYgMTkuNTgxNyAxNiAyNEMxNiAyOC40MTgzIDE5LjU4MTcgMzIgMjQgMzJaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      product.category === 'urun' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.category === 'urun' ? (
                        <>
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Ürün
                        </>
                      ) : (
                        <>
                          <Calendar className="w-3 h-3 mr-1" />
                          Hizmet
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-900">{formatPrice(product.price)} ₺</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {product.stock > 0 ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-green-600 font-medium">{product.stock}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-500 mr-1" />
                          <span className="text-red-600 font-medium">Yok</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button 
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded-lg transition-colors duration-150 
                                 border border-blue-200 hover:border-blue-300"
                        onClick={() => openModalForEdit(product)}
                        title="Düzenle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        className="bg-red-50 hover:bg-red-100 text-red-700 p-2 rounded-lg transition-colors duration-150
                                 border border-red-200 hover:border-red-300"
                        onClick={() => handleDelete(product.id)}
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz ürün yok</h3>
            <p className="text-gray-500 mb-6">İlk ürününüzü ekleyerek başlayın.</p>
            <button 
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                       font-medium transition-colors duration-200 gap-2"
              onClick={openModalForCreate}
            >
              <Plus className="w-4 h-4" />
              Ürün Ekle
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleFormSubmit}>
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                </h3>
                <button 
                  type="button" 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setShowModal(false)}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {/* Kategori */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kategori *</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent transition-all duration-200"
                    value={productData.category} 
                    onChange={e => setProductData({...productData, category: e.target.value})}
                    required
                  >
                    <option value="servis">🛠️ Hizmet (Randevu Al)</option>
                    <option value="urun">📦 Ürün (Sepete Ekle)</option>
                  </select>
                </div>

                {/* İsim */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">İsim *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent transition-all duration-200"
                    value={productData.name} 
                    onChange={e => setProductData({...productData, name: e.target.value})} 
                    required
                    placeholder="Ürün/hizmet adını girin"
                  />
                </div>

                {/* Açıklama */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent transition-all duration-200 h-24 resize-none"
                    value={productData.description} 
                    onChange={e => setProductData({...productData, description: e.target.value})}
                    placeholder="Ürün/hizmet açıklamasını girin"
                  />
                </div>

                {/* Fiyat ve Stok */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat (₺) *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                               focus:border-transparent transition-all duration-200"
                      value={productData.price} 
                      onChange={e => setProductData({...productData, price: parseFloat(e.target.value) || 0})} 
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stok *</label>
                    <input 
                      type="number" 
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                               focus:border-transparent transition-all duration-200"
                      value={productData.stock} 
                      onChange={e => setProductData({...productData, stock: parseInt(e.target.value) || 0})} 
                      required
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Görsel URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Görsel URL</label>
                  <input 
                    type="url" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 
                             focus:border-transparent transition-all duration-200"
                    value={productData.imageUrl} 
                    onChange={e => setProductData({...productData, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                  {productData.imageUrl && (
                    <div className="mt-3">
                      <img 
                        src={productData.imageUrl} 
                        alt="Önizleme" 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                <button 
                  type="button" 
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 
                           transition-colors duration-200 font-medium"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                           transition-colors duration-200 font-medium flex items-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Kaydet
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 