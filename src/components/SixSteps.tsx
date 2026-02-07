'use client';

const steps = [
  'Создание ИИ-модели',
  'Регистрация\nи прогрев соцсетей',
  'Публикация контента',
  'Монетизация',
  'Вывод средств',
  'Масштабирование',
];

export default function SixSteps() {
  return (
    <div className="fade-up">
      <h3 className="section-title text-3xl lg:text-4xl text-white mb-6 lg:mb-8">
        <span className="text-gradient">6</span> шагов
      </h3>

      {/* Steps: на десктопе — больше отступы и воздух */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 mb-8 lg:mb-12">
        {steps.map((step, i) => (
          <div
            key={i}
            className="stagger glass-card rounded-2xl py-4 px-5 lg:py-5 lg:px-6 flex items-center gap-4 hover:border-white/10 transition-colors"
          >
            <span className="text-gradient font-black text-lg lg:text-xl shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5">
              {i + 1}
            </span>
            <span className="text-white text-sm lg:text-base font-medium whitespace-pre-line">{step}</span>
          </div>
        ))}
      </div>

      {/* Ключевые блоки — отдельная карточка с акцентом на десктопе */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(7,85,0,0.12) 0%, rgba(15,15,15,0.6) 50%, rgba(211,248,0,0.04) 100%)',
          boxShadow: '0 0 0 1px rgba(211,248,0,0.12), 0 24px 48px -12px rgba(0,0,0,0.5)',
        }}
      >
        {/* Акцентная полоска сверху */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(7,85,0,0.9) 30%, rgba(211,248,0,0.6) 70%, transparent 100%)',
          }}
        />

        <div className="p-5 lg:p-10 lg:max-w-5xl">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0 space-y-6 lg:space-y-0">
            {/* Новая ниша */}
            <div className="lg:pr-8 lg:border-r border-white/10">
              <span className="text-gradient text-xs lg:text-sm font-bold uppercase tracking-[0.2em] mb-2 block">01</span>
              <h5 className="section-title text-gradient text-xl lg:text-2xl font-bold uppercase tracking-[0.1em] mb-3">Новая ниша</h5>
              <p className="text-[14px] lg:text-[16px] leading-[1.9] text-white/85">
                Это новая ниша, которая только начала развиваться
                в <span className="text-white font-bold">2025 году</span>.
              </p>
            </div>

            {/* Конкуренция */}
            <div className="lg:pl-8">
              <span className="text-gradient text-xs lg:text-sm font-bold uppercase tracking-[0.2em] mb-2 block">02</span>
              <h5 className="section-title text-gradient text-xl lg:text-2xl font-bold uppercase tracking-[0.1em] mb-3">Конкуренция</h5>
              <p className="text-[14px] lg:text-[16px] leading-[1.9] text-white/85">
                Конкуренция есть, как и везде, но по-настоящему зарабатывают те,
                кто <span className="text-white font-bold">выделяется реалистичностью</span>,
                привлекает качественный контент и даёт фанатам качественное общение.
              </p>
            </div>

            {/* С нуля до результата — на всю ширину, визуально выделен на десктопе */}
            <div className="lg:col-span-2 lg:mt-10 lg:pt-10 lg:px-6 lg:rounded-xl lg:border-t lg:border-white/10 lg:bg-black/20">
              <span className="text-gradient text-xs lg:text-sm font-bold uppercase tracking-[0.2em] mb-2 block">03</span>
              <h5 className="section-title text-gradient text-xl lg:text-2xl font-bold uppercase tracking-[0.1em] mb-3">С нуля до результата</h5>
              <p className="text-[14px] lg:text-[16px] leading-[1.9] text-white/85 max-w-3xl">
                Ты можешь <span className="text-white font-bold">зайти с нуля</span> и
                добиться успеха. Я научу тебя всему — от создания реалистичных AI
                до <span className="text-gradient font-bold">масштабирования и автоматизации</span>,
                чтобы бизнес приносил <span className="text-white font-bold">пассивный доход.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
