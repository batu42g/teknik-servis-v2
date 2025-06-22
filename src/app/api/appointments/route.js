import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

const MAX_APPOINTMENTS_PER_SLOT = 2;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Bu işlemi yapmak için giriş yapmalısınız.' }, { status: 401 });
    }

    const body = await request.json();
    const { serviceType, description, date, time, phone, address } = body;

    if (!serviceType || !description || !date || !time || !phone || !address) {
      return NextResponse.json({ error: 'Tüm alanlar zorunludur.' }, { status: 400 });
    }

    // Aynı tarih ve saatteki randevu sayısını kontrol et
    const existingAppointments = await prisma.appointment.count({
      where: {
        date: new Date(date),
        time: time,
        status: {
          notIn: ['CANCELLED'] // İptal edilmiş randevuları saymıyoruz
        }
      }
    });

    if (existingAppointments >= MAX_APPOINTMENTS_PER_SLOT) {
      return NextResponse.json({ 
        error: 'Bu saat dilimi için randevu kontenjanı dolu. Lütfen başka bir saat seçiniz.' 
      }, { status: 400 });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        serviceType,
        description,
        date: new Date(date),
        time,
        phone,
        address,
        status: 'PENDING',
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error('Randevu oluşturma hatası:', error);
    return NextResponse.json({ error: 'Randevu oluşturulamadı.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Bu işlemi yapmak için giriş yapmalısınız.' }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const response = NextResponse.json(appointments);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '-1');
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Randevular getirilemedi.' }, { status: 500 });
  }
}