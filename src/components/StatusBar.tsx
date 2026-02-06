'use client';

export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 py-2 text-white text-sm font-semibold">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <rect x="0" y="9" width="3" height="5" rx="1" fill="white" />
          <rect x="5" y="6" width="3" height="8" rx="1" fill="white" />
          <rect x="10" y="3" width="3" height="11" rx="1" fill="white" />
          <rect x="15" y="0" width="3" height="14" rx="1" fill="white" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 10.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" fill="white" />
          <path d="M4.5 8.5C5.5 7.2 6.7 6.5 8 6.5s2.5.7 3.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M1.5 5.5C3.3 3.2 5.5 2 8 2s4.7 1.2 6.5 3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="22" height="12" rx="2.5" stroke="white" strokeOpacity="0.35" />
          <rect x="2" y="2" width="19" height="9" rx="1.5" fill="white" />
          <path d="M24 4.5v4a2 2 0 000-4z" fill="white" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
