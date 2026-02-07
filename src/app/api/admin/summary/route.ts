import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminAuth';
import { getPaymentsSummary } from '@/lib/db';

export async function GET(req: Request) {
  const tgId = req.headers.get('x-telegram-user-id');
  if (!isAdmin(tgId ?? undefined)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  return NextResponse.json(getPaymentsSummary());
}
