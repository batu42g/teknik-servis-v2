import { NextResponse } from 'next/server';
import prisma from '../../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    const { status } = await request.json();
    const orderId = parseInt(params.id);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            rating: true,
            product: { 
              select: { 
                name: true,
                price: true 
              } 
            }
          }
        }
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Sipariş güncelleme hatası:', error);
    return NextResponse.json({ error: 'Sipariş güncellenirken bir hata oluştu.' }, { status: 500 });
  }
} 