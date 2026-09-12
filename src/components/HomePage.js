/**
 * ALL ELSE EQUAL: Homepage Orchestrator
 * Integrates the 8-scene cinematic scroll hero with the post-cinematic
 * editorial learning platform, interactive sandbox, and curriculum atlas.
 * Pure Swiss monochrome print aesthetic, stark contrast, and zero artificial chrome.
 */

import { renderCinematicHero } from './CinematicHero.js';
import { bindCinematicScroller } from '../utils/cinematicScroller.js';
import { getHomePageMarkup } from './home/homeMarkup.js';
import { setupInteractiveSandbox } from './home/homeSandbox.js';
import { scrollToTarget } from '../utils/smoothScroll.js';
import { renderNavbar } from './Navbar.js';

export function renderHomePage(container, state, onNavigate = () => {}, onToggleTheme = null, onToggleSound = null) {
  let cleanupScroller = null;
  let heroInstance = null;
  let navbarCleanup = null;
  let themeToggleHandler = null;

  // Render Swiss monochrome markup structure
  const profile = (state && state.profile) ? state.profile : { xp: 120, streak: 3, soundEnabled: true, theme: 'dark' };
  const isLight = profile.theme === 'light';
  container.innerHTML = getHomePageMarkup({ profile, isLight, state });

  // Mount and wire up the standardized navbar if #navbar-mount is present
  const navMount = container.querySelector('#navbar-mount');
  if (navMount) {
    navbarCleanup = renderNavbar(
      navMount,
      state,
      (view, lessonId = null) => {
        onNavigate(view, lessonId);
      },
      () => {
        let nextTheme;
        if (typeof onToggleTheme === 'function') {
          nextTheme = onToggleTheme();
        } else {
          const isCurrentlyDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
          nextTheme = isCurrentlyDark ? 'light' : 'dark';
          if (typeof document !== 'undefined') {
            const root = document.documentElement;
            root.classList.toggle('dark', nextTheme === 'dark');
            root.classList.toggle('light', nextTheme === 'light');
            document.body.classList.toggle('theme-dark', nextTheme === 'dark');
            document.body.classList.toggle('theme-light', nextTheme === 'light');
            try {
              root.style.colorScheme = nextTheme;
              localStorage.setItem('finbrilliant_theme', nextTheme);
            } catch (e) {}
          }
        }
        if (state && state.profile) {
          state.profile.theme = nextTheme;
        }
        return nextTheme;
      },
      () => {
        if (typeof onToggleSound === 'function') {
          return onToggleSound();
        }
      }
    );
  }

  // Fallback Bauhaus Aperture Theme Toggle Handler (for unit tests / mock containers without #navbar-mount)
  const themeToggle = container.querySelector('#aee-theme-toggle');
  const themeLabel = container.querySelector('#aee-theme-label');
  const themeAperture = container.querySelector('.aee-theme-aperture');

  if (!navMount && themeToggle) {
    const updateThemeUI = (isDark) => {
      if (themeLabel) {
        themeLabel.textContent = isDark ? 'DARK' : 'LIGHT';
      }
      if (themeAperture) {
        themeAperture.style.transform = isDark ? 'rotate(0deg)' : 'rotate(180deg)';
      }
      if (themeToggle) {
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        themeToggle.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      }
    };

    const initialIsDark = (state && state.profile && state.profile.theme)
      ? state.profile.theme !== 'light'
      : (typeof document !== 'undefined' ? !document.documentElement.classList.contains('light') : true);

    updateThemeUI(initialIsDark);

    themeToggleHandler = () => {
      let nextTheme;
      if (typeof onToggleTheme === 'function') {
        nextTheme = onToggleTheme();
      } else {
        const isCurrentlyDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
        nextTheme = isCurrentlyDark ? 'light' : 'dark';
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          root.classList.toggle('dark', nextTheme === 'dark');
          root.classList.toggle('light', nextTheme === 'light');
          document.body.classList.toggle('theme-dark', nextTheme === 'dark');
          document.body.classList.toggle('theme-light', nextTheme === 'light');
          try {
            root.style.colorScheme = nextTheme;
            localStorage.setItem('finbrilliant_theme', nextTheme);
          } catch (e) {}
        }
      }
      if (state && state.profile) {
        state.profile.theme = nextTheme;
      }
      const isDark = nextTheme !== 'light';
      updateThemeUI(isDark);
    };

    themeToggle.addEventListener('click', themeToggleHandler);
  }

  // Mount the Cinematic Hero
  const cinematicMount = container.querySelector('#aee-cinematic-mount');
  if (cinematicMount) {
    heroInstance = renderCinematicHero(cinematicMount, onNavigate);
    if (typeof window !== 'undefined') {
      window.__aee_hero = heroInstance;
    }
    const stageTrack = cinematicMount.querySelector('#aee-stage-track');
    if (stageTrack) {
      cleanupScroller = bindCinematicScroller(stageTrack, (progress) => {
        heroInstance.updateProgress(progress);
      });
      if (typeof window !== 'undefined' && window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
        requestAnimationFrame(() => {
          try {
            window.ScrollTrigger.refresh();
          } catch (e) {}
        });
      }
    }
  }

  // Window Resize & Orientation Change Listener for Pin Recalibration
  let resizeTimer = null;
  const onWindowResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
        try {
          window.ScrollTrigger.refresh();
        } catch (e) {}
      }
    }, 150);
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('orientationchange', onWindowResize, { passive: true });
  }

  // Header Navigation Handlers
  const navLearn = container.querySelector('#nav-learn-btn');
  if (navLearn) navLearn.addEventListener('click', () => onNavigate('courses'));

  const navExplore = container.querySelector('#nav-explore-btn');
  if (navExplore) {
    navExplore.addEventListener('click', () => {
      const sandbox = container.querySelector('#aee-sandbox-section');
      if (sandbox) {
        scrollToTarget(sandbox);
      }
    });
  }

  const navAbout = container.querySelector('#nav-about-btn');
  if (navAbout) {
    navAbout.addEventListener('click', () => {
      const about = container.querySelector('#aee-about-section');
      if (about) {
        scrollToTarget(about);
      }
    });
  }

  // Post-Cinematic Call-to-Action Buttons
  const startBtn = container.querySelector('#cta-start-btn');
  if (startBtn) startBtn.addEventListener('click', () => onNavigate('courses'));

  const grillBtn = container.querySelector('#cta-grill-btn');
  if (grillBtn) grillBtn.addEventListener('click', () => onNavigate('grill'));

  // Realm Exploration Buttons
  container.querySelectorAll('.realm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      onNavigate(btn.getAttribute('data-realm') || 'courses');
    });
  });

  // Setup Interactive 3-Mode Financial Sandbox
  setupInteractiveSandbox(container);

  // Return lifecycle teardown handler
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('orientationchange', onWindowResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      window.__aee_hero = null;
    }
    if (navbarCleanup && typeof navbarCleanup === 'function') {
      navbarCleanup();
    }
    if (themeToggle && themeToggleHandler) {
      themeToggle.removeEventListener('click', themeToggleHandler);
    }
    if (heroInstance && typeof heroInstance.destroy === 'function') {
      heroInstance.destroy();
    }
    if (cleanupScroller && typeof cleanupScroller === 'function') {
      cleanupScroller();
    }
  };
}
