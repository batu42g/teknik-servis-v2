'use client';

import { useEffect } from 'react';

export default function Providers({ children }) {
  useEffect(() => {
    const loadBootstrap = async () => {
      try {
        console.log('Bootstrap yükleniyor...');
        await import('bootstrap/dist/js/bootstrap.bundle.min.js');
        console.log('Bootstrap başarıyla yüklendi');
      } catch (error) {
        console.error('Bootstrap yüklenirken hata:', error);
      }
    };

    loadBootstrap();
  }, []);

  return children;
} 