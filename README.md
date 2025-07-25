# Teknik Servis Web Sitesi

Bu proje, teknik servis randevu yönetimi ve ürün satışı için geliştirilmiş modern bir web uygulamasıdır. Next.js 14, Tailwind CSS ve Prisma teknolojileri kullanılarak oluşturulmuştur.

## ✨ Özellikler

### 👤 Kullanıcı Sistemi
- Modern kayıt/giriş sayfaları (Glass Morphism tasarım)
- Kullanıcı profil yönetimi
- Real-time durum güncellemeleri

### 📅 Randevu & Servis Yönetimi
- Dinamik randevu sistemi
- Teknik servis durumu takibi
- Admin paneli ile randevu yönetimi

### 🛍 E-Ticaret
- Ürün katalogu ve detay sayfaları
- Sepet sistemi ve sipariş yönetimi
- Ürün rating ve değerlendirme sistemi

### 🎨 Modern Tasarım
- Responsive ve mobile-first tasarım
- Interactive slider sistemi
- Smooth animations ve hover efektleri
- Glass morphism ve gradient backgrounds

### 👨‍💼 Admin Paneli
- Kapsamlı yönetim paneli
- Slider, servis ve ürün yönetimi
- Kullanıcı ve sipariş takibi
- Real-time istatistikler

## 🚀 Teknolojiler

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library

### Backend & Database
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Production database
- **NextAuth.js** - Authentication system

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 📦 Kurulum

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/batu42g/teknik-servis-v2.git
cd teknik-servis-v2
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Environment Variables
`.env` dosyası oluşturun:
```env
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Veritabanı Kurulumu
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Development Server
```bash
npm run dev
```

## 🌐 Kullanım

- **Web sitesi:** `http://localhost:3000`
- **Admin paneli:** `http://localhost:3000/admin`
- **Varsayılan admin:** 
  - Email: `admin@teknikservis.com`
  - Şifre: `admin123`

## 📱 Sayfalar

### Kullanıcı Sayfaları
- **Ana Sayfa** - Hero slider ve hizmet kartları
- **Ürünler** - Ürün kataloğu ve detayları
- **Randevu Al** - Servis randevu formu
- **İletişim** - İletişim bilgileri ve form
- **Profil** - Kullanıcı bilgileri ve siparişler

### Admin Sayfaları
- **Dashboard** - Genel istatistikler
- **Slider Yönetimi** - Ana sayfa slider kontrolü
- **Hizmet Yönetimi** - Dinamik hizmet kartları
- **Ürün Yönetimi** - Ürün CRUD işlemleri
- **Randevu Yönetimi** - Randevu durumu kontrolü
- **Kullanıcı Yönetimi** - Kullanıcı administrasyonu

## 🔐 Güvenlik

- NextAuth.js ile güvenli authentication
- JWT token tabanlı oturum yönetimi
- Admin route protection
- Input validation ve sanitization

## 🎨 Tasarım Özellikleri

- **Modern UI/UX** - Tailwind CSS ile responsive tasarım
- **Glass Morphism** - Modern cam efekti tasarımlar
- **Smooth Animations** - Kullanıcı deneyimi için akıcı geçişler
- **Interactive Elements** - Hover efektleri ve micro-interactions
- **Mobile-First** - Tüm cihazlarda optimize edilmiş deneyim

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🚨 Production Notes

1. **Environment Variables'ı güncelleyin**
2. **Database connection string'i production'a ayarlayın**
3. **NEXTAUTH_SECRET'i güçlü bir değerle değiştirin**
4. **Admin hesap bilgilerini değiştirin**

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın 