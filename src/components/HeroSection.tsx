'use client';

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '500px' }}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-transparent" />

      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 px-5 pt-12 pb-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#D3F800] pulse-dot" />
          <span className="text-xs font-medium text-white/80 uppercase tracking-wider">ODELCORE AI</span>
        </div>

        {/* Main heading */}
        <h2 className="text-[42px] leading-[1.05] font-black text-white mb-3 tracking-tight">
          OTC<br />
          <span className="text-gradient">ОБМЕННИК</span><br />
          КРИПТОВАЛЮТ
        </h2>

        {/* Subtitle text blocks */}
        <p className="text-white/70 text-base leading-relaxed mt-6 max-w-[360px]">
          Безопасный обмен криптовалюты с лучшими курсами.
          Поддержка 6+ криптовалют и фиатных валют.
        </p>

        <p className="text-white/50 text-sm leading-relaxed mt-4 max-w-[340px]">
          Генеральная палата AI · Монетизации · Модели имонетизации ·
          II-модели · Контентa
        </p>

        <p className="text-white/40 text-xs leading-relaxed mt-3 max-w-[340px]">
          Подходящую продуктовую бизнес-модель для вашего AI-проекта.
          Контент · Аналитика · Продажи
        </p>
      </div>
    </section>
  );
}
