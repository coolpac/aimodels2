'use client';

import { useEffect, useState } from 'react';
import { adminGet, adminPut } from '@/lib/useAdminApi';

const MESSAGE_LABELS: Record<string, string> = {
  welcome: 'Приветствие (стартовое сообщение)',
  eu_card_info: 'EU Card — инструкция',
  crypto_select: 'Crypto — выбор сети',
  crypto_erc20: 'Crypto — ERC20',
  crypto_bep20: 'Crypto — BEP20',
  crypto_trc20: 'Crypto — TRC20',
  cis_select: 'CIS Card — выбор страны',
  cis_russia: 'CIS — Россия',
  cis_ukraine: 'CIS — Украина',
  cis_kazakhstan: 'CIS — Казахстан',
  cis_uzbekistan: 'CIS — Узбекистан',
  paypal_info: 'PayPal — информация',
  form_success: 'Сообщение после отправки формы',
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<{ key: string; content: string }[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    adminGet<{ key: string; content: string }[]>('/api/admin/messages').then(setMessages).catch(console.error);
  }, []);

  const handleSave = async (key: string, content: string) => {
    setSaving(key);
    try {
      await adminPut('/api/admin/messages', { key, content });
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <h1 className="text-white text-xl font-bold mb-6">Тексты бота</h1>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.key} className="rounded-xl bg-white/5 border border-white/10 p-4">
            <label className="text-white/70 text-sm font-medium mb-2 block">
              {MESSAGE_LABELS[msg.key] || msg.key}
            </label>
            <textarea
              defaultValue={msg.content}
              onChange={(e) => {
                const idx = messages.findIndex((m) => m.key === msg.key);
                if (idx >= 0) {
                  const copy = [...messages];
                  copy[idx] = { ...copy[idx], content: e.target.value };
                  setMessages(copy);
                }
              }}
              rows={4}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#D3F800]/50 transition resize-y"
            />
            <button
              onClick={() => handleSave(msg.key, messages.find((m) => m.key === msg.key)?.content || '')}
              disabled={saving === msg.key}
              className="mt-2 px-4 py-1.5 rounded-lg bg-[#075500] text-white text-xs font-medium hover:bg-[#096800] transition disabled:opacity-50"
            >
              {saving === msg.key ? 'Сохранение...' : saved === msg.key ? '✓ Сохранено' : 'Сохранить'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
