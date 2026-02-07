'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Screen = 'menu' | 'eu_card' | 'crypto' | 'crypto_detail' | 'cis' | 'cis_detail' | 'cis_belarus' | 'cis_other' | 'paypal';

interface Exchanger { name: string; url: string }
interface Config { [key: string]: string }

export default function PayPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>('menu');
  const [cryptoNetwork, setCryptoNetwork] = useState('');
  const [cisCountry, setCisCountry] = useState('');
  const [config, setConfig] = useState<Config>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((data: { key: string; value: string }[]) => {
        const map: Config = {};
        data.forEach((c) => (map[c.key] = c.value));
        setConfig(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const price = config.price_current || '450';
  const supportUrl = `https://t.me/${config.support_username || 'modelcoresupport'}`;

  function BackButton({ to }: { to: Screen }) {
    return (
      <button
        onClick={() => setScreen(to)}
        className="w-full py-3 text-white/50 text-sm font-medium hover:text-white/70 transition"
      >
        ← Назад
      </button>
    );
  }

  function ActionButton({ children, href, variant = 'primary' }: { children: React.ReactNode; href: string; variant?: 'primary' | 'secondary' | 'outline' }) {
    const classes = {
      primary: 'btn-gradient text-white font-semibold',
      secondary: 'bg-white/10 text-white font-medium hover:bg-white/15',
      outline: 'border border-white/20 text-white/70 font-medium hover:bg-white/5',
    };
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
        className={`block w-full py-3.5 px-6 rounded-full text-sm text-center transition ${classes[variant]}`}>
        {children}
      </a>
    );
  }

  function FormButton({ formType }: { formType: 'crypto' | 'usd' }) {
    return (
      <a href={`/form/${formType}`}
        className="block w-full py-3.5 px-6 rounded-full text-sm text-center btn-gradient text-white font-semibold transition">
        📝 Заполнить форму
      </a>
    );
  }

  function SupportButton() {
    return (
      <a href={supportUrl} target="_blank" rel="noopener noreferrer"
        className="block w-full py-3 px-6 rounded-full text-sm text-center border border-white/15 text-white/60 font-medium hover:bg-white/5 transition">
        💬 Связь с тех. поддержкой
      </a>
    );
  }

  function WalletBlock({ label, address }: { label: string; address: string }) {
    const [copied, setCopied] = useState(false);
    return (
      <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
        <p className="text-white/50 text-xs mb-1">{label}</p>
        <p className="text-white font-mono text-sm break-all">{address}</p>
        <button
          onClick={() => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="mt-2 text-[#D3F800] text-xs font-medium"
        >
          {copied ? '✓ Скопировано' : 'Копировать адрес'}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center form-page-bg">
        <p className="text-white/50 text-sm">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 form-page-bg">
      <div className="max-w-[480px] mx-auto">

        {/* ─── MENU ─── */}
        {screen === 'menu' && (
          <div className="pt-8">
            <h1 className="text-white text-xl font-bold text-center mb-2">Оплата обучения</h1>
            <p className="text-white/50 text-sm text-center mb-8">Выберите удобный способ оплаты</p>
            <div className="space-y-3">
              {[
                { label: 'Картой из ЕС', screen: 'eu_card' as Screen },
                { label: 'Криптовалютой', screen: 'crypto' as Screen },
                { label: 'Картой СНГ', screen: 'cis' as Screen },
                { label: 'PayPal', screen: 'paypal' as Screen },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => (item.screen === 'eu_card' ? router.push('/payment-instruction') : setScreen(item.screen))}
                  className="w-full py-4 px-6 rounded-2xl glass-card text-white font-medium text-sm text-center hover:bg-white/10 transition flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-40">
                    <path d="M6 3l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
              <a href={supportUrl} target="_blank" rel="noopener noreferrer"
                className="block w-full py-4 px-6 rounded-2xl glass-card text-white/60 font-medium text-sm text-center hover:bg-white/10 transition">
                Поддержка
              </a>
            </div>
          </div>
        )}

        {/* ─── EU CARD ─── */}
        {screen === 'eu_card' && (
          <div className="pt-6">
            <h2 className="text-white text-lg font-bold mb-4">Картой из ЕС</h2>
            <div className="glass-card rounded-2xl p-5 mb-4">
              <p className="text-white/80 text-sm leading-relaxed">
                Оплата картой из ЕС (требуется верификация KYC).
              </p>
              <p className="text-white/80 text-sm leading-relaxed mt-3">
                Пожалуйста, следуйте инструкции по ссылке ниже (с ценой <span className="text-white font-bold">{price}$</span>).
              </p>
              <p className="text-[#D3F800] text-sm mt-4 font-medium">
                Обязательно сохраните скриншот оплаты и заполните форму ниже для выдачи доступа к курсу
              </p>
            </div>
            <div className="space-y-3">
              <ActionButton href="/payment-instruction" variant="secondary">📋 Инструкция по оплате</ActionButton>
              <FormButton formType="crypto" />
              <SupportButton />
            </div>
            <BackButton to="menu" />
          </div>
        )}

        {/* ─── CRYPTO: network selection ─── */}
        {screen === 'crypto' && (
          <div className="pt-6">
            <h2 className="text-white text-lg font-bold mb-2">Криптовалюта</h2>
            <p className="text-white/60 text-sm mb-6">Вы можете оплатить обучение в USDT - выберите сеть:</p>
            <div className="space-y-3">
              {[
                { label: 'ETHEREUM (ERC20)', id: 'erc20' },
                { label: 'TRX (TRC20)', id: 'trc20' },
                { label: 'BNB Smart Chain (BEP20)', id: 'bep20' },
              ].map((net) => (
                <button key={net.id} onClick={() => { setCryptoNetwork(net.id); setScreen('crypto_detail'); }}
                  className="w-full py-4 px-6 rounded-2xl glass-card text-white font-medium text-sm text-center hover:bg-white/10 transition">
                  {net.label}
                </button>
              ))}
              <SupportButton />
            </div>
            <BackButton to="menu" />
          </div>
        )}

        {/* ─── CRYPTO: wallet detail ─── */}
        {screen === 'crypto_detail' && (
          <div className="pt-6">
            <h2 className="text-white text-lg font-bold mb-4">Оплата USDT</h2>
            <div className="glass-card rounded-2xl p-5 mb-4">
              <p className="text-white/80 text-sm leading-relaxed">
                Пожалуйста, оплатите <span className="text-white font-bold">{price} USDT</span> на адрес кошелька
              </p>
            </div>
            <WalletBlock
              label={`USDT ${cryptoNetwork.toUpperCase()}`}
              address={config[`wallet_${cryptoNetwork}`] || ''}
            />
            <div className="glass-card rounded-2xl p-4 mb-4">
              <p className="text-[#D3F800] text-sm font-medium">
                Обязательно сохраните скриншот оплаты и заполните форму ниже для выдачи доступа к курсу
              </p>
            </div>
            <div className="space-y-3">
              <FormButton formType="crypto" />
              <SupportButton />
            </div>
            <BackButton to="crypto" />
          </div>
        )}

        {/* ─── CIS: country selection ─── */}
        {screen === 'cis' && (
          <div className="pt-6">
            <h2 className="text-white text-lg font-bold mb-2">Картой СНГ</h2>
            <p className="text-white/60 text-sm mb-6">Пожалуйста, укажите Вашу страну:</p>
            <div className="space-y-3">
              {[
                { label: '🇷🇺 Россия', id: 'russia', screen: 'cis_detail' as Screen },
                { label: '🇧🇾 Беларусь', id: 'belarus', screen: 'cis_belarus' as Screen },
                { label: '🇺🇦 Украина', id: 'ukraine', screen: 'cis_detail' as Screen },
                { label: '🇰🇿 Казахстан', id: 'kazakhstan', screen: 'cis_detail' as Screen },
                { label: '🌍 Другая страна', id: 'other', screen: 'cis_other' as Screen },
              ].map((c) => (
                <button key={c.id} onClick={() => { setCisCountry(c.id); setScreen(c.screen); }}
                  className="w-full py-4 px-6 rounded-2xl glass-card text-white font-medium text-sm text-center hover:bg-white/10 transition">
                  {c.label}
                </button>
              ))}
            </div>
            <BackButton to="menu" />
          </div>
        )}

        {/* ─── CIS: country detail (Russia/Ukraine/Kazakhstan) ─── */}
        {screen === 'cis_detail' && (
          <div className="pt-6">
            <h2 className="text-white text-lg font-bold mb-4">
              {cisCountry === 'russia' ? '🇷🇺 Россия' : cisCountry === 'ukraine' ? '🇺🇦 Украина' : '🇰🇿 Казахстан'}
            </h2>
            <div className="glass-card rounded-2xl p-5 mb-4">
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Для совершения оплаты воспользуйтесь одним из обменников ниже:
              </p>
              {(() => {
                try {
                  const exchangers = JSON.parse(config[`cis_${cisCountry}_exchangers`] || '[]') as Exchanger[];
                  return (
                    <div className="space-y-3">
                      {exchangers.map((e, i) => (
                        <a key={i} href={e.url} target="_blank" rel="noopener noreferrer"
                          className="block py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition">
                          {i + 1}. {e.name} ↗
                        </a>
                      ))}
                    </div>
                  );
                } catch { return null; }
              })()}
            </div>

            <div className="glass-card rounded-2xl p-4 mb-4">
              <p className="text-white/80 text-sm">
                Переведите <span className="text-white font-bold">{config[`cis_${cisCountry}_amount`]} ({price}$)</span> в USDT TRC20
              </p>
              <p className="text-white/50 text-xs mt-1">
                (убедитесь, что в RECEIVE Вы выбрали именно USDT (Tether) TRC20)
              </p>
            </div>

            <WalletBlock label="Адрес кошелька USDT TRC20" address={config.wallet_trc20 || ''} />

            <div className="glass-card rounded-2xl p-4 mb-4">
              <p className="text-[#D3F800] text-sm font-medium">
                Обязательно сохраните скриншот оплаты и заполните форму ниже для выдачи доступа к курсу
              </p>
            </div>

            <div className="space-y-3">
              <FormButton formType="crypto" />
              <SupportButton />
            </div>
            <BackButton to="cis" />
          </div>
        )}

        {/* ─── CIS: Belarus ─── */}
        {screen === 'cis_belarus' && (
          <div className="pt-6">
            <h2 className="text-white text-lg font-bold mb-4">🇧🇾 Беларусь</h2>
            <div className="glass-card rounded-2xl p-5 mb-4">
              <p className="text-white/80 text-sm leading-relaxed">
                Свяжитесь с тех. поддержкой, чтобы совершить оплату в BYN
              </p>
            </div>
            <SupportButton />
            <BackButton to="cis" />
          </div>
        )}

        {/* ─── CIS: Other ─── */}
        {screen === 'cis_other' && (
          <div className="pt-6">
            <h2 className="text-white text-lg font-bold mb-4">🌍 Другая страна</h2>
            <div className="glass-card rounded-2xl p-5 mb-4">
              <p className="text-white/80 text-sm leading-relaxed">
                Для оплаты из Вашей страны, пожалуйста, свяжитесь с тех. поддержкой
              </p>
            </div>
            <SupportButton />
            <BackButton to="cis" />
          </div>
        )}

        {/* ─── PAYPAL ─── */}
        {screen === 'paypal' && (
          <div className="pt-6">
            <h2 className="text-white text-lg font-bold mb-4">PayPal</h2>
            <div className="glass-card rounded-2xl p-5 mb-4">
              <p className="text-white/80 text-sm leading-relaxed">
                Оплатите обучение через PayPal по ссылке ниже.
              </p>
              <p className="text-[#D3F800] text-sm mt-4 font-medium">
                Обязательно сохраните скриншот оплаты и заполните форму ниже для выдачи доступа к курсу
              </p>
            </div>
            <div className="space-y-3">
              <ActionButton href={config.selly_url || '#'} variant="secondary">💳 Оплатить через PayPal</ActionButton>
              <FormButton formType="usd" />
              <SupportButton />
            </div>
            <BackButton to="menu" />
          </div>
        )}

      </div>
    </div>
  );
}
