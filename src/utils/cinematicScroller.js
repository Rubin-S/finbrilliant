/**
 * High-performance Cinematic Scroll Timeline Manager
 * Normalizes scroll progress across the pinned stage and maps it to
 * the 8 continuous story scenes with fluid scrubbing and isomorphic safety.
 */

export const SCENE_BOUNDS = [
  { index: 1, id: 'change', start: 0.00, end: 0.12, label: 'Change', title: 'Equilibrium & The Spark' },
  { index: 2, id: 'first-effect', start: 0.12, end: 0.25, label: 'First Effect', title: 'The Direct Bond Shock' },
  { index: 3, id: 'second-order', start: 0.25, end: 0.38, label: 'Second Order', title: 'The Causal Cascade' },
  { index: 4, id: 'system', start: 0.38, end: 0.52, label: 'The System', title: 'The Living Metabolism' },
  { index: 5, id: 'price', start: 0.52, end: 0.65, label: 'Price', title: 'The Auction at Ground Zero' },
  { index: 6, id: 'value', start: 0.65, end: 0.77, label: 'Value', title: 'The Illusion of Certainty' },
  { index: 7, id: 'risk', start: 0.77, end: 0.88, label: 'Risk', title: 'The Probability Space' },
  { index: 8, id: 'world', start: 0.88, end: 1.00, label: 'The Financial World', title: 'The Living Atlas' }
];

export function clamp(val, min = 0, max = 1) {
  return Math.max(min, Math.min(max, val));
}

export function remap(val, inMin, inMax, outMin = 0, outMax = 1) {
  if (inMax === inMin) return outMin;
  const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
  return outMin + t * (outMax - outMin);
}

export function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/**
 * Calculates local progress [0..1] within a specific sub-range
 */
export function getRangeProgress(globalProgress, start, end) {
  if (globalProgress <= start) return 0;
  if (globalProgress >= end) return 1;
  return (globalProgress - start) / (end - start);
}

/**
 * Resolves the currently dominant scene index (1-based, 1..8)
 */
export function getActiveScene(progress) {
  const p = clamp(progress, 0, 1);
  for (let i = 0; i < SCENE_BOUNDS.length; i++) {
    const b = SCENE_BOUNDS[i];
    if (p >= b.start && (p < b.end || i === SCENE_BOUNDS.length - 1)) {
      return b;
    }
  }
  return SCENE_BOUNDS[0];
}

/**
 * Binds scroll listening to a stage container with smooth frame scrubbing
 */
export function bindCinematicScroller(containerEl, onProgressUpdate) {
  if (!containerEl || typeof window === 'undefined') {
    return () => {};
  }

  const isReduced = typeof window !== 'undefined' && (
    window.__FIN_REDUCE_MOTION === true ||
    (typeof localStorage !== 'undefined' && localStorage.getItem('finbrilliant_reduce_motion') === 'true')
  );

  // If GSAP ScrollTrigger is available in browser runtime, use damped playhead tweening
  if (typeof window !== 'undefined' && window.gsap && window.ScrollTrigger) {
    try {
      window.gsap.registerPlugin(window.ScrollTrigger);
      const hasLenis = Boolean(window.__lenis);
      const scrubConfig = isReduced ? false : (hasLenis ? true : 0.65);
      const playhead = { progress: 0 };
      const tween = window.gsap.to(playhead, {
        progress: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerEl,
          start: 'top top',
          end: 'bottom bottom',
          scrub: scrubConfig,
          invalidateOnRefresh: true
        },
        onUpdate: () => {
          onProgressUpdate(playhead.progress);
        }
      });

      return () => {
        try {
          if (tween.scrollTrigger) {
            tween.scrollTrigger.kill();
          }
          tween.kill();
        } catch (e) {}
      };
    } catch (err) {
      // Fall through to high-performance RAF loop below
    }
  }

  let rafId = null;
  let targetProgress = 0;
  let currentProgress = 0;
  let isRunning = false;

  const measure = () => {
    const rect = containerEl.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 800;
    const scrollableDistance = rect.height - viewportHeight;

    if (scrollableDistance <= 0) {
      targetProgress = 0;
      return;
    }

    const scrolledPastTop = -rect.top;
    targetProgress = clamp(scrolledPastTop / scrollableDistance, 0, 1);
  };

  const tick = () => {
    if (!isRunning) return;

    measure();

    if (isReduced) {
      currentProgress = targetProgress;
      onProgressUpdate(currentProgress);
      rafId = null;
      return;
    }

    // Silky smooth responsive lerp for fluid playhead scrubbing
    const delta = targetProgress - currentProgress;
    if (Math.abs(delta) < 0.0005) {
      currentProgress = targetProgress;
      onProgressUpdate(currentProgress);
      rafId = null;
      return;
    }

    currentProgress += delta * 0.18;
    onProgressUpdate(currentProgress);
    rafId = requestAnimationFrame(tick);
  };

  const startTicking = () => {
    if (!isRunning) return;
    if (!rafId) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const onScroll = () => {
    measure();
    startTicking();
  };

  const onResize = () => {
    measure();
    startTicking();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });

  measure();
  currentProgress = targetProgress;
  isRunning = true;
  onProgressUpdate(currentProgress);
  if (Math.abs(targetProgress - currentProgress) >= 0.0005) {
    rafId = requestAnimationFrame(tick);
  }

  return () => {
    isRunning = false;
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
  };
}
