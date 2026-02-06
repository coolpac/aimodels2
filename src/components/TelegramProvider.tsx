'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function TelegramProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initTg = () => {
      const tg = (window as unknown as { Telegram?: { WebApp?: { ready: () => void; expand: () => void; MainButton: { text: string; color: string; textColor: string; show: () => void }; themeParams?: Record<string, string> } } }).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();

        tg.MainButton.text = 'Хочу начать';
        tg.MainButton.color = '#075500';
        tg.MainButton.textColor = '#D3F800';
        tg.MainButton.show();

        if (tg.themeParams) {
          const root = document.documentElement;
          Object.entries(tg.themeParams).forEach(([key, value]) => {
            root.style.setProperty(`--tg-${key}`, value);
          });
        }
      }
    };

    initTg();
    const timer = setTimeout(initTg, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
