import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        items: {
          select: {
            id: true,
            quantity: true,
            rating: true,
            product: { select: { name: true } }
          }
        }
      },
    });

    const response = NextResponse.json(orders);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '-1');
    return response;
  } catch (error) {
    console.error('Admin orders API error:', error);
    return NextResponse.json({ error: 'Siparişler getirilemedi.' }, { status: 500 });
  }
}