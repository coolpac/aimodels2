import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminAuth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tgId = searchParams.get('tgId');

  if (!tgId) {
    return NextResponse.json({ isAdmin: false });
  }

  return NextResponse.json({ isAdmin: isAdmin(tgId) });
}
