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
            order: { userId: session.user.id }
        }
    });

    if (!orderItem) {
        return NextResponse.json({ error: 'Geçersiz işlem.' }, { status: 403 });
    }

    await prisma.orderItem.update({
      where: { id: id },
      data: { rating: parseInt(rating) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Puanlama başarısız.' }, { status: 500 });
  }
}