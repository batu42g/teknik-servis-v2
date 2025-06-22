import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

// Giden kutusunu getirir
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });

  const messages = await prisma.privateMessage.findMany({
    where: { senderId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { recipient: { select: { name: true } } }
  });
  return NextResponse.json(messages);
}