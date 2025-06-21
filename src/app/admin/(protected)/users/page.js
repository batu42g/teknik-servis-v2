'use client';

import React, { useState, useEffect, useCallback } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [modalError, setModalError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Kullanıcılar yüklenemedi.');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Rol değiştirilemedi.");
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Kullanıcı silinemedi.");
        fetchUsers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setModalError('');
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kullanıcı oluşturulamadı.");
      setShowModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (err) {
      setModalError(err.message);
    }
  };
  
  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2 mb-2 mb-md-0">Kullanıcı Yönetimi</h1>
        <button className="btn btn-primary w-100 w-md-auto" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>Yeni Kullanıcı Ekle
        </button>
      </div>

      {/* Masaüstü Görünümü */}
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>İsim</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Rol</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'Belirtilmemiş'}</td>
                  <td>
                    <select
                      className="form-select form-select-sm w-auto"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={user.role === 'admin'}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role === 'admin'}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobil Görünümü */}
      <div className="d-md-none">
        <div className="row g-3">
          {users.map((user) => (
            <div key={user.id} className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title d-flex justify-content-between">
                    {user.name}
                    <span className="badge bg-secondary">ID: {user.id}</span>
                  </h5>
                  <div className="mb-2">
                    <i className="bi bi-envelope me-2"></i>
                    {user.email}
                  </div>
                  <div className="mb-2">
                    <i className="bi bi-telephone me-2"></i>
                    {user.phone || 'Belirtilmemiş'}
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <select
                      className="form-select form-select-sm w-50"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={user.role === 'admin'}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role === 'admin'}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleCreateUser}>
                <div className="modal-header">
                  <h5 className="modal-title">Yeni Kullanıcı Ekle</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  {modalError && <div className="alert alert-danger">{modalError}</div>}
                  <div className="mb-3">
                    <label className="form-label">İsim Soyisim</label>
                    <input type="text" name="name" className="form-control" value={newUser.name} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" name="email" className="form-control" value={newUser.email} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Şifre</label>
                    <input type="password" name="password" className="form-control" value={newUser.password} onChange={handleInputChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Rol</label>
                    <select name="role" className="form-select" value={newUser.role} onChange={handleInputChange}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Kapat</button>
                  <button type="submit" className="btn btn-primary">Kaydet</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 