'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ShieldAlert, Trash2, X, Loader2 } from 'lucide-react';

export default function DeleteUserModal({ isOpen, onClose, userId, onConfirmDelete }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && userId) {
      const fetchUserDetails = async () => {
        setLoading(true);
        setError(null);
        setDetails(null);
        try {
          const res = await fetch(`/api/admin/users/${userId}/details`);
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Kullanıcı detayları alınamadı.');
          }
          const data = await res.json();
          setDetails(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserDetails();
    }
  }, [isOpen, userId]);

  if (!isOpen) {
    return null;
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ShieldAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Kullanıcıyı Silme Onayı
                      </Dialog.Title>
                      <div className="mt-2">
                        {loading && (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                            <p className="ml-2 text-gray-600">Veriler yükleniyor...</p>
                          </div>
                        )}
                        {error && <p className="text-sm text-red-500">{error}</p>}
                        {details && (
                          <div>
                            <p className="text-sm text-gray-700">
                              <strong>{details.user.adSoyad || details.user.email}</strong> isimli kullanıcıyı ve ilişkili tüm verilerini kalıcı olarak silmek istediğinizden emin misiniz?
                            </p>
                            <ul className="mt-3 list-disc list-inside space-y-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                              <li><strong>{details.orders.length}</strong> adet siparişi silinecek.</li>
                              <li><strong>{details.appointments.length}</strong> adet randevusu silinecek.</li>
                               <li>İlgili tüm mesajları ve ürün puanlamaları silinecek.</li>
                            </ul>
                            <p className="mt-3 text-xs text-red-700 font-semibold">Bu işlem geri alınamaz.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50"
                    onClick={() => onConfirmDelete(userId)}
                    disabled={loading || !details}
                  >
                    <Trash2 className="mr-2 h-5 w-5" />
                    Evet, Sil
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                     <X className="mr-2 h-5 w-5" />
                    İptal
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 