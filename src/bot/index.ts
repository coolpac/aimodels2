import { Bot, InlineKeyboard, InputFile } from 'grammy';
import { getBotMessage, getConfig, getAdminIds } from './helpers';
import { getFormSubmissionById, updateSubmissionStatus, upsertBotUser } from '@/lib/db';

// Replace {price}, {wallet}, {network}, {amount}, {exchangers}, {wallet_trc20} placeholders
function tpl(text: string, vars: Record<string, string>): string {
  let result = text;
  for (const [k, v] of Object.entries(vars)) {
    result = result.replaceAll(`{${k}}`, v);
  }
  return result;
}

// Build formatted exchangers list from JSON config
function formatExchangers(jsonStr: string): string {
  try {
    const list = JSON.parse(jsonStr) as { name: string; url: string }[];
    return list.map((e, i) => `${i + 1} ${e.name}\n${e.url}`).join('\n\n');
  } catch {
    return '';
  }
}

export function createBot(token: string) {
  const bot = new Bot(token);

  // Track bot users
  bot.use(async (ctx, next) => {
    const u = ctx.from;
    if (u?.id) {
      upsertBotUser({
        tg_id: String(u.id),
        username: u.username,
        first_name: u.first_name,
        last_name: u.last_name,
      });
    }
    await next();
  });

  const appUrl = () => process.env.NEXT_PUBLIC_APP_URL || '';
  const support = () => getConfig('support_username') || 'modelcoresupport';
  const price = () => getConfig('price_current') || '450';

  function paymentMenuKeyboard() {
    return new InlineKeyboard()
      .text('Картой из ЕС', 'eu_card').row()
      .text('Криптовалютой', 'crypto').row()
      .text('Картой СНГ', 'cis_card').row()
      .text('PayPal', 'paypal').row()
      .url('Поддержка', `https://t.me/${support()}`);
  }

  // ─── /start ───
  bot.command('start', async (ctx) => {
    const payload = ctx.match;
    if (payload === 'pay') {
      const text = getBotMessage('welcome');
      await ctx.reply(text, { reply_markup: paymentMenuKeyboard() });
    } else {
      const text = getBotMessage('welcome_generic');
      await ctx.reply(text);
    }
  });

  // ─── EU Card ───
  bot.callbackQuery('eu_card', async (ctx) => {
    await ctx.answerCallbackQuery();
    const text = tpl(getBotMessage('eu_card_info'), { price: price() });
    const kb = new InlineKeyboard()
      .url('📋 Инструкция по оплате', `${appUrl()}/payment-instruction`)
      .row()
      .webApp('📝 Заполнить форму', `${appUrl()}/form/crypto`)
      .row()
      .url('💬 Связь с тех. поддержкой', `https://t.me/${support()}`)
      .row()
      .text('⬅️ Назад', 'back_main');
    await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'Markdown' });
  });

  // ─── Crypto: network selection ───
  bot.callbackQuery('crypto', async (ctx) => {
    await ctx.answerCallbackQuery();
    const text = getBotMessage('crypto_select');
    const kb = new InlineKeyboard()
      .text('ETHEREUM (ERC20)', 'crypto_erc20').row()
      .text('TRX (TRC20)', 'crypto_trc20').row()
      .text('BNB Smart Chain (BEP20)', 'crypto_bep20').row()
      .url('💬 Связь с тех. поддержкой', `https://t.me/${support()}`)
      .row()
      .text('⬅️ Назад', 'back_main');
    await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'Markdown' });
  });

  // ─── Crypto: wallet for selected network ───
  bot.callbackQuery(/^crypto_(erc20|bep20|trc20)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const network = ctx.match![1];
    const labels: Record<string, string> = { erc20: 'ERC20', bep20: 'BEP20', trc20: 'TRC20' };
    const wallet = getConfig(`wallet_${network}`);
    const text = tpl(getBotMessage('crypto_payment'), {
      price: price(),
      network: labels[network],
      wallet,
    });
    const kb = new InlineKeyboard()
      .webApp('📝 Заполнить форму', `${appUrl()}/form/crypto`)
      .row()
      .url('💬 Связь с тех. поддержкой', `https://t.me/${support()}`)
      .row()
      .text('⬅️ К выбору сети', 'crypto')
      .row()
      .text('⬅️ Назад', 'back_main');
    await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'Markdown' });
  });

  // ─── CIS Card: country selection ───
  bot.callbackQuery('cis_card', async (ctx) => {
    await ctx.answerCallbackQuery();
    const text = getBotMessage('cis_select');
    const kb = new InlineKeyboard()
      .text('🇷🇺 Россия', 'cis_russia').row()
      .text('🇧🇾 Беларусь', 'cis_belarus').row()
      .text('🇺🇦 Украина', 'cis_ukraine').row()
      .text('🇰🇿 Казахстан', 'cis_kazakhstan').row()
      .text('🌍 Другая страна', 'cis_other').row()
      .text('⬅️ Назад', 'back_main');
    await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'Markdown' });
  });

  // ─── CIS: Russia / Ukraine / Kazakhstan ───
  bot.callbackQuery(/^cis_(russia|ukraine|kazakhstan)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const country = ctx.match![1];
    const exchangersJson = getConfig(`cis_${country}_exchangers`);
    const amount = getConfig(`cis_${country}_amount`);
    const walletTrc20 = getConfig('wallet_trc20');
    const text = tpl(getBotMessage(`cis_${country}`), {
      exchangers: formatExchangers(exchangersJson),
      amount,
      price: price(),
      wallet_trc20: walletTrc20,
    });
    const kb = new InlineKeyboard()
      .webApp('📝 Заполнить форму', `${appUrl()}/form/crypto`)
      .row()
      .url('💬 Связь с тех. поддержкой', `https://t.me/${support()}`)
      .row()
      .text('⬅️ К выбору страны', 'cis_card')
      .row()
      .text('⬅️ Назад', 'back_main');
    await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'Markdown' });
  });

  // ─── CIS: Belarus ───
  bot.callbackQuery('cis_belarus', async (ctx) => {
    await ctx.answerCallbackQuery();
    const text = getBotMessage('cis_belarus');
    const kb = new InlineKeyboard()
      .url('💬 Связь с тех. поддержкой', `https://t.me/${support()}`)
      .row()
      .text('⬅️ К выбору страны', 'cis_card')
      .row()
      .text('⬅️ Назад', 'back_main');
    await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'Markdown' });
  });

  // ─── CIS: Other country ───
  bot.callbackQuery('cis_other', async (ctx) => {
    await ctx.answerCallbackQuery();
    const text = getBotMessage('cis_other');
    const kb = new InlineKeyboard()
      .url('💬 Связь с тех. поддержкой', `https://t.me/${support()}`)
      .row()
      .text('⬅️ К выбору страны', 'cis_card')
      .row()
      .text('⬅️ Назад', 'back_main');
    await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'Markdown' });
  });

  // ─── PayPal ───
  bot.callbackQuery('paypal', async (ctx) => {
    await ctx.answerCallbackQuery();
    const text = getBotMessage('paypal_info');
    const sellyUrl = getConfig('selly_url');
    const kb = new InlineKeyboard()
      .url('💳 Оплатить через PayPal', sellyUrl)
      .row()
      .webApp('📝 Заполнить форму', `${appUrl()}/form/usd`)
      .row()
      .url('💬 Связь с тех. поддержкой', `https://t.me/${support()}`)
      .row()
      .text('⬅️ Назад', 'back_main');
    await ctx.editMessageText(text, { reply_markup: kb, parse_mode: 'Markdown' });
  });

  // ─── Back to payment menu ───
  bot.callbackQuery('back_main', async (ctx) => {
    await ctx.answerCallbackQuery();
    const text = getBotMessage('welcome');
    await ctx.editMessageText(text, { reply_markup: paymentMenuKeyboard() });
  });

  // ─── Admin: confirm / unpaid payment ───
  bot.callbackQuery(/^admin_pay:(paid|unpaid):(\d+)$/, async (ctx) => {
    const adminId = ctx.from?.id;
    if (!adminId || !getAdminIds().includes(adminId)) {
      await ctx.answerCallbackQuery({ text: 'Недостаточно прав', show_alert: true });
      return;
    }

    const status = ctx.match![1] as 'paid' | 'unpaid';
    const id = Number(ctx.match![2]);
    updateSubmissionStatus(id, status);
    const submission = getFormSubmissionById(id);

    if (status === 'paid' && submission) {
      const chatId = submission.tg_user_id || submission.tg_username;
      if (chatId) {
        try {
          await bot.api.sendMessage(chatId, '✅ Оплата принята! Спасибо, доступ будет выдан в течение часа.');
        } catch (err) {
          console.error('Failed to notify user:', err);
        }
      }
    }

    await ctx.answerCallbackQuery({ text: status === 'paid' ? 'Оплата подтверждена' : 'Отмечено как не оплачено' });
    if (submission) {
      const statusText = status === 'paid' ? '✅ Оплачено' : '❌ Не оплачено';
      const extra = `\n\nСтатус: ${statusText}`;
      try {
        if (ctx.callbackQuery.message?.photo) {
          await ctx.editMessageCaption({ caption: `${ctx.callbackQuery.message.caption || ''}${extra}`.trim(), parse_mode: 'Markdown' });
        } else if (ctx.callbackQuery.message?.text) {
          await ctx.editMessageText(`${ctx.callbackQuery.message.text}${extra}`, { parse_mode: 'Markdown' });
        }
      } catch (err) {
        console.error('Failed to edit admin message:', err);
      }
    }
  });

  return bot;
}

// ─── Notify admins about new form submission ───
export async function notifyAdmins(
  bot: Bot,
  data: {
    submissionId: number;
    formType: 'CRYPTO' | 'USD';
    email: string;
    tgUsername: string;
    tgUserId?: string;
    priceUsd?: number;
    screenshotPath?: string;
  }
) {
  const adminIds = getAdminIds();
  const now = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
  const priceLine = data.priceUsd ? `\n💵 Сумма: ${data.priceUsd}$` : '';
  const tgLine = data.tgUserId ? `${data.tgUsername} (ID: ${data.tgUserId})` : data.tgUsername;
  const text = `🔔 *[${data.formType}] Новая заявка* #${data.submissionId}\n\n📧 Email: ${data.email}\n📱 Telegram: ${tgLine}${priceLine}\n📅 ${now}`;
  const kb = new InlineKeyboard()
    .text('✅ Подтвердить оплату', `admin_pay:paid:${data.submissionId}`).row()
    .text('❌ Не оплачено', `admin_pay:unpaid:${data.submissionId}`);

  for (const adminId of adminIds) {
    try {
      if (data.screenshotPath) {
        await bot.api.sendPhoto(adminId, new InputFile(data.screenshotPath), {
          caption: text,
          parse_mode: 'Markdown',
          reply_markup: kb,
        });
      } else {
        await bot.api.sendMessage(adminId, text, { parse_mode: 'Markdown', reply_markup: kb });
      }
    } catch (err) {
      console.error(`Failed to notify admin ${adminId}:`, err);
    }
  }
}
