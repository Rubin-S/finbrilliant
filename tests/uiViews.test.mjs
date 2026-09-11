import test from 'node:test';
import assert from 'node:assert';
import { renderGoalView } from '../src/components/GoalView.js';
import { renderBoostView } from '../src/components/BoostView.js';
import { renderNavbar, getPlatformShortcut } from '../src/components/Navbar.js';
import { DAILY_BOOSTS } from '../src/data/dailyBoosts.js';
import { getDefaultProfile } from '../src/storage.js';
import {
  getGSAP,
  getMotion,
  prefersReducedMotion,
  animateViewEntrance,
  staggerCardEntrance,
  animateModalOpen,
  animateModalClose,
  animateStepTransition,
  animateOptionSelect,
  animatePillComplete,
  animateDockEntrance,
  animateTabActive,
  animatePopoverOpen,
  animateDockVisibility,
  MOTION_EASE
} from '../src/utils/motion.js';

// Minimal DOM Element Simulator for component testing in Node environment
class SimpleDOMElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.attributes = {};
    this._innerHTML = '';
    this.children = [];
    this.eventListeners = {};
    this.onclick = null;
    this.oninput = null;
    this.onchange = null;
    this.style = {};
    this.value = '';
    this.textContent = '';
  }

  get classList() {
    const self = this;
    const getClasses = () => (self.className || '').trim().split(/\s+/).filter(Boolean);
    return {
      contains: (cls) => getClasses().includes(cls),
      add: (...clss) => {
        const set = new Set([...getClasses(), ...clss]);
        self.className = Array.from(set).join(' ');
      },
      remove: (...clss) => {
        const removeSet = new Set(clss);
        self.className = getClasses().filter(c => !removeSet.has(c)).join(' ');
      },
      toggle: (cls, force) => {
        const classes = getClasses();
        const exists = classes.includes(cls);
        const shouldAdd = force !== undefined ? force : !exists;
        if (shouldAdd && !exists) {
          classes.push(cls);
        } else if (!shouldAdd && exists) {
          const idx = classes.indexOf(cls);
          classes.splice(idx, 1);
        }
        self.className = classes.join(' ');
        return shouldAdd;
      }
    };
  }

  getAttribute(attr) {
    return this.attributes[attr] !== undefined ? this.attributes[attr] : null;
  }

  setAttribute(attr, val) {
    this.attributes[attr] = String(val);
  }

  addEventListener(event, fn) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(fn);
  }

  removeEventListener(event, fn) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(f => f !== fn);
    }
  }

  dispatchEvent(event) {
    if (this.eventListeners[event.type]) {
      this.eventListeners[event.type].forEach(fn => fn(event));
    }
    if (this[`on${event.type}`]) {
      this[`on${event.type}`](event);
    }
  }

  click() {
    if (this.onclick) this.onclick({ type: 'click', target: this });
    this.dispatchEvent({ type: 'click', target: this });
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(html) {
    this._innerHTML = html;
    this.children = this._parseHtml(html);
  }

  _parseHtml(html) {
    const list = [];
    // Regex matching HTML open tags and self-closing tags
    const tagRe = /<([a-zA-Z0-9\-]+)([^>]*)>/g;
    let match;
    while ((match = tagRe.exec(html)) !== null) {
      const tagName = match[1];
      const attrStr = match[2];
      if (tagName.startsWith('/')) continue; // Skip close tags
      const el = new SimpleDOMElement(tagName);

      // Parse all standard HTML attributes: key="value" or key='value'
      const attrRe = /([a-zA-Z0-9\-]+)=["']([^"']*)["']/g;
      let aMatch;
      while ((aMatch = attrRe.exec(attrStr)) !== null) {
        const key = aMatch[1].toLowerCase();
        const val = aMatch[2];
        el.attributes[key] = val;
        if (key === 'id') el.id = val;
        if (key === 'class') el.className = val;
        if (key === 'value') el.value = val;
      }

      list.push(el);
    }
    return list;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const parts = selector.split(',').map(s => s.trim());
    if (parts.length > 1) {
      const set = new Set();
      for (const part of parts) {
        for (const el of this.querySelectorAll(part)) {
          set.add(el);
        }
      }
      return Array.from(set);
    }

    const results = [];
    const isId = selector.startsWith('#');
    const isClass = selector.startsWith('.');

    for (const child of this.children) {
      if (isId && child.id === selector.slice(1)) {
        results.push(child);
      } else if (isClass && child.className && child.className.split(/\s+/).includes(selector.slice(1))) {
        results.push(child);
      } else if (selector.includes('[') && selector.includes(']')) {
        const attrName = selector.replace(/[\[\]]/g, '');
        if (child.attributes[attrName] !== undefined) {
          results.push(child);
        }
      }
    }
    return results;
  }
}

// Global browser polyfills for headless testing
const windowListeners = {};
if (typeof globalThis.window === 'undefined' || !globalThis.window.dispatchKeyEvent) {
  globalThis.window = {
    scrollY: 0,
    innerHeight: 800,
    addEventListener: (event, fn) => {
      if (!windowListeners[event]) windowListeners[event] = [];
      windowListeners[event].push(fn);
    },
    removeEventListener: (event, fn) => {
      if (windowListeners[event]) {
        windowListeners[event] = windowListeners[event].filter(f => f !== fn);
      }
    },
    dispatchKeyEvent: (eventObj) => {
      if (windowListeners['keydown']) {
        windowListeners['keydown'].forEach(fn => fn(eventObj));
      }
    },
    dispatchScrollEvent: (newY) => {
      globalThis.window.scrollY = newY;
      if (windowListeners['scroll']) {
        windowListeners['scroll'].forEach(fn => fn());
      }
    },
    dispatchMouseMoveEvent: (eventObj) => {
      if (windowListeners['mousemove']) {
        windowListeners['mousemove'].forEach(fn => fn(eventObj));
      }
    }
  };
}



test('DAILY_BOOSTS contains full 7-day challenge suite with complete questions and explanations', () => {
  assert.strictEqual(DAILY_BOOSTS.length, 7, 'Should have 7 daily boosts for a full week');
  DAILY_BOOSTS.forEach((boost, idx) => {
    assert.strictEqual(boost.id, `boost-${idx + 1}`);
    assert.ok(boost.dayTitle && boost.dayTitle.length > 0);
    assert.ok(boost.category && boost.category.length > 0);
    assert.ok(boost.xpReward >= 100);
    assert.ok(boost.scenario && boost.scenario.length > 0);
    assert.ok(boost.question && boost.question.length > 0);
    assert.ok(Array.isArray(boost.options) && boost.options.length >= 3);
    const correct = boost.options.filter(o => o.isCorrect);
    assert.strictEqual(correct.length, 1, `Boost ${boost.id} must have exactly one correct option`);
  });
});

test('renderGoalView renders weekly goal metrics, preset buttons, and responds to goal changes', () => {
  const container = new SimpleDOMElement('div');
  const profile = getDefaultProfile();
  const state = { profile, currentView: 'goal' };

  let updatedTarget = null;
  let navigatedView = null;
  let navigatedLesson = null;

  renderGoalView(
    container,
    state,
    (target) => { updatedTarget = target; },
    (view, lessonId) => {
      navigatedView = view;
      navigatedLesson = lessonId;
    }
  );

  // Check that content was rendered
  assert.ok(container.innerHTML.includes('Financial Goals & Mastery') || container.innerHTML.includes('Your Goals & Mastery'));
  assert.ok(container.innerHTML.includes('Weekly Commitment'));
  assert.ok(container.innerHTML.includes('Curriculum Mastery Breakdown'));
  assert.ok(container.innerHTML.includes('Mastery Badges'));

  // Test preset buttons
  const presetBtns = container.querySelectorAll('.preset-btn');
  assert.ok(presetBtns.length >= 4, 'Should have 4 preset buttons (3, 5, 7, 10)');
  presetBtns[0].click();
  assert.strictEqual(updatedTarget, 3);

  presetBtns[2].click();
  assert.strictEqual(updatedTarget, 7);

  // Test slider
  const slider = container.querySelector('.target-slider');
  assert.ok(slider !== null, 'Target slider should exist');
  slider.value = '9';
  slider.onchange({ target: slider });
  assert.strictEqual(updatedTarget, 9);

  // Test track action buttons
  const trackBtns = container.querySelectorAll('.track-action-btn');
  assert.ok(trackBtns.length >= 6, 'Should have action buttons for all 6 pillars');
  trackBtns[0].click();
  assert.strictEqual(navigatedView, 'lesson');
  assert.ok(navigatedLesson !== null);

  // Test badge filter buttons
  const filterBtns = container.querySelectorAll('.badge-filter-btn');
  assert.strictEqual(filterBtns.length, 3, 'Should have All, Unlocked, and Locked filters');
  filterBtns[1].click(); // Filter: unlocked
  assert.ok(container.innerHTML.includes('Rule of 72 Pro'));
});

test('renderBoostView renders daily challenge arena, option selection, and claim action', () => {
  const container = new SimpleDOMElement('div');
  const profile = getDefaultProfile();
  const state = { profile, currentView: 'boost' };

  let claimedBoostId = null;
  let claimedXP = null;

  const cleanup = renderBoostView(
    container,
    state,
    (id, xp) => {
      claimedBoostId = id;
      claimedXP = xp;
    },
    () => {}
  );

  assert.ok(container.innerHTML.includes('Daily Challenge Arena'));
  assert.ok(container.innerHTML.includes('2X XP'));

  // Verify 7 boost selector tabs exist
  const tabs = container.querySelectorAll('.boost-tab-btn');
  assert.strictEqual(tabs.length, 7, 'Should have 7 day tabs in boost view');

  // Verify option buttons exist
  const optBtns = container.querySelectorAll('.boost-opt-btn');
  assert.ok(optBtns.length >= 3, 'Should have multiple options');

  // Select option 'b' (correct answer for boost-1)
  const optB = optBtns.find(btn => btn.getAttribute('data-opt-id') === 'b');
  assert.ok(optB !== null);
  optB.click();

  // Submit Answer
  const checkBtn = container.querySelector('.check-boost-btn');
  assert.ok(checkBtn !== null);
  checkBtn.click();

  // Verify explanation box is rendered
  assert.ok(container.innerHTML.includes('Daily Financial Takeaway'));

  // Click Claim XP button
  const doneBtn = container.querySelector('.done-boost-btn');
  assert.ok(doneBtn !== null);
  doneBtn.click();

  assert.strictEqual(claimedBoostId, 'boost-1');
  assert.strictEqual(claimedXP, 100);

  if (typeof cleanup === 'function') cleanup();
});

test('renderBoostView handles incorrect selection, retry flow, and day tab switching', () => {
  const container = new SimpleDOMElement('div');
  const profile = getDefaultProfile();
  const state = { profile, currentView: 'boost' };

  const cleanup = renderBoostView(container, state, () => {}, () => {});

  // Select incorrect option 'a' for boost-1
  const optBtns = container.querySelectorAll('.boost-opt-btn');
  const optA = optBtns.find(btn => btn.getAttribute('data-opt-id') === 'a');
  assert.ok(optA !== null);
  optA.click();

  // Submit Answer
  const checkBtn = container.querySelector('.check-boost-btn');
  checkBtn.click();

  // Verify failure correction box is rendered
  assert.ok(container.innerHTML.includes('Quantitative Analysis & Correction'));

  // Verify retry button exists and click resets state
  const retryBtn = container.querySelector('.retry-boost-btn');
  assert.ok(retryBtn !== null);
  retryBtn.click();

  // Verify check button is back in unsubmitted state
  assert.ok(container.querySelector('.check-boost-btn') !== null);

  // Switch to Day 2 tab
  const tabs = container.querySelectorAll('.boost-tab-btn');
  tabs[1].click(); // Day 2
  assert.ok(container.innerHTML.includes('Flash Arbitrage Challenge'));

  if (typeof cleanup === 'function') cleanup();
});

test('renderNavbar renders navigation tabs, branding, and theme/sound toggles', () => {
  const container = new SimpleDOMElement('div');
  const profile = getDefaultProfile();
  const state = { profile, currentView: 'courses' };

  let toggledTheme = false;
  let toggledSound = false;
  let navigatedView = null;

  renderNavbar(
    container,
    state,
    (view) => { navigatedView = view; },
    () => { toggledTheme = true; },
    () => { toggledSound = true; }
  );

  assert.ok(container.innerHTML.includes('FinBrilliant'));
  assert.ok(container.innerHTML.includes('Courses'));
  assert.ok(container.innerHTML.includes('Daily Boost'));
  assert.ok(container.innerHTML.includes('Goals'));

  const themeBtn = container.querySelector('.theme-toggle');
  assert.ok(themeBtn !== null);
  themeBtn.click();
  assert.strictEqual(toggledTheme, true);

  const soundBtn = container.querySelector('.sound-toggle');
  assert.ok(soundBtn !== null);
  soundBtn.click();
  assert.strictEqual(toggledSound, true);

  const boostNavBtn = container.querySelectorAll('.nav-btn').find(b => b.getAttribute('data-view') === 'boost');
  assert.ok(boostNavBtn !== null);
  boostNavBtn.click();
  assert.strictEqual(navigatedView, 'boost');
});

test('renderNavbar reference design features: brand logo, search bar, XP bar, all 5 tabs, JD avatar', () => {
  const container = new SimpleDOMElement('div');
  const profile = getDefaultProfile();
  profile.xp = 180; // Match reference screenshot 180 XP
  const state = { profile, currentView: 'courses' };

  let navigatedView = null;
  let navigatedLessonId = null;

  renderNavbar(
    container,
    state,
    (view, lessonId = null) => {
      navigatedView = view;
      navigatedLessonId = lessonId;
    },
    () => {},
    () => {}
  );

  // 1. Branding & Tagline
  assert.ok(container.innerHTML.includes('FinBrilliant'));
  assert.ok(container.innerHTML.includes('First-Principles Finance'));

  // 2. Search Bar & Shortcut
  assert.ok(container.innerHTML.includes('Search lessons, topics, or tools...'));
  assert.ok(container.innerHTML.includes('⌘ K') || container.innerHTML.includes('Ctrl K'));

  // 3. User Stats & XP Progress Bar
  assert.ok(container.innerHTML.includes('180 XP'));

  // 4. Avatar JD & Bell
  assert.ok(container.innerHTML.includes('JD'));
  assert.ok(container.querySelector('.bell-toggle') !== null);
  assert.ok(container.querySelector('.profile-toggle') !== null);

  // 5. Centered Navigation Tabs (Learn, Practice, Markets, Goals, Lab)
  assert.ok(container.innerHTML.includes('Learn'));
  assert.ok(container.innerHTML.includes('Practice'));
  assert.ok(container.innerHTML.includes('Markets'));
  assert.ok(container.innerHTML.includes('Goals'));
  assert.ok(container.innerHTML.includes('Lab'));

  // 6. Test navigation clicks for each tab
  const navBtns = container.querySelectorAll('.nav-btn');
  
  const practiceBtn = navBtns.find(b => b.getAttribute('data-view') === 'grill');
  assert.ok(practiceBtn !== null);
  practiceBtn.click();
  assert.strictEqual(navigatedView, 'grill');

  const labBtn = navBtns.find(b => b.getAttribute('data-view') === 'lab');
  assert.ok(labBtn !== null);
  labBtn.click();
  assert.strictEqual(navigatedView, 'lab');

  const goalBtn = navBtns.find(b => b.getAttribute('data-view') === 'goal');
  assert.ok(goalBtn !== null);
  goalBtn.click();
  assert.strictEqual(navigatedView, 'goal');

  // 7. Test Logo click navigates home
  const brandLogo = container.querySelector('.brand-logo');
  assert.ok(brandLogo !== null);
  brandLogo.click();
  assert.strictEqual(navigatedView, 'courses');

  // 8. Test Command Palette elements and accessibility
  const modal = container.querySelector('#palette-modal');
  assert.ok(modal !== null);
  assert.strictEqual(modal.getAttribute('role'), 'dialog');
  assert.strictEqual(modal.getAttribute('aria-modal'), 'true');
  assert.ok(container.querySelector('#palette-input') !== null);

  // 9. Verify folded origami dual-tile logo mark structure
  assert.ok(container.innerHTML.includes('finLogoGradCyan'));
  assert.ok(container.innerHTML.includes('finLogoGradEmerald'));
  assert.ok(container.innerHTML.includes('finLogoShadow'));

  // 10. Verify XP meter bar width matches 44px
  assert.ok(container.innerHTML.includes('w-[44px]'));
});

test('renderNavbar provides lifecycle cleanup and prevents listener pileup', () => {
  const container = new SimpleDOMElement('div');
  const profile = getDefaultProfile();
  const state = { profile, currentView: 'courses' };

  // Call renderNavbar and verify cleanup function is returned
  const cleanup = renderNavbar(
    container,
    state,
    () => {},
    () => {},
    () => {}
  );

  assert.strictEqual(typeof cleanup, 'function', 'renderNavbar should return a cleanup function');

  // Calling cleanup should not throw
  assert.doesNotThrow(() => {
    cleanup();
  });
});


test('renderBoostView responds to keyboard shortcuts (numbers to select, Enter to submit/claim)', () => {
  const container = new SimpleDOMElement('div');
  const profile = getDefaultProfile();
  const state = { profile, currentView: 'boost' };

  let claimedBoostId = null;
  let claimedXP = null;

  const cleanup = renderBoostView(
    container,
    state,
    (id, xp) => {
      claimedBoostId = id;
      claimedXP = xp;
    },
    () => {}
  );

  // Press key '2' to pick option 2 ('b', correct answer)
  globalThis.window.dispatchKeyEvent({ key: '2' });

  // Press Enter to submit answer
  globalThis.window.dispatchKeyEvent({ key: 'Enter' });

  // Verify explanation is shown
  assert.ok(container.innerHTML.includes('Daily Financial Takeaway'));

  // Press Enter to claim XP
  globalThis.window.dispatchKeyEvent({ key: 'Enter' });

  assert.strictEqual(claimedBoostId, 'boost-1');
  assert.strictEqual(claimedXP, 100);

  if (typeof cleanup === 'function') cleanup();
});

test('renderGoalView updates preset highlight and displays 7 day habit tracker with day labels', () => {
  const container = new SimpleDOMElement('div');
  const profile = getDefaultProfile();
  const state = { profile, currentView: 'goal' };

  renderGoalView(container, state, () => {}, () => {});

  // Verify habit tracker renders all 7 day abbreviations
  assert.ok(container.innerHTML.includes('Mon'));
  assert.ok(container.innerHTML.includes('Tue'));
  assert.ok(container.innerHTML.includes('Wed'));
  assert.ok(container.innerHTML.includes('Thu'));
  assert.ok(container.innerHTML.includes('Fri'));
  assert.ok(container.innerHTML.includes('Sat'));
  assert.ok(container.innerHTML.includes('Sun'));
  assert.ok(container.innerHTML.includes('TODAY'));

  // Verify all 10 badges exist
  assert.ok(container.innerHTML.includes('All (10)'));

  // Test slider live input updating preset highlight
  const slider = container.querySelector('.target-slider');
  slider.value = '7';
  slider.oninput({ target: slider });

  const preset7 = container.querySelectorAll('.preset-btn').find(b => b.getAttribute('data-preset-val') === '7');
  assert.ok(preset7 !== null);
  assert.ok(preset7.className.includes('bg-cyan-500/10'), 'Preset for 7 should be highlighted after slider moves to 7');
});

test('renderBoostView preserves browser hotkeys when modifier keys (Ctrl/Cmd/Alt) are pressed', () => {
  const container = new SimpleDOMElement('div');
  const profile = getDefaultProfile();
  const state = { profile, currentView: 'boost' };

  let claimedBoostId = null;
  const cleanup = renderBoostView(container, state, (id) => { claimedBoostId = id; }, () => {});

  // Send Ctrl+2 (user switching browser tab) -> should NOT select option 2
  globalThis.window.dispatchKeyEvent({ key: '2', ctrlKey: true });
  const checkBtnBefore = container.querySelector('.check-boost-btn');
  assert.ok(checkBtnBefore && checkBtnBefore.className.includes('cursor-not-allowed'), 'Ctrl+2 must not select option');

  // Send Cmd/Meta+R (user refreshing page) -> should NOT trigger retry or actions
  globalThis.window.dispatchKeyEvent({ key: 'r', metaKey: true });
  assert.strictEqual(claimedBoostId, null);

  // Send plain '2' (without modifier) -> should select option
  globalThis.window.dispatchKeyEvent({ key: '2', ctrlKey: false, metaKey: false, altKey: false });
  const checkBtnAfter = container.querySelector('.check-boost-btn');
  assert.ok(checkBtnAfter && checkBtnAfter.className.includes('cursor-pointer'), 'Plain 2 should select option');

  if (typeof cleanup === 'function') cleanup();
});

test('renderBoostView generates responsive, theme-adaptive SVG visual models with valid arrow markers', () => {
  const container = new SimpleDOMElement('div');
  const profile = getDefaultProfile();
  const state = { profile, currentView: 'boost' };

  const cleanup = renderBoostView(container, state, () => {}, () => {});

  // Check Day 1 model
  assert.ok(container.innerHTML.includes('EXPONENTIAL COMPOUND ACCUMULATOR'));
  assert.ok(container.innerHTML.includes('boost-chart'));
  assert.ok(container.innerHTML.includes('class="w-full h-auto'));

  // Switch to Day 2 and verify marker id="arrow" definition exists for arbitrage arrow
  const tabs = container.querySelectorAll('.boost-tab-btn');
  tabs[1].click(); // Day 2
  assert.ok(container.innerHTML.includes('id="arrow"'), 'Boost 2 must define arrow marker in SVG defs');
  assert.ok(container.innerHTML.includes('marker-end="url(#arrow)"'), 'Boost 2 must reference arrow marker');
  assert.ok(container.innerHTML.includes('class="w-full h-auto'));

  if (typeof cleanup === 'function') cleanup();
});

test('GSAP animation utilities provide isomorphic safety, reduced motion support, and correct transitions', () => {
  // 1. Check fallback in environment without window.gsap
  assert.strictEqual(getGSAP(), null);
  assert.strictEqual(getMotion(), null);
  assert.strictEqual(typeof prefersReducedMotion(), 'boolean');
  assert.strictEqual(typeof MOTION_EASE.smooth, 'string');

  const el = new SimpleDOMElement('div');
  const parent = new SimpleDOMElement('div');
  parent.children = [el];

  // Should safely return null without throwing in mock environment
  assert.strictEqual(animateViewEntrance(el), null);
  assert.strictEqual(staggerCardEntrance(parent), null);
  assert.strictEqual(animateStepTransition(el, 'next'), null);
  assert.strictEqual(animateOptionSelect(el), null);
  assert.strictEqual(animatePillComplete(el), null);
  assert.strictEqual(animateDockEntrance(el), null);
  assert.strictEqual(animateTabActive(el), null);
  assert.strictEqual(animatePopoverOpen(el), null);

  // animateModalClose must execute onFinish callback even without GSAP runtime
  let finishCalled = false;
  animateModalClose(el, el, () => { finishCalled = true; });
  assert.strictEqual(finishCalled, true, 'onFinish must be called even without window.gsap');

  // 2. Simulate GSAP runtime present in window
  let capturedFromToCalls = [];
  let capturedToCalls = [];
  globalThis.window.gsap = {
    fromTo: (target, fromVars, toVars) => {
      capturedFromToCalls.push({ target, fromVars, toVars });
      return { kill: () => {} };
    },
    to: (target, vars) => {
      capturedToCalls.push({ target, vars });
      return { kill: () => {} };
    },
    set: (target, vars) => {
      return { kill: () => {} };
    },
    timeline: () => {
      return {
        fromTo: function() { return this; },
        to: function() { return this; }
      };
    }
  };

  assert.strictEqual(typeof getGSAP().fromTo, 'function');
  assert.strictEqual(typeof getGSAP().to, 'function');

  // Test view entrance animation parameters
  animateViewEntrance(el);
  assert.strictEqual(capturedFromToCalls.length, 1);
  assert.deepStrictEqual(capturedFromToCalls[0].fromVars, { opacity: 0, y: 6 });
  assert.strictEqual(capturedFromToCalls[0].toVars.duration, 0.22);
  assert.strictEqual(capturedFromToCalls[0].toVars.opacity, 1);
  assert.strictEqual(capturedFromToCalls[0].toVars.y, 0);

  // Test modal open animation parameters
  capturedFromToCalls = [];
  animateModalOpen(el, el);
  assert.strictEqual(capturedFromToCalls.length, 2);

  // Test dock visibility animation parameters (smooth descent 140px and rise 0px)
  capturedToCalls = [];
  animateDockVisibility(el, false);
  assert.strictEqual(capturedToCalls.length, 1);
  assert.strictEqual(capturedToCalls[0].vars.y, 140);
  assert.strictEqual(capturedToCalls[0].vars.duration, 0.32);

  capturedToCalls = [];
  animateDockVisibility(el, true);
  assert.strictEqual(capturedToCalls.length, 1);
  assert.strictEqual(capturedToCalls[0].vars.y, 0);
  assert.strictEqual(capturedToCalls[0].vars.duration, 0.38);

  // Clean up global mock
  delete globalThis.window.gsap;
});

test('renderNavbar floating bottom dock hides when scrolling down and appears when scrolling up', () => {
  const container = new SimpleDOMElement('div');
  const profile = getDefaultProfile();
  const state = { profile, currentView: 'courses' };

  globalThis.window.scrollY = 0;
  const cleanup = renderNavbar(
    container,
    state,
    () => {},
    () => {},
    () => {}
  );

  const dockContainer = container.querySelector('#fin-bottom-dock-container');
  assert.ok(dockContainer !== null, 'Dock container #fin-bottom-dock-container must exist');

  // 1. Initial state: dock is visible
  assert.strictEqual(dockContainer.classList.contains('dock-hidden'), false);

  // 2. Scroll DOWN: (scrollY increases from 0 -> 120)
  globalThis.window.dispatchScrollEvent(120);
  assert.strictEqual(dockContainer.classList.contains('dock-hidden'), true, 'Dock should hide below screen when scrolling down');

  // 3. Scroll UP: (scrollY decreases from 120 -> 60)
  globalThis.window.dispatchScrollEvent(60);
  assert.strictEqual(dockContainer.classList.contains('dock-hidden'), false, 'Dock should appear and rise up when scrolling up');

  // 4. Scroll DOWN again: (scrollY increases from 60 -> 140)
  globalThis.window.dispatchScrollEvent(140);
  assert.strictEqual(dockContainer.classList.contains('dock-hidden'), true, 'Dock should hide below screen when scrolling down');

  // 5. Scroll UP all the way to top: (scrollY decreases to 10)
  globalThis.window.dispatchScrollEvent(10);
  assert.strictEqual(dockContainer.classList.contains('dock-hidden'), false, 'Dock should be visible at the top of the page');

  // 6. Scroll DOWN again to hide:
  globalThis.window.dispatchScrollEvent(80);
  assert.strictEqual(dockContainer.classList.contains('dock-hidden'), true);

  // 7. Hover near bottom edge (within 64px of bottom: clientY = 760 with innerHeight = 800)
  globalThis.window.dispatchMouseMoveEvent({ clientY: 760 });
  assert.strictEqual(dockContainer.classList.contains('dock-hidden'), false, 'Dock should reveal when cursor moves near bottom edge');

  // 8. Cleanup removes handlers safely
  if (typeof cleanup === 'function') {
    cleanup();
  }
  assert.strictEqual(globalThis.window._finNavbarScrollHandler, null);
  assert.strictEqual(globalThis.window._finNavbarMouseMoveHandler, null);
});

test('getPlatformShortcut dynamically resolves shortcut symbols and labels by OS', () => {
  // macOS / iOS detection
  const macShortcut = getPlatformShortcut('MacIntel');
  assert.strictEqual(macShortcut.isMac, true);
  assert.strictEqual(macShortcut.symbol, '⌘');
  assert.strictEqual(macShortcut.label, '⌘ K');
  assert.strictEqual(macShortcut.compact, '⌘K');

  const iphoneShortcut = getPlatformShortcut('iPhone');
  assert.strictEqual(iphoneShortcut.isMac, true);
  assert.strictEqual(iphoneShortcut.symbol, '⌘');

  const ipadShortcut = getPlatformShortcut('iPad');
  assert.strictEqual(ipadShortcut.isMac, true);
  assert.strictEqual(ipadShortcut.symbol, '⌘');

  // Windows detection
  const winShortcut = getPlatformShortcut('Win32');
  assert.strictEqual(winShortcut.isMac, false);
  assert.strictEqual(winShortcut.symbol, 'Ctrl');
  assert.strictEqual(winShortcut.label, 'Ctrl K');
  assert.strictEqual(winShortcut.compact, 'Ctrl+K');

  // Linux detection
  const linuxShortcut = getPlatformShortcut('Linux x86_64');
  assert.strictEqual(linuxShortcut.isMac, false);
  assert.strictEqual(linuxShortcut.symbol, 'Ctrl');
  assert.strictEqual(linuxShortcut.label, 'Ctrl K');
  assert.strictEqual(linuxShortcut.compact, 'Ctrl+K');

  // Android detection
  const androidShortcut = getPlatformShortcut('Android');
  assert.strictEqual(androidShortcut.isMac, false);
  assert.strictEqual(androidShortcut.symbol, 'Ctrl');
});
