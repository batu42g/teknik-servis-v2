import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: 'asc' },
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, password, adSoyad, telefon, role } = await request.json();

    if (!email || !password || !adSoyad) {
      return NextResponse.json({ error: 'Ad Soyad, email ve şifre zorunludur.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Bu email zaten kullanımda.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: adSoyad, // 'name' alanını adSoyad ile doldur
        adSoyad: adSoyad,
        email: email,
        phone: telefon, // Hata 'telefon' -> 'phone' olarak düzeltildi
        password: hashedPassword,
        role: role || 'user',
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Kullanıcı oluşturulurken hata oluştu:', error);
    return NextResponse.json({ error: 'Kullanıcı oluşturulurken bir sunucu hatası oluştu. Lütfen terminali kontrol edin.' }, { status: 500 });
  }
}