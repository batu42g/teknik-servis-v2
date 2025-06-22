/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // DÜZELTİLMİŞ BÖLÜM:
      // Pexels'den gelen resimler için doğru hostname'i ekliyoruz.
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // Başka bir siteden resim eklemek isterseniz,
      // o sitenin resim alan adını buraya ekleyebilirsiniz.
    ],
    domains: ['images.unsplash.com'],
  },
  // Önbellek kontrolü için eklenen ayarlar
  onDemandEntries: {
    // Sayfaların bellekte tutulma süresi (ms)
    maxInactiveAge: 10 * 1000,
    // Aynı anda bellekte tutulacak sayfa sayısı
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
