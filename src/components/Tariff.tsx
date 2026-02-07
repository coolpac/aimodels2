'use client';

const BOT_USERNAME = process.env.NEXT_PUBLIC_BOT_USERNAME || '';

function handleBuyClick() {
  // Временно: на локалке всегда открываем страницу оплаты (для проверки без TG)
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  if (isLocalhost) {
    window.location.href = '/pay';
    return;
  }

  const tg = (window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: { id: number } }; openTelegramLink: (url: string) => void } } }).Telegram?.WebApp;
  const hasTgUser = tg?.initDataUnsafe?.user?.id;

  if (hasTgUser) {
    // Inside Telegram Mini App → open payment UI in-app
    window.location.href = '/pay';
  } else {
    // Browser → redirect to bot with pay parameter
    const url = `https://t.me/${BOT_USERNAME}?start=pay`;
    if (tg) {
      tg.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  }
}

const bullets = [
  'Генерировать топовый SFW и NSFW контент',
  'Правильно регистрировать, прогревать и вести соцсети под США-аудиторию',
  'Упаковывать профили модели так, чтобы трафик менялся на деньги',
  'Чаттиться с фанатами, как PRO и продавать с первых дней, увеличивая чеки',
];

const bonuses = [
  'доступ к приватному чату учеников',
  'обновления курса',
];

function CheckIcon() {
  return (
    <div className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center mt-[2px]"
      style={{ background: 'linear-gradient(135deg, #075500, #7BFF3A)' }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export default function Tariff() {
  return (
    <div className="fade-up">
      <h3 className="section-title text-3xl lg:text-4xl text-white mb-6 text-center">ТАРИФ</h3>

      {/* Desktop: side by side — price card left, description right */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-8">
        {/* Left: card + price */}
        <div>
          <div className="glass-card rounded-[20px] overflow-hidden mb-4">
            <div
              className="aspect-[16/10] flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(7,85,0,0.4) 0%, rgba(40,160,6,0.2) 50%, rgba(211,248,0,0.1) 100%)',
              }}
            >
              <p className="text-white text-4xl font-black italic">450$</p>
            </div>
          </div>

          <div className="flex flex-col items-center mb-6 lg:mb-4">
            <p className="text-white text-5xl font-black italic mb-1 text-glow">450$</p>
            <p className="text-white/40 text-base font-medium price-old">600$</p>
          </div>

          {/* Buy button — visible on desktop in left column */}
          <div className="hidden lg:block lg:max-w-[280px] lg:mx-auto">
            <button onClick={handleBuyClick} className="btn-gradient w-full py-4 px-6 text-center text-white font-semibold text-sm">
              Купить
            </button>
          </div>
        </div>

        {/* Right: description */}
        <div className="glass-card rounded-2xl p-5 mb-6 lg:mb-0">
          <h4 className="text-white font-black text-lg mb-4 text-center leading-snug">
            <span className="fancy-underline">ПОЛНОЕ ОБУЧЕНИЕ</span>
            <span className="text-white/70 font-semibold">, где ты научишься:</span>
          </h4>

          <ul className="space-y-3 mb-4">
            {bullets.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckIcon />
                <span className="text-white/90 text-[14px] lg:text-[15px] leading-[1.7]">{item}</span>
              </li>
            ))}
          </ul>

          <div className="shimmer-line h-[1px] w-full mb-4 rounded-full" />

          <div className="space-y-2.5">
            {bonuses.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckIcon />
                <span className="text-gradient font-bold text-[14px]">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buy button — mobile only */}
      <div className="lg:hidden">
        <button onClick={handleBuyClick} className="btn-gradient w-full py-4 px-6 text-center text-white font-semibold text-sm">
          Купить
        </button>
      </div>
    </div>
  );
}
