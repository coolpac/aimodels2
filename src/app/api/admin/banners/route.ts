import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminAuth';
import { getAllBanners, addBanner, deleteBanner, updateBannerOrder } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

function checkAuth(req: Request): boolean {
  const tgId = req.headers.get('x-telegram-user-id');
  return isAdmin(tgId ?? undefined);
}

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  return NextResponse.json(getAllBanners());
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get('image') as File | null;
  const carouselId = (formData.get('carouselId') as string) || 'feature';
  const orderIndex = parseInt((formData.get('orderIndex') as string) || '0', 10);

  if (!file || file.size === 0) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  const fileName = `banner-${Date.now()}.webp`;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  let outBuffer = buffer;
  try {
    outBuffer = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  } catch {
    // If optimization fails, fallback to original buffer
    outBuffer = buffer;
  }
  await writeFile(path.join(uploadsDir, fileName), outBuffer);

  const imagePath = `/uploads/${fileName}`;
  const id = addBanner(carouselId, imagePath, orderIndex);

  return NextResponse.json({ id, image_path: imagePath });
}

export async function PATCH(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const order = body.order as { id: number; order_index: number }[] | undefined;
  if (!Array.isArray(order) || order.length === 0) {
    return NextResponse.json({ error: 'Invalid order' }, { status: 400 });
  }
  const updates = order.map((o) => ({
    id: Number(o.id),
    order_index: Number(o.order_index),
  })).filter((o) => !isNaN(o.id) && !isNaN(o.order_index));
  updateBannerOrder(updates);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }
  deleteBanner(id);
  return NextResponse.json({ success: true });
}
