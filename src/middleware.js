import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Use next-auth's getToken instead of custom verification
  const token = await getToken({ 
    req: request,
    secret: process.env.JWT_SECRET || 'your-super-secret-key-that-is-long-enough'
  });

  // 1. Kural: Admin giriş sayfasını kontrol et
  if (pathname.startsWith('/admin/login')) {
    // Eğer kullanıcı zaten giriş yapmış ve admin ise, onu ana panele yönlendir.
    if (token && token.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Değilse, giriş sayfasını görmesine izin ver.
    return NextResponse.next();
  }

  // 2. Kural: Diğer tüm admin sayfalarını koru
  if (pathname.startsWith('/admin')) {
    // Eğer kullanıcı giriş yapmamışsa VEYA rolü admin değilse, giriş sayfasına yönlendir.
    if (!token || token.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 3. Kural: Profil sayfasını koru
  if (pathname.startsWith('/profile')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Eğer tüm kontrollerden geçtiyse, isteğin devam etmesine izin ver.
  return NextResponse.next();
}

export const config = {
  // Middleware'in sadece bu sayfalarda çalışmasını sağla.
  matcher: ['/admin/:path*', '/profile/:path*'],
};