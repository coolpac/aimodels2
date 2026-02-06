'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const totalSlides = 3;

  const next = useCallback(() => {
    setActive((p) => (p + 1) % totalSlides);
  }, []);

  const prev = useCallback(() => {
    setActive((p) => (p - 1 + totalSlides) % totalSlides);
  }, []);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(next, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 6000);
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
      {/* Title as pill button */}
      <div className="flex justify-center mb-6">
        <span className="pill-gradient px-6 py-3 text-white font-semibold text-sm">
          Как это работает?
        </span>
      </div>

      {/* Testimonial text */}
      <p className="text-white/80 text-sm leading-relaxed mb-5 text-center">
        Я начала создавать ИИ-девушек в мае 2025, моя первая модель на данный момент заработала +11,000$ за 9 месяцев. Сейчас у меня своё мини агенство из 6 ИИ-моделей, каждая из которых зарабатывает 3,500-12,500$ в месяц.
      </p>

      {/* Dark card carousel */}
      <div
        className="glass-card rounded-[20px] overflow-hidden mb-5"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              className="min-w-full aspect-[16/9] flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, rgba(15,15,15,0.9) 0%, rgba(30,30,30,0.8) 50%, rgba(20,20,20,0.9) 100%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Pagination dots - 3 */}
      <div className="flex items-center justify-center gap-6 mb-6">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); resetTimer(); }}
            className={`dot ${i === active ? 'dot-active' : 'dot-inactive'}`}
            aria-label={`Step ${i + 1}`}
          />
        ))}
      </div>

      {/* Big CTA */}
      <button className="pill-gradient w-full py-4 px-6 text-center text-white font-bold text-base uppercase tracking-wider">
        ХОЧЕШЬ, НАУЧУ ТАКЖЕ?
      </button>
    </div>
  );
}
