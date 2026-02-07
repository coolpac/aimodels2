import { NextResponse } from 'next/server';
import { getBanners } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const carousel = searchParams.get('carousel') || 'feature';
  const data = getBanners(carousel);
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=300',
    },
  });
}
