const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function createAdmin() {
  console.log('Admin kullanıcısı oluşturuluyor...');

  const adminEmail = 'admin@teknikservis.com';
  const adminPassword = 'admin123';
  
  // Şifreyi güvenli bir şekilde hash'liyoruz
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  try {
    // Admin kullanıcısı var mı diye kontrol et
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('Admin kullanıcısı zaten mevcut.');
    } else {
      // Eğer yoksa, yeni admin kullanıcısını oluştur
      const adminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Admin',
          adSoyad: 'Sistem Yöneticisi',
          role: 'admin',
        },
      });
      console.log('Admin kullanıcısı başarıyla oluşturuldu:', adminUser.email);
    }
  } catch (error) {
    console.error('Admin kullanıcısı oluşturulurken bir hata oluştu:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 