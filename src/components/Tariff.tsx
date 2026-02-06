'use client';

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
      <div className="flex flex-col items-center mb-5">
        <p className="text-white text-4xl font-black italic mb-1">450$</p>
        <p className="text-white/40 text-base font-medium price-old">600$</p>
      </div>

      {/* Buy button */}
      <button className="btn-gradient w-full py-4 px-6 text-center text-white font-semibold text-sm">
        Купить
      </button>
    </div>
  );
}
