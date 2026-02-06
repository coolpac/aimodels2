'use client';

const stats = [
  { value: '50K+', label: 'клиентов' },
  { value: '$100M+', label: 'объём сделок' },
  { value: '6+', label: 'криптовалют' },
];

export default function StatsCard() {
  return (
    <div className="px-5 fade-up">
      <div className="glass-card rounded-[30px] p-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-2xl font-black text-gradient mb-1">{s.value}</div>
              <div className="text-white/50 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
