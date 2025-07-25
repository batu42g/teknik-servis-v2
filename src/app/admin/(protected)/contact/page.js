'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Mail, User, Clock, Trash2, Eye, EyeOff, RefreshCw, Calendar } from 'lucide-react';

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    // Her 30 saniyede bir mesajları güncelle
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleDelete = async (messageId) => {
    if (!window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      return;
    }

    setDeleting(messageId);
    try {
      const res = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
      } else {
        const error = await res.json();
        alert(error.error || 'Mesaj silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Mesaj silme hatası:', error);
      alert('Mesaj silinirken bir hata oluştu');
    } finally {
      setDeleting(null);
    }
  };

  // Tarih formatı
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Durum badge component'i
  const getStatusBadge = (status) => {
    if (status === 'unread') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <EyeOff className="w-3 h-3 mr-1" />
          Yeni
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Eye className="w-3 h-3 mr-1" />
        Okundu
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Mesajlar yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <MessageSquare className="w-8 h-8 mr-3 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">İletişim Mesajları</h1>
        </div>
        <button 
          onClick={fetchMessages}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-all duration-200"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Yenile
        </button>
      </div>

      {messages.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-blue-400 mb-4" />
          <h3 className="text-lg font-medium text-blue-900 mb-2">Henüz hiç mesaj bulunmuyor</h3>
          <p className="text-blue-700">Yeni mesajlar burada görünecektir.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`bg-white rounded-lg shadow-lg border-l-4 transition-all duration-200 hover:shadow-xl ${
                msg.status === 'unread' ? 'border-l-red-500' : 'border-l-green-500'
              }`}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{msg.name}</h3>
                      <a 
                        href={`mailto:${msg.email}`} 
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {msg.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(msg.status)}
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(msg.createdAt)}
                    </div>
                    <button 
                      className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDelete(msg.id)}
                      disabled={deleting === msg.id}
                      title="Mesajı Sil"
                    >
                      {deleting === msg.id ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Subject */}
                {msg.subject && (
                  <div className="mb-3">
                    <h4 className="text-md font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">
                      📌 {msg.subject}
                    </h4>
                  </div>
                )}

                {/* Message Content */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Mesaj ID: #{msg.id}
                  </div>
                  {msg.status === 'unread' && (
                    <div className="flex items-center text-red-600 font-medium">
                      <EyeOff className="w-4 h-4 mr-1" />
                      Okunmamış mesaj
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {messages.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{messages.length}</div>
              <div className="text-sm text-gray-600">Toplam Mesaj</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {messages.filter(msg => msg.status === 'unread').length}
              </div>
              <div className="text-sm text-gray-600">Okunmamış</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {messages.filter(msg => msg.status === 'read').length}
              </div>
              <div className="text-sm text-gray-600">Okunmuş</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 