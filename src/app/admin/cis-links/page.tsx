'use client';

import { useEffect, useState } from 'react';
import { adminGet, adminPut } from '@/lib/useAdminApi';

interface Exchanger { name: string; url: string }

const COUNTRIES = [
  { id: 'russia', label: '🇷🇺 Россия', currency: 'RUB' },
  { id: 'ukraine', label: '🇺🇦 Украина', currency: 'UAH' },
  { id: 'kazakhstan', label: '🇰🇿 Казахстан', currency: 'KZT' },
];

export default function CisLinksPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    adminGet<{ key: string; value: string }[]>('/api/admin/config')
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((c) => (map[c.key] = c.value));
        setConfig(map);
      })
      .catch(console.error);
  }, []);

  const getExchangers = (countryId: string): Exchanger[] => {
    try {
      return JSON.parse(config[`cis_${countryId}_exchangers`] || '[]');
    } catch {
      return [];
    }
  };

  const setExchangers = (countryId: string, exchangers: Exchanger[]) => {
    setConfig({ ...config, [`cis_${countryId}_exchangers`]: JSON.stringify(exchangers) });
  };

  const handleSave = async (countryId: string) => {
    const exchKey = `cis_${countryId}_exchangers`;
    const amountKey = `cis_${countryId}_amount`;
    setSaving(countryId);
    try {
      await adminPut('/api/admin/config', { key: exchKey, value: config[exchKey] || '[]' });
      await adminPut('/api/admin/config', { key: amountKey, value: config[amountKey] || '' });
      setSaved(countryId);
      setTimeout(() => setSaved(null), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div>
      <h1 className="text-white text-xl font-bold mb-6">CIS Ссылки обменников</h1>
      <div className="space-y-6 max-w-xl">
        {COUNTRIES.map(({ id, label, currency }) => {
          const exchangers = getExchangers(id);
          return (
            <div key={id} className="rounded-xl bg-white/5 border border-white/10 p-4">
              <h3 className="text-white font-bold text-sm mb-3">{label}</h3>

              {/* Amount in local currency */}
              <label className="text-white/50 text-xs mb-1 block">Сумма в {currency}</label>
              <input
                type="text"
                value={config[`cis_${id}_amount`] || ''}
                onChange={(e) => setConfig({ ...config, [`cis_${id}_amount`]: e.target.value })}
                placeholder={`Напр: 34 000 ${currency}`}
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#D3F800]/50 transition mb-3"
              />

              {/* Exchangers list */}
              <label className="text-white/50 text-xs mb-2 block">Обменники</label>
              {exchangers.map((ex, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ex.name}
                    onChange={(e) => {
                      const copy = [...exchangers];
                      copy[i] = { ...copy[i], name: e.target.value };
                      setExchangers(id, copy);
                    }}
                    placeholder="Название"
                    className="w-[120px] px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#D3F800]/50"
                  />
                  <input
                    type="url"
                    value={ex.url}
                    onChange={(e) => {
                      const copy = [...exchangers];
                      copy[i] = { ...copy[i], url: e.target.value };
                      setExchangers(id, copy);
                    }}
                    placeholder="https://..."
                    className="flex-1 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs outline-none focus:border-[#D3F800]/50"
                  />
                  <button
                    onClick={() => setExchangers(id, exchangers.filter((_, j) => j !== i))}
                    className="text-red-400 text-xs px-2 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={() => setExchangers(id, [...exchangers, { name: '', url: '' }])}
                className="text-[#D3F800] text-xs font-medium mb-3"
              >
                + Добавить обменник
              </button>

              <div>
                <button
                  onClick={() => handleSave(id)}
                  disabled={saving === id}
                  className="px-4 py-1.5 rounded-lg bg-[#075500] text-white text-xs font-medium hover:bg-[#096800] transition disabled:opacity-50"
                >
                  {saving === id ? 'Сохранение...' : saved === id ? '✓ Сохранено' : 'Сохранить'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
