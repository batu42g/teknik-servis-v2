import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

/**
 * @description Kullanıcı girişi yapar ve JWT token'ı bir HTTPOnly cookie olarak ayarlar.
 * POST /api/auth/login
 */
export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Gelen veriyi kontrol et
    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre alanları zorunludur.' },
        { status: 400 }
      );
    }

    // 2. Kullanıcıyı veritabanında e-posta ile bul
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 3. Kullanıcı yoksa veya şifre yanlışsa hata ver
    if (!user) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre.' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Geçersiz e-posta veya şifre.' },
        { status: 401 }
      );
    }

    // 4. Şifre doğruysa, JWT (JSON Web Token) oluştur
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '1d' } // Token 1 gün geçerli
    );

    // 5. Cevap olarak göndermeden önce kullanıcı nesnesinden şifreyi kaldır
    const { password: _, ...userWithoutPassword } = user;
    
    // 6. JSON cevabını oluştur
    const response = NextResponse.json({
      message: 'Giriş başarılı!',
      user: userWithoutPassword,
    });

    // 7. Token'ı güvenli bir HTTP-Only çerez olarak ayarla
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true, // Çerezin sadece sunucu tarafından okunmasını sağlar, JavaScript erişemez.
      secure: process.env.NODE_ENV === 'production', // Sadece HTTPS üzerinde gönderilir.
      path: '/', // Sitenin tamamında geçerli olur.
      maxAge: 60 * 60 * 24, // 1 gün (saniye cinsinden)
    });

    return response;

  } catch (error) {
    console.error('Giriş API Hatası:', error);
    return NextResponse.json(
      { error: 'Giriş yapılırken bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}

// GET /api/auth/profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Profil bilgileri alınırken hata:', error);
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}

// PUT /api/auth/profile
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 });
    }

    const data = await request.json();
    const { name, email, phone, address, currentPassword, newPassword } = data;

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı.' }, { status: 404 });
    }

    // Şifre değişikliği varsa kontrol et
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Mevcut şifrenizi girmelisiniz.' }, { status: 400 });
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Mevcut şifreniz yanlış.' }, { status: 400 });
      }
    }

    // Email değişikliği varsa ve yeni email başka bir kullanıcı tarafından kullanılıyorsa kontrol et
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json({ error: 'Bu email adresi başka bir kullanıcı tarafından kullanılıyor.' }, { status: 400 });
      }
    }

    // Kullanıcıyı güncelle
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        email,
        phone,
        address,
        ...(newPassword && { password: await bcrypt.hash(newPassword, 10) }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Profil güncellenirken hata:', error);
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}
