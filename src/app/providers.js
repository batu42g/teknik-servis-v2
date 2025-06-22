'use client';

import { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children, session }) {
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

  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
} 