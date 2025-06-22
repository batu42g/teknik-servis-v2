'use client';

import React, { useState, useEffect, useCallback } from 'react';

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
    <div className="container-fluid py-3">
      <h1 className="h2 mb-4">İletişim Mesajları</h1>
      
      {messages.length === 0 ? (
        <div className="alert alert-info">Henüz hiç mesaj bulunmuyor.</div>
      ) : (
        <div className="list-group">
          {messages.map((msg) => (
            <div key={msg.id} className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                <div>
                  <h5 className="mb-1">{msg.name}</h5>
                  <a href={`mailto:${msg.email}`} className="text-decoration-none">
                    {msg.email}
                  </a>
                </div>
                <div className="text-end">
                  <small className="text-muted d-block">
                    {new Date(msg.createdAt).toLocaleString('tr-TR')}
                  </small>
                  <div className="mt-2">
                    {msg.status === 'unread' && (
                      <span className="badge bg-danger me-2">Yeni</span>
                    )}
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(msg.id)}
                      disabled={deleting === msg.id}
                    >
                      {deleting === msg.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                          Siliniyor...
                        </>
                      ) : (
                        'Sil'
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {msg.subject && (
                <h6 className="mb-2">{msg.subject}</h6>
              )}
              <p className="mb-1">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 