'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Banner {
  id: number;
  image_path: string;
}

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
  const [active, setActive] = useState(0);
  const [slides, setSlides] = useState<Banner[]>([]);
  const totalSlides = slides.length > 0 ? slides.length : 4;

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? -1 : i);
  };

  useEffect(() => {
    fetch('/api/banners?carousel=faq')
      .then((r) => r.json())
      .then((data: Banner[]) => setSlides(data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length > 0 && active >= slides.length) setActive(0);
  }, [slides, active]);

  return (
    <div className="fade-up">
      <h3 className="section-title text-3xl lg:text-4xl text-white mb-6 text-center">FAQ</h3>

      {/* Desktop: 2 columns — FAQ left, green card right */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        <div className="space-y-3 mb-6 lg:mb-0">
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

        <div>
          {/* Green card */}
          <div className="glass-card rounded-[20px] overflow-hidden mb-5">
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
                      background: 'linear-gradient(135deg, rgba(7,85,0,0.4) 0%, rgba(40,160,6,0.2) 50%, rgba(211,248,0,0.1) 100%)',
                    }}
                  />
                ))
              )}
            </div>
          </div>

          {/* 4 dark dots */}
          <div className="flex items-center justify-center gap-6">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`dot ${i === active ? 'dot-active' : 'dot-inactive'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
