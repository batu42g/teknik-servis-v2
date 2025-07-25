'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2, XCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import DeleteUserModal from '../../../../components/DeleteUserModal';

const FeedbackBanner = ({ type, message, onDismiss }) => {
  if (!message) return null;

  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-100' : 'bg-green-100';
  const borderColor = isError ? 'border-red-400' : 'border-green-400';
  const textColor = isError ? 'text-red-700' : 'text-green-700';
  const Icon = isError ? XCircle : CheckCircle;

  return (
    <div className={`${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded-md relative mb-4`} role="alert">
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-2" />
        <span className="block sm:inline">{message}</span>
      </div>
      <button onClick={onDismiss} className="absolute top-0 bottom-0 right-0 px-4 py-3">
        <XCircle className={`h-6 w-6 ${textColor}`} />
      </button>
    </div>
  );
};

const UserRow = ({ user, onRoleChange, onDeleteRequest }) => {
  const isProtectedAdmin = user.email === 'admin@teknikservis.com';

  const handleActionChange = (e) => {
    const action = e.target.value;
    e.target.value = ''; // Reset dropdown
    
    if (action === 'change-role') {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      onRoleChange(user.id, newRole);
    } else if (action === 'delete') {
      onDeleteRequest(user.id);
    }
  };

  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{user.adSoyad || 'Belirtilmemiş'}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
      <td className="px-6 py-4 text-sm text-gray-500">{user.phone || 'Belirtilmemiş'}</td>
      <td className="px-6 py-4">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          user.role === 'admin' 
          ? 'bg-red-100 text-red-800' 
          : 'bg-green-100 text-green-800'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        {isProtectedAdmin ? (
          <span className="text-gray-400 text-sm">Korumalı</span>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => onRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
              className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit className="h-3 w-3 mr-1" />
              Rol
            </button>
            <button
              onClick={() => onDeleteRequest(user.id)}
              className="inline-flex items-center px-2 py-1 border border-red-300 rounded-md shadow-sm text-xs font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Sil
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: null, message: null });
  
  // Modal state'leri
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) throw new Error('Kullanıcılar yüklenemedi.');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setFeedback({ type: null, message: null });
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
       const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rol değiştirilemedi.");
      
      setFeedback({ type: 'success', message: 'Rol başarıyla güncellendi!' });
      await fetchUsers();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleDeleteRequest = (userId) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };
  
  const handleConfirmDelete = async (userId) => {
    setIsModalOpen(false);
    setFeedback({ type: null, message: null });
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Kullanıcı silinemedi.");
      }
      
      setFeedback({ type: 'success', message: data.message || 'Kullanıcı başarıyla silindi!' });
      await fetchUsers();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    <>
      <DeleteUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
      <div className="space-y-6">
        <FeedbackBanner 
          type={feedback.type} 
          message={feedback.message} 
          onDismiss={() => setFeedback({ type: null, message: null })} 
        />
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Kullanıcı Yönetimi</h1>
          <Link href="/admin/users/new" className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            <PlusCircle className="w-5 h-5 mr-2" />
            Yeni Kullanıcı
          </Link>
        </div>
        
        {loading && <p>Yükleniyor...</p>}
        
        {!loading && (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">İsim</th>
                  <th scope="col" className="px-6 py-3">Email</th>
                  <th scope="col" className="px-6 py-3">Telefon</th>
                  <th scope="col" className="px-6 py-3">Rol</th>
                  <th scope="col" className="px-6 py-3">
                    <span className="sr-only">İşlemler</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <UserRow key={user.id} user={user} onRoleChange={handleRoleChange} onDeleteRequest={handleDeleteRequest} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {users.length === 0 && !loading && (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-500">Hiç kullanıcı bulunamadı.</h3>
          </div>
        )}
      </div>
    </>
  );
} 