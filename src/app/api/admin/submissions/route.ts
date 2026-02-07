import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/adminAuth';
import { getFormSubmissionById, getFormSubmissions, updateSubmissionStatus } from '@/lib/db';
import { createBot } from '@/bot/index';

export async function GET(req: Request) {
  const tgId = req.headers.get('x-telegram-user-id');
  if (!isAdmin(tgId ?? undefined)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }
  return NextResponse.json(getFormSubmissions());
}

export async function PATCH(req: Request) {
  const tgId = req.headers.get('x-telegram-user-id');
  if (!isAdmin(tgId ?? undefined)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  const status = body.status as 'paid' | 'unpaid';
  if (!id || !['paid', 'unpaid'].includes(status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  updateSubmissionStatus(id, status);
  const updated = getFormSubmissionById(id);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Notify user only when payment is confirmed
  if (status === 'paid') {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      try {
        const bot = createBot(token);
        const chatId = updated.tg_user_id || updated.tg_username;
        if (chatId) {
          await bot.api.sendMessage(chatId, '✅ Оплата принята! Спасибо, доступ будет выдан в течение часа.');
        }
      } catch (err) {
        console.error('Failed to notify user:', err);
      }
    }
  }

  return NextResponse.json(updated);
}
