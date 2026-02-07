'use client';

import { useEffect, useState } from 'react';
import { adminGet } from '@/lib/useAdminApi';

type Summary = {
  paid_count: number;
  paid_total: number;
  unpaid_count: number;
  pending_count: number;
};

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    adminGet<Summary>('/api/admin/summary').then(setSummary).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="text-white text-xl font-bold mb-6">Дашборд</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/50 text-xs mb-2">Подтверждённые оплаты</p>
          <p className="text-white text-2xl font-bold">{summary?.paid_count ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/50 text-xs mb-2">Сумма подтверждённых</p>
          <p className="text-[#D3F800] text-2xl font-bold">
            {summary?.paid_total ?? 0}$
          </p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/50 text-xs mb-2">Ожидают подтверждения</p>
          <p className="text-yellow-300 text-2xl font-bold">{summary?.pending_count ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/50 text-xs mb-2">Отмечены «не оплачено»</p>
          <p className="text-red-300 text-2xl font-bold">{summary?.unpaid_count ?? 0}</p>
        </div>
      </div>

      <p className="text-white/40 text-xs mt-4">
        Сумма считается по заявкам со статусом «Оплачено».
      </p>
    </div>
  );
}
