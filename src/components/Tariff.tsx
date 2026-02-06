'use client';

const bullets = [
  'Генерировать топовый SFW и NSFW контент,',
  'Правильно регистрировать, прогревать и вести соцсети под США-аудиторию,',
  'Упаковывать профили модели так, чтобы трафик менялся на деньги,',
  'Чаттиться с фанатами, как PRO и продавать с первых дней, увеличивая чеки.',
];

export default function Tariff() {
  return (
    <div className="px-5 fade-up">
      <h3 className="text-3xl font-black text-white mb-6 text-center">ТАРИФ</h3>

      {/* Green card with price inside */}
      <div className="glass-card rounded-[20px] overflow-hidden mb-6">
        <div
          className="aspect-[16/10] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(7,85,0,0.4) 0%, rgba(40,160,6,0.2) 50%, rgba(211,248,0,0.1) 100%)',
          }}
        >
          <p className="text-white text-4xl font-black italic">450$</p>
        </div>
      </div>

      {/* Price + old price below card */}
      <div className="flex flex-col items-center mb-6">
        <p className="text-white text-4xl font-black italic mb-1">450$</p>
        <p className="text-white/40 text-base font-medium price-old">600$</p>
      </div>

      {/* Description block */}
      <div className="mb-6">
        <h4 className="text-white font-black text-lg mb-4 text-center">
          <span className="underline decoration-white/40 decoration-2 underline-offset-4">ПОЛНОЕ ОБУЧЕНИЕ</span>
          <span className="text-white/80 font-semibold">, где ты научишься:</span>
        </h4>

        <ul className="space-y-3 mb-5">
          {bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-white/60 mt-[2px] shrink-0">•</span>
              <span className="text-white/90 text-[15px] leading-[1.7]">{item}</span>
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[16px]">✅</span>
            <span className="text-gradient font-semibold text-[14px]">доступ к приватному чату учеников</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[16px]">✅</span>
            <span className="text-gradient font-semibold text-[14px]">обновления курса</span>
          </div>
        </div>
      </div>

      {/* Buy button */}
      <button className="btn-gradient w-full py-4 px-6 text-center text-white font-semibold text-sm">
        Купить
      </button>
    </div>
  );
}
