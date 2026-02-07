'use client';

import { useState, useEffect } from 'react';

function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  if (typeof document === 'undefined' || !document.queryCommandSupported?.('copy')) return Promise.resolve(false);
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  el.setSelectionRange(0, text.length);
  try {
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return Promise.resolve(ok);
  } catch {
    document.body.removeChild(el);
    return Promise.resolve(false);
  }
}

export default function PaymentInstructionPage() {
  const walletAddress = '0x4a116aa661319b1688b704e4714fda93a5d8bc25';
  const [supportUrl, setSupportUrl] = useState(`https://t.me/modelcoresupport`);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((data: { key: string; value: string }[]) => {
        const map: Record<string, string> = {};
        data.forEach((c) => (map[c.key] = c.value));
        if (map.support_username) setSupportUrl(`https://t.me/${map.support_username}`);
      })
      .catch(() => {});
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Перейдите на Mercuryo',
      text: 'Откройте exchange.mercuryo.io и начните процесс покупки криптовалюты.',
    },
    {
      num: '02',
      title: 'Введите сумму',
      text: 'Укажите сумму оплаты в долларах (450$). Выберите валюту USDC и сеть Ethereum (ERC20).',
    },
    {
      num: '03',
      title: 'Укажите адрес кошелька',
      text: `В поле получателя введите адрес:\n${walletAddress}`,
    },
    {
      num: '04',
      title: 'Пройдите верификацию (KYC)',
      text: 'Загрузите документ для верификации личности. Это стандартная процедура для EU платежей.',
    },
    {
      num: '05',
      title: 'Завершите оплату',
      text: 'Введите данные карты и подтвердите платёж. Обязательно сохраните скриншот подтверждения оплаты!',
    },
  ];

  return (
    <div className="min-h-screen p-5 form-page-bg">
      <div className="max-w-[600px] mx-auto pt-6">
        <h1 className="text-white text-xl lg:text-2xl font-bold text-center mb-2">
          Инструкция по оплате <span className="text-gradient">EU картой</span>
        </h1>
        <p className="text-white/50 text-sm text-center mb-8">
          Оплата через Mercuryo (требуется верификация KYC)
        </p>

        <div className="space-y-4 mb-8">
          {steps.map((step) => (
            <div key={step.num} className="glass-card rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <span className="text-gradient font-black text-2xl leading-none shrink-0">{step.num}</span>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{step.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{step.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wallet address copy block */}
        <div className="glass-card rounded-2xl p-5 mb-6">
          <p className="text-white/50 text-xs mb-1">Адрес кошелька (USDC ERC20)</p>
          <p className="text-white font-mono text-sm break-all mb-2">{walletAddress}</p>
          <button
            type="button"
            onClick={() => {
              copyToClipboard(walletAddress).then((ok) => {
                if (ok) {
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }
              });
            }}
            className="text-[#D3F800] text-xs font-medium hover:underline"
          >
            {copied ? '✓ Скопировано' : 'Копировать адрес'}
          </button>
        </div>

        <div className="space-y-3">
          <a
            href="https://exchange.mercuryo.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3.5 px-6 rounded-full text-sm text-center bg-white/10 text-white font-medium hover:bg-white/15 transition"
          >
            🌐 Перейти на Mercuryo
          </a>
          <a
            href="/form/crypto"
            className="block w-full py-3.5 px-6 rounded-full text-sm text-center btn-gradient text-white font-semibold transition"
          >
            📝 Заполнить форму после оплаты
          </a>
          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-6 rounded-full text-sm text-center border border-white/15 text-white/60 font-medium hover:bg-white/5 transition"
          >
            💬 Связь с тех. поддержкой
          </a>
          <a
            href="/pay"
            className="block w-full py-3 text-white/50 text-sm font-medium text-center hover:text-white/70 transition"
          >
            ← Назад
          </a>
        </div>
      </div>
    </div>
  );
}
