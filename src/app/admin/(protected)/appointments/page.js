'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, User, Phone, MapPin, Trash2, CheckCircle, Clock3, XCircle, AlertCircle, PlayCircle, Eye, MessageSquare } from 'lucide-react';

export default function AdminAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [updating, setUpdating] = useState(false);

    const fetchAppointments = useCallback(async () => {
      try {
        const res = await fetch('/api/admin/appointments');
        const data = await res.json();
        if (res.ok) {
          setAppointments(data);
        }
      } catch (error) {
          console.error("Randevular çekilemedi:", error);
      } finally {
          setLoading(false);
      }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleStatusChange = async (id, status) => {
      setUpdating(true);
      try {
        const res = await fetch(`/api/admin/appointments/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        
        if (res.ok) {
          const updatedAppointment = await res.json();
          // Tüm bilgileri güncelle
          setAppointments(appointments.map(appt => 
            appt.id === id ? updatedAppointment : appt
          ));
          // Selected appointment için de güncelle
          if (selectedAppointment && selectedAppointment.id === id) {
            setSelectedAppointment(updatedAppointment);
          }
        } else {
          alert('Durum güncellenemedi.');
        }
      } catch (error) {
        alert('Durum güncellenemedi.');
      } finally {
        setUpdating(false);
      }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu randevuyu kalıcı olarak silmek istediğinizden emin misiniz?')) {
            try {
                await fetch(`/api/admin/appointments/${id}`, { method: 'DELETE' });
                fetchAppointments(); // Silme sonrası listeyi yenile
                setSelectedAppointment(null); // Modal kapalıysa kapat
            } catch (error) {
                alert('Randevu silinemedi.');
            }
        }
    };

    // Durum badge component'i
    const getStatusBadge = (status) => {
        const statusConfig = {
            'PENDING': { 
                icon: Clock3, 
                text: 'Bekliyor', 
                className: 'bg-yellow-100 text-yellow-800' 
            },
            'CONFIRMED': { 
                icon: CheckCircle, 
                text: 'Onaylandı', 
                className: 'bg-green-100 text-green-800' 
            },
            'IN_PROGRESS': { 
                icon: PlayCircle, 
                text: 'Devam Ediyor', 
                className: 'bg-blue-100 text-blue-800' 
            },

            'CANCELLED': { 
                icon: XCircle, 
                text: 'İptal Edildi', 
                className: 'bg-red-100 text-red-800' 
            }
        };

        const config = statusConfig[status] || statusConfig['PENDING'];
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
                <Icon className="w-3 h-3 mr-1" />
                {config.text}
            </span>
        );
    };

    // Tarih formatı
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    };

    // Detaylı tarih formatı
    const formatDetailedDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', { 
            weekday: 'long',
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Randevular yükleniyor...</span>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <Calendar className="w-8 h-8 mr-3 text-blue-600" />
                    Randevu Yönetimi
                </h1>
                <div className="text-sm text-gray-500">
                    Toplam {appointments.length} randevu
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full table-fixed">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="w-16 px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="w-48 px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri</th>
                            <th className="w-40 px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servis Tipi</th>
                            <th className="w-32 px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                            <th className="w-36 px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih & Saat</th>
                            <th className="w-24 px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="w-24 px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {appointments.map((appt) => (
                                <tr key={appt.id} className="hover:bg-gray-50 transition-colors duration-200">
                                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{appt.id}
                                    </td>
                                    
                                    <td className="px-3 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                                                <User className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-gray-900 truncate">
                                                    {appt.user?.name || appt.user?.adSoyad || 'Bilinmiyor'}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {appt.user?.email || '-'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="px-3 py-4">
                                        <div className="text-sm font-medium text-gray-900 truncate">{appt.serviceType}</div>
                                    </td>
                                    
                                    <td className="px-3 py-4">
                                        <div className="space-y-1">
                                            {appt.phone && (
                                                <div className="flex items-center text-xs text-gray-600">
                                                    <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                                    <span className="truncate">{appt.phone}</span>
                                                </div>
                                            )}
                                            {appt.address && (
                                                <div className="flex items-center text-xs text-gray-600">
                                                    <MapPin className="w-3 h-3 mr-1 text-gray-400" />
                                                    <span className="truncate">{appt.address}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    
                                    <td className="px-3 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs font-medium text-gray-900">
                                                <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                                                <span className="truncate">{formatDate(appt.date)}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-600">
                                                <Clock className="w-3 h-3 mr-1 text-gray-400" />
                                                {appt.time}
                                            </div>
                                        </div>
                                    </td>
                                    
                                    <td className="px-3 py-4">
                                        {getStatusBadge(appt.status)}
                                    </td>
                                    
                                    <td className="px-3 py-4 text-sm font-medium">
                                        <div className="flex space-x-1">
                                            <button 
                                                className="inline-flex items-center px-2 py-1.5 text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                                                onClick={() => setSelectedAppointment(appt)}
                                                title="Detaylar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                className="bg-red-50 hover:bg-red-100 text-red-700 p-1.5 rounded transition-colors duration-150"
                                                onClick={() => handleDelete(appt.id)}
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

                {appointments.length === 0 && (
                    <div className="text-center py-12">
                        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Henüz randevu yok</h3>
                        <p className="mt-1 text-sm text-gray-500">Yeni randevular burada görünecektir.</p>
                    </div>
                )}
            </div>

            {/* Appointment Details Modal */}
            {selectedAppointment && (
                <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black bg-opacity-50">
                    <div className="flex items-center justify-center min-h-screen p-4">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedAppointment(null)}></div>
                        
                        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                                        Randevu Detayları (#{selectedAppointment.id})
                                    </h3>
                                    <button
                                        onClick={() => setSelectedAppointment(null)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                    {/* Status Management */}
                                    <div>
                                        <h6 className="text-sm font-medium text-gray-900 mb-3">Durum Güncelle</h6>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                    selectedAppointment.status === 'PENDING'
                                                        ? 'bg-yellow-600 text-white' 
                                                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                }`}
                                                onClick={() => handleStatusChange(selectedAppointment.id, 'PENDING')}
                                                disabled={updating}
                                            >
                                                <Clock3 className="w-4 h-4 inline mr-1" />
                                                Bekliyor
                                            </button>
                                            <button
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                    selectedAppointment.status === 'CONFIRMED'
                                                        ? 'bg-green-600 text-white' 
                                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                }`}
                                                onClick={() => handleStatusChange(selectedAppointment.id, 'CONFIRMED')}
                                                disabled={updating}
                                            >
                                                <CheckCircle className="w-4 h-4 inline mr-1" />
                                                Onaylandı
                                            </button>
                                            <button
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                    selectedAppointment.status === 'IN_PROGRESS'
                                                        ? 'bg-blue-600 text-white' 
                                                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                                }`}
                                                onClick={() => handleStatusChange(selectedAppointment.id, 'IN_PROGRESS')}
                                                disabled={updating}
                                            >
                                                <PlayCircle className="w-4 h-4 inline mr-1" />
                                                Devam Ediyor
                                            </button>
                                            
                                            <button
                                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                                    selectedAppointment.status === 'CANCELLED'
                                                        ? 'bg-red-600 text-white' 
                                                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                                onClick={() => handleStatusChange(selectedAppointment.id, 'CANCELLED')}
                                                disabled={updating}
                                            >
                                                <XCircle className="w-4 h-4 inline mr-1" />
                                                İptal Edildi
                                            </button>
                                        </div>
                                    </div>

                                    {/* Customer Information */}
                                    <div>
                                        <h6 className="text-sm font-medium text-gray-900 mb-3">Müşteri Bilgileri</h6>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="font-medium">İsim:</span> {selectedAppointment.user?.name || selectedAppointment.user?.adSoyad || 'Belirtilmemiş'}</div>
                                            <div><span className="font-medium">Email:</span> {selectedAppointment.user?.email || 'Belirtilmemiş'}</div>
                                            <div><span className="font-medium">Telefon:</span> {selectedAppointment.phone || selectedAppointment.user?.telefon || 'Belirtilmemiş'}</div>
                                            <div><span className="font-medium">Adres:</span> {selectedAppointment.address || selectedAppointment.user?.adres || 'Belirtilmemiş'}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Details */}
                                <div className="mb-6">
                                    <h6 className="text-sm font-medium text-gray-900 mb-3">Randevu Bilgileri</h6>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Service Details */}
                                        <div className="bg-blue-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <Calendar className="w-8 h-8 text-blue-600 mr-3" />
                                                <div>
                                                    <p className="text-sm text-blue-600 font-medium">Servis Tipi</p>
                                                    <p className="text-lg font-bold text-blue-900">{selectedAppointment.serviceType}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <Clock className="w-8 h-8 text-green-600 mr-3" />
                                                <div>
                                                    <p className="text-sm text-green-600 font-medium">Tarih & Saat</p>
                                                    <p className="text-lg font-bold text-green-900">
                                                        {formatDetailedDate(selectedAppointment.date)}
                                                    </p>
                                                    <p className="text-sm font-medium text-green-700">
                                                        {selectedAppointment.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message/Notes */}
                                {selectedAppointment.description && (
                                    <div className="mb-6">
                                        <h6 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                                            <MessageSquare className="w-4 h-4 mr-2" />
                                            Müşteri Notu
                                        </h6>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-700">{selectedAppointment.description}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Creation Date */}
                                <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <AlertCircle className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-gray-700">
                                                <strong>Randevu Oluşturulma Tarihi:</strong> {' '}
                                                {new Date(selectedAppointment.createdAt).toLocaleDateString('tr-TR', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                                    onClick={() => setSelectedAppointment(null)}
                                >
                                    Kapat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 