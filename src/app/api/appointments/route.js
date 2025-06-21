import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import { verifyAuth } from '../../../lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request) {
  try {
    const userPayload = await verifyAuth(request);
    if (!userPayload) {
      return NextResponse.json({ error: 'Bu işlemi yapmak için giriş yapmalısınız.' }, { status: 401 });
    }

    const body = await request.json();
    // Yeni alanları alıyoruz
    const { serviceType, description, date, time, phone, address } = body;

    if (!serviceType || !description || !date || !time || !phone || !address) {
      return NextResponse.json({ error: 'Tüm alanlar zorunludur.' }, { status: 400 });
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        userId: userPayload.id,
        serviceType,
        description,
        date: new Date(date),
        time,
        phone, // Veritabanına ekle
        address, // Veritabanına ekle
        status: 'pending',
      },
    });

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Randevu oluşturulamadı.' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const userPayload = await verifyAuth(request);
    if (!userPayload) {
      return NextResponse.json({ error: 'Bu işlemi yapmak için giriş yapmalısınız.' }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        userId: userPayload.id
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