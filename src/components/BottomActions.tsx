'use client';

function PillButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="pill-gradient w-full py-4 px-6 flex items-center text-white font-medium text-sm">
      {/* Invisible spacer to balance the arrow on the right */}
      <span className="w-5 shrink-0" />
      <span className="flex-1 text-center">{children}</span>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 opacity-60">
        <path d="M8 4l6 6-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export default function BottomActions() {
  return (
    <div className="relative fade-up">
      {/* Side gradient rails */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[1px]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, #075500 15%, #D3F800 50%, #075500 85%, transparent 100%)',
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-[1px]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, #075500 15%, #D3F800 50%, #075500 85%, transparent 100%)',
        }}
      />

      <div className="px-5 space-y-2.5 pb-8 pt-2">
        <PillButton>Хочу начать</PillButton>

        <div className="w-full py-2 px-6 text-center">
          <span className="text-white/60 font-medium text-sm">Связь</span>
        </div>

        <PillButton>TG канал</PillButton>

        <div className="w-full py-2 px-6 text-center">
          <span className="text-white/50 font-medium text-sm">aimodelcore@gmail.com</span>
        </div>

        <PillButton>Поддержка</PillButton>
      </div>
    </div>
  );
}
