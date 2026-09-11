/**
 * Lenis Smooth Inertial Scroll Manager
 * Synchronizes natural momentum physics with GSAP ScrollTrigger
 * with full reduced motion safety and zero layout thrashing.
 */

let lenisInstance = null;
let tickerCallback = null;

export function getLenis() {
  return lenisInstance;
}

export function initSmoothScroll() {
  if (typeof window === 'undefined') return null;

  // If user requested reduced motion, skip Lenis to preserve native instant scroll
  if (window.__FIN_REDUCE_MOTION === true) {
    return null;
  }
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem('finbrilliant_reduce_motion') === 'true') {
      return null;
    }
  }

  const LenisClass = window.Lenis;
  if (!LenisClass) return null;

  // Destroy previous instance if re-initializing
  if (lenisInstance) {
    destroySmoothScroll();
  }

  try {
    lenisInstance = new LenisClass({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
      infinite: false,
      autoRaf: false,
      respectReducedMotion: false
    });

    // Synchronize with GSAP ScrollTrigger
    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      lenisInstance.on('scroll', window.ScrollTrigger.update);
      tickerCallback = (time) => {
        if (lenisInstance) lenisInstance.raf(time * 1000);
      };
      window.gsap.ticker.add(tickerCallback);
      window.gsap.ticker.lagSmoothing(0);
    } else {
      let rafId = null;
      const raf = (time) => {
        if (lenisInstance) {
          lenisInstance.raf(time);
          rafId = requestAnimationFrame(raf);
        }
      };
      rafId = requestAnimationFrame(raf);
    }

    window.__lenis = lenisInstance;
    return lenisInstance;
  } catch (err) {
    console.warn('Lenis smooth scroll initialization skipped:', err);
    return null;
  }
}

export function scrollToTarget(target, options = {}) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      duration: 1.2,
      offset: -40,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options
    });
  } else if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  } else if (target && typeof target.scrollIntoView === 'function') {
    target.scrollIntoView({ behavior: 'smooth' });
  }
}

export function destroySmoothScroll() {
  if (tickerCallback && window.gsap && window.gsap.ticker) {
    try {
      window.gsap.ticker.remove(tickerCallback);
    } catch (e) {}
    tickerCallback = null;
  }

  if (lenisInstance) {
    try {
      lenisInstance.destroy();
    } catch (e) {}
    lenisInstance = null;
    window.__lenis = null;
  }
}
