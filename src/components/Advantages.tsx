'use client';

const items = [
  { icon: '💰', title: 'Лучшие курсы', desc: 'Автоматический подбор оптимального курса через AI' },
  { icon: '🔐', title: 'Защита средств', desc: 'Холодное хранение и мультиподпись' },
  { icon: '🚀', title: 'Скорость', desc: 'Обмен за считанные минуты без задержек' },
  { icon: '👤', title: 'Персональный менеджер', desc: 'Индивидуальный подход к каждому клиенту' },
];

export default function Advantages() {
  return (
    <div className="px-5 fade-up">
      <h3 className="text-xl font-bold text-white mb-4">Наши преимущества</h3>
      <div className="glass-card rounded-[30px] p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="text-2xl shrink-0">{item.icon}</div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-0.5">{item.title}</h4>
                <p className="text-white/45 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
