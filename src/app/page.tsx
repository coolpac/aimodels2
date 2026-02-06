'use client';

import StatusBar from '@/components/StatusBar';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeatureCarousel from '@/components/FeatureCarousel';
import HowItWorks from '@/components/HowItWorks';
import SixSteps from '@/components/SixSteps';
import Tariff from '@/components/Tariff';
import FAQ from '@/components/FAQ';
import ReadyToStart from '@/components/ReadyToStart';
import BottomActions from '@/components/BottomActions';
import AnimationObserver from '@/components/AnimationObserver';

export default function Home() {
  return (
    <main className="max-w-[600px] mx-auto min-h-screen relative">
      <AnimationObserver />

      {/* 1. Status Bar */}
      <StatusBar />

      {/* 2. Header */}
      <Header />

      {/* 3-5. Hero: Image + Title + Subtitle + "Подробнее" */}
      <HeroSection />

      {/* 7. "AI, КОТОРЫЙ ЗАРАБАТЫВАЕТ" + carousel + text + "Как это работает?" */}
      <div className="mb-10 mt-6">
        <FeatureCarousel />
      </div>

      {/* 8-9. "Как это работает?" + testimonial + carousel + "ХОЧЕШЬ, НАУЧУ ТАКЖЕ?" */}
      <div className="mb-10">
        <HowItWorks />
      </div>

      {/* 11. "6 шагов" */}
      <div className="mb-10">
        <SixSteps />
      </div>

      {/* 12. "ТАРИФ" */}
      <div className="mb-10">
        <Tariff />
      </div>

      {/* 13. "FAQ" */}
      <div className="mb-10">
        <FAQ />
      </div>

      {/* 14. "Готов начать сегодня?" */}
      <div className="mb-4">
        <ReadyToStart />
      </div>

      {/* 15. Bottom Actions */}
      <BottomActions />

      {/* Bottom safe area */}
      <div className="h-20" />
    </main>
  );
}
