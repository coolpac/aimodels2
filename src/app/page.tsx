'use client';

import StatusBar from '@/components/StatusBar';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureCarousel from '@/components/FeatureCarousel';
import HowItWorks from '@/components/HowItWorks';
import FAQ from '@/components/FAQ';
import StatsCard from '@/components/StatsCard';
import Advantages from '@/components/Advantages';
import AnimationObserver from '@/components/AnimationObserver';

export default function Home() {
  return (
    <main className="max-w-[600px] mx-auto min-h-screen relative">
      <AnimationObserver />

      {/* Status Bar */}
      <StatusBar />

      {/* Header */}
      <Header />

      {/* Hero */}
      <HeroSection />

      {/* Search Pill */}
      <div className="px-5 -mt-2 mb-8 fade-up">
        <button className="pill-gradient w-full py-4 px-6 flex items-center justify-between text-white">
          <span className="text-sm font-medium">Подобрать подходящую пару</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Feature Carousel */}
      <div className="mb-8">
        <FeatureCarousel />
      </div>

      {/* Calculate Exchange Button */}
      <div className="px-5 mb-8 fade-up">
        <button className="btn-gradient w-full py-4 px-6 text-center text-white font-semibold text-sm">
          Рассчитать обмен
        </button>
      </div>

      {/* How It Works */}
      <div className="mb-8">
        <HowItWorks />
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <FAQ />
      </div>

      {/* Stats */}
      <div className="mb-8">
        <StatsCard />
      </div>

      {/* Advantages */}
      <div className="mb-8">
        <Advantages />
      </div>

      {/* Bottom CTAs */}
      <div className="px-5 space-y-3 pb-12 fade-up">
        <button className="btn-gradient w-full py-4 px-6 text-center text-white font-semibold text-sm">
          Начать обмен
        </button>
        <button className="pill-gradient w-full py-4 px-6 text-center text-white font-medium text-sm">
          Связаться с поддержкой
        </button>
      </div>

      {/* Bottom safe area for Telegram */}
      <div className="h-20" />
    </main>
  );
}
