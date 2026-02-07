'use client';

import { useEffect } from 'react';

export default function AnimationObserver() {
  useEffect(() => {
    // Respect user preference for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.fade-up').forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (let i = 0; i < entries.length; i++) {
          if (entries[i].isIntersecting) {
            entries[i].target.classList.add('visible');
            observer.unobserve(entries[i].target); // stop observing once visible — saves CPU
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    const elements = document.querySelectorAll('.fade-up');
    for (let i = 0; i < elements.length; i++) {
      observer.observe(elements[i]);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
