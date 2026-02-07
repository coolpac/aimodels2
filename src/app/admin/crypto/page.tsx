'use client';

import { useEffect, useState } from 'react';
import { adminGet, adminPut } from '@/lib/useAdminApi';

const WALLETS = [
  { key: 'wallet_erc20', label: 'ERC20 (Ethereum)' },
  { key: 'wallet_bep20', label: 'BEP20 (BSC)' },
  { key: 'wallet_trc20', label: 'TRC20 (Tron)' },
  { key: 'paypal_email', label: 'PayPal Email' },
];

export default function CryptoPage() {
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

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await adminPut('/api/admin/config', { key, value: config[key] || '' });
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
      <h1 className="text-white text-xl font-bold mb-6">Кошельки и PayPal</h1>
      <div className="space-y-4 max-w-xl">
        {WALLETS.map(({ key, label }) => (
          <div key={key} className="rounded-xl bg-white/5 border border-white/10 p-4">
            <label className="text-white/70 text-sm font-medium mb-1.5 block">{label}</label>
            <input
              type="text"
              value={config[key] || ''}
              onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#D3F800]/50 transition font-mono"
            />
            <button
              onClick={() => handleSave(key)}
              disabled={saving === key}
              className="mt-2 px-4 py-1.5 rounded-lg bg-[#075500] text-white text-xs font-medium hover:bg-[#096800] transition disabled:opacity-50"
            >
              {saving === key ? 'Сохранение...' : saved === key ? '✓ Сохранено' : 'Сохранить'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
