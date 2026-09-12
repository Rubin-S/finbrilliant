/**
 * FinBrilliant Navbar Component
 * Rebuilt from reference design: High-end quantitative finance aesthetic.
 * 
 * Reading this as: Quantitative finance education platform for analytical learners,
 * with a sleek dark-mode terminal/Linear-style language, leaning toward Tailwind utilities +
 * Geist + restrained micro-interactions.
 * 
 * Layout Hierarchy:
 * - Row 1 (Top Bar - 36px):
 *   - Left: Authentic folded origami dual-tile logo mark (cyan/teal & emerald/mint) +
 *           "FinBrilliant" bold typography + "First-Principles Finance" tagline.
 *   - Center: Precision search bar with magnifying glass icon, placeholder, and ⌘K badge.
 *   - Right: Upward sparkline trending icon + XP readout with emerald progress bar directly below,
 *            vertical hairline divider, notification bell with glowing status indicator dot,
 *            and circular JD avatar with dropdown chevron.
 * - Row 2 (Bottom Bar - 28px):
 *   - Centered navigation tabs: Learn (Courses), Practice (Grill Me), Markets (Daily Boost), Goals, Lab.
 *   - Active tab features vibrant emerald text and an active indicator bar resting flush on the bottom border.
 * - Interactive Command Palette (Cmd+K / Ctrl+K) modal with real-time course/lesson/tool search.
 * - Profile and Notification popovers with full theme/sound controls and streak summaries.
 * - Guaranteed memory cleanup to prevent event listener pileup on re-renders.
 */

import { getTierForXP } from '../storage.js';
import { soundEngine } from '../audio.js';
import { getSearchIndex } from './navbar/searchIndex.js';
import { getNavbarMarkup } from './navbar/navbarMarkup.js';
import {
  animateModalOpen,
  animateModalClose,
  animateDockEntrance,
  animateTabActive,
  animatePopoverOpen,
  animateDockIndicator,
  animateThemeToggle,
  animateBellChime,
  animateXPBar,
  animatePaletteResults,
  animateDockVisibility
} from '../utils/motion.js';

/**
 * Detects whether the user's platform uses Mac modifier conventions (⌘ / Cmd)
 * or Windows/Linux modifier conventions (Ctrl).
 * 
 * Supports an optional customPlatform parameter for testability.
 * 
 * @param {string|null} [customPlatform=null]
 * @returns {{ symbol: string, label: string, compact: string, isMac: boolean }}
 */
export function getPlatformShortcut(customPlatform = null) {
  let isMac = false;
  try {
    if (customPlatform !== null) {
      const p = String(customPlatform).toLowerCase();
      isMac = p.includes('mac') || p.includes('iphone') || p.includes('ipad') || p.includes('ipod');
    } else if (typeof navigator !== 'undefined') {
      const platform = (
        (navigator.userAgentData && navigator.userAgentData.platform) ||
        navigator.platform ||
        navigator.userAgent ||
        ''
      ).toLowerCase();
      isMac = platform.includes('mac') ||
              platform.includes('iphone') ||
              platform.includes('ipad') ||
              platform.includes('ipod');
    }
  } catch (_e) {
    isMac = false;
  }

  return {
    symbol: isMac ? '⌘' : 'Ctrl',
    label: isMac ? '⌘ K' : 'Ctrl K',
    compact: isMac ? '⌘K' : 'Ctrl+K',
    isMac
  };
}

export function renderNavbar(container, state, onNavigate, onToggleTheme, onToggleSound) {
  const profile = state.profile;
  const tier = getTierForXP(profile.xp);
  const isLight = profile.theme === 'light';

  // Navigation tabs matching reference design
  const navTabs = [
    { id: 'courses', label: 'Learn', srText: 'Courses', title: 'Courses & Curricula' },
    { id: 'grill', label: 'Practice', srText: 'Grill Me', title: 'Superday Interview Practice' },
    { id: 'boost', label: 'Markets', srText: 'Daily Boost', title: 'Daily Boost & Market Dynamics' },
    { id: 'goal', label: 'Goals', srText: 'Goals', title: 'Weekly Learning Goals' },
    { id: 'lab', label: 'Lab', srText: 'Lab', title: 'Interactive Finance Sandbox' }
  ];

  // Calculate progress percentage for XP meter bar
  const progressPercent = Math.max(8, Math.min(100, tier.progressPct || 40));
  const platformShortcut = getPlatformShortcut();

  container.innerHTML = getNavbarMarkup({ profile, tier, isLight, navTabs, progressPercent, platformShortcut, state });

  // Floating Bottom Dock Entrance Animation
  const bottomDock = container.querySelector('.fin-bottom-dock');
  if (bottomDock) {
    animateDockEntrance(bottomDock);
  }

  // Animate XP progress meter bar fill
  const xpFill = container.querySelector('#navbar-xp-fill');
  if (xpFill) {
    animateXPBar(xpFill, progressPercent);
  }

  // Sliding Indicator Pill for Bottom Dock Tabs (Vercel/Linear style glide)
  const dockTrack = container.querySelector('.dock-tabs-track');
  const activePill = container.querySelector('#dock-active-pill');
  const activeTabBtn = dockTrack?.querySelector('.nav-btn.active-tab');

  if (activePill && activeTabBtn) {
    const syncPill = (immediate = false) => {
      const current = dockTrack.querySelector('.nav-btn.active-tab');
      if (current) animateDockIndicator(activePill, current, immediate);
    };

    // Immediately position indicator on active tab
    syncPill(true);
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => syncPill(true));
    }

    dockTrack.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        animateDockIndicator(activePill, btn);
      });
    });

    dockTrack.addEventListener('mouseleave', () => {
      syncPill(false);
    });
  }

  // Dynamic Scroll Visibility for Floating Bottom Dock:
  // "When I scroll up let it hide and I scroll down let it appear"
  const dockContainer = container.querySelector('#fin-bottom-dock-container') || container.querySelector('aside');
  let lastScrollY = (typeof window !== 'undefined' && typeof window.scrollY === 'number') ? window.scrollY : 0;
  let isDockVisible = true;
  const SCROLL_THRESHOLD = 6;

  const updateDockVisibility = (visible) => {
    if (!dockContainer || isDockVisible === visible) return;
    isDockVisible = visible;
    if (visible) {
      if (dockContainer.classList && typeof dockContainer.classList.remove === 'function') {
        dockContainer.classList.remove('dock-hidden');
      }
    } else {
      if (dockContainer.classList && typeof dockContainer.classList.add === 'function') {
        dockContainer.classList.add('dock-hidden');
      }
    }
    animateDockVisibility(dockContainer, visible);
  };

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    if (window._finNavbarScrollHandler) {
      window.removeEventListener('scroll', window._finNavbarScrollHandler);
    }
    if (window._finNavbarMouseMoveHandler) {
      window.removeEventListener('mousemove', window._finNavbarMouseMoveHandler);
    }

    let scrollTicking = false;

    const processScroll = () => {
      scrollTicking = false;
      const currentScrollY = (typeof window.scrollY === 'number') ? window.scrollY : 0;
      const docHeight = (typeof document !== 'undefined' && document.documentElement && typeof document.documentElement.scrollHeight === 'number')
        ? document.documentElement.scrollHeight
        : 0;
      const winHeight = (typeof window.innerHeight === 'number') ? window.innerHeight : 0;
      const maxScrollY = docHeight - winHeight;

      // Ignore overscroll bounce at the very top or bottom
      if (currentScrollY < 0 || (maxScrollY > 0 && currentScrollY > maxScrollY)) {
        return;
      }

      // If at or near top of the page, always keep dock visible in resting position
      if (currentScrollY <= 20) {
        updateDockVisibility(true);
        lastScrollY = currentScrollY;
        return;
      }

      // If page has no scrollable depth, ensure dock stays visible
      if (docHeight > 0 && winHeight > 0 && docHeight <= winHeight + 40) {
        updateDockVisibility(true);
        return;
      }

      const delta = currentScrollY - lastScrollY;
      if (Math.abs(delta) >= SCROLL_THRESHOLD) {
        if (delta > 0) {
          // Scrolling DOWN: Disappear and hide below the screen!
          updateDockVisibility(false);
        } else {
          // Scrolling UP: Appear and rise back into position from below screen!
          updateDockVisibility(true);
        }
        lastScrollY = currentScrollY;
      }
    };

    const handleScroll = () => {
      if (!scrollTicking) {
        if (typeof window.requestAnimationFrame === 'function') {
          scrollTicking = true;
          window.requestAnimationFrame(processScroll);
        } else {
          processScroll();
        }
      }
    };

    // Bottom-edge hover reveal: if cursor moves near bottom edge, reveal dock for easy interaction
    const handleMouseMove = (e) => {
      if (!isDockVisible && e && typeof e.clientY === 'number') {
        const winHeight = (typeof window.innerHeight === 'number') ? window.innerHeight : 800;
        if (e.clientY >= winHeight - 64) {
          updateDockVisibility(true);
        }
      }
    };

    window._finNavbarScrollHandler = handleScroll;
    window._finNavbarMouseMoveHandler = handleMouseMove;
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
  }

  // Attach Navigation Click Event Handlers
  container.querySelectorAll('.brand-logo, .nav-btn, .xp-badge').forEach(el => {
    el.addEventListener('click', () => {
      const view = el.getAttribute('data-view');
      const lessonId = el.getAttribute('data-lesson-id');
      if (view) {
        soundEngine.playClick();
        animateTabActive(el);
        const isNavBtn = (el.classList && typeof el.classList.contains === 'function')
          ? el.classList.contains('nav-btn')
          : (el.className && el.className.split(/\s+/).includes('nav-btn'));
        if (activePill && isNavBtn) {
          animateDockIndicator(activePill, el);
        }
        if (typeof onNavigate === 'function') {
          onNavigate(view, lessonId || null);
        }
      }
    });
  });

  // Top Nav About Button Handler
  const navAboutBtn = container.querySelector('#nav-about-btn');
  if (navAboutBtn) {
    navAboutBtn.addEventListener('click', () => {
      soundEngine.playClick();
      if (typeof onNavigate === 'function') {
        onNavigate('home');
        setTimeout(() => {
          if (typeof document !== 'undefined') {
            const aboutSection = document.querySelector('#aee-about-section');
            if (aboutSection && typeof aboutSection.scrollIntoView === 'function') {
              aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 150);
      }
    });
  }

  // Sound Toggle Handler
  const soundBtn = container.querySelector('.sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      soundEngine.playClick();
      if (typeof onToggleSound === 'function') {
        onToggleSound();
      }
    });
  }

  // Theme Toggle Handlers with Motion rotation
  container.querySelectorAll('.theme-toggle').forEach(themeBtn => {
    themeBtn.addEventListener('click', (e) => {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      soundEngine.playClick();
      animateThemeToggle(themeBtn);
      let nextTheme;
      if (typeof onToggleTheme === 'function') {
        nextTheme = onToggleTheme();
      }
      const isDark = nextTheme ? nextTheme !== 'light' : (typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : true);
      container.querySelectorAll('.aee-theme-aperture').forEach(ap => {
        ap.style.transform = isDark ? 'rotate(0deg)' : 'rotate(180deg)';
      });
      container.querySelectorAll('#aee-theme-label').forEach(lbl => {
        lbl.textContent = isDark ? 'DARK' : 'LIGHT';
      });
      container.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        btn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      });
    });
  });

  // Popover Toggles (Profile & Notifications)
  const profileToggle = container.querySelector('.profile-toggle');
  const profileDropdown = container.querySelector('#profile-dropdown');
  const bellToggle = container.querySelector('.bell-toggle');
  const notifPopover = container.querySelector('#notifications-popover');

  if (profileToggle && profileDropdown) {
    profileToggle.addEventListener('click', (e) => {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      soundEngine.playClick();
      if (profileDropdown.classList) {
        const isClosed = profileDropdown.classList.contains('hidden');
        if (notifPopover && notifPopover.classList) notifPopover.classList.add('hidden');
        profileDropdown.classList.toggle('hidden', !isClosed);
        if (isClosed) {
          animatePopoverOpen(profileDropdown);
        }
        if (typeof profileToggle.setAttribute === 'function') {
          profileToggle.setAttribute('aria-expanded', String(isClosed));
        }
      }
    });
  }

  if (bellToggle && notifPopover) {
    bellToggle.addEventListener('mouseenter', () => {
      animateBellChime(bellToggle);
    });

    bellToggle.addEventListener('click', (e) => {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      soundEngine.playClick();
      animateBellChime(bellToggle);
      if (notifPopover.classList) {
        const isClosed = notifPopover.classList.contains('hidden');
        if (profileDropdown && profileDropdown.classList) profileDropdown.classList.add('hidden');
        notifPopover.classList.toggle('hidden', !isClosed);
        if (isClosed) {
          animatePopoverOpen(notifPopover);
        }
        if (typeof bellToggle.setAttribute === 'function') {
          bellToggle.setAttribute('aria-expanded', String(isClosed));
        }
      }
    });
  }

  // Memory cleanup: remove previous document click listener before adding new one
  if (typeof document !== 'undefined') {
    if (document._finNavbarClickHandler) {
      document.removeEventListener('click', document._finNavbarClickHandler);
    }
    const handleDocumentClick = (e) => {
      if (profileDropdown && !profileDropdown.contains(e.target) && !profileToggle?.contains(e.target)) {
        profileDropdown.classList.add('hidden');
        profileToggle?.setAttribute('aria-expanded', 'false');
      }
      if (notifPopover && !notifPopover.contains(e.target) && !bellToggle?.contains(e.target)) {
        notifPopover.classList.add('hidden');
        bellToggle?.setAttribute('aria-expanded', 'false');
      }
    };
    document._finNavbarClickHandler = handleDocumentClick;
    document.addEventListener('click', handleDocumentClick);
  }

  // ==========================================
  // Command Palette Search Engine
  // ==========================================
  const searchIndex = getSearchIndex();
  const paletteModal = container.querySelector('#palette-modal');
  const paletteInput = container.querySelector('#palette-input');
  const paletteResults = container.querySelector('#palette-results');
  const paletteCloseBtn = container.querySelector('#palette-close-btn');
  const paletteBackdrop = container.querySelector('#palette-backdrop');
  let selectedResultIdx = 0;
  let currentFilteredList = [];

  const openPalette = () => {
    if (!paletteModal) return;
    updateDockVisibility(true);
    soundEngine.playClick();
    paletteModal.classList.remove('hidden');
    const dialogEl = paletteModal.querySelector('.relative');
    animateModalOpen(dialogEl, paletteBackdrop);
    if (profileDropdown) profileDropdown.classList.add('hidden');
    if (notifPopover) notifPopover.classList.add('hidden');
    if (paletteInput) {
      paletteInput.value = '';
      setTimeout(() => paletteInput.focus(), 50);
    }
    renderPaletteResults('');
  };

  const closePalette = () => {
    if (!paletteModal) return;
    const dialogEl = paletteModal.querySelector('.relative');
    animateModalClose(dialogEl, paletteBackdrop, () => {
      paletteModal.classList.add('hidden');
    });
  };

  const renderPaletteResults = (query) => {
    if (!paletteResults) return;
    const cleanQuery = query.toLowerCase().trim();

    if (!cleanQuery) {
      currentFilteredList = searchIndex.slice(0, 8);
    } else {
      currentFilteredList = searchIndex.filter(item => {
        return (
          item.title.toLowerCase().includes(cleanQuery) ||
          item.subtitle.toLowerCase().includes(cleanQuery) ||
          item.category.toLowerCase().includes(cleanQuery) ||
          item.keywords.toLowerCase().includes(cleanQuery)
        );
      }).slice(0, 10);
    }

    selectedResultIdx = 0;

    if (currentFilteredList.length === 0) {
      paletteResults.innerHTML = `
        <div class="p-6 text-center text-slate-500">
          <p class="text-sm font-semibold">No results found for "${query}"</p>
          <p class="text-xs mt-1">Try searching for "DCF", "options", "orderbook", "compounding", or "interview".</p>
        </div>
      `;
      return;
    }

    paletteResults.innerHTML = currentFilteredList.map((item, idx) => `
      <div 
        class="palette-item p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition ${
          idx === selectedResultIdx ? 'bg-slate-800/90 text-white' : 'hover:bg-slate-800/50 text-slate-300'
        }"
        data-idx="${idx}"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-7 h-7 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shrink-0">
            ${item.icon}
          </div>
          <div class="overflow-hidden">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-xs text-slate-200 truncate">${item.title}</span>
              <span class="text-[9.5px] font-mono px-1.5 py-0.2 rounded uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${item.badge}</span>
            </div>
            <p class="text-[11px] text-slate-400 truncate">${item.subtitle}</p>
          </div>
        </div>
        <span class="text-[10px] font-mono text-slate-500 uppercase shrink-0 ml-2">${item.category}</span>
      </div>
    `).join('');

    // Attach click and mouseenter listeners to rendered results
    paletteResults.querySelectorAll('.palette-item').forEach(itemEl => {
      const idx = parseInt(itemEl.getAttribute('data-idx'), 10);
      itemEl.addEventListener('mouseenter', () => {
        selectedResultIdx = idx;
        updateHighlight();
      });
      itemEl.addEventListener('click', () => {
        const item = currentFilteredList[idx];
        if (item) {
          closePalette();
          soundEngine.playClick();
          if (typeof onNavigate === 'function') {
            onNavigate(item.view, item.lessonId);
          }
        }
      });
    });

    // Stagger search results entrance via Motion.dev
    animatePaletteResults(paletteResults);
  };

  // Search Triggers (Search bar & profile menu trigger)
  container.querySelectorAll('.search-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => openPalette());
  });

  if (paletteCloseBtn) paletteCloseBtn.addEventListener('click', closePalette);
  if (paletteBackdrop) paletteBackdrop.addEventListener('click', closePalette);

  // Close modal when clicking modal backdrop overlay area
  if (paletteModal) {
    paletteModal.addEventListener('click', (e) => {
      if (e.target === paletteModal || e.target === paletteBackdrop) {
        closePalette();
      }
    });
  }

  if (paletteInput) {
    paletteInput.addEventListener('input', (e) => {
      renderPaletteResults(e.target.value);
    });

    paletteInput.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentFilteredList.length > 0) {
          selectedResultIdx = (selectedResultIdx + 1) % currentFilteredList.length;
          updateHighlight();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentFilteredList.length > 0) {
          selectedResultIdx = (selectedResultIdx - 1 + currentFilteredList.length) % currentFilteredList.length;
          updateHighlight();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = currentFilteredList[selectedResultIdx];
        if (item) {
          closePalette();
          soundEngine.playClick();
          if (typeof onNavigate === 'function') {
            onNavigate(item.view, item.lessonId);
          }
        }
      } else if (e.key === 'Escape') {
        closePalette();
      }
    });
  }

  function updateHighlight() {
    if (!paletteResults) return;
    paletteResults.querySelectorAll('.palette-item').forEach((el, idx) => {
      if (idx === selectedResultIdx) {
        el.classList.add('bg-slate-800/90', 'text-white');
        el.classList.remove('hover:bg-slate-800/50', 'text-slate-300');
        if (typeof el.scrollIntoView === 'function') {
          try {
            el.scrollIntoView({ block: 'nearest' });
          } catch (err) {}
        }
      } else {
        el.classList.remove('bg-slate-800/90', 'text-white');
        el.classList.add('text-slate-300');
      }
    });
  }

  // Memory cleanup: remove previous keydown listener before adding new one
  if (typeof window !== 'undefined') {
    if (window._finNavbarKeyHandler) {
      window.removeEventListener('keydown', window._finNavbarKeyHandler);
    }
    const handleGlobalKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (paletteModal && paletteModal.classList.contains('hidden')) {
          openPalette();
        } else {
          closePalette();
        }
      } else if (e.key === 'Escape') {
        closePalette();
        if (profileDropdown) profileDropdown.classList.add('hidden');
        if (notifPopover) notifPopover.classList.add('hidden');
      }
    };
    window._finNavbarKeyHandler = handleGlobalKey;
    window.addEventListener('keydown', handleGlobalKey);
  }

  // Return cleanup function for caller lifecycle management
  return () => {
    if (typeof window !== 'undefined') {
      if (window._finNavbarKeyHandler) {
        window.removeEventListener('keydown', window._finNavbarKeyHandler);
        window._finNavbarKeyHandler = null;
      }
      if (window._finNavbarScrollHandler) {
        window.removeEventListener('scroll', window._finNavbarScrollHandler);
        window._finNavbarScrollHandler = null;
      }
      if (window._finNavbarMouseMoveHandler) {
        window.removeEventListener('mousemove', window._finNavbarMouseMoveHandler);
        window._finNavbarMouseMoveHandler = null;
      }
    }
    if (typeof document !== 'undefined' && document._finNavbarClickHandler) {
      document.removeEventListener('click', document._finNavbarClickHandler);
      document._finNavbarClickHandler = null;
    }
  };
}
