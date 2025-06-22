import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Tarih parametresi gerekli.' }, { status: 400 });
    }

    // Seçilen tarihteki tüm aktif randevuları getir
    const appointments = await prisma.appointment.findMany({
      where: {
        date: new Date(date),
        status: {
          notIn: ['CANCELLED'] // İptal edilmiş randevuları saymıyoruz
        }
      },
      select: {
        time: true
      }
    });

    // Her saat için randevu sayısını hesapla
    const slots = appointments.reduce((acc, curr) => {
      acc[curr.time] = (acc[curr.time] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json(slots);
  } catch (error) {
    console.error('Randevu müsaitliği kontrolü hatası:', error);
    return NextResponse.json({ error: 'Randevu müsaitliği kontrol edilemedi.' }, { status: 500 });
  }
} 