import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminAuth';
import { getAllConfig, updateConfig } from '@/lib/db';

function checkAuth(req: Request): boolean {
  const tgId = req.headers.get('x-telegram-user-id');
  return isAdmin(tgId ?? undefined);
}

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  return NextResponse.json(getAllConfig());
}

export async function PUT(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json();
  const { key, value } = body;
  if (!key || typeof value !== 'string') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }
  updateConfig(key, value);
  return NextResponse.json({ success: true });
}
