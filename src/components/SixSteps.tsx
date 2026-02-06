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

      <p className="text-white/50 text-xs leading-relaxed">
        Это новая ниша, которая только начала развиваться в 2025 году. Конкуренция здесь есть, как и везде, но остаётся и по настоящему зарабатывают те, кто выделяется реалистичностью, привлекает качественный контент и даёт фанатам качественное общение. Ты можешь зайти с нуля и добиться успеха, как я, и начну тебя всему, что я умею: от создания максимально реалистичных AI до масштабирования и автоматизации процессов, чтобы этот бизнес приносил тебе пассивный доход.
      </p>
    </div>
  );
}
