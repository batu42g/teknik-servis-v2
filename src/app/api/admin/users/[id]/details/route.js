import prisma from '../../../../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
      return NextResponse.json({ error: 'Geçersiz kullanıcı ID.' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
    });

    const appointments = await prisma.appointment.findMany({
      where: { userId: id },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ user, orders, appointments });
  } catch (error) {
    console.error('Kullanıcı detayları alınırken hata:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 