'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin/dashboard', label: 'Дашборд' },
  { href: '/admin/analytics', label: 'Аналитика' },
  { href: '/admin/messages', label: 'Тексты бота' },
  { href: '/admin/prices', label: 'Цены' },
  { href: '/admin/crypto', label: 'Кошельки' },
  { href: '/admin/cis-links', label: 'CIS ссылки' },
  { href: '/admin/banners', label: 'Баннеры' },
  { href: '/admin/submissions', label: 'Заявки' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tgId, setTgId] = useState<string>('');

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number } } } } }).Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    // Временно: на локалке входим без TG (dev)
    if (isLocalhost && !userId) {
      setTgId('localhost');
      fetch(`/api/admin/check?tgId=localhost`)
        .then((r) => r.json())
        .then((d) => {
          setAuthorized(d.isAdmin === true);
          setChecking(false);
        })
        .catch(() => setChecking(false));
      return;
    }

    if (userId) {
      const id = String(userId);
      setTgId(id);
      fetch(`/api/admin/check?tgId=${id}`)
        .then((r) => r.json())
        .then((d) => {
          setAuthorized(d.isAdmin === true);
          setChecking(false);
        })
        .catch(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F0F0F' }}>
        <p className="text-white/50 text-sm">Проверка доступа...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0F0F0F' }}>
        <div className="text-center">
          <p className="text-white text-lg font-bold mb-2">Доступ запрещён</p>
          <p className="text-white/50 text-sm">Админ-панель доступна только администраторам.</p>
          <Link href="/" className="text-[#D3F800] text-sm mt-4 block hover:underline">← На главную</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#0F0F0F' }}>
      {/* Top nav */}
      <nav className="border-b border-white/10 px-4 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <Link href="/admin" className="text-gradient font-bold text-lg">ADMIN</Link>
          <Link href="/" className="text-white/40 text-sm hover:text-white/70 transition">← Сайт</Link>
        </div>
      </nav>

      <div className="max-w-[1200px] mx-auto px-4 py-4 lg:flex lg:gap-6">
        {/* Sidebar */}
        <aside className="lg:w-[200px] shrink-0 mb-4 lg:mb-0">
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === item.href
                    ? 'bg-white/10 text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0" data-tg-id={tgId}>
          {children}
        </main>
      </div>
    </div>
  );
}
