'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    
    const handleStorageChange = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser(null);
        }
        
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
      } catch (error) {
        console.error('Veri okunurken hata:', error);
        setUser(null);
        setCartCount(0);
      }
    };

    // İlk yüklemede ve storage değişimlerinde çalışacak
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);

    // Custom event dinleyicisi ekle
    const handleAuthChange = () => {
      handleStorageChange();
    };
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        setUser(null);
        setCartCount(0);
        // Custom event tetikle
        window.dispatchEvent(new Event('authChange'));
        router.push('/');
      }
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  // Sayfa yüklenene kadar basit navbar göster
  if (!isMounted) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link href="/" className="navbar-brand">
            Efe Bilgisayar ve Güvenlik Sistemleri
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Efe Bilgisayar ve Güvenlik Sistemleri
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link href="/products" className="nav-link">
                Ürünler
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/book-appointment" className="nav-link">
                Randevu Al
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link">
                İletişim
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/about" className="nav-link">
                Hakkımızda
              </Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {user.name}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item" href="/admin">
                        <i className="bi bi-speedometer2 me-2"></i>
                        Admin Paneli
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link className="dropdown-item" href="/messages">
                      <i className="bi bi-envelope me-2"></i>
                      Mesajlarım
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="/profile">
                      <i className="bi bi-person me-2"></i>
                      Profilim
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Çıkış Yap
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Giriş Yap
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">
                    <i className="bi bi-person-plus me-1"></i>
                    Kayıt Ol
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link href="/cart" className="nav-link">
                <i className="bi bi-cart me-1"></i>
                Sepet ({cartCount})
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}