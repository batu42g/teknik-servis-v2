import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await request.json();
    const serviceId = parseInt(params.id);

    const service = await prisma.service.update({
      where: { id: serviceId },
      data: {
        ...body,
        order: body.order ? parseInt(body.order) : undefined,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined
      }
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('Hizmet güncellenirken hata:', error);
    return NextResponse.json({ error: 'Hizmet güncellenirken hata oluştu' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const serviceId = parseInt(params.id);

    await prisma.service.delete({
      where: { id: serviceId }
    });

    return NextResponse.json({ message: 'Hizmet başarıyla silindi' });
  } catch (error) {
    console.error('Hizmet silinirken hata:', error);
    return NextResponse.json({ error: 'Hizmet silinirken hata oluştu' }, { status: 500 });
  }
} 