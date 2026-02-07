'use client';

import { useEffect, useState } from 'react';

export default function AdminButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number } } } } }).Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id;
    if (userId) {
      fetch(`/api/admin/check?tgId=${userId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.isAdmin) setShow(true);
        })
        .catch(() => {});
    }
  }, []);

  if (!show) return null;

  return (
    <a
      href="/admin"
      className="block w-full py-3 px-6 text-center text-white/30 text-xs font-medium hover:text-white/50 transition"
    >
      ⚙️ Админ-панель
    </a>
  );
}
