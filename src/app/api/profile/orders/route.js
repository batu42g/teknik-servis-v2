import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import prisma from '../../../../lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        user: {
          email: session.user.email
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Sipariş detaylarını düzenle
    const formattedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        price: item.product.price, // Ürünün fiyatını ekle
        total: item.product.price * item.quantity // Toplam tutarı hesapla
      }))
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Siparişler alınırken hata:', error);
    return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
  }
}