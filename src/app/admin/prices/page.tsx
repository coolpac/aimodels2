'use client';

import { useEffect, useState } from 'react';
import { adminGet, adminPut } from '@/lib/useAdminApi';

export default function PricesPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminGet<{ key: string; value: string }[]>('/api/admin/config')
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((c) => (map[c.key] = c.value));
        setConfig(map);
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminPut('/api/admin/config', { key: 'price_current', value: config.price_current || '450' });
      await adminPut('/api/admin/config', { key: 'price_old', value: config.price_old || '600' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-white text-xl font-bold mb-6">Цены</h1>
      <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-4 max-w-md">
        <div>
          <label className="text-white/70 text-sm font-medium mb-1.5 block">Текущая цена ($)</label>
          <input
            type="text"
            value={config.price_current || ''}
            onChange={(e) => setConfig({ ...config, price_current: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#D3F800]/50 transition"
          />
        </div>
        <div>
          <label className="text-white/70 text-sm font-medium mb-1.5 block">Старая цена ($)</label>
          <input
            type="text"
            value={config.price_old || ''}
            onChange={(e) => setConfig({ ...config, price_old: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#D3F800]/50 transition"
          />
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-[#075500] text-white text-sm font-medium hover:bg-[#096800] transition disabled:opacity-50"
        >
          {saving ? 'Сохранение...' : saved ? '✓ Сохранено' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
}
