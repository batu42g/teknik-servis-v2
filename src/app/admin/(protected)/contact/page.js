'use client';

import React, { useState, useEffect, useCallback } from 'react';

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

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
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>İsim</th>
                <th>Email</th>
                <th>Konu</th>
                <th>Mesaj</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id}>
                  <td>{new Date(msg.createdAt).toLocaleString('tr-TR')}</td>
                  <td>{msg.name}</td>
                  <td>
                    <a href={`mailto:${msg.email}`} className="text-decoration-none">
                      {msg.email}
                    </a>
                  </td>
                  <td>{msg.subject}</td>
                  <td>{msg.message}</td>
                  <td>
                    <span className={`badge ${msg.status === 'unread' ? 'bg-danger' : 'bg-success'}`}>
                      {msg.status === 'unread' ? 'Okunmadı' : 'Okundu'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 