/**
 * ALL ELSE EQUAL: 8-Scene Cinematic Scroll Experience
 * Continuous SVG and typographic transformation reproducing the 8 reference scenes
 * with Swiss graphic print aesthetics, stark monochrome palette, and continuous spatial morphing.
 */

import { getCinematicHeroMarkup } from './hero/scenesMarkup.js';
import { updateCinematicHero, clearDOMCache } from './hero/heroUpdater.js';
import { setupMetabolismInteractions } from './hero/metabolism.js';
import { scrollToTarget } from '../utils/smoothScroll.js';

export function renderCinematicHero(container, onNavigate = () => {}) {
  clearDOMCache(container);
  container.innerHTML = getCinematicHeroMarkup();

  // Attach button click listeners
  const enterBtn = container.querySelector('#aee-enter-btn');
  if (enterBtn) {
    enterBtn.addEventListener('click', () => {
      onNavigate('courses');
    });
  }

  const exploreBtn = container.querySelector('#aee-explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      const sandbox = document.getElementById('aee-sandbox-section');
      if (sandbox) {
        scrollToTarget(sandbox);
      } else {
        onNavigate('lab');
      }
    });
  }

  // Setup Living Metabolism (Scene 4) GSAP animations & interactive adjacency focus
  const cleanupMetabolism = setupMetabolismInteractions(container);

  // Initial synchronization for scroll = 0
  updateCinematicHero(container, 0);

  return {
    updateProgress: (progress) => {
      updateCinematicHero(container, progress);
    },
    destroy: () => {
      clearDOMCache(container);
      if (typeof cleanupMetabolism === 'function') {
        cleanupMetabolism();
      }
    }
  };
}

export { updateCinematicHero, setupMetabolismInteractions };
