/**
 * GSAP Animation & Transition Controller
 * Restrained, high-performance micro-interactions and transitions
 * calibrated for quantitative learning (Linear-clean, sub-250ms, non-distracting).
 * 
 * Complies with Taste Skill anti-slop rules:
 * - MOTION_INTENSITY: 4 (Light yet professional, zero cartoon bounce)
 * - Motion must be motivated (communicates hierarchy, momentum, or user feedback)
 * - Safe for SSR / Node environment (mocks in test suite)
 * - Full prefers-reduced-motion support
 */

/**
 * Safely resolves the GSAP runtime instance
 */
export function getGSAP() {
  if (typeof window !== 'undefined' && window.gsap) {
    return window.gsap;
  }
  return null;
}

/**
 * Backwards-compatible alias for getGSAP
 */
export function getMotion() {
  return getGSAP();
}

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  try {
    if (window.__FIN_REDUCE_MOTION === true) return true;
    if (typeof localStorage !== 'undefined' && localStorage.getItem('finbrilliant_reduce_motion') === 'true') {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Common professional GSAP easing curves
 */
export const MOTION_EASE = {
  smooth: 'power2.out',
  enter: 'power2.out',
  exit: 'power2.in',
  linear: 'none'
};

/**
 * View entrance transition (hierarchy & orientation)
 * Subtle fade + 6px slide-up over 0.22s
 */
export function animateViewEntrance(element) {
  if (!element || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.fromTo !== 'function') return null;

  try {
    return gsap.fromTo(
      element,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.22, ease: MOTION_EASE.smooth }
    );
  } catch (err) {
    return null;
  }
}

/**
 * Staggered entrance for cards and grid elements (narrative sequencing)
 * Micro-stagger of 0.03s per card, duration 0.22s
 */
export function staggerCardEntrance(container, selector = '.card-modern, .course-card') {
  if (!container || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.fromTo !== 'function') return null;

  try {
    const cards = container.querySelectorAll(selector);
    if (!cards || cards.length === 0) return null;

    return gsap.fromTo(
      cards,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.22, stagger: 0.03, ease: MOTION_EASE.smooth }
    );
  } catch (err) {
    return null;
  }
}

/**
 * Modal dialog open transition (overlay focus)
 * Snappy scale 0.97 -> 1 and opacity 0 -> 1 in 0.18s
 */
export function animateModalOpen(dialogEl, backdropEl) {
  if (prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap) return null;

  try {
    if (backdropEl && typeof gsap.fromTo === 'function') {
      gsap.fromTo(backdropEl, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: MOTION_EASE.linear });
    }
    if (dialogEl && typeof gsap.fromTo === 'function') {
      return gsap.fromTo(
        dialogEl,
        { opacity: 0, scale: 0.97, y: 4 },
        { opacity: 1, scale: 1, y: 0, duration: 0.18, ease: MOTION_EASE.smooth }
      );
    }
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Modal dialog close transition
 */
export function animateModalClose(dialogEl, backdropEl, onFinish) {
  if (prefersReducedMotion()) {
    if (typeof onFinish === 'function') onFinish();
    return null;
  }
  const gsap = getGSAP();
  if (!gsap || typeof gsap.to !== 'function') {
    if (typeof onFinish === 'function') onFinish();
    return null;
  }

  try {
    if (backdropEl) {
      gsap.to(backdropEl, { opacity: 0, duration: 0.14, ease: MOTION_EASE.linear });
    }
    if (dialogEl) {
      return gsap.to(dialogEl, {
        opacity: 0,
        scale: 0.97,
        duration: 0.14,
        ease: MOTION_EASE.exit,
        onComplete: () => {
          if (typeof onFinish === 'function') onFinish();
        }
      });
    } else {
      if (typeof onFinish === 'function') onFinish();
      return null;
    }
  } catch (err) {
    if (typeof onFinish === 'function') onFinish();
    return null;
  }
}

/**
 * Step transition for lesson cards (momentum & progression)
 */
export function animateStepTransition(cardEl, direction = 'next') {
  if (!cardEl || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.fromTo !== 'function') return null;

  try {
    const xOffset = direction === 'next' ? 10 : -10;
    return gsap.fromTo(
      cardEl,
      { opacity: 0, x: xOffset },
      { opacity: 1, x: 0, duration: 0.20, ease: MOTION_EASE.smooth }
    );
  } catch (err) {
    return null;
  }
}

/**
 * Micro-tactile acknowledgment on option button selection
 */
export function animateOptionSelect(element) {
  if (!element || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.fromTo !== 'function') return null;

  try {
    return gsap.fromTo(
      element,
      { scale: 0.985 },
      { scale: 1, duration: 0.14, ease: MOTION_EASE.smooth }
    );
  } catch (err) {
    return null;
  }
}

/**
 * Segmented progress pill completion pulse
 */
export function animatePillComplete(element) {
  if (!element || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.to !== 'function') return null;

  try {
    if (typeof gsap.timeline === 'function') {
      const tl = gsap.timeline();
      tl.fromTo(element, { scale: 0.9 }, { scale: 1.08, duration: 0.12, ease: MOTION_EASE.smooth })
        .to(element, { scale: 1, duration: 0.10, ease: MOTION_EASE.smooth });
      return tl;
    }
    return gsap.fromTo(
      element,
      { scale: 0.9 },
      { scale: 1, duration: 0.22, ease: MOTION_EASE.smooth }
    );
  } catch (err) {
    return null;
  }
}

/**
 * Floating bottom dock entrance animation
 */
export function animateDockEntrance(dockEl) {
  if (!dockEl || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.fromTo !== 'function') return null;

  try {
    return gsap.fromTo(
      dockEl,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.28, ease: MOTION_EASE.smooth }
    );
  } catch (err) {
    return null;
  }
}

/**
 * Floating dock active tab transition
 */
export function animateTabActive(tabEl) {
  if (!tabEl || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.fromTo !== 'function') return null;

  try {
    return gsap.fromTo(
      tabEl,
      { scale: 0.95 },
      { scale: 1, duration: 0.16, ease: MOTION_EASE.smooth }
    );
  } catch (err) {
    return null;
  }
}

/**
 * Popover menu drop-in animation
 */
export function animatePopoverOpen(popoverEl) {
  if (!popoverEl || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.fromTo !== 'function') return null;

  try {
    return gsap.fromTo(
      popoverEl,
      { opacity: 0, y: -4, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.15, ease: MOTION_EASE.smooth }
    );
  } catch (err) {
    return null;
  }
}

/**
 * Sliding indicator pill for bottom dock tabs
 * Smoothly glides between tabs using GSAP
 */
export function animateDockIndicator(indicatorEl, targetEl, immediate = false) {
  if (!indicatorEl || !targetEl) return null;
  const gsap = getGSAP();

  try {
    const left = typeof targetEl.offsetLeft === 'number' ? targetEl.offsetLeft : 0;
    const width = typeof targetEl.offsetWidth === 'number' && targetEl.offsetWidth > 0 ? targetEl.offsetWidth : 70;
    const height = typeof targetEl.offsetHeight === 'number' && targetEl.offsetHeight > 0 ? targetEl.offsetHeight : 32;
    const top = typeof targetEl.offsetTop === 'number' ? targetEl.offsetTop : 2;

    indicatorEl.style.top = `${top}px`;
    indicatorEl.style.height = `${height}px`;
    indicatorEl.style.display = 'block';

    if (indicatorEl.parentElement) {
      indicatorEl.parentElement.classList.add('has-sliding-pill');
    }

    if (immediate || prefersReducedMotion() || !gsap || typeof gsap.to !== 'function') {
      indicatorEl.style.transform = `translateX(${left}px)`;
      indicatorEl.style.width = `${width}px`;
      indicatorEl.style.opacity = '1';
      return null;
    }

    return gsap.to(indicatorEl, {
      x: left,
      width: width,
      opacity: 1,
      duration: 0.22,
      ease: MOTION_EASE.smooth
    });
  } catch (err) {
    return null;
  }
}

/**
 * Theme toggle rotation and scale spring
 */
export function animateThemeToggle(buttonEl) {
  if (!buttonEl || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.fromTo !== 'function') return null;

  try {
    const icon = buttonEl.querySelector('span') || buttonEl;
    return gsap.fromTo(
      icon,
      { rotation: 0, scale: 0.82 },
      { rotation: 360, scale: 1, duration: 0.35, ease: MOTION_EASE.smooth }
    );
  } catch (err) {
    return null;
  }
}

/**
 * Notification bell chime wobble
 */
export function animateBellChime(bellEl) {
  if (!bellEl || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.to !== 'function') return null;

  try {
    const svg = bellEl.querySelector('svg') || bellEl;
    return gsap.to(svg, {
      keyframes: [
        { rotation: -16, scale: 1.1, duration: 0.08 },
        { rotation: 14, duration: 0.08 },
        { rotation: -8, duration: 0.08 },
        { rotation: 4, duration: 0.08 },
        { rotation: 0, scale: 1, duration: 0.10 }
      ],
      ease: 'power1.inOut'
    });
  } catch (err) {
    return null;
  }
}

/**
 * Smooth XP meter progress bar fill animation
 */
export function animateXPBar(barEl, targetPct) {
  if (!barEl || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.to !== 'function') return null;

  try {
    const pct = Math.max(8, Math.min(100, Number(targetPct) || 0));
    return gsap.to(barEl, {
      width: `${pct}%`,
      duration: 0.55,
      ease: MOTION_EASE.smooth
    });
  } catch (err) {
    return null;
  }
}

/**
 * Staggered search results entrance in Command Palette
 */
export function animatePaletteResults(resultsContainer) {
  if (!resultsContainer || prefersReducedMotion()) return null;
  const gsap = getGSAP();
  if (!gsap || typeof gsap.fromTo !== 'function') return null;

  try {
    const items = resultsContainer.querySelectorAll('.palette-item');
    if (!items || items.length === 0) return null;

    return gsap.fromTo(
      items,
      { opacity: 0, y: 4 },
      { opacity: 1, y: 0, duration: 0.16, stagger: 0.02, ease: MOTION_EASE.smooth }
    );
  } catch (err) {
    return null;
  }
}

/**
 * Animate floating bottom dock visibility based on scroll direction
 * Smoothly glides all the way down offscreen (y: 140), and rises back up (y: 0)
 * Avoids abrupt opacity cuts so user sees full physical descending and rising motion
 * isVisible: true => slide up into position from below screen (y: 0)
 * isVisible: false => slide all the way down and hide below screen (y: 140)
 */
export function animateDockVisibility(containerEl, isVisible) {
  if (!containerEl) return null;
  if (prefersReducedMotion()) {
    if (containerEl.style) {
      containerEl.style.transition = 'none';
      containerEl.style.transform = isVisible ? 'translateY(0)' : 'translateY(160px)';
      containerEl.style.pointerEvents = isVisible ? 'auto' : 'none';
    }
    return null;
  }

  let gsapResult = null;
  const gsap = getGSAP();
  if (gsap && typeof gsap.to === 'function') {
    try {
      gsapResult = gsap.to(containerEl, {
        y: isVisible ? 0 : 140,
        duration: isVisible ? 0.38 : 0.32,
        ease: MOTION_EASE.smooth,
        onComplete: () => {
          if (containerEl.style) {
            containerEl.style.pointerEvents = isVisible ? 'auto' : 'none';
          }
        }
      });
    } catch (err) {}
  }

  // Direct Web Animations API fallback
  if (!gsapResult && typeof containerEl.animate === 'function') {
    try {
      if (containerEl._finDockAnim && typeof containerEl._finDockAnim.cancel === 'function') {
        containerEl._finDockAnim.cancel();
      }

      let currentY = isVisible ? 160 : 0;
      if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
        try {
          const comp = window.getComputedStyle(containerEl).transform;
          if (comp && comp !== 'none') {
            const m = comp.match(/matrix\(.+,\s*([-\d.]+)\)/);
            if (m && m[1]) {
              currentY = parseFloat(m[1]);
            }
          }
        } catch (e) {}
      }

      const targetY = isVisible ? 0 : 160;
      const duration = isVisible ? 620 : 580;

      if (containerEl.style) {
        containerEl.style.transform = `translateY(${targetY}px)`;
        containerEl.style.pointerEvents = isVisible ? 'auto' : 'none';
      }

      const anim = containerEl.animate(
        [
          { transform: `translateY(${currentY}px)` },
          { transform: `translateY(${targetY}px)` }
        ],
        {
          duration,
          easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
          fill: 'both'
        }
      );
      containerEl._finDockAnim = anim;
      return anim;
    } catch (e) {}
  }

  if (containerEl.style) {
    containerEl.style.pointerEvents = isVisible ? 'auto' : 'none';
  }
  return gsapResult;
}
