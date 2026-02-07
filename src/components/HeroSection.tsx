'use client';

import Image from 'next/image';

/* Float animation classes cycle */
const floatClasses = ['hero-card-float1', 'hero-card-float2', 'hero-card-float3'];

/* Scattered model cards — mobile-first, desktop scales via CSS */
const cards = [
  { src: '/models/IMG_1_10.jpg',  top: '2%',   left: '-8%',   w: 120, h: 154, rot: -12, delay: 0 },
  { src: '/models/IMG_3_1.jpg',   top: '0%',   left: '65%',   w: 130, h: 166, rot: 8,   delay: 0.1 },
  { src: '/models/IMG_6_1.jpg',   top: '15%',  left: '35%',   w: 110, h: 141, rot: -5,  delay: 0.2 },
  { src: '/models/IMG_14_1.jpg',  top: '10%',  left: '78%',   w: 105, h: 134, rot: 15,  delay: 0.15 },
  { src: '/models/IMG_15_1.jpg',  top: '28%',  left: '-5%',   w: 115, h: 147, rot: 6,   delay: 0.25 },
  { src: '/models/IMG_17_1.jpg',  top: '25%',  left: '72%',   w: 120, h: 154, rot: -10, delay: 0.3 },
  { src: '/models/IMG_18_1.jpg',  top: '55%',  left: '-6%',   w: 110, h: 141, rot: -8,  delay: 0.35 },
  { src: '/models/IMG_4_1.jpg',   top: '60%',  left: '70%',   w: 125, h: 160, rot: 12,  delay: 0.2 },
  { src: '/models/IMG_5_1.jpg',   top: '75%',  left: '20%',   w: 105, h: 134, rot: -6,  delay: 0.4 },
  { src: '/models/IMG_24_1.jpg',  top: '78%',  left: '60%',   w: 110, h: 141, rot: 10,  delay: 0.45 },
];

/* Extra cards — desktop only, fill wider space */
const desktopCards = [
  { src: '/models/IMG_20_1.jpg',  top: '5%',   left: '88%',   w: 115, h: 147, rot: -8,  delay: 0.5 },
  { src: '/models/IMG_23_1.jpg',  top: '42%',  left: '86%',   w: 110, h: 141, rot: 14,  delay: 0.55 },
  { src: '/models/IMG_25_1.jpg',  top: '68%',  left: '-10%',  w: 120, h: 154, rot: -15, delay: 0.6 },
  { src: '/models/IMG_26_1.jpg',  top: '35%',  left: '-12%',  w: 108, h: 138, rot: 10,  delay: 0.65 },
  { src: '/models/IMG_27_1.jpg',  top: '82%',  left: '88%',   w: 115, h: 147, rot: -12, delay: 0.7 },
  { src: '/models/IMG_19_1.jpg',  top: '48%',  left: '45%',   w: 100, h: 128, rot: 5,   delay: 0.5 },
];

function CardItem({ card, i, isDesktopOnly = false }: { card: typeof cards[0]; i: number; isDesktopOnly?: boolean }) {
  return (
    <div
      className={`hero-card hero-card-desktop absolute rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl ${isDesktopOnly ? 'hidden lg:block' : ''} ${floatClasses[i % 3]}`}
      style={{
        top: card.top,
        left: card.left,
        width: card.w,
        height: card.h,
        '--base-rot': `rotate(${card.rot}deg)`,
        animationDelay: `${card.delay}s, ${card.delay + 0.8}s`,
      } as React.CSSProperties}
    >
      <Image
        src={card.src}
        alt=""
        width={card.w}
        height={card.h}
        className="object-cover w-full h-full"
        quality={60}
        loading={i < 4 && !isDesktopOnly ? undefined : 'lazy'}
        priority={i < 4 && !isDesktopOnly}
      />
      <div className="absolute inset-0 rounded-xl lg:rounded-2xl" style={{
        boxShadow: 'inset 0 0 0 1px rgba(211,248,0,0.15)',
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, rgba(7,85,0,0.2) 0%, rgba(211,248,0,0.05) 100%)',
      }} />
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: '640px' }}
    >
      {/* Dark base */}
      <div className="absolute inset-0 bg-[#0F0F0F]" />

      {/* Scattered model image cards */}
      <div className="absolute inset-0" aria-hidden="true">
        {cards.map((card, i) => (
          <CardItem key={i} card={card} i={i} />
        ))}
        {desktopCards.map((card, i) => (
          <CardItem key={`dt-${i}`} card={card} i={i + cards.length} isDesktopOnly />
        ))}
      </div>

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(15,15,15,0.85) 70%, #0F0F0F 100%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 z-10"
        style={{
          background: 'linear-gradient(to top, #0F0F0F 0%, #0F0F0F 15%, transparent 100%)',
        }}
      />

      {/* Green ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(211,248,0,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Content — centered text + buttons */}
      <div className="relative z-10 h-full px-5 lg:px-10 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-[360px] lg:max-w-[600px] flex flex-col items-center">
          <p className="text-white/50 text-xs lg:text-sm tracking-[0.4em] uppercase font-medium mb-4 lg:mb-6 text-glow-green">
            ODELCORE AI
          </p>

          <h2 className="section-title text-3xl md:text-4xl lg:text-6xl xl:text-7xl text-white leading-[1.1] mb-5 lg:mb-8">
            СОЗДАНИЕ<br />
            И МОНЕТИЗАЦИЯ<br />
            <span className="text-gradient">ИИ-МОДЕЛЕЙ</span>
          </h2>

          <p className="text-white/70 text-base lg:text-xl font-semibold leading-snug mb-1 tracking-wide">
            ГЕНЕРАЦИЯ И
          </p>
          <p className="text-white/70 text-base lg:text-xl font-semibold leading-snug mb-8 lg:mb-12 tracking-wide">
            ПРОДАЖА 18+ КОНТЕНТА
          </p>

          <a
            href="#kak-eto-rabotaet"
            className="pill-gradient w-full max-w-[320px] lg:max-w-[360px] py-3 lg:py-4 text-white text-sm lg:text-base font-medium text-center block rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Подробнее
          </a>
        </div>
      </div>
    </section>
  );
}
