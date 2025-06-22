'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    
    const handleStateChange = () => {
      try {
        const storedUser = localStorage.getItem('user');
        setUser(storedUser ? JSON.parse(storedUser) : null);
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.length);
      } catch (error) {
        console.error("Veri okunurken hata:", error);
        setUser(null);
        setCartCount(0);
      }
    };
    
    window.addEventListener('storage', handleStateChange);
    window.addEventListener('authChange', handleStateChange);

    handleStateChange();

    return () => {
      window.removeEventListener('storage', handleStateChange);
      window.removeEventListener('authChange', handleStateChange);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    fetch('/api/auth/logout', { method: 'POST' });
    window.dispatchEvent(new Event('authChange'));
    router.push('/');
  };

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
              <>
                <li className="nav-item">
                  <Link href="/profile" className="nav-link">
                    Profilim
                  </Link>
                </li>
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link href="/admin" className="nav-link">
                      Admin Panel
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link href="/messages" className="nav-link">
                    Mesajlar
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    Giriş Yap
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">
                    Kayıt Ol
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link href="/cart" className="nav-link">
                Sepet ({cartCount})
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}