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
    <div className="px-5 fade-up">
      <h3 className="text-3xl font-black text-white mb-5">6 шагов</h3>

      <div className="space-y-3 mb-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className="glass-card rounded-2xl py-4 px-5 flex items-center justify-center text-center"
          >
            <span className="text-white text-sm font-medium whitespace-pre-line">{step}</span>
          </div>
        ))}
      </div>

      <p className="text-[14px] leading-[1.8] text-white/80">
        Это новая ниша, которая только начала развиваться в{' '}
        <span className="text-white font-bold">2025 году</span>
        . Конкуренция здесь есть, как и везде, но остаётся и по настоящему зарабатывают те, кто{' '}
        <span className="text-white font-bold">выделяется реалистичностью</span>
        , привлекает качественный контент и даёт фанатам качественное общение. Ты можешь{' '}
        <span className="text-white font-bold">зайти с нуля</span>
        {' '}и добиться успеха, как я, и начну тебя всему, что я умею: от создания максимально реалистичных AI до{' '}
        <span className="text-gradient font-bold">масштабирования и автоматизации</span>
        {' '}процессов, чтобы этот бизнес приносил тебе{' '}
        <span className="text-white font-bold">пассивный доход.</span>
      </p>
    </div>
  );
}
