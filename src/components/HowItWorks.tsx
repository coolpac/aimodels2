'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface Banner {
  id: number;
  image_path: string;
}

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [slides, setSlides] = useState<Banner[]>([]);
  const touchStart = useRef(0);
  const touchEnd = useRef(0);
  const totalSlides = slides.length > 0 ? slides.length : 3;

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

  useEffect(() => {
    fetch('/api/banners?carousel=case')
      .then((r) => r.json())
      .then((data: Banner[]) => setSlides(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length > 0 && active >= slides.length) setActive(0);
  }, [slides, active]);

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

  const testimonial = (
    <p className="text-[14px] lg:text-[15px] leading-[1.8] text-white/80">
      <span className="text-white/80">Я начала создавать ИИ-девушек в мае 2025, моя первая модель на данный момент заработала </span>
      <span className="text-gradient font-bold text-[16px]">+11,000$</span>
      <span className="text-white/80"> за 9 месяцев. Сейчас у меня своё мини агенство из </span>
      <span className="text-white font-semibold">6 ИИ-моделей</span>
      <span className="text-white/80">, каждая из которых зарабатывает </span>
      <span className="text-gradient font-bold text-[16px]">3,500–12,500$</span>
      <span className="text-white/80"> в месяц.</span>
    </p>
  );

  const carouselBlock = (
    <>
      <div
        className="glass-card rounded-[20px] overflow-hidden mb-4 lg:mb-5"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="carousel-track" style={{ transform: `translateX(-${active * 100}%)` }}>
          {slides.length > 0 ? (
            slides.map((b) => (
              <div key={b.id} className="min-w-full aspect-[16/9] relative">
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
                className="min-w-full aspect-[16/9] flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, rgba(15,15,15,0.9) 0%, rgba(30,30,30,0.8) 50%, rgba(20,20,20,0.9) 100%)`,
                }}
              />
            ))
          )}
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 mb-6 lg:mb-0">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); resetTimer(); }}
            className={`dot ${i === active ? 'dot-active' : 'dot-inactive'}`}
            aria-label={`Step ${i + 1}`}
          />
        ))}
      </div>
    </>
  );

  return (
    <div className="fade-up">
      <h4 className="section-title text-2xl lg:text-4xl text-white mb-5 lg:mb-8">
        <span className="text-gradient">РЕАЛЬНЫЙ КЕЙС</span>
      </h4>

      {/* Mobile: text → carousel → button */}
      <div className="lg:hidden">
        <div className="mb-6 text-center">{testimonial}</div>
        {carouselBlock}
      </div>

      {/* Desktop: зеркально предыдущему блоку — текст слева, карусель справа */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8">
        <div className="flex flex-col justify-center lg:pr-4">
          {testimonial}
        </div>
        <div>
          {carouselBlock}
        </div>
      </div>

      <div className="mt-6 lg:mt-8 lg:max-w-[360px] lg:mx-auto">
        <button className="pill-gradient w-full py-4 px-6 text-center text-white font-bold text-base uppercase tracking-wider">
          ХОЧЕШЬ, НАУЧУ ТАКЖЕ?
        </button>
      </div>
    </div>
  );
}
