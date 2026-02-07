'use client';

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
    <main className="w-full min-h-screen relative overflow-hidden">
      <AnimationObserver />

      {/* Ambient glow orbs */}
      <div className="glow-orb w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-[#02691A] top-[800px] -left-[100px]" />
      <div className="glow-orb w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] bg-[#D3F800] top-[1600px] -right-[80px]" style={{ animationDelay: '3s' }} />
      <div className="glow-orb w-[200px] h-[200px] lg:w-[350px] lg:h-[350px] bg-[#075500] top-[2800px] -left-[60px]" style={{ animationDelay: '5s' }} />

      {/* Hero: full width */}
      <HeroSection />

      {/* Hero→content transition */}
      <div
        className="relative w-full h-32 lg:h-40 -mt-px pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, #0F0F0F 0%, #0F0F0F 10%, rgba(15,15,15,0.7) 40%, rgba(15,15,15,0.3) 70%, transparent 100%)',
        }}
      />

      {/* Content sections — inner container with responsive padding */}
      <div className="max-w-[1400px] mx-auto px-5 lg:px-16 xl:px-24">
        <section id="kak-eto-rabotaet" className="mb-16 lg:mb-16 scroll-mt-15 lg:scroll-mt-20">
          <FeatureCarousel />
        </section>

        <div className="mb-10 lg:mb-16">
          <HowItWorks />
        </div>

        <div className="mb-10 lg:mb-16">
          <SixSteps />
        </div>

        <div className="mb-10 lg:mb-16">
          <Tariff />
        </div>

        <div className="mb-10 lg:mb-16">
          <FAQ />
        </div>

        <div className="mb-4">
          <ReadyToStart />
        </div>

        <BottomActions />

        <div className="h-20" />
      </div>
    </main>
  );
}
