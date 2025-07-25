'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MainSlider({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, 5000); // 5 saniyede bir slide değiştir

    return () => clearInterval(interval);
  }, [slides]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const handleImageError = (e) => {
    e.currentTarget.src = 'https://placehold.co/1200x500.png?text=Gorsel+Bulunamadi';
  };

  if (!slides || slides.length === 0) {
    return null;
  }



  return (
    <div className="relative w-full" style={{ height: '500px' }}>
      <div className="relative h-full overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Link href={slide.linkUrl || '#'}>
              <img
                src={slide.imageUrl}
                className="w-full h-full object-cover"
                alt={slide.title}
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center">
                <div className="text-white text-center p-8 max-w-2xl">
                  <h5 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-2xl">{slide.title}</h5>
                  <div className="w-16 h-1 bg-white/70 mx-auto rounded-full"></div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all duration-300 hover:scale-110 text-white border border-white/20"
            aria-label="Previous slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-black/40 backdrop-blur-sm p-3 rounded-full hover:bg-black/60 transition-all duration-300 hover:scale-110 text-white border border-white/20"
            aria-label="Next slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 rounded-full border border-white/30 backdrop-blur-sm hover:scale-125 ${
              index === currentIndex 
                ? 'w-12 h-3 bg-white/90' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 