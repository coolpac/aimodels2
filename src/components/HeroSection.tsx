'use client';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: '100svh', minHeight: '600px' }}>
      {/* Real hero image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/hero.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      />

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 hero-overlay" />

      {/* Bottom gradient fade into page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-64"
        style={{
          background: 'linear-gradient(to top, #02691A 0%, rgba(15,15,15,0.9) 30%, transparent 100%)',
        }}
      />

      {/* Content pinned to bottom */}
      <div className="relative z-10 h-full px-5 flex flex-col items-center text-center justify-end pb-10">
        <p className="text-white/80 text-xs tracking-[0.3em] uppercase font-medium mb-5">
          ODELCORE AI
        </p>

        <h2 className="text-white text-xl font-bold leading-snug mb-5 tracking-wide">
          СОЗДАНИЕ<br />
          И МОНЕТИЗАЦИЯ ИИ-МОДЕЛЕЙ
        </h2>

        <p className="text-white text-lg font-bold leading-snug mb-1">
          ГЕНЕРАЦИЯ И
        </p>
        <p className="text-white text-lg font-bold leading-snug mb-8">
          ПРОДАЖА 18+ КОНТЕНТА
        </p>

        <button className="pill-gradient px-8 py-3 text-white text-sm font-medium">
          Подробнее
        </button>
      </div>
    </section>
  );
}
