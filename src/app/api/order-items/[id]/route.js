import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 });

  try {
    const id = parseInt(params.id);
    const { rating } = await request.json();
    
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        id: id,
        order: { 
          userId: session.user.id
        }
      },
      include: {
        order: true,
        product: {
          select: {
            name: true
          }
        }
      }
    });

    if (!orderItem) {
      return NextResponse.json({ error: 'Geçersiz işlem. Bu ürünü puanlama yetkiniz yok.' }, { status: 403 });
    }

    // Zaten puanlanmış mı kontrol et
    if (orderItem.rating) {
      return NextResponse.json({ error: 'Bu ürün zaten puanlanmış.' }, { status: 400 });
    }

    const updatedItem = await prisma.orderItem.update({
      where: { id: id },
      data: { rating: parseInt(rating) },
      include: {
        product: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `${updatedItem.product.name} için puanınız başarıyla kaydedildi.`
    });
  } catch (error) {
    console.error('Puanlama hatası:', error);
    return NextResponse.json({ error: 'Puanlama başarısız.' }, { status: 500 });
  }
}