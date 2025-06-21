const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@teknikservis.com' },
      update: {},
      create: {
        email: 'admin@teknikservis.com',
        password: hashedPassword,
        name: 'Admin',
        adSoyad: 'Admin User',
        role: 'admin',
      },
    });

    console.log('Admin user created:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 