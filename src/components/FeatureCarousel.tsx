'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const features = [
  {
    icon: '🧠',
    title: 'Генеральная палата AI',
    desc: 'Искусственный интеллект помогает находить лучшие курсы обмена и оптимизировать сделки в реальном времени',
  },
  {
    icon: '⚡',
    title: 'Мгновенные сделки',
    desc: 'Обмен криптовалюты за считанные минуты с минимальной комиссией и гарантией безопасности',
  },
  {
    icon: '🛡️',
    title: 'Безопасность',
    desc: 'Многоуровневая защита средств и персональных данных с использованием передовых технологий',
  },
  {
    icon: '📞',
    title: '24/7 Поддержка',
    desc: 'Круглосуточная поддержка клиентов через Telegram, WhatsApp и телефон',
  },
];

export default function FeatureCarousel() {
  const [active, setActive] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const next = useCallback(() => {
    setActive((p) => (p + 1) % features.length);
  }, []);

  const prev = useCallback(() => {
    setActive((p) => (p - 1 + features.length) % features.length);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 5000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStart.current - touchEnd.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
      resetTimer();
    }
  };

  return (
    <div className="px-5 fade-up">
      <div
        className="glass-card rounded-[30px] overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {features.map((f, i) => (
            <div key={i} className="min-w-full p-6">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-6 mt-6">
        {features.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); resetTimer(); }}
            className={`dot ${i === active ? 'dot-active' : 'dot-inactive'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
