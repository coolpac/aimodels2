'use client';

import { useEffect, useState } from 'react';
import { adminFetch, adminGet } from '@/lib/useAdminApi';

interface Submission {
  id: number;
  form_type: string;
  email: string;
  tg_username: string;
  tg_user_id?: string;
  screenshot_path: string;
  price_usd: number;
  payment_status: 'pending' | 'paid' | 'unpaid';
  payment_marked_at?: string;
  created_at: string;
}

/** Ссылка в Telegram: по нику (t.me/username) или по ID (tg://user?id=...) */
function tgLink(usernameOrId: string): string {
  const v = usernameOrId.trim();
  if (/^\d+$/.test(v)) return `tg://user?id=${v}`;
  const nick = v.startsWith('@') ? v.slice(1) : v;
  return `https://t.me/${nick}`;
}

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 0,
    form_type: 'CRYPTO',
    email: 'user1@example.com',
    tg_username: '@modelcore_user',
    tg_user_id: '123456789',
    screenshot_path: '',
    price_usd: 450,
    payment_status: 'pending',
    payment_marked_at: '',
    created_at: '2026-02-07 12:30',
  },
  {
    id: 0,
    form_type: 'CRYPTO',
    email: 'client@mail.ru',
    tg_username: '987654321',
    tg_user_id: '987654321',
    screenshot_path: '',
    price_usd: 450,
    payment_status: 'paid',
    payment_marked_at: '2026-02-07 11:30',
    created_at: '2026-02-07 11:15',
  },
  {
    id: 0,
    form_type: 'USD',
    email: 'paypal.user@gmail.com',
    tg_username: '@john_doe',
    tg_user_id: '5550001',
    screenshot_path: '/uploads/mock-screenshot.png',
    price_usd: 450,
    payment_status: 'unpaid',
    payment_marked_at: '2026-02-06 19:05',
    created_at: '2026-02-06 18:45',
  },
];

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [useMock, setUseMock] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    adminGet<Submission[]>('/api/admin/submissions')
      .then((data) => setSubmissions(data || []))
      .catch(console.error);
  }, []);

  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const list = isLocalhost && useMock ? MOCK_SUBMISSIONS : submissions;
  const showingMock = isLocalhost && useMock;

  async function updateStatus(id: number, status: 'paid' | 'unpaid') {
    try {
      setUpdatingId(id);
      const res = await adminFetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = (await res.json()) as Submission;
      setSubmissions((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      console.error(err);
      alert('Не удалось обновить статус');
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-white text-xl font-bold mb-6">Заявки</h1>

      {isLocalhost && (
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setUseMock((v) => !v)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/10 text-white hover:bg-white/15 transition"
          >
            {useMock ? 'Скрыть мок' : 'Показать мок'}
          </button>
          {showingMock && <span className="text-white/40 text-xs">Моковые заявки для проверки интерфейса</span>}
        </div>
      )}

      {list.length === 0 ? (
        <p className="text-white/40 text-sm">Заявок пока нет</p>
      ) : (
        <div className="space-y-3">
          {list.map((s, index) => (
            <div key={showingMock ? `mock-${index}` : s.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  s.form_type === 'CRYPTO' ? 'bg-[#075500]/50 text-[#D3F800]' : 'bg-blue-900/50 text-blue-300'
                }`}>
                  {s.form_type}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  s.payment_status === 'paid'
                    ? 'bg-[#0b7a00]/50 text-[#D3F800]'
                    : s.payment_status === 'unpaid'
                      ? 'bg-red-900/40 text-red-300'
                      : 'bg-yellow-900/40 text-yellow-300'
                }`}>
                  {s.payment_status === 'paid' ? 'Оплачено' : s.payment_status === 'unpaid' ? 'Не оплачено' : 'Ожидает'}
                </span>
                <span className="text-white/40 text-xs">{s.created_at}</span>
                <span className="text-white/30 text-xs">#{s.id}</span>
              </div>
              <div className="text-sm space-y-1">
                <p className="text-white/80">📧 {s.email}</p>
                <p className="text-white/80">
                  📱{' '}
                  <a
                    href={tgLink(s.tg_username)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#D3F800] hover:underline"
                  >
                    {s.tg_username}
                  </a>
                  <span className="text-white/40 text-xs ml-1">(Ник или ID)</span>
                </p>
                <p className="text-white/60 text-xs">💵 Сумма: {s.price_usd}$</p>
                {s.payment_marked_at && (
                  <p className="text-white/40 text-xs">⏱ Статус обновлён: {s.payment_marked_at}</p>
                )}
              </div>
              {s.screenshot_path && (
                <a
                  href={s.screenshot_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D3F800] text-xs mt-2 inline-block hover:underline"
                >
                  📎 Скриншот
                </a>
              )}
              {!showingMock && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={updatingId === s.id}
                    onClick={() => updateStatus(s.id, 'paid')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0b7a00]/60 text-white hover:bg-[#0b7a00]/80 disabled:opacity-60"
                  >
                    ✅ Подтвердить оплату
                  </button>
                  <button
                    type="button"
                    disabled={updatingId === s.id}
                    onClick={() => updateStatus(s.id, 'unpaid')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900/50 text-red-200 hover:bg-red-900/70 disabled:opacity-60"
                  >
                    ❌ Не оплачено
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
