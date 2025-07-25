import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Hizmetler alınırken hata:', error);
    return NextResponse.json({ error: 'Hizmetler alınırken hata oluştu' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, imageUrl, linkUrl, order, isActive } = body;

    const service = await prisma.service.create({
      data: {
        title,
        description,
        imageUrl,
        linkUrl,
        order: parseInt(order),
        isActive: Boolean(isActive)
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Hizmet oluşturulurken hata:', error);
    return NextResponse.json({ error: 'Hizmet oluşturulurken hata oluştu' }, { status: 500 });
  }
} 