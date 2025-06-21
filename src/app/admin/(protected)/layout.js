import Link from 'next/link';
import React, { useState } from 'react';
import AdminLogoutButton from '../../../components/AdminLogoutButton';

export default function ProtectedAdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container-fluid">
      {/* Mobil Hamburger Menü */}
      <button
        className="btn btn-dark d-md-none position-fixed top-0 start-0 mt-2 ms-2 z-3"
        onClick={toggleSidebar}
        style={{ zIndex: 1030 }}
      >
        <i className="bi bi-list"></i>
      </button>

      <div className="row">
        {/* Overlay - Mobilde sidebar açıkken arka planı karartır */}
        {isSidebarOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none"
            style={{ zIndex: 1040 }}
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar */}
        <div
          className={`col-md-3 col-lg-2 bg-dark sidebar position-fixed h-100 ${
            isSidebarOpen ? 'show d-block' : 'd-none'
          } d-md-block`}
          style={{ zIndex: 1050 }}
        >
          <div className="position-sticky pt-3 d-flex flex-column h-100">
            {/* Mobil Kapatma Butonu */}
            <button
              className="btn btn-outline-light mb-3 d-md-none align-self-end me-3"
              onClick={toggleSidebar}
            >
              <i className="bi bi-x-lg"></i>
            </button>

            <ul className="nav flex-column">
              <li className="nav-item">
                <Link 
                  className="nav-link text-white d-flex align-items-center" 
                  href="/admin"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <i className="bi bi-house-door me-2"></i>Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link text-white d-flex align-items-center" 
                  href="/admin/users"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <i className="bi bi-people me-2"></i>Kullanıcılar
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link text-white d-flex align-items-center" 
                  href="/admin/orders"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <i className="bi bi-receipt me-2"></i>Siparişler
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link text-white d-flex align-items-center" 
                  href="/admin/appointments"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <i className="bi bi-calendar me-2"></i>Randevular
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link text-white d-flex align-items-center" 
                  href="/admin/contact"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <i className="bi bi-envelope me-2"></i>Mesajlar
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link text-white d-flex align-items-center" 
                  href="/admin/slider"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <i className="bi bi-images me-2"></i>Slider Yönetimi
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className="nav-link text-white d-flex align-items-center" 
                  href="/admin/products"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <i className="bi bi-box-seam me-2"></i>Ürün Yönetimi
                </Link>
              </li>
            </ul>
            <ul className="nav flex-column mt-auto mb-3">
              <li className="nav-item"><AdminLogoutButton /></li>
            </ul>
          </div>
        </div>

        {/* Ana İçerik */}
        <main className="col-12 col-md-9 col-lg-10 ms-auto px-3 px-md-4 py-3">
          <div className="mt-4 mt-md-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 