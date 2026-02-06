'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

export default function FeatureCarousel() {
  const [active, setActive] = useState(0);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = 4;

  const next = useCallback(() => {
    setActive((p) => (p + 1) % totalSlides);
  }, []);

  const prev = useCallback(() => {
    setActive((p) => (p - 1 + totalSlides) % totalSlides);
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
      {/* Title */}
      <h3 className="text-2xl font-black text-white mb-5 tracking-wide">
        AI, КОТОРЫЙ ЗАРАБАТЫВАЕТ
      </h3>

      {/* Green gradient card carousel */}
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
              className="min-w-full aspect-[16/10] flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, rgba(7,85,0,0.4) 0%, rgba(40,160,6,0.2) 50%, rgba(211,248,0,0.1) 100%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-6 mb-6">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); resetTimer(); }}
            className={`dot ${i === active ? 'dot-active' : 'dot-inactive'}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Text content */}
      <div className="space-y-4">
        <p className="text-white/70 text-sm leading-relaxed">
          Ты заходишь туда, где деньги уже есть – и их забирают не самые умные, а самые быстрые.
        </p>
        <p className="text-white/70 text-sm leading-relaxed">
          AI-модели в нише 18+ продают внимание, эмоции и фантазии 24/7, бесплатно и без выходных.
        </p>
        <p className="text-white/70 text-sm leading-relaxed">
          Ты создаёшь цифровых девушек, которые выглядят и продают как живые, показываешь их в соцсетях, запускаешь их в трафик и превращаешь интерес фанатов в свой доход, масштабируя его без лимитов
        </p>
      </div>

      {/* "Как это работает?" button */}
      <div className="mt-6">
        <button className="pill-gradient w-full py-4 px-6 text-center text-white font-semibold text-sm">
          Как это работает?
        </button>
      </div>
    </div>
  );
}
