'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function MainSlider({ slides }) {
  useEffect(() => {
    // Bootstrap'in yüklü olduğundan emin ol
    if (typeof window !== 'undefined') {
      // Bootstrap carousel'ı başlat
      const carousel = document.getElementById('main-slider');
      if (carousel) {
        new bootstrap.Carousel(carousel, {
          interval: 3000, // 3 saniyede bir geçiş yap
          wrap: true // Sondan başa dön
        });
      }
    }
  }, []);
  
  const handleImageError = (e) => {
    e.currentTarget.src = 'https://placehold.co/1200x500.png?text=Gorsel+Bulunamadi';
  };

  if (!slides || slides.length === 0) {
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