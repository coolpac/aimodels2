import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminAuth';
import { getAllBotMessages, updateBotMessage } from '@/lib/db';

function checkAuth(req: Request): boolean {
  const tgId = req.headers.get('x-telegram-user-id');
  return isAdmin(tgId ?? undefined);
}

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  return NextResponse.json(getAllBotMessages());
}

export async function PUT(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { key, content } = body;
  if (!key || typeof content !== 'string') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
  updateBotMessage(key, content);
  return NextResponse.json({ success: true });
}
