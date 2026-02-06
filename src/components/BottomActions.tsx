'use client';

export default function BottomActions() {
  return (
    <div className="px-5 space-y-3 pb-8 fade-up">
      {/* Хочу начать - pill with arrow */}
      <button className="pill-gradient w-full py-4 px-6 flex items-center justify-between text-white font-medium text-sm">
        <span className="flex-1 text-center">Хочу начать</span>
        <span className="text-white/50 text-lg">›</span>
      </button>

      {/* Связь - plain text link */}
      <div className="w-full py-3 px-6 text-center">
        <span className="text-white/70 font-medium text-sm">Связь</span>
      </div>

      {/* TG канал - pill with arrow */}
      <button className="pill-gradient w-full py-4 px-6 flex items-center justify-between text-white font-medium text-sm">
        <span className="flex-1 text-center">TG канал</span>
        <span className="text-white/50 text-lg">›</span>
      </button>

      {/* Email - plain text */}
      <div className="w-full py-3 px-6 text-center">
        <span className="text-white/50 font-medium text-sm">aimodelcore@gmail.com</span>
      </div>

      {/* Поддержка - pill with arrow */}
      <button className="pill-gradient w-full py-4 px-6 flex items-center justify-between text-white font-medium text-sm">
        <span className="flex-1 text-center">Поддержка</span>
        <span className="text-white/50 text-lg">›</span>
      </button>
    </div>
  );
}
