'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function MainSlider({ slides }) {
  useEffect(() => {
    // Bootstrap'in yüklü olduğundan emin ol
    if (typeof window !== 'undefined') {
      const loadBootstrap = async () => {
        try {
          // Bootstrap'i dinamik olarak yükle
          await import('bootstrap/dist/js/bootstrap.bundle.min.js');
          
          // Carousel'ı başlat
          const carousel = document.getElementById('main-slider');
          if (carousel) {
            console.log('Carousel elementi bulundu, başlatılıyor...');
            new window.bootstrap.Carousel(carousel, {
              interval: 3000,
              wrap: true
            });
          } else {
            console.error('Carousel elementi bulunamadı!');
          }
        } catch (error) {
          console.error('Bootstrap yüklenirken hata:', error);
        }
      };

      loadBootstrap();
    }
  }, []);
  
  const handleImageError = (e) => {
    console.log('Resim yükleme hatası, yedek resim kullanılıyor');
    e.currentTarget.src = 'https://placehold.co/1200x500.png?text=Gorsel+Bulunamadi';
  };

  console.log('MainSlider render ediliyor, slides:', slides);

  if (!slides || slides.length === 0) {
    console.log('Slides verisi boş, null döndürülüyor');
    return null;
  }

  return (
    <div id="main-slider" className="carousel slide mb-5" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            data-bs-target="#main-slider"
            data-bs-slide-to={index}
            className={index === 0 ? 'active' : ''}
            aria-current={index === 0 ? 'true' : 'false'}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div key={slide.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <Link href={slide.linkUrl || '#'}>
              <img 
                src={slide.imageUrl} 
                className="d-block w-100" 
                alt={slide.title} 
                style={{ maxHeight: '500px', objectFit: 'cover', cursor: 'pointer' }}
                onError={handleImageError}
              />
              <div className="carousel-caption d-none d-md-block">
                <h5>{slide.title}</h5>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <>
          <button className="carousel-control-prev" type="button" data-bs-target="#main-slider" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#main-slider" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}
    </div>
  );
} 