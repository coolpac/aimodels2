'use client';

import { useState } from 'react';

const faqItems = [
  {
    q: 'А правда ли?',
    a: 'Да, это реально',
  },
  {
    q: 'Если я смогу',
    a: 'Да, мы поможем на каждом этапе. Всё пошагово и с поддержкой.',
  },
  {
    q: 'Если я возьмусь за это',
    a: 'Ты получишь все инструменты и знания для старта.',
  },
  {
    q: 'Какие у меня гарантии?',
    a: 'Мы даём полную поддержку и сопровождение на всех этапах.',
  },
  {
    q: 'Никаких',
    a: 'Никаких скрытых платежей и дополнительных условий.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  return (
    <div className="px-5 fade-up">
      <h3 className="text-3xl font-black text-white mb-5 text-center">FAQ</h3>

      <div className="space-y-3 mb-6">
        {faqItems.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <button
              key={i}
              className={`w-full text-left rounded-2xl transition-all duration-300 ${
                isOpen ? 'glass-card faq-active' : 'glass-card'
              }`}
              onClick={() => toggle(i)}
            >
              <div className="flex items-center justify-between p-4">
                <span className="text-white text-sm font-medium pr-4">{item.q}</span>
                <div className="flex items-center gap-2 shrink-0">
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

      {/* Green card at bottom */}
      <div className="glass-card rounded-[20px] overflow-hidden mb-5">
        <div
          className="aspect-[16/9] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(7,85,0,0.4) 0%, rgba(40,160,6,0.2) 50%, rgba(211,248,0,0.1) 100%)',
          }}
        />
      </div>

      {/* 4 dark dots */}
      <div className="flex items-center justify-center gap-6">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="dot dot-inactive"
          />
        ))}
      </div>
    </div>
  );
}
