import { NextResponse } from 'next/server';
import { addFormSubmission, getConfig } from '@/lib/db';
import { createBot, notifyAdmins } from '@/bot/index';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const formType = formData.get('formType') as string;
    const email = formData.get('email') as string;
    const tgUsername = formData.get('tgUsername') as string;
    const screenshot = formData.get('screenshot') as File | null;
    const tgUserId = (formData.get('tgUserId') as string | null) || '';

    // Validate
    if (!formType || !email || !tgUsername) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
    }

    if (!['CRYPTO', 'USD'].includes(formType)) {
      return NextResponse.json({ error: 'Неверный тип формы' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Неверный email' }, { status: 400 });
    }

    // Save screenshot
    let screenshotPath = '';
    if (screenshot && screenshot.size > 0) {
      if (screenshot.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'Максимальный размер файла — 10MB' }, { status: 400 });
      }

      const ext = screenshot.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

      await mkdir(uploadsDir, { recursive: true });

      const buffer = Buffer.from(await screenshot.arrayBuffer());
      const filePath = path.join(uploadsDir, fileName);
      await writeFile(filePath, buffer);

      screenshotPath = `/uploads/${fileName}`;
    }

    const priceStr = getConfig('price_current') || '0';
    const priceUsd = Number.parseFloat(priceStr) || 0;

    // Save to DB
    const submissionId = addFormSubmission({
      form_type: formType,
      email,
      tg_username: tgUsername,
      tg_user_id: tgUserId || undefined,
      screenshot_path: screenshotPath,
      price_usd: priceUsd,
    });

    // Notify admins via Telegram bot
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (token) {
      try {
        const bot = createBot(token);
        const absScreenshotPath = screenshotPath
          ? path.join(process.cwd(), 'public', screenshotPath)
          : undefined;
        await notifyAdmins(bot, {
          submissionId,
          formType: formType as 'CRYPTO' | 'USD',
          email,
          tgUsername,
          tgUserId: tgUserId || undefined,
          priceUsd,
          screenshotPath: absScreenshotPath,
        });
      } catch (notifyErr) {
        console.error('Failed to notify admins:', notifyErr);
        // Don't fail the form submission if notification fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Form submit error:', err);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
