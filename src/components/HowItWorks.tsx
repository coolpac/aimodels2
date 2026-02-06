'use client';

const steps = [
  { num: '01', title: 'Выберите пару', desc: 'Укажите криптовалюту для обмена и желаемую валюту получения' },
  { num: '02', title: 'Укажите сумму', desc: 'Введите сумму обмена и получите лучший курс автоматически' },
  { num: '03', title: 'Получите средства', desc: 'Мгновенное зачисление на ваш кошелёк или банковский счёт' },
];

export default function HowItWorks() {
  return (
    <div className="px-5 fade-up">
      <div className="glass-card rounded-[30px] p-6">
        <h3 className="text-xl font-bold text-white mb-6">Как это работает</h3>
        <div className="space-y-5">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#075500] to-[#D3F800] flex items-center justify-center text-sm font-bold text-black shrink-0">
                  {step.num}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-full bg-gradient-to-b from-[#D3F800]/40 to-transparent mt-1" />
                )}
              </div>
              <div className="pb-2">
                <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
