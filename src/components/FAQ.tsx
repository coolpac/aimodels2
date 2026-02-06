'use client';

import { useState } from 'react';

const faqItems = [
  {
    q: 'Какие криптовалюты поддерживаются?',
    a: 'Мы поддерживаем BTC, ETH, USDT, USDC, BNB, TON и другие популярные криптовалюты. Список постоянно расширяется.',
  },
  {
    q: 'Как долго длится обмен?',
    a: 'Стандартный обмен занимает от 5 до 30 минут в зависимости от блокчейна и загруженности сети.',
  },
  {
    q: 'Какая минимальная сумма обмена?',
    a: 'Минимальная сумма обмена составляет $50 или эквивалент в криптовалюте.',
  },
  {
    q: 'Нужна ли верификация?',
    a: 'Для обменов до $1000 верификация не требуется. Для крупных сумм потребуется простая верификация.',
  },
  {
    q: 'Какие способы оплаты доступны?',
    a: 'Банковские карты, переводы, криптовалютные кошельки, P2P-переводы и наличные в офисе.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <div className="px-5 space-y-3 fade-up">
      <h3 className="text-xl font-bold text-white mb-4">Частые вопросы</h3>
      {faqItems.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <button
            key={i}
            className={`w-full text-left rounded-[${i === 0 ? '26' : '10'}px] transition-all duration-300 ${
              isOpen ? 'pill-gradient faq-active' : 'glass-card'
            } ${i === 0 ? 'rounded-[26px]' : 'rounded-[10px]'}`}
            onClick={() => toggle(i)}
          >
            <div className="flex items-center justify-between p-4">
              <span className="text-white text-sm font-medium pr-4">{item.q}</span>
              <div className="flex items-center gap-2 shrink-0">
                {isOpen && (
                  <span className="text-xs text-white/40 pill-gradient px-2.5 py-0.5 rounded-full">
                    FAQ
                  </span>
                )}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`accordion-icon ${isOpen ? 'open' : ''}`}
                >
                  <path d="M10 4v12M4 10h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className={`accordion-content px-4 ${isOpen ? 'open' : ''}`}>
              <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
