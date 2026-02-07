'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface Banner {
  id: number;
  image_path: string;
}

export default function FeatureCarousel() {
  const [active, setActive] = useState(0);
  const [slides, setSlides] = useState<Banner[]>([]);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = slides.length > 0 ? slides.length : 4;

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

  useEffect(() => {
    fetch('/api/banners?carousel=feature')
      .then((r) => r.json())
      .then((data: Banner[]) => setSlides(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length > 0 && active >= slides.length) setActive(0);
  }, [slides, active]);

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
    <div className="fade-up">
      {/* Title */}
      <h3 className="section-title text-2xl lg:text-4xl text-white mb-5 lg:mb-8">
        AI, КОТОРЫЙ <span className="text-gradient">ЗАРАБАТЫВАЕТ</span>
      </h3>

      {/* Desktop: 2 col layout — carousel + text side by side */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Left: carousel */}
        <div>
          <div
            className="glass-card rounded-[20px] overflow-hidden mb-4 lg:mb-5"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
              {slides.length > 0 ? (
                slides.map((b) => (
                  <div key={b.id} className="min-w-full aspect-[16/10] relative">
                    <Image
                      src={b.image_path}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={active === 0}
                    />
                  </div>
                ))
              ) : (
                Array.from({ length: totalSlides }).map((_, i) => (
                  <div
                    key={i}
                    className="min-w-full aspect-[16/10] flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, rgba(7,85,0,0.4) 0%, rgba(40,160,6,0.2) 50%, rgba(211,248,0,0.1) 100%)`,
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-6 mb-6 lg:mb-0">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); resetTimer(); }}
                className={`dot ${i === active ? 'dot-active' : 'dot-inactive'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right: text blocks */}
        <div className="space-y-5">
          <div>
            <h4 className="section-title text-gradient text-lg lg:text-xl font-bold uppercase tracking-[0.12em] mb-2">Рынок</h4>
            <p className="text-[14px] lg:text-[15px] leading-[1.75] text-white/80">
              <span className="text-white font-bold">Ты заходишь туда, где деньги уже есть</span>
              {' '}– и их забирают не самые умные, а{' '}
              <span className="text-gradient font-bold">самые быстрые.</span>
            </p>
          </div>

          <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div>
            <h4 className="section-title text-gradient text-lg lg:text-xl font-bold uppercase tracking-[0.12em] mb-2">Продукт</h4>
            <p className="text-[14px] lg:text-[15px] leading-[1.75] text-white/80">
              AI-модели в нише 18+ продают{' '}
              <span className="text-white font-bold">внимание, эмоции и фантазии</span>
              {' '}24/7, бесплатно и без выходных.
            </p>
          </div>

          <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div>
            <h4 className="section-title text-gradient text-lg lg:text-xl font-bold uppercase tracking-[0.12em] mb-2">Масштаб</h4>
            <p className="text-[14px] lg:text-[15px] leading-[1.75] text-white/80">
              Ты создаёшь{' '}
              <span className="text-white font-bold">цифровых девушек</span>
              , которые выглядят и продают как живые, показываешь их в соцсетях, запускаешь их в трафик и превращаешь{' '}
              <span className="text-white font-bold">интерес фанатов в свой доход</span>
              , масштабируя его{' '}
              <span className="text-gradient font-bold">без лимитов</span>
            </p>
          </div>
        </div>
      </div>

      {/* "Как это работает?" button */}
      <div className="mt-6 lg:mt-8 lg:max-w-[360px] lg:mx-auto">
        <button className="pill-gradient w-full py-4 px-6 text-center text-white font-semibold text-sm">
          Как это работает?
        </button>
      </div>
    </div>
  );
}
