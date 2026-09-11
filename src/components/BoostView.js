/**
 * Daily Boost View Component (/boost)
 * High-end Quantitative Daily Challenge Arena.
 * Features rotating market micro-puzzles with 2X XP multipliers,
 * bespoke SVG financial diagrams for each challenge, live reset countdown,
 * terminal-grade market scenario cards, tactile keyboard navigation,
 * and flawless Light & Dark theme accessibility.
 */

import { DAILY_BOOSTS } from '../data/dailyBoosts.js';
import { soundEngine } from '../audio.js';
import { animateOptionSelect } from '../utils/motion.js';
import { getBoostViewMarkup } from './boost/boostMarkup.js';

export function renderBoostView(container, state, onClaimBoost = () => {}, onNavigate = () => {}) {
  const profile = state.profile || {};
  let activeBoostIndex = 0;
  let selectedOptId = null;
  let hasChecked = false;
  let wasCorrect = false;

  // Cleanup reference for keyboard events
  let handleKeyDown = null;

  function cleanup() {
    if (typeof window !== 'undefined' && handleKeyDown) {
      window.removeEventListener('keydown', handleKeyDown);
      handleKeyDown = null;
    }
  }

  function triggerConfetti() {
    if (typeof document === 'undefined') return;
    const colors = ['#10b981', '#34d399', '#06b6d4', '#f59e0b', '#8b5cf6'];
    for (let i = 0; i < 48; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = `${Math.random() * 100}vw`;
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.animationDuration = `${1.4 + Math.random() * 2}s`;
      el.style.opacity = `${0.8 + Math.random() * 0.2}`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3500);
    }
  }

  // Determine current day of week (0 = Mon, 6 = Sun) for calendar alignment
  const todayDayIndex = (new Date().getDay() + 6) % 7;

  function render() {
    cleanup();
    const currentBoost = DAILY_BOOSTS[activeBoostIndex] || DAILY_BOOSTS[0];
    const isAlreadyCompleted = Boolean(profile.boostsCompleted && profile.boostsCompleted.includes(currentBoost.id));

    container.innerHTML = getBoostViewMarkup({
      profile,
      activeBoostIndex,
      currentBoost,
      selectedOptId,
      hasChecked,
      wasCorrect,
      isAlreadyCompleted,
      todayDayIndex
    });

    // Bind Tab Click Handlers
    container.querySelectorAll('.boost-tab-btn').forEach(btn => {
      btn.onclick = () => {
        soundEngine.playClick();
        activeBoostIndex = parseInt(btn.getAttribute('data-boost-idx'), 10);
        selectedOptId = null;
        hasChecked = false;
        wasCorrect = false;
        render();
      };
    });

    // Bind Option Click Handlers
    container.querySelectorAll('.boost-opt-btn').forEach(btn => {
      btn.onclick = () => {
        if (isAlreadyCompleted) return;
        soundEngine.playClick();
        animateOptionSelect(btn);
        selectedOptId = btn.getAttribute('data-opt-id');
        if (hasChecked) {
          hasChecked = false;
          wasCorrect = false;
        }
        render();
      };
    });

    // Submit Answer Check
    const checkBtn = container.querySelector('.check-boost-btn');
    if (checkBtn) {
      checkBtn.onclick = () => {
        if (!selectedOptId) return;
        hasChecked = true;
        const opt = currentBoost.options.find(o => o.id === selectedOptId);
        if (opt && opt.isCorrect) {
          wasCorrect = true;
          soundEngine.playSuccess();
        } else {
          wasCorrect = false;
          soundEngine.playError();
        }
        render();
      };
    }

    // Try Again
    const retryBtn = container.querySelector('.retry-boost-btn');
    if (retryBtn) {
      retryBtn.onclick = () => {
        soundEngine.playClick();
        selectedOptId = null;
        hasChecked = false;
        wasCorrect = false;
        render();
      };
    }

    // Claim XP & Finish
    const doneBtn = container.querySelector('.done-boost-btn');
    if (doneBtn) {
      doneBtn.onclick = () => {
        soundEngine.playLevelUp();
        triggerConfetti();
        onClaimBoost(currentBoost.id, currentBoost.xpReward);
      };
    }

    // Next Boost shortcut (cycles through 7 days)
    const nextBoostBtn = container.querySelector('.next-boost-btn');
    if (nextBoostBtn) {
      nextBoostBtn.onclick = () => {
        soundEngine.playClick();
        activeBoostIndex = (activeBoostIndex + 1) % DAILY_BOOSTS.length;
        selectedOptId = null;
        hasChecked = false;
        wasCorrect = false;
        render();
      };
    }

    // Direct navigation helpers from completed card
    const goalNavBtn = container.querySelector('.goal-boost-nav-btn');
    if (goalNavBtn && onNavigate) {
      goalNavBtn.onclick = () => {
        soundEngine.playClick();
        onNavigate('goal');
      };
    }
    const coursesNavBtn = container.querySelector('.courses-boost-nav-btn');
    if (coursesNavBtn && onNavigate) {
      coursesNavBtn.onclick = () => {
        soundEngine.playClick();
        onNavigate('courses');
      };
    }

    // Keyboard Shortcuts (1-4 / A-D to select, Enter to submit/claim/retry, R to retry)
    handleKeyDown = (e) => {
      // Ignore if modifier keys are pressed (Ctrl, Cmd/Meta, Alt) to avoid hijacking browser shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Ignore if user is in an input or textarea
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;

      const key = e.key.toUpperCase();
      // Keys 1, 2, 3, 4
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentBoost.options[idx] && !isAlreadyCompleted) {
          soundEngine.playClick();
          selectedOptId = currentBoost.options[idx].id;
          if (hasChecked) {
            hasChecked = false;
            wasCorrect = false;
          }
          render();
        }
      }
      // Keys A, B, C, D
      else if (['A', 'B', 'C', 'D'].includes(key)) {
        const idx = key.charCodeAt(0) - 65;
        if (currentBoost.options[idx] && !isAlreadyCompleted) {
          soundEngine.playClick();
          selectedOptId = currentBoost.options[idx].id;
          if (hasChecked) {
            hasChecked = false;
            wasCorrect = false;
          }
          render();
        }
      }
      // Key Enter
      else if (e.key === 'Enter') {
        if (typeof document !== 'undefined' && document.activeElement && document.activeElement.classList && document.activeElement.classList.contains('boost-opt-btn')) {
          return;
        }

        if (!hasChecked && !isAlreadyCompleted && selectedOptId) {
          const btn = container.querySelector('.check-boost-btn');
          if (btn) btn.click();
        } else if (hasChecked && wasCorrect) {
          const btn = container.querySelector('.done-boost-btn');
          if (btn) btn.click();
        } else if (hasChecked && !wasCorrect) {
          const btn = container.querySelector('.retry-boost-btn');
          if (btn) btn.click();
        }
      }
      // Key R to retry
      else if (key === 'R' && hasChecked && !wasCorrect) {
        const btn = container.querySelector('.retry-boost-btn');
        if (btn) btn.click();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
    }
  }

  render();

  // Return view unmount cleanup
  return () => {
    cleanup();
  };
}
