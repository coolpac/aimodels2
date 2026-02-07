import { webhookCallback } from 'grammy';
import { createBot } from '@/bot/index';

const token = process.env.TELEGRAM_BOT_TOKEN;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let handler: ((req: Request) => Promise<Response>) | null = null;

function getHandler() {
  if (!handler && token) {
    const bot = createBot(token);
    handler = webhookCallback(bot, 'std/http') as unknown as (req: Request) => Promise<Response>;
  }
  return handler;
}

export async function POST(req: Request) {
  const h = getHandler();
  if (!h) {
    return new Response('Bot token not configured', { status: 500 });
  }
  return h(req);
}
