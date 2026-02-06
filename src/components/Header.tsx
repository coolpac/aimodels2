'use client';

export default function Header() {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <span className="text-white text-xs font-medium tracking-wider uppercase">
        ODELCORE AI
      </span>
      <div className="flex items-center gap-3">
        <button className="pill-gradient px-4 py-2 flex items-center gap-2 text-white text-sm">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button className="flex flex-col gap-[3px] items-center justify-center p-2">
          <span className="w-1 h-1 rounded-full bg-white" />
          <span className="w-1 h-1 rounded-full bg-white" />
          <span className="w-1 h-1 rounded-full bg-white" />
        </button>
      </div>
    </div>
  );
}
