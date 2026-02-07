'use client';

import { useEffect, useState } from 'react';
import AdminButton from './AdminButton';

const EMAIL = 'aimodelcore@gmail.com';
const SUPPORT_DEFAULT = 'modelcoresupport';
const CHANNEL_DEFAULT = 'odelcore';

function PillButton({
  children,
  href,
  style,
  className = '',
}: {
  children: React.ReactNode;
  href?: string;
  style?: React.CSSProperties;
  className?: string;
}) {
  const baseClass = 'pill-gradient w-full py-4 px-6 flex items-center justify-center text-white font-medium text-sm rounded-full';
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('mailto:') ? '_self' : '_blank'}
        rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
        className={`${baseClass} ${className}`.trim()}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={`${baseClass} ${className}`.trim()} style={style}>
      {children}
    </button>
  );
}

export default function BottomActions() {
  const [config, setConfig] = useState<{ support_username?: string }>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then((arr: { key: string; value: string }[]) => {
        const map: Record<string, string> = {};
        arr.forEach(({ key, value }) => { map[key] = value; });
        setConfig(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const supportUrl = `https://t.me/${config.support_username || SUPPORT_DEFAULT}`;
  const channelUrl = `https://t.me/${process.env.NEXT_PUBLIC_CHANNEL_USERNAME || CHANNEL_DEFAULT}`;
  const slideClass = mounted ? 'bottom-action-slide-in' : '';
  const delay = (i: number) => ({ animationDelay: `${i * 80}ms` });

  return (
    <div className="relative fade-up overflow-hidden">
      <div className="pb-8 pt-2">
        {/* Mobile: stacked, выезд сбоку */}
        <div className="lg:hidden space-y-2.5">
            <div className={slideClass} style={delay(0)}>
              <PillButton href="/pay">Хочу начать</PillButton>
            </div>
            <div className={`w-full py-2 px-6 text-center ${slideClass}`} style={delay(1)}>
              <span className="text-white/60 font-medium text-sm">Связь</span>
            </div>
            <div className={slideClass} style={delay(2)}>
              <PillButton href={channelUrl}>TG канал</PillButton>
            </div>
            <div className={slideClass} style={delay(3)}>
              <PillButton href={`mailto:${EMAIL}`}>Почта</PillButton>
            </div>
            <div className={slideClass} style={delay(4)}>
              <PillButton href={supportUrl}>Поддержка</PillButton>
            </div>
          </div>

          {/* Desktop: сетка 4 кнопки + подпись, выезд сбоку */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className={slideClass} style={delay(0)}>
                <PillButton href="/pay">Хочу начать</PillButton>
              </div>
              <div className={slideClass} style={delay(1)}>
                <PillButton href={channelUrl}>TG канал</PillButton>
              </div>
              <div className={slideClass} style={delay(2)}>
                <PillButton href={`mailto:${EMAIL}`}>Почта</PillButton>
              </div>
              <div className={slideClass} style={delay(3)}>
                <PillButton href={supportUrl}>Поддержка</PillButton>
              </div>
            </div>
            <div className={`flex items-center justify-center gap-6 ${slideClass}`} style={delay(4)}>
              <span className="text-white/60 font-medium text-sm">Связь</span>
              <span className="text-white/30">•</span>
              <span className="text-white/50 font-medium text-sm">{EMAIL}</span>
            </div>
          </div>
      </div>

      <AdminButton />
    </div>
  );
}
