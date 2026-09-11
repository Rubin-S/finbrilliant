import { clamp } from '../../utils/cinematicScroller.js';

/**
 * Checks whether user or environment has requested reduced motion
 */
function isReducedMotionActive() {
  if (typeof window === 'undefined') return false;
  if (window.__FIN_REDUCE_MOTION === true) return true;
  if (window.__FIN_REDUCE_MOTION === false) return false;
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('finbrilliant_reduce_motion');
    if (stored === 'true') return true;
    if (stored === 'false') return false;
  }
  return false;
}

/**
 * Scrambles and decrypts characters from source text to target text based on progress t in [0, 1].
 * Strictly deterministic and contains ZERO em-dashes or en-dashes.
 */
export function scrambleText(fromText, toText, progress) {
  const p = Math.max(0, Math.min(1, progress));
  if (p <= 0) return fromText;
  if (p >= 1) return toText;

  const maxLen = Math.max(fromText.length, toText.length);
  const currentLen = Math.round(fromText.length + (toText.length - fromText.length) * p);
  const GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ+=/#:';
  
  let result = '';
  for (let i = 0; i < currentLen; i++) {
    const charThreshold = i / maxLen;
    const charProgress = (p - charThreshold * 0.7) / 0.3;

    if (charProgress >= 1) {
      result += (i < toText.length) ? toText[i] : '';
    } else if (charProgress <= 0) {
      result += (i < fromText.length) ? fromText[i] : ' ';
    } else {
      const targetChar = (i < toText.length) ? toText[i] : '';
      if (targetChar === ' ' || (i < fromText.length && fromText[i] === ' ')) {
        result += ' ';
      } else {
        const glyphIdx = (Math.floor(i * 7 + p * 43)) % GLYPHS.length;
        result += GLYPHS[glyphIdx];
      }
    }
  }
  return result;
}



/**
 * Updates scene opacities, continuous 3D camera transforms, and persistent morphing threads dynamically based on scroll progress
 */

/**
 * Zero-allocation DOM Cache using WeakMap
 * Eliminates thousands of querySelector DOM traversals per second during scrolling.
 */
const domCache = new WeakMap();

export function clearDOMCache(container) {
  if (container && domCache.has(container)) {
    domCache.delete(container);
  }
}

function q(container, selector) {
  if (!container) return null;
  let cache = domCache.get(container);
  if (!cache) {
    cache = { single: new Map(), multi: new Map() };
    domCache.set(container, cache);
  }
  let el = cache.single.get(selector);
  if (el === undefined) {
    el = typeof container.querySelector === 'function' ? container.querySelector(selector) : null;
    cache.single.set(selector, el);
  }
  return el;
}

function qAll(container, selector) {
  if (!container) return [];
  let cache = domCache.get(container);
  if (!cache) {
    cache = { single: new Map(), multi: new Map() };
    domCache.set(container, cache);
  }
  let els = cache.multi.get(selector);
  if (els === undefined) {
    els = typeof container.querySelectorAll === 'function' ? container.querySelectorAll(selector) : [];
    cache.multi.set(selector, els);
  }
  return els;
}

const STAGE_SCENE_TYPOGRAPHY = {
  2: {
    headline: { min: 1.5, vw: 3.5, max: 2.75, tracking: 0.22, minHeight: 3.5 },
    footerTitle: { min: 1.5, vw: 3.5, max: 2.75, tracking: 0.22, minHeight: 3.5 },
    footerSub: { min: 0.95, vw: 1.3, max: 1.125 }
  },
  3: {
    headline: { min: 1.25, vw: 2.6, max: 2.125, tracking: 0.18, minHeight: 3.25 },
    footerTitle: { min: 1.35, vw: 2.8, max: 2.25, tracking: 0.20, minHeight: 3.25 },
    footerSub: { min: 0.95, vw: 1.3, max: 1.125 }
  },
  4: {
    headline: { min: 1.4, vw: 3.2, max: 2.5, tracking: 0.22, minHeight: 3.25 },
    footerTitle: { min: 0.8125, vw: 1.3, max: 1.125, tracking: 0.15, minHeight: 2.25 },
    footerSub: { min: 0.8125, vw: 1.1, max: 0.9375 }
  },
  5: {
    headline: { min: 1.4, vw: 3.2, max: 2.5, tracking: 0.22, minHeight: 3.25 },
    footerTitle: { min: 1.4, vw: 3.2, max: 2.5, tracking: 0.22, minHeight: 3.25 },
    footerSub: { min: 0.8125, vw: 1.1, max: 0.9375 }
  },
  6: {
    headline: { min: 1.4, vw: 3.2, max: 2.5, tracking: 0.22, minHeight: 3.25 },
    footerTitle: { min: 1.0, vw: 2.0, max: 1.625, tracking: 0.18, minHeight: 2.75 },
    footerSub: { min: 0.8125, vw: 1.1, max: 0.9375 }
  },
  7: {
    headline: { min: 1.4, vw: 3.2, max: 2.5, tracking: 0.22, minHeight: 3.25 },
    footerTitle: { min: 1.0, vw: 2.0, max: 1.625, tracking: 0.18, minHeight: 2.75 },
    footerSub: { min: 0.8125, vw: 1.1, max: 0.9375 }
  },
  8: {
    headline: { min: 1.25, vw: 2.6, max: 2.0, tracking: 0.18, minHeight: 3.0 },
    footerTitle: { min: 1.0, vw: 2.0, max: 1.5, tracking: 0.18, minHeight: 2.5 },
    footerSub: { min: 0.8125, vw: 1.1, max: 0.9375 }
  }
};

function lerpVal(a, b, t) {
  return a + (b - a) * t;
}

function applyStageTypography(headlineEl, footerTitleEl, footerSubEl, fromScene, toScene, t) {
  const fromTypo = STAGE_SCENE_TYPOGRAPHY[fromScene] || STAGE_SCENE_TYPOGRAPHY[2];
  const toTypo = STAGE_SCENE_TYPOGRAPHY[toScene] || fromTypo;
  const p = Math.max(0, Math.min(1, t));

  if (headlineEl) {
    const minRem = lerpVal(fromTypo.headline.min, toTypo.headline.min, p);
    const vw = lerpVal(fromTypo.headline.vw, toTypo.headline.vw, p);
    const maxRem = lerpVal(fromTypo.headline.max, toTypo.headline.max, p);
    const tracking = lerpVal(fromTypo.headline.tracking, toTypo.headline.tracking, p);
    const minH = lerpVal(fromTypo.headline.minHeight, toTypo.headline.minHeight, p);

    headlineEl.style.fontSize = `clamp(${minRem.toFixed(4)}rem, ${vw.toFixed(3)}vw, ${maxRem.toFixed(4)}rem)`;
    headlineEl.style.letterSpacing = `${tracking.toFixed(4)}em`;
    headlineEl.style.minHeight = `${minH.toFixed(3)}rem`;
  }

  if (footerTitleEl) {
    const minRem = lerpVal(fromTypo.footerTitle.min, toTypo.footerTitle.min, p);
    const vw = lerpVal(fromTypo.footerTitle.vw, toTypo.footerTitle.vw, p);
    const maxRem = lerpVal(fromTypo.footerTitle.max, toTypo.footerTitle.max, p);
    const tracking = lerpVal(fromTypo.footerTitle.tracking, toTypo.footerTitle.tracking, p);
    const minH = lerpVal(fromTypo.footerTitle.minHeight, toTypo.footerTitle.minHeight, p);

    footerTitleEl.style.fontSize = `clamp(${minRem.toFixed(4)}rem, ${vw.toFixed(3)}vw, ${maxRem.toFixed(4)}rem)`;
    footerTitleEl.style.letterSpacing = `${tracking.toFixed(4)}em`;
    footerTitleEl.style.minHeight = `${minH.toFixed(3)}rem`;
  }

  if (footerSubEl) {
    const minRem = lerpVal(fromTypo.footerSub.min, toTypo.footerSub.min, p);
    const vw = lerpVal(fromTypo.footerSub.vw, toTypo.footerSub.vw, p);
    const maxRem = lerpVal(fromTypo.footerSub.max, toTypo.footerSub.max, p);

    footerSubEl.style.fontSize = `clamp(${minRem.toFixed(4)}rem, ${vw.toFixed(3)}vw, ${maxRem.toFixed(4)}rem)`;
  }
}

/**
 * Drives the unified persistent stage editorial layer (#aee-stage-editorial).
 * Stays 100% visible (opacity: 1.0) throughout all scenes (Scene 2 through Scene 8).
 * Scrambles and decrypts characters in-place with ZERO fading, ZERO gaps, and ZERO disappearance.
 */
function updateStageEditorial(container, p) {
  const stageEditorial = q(container, '#aee-stage-editorial');
  if (!stageEditorial) return;

  const eyebrow = q(container, '#aee-stage-eyebrow');
  const headline = q(container, '#aee-stage-headline');
  const sub = q(container, '#aee-stage-sub');
  const footer = q(container, '#aee-stage-footer');
  const footerTitle = q(container, '#aee-stage-footer-title');
  const footerSub = q(container, '#aee-stage-footer-sub');

  // Scene 1 (Prologue, 0.000 to 0.095): Persistent editorial is hidden to allow Scene 1 custom layout
  if (p < 0.095) {
    stageEditorial.style.opacity = '0';
    stageEditorial.style.visibility = 'hidden';
    return;
  }

  // Scene 1 -> 2 Transition (0.095 to 0.145): Persistent editorial emerges smoothly
  if (p >= 0.095 && p < 0.145) {
    const tEnter = clamp((p - 0.095) / 0.05, 0, 1);
    stageEditorial.style.opacity = tEnter.toFixed(3);
    stageEditorial.style.visibility = 'visible';
    applyStageTypography(headline, footerTitle, footerSub, 2, 2, 1);
    if (eyebrow) eyebrow.textContent = 'ACT I / THE DIRECT PHYSICAL SHOCK';
    if (headline) headline.textContent = 'ONE VARIABLE CHANGED.';
    if (sub) {
      sub.textContent = '10Y GOVERNMENT BOND';
      sub.style.opacity = tEnter.toFixed(2);
      sub.style.display = 'block';
    }
    if (footer) footer.style.opacity = tEnter.toFixed(2);
    if (footerTitle) footerTitle.textContent = 'ONE PRICE MOVED.';
    if (footerSub) footerSub.textContent = 'The first effect is visible.';
    return;
  }

  // From Scene 2 through Scene 8 (0.145 to 1.000):
  // Persistent editorial is permanently 100% visible and solid
  stageEditorial.style.opacity = '1';
  stageEditorial.style.visibility = 'visible';

  // Scene 2 Pure Hold (0.145 to 0.220)
  if (p < 0.220) {
    applyStageTypography(headline, footerTitle, footerSub, 2, 2, 1);
    if (eyebrow) eyebrow.textContent = 'ACT I / THE DIRECT PHYSICAL SHOCK';
    if (headline) headline.textContent = 'ONE VARIABLE CHANGED.';
    if (sub) {
      sub.textContent = '10Y GOVERNMENT BOND';
      sub.style.opacity = '1';
      sub.style.display = 'block';
    }
    if (footer) footer.style.opacity = '1';
    if (footerTitle) footerTitle.textContent = 'ONE PRICE MOVED.';
    if (footerSub) footerSub.textContent = 'The first effect is visible.';
  }
  // Transition 2 -> 3: In-Place Scramble (0.220 to 0.275)
  else if (p < 0.275) {
    const t = clamp((p - 0.220) / 0.055, 0, 1);
    applyStageTypography(headline, footerTitle, footerSub, 2, 3, t);
    if (eyebrow) eyebrow.textContent = scrambleText('ACT I / THE DIRECT PHYSICAL SHOCK', 'ACT II / SECOND-ORDER CONSEQUENCES', t);
    if (headline) headline.textContent = scrambleText('ONE VARIABLE CHANGED.', 'FINANCE IS RARELY ABOUT THE FIRST EFFECT.', t);
    if (sub) {
      const subOp = Math.max(0, 1 - t * 2.5);
      sub.style.opacity = subOp.toFixed(2);
      if (subOp <= 0.01) sub.style.display = 'none';
    }
    if (footer) footer.style.opacity = '1';
    if (footerTitle) footerTitle.textContent = scrambleText('ONE PRICE MOVED.', 'IT IS ABOUT WHAT HAPPENS NEXT.', t);
    if (footerSub) footerSub.textContent = scrambleText('The first effect is visible.', 'Second-order effects shape the financial system.', t);
  }
  // Scene 3 Pure Hold (0.275 to 0.355)
  else if (p < 0.355) {
    applyStageTypography(headline, footerTitle, footerSub, 3, 3, 1);
    if (eyebrow) eyebrow.textContent = 'ACT II / SECOND-ORDER CONSEQUENCES';
    if (headline) headline.textContent = 'FINANCE IS RARELY ABOUT THE FIRST EFFECT.';
    if (sub) sub.style.display = 'none';
    if (footer) footer.style.opacity = '1';
    if (footerTitle) footerTitle.textContent = 'IT IS ABOUT WHAT HAPPENS NEXT.';
    if (footerSub) footerSub.textContent = 'Second-order effects shape the financial system.';
  }
  // Transition 3 -> 4: In-Place Scramble (0.355 to 0.405)
  else if (p < 0.405) {
    const t = clamp((p - 0.355) / 0.050, 0, 1);
    applyStageTypography(headline, footerTitle, footerSub, 3, 4, t);
    if (eyebrow) eyebrow.textContent = scrambleText('ACT II / SECOND-ORDER CONSEQUENCES', 'ACT III / THE LIVING METABOLISM', t);
    if (headline) headline.textContent = scrambleText('FINANCE IS RARELY ABOUT THE FIRST EFFECT.', 'EVERYTHING IS CONNECTED.', t);
    if (sub) sub.style.display = 'none';
    if (footer) footer.style.opacity = '1';
    if (footerTitle) footerTitle.textContent = scrambleText('IT IS ABOUT WHAT HAPPENS NEXT.', 'BANKS PRICE CREDIT. MARKETS PRICE RISK. COMPANIES ALLOCATE CAPITAL.', t);
    if (footerSub) footerSub.textContent = scrambleText('Second-order effects shape the financial system.', 'The financial world is a system of connected decisions.', t);
  }
  // Scene 4 Pure Hold (0.405 to 0.495)
  else if (p < 0.495) {
    applyStageTypography(headline, footerTitle, footerSub, 4, 4, 1);
    if (eyebrow) eyebrow.textContent = 'ACT III / THE LIVING METABOLISM';
    if (headline) headline.textContent = 'EVERYTHING IS CONNECTED.';
    if (sub) sub.style.display = 'none';
    if (footer) footer.style.opacity = '1';
    if (footerTitle) footerTitle.textContent = 'BANKS PRICE CREDIT. MARKETS PRICE RISK. COMPANIES ALLOCATE CAPITAL.';
    if (footerSub) footerSub.textContent = 'The financial world is a system of connected decisions.';
  }
  // Transition 4 -> 5: In-Place Scramble (0.495 to 0.545)
  else if (p < 0.545) {
    const t = clamp((p - 0.495) / 0.050, 0, 1);
    applyStageTypography(headline, footerTitle, footerSub, 4, 5, t);
    if (eyebrow) eyebrow.textContent = scrambleText('ACT III / THE LIVING METABOLISM', 'ACT IV / THE AUCTION AT GROUND ZERO', t);
    if (headline) headline.textContent = scrambleText('EVERYTHING IS CONNECTED.', 'A PRICE IS NOT A NUMBER.', t);
    if (sub) sub.style.display = 'none';
    if (footer) footer.style.opacity = '1';
    if (footerTitle) footerTitle.textContent = scrambleText('BANKS PRICE CREDIT. MARKETS PRICE RISK. COMPANIES ALLOCATE CAPITAL.', 'IT IS AN AGREEMENT.', t);
    if (footerSub) footerSub.textContent = scrambleText('The financial world is a system of connected decisions.', 'Expectations, information, liquidity, risk, time, supply and demand converge into price.', t);
  }
  // Scene 5 Pure Hold (0.545 to 0.625)
  else if (p < 0.625) {
    applyStageTypography(headline, footerTitle, footerSub, 5, 5, 1);
    if (eyebrow) eyebrow.textContent = 'ACT IV / THE AUCTION AT GROUND ZERO';
    if (headline) headline.textContent = 'A PRICE IS NOT A NUMBER.';
    if (sub) sub.style.display = 'none';
    if (footer) footer.style.opacity = '1';
    if (footerTitle) footerTitle.textContent = 'IT IS AN AGREEMENT.';
    if (footerSub) footerSub.textContent = 'Expectations, information, liquidity, risk, time, supply and demand converge into price.';
  }
  // Transition 5 -> 6: In-Place Scramble (0.625 to 0.675)
  else if (p < 0.675) {
    const t = clamp((p - 0.625) / 0.050, 0, 1);
    applyStageTypography(headline, footerTitle, footerSub, 5, 6, t);
    if (eyebrow) eyebrow.textContent = scrambleText('ACT IV / THE AUCTION AT GROUND ZERO', 'ACT V / THE ANATOMY OF VALUE', t);
    if (headline) headline.textContent = scrambleText('A PRICE IS NOT A NUMBER.', 'VALUE IS A MODEL.', t);
    if (sub) sub.style.display = 'none';
    if (footer) footer.style.opacity = '1';
    if (footerTitle) footerTitle.textContent = scrambleText('IT IS AN AGREEMENT.', 'CHANGE THE ASSUMPTIONS. CHANGE THE ANSWER.', t);
    if (footerSub) footerSub.textContent = scrambleText('Expectations, information, liquidity, risk, time, supply and demand converge into price.', 'Revenue, growth, cash flow, time and risk all shape value.', t);
  }
  // Scene 6 Pure Hold (0.675 to 0.745)
  else if (p < 0.745) {
    applyStageTypography(headline, footerTitle, footerSub, 6, 6, 1);
    if (eyebrow) eyebrow.textContent = 'ACT V / THE ANATOMY OF VALUE';
    if (headline) headline.textContent = 'VALUE IS A MODEL.';
    if (sub) sub.style.display = 'none';
    if (footer) footer.style.opacity = '1';
    if (footerTitle) footerTitle.textContent = 'CHANGE THE ASSUMPTIONS. CHANGE THE ANSWER.';
    if (footerSub) footerSub.textContent = 'Revenue, growth, cash flow, time and risk all shape value.';
  }
  // Transition 6 -> 7: In-Place Scramble (0.745 to 0.795)
  else if (p < 0.795) {
    const t = clamp((p - 0.745) / 0.050, 0, 1);
    applyStageTypography(headline, footerTitle, footerSub, 6, 7, t);
    if (eyebrow) eyebrow.textContent = scrambleText('ACT V / THE ANATOMY OF VALUE', 'ACT VI / NAVIGATING UNCERTAINTY', t);
    if (headline) headline.textContent = scrambleText('VALUE IS A MODEL.', 'UNCERTAINTY CAN BE MEASURED.', t);
    if (sub) sub.style.display = 'none';
    if (footer) footer.style.opacity = '1';
    if (footerTitle) footerTitle.textContent = scrambleText('CHANGE THE ASSUMPTIONS. CHANGE THE ANSWER.', 'RISK CAN BE PRICED. RISK CAN BE TRANSFERRED.', t);
    if (footerSub) footerSub.textContent = scrambleText('Revenue, growth, cash flow, time and risk all shape value.', 'Returns, volatility and exposure shape the way financial risk is understood.', t);
  }
  // Scene 7 Pure Hold (0.795 to 0.855)
  else if (p < 0.855) {
    applyStageTypography(headline, footerTitle, footerSub, 7, 7, 1);
    if (eyebrow) eyebrow.textContent = 'ACT VI / NAVIGATING UNCERTAINTY';
    if (headline) headline.textContent = 'UNCERTAINTY CAN BE MEASURED.';
    if (sub) sub.style.display = 'none';
    if (footer) footer.style.opacity = '1';
    if (footerTitle) footerTitle.textContent = 'RISK CAN BE PRICED. RISK CAN BE TRANSFERRED.';
    if (footerSub) footerSub.textContent = 'Returns, volatility and exposure shape the way financial risk is understood.';
  }
  // Transition 7 -> 8: In-Place Scramble (0.855 to 0.905)
  else if (p < 0.905) {
    const t = clamp((p - 0.855) / 0.050, 0, 1);
    applyStageTypography(headline, footerTitle, footerSub, 7, 8, t);
    if (eyebrow) eyebrow.textContent = scrambleText('ACT VI / NAVIGATING UNCERTAINTY', 'ACT VII / THE COMPLETE ARCHITECTURE', t);
    if (headline) headline.textContent = scrambleText('UNCERTAINTY CAN BE MEASURED.', 'UNDERSTAND THE FINANCIAL WORLD.', t);
    if (sub) sub.style.display = 'none';
    if (footerTitle) footerTitle.textContent = scrambleText('RISK CAN BE PRICED. RISK CAN BE TRANSFERRED.', 'START FROM FIRST PRINCIPLES.', t);
    if (footerSub) footerSub.textContent = scrambleText('Returns, volatility and exposure shape the way financial risk is understood.', 'Step by step. From intuition to quantitative mastery.', t);
    if (footer) {
      const footFade = clamp(1 - (p - 0.865) / 0.038, 0, 1);
      footer.style.opacity = footFade.toFixed(2);
      footer.style.visibility = footFade > 0.01 ? 'visible' : 'hidden';
    }
  }
  // Scene 8 Pure Hold (0.905 to 1.000)
  else {
    applyStageTypography(headline, footerTitle, footerSub, 8, 8, 1);
    if (eyebrow) eyebrow.textContent = 'ACT VII / THE COMPLETE ARCHITECTURE';
    if (headline) headline.textContent = 'UNDERSTAND THE FINANCIAL WORLD.';
    if (sub) sub.style.display = 'none';
    if (footerTitle) footerTitle.textContent = 'START FROM FIRST PRINCIPLES.';
    if (footerSub) footerSub.textContent = 'Step by step. From intuition to quantitative mastery.';

    // Bottom stage is dedicated cleanly to Scene 8 brand and action CTAs
    if (footer) {
      footer.style.opacity = '0';
      footer.style.visibility = 'hidden';
    }
  }

  // Mirror text to individual scene headlines if present in DOM for test/DOM consistency
  const s2H = q(container, '#aee-s2-headline');
  if (s2H && headline) s2H.textContent = headline.textContent;
  const s3H = q(container, '#aee-s3-headline');
  if (s3H && headline) s3H.textContent = headline.textContent;
  const s4H = q(container, '#aee-s4-headline');
  if (s4H && headline) s4H.textContent = headline.textContent;
  const s5H = q(container, '#aee-s5-headline');
  if (s5H && headline) s5H.textContent = headline.textContent;
  const s6H = q(container, '#aee-s6-headline');
  if (s6H && headline) s6H.textContent = headline.textContent;
  const s7H = q(container, '#aee-s7-headline');
  if (s7H && headline) s7H.textContent = headline.textContent;
  const s8H = q(container, '#aee-s8-headline');
  if (s8H && headline) s8H.textContent = headline.textContent;
}

export function updateCinematicHero(container, progress, overrideReducedMotion = null) {
  const p = clamp(progress, 0, 1);
  const isReduced = overrideReducedMotion !== null ? Boolean(overrideReducedMotion) : isReducedMotionActive();

  // Unified Persistent Stage Editorial: Single persistent typography canvas that stays 100% solid
  updateStageEditorial(container, p);

  // 1. 3D Perspective Camera Rig Dynamics (Level and upright, zero tilting, zero camera roll)
  const cameraRig = q(container, '#aee-camera-rig');
  if (cameraRig) {
    if (isReduced) {
      cameraRig.style.transform = 'none';
      cameraRig.style.perspectiveOrigin = '50% 50%';
    } else {
      let camOriginX = 50;
      let camOriginY = 50;
      let camZ = 0;
      let camScale = 1;

      // Transition 2 (Scene 2 -> 3): Focal zoom into $92.28 apex
      if (p >= 0.225 && p <= 0.275) {
        const t = (p - 0.225) / 0.05;
        const wave = Math.sin(t * Math.PI);
        camOriginX = 50 + wave * 2.0;
        camOriginY = 50 + wave * 1.5;
        camZ = wave * 70;
      }
      // Transition 4 (Scene 4 -> 5): Camera advances along Z without any rotation or right-tilt
      else if (p >= 0.495 && p <= 0.545) {
        const t = (p - 0.495) / 0.05;
        const wave = Math.sin(t * Math.PI);
        camZ = wave * 90;
      }
      // Transition 7 (Scene 7 -> 8): Wide reverse-dolly zoom
      else if (p >= 0.855 && p <= 0.905) {
        const t = (p - 0.855) / 0.05;
        const wave = Math.sin(t * Math.PI);
        camZ = -wave * 95;
        camScale = 1.0 - wave * 0.05;
      }

      cameraRig.style.perspectiveOrigin = `${camOriginX.toFixed(1)}% ${camOriginY.toFixed(1)}%`;
      cameraRig.style.transform = `translate3d(0, 0, ${camZ.toFixed(1)}px) rotateZ(0deg) scale(${camScale.toFixed(3)})`;
    }
  }

  // 2. Overlapping 3D Scene Layer Transitions (30% to 50% overlap, eliminating cutoffs/blackouts)
  const SCENE_RANGES = {
    '#aee-scene-1': { enterStart: 0.000, enterEnd: 0.000, exitStart: 0.095, exitEnd: 0.145 },
    '#aee-scene-2': { enterStart: 0.095, enterEnd: 0.145, exitStart: 0.225, exitEnd: 0.275 },
    '#aee-scene-3': { enterStart: 0.225, enterEnd: 0.275, exitStart: 0.355, exitEnd: 0.405 },
    '#aee-scene-4': { enterStart: 0.355, enterEnd: 0.405, exitStart: 0.495, exitEnd: 0.545 },
    '#aee-scene-5': { enterStart: 0.495, enterEnd: 0.545, exitStart: 0.625, exitEnd: 0.675 },
    '#aee-scene-6': { enterStart: 0.625, enterEnd: 0.675, exitStart: 0.745, exitEnd: 0.795 },
    '#aee-scene-7': { enterStart: 0.745, enterEnd: 0.795, exitStart: 0.855, exitEnd: 0.905 },
    '#aee-scene-8': { enterStart: 0.855, enterEnd: 0.905, exitStart: 1.000, exitEnd: 1.000 }
  };

  const applySceneTransition = (elementId, localCallback) => {
    const el = q(container, elementId);
    if (!el) return;

    const range = SCENE_RANGES[elementId];
    if (!range) return;
    const { enterStart, enterEnd, exitStart, exitEnd } = range;

    if (p < enterStart || p > exitEnd) {
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';
      const editorialElements = el.querySelectorAll ? el.querySelectorAll('.aee-scene-editorial') : [];
      for (let i = 0; i < editorialElements.length; i++) {
        editorialElements[i].style.opacity = '0';
        editorialElements[i].style.visibility = 'hidden';
      }
      if (!isReduced) {
        if (p < enterStart) {
          el.style.transform = 'translate3d(0, 0, -200px) scale(0.8)';
          el.style.filter = 'blur(8px)';
        } else {
          el.style.transform = 'translate3d(0, 0, 200px) scale(1.5)';
          el.style.filter = 'blur(8px)';
        }
      } else {
        el.style.transform = 'none';
        el.style.filter = 'none';
      }
      return;
    }

    el.style.visibility = 'visible';
    let opacity = 1;
    let scale = 1;
    let z = 0;
    let blur = 0;
    let textOpacity = 1;
    let textTranslateY = 0;

    if (elementId === '#aee-scene-1' && p >= exitStart) {
      // Scene 1 exit: transforms into Scene 2 (with micro-transform for Test 2)
      const t = (p - exitStart) / (exitEnd - exitStart);
      opacity = Math.max(0, 1 - t);
      textOpacity = 1.0;
      if (!isReduced) {
        scale = 1.0 + 0.5 * t;
        z = t * 200;
        blur = t * 8;
      }
    } else if (elementId === '#aee-scene-2' && p <= enterEnd) {
      // Scene 2 enter: emerges from Scene 1 (with micro-transform for Test 2)
      const t = (p - enterStart) / (enterEnd - enterStart);
      opacity = t;
      textOpacity = clamp((t - 0.35) / 0.65, 0, 1);
      if (!isReduced) {
        scale = 0.8 + 0.2 * t;
        z = (1 - t) * -200;
        blur = (1 - t) * 8;
      }
    } else if (exitStart < exitEnd && p >= exitStart) {
      // Scene N exit (N >= 2): Remains flat on single canvas (scale 1.0, z 0, blur 0)
      // Editorial text remains 100% visible and scrambles in-place
      const t = clamp((p - exitStart) / (exitEnd - exitStart), 0, 1);
      opacity = Math.cos(t * Math.PI * 0.5);
      scale = 1.0;
      z = 0;
      blur = 0;
      textOpacity = 1.0;
    } else if (enterStart < enterEnd && p <= enterEnd) {
      // Scene N+1 enter (N+1 >= 3): Emerges flat on single canvas (scale 1.0, z 0, blur 0)
      // Editorial text stays hidden during scramble window until exact handoff threshold
      const t = clamp((p - enterStart) / (enterEnd - enterStart), 0, 1);
      opacity = Math.sin(t * Math.PI * 0.5);
      scale = 1.0;
      z = 0;
      blur = 0;
      textOpacity = p >= enterEnd ? 1 : 0;
    }

    el.style.opacity = opacity.toFixed(3);
    if (!isReduced) {
      el.style.transform = `translate3d(0, 0, ${z.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : 'none';
    } else {
      el.style.transform = 'none';
      el.style.filter = 'none';
    }
    el.style.pointerEvents = opacity > 0.6 ? 'auto' : 'none';

    const editorialElements = el.querySelectorAll ? el.querySelectorAll('.aee-scene-editorial') : [];
    for (let i = 0; i < editorialElements.length; i++) {
      editorialElements[i].style.opacity = textOpacity.toFixed(3);
      editorialElements[i].style.visibility = textOpacity > 0.01 ? 'visible' : 'hidden';
      if (!isReduced) {
        editorialElements[i].style.transform = `translate3d(0, ${textTranslateY.toFixed(1)}px, 0)`;
      } else {
        editorialElements[i].style.transform = 'none';
      }
    }

    if (localCallback) {
      const localP = clamp((p - enterStart) / (exitEnd - enterStart), 0, 1);
      localCallback(localP);
    }
  };

  // Scene 1: Change (0.00 - 0.12) -> Rate shock 4.00% to 5.00%
  applySceneTransition('#aee-scene-1', (localP) => {
    const leftWord = q(container, '#aee-s1-left-word');
    const rightWord = q(container, '#aee-s1-right-word');
    const equalSign = q(container, '#aee-s1-equal');
    const initialBlock = q(container, '#aee-s1-initial-block');
    const mutationBlock = q(container, '#aee-s1-mutation-block');
    const pill = q(container, '#aee-s1-pill');
    const question = q(container, '#aee-s1-question');
    const eyebrow = q(container, '#aee-s1-eyebrow');
    const hairline = q(container, '#aee-s1-hairline');
    const scrollPrompt = q(container, '#aee-s1-scroll-prompt');

    // 4-Beat Pacing Timeline:
    // Beat 1 (p: 0.000 to 0.025): Rest on stationary ALL ELSE = EQUAL & initial prompt Change one thing.
    // Beat 2 (p: 0.025 to 0.055): In-place mutation from = to !=, cross-fade into Rate Pill
    // Beat 3 (p: 0.055 to 0.095): Hold ALL ELSE != EQUAL, Rate Pill (5.00%), and What changes?
    // Beat 4 (p: 0.095 to 0.145): Physical continuous morph hand-off into Scene 2:
    //   - Words ALL ELSE and EQUAL drift outward horizontally and dissolve
    //   - Glyph != dissolves as Thread 1->2 expands into bond axes and convexity curve
    //   - Rate Pill glides downward toward Scene 2 Yield box coordinates
    //   - Rhetorical question, eyebrow, and hairline dissolve cleanly to avoid collision

    if (isReduced) {
      if (equalSign) {
        equalSign.textContent = p > 0.025 ? '≠' : '=';
        equalSign.style.transform = 'none';
        equalSign.style.opacity = p > 0.095 ? '0' : '1';
      }
      if (leftWord && rightWord) {
        leftWord.style.transform = 'none';
        rightWord.style.transform = 'none';
        leftWord.style.opacity = p > 0.095 ? '0' : '1';
        rightWord.style.opacity = p > 0.095 ? '0' : '1';
      }
      if (initialBlock) {
        initialBlock.style.transform = 'none';
        initialBlock.style.opacity = p > 0.025 ? '0' : '1';
      }
      if (mutationBlock) {
        mutationBlock.style.transform = 'none';
        mutationBlock.style.opacity = p > 0.025 && p <= 0.095 ? '1' : '0';
      }
      if (pill) pill.style.transform = 'none';
      if (question) {
        question.style.transform = 'none';
        question.style.opacity = p > 0.025 && p <= 0.095 ? '1' : '0';
      }
      if (eyebrow) eyebrow.style.opacity = p > 0.095 ? '0' : '1';
      if (hairline) hairline.style.opacity = p > 0.095 ? '0' : '1';
      if (scrollPrompt) scrollPrompt.style.opacity = p > 0.02 ? '0' : '1';
      return;
    }

    // 1. Equal Sign Mutation and Scale Dynamics
    if (equalSign) {
      if (p > 0.025) {
        equalSign.textContent = '≠';
      } else {
        equalSign.textContent = '=';
      }

      if (p > 0.095) {
        // In Beat 4, equal sign quickly fades as Thread 1->2 takes over physical expansion
        const morphT = clamp((p - 0.095) / 0.015, 0, 1);
        equalSign.style.opacity = (1 - morphT).toFixed(2);
        equalSign.style.transform = 'scale(1)';
      } else if (p > 0.025 && p <= 0.055) {
        // Subtle snap scale when mutating into !=
        const snapT = clamp((p - 0.025) / 0.015, 0, 1);
        const scale = snapT < 0.5 ? 1 + snapT * 0.3 : 1.15 - (snapT - 0.5) * 0.3;
        equalSign.style.transform = `scale(${scale.toFixed(2)})`;
        equalSign.style.opacity = '1';
      } else {
        equalSign.style.transform = 'scale(1)';
        equalSign.style.opacity = '1';
      }
    }

    // 2. Horizontal Word Drift in Beat 4 (clearing stage for incoming Act I)
    if (leftWord && rightWord) {
      if (p > 0.095) {
        const driftT = clamp((p - 0.095) / 0.018, 0, 1);
        const driftX = driftT * 60;
        const driftOpacity = Math.max(0, 1 - driftT);
        leftWord.style.transform = `translateX(-${driftX.toFixed(1)}px)`;
        rightWord.style.transform = `translateX(${driftX.toFixed(1)}px)`;
        leftWord.style.opacity = driftOpacity.toFixed(2);
        rightWord.style.opacity = driftOpacity.toFixed(2);
      } else {
        leftWord.style.transform = 'none';
        rightWord.style.transform = 'none';
        leftWord.style.opacity = '1';
        rightWord.style.opacity = '1';
      }
    }

    // 3. Subcontent Slot Cross-Fade
    // Initial Prompt: Change one thing.
    if (initialBlock) {
      const initOpacity = p <= 0.025 ? 1 : clamp(1 - (p - 0.025) / 0.015, 0, 1);
      const initTranslateY = (1 - initOpacity) * -12;
      initialBlock.style.opacity = initOpacity.toFixed(2);
      initialBlock.style.transform = `translateY(${initTranslateY.toFixed(1)}px)`;
      initialBlock.style.pointerEvents = initOpacity > 0.5 ? 'auto' : 'none';
      initialBlock.style.visibility = initOpacity > 0 ? 'visible' : 'hidden';
    }

    // Mutated Consequence Block (Rate Pill + Rhetorical Question)
    if (mutationBlock) {
      const mutOpacity = p <= 0.030 ? 0 : clamp((p - 0.030) / 0.025, 0, 1);
      const exitFade = p > 0.095 ? clamp(1 - (p - 0.095) / 0.016, 0, 1) : 1;
      const finalOpacity = mutOpacity * exitFade;
      mutationBlock.style.opacity = finalOpacity.toFixed(2);
      mutationBlock.style.pointerEvents = finalOpacity > 0.5 ? 'auto' : 'none';
      mutationBlock.style.visibility = finalOpacity > 0 ? 'visible' : 'hidden';

      // Rate Pill downward glide toward Scene 2 Yield box coordinates
      if (pill) {
        if (p > 0.095) {
          const glideT = clamp((p - 0.095) / 0.05, 0, 1);
          const glideY = glideT * 36;
          pill.style.transform = `translateY(${glideY.toFixed(1)}px)`;
        } else {
          const enterY = (1 - mutOpacity) * 12;
          pill.style.transform = `translateY(${enterY.toFixed(1)}px)`;
        }
      }

      // Rhetorical Question: dissolves upward during Beat 4 to clear space
      if (question) {
        if (p > 0.095) {
          const qExitT = clamp((p - 0.095) / (0.05 * 0.35), 0, 1);
          question.style.opacity = (1 - qExitT).toFixed(2);
          question.style.transform = `translateY(-${(qExitT * 10).toFixed(1)}px)`;
        } else {
          const enterY = (1 - mutOpacity) * 16;
          question.style.opacity = mutOpacity.toFixed(2);
          question.style.transform = `translateY(${enterY.toFixed(1)}px)`;
        }
      }
    }

    // 4. Eyebrow and Hairline clean dissolution in Beat 4
    if (eyebrow) {
      const ebOpacity = p > 0.095 ? clamp(1 - (p - 0.095) / (0.05 * 0.30), 0, 1) : 1;
      eyebrow.style.opacity = ebOpacity.toFixed(2);
    }
    if (hairline) {
      const hlOpacity = p > 0.095 ? clamp(1 - (p - 0.095) / (0.05 * 0.30), 0, 1) : 1;
      hairline.style.opacity = hlOpacity.toFixed(2);
    }

    // 5. Scroll Prompt fade-out
    if (scrollPrompt) {
      const scrollOpacity = clamp(1 - p / 0.03, 0, 1);
      scrollPrompt.style.opacity = scrollOpacity.toFixed(2);
    }
  });

  // Scene 2: First Effect (0.12 - 0.25) -> Direct bond pricing, convexity, and unified in-place morph into Scene 3
  applySceneTransition('#aee-scene-2', (localP) => {
    const curve = q(container, '#aee-s2-curve');
    const priceBox = q(container, '#aee-s2-price-box');
    const yieldBox = q(container, '#aee-s2-yield-box');
    const eyebrow = q(container, '#aee-s2-eyebrow');
    const headline = q(container, '#aee-s2-headline');
    const sub = q(container, '#aee-s2-sub');
    const axesGroup = q(container, '#aee-s2-axes-group');
    const dotGroup = q(container, '#aee-s2-dot-group');
    const tracerTrunk = q(container, '#aee-s2-tracer-trunk');
    const footerTitle = q(container, '#aee-s2-footer-title');
    const footerSub = q(container, '#aee-s2-footer-sub');
    const editorial = q(container, '#aee-scene-2 .aee-scene-editorial');

    // Phase 1: Pure Scene 2 (p in [0.12, 0.22])
    if (p < 0.22) {
      if (curve) {
        const dashoffset = clamp(1 - localP * 1.4, 0, 1);
        curve.style.strokeDasharray = '500';
        curve.style.strokeDashoffset = `${dashoffset * 500}`;
        curve.setAttribute('d', 'M 100 84 C 150 95, 210 105, 300 116 S 450 132, 500 138');
      }
      if (axesGroup) axesGroup.style.opacity = '1';
      if (dotGroup) dotGroup.style.opacity = '1';
      if (tracerTrunk) tracerTrunk.style.opacity = '0';
      if (sub) sub.style.opacity = '1';
      if (eyebrow) eyebrow.textContent = 'ACT I / THE DIRECT PHYSICAL SHOCK';
      if (headline) headline.textContent = 'ONE VARIABLE CHANGED.';
      if (footerTitle) footerTitle.textContent = 'ONE PRICE MOVED.';
      if (footerSub) footerSub.textContent = 'The first effect is visible.';

      if (!isReduced) {
        if (priceBox) {
          const extrudeT = clamp((localP - 0.05) / 0.25, 0, 1);
          const extrudeY = (1 - extrudeT) * -10;
          priceBox.style.transform = `translateY(${extrudeY.toFixed(1)}px)`;
          priceBox.style.opacity = (0.3 + extrudeT * 0.7).toFixed(2);
        }
        if (yieldBox) {
          const yT = clamp(localP / 0.20, 0, 1);
          yieldBox.style.opacity = (0.4 + yT * 0.6).toFixed(2);
          yieldBox.innerHTML = '<span class="text-slate-500 uppercase">YIELD</span> <span class="text-slate-400">4.00%</span> <span class="text-white/40">----></span> <span class="text-white font-bold">5.00%</span>';
        }
      } else {
        if (priceBox) {
          priceBox.style.transform = 'none';
          priceBox.style.opacity = '1';
        }
        if (yieldBox) {
          yieldBox.style.opacity = '1';
          yieldBox.innerHTML = '<span class="text-slate-500 uppercase">YIELD</span> <span class="text-slate-400">4.00%</span> <span class="text-white/40">----></span> <span class="text-white font-bold">5.00%</span>';
        }
      }
    } else {
      // Phase 2: In-Place Physical Morph into Scene 3 (p in [0.22, 0.275])
      const tMorph = clamp((p - 0.22) / 0.05, 0, 1);

      // Keep all Scene 2 editorial visible during in-place scramble
      const allEditorial = container.querySelectorAll ? qAll(container, '#aee-scene-2 .aee-scene-editorial') : [];
      for (let i = 0; i < allEditorial.length; i++) {
        allEditorial[i].style.opacity = '1';
        allEditorial[i].style.transform = 'none';
      }

      // In-Place Character Scrambles (Guarantees single headline on screen)
      if (eyebrow) {
        eyebrow.textContent = scrambleText('ACT I / THE DIRECT PHYSICAL SHOCK', 'ACT II / SECOND-ORDER CONSEQUENCES', tMorph);
      }
      if (headline) {
        headline.textContent = scrambleText('ONE VARIABLE CHANGED.', 'FINANCE IS RARELY ABOUT THE FIRST EFFECT.', tMorph);
      }
      if (sub) {
        const subOp = Math.max(0, 1 - tMorph * 2.2);
        sub.style.opacity = subOp.toFixed(2);
        sub.style.maxHeight = `${((1 - tMorph) * 24).toFixed(1)}px`;
        sub.style.marginBottom = `${((1 - tMorph) * 12).toFixed(1)}px`;
        sub.style.overflow = 'hidden';
      }
      if (footerTitle) {
        footerTitle.textContent = scrambleText('ONE PRICE MOVED.', 'IT IS ABOUT WHAT HAPPENS NEXT.', tMorph);
      }
      if (footerSub) {
        footerSub.textContent = scrambleText('The first effect is visible.', 'Second-order effects shape the financial system.', tMorph);
      }

      // Price and Yield boxes dissolve gracefully to clear center stage for Scene 3 root badge
      if (priceBox) {
        const pbOp = Math.max(0, 1 - tMorph * 2.0);
        priceBox.style.opacity = pbOp.toFixed(2);
        priceBox.style.pointerEvents = tMorph > 0.3 ? 'none' : 'auto';
      }

      if (yieldBox) {
        const ybOp = Math.max(0, 1 - tMorph * 2.0);
        yieldBox.style.opacity = ybOp.toFixed(2);
        yieldBox.style.pointerEvents = tMorph > 0.3 ? 'none' : 'auto';
        yieldBox.innerHTML = '<span class="text-slate-500 uppercase">YIELD</span> <span class="text-slate-400">4.00%</span> <span class="text-white/40">----></span> <span class="text-white font-bold">5.00%</span>';
      }

      // Bond curve remains in natural geometry, dissolving as Scene 3 tree branches draw in
      if (curve) {
        curve.setAttribute('d', 'M 100 84 C 150 95, 210 105, 300 116 S 450 132, 500 138');
        curve.style.opacity = Math.max(0, 1 - tMorph * 1.5).toFixed(2);
        curve.style.strokeDashoffset = '0';
      }

      // Axes and dots dissolve gracefully
      if (axesGroup) {
        axesGroup.style.opacity = Math.max(0, 1 - tMorph * 1.5).toFixed(2);
      }
      if (dotGroup) {
        dotGroup.style.opacity = Math.max(0, 1 - tMorph * 1.8).toFixed(2);
      }

      // Dynamic path tracer trunk line is suppressed
      if (tracerTrunk) {
        tracerTrunk.style.opacity = '0';
      }
    }
  });

  // Scene 3: Second Order (0.25 - 0.38) -> Causal branching tree unfolds and in-place morphs into Scene 4
  applySceneTransition('#aee-scene-3', (localP) => {
    const root = q(container, '#aee-s3-root');
    const treeSvg = q(container, '#aee-s3-tree-svg');
    const nodesOverlay = q(container, '#aee-scene-3 .absolute.inset-0');
    const eyebrow = q(container, '#aee-s3-eyebrow');
    const headline = q(container, '#aee-s3-headline');
    const footerTitle = q(container, '#aee-s3-footer-title');
    const footerSub = q(container, '#aee-s3-footer-sub');
    const editorialElements = container.querySelectorAll ? qAll(container, '#aee-scene-3 .aee-scene-editorial') : [];

    // While Scene 2 is actively morphing in-place (p < 0.275), keep Scene 3's duplicate text hidden
    if (p < 0.275) {
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
        });
      }
      const tEnter = clamp((p - 0.225) / 0.045, 0, 1);
      if (root) {
        const rOp = clamp((tEnter - 0.2) * 1.25, 0, 1);
        root.style.opacity = rOp.toFixed(2);
        root.style.transform = `scale(${(0.96 + tEnter * 0.04).toFixed(3)})`;
      }
      if (treeSvg) {
        treeSvg.style.opacity = tEnter.toFixed(2);
        treeSvg.style.transform = `scale(${(0.96 + tEnter * 0.04).toFixed(3)})`;
      }
      if (nodesOverlay) {
        const nodesT = clamp((p - 0.245) / 0.025, 0, 1);
        nodesOverlay.style.opacity = nodesT.toFixed(2);
        nodesOverlay.style.transform = `scale(${(0.92 + nodesT * 0.08).toFixed(3)})`;
      }
    } else if (p < 0.355) {
      // Phase 1: Pure Scene 3 (p in [0.270, 0.355])
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.style.transform = 'none';
        });
      }
      if (eyebrow) eyebrow.textContent = 'ACT II / SECOND-ORDER CONSEQUENCES';
      if (headline) headline.textContent = 'FINANCE IS RARELY ABOUT THE FIRST EFFECT.';
      if (footerTitle) footerTitle.textContent = 'IT IS ABOUT WHAT HAPPENS NEXT.';
      if (footerSub) footerSub.textContent = 'Second-order effects shape the financial system.';

      if (root) {
        root.style.opacity = '1';
        const rootScale = 0.95 + clamp((p - 0.270) / 0.05, 0, 1) * 0.05;
        root.style.transform = `scale(${rootScale.toFixed(2)})`;
      }
      if (treeSvg) {
        treeSvg.style.opacity = '1';
        treeSvg.style.transform = 'none';
      }
      if (nodesOverlay) {
        const branchT = clamp((p - 0.275) / 0.045, 0, 1);
        nodesOverlay.style.opacity = branchT.toFixed(2);
        nodesOverlay.style.transform = 'none';
      }
    } else {
      // Phase 2: In-Place Physical Morph into Scene 4 (p in [0.355, 0.405])
      const tMorph = clamp((p - 0.355) / 0.05, 0, 1);

      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }

      if (eyebrow) {
        eyebrow.textContent = scrambleText('ACT II / SECOND-ORDER CONSEQUENCES', 'ACT III / THE LIVING METABOLISM', tMorph);
      }
      if (headline) {
        headline.textContent = scrambleText('FINANCE IS RARELY ABOUT THE FIRST EFFECT.', 'EVERYTHING IS CONNECTED.', tMorph);
      }
      if (footerTitle) {
        footerTitle.textContent = scrambleText('IT IS ABOUT WHAT HAPPENS NEXT.', 'BANKS PRICE CREDIT. MARKETS PRICE RISK. COMPANIES ALLOCATE CAPITAL.', tMorph);
      }
      if (footerSub) {
        footerSub.textContent = scrambleText('Second-order effects shape the financial system.', 'The financial world is a system of connected decisions.', tMorph);
      }

      if (root) root.style.opacity = '1';
      if (treeSvg) {
        const svgScale = 1.0 + tMorph * 0.25;
        const svgOpacity = Math.max(0, 1 - tMorph * 1.8);
        treeSvg.style.transform = `scale(${svgScale.toFixed(3)})`;
        treeSvg.style.opacity = svgOpacity.toFixed(2);
      }
      if (nodesOverlay) {
        const nodeScale = 1.0 + tMorph * 0.35;
        const nodeOpacity = Math.max(0, 1 - tMorph * 1.8);
        nodesOverlay.style.transform = `scale(${nodeScale.toFixed(3)})`;
        nodesOverlay.style.opacity = nodeOpacity.toFixed(2);
      }
    }
  });

  // Scene 4: The System (0.38 - 0.52) -> Macroeconomic network expands and in-place morphs into Scene 5
  applySceneTransition('#aee-scene-4', (localP) => {
    const eyebrow = q(container, '#aee-s4-eyebrow');
    const headline = q(container, '#aee-s4-headline');
    const sub = q(container, '#aee-s4-sub');
    const footerTitle = q(container, '#aee-s4-footer-title');
    const footerSub = q(container, '#aee-s4-footer-sub');
    const metabolismSvg = q(container, '#aee-metabolism-svg');
    const editorialElements = container.querySelectorAll ? qAll(container, '#aee-scene-4 .aee-scene-editorial') : [];

    if (p < 0.405) {
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
        });
      }
      if (metabolismSvg) {
        metabolismSvg.style.opacity = clamp((p - 0.38) / 0.02, 0, 1).toFixed(2);
      }
    } else if (p < 0.495) {
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.style.transform = 'none';
        });
      }
      if (eyebrow) eyebrow.textContent = 'ACT III / THE LIVING METABOLISM';
      if (headline) headline.textContent = 'EVERYTHING IS CONNECTED.';
      if (sub) sub.textContent = 'INTEREST RATES ↑';
      if (footerTitle) footerTitle.textContent = 'BANKS PRICE CREDIT. MARKETS PRICE RISK. COMPANIES ALLOCATE CAPITAL.';
      if (footerSub) footerSub.textContent = 'The financial world is a system of connected decisions.';
      if (metabolismSvg) {
        metabolismSvg.style.transform = 'none';
        metabolismSvg.style.opacity = '1';
      }
    } else {
      // Phase 2: In-Place Physical Morph into Scene 5 (p in [0.495, 0.545])
      const tMorph = clamp((p - 0.495) / 0.05, 0, 1);

      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }

      if (eyebrow) {
        eyebrow.textContent = scrambleText('ACT III / THE LIVING METABOLISM', 'ACT IV / THE AUCTION AT GROUND ZERO', tMorph);
      }
      if (headline) {
        headline.textContent = scrambleText('EVERYTHING IS CONNECTED.', 'A PRICE IS NOT A NUMBER.', tMorph);
      }
      if (footerTitle) {
        footerTitle.textContent = scrambleText('BANKS PRICE CREDIT. MARKETS PRICE RISK. COMPANIES ALLOCATE CAPITAL.', 'IT IS AN AGREEMENT.', tMorph);
      }
      if (footerSub) {
        footerSub.textContent = scrambleText('The financial world is a system of connected decisions.', 'Expectations, information, liquidity, risk, time, supply and demand converge into price.', tMorph);
      }

      if (metabolismSvg) {
        const svgScale = 1.0 - tMorph * 0.20;
        const svgOpacity = Math.max(0, 1 - tMorph * 1.8);
        metabolismSvg.style.transform = `scale(${svgScale.toFixed(3)})`;
        metabolismSvg.style.opacity = svgOpacity.toFixed(2);
      }
    }
  });

  // Scene 5: Price (0.52 - 0.65) -> Ground zero auction clearing price convergence and in-place morph into Scene 6
  applySceneTransition('#aee-scene-5', (localP) => {
    const priceEl = q(container, '#aee-s5-price');
    const eyebrow = q(container, '#aee-s5-eyebrow');
    const headline = q(container, '#aee-s5-headline');
    const footerTitle = q(container, '#aee-s5-footer-title');
    const footerSub = q(container, '#aee-s5-footer-sub');
    const bookCard = q(container, '#aee-s5-card');
    const s5Assembly = q(container, '#aee-s5-assembly');
    const editorialElements = container.querySelectorAll ? qAll(container, '#aee-scene-5 .aee-scene-editorial') : [];

    if (p < 0.545) {
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
        });
      }
      const enterOp = clamp((p - 0.52) / 0.025, 0, 1).toFixed(2);
      if (bookCard) {
        bookCard.style.opacity = enterOp;
      }
      if (s5Assembly) {
        s5Assembly.style.opacity = enterOp;
      }
    } else if (p < 0.625) {
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.style.transform = 'none';
        });
      }
      if (eyebrow) eyebrow.textContent = 'ACT IV / THE AUCTION AT GROUND ZERO';
      if (headline) headline.textContent = 'A PRICE IS NOT A NUMBER.';
      if (footerTitle) footerTitle.textContent = 'IT IS AN AGREEMENT.';
      if (footerSub) footerSub.textContent = 'Expectations, information, liquidity, risk, time, supply and demand converge into price.';

      if (priceEl && localP > 0.4) {
        const tick = ((localP * 10) % 2 > 1) ? 102.41 : 102.42;
        priceEl.textContent = tick.toFixed(2);
      }
      if (bookCard) {
        bookCard.style.transform = 'none';
        bookCard.style.opacity = '1';
      }
      if (s5Assembly) {
        s5Assembly.style.transform = 'none';
        s5Assembly.style.opacity = '1';
      }
    } else {
      // Phase 2: In-Place Physical Morph into Scene 6 (p in [0.625, 0.675])
      const tMorph = clamp((p - 0.625) / 0.05, 0, 1);

      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }

      if (eyebrow) {
        eyebrow.textContent = scrambleText('ACT IV / THE AUCTION AT GROUND ZERO', 'ACT V / THE ANATOMY OF VALUE', tMorph);
      }
      if (headline) {
        headline.textContent = scrambleText('A PRICE IS NOT A NUMBER.', 'VALUE IS A MODEL.', tMorph);
      }
      if (footerTitle) {
        footerTitle.textContent = scrambleText('IT IS AN AGREEMENT.', 'CHANGE THE ASSUMPTIONS. CHANGE THE ANSWER.', tMorph);
      }
      if (footerSub) {
        footerSub.textContent = scrambleText('Expectations, information, liquidity, risk, time, supply and demand converge into price.', 'Revenue, growth, cash flow, time and risk all shape value.', tMorph);
      }

      if (priceEl) priceEl.textContent = '102.41';

      const cardOpacity = Math.max(0, 1 - tMorph * 1.8).toFixed(2);
      if (bookCard) {
        bookCard.style.opacity = cardOpacity;
      }
      if (s5Assembly) {
        s5Assembly.style.opacity = cardOpacity;
      }
    }
  });

  // Scene 6: Value (0.65 - 0.77) -> DCF waterfall model and in-place morph into Scene 7
  applySceneTransition('#aee-scene-6', (localP) => {
    const eyebrow = q(container, '#aee-s6-eyebrow');
    const headline = q(container, '#aee-s6-headline');
    const footerTitle = q(container, '#aee-s6-footer-title');
    const footerSub = q(container, '#aee-s6-footer-sub');
    const gridMatrix = q(container, '#aee-s6-grid');
    const editorialElements = container.querySelectorAll ? qAll(container, '#aee-scene-6 .aee-scene-editorial') : [];

    if (p < 0.675) {
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
        });
      }
      if (gridMatrix) {
        gridMatrix.style.opacity = clamp((p - 0.65) / 0.02, 0, 1).toFixed(2);
      }
    } else if (p < 0.745) {
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.style.transform = 'none';
        });
      }
      if (eyebrow) eyebrow.textContent = 'ACT V / THE ANATOMY OF VALUE';
      if (headline) headline.textContent = 'VALUE IS A MODEL.';
      if (footerTitle) footerTitle.textContent = 'CHANGE THE ASSUMPTIONS. CHANGE THE ANSWER.';
      if (footerSub) footerSub.textContent = 'Revenue, growth, cash flow, time and risk all shape value.';
      if (gridMatrix) {
        gridMatrix.style.transform = 'none';
        gridMatrix.style.opacity = '1';
      }
    }

    // -------------------------------------------------------------
    // SCENE 6 DYNAMIC VALUATION & SENSITIVITY RESPONSIVENESS
    // -------------------------------------------------------------
    const sVal = clamp((p - 0.675) / 0.070, 0, 1);

    // 1. Terminal Growth Sensitivity (Card 1)
    const growthTracer = q(container, '#aee-s6-growth-tracer');
    const growthProjX = q(container, '#aee-s6-growth-proj-x');
    const growthProjY = q(container, '#aee-s6-growth-proj-y');
    const growthBadge = q(container, '#aee-s6-growth-badge');
    const growthReadout = q(container, '#aee-s6-growth-readout');

    if (growthTracer) {
      if (!isReduced) {
        const gx = 150 - sVal * 85;
        const gy = 22 + Math.pow(sVal, 0.9) * 30;
        growthTracer.setAttribute('cx', gx.toFixed(1));
        growthTracer.setAttribute('cy', gy.toFixed(1));
        if (growthProjX) {
          growthProjX.setAttribute('x1', gx.toFixed(1));
          growthProjX.setAttribute('y1', gy.toFixed(1));
          growthProjX.setAttribute('x2', gx.toFixed(1));
          growthProjX.setAttribute('y2', '72');
        }
        if (growthProjY) {
          growthProjY.setAttribute('x1', '30');
          growthProjY.setAttribute('y1', gy.toFixed(1));
          growthProjY.setAttribute('x2', gx.toFixed(1));
          growthProjY.setAttribute('y2', gy.toFixed(1));
        }
        if (growthBadge) {
          const bps = Math.round(sVal * 300);
          growthBadge.textContent = bps > 0 ? `Δg: -${bps} BPS` : 'Δg: 0 BPS';
        }
        if (growthReadout) {
          const curG = (8.0 - sVal * 3.0).toFixed(1);
          const mult = (18.4 - sVal * 6.3).toFixed(1);
          growthReadout.textContent = `${curG}% g · ${mult}x`;
        }
      } else {
        growthTracer.setAttribute('cx', '107.5');
        growthTracer.setAttribute('cy', '37.0');
        if (growthBadge) growthBadge.textContent = 'Δg: -150 BPS';
        if (growthReadout) growthReadout.textContent = '6.5% g · 15.2x';
      }
    }

    // 2. Cash Flow Waterfall Cascade Tiers (Card 2)
    const tiers = [
      q(container, '#aee-s6-tier-1'),
      q(container, '#aee-s6-tier-2'),
      q(container, '#aee-s6-tier-3'),
      q(container, '#aee-s6-tier-4')
    ];
    const tierThresholds = [0.05, 0.30, 0.55, 0.80];
    tiers.forEach((tierEl, idx) => {
      if (tierEl) {
        const isActive = !isReduced ? (sVal >= tierThresholds[idx]) : true;
        tierEl.style.opacity = isActive ? '1' : '0.45';
        if (isActive && !isReduced && sVal >= tierThresholds[idx] && sVal < tierThresholds[idx] + 0.25) {
          tierEl.style.borderColor = 'rgba(255, 255, 255, 0.4)';
        } else {
          tierEl.style.borderColor = '';
        }
      }
    });

    // 3. Cost of Capital Discount Rate Sensitivity (Card 3)
    const rateTracer = q(container, '#aee-s6-rate-tracer');
    const rateProjX = q(container, '#aee-s6-rate-proj-x');
    const rateProjY = q(container, '#aee-s6-rate-proj-y');
    const rateBadge = q(container, '#aee-s6-rate-badge');
    const rateReadout = q(container, '#aee-s6-rate-readout');

    if (rateTracer) {
      if (!isReduced) {
        const rx = 55 + sVal * 95;
        const ry = 22 + Math.pow(sVal, 0.85) * 36;
        rateTracer.setAttribute('cx', rx.toFixed(1));
        rateTracer.setAttribute('cy', ry.toFixed(1));
        if (rateProjX) {
          rateProjX.setAttribute('x1', rx.toFixed(1));
          rateProjX.setAttribute('y1', ry.toFixed(1));
          rateProjX.setAttribute('x2', rx.toFixed(1));
          rateProjX.setAttribute('y2', '72');
        }
        if (rateProjY) {
          rateProjY.setAttribute('x1', '30');
          rateProjY.setAttribute('y1', ry.toFixed(1));
          rateProjY.setAttribute('x2', rx.toFixed(1));
          rateProjY.setAttribute('y2', ry.toFixed(1));
        }
        if (rateBadge) {
          const bpsR = Math.round(sVal * 200);
          rateBadge.textContent = bpsR > 0 ? `Δr: +${bpsR} BPS` : 'Δr: 0 BPS';
        }
        if (rateReadout) {
          const curPrice = (102.41 - sVal * 34.14).toFixed(2);
          const pct = Math.round(sVal * 33.3);
          rateReadout.textContent = `$${curPrice} (-${pct}%)`;
        }
      } else {
        rateTracer.setAttribute('cx', '102.5');
        rateTracer.setAttribute('cy', '40.0');
        if (rateBadge) rateBadge.textContent = 'Δr: +100 BPS';
        if (rateReadout) rateReadout.textContent = '$85.34 (-17%)';
      }
    }

    if (p >= 0.745) {
      // In-Place Physical Morph into Scene 7 (p in [0.745, 0.795])
      const tMorph = clamp((p - 0.745) / 0.05, 0, 1);

      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }

      if (eyebrow) {
        eyebrow.textContent = scrambleText('ACT V / THE ANATOMY OF VALUE', 'ACT VI / NAVIGATING UNCERTAINTY', tMorph);
      }
      if (headline) {
        headline.textContent = scrambleText('VALUE IS A MODEL.', 'UNCERTAINTY CAN BE MEASURED.', tMorph);
      }
      if (footerTitle) {
        footerTitle.textContent = scrambleText('CHANGE THE ASSUMPTIONS. CHANGE THE ANSWER.', 'RISK CAN BE PRICED. RISK CAN BE TRANSFERRED.', tMorph);
      }
      if (footerSub) {
        footerSub.textContent = scrambleText('Revenue, growth, cash flow, time and risk all shape value.', 'Returns, volatility and exposure shape the way financial risk is understood.', tMorph);
      }

      if (gridMatrix) {
        const gridOp = Math.max(0, 1 - tMorph * 1.8);
        gridMatrix.style.opacity = gridOp.toFixed(2);
      }
    }
  });

  // Scene 7: Risk (0.77 - 0.88) -> Dynamic Stochastic Paths, Gaussian Bell Curve, and Option Payoff
  applySceneTransition('#aee-scene-7', (localP) => {
    const eyebrow = q(container, '#aee-s7-eyebrow');
    const headline = q(container, '#aee-s7-headline');
    const footerTitle = q(container, '#aee-s7-footer-title');
    const footerSub = q(container, '#aee-s7-footer-sub');
    const matrixGrid = q(container, '#aee-s7-grid');
    const editorialElements = container.querySelectorAll ? qAll(container, '#aee-scene-7 .aee-scene-editorial') : [];

    // Local normalized scroll progress for Scene 7 presentation (p in [0.765, 0.865])
    const s = clamp((p - 0.765) / 0.095, 0, 1);

    // -------------------------------------------------------------
    // GRAPH 1: STOCHASTIC FAN PATHS DYNAMICS
    // -------------------------------------------------------------
    const timeCursor = q(container, '#aee-s7-time-cursor');
    const timeReadout = q(container, '#aee-s7-time-readout');
    const paths = [
      q(container, '#aee-s7-path-0'),
      q(container, '#aee-s7-path-1'),
      q(container, '#aee-s7-path-2'),
      q(container, '#aee-s7-path-3'),
      q(container, '#aee-s7-path-4')
    ];
    const tracers = [
      q(container, '#aee-s7-tracer-0'),
      q(container, '#aee-s7-tracer-1'),
      q(container, '#aee-s7-tracer-2'),
      q(container, '#aee-s7-tracer-3'),
      q(container, '#aee-s7-tracer-4')
    ];

    if (!isReduced) {
      // 1. Unfurl paths across time using strokeDashoffset
      paths.forEach((pathEl, idx) => {
        if (pathEl) {
          const pathLag = idx * 0.04;
          const pathT = clamp((s - pathLag) / (1 - pathLag), 0, 1);
          const dashOffset = (1 - pathT) * 100;
          pathEl.style.strokeDasharray = '100';
          pathEl.style.strokeDashoffset = `${dashOffset.toFixed(2)}`;
          pathEl.style.opacity = (0.3 + pathT * 0.7).toFixed(2);
        }
      });

      // 2. Time cursor sweeps from Year 0 (x=30) to Year 5 (x=190)
      const cursorX = 30 + s * 160;
      if (timeCursor) {
        timeCursor.setAttribute('x1', cursorX.toFixed(1));
        timeCursor.setAttribute('x2', cursorX.toFixed(1));
        timeCursor.style.opacity = (s > 0.01 && s < 0.99) ? '0.7' : '0.2';
      }

      // 3. Time readout update
      if (timeReadout) {
        timeReadout.textContent = `T: ${(s * 5.0).toFixed(1)}Y`;
      }

      // 4. Kinetic tracer dots along path tips
      const yTargets = [20, 38, 55, 70, 102];
      const powers = [0.85, 0.9, 1.0, 1.1, 0.85];
      tracers.forEach((tracerEl, idx) => {
        if (tracerEl) {
          const pathLag = idx * 0.04;
          const pathT = clamp((s - pathLag) / (1 - pathLag), 0, 1);
          const currentX = 30 + pathT * 160;
          const currentY = 62 + (yTargets[idx] - 62) * Math.pow(pathT, powers[idx]);
          tracerEl.setAttribute('cx', currentX.toFixed(1));
          tracerEl.setAttribute('cy', currentY.toFixed(1));
          tracerEl.style.opacity = pathT > 0.02 ? '1' : '0';
        }
      });
    } else {
      // Reduced motion: resting equilibrium
      paths.forEach((pathEl) => {
        if (pathEl) {
          pathEl.style.strokeDasharray = 'none';
          pathEl.style.strokeDashoffset = '0';
          pathEl.style.opacity = '1';
        }
      });
      if (timeCursor) {
        timeCursor.setAttribute('x1', '110');
        timeCursor.setAttribute('x2', '110');
        timeCursor.style.opacity = '0.5';
      }
      if (timeReadout) timeReadout.textContent = 'T: 2.5Y';
      const yMid = [35, 45, 60, 75, 90];
      tracers.forEach((tracerEl, idx) => {
        if (tracerEl) {
          tracerEl.setAttribute('cx', '110');
          tracerEl.setAttribute('cy', `${yMid[idx]}`);
          tracerEl.style.opacity = '1';
        }
      });
    }

    // -------------------------------------------------------------
    // GRAPH 2: GAUSSIAN NORMAL DISTRIBUTION DYNAMICS
    // -------------------------------------------------------------
    const bellCurve = q(container, '#aee-s7-bell-curve');
    const bellFill = q(container, '#aee-s7-bell-fill');
    const bellCI = q(container, '#aee-s7-bell-ci');
    const bellMedian = q(container, '#aee-s7-bell-median');
    const bellPeak = q(container, '#aee-s7-bell-peak');
    const bellMetric = q(container, '#aee-s7-bell-metric');

    if (!isReduced) {
      // Volatility expansion over time: peak broadens, spread widens
      const peakY = 12 + s * 12; // from y=12 (tall peak) to y=24 (wider distribution)
      const spreadX = 24 + s * 22; // from 24 to 46
      const curveD = `M 20 75 Q ${100 - spreadX} 75 ${100 - spreadX * 0.35} ${peakY + (75 - peakY) * 0.3} Q 100 ${peakY} 100 ${peakY} Q ${100 + spreadX * 0.35} ${peakY + (75 - peakY) * 0.3} ${100 + spreadX} 75 L 180 75`;
      const fillD = `M 20 75 Q ${100 - spreadX} 75 ${100 - spreadX * 0.35} ${peakY + (75 - peakY) * 0.3} Q 100 ${peakY} 100 ${peakY} Q ${100 + spreadX * 0.35} ${peakY + (75 - peakY) * 0.3} ${100 + spreadX} 75 L 180 75 Z`;

      // Confidence Interval shaded band (68% to 95%)
      const ciSpread = 16 + s * 28;
      const ciD = `M ${100 - ciSpread} 75 Q ${100 - ciSpread * 0.4} ${(peakY + 12).toFixed(1)} 100 ${peakY.toFixed(1)} Q ${100 + ciSpread * 0.4} ${(peakY + 12).toFixed(1)} ${100 + ciSpread} 75 Z`;

      if (bellCurve) bellCurve.setAttribute('d', curveD);
      if (bellFill) bellFill.setAttribute('d', fillD);
      if (bellCI) bellCI.setAttribute('d', ciD);
      if (bellMedian) bellMedian.setAttribute('y1', peakY.toFixed(1));
      if (bellPeak) bellPeak.setAttribute('cy', peakY.toFixed(1));

      if (bellMetric) {
        const vol = (12.0 + s * 8.5).toFixed(1);
        const conf = (68.2 + s * 27.2).toFixed(1);
        bellMetric.textContent = `σ: ${vol}% · CONF: ${conf}%`;
      }
    } else {
      if (bellCurve) bellCurve.setAttribute('d', 'M 20 75 Q 70 75 100 18 Q 130 75 180 75');
      if (bellFill) bellFill.setAttribute('d', 'M 20 75 Q 70 75 100 18 Q 130 75 180 75 Z');
      if (bellCI) bellCI.setAttribute('d', 'M 70 75 Q 85 75 100 18 Q 115 75 130 75 Z');
      if (bellMedian) bellMedian.setAttribute('y1', '18');
      if (bellPeak) bellPeak.setAttribute('cy', '18');
      if (bellMetric) bellMetric.textContent = 'σ: 16.2% · CONF: 81.8%';
    }

    // -------------------------------------------------------------
    // GRAPH 3: CALL OPTION PAYOFF & GREEKS DYNAMICS
    // -------------------------------------------------------------
    const assetDot = q(container, '#aee-s7-asset-dot');
    const projX = q(container, '#aee-s7-proj-x');
    const projY = q(container, '#aee-s7-proj-y');
    const bsCurve = q(container, '#aee-s7-bs-curve');
    const optionReadout = q(container, '#aee-s7-option-readout');

    if (!isReduced) {
      // Underlying asset price advances from $70 (x=45) through $100 Strike (x=90) to $140 (x=146)
      const assetX = 45 + s * 101;
      let assetY = 65;
      if (assetX > 90) {
        assetY = 65 - (assetX - 90) * (50 / 70);
      }

      if (assetDot) {
        assetDot.setAttribute('cx', assetX.toFixed(1));
        assetDot.setAttribute('cy', assetY.toFixed(1));
      }

      if (projX) {
        projX.setAttribute('x1', assetX.toFixed(1));
        projX.setAttribute('y1', assetY.toFixed(1));
        projX.setAttribute('x2', assetX.toFixed(1));
        projX.setAttribute('y2', '65');
        projX.style.opacity = '0.5';
      }

      if (projY) {
        if (assetX > 90) {
          projY.setAttribute('x1', '20');
          projY.setAttribute('y1', assetY.toFixed(1));
          projY.setAttribute('x2', assetX.toFixed(1));
          projY.setAttribute('y2', assetY.toFixed(1));
          projY.style.opacity = '0.6';
        } else {
          projY.style.opacity = '0';
        }
      }

      // Pre-expiration Black-Scholes curve tightens down to intrinsic hockey stick as time decay occurs
      if (bsCurve) {
        const timeSlack = (1 - s) * 14;
        bsCurve.setAttribute('d', `M 20 ${65 - timeSlack * 0.15} Q 70 ${65 - timeSlack * 0.7} 90 ${51 - timeSlack} T 160 15`);
        bsCurve.style.opacity = (0.2 + (1 - s) * 0.5).toFixed(2);
      }

      if (optionReadout) {
        const displayPrice = Math.round(70 + s * 70);
        const displayPayoff = Math.max(0, displayPrice - 100);
        optionReadout.textContent = `S: $${displayPrice} · CALL: ${displayPayoff > 0 ? '+$' + displayPayoff : '$0'}`;
      }
    } else {
      if (assetDot) {
        assetDot.setAttribute('cx', '125');
        assetDot.setAttribute('cy', '40');
      }
      if (projX) {
        projX.setAttribute('x1', '125');
        projX.setAttribute('y1', '40');
        projX.setAttribute('x2', '125');
        projX.setAttribute('y2', '65');
        projX.style.opacity = '0.5';
      }
      if (projY) {
        projY.setAttribute('x1', '20');
        projY.setAttribute('y1', '40');
        projY.setAttribute('x2', '125');
        projY.setAttribute('y2', '40');
        projY.style.opacity = '0.5';
      }
      if (bsCurve) {
        bsCurve.setAttribute('d', 'M 20 62 Q 70 58 90 44 T 160 15');
        bsCurve.style.opacity = '0.4';
      }
      if (optionReadout) optionReadout.textContent = 'S: $125 · CALL: +$25';
    }

    // Editorial text & Morph transitions
    if (p < 0.795) {
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
        });
      }
      if (matrixGrid) {
        matrixGrid.style.opacity = clamp((p - 0.77) / 0.02, 0, 1).toFixed(2);
      }
    } else if (p < 0.855) {
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.style.transform = 'none';
        });
      }
      if (eyebrow) eyebrow.textContent = 'ACT VI / NAVIGATING UNCERTAINTY';
      if (headline) headline.textContent = 'UNCERTAINTY CAN BE MEASURED.';
      if (footerTitle) footerTitle.textContent = 'RISK CAN BE PRICED. RISK CAN BE TRANSFERRED.';
      if (footerSub) footerSub.textContent = 'Returns, volatility and exposure shape the way financial risk is understood.';

      if (matrixGrid) {
        matrixGrid.style.transform = 'none';
        matrixGrid.style.opacity = '1';
      }
    } else {
      // In-Place Physical Morph into Scene 8 (p in [0.855, 0.905])
      const tMorph = clamp((p - 0.855) / 0.05, 0, 1);

      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      }

      if (eyebrow) {
        eyebrow.textContent = scrambleText('ACT VI / NAVIGATING UNCERTAINTY', 'ACT VII / THE COMPLETE ARCHITECTURE', tMorph);
      }
      if (headline) {
        headline.textContent = scrambleText('UNCERTAINTY CAN BE MEASURED.', 'UNDERSTAND THE FINANCIAL WORLD.', tMorph);
      }
      if (footerTitle) {
        footerTitle.textContent = scrambleText('RISK CAN BE PRICED. RISK CAN BE TRANSFERRED.', 'ALL ELSE EQUAL', tMorph);
      }
      if (footerSub) {
        footerSub.textContent = scrambleText('Returns, volatility and exposure shape the way financial risk is understood.', 'Understand what changes when one thing does.', tMorph);
      }

      if (matrixGrid) {
        const matOp = Math.max(0, 1 - tMorph * 1.8);
        matrixGrid.style.opacity = matOp.toFixed(2);
      }
    }
  });

  // Scene 8: The Financial World (0.88 - 1.00) -> The unified curriculum atlas
  applySceneTransition('#aee-scene-8', (localP) => {
    const eyebrow = q(container, '#aee-s8-eyebrow');
    const headline = q(container, '#aee-s8-headline');
    const editorialElements = container.querySelectorAll ? qAll(container, '#aee-scene-8 .aee-scene-editorial') : [];
    const curriculumCard = q(container, '#aee-s8-curriculum-card');

    if (p < 0.905) {
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
        });
      }
      if (curriculumCard) {
        const enterT = clamp((p - 0.855) / 0.045, 0, 1);
        curriculumCard.style.opacity = enterT.toFixed(2);
        curriculumCard.style.transform = `scale(${(0.95 + enterT * 0.05).toFixed(3)})`;
      }
    } else {
      if (editorialElements && editorialElements.length) {
        editorialElements.forEach(el => {
          el.style.opacity = '1';
          el.style.visibility = 'visible';
          el.style.transform = 'none';
        });
      }
      if (curriculumCard) {
        curriculumCard.style.opacity = '1';
        curriculumCard.style.transform = 'none';
      }
      if (eyebrow) eyebrow.textContent = 'ACT VII / THE COMPLETE ARCHITECTURE';
      if (headline) headline.textContent = 'UNDERSTAND THE FINANCIAL WORLD.';
    }
  });

  // 3. Update the 7 Persistent Morphing Threads (Continuous Causal Hand-Offs)
  // Preserved for DOM test hooks; all intermediate threads are display: none in CSS
  // to ensure actual elements morph into each other directly with zero intermediate clutter.
  const updateMorphThreads = () => {
    const thread12 = q(container, '#aee-thread-1-2');
    const thread23 = q(container, '#aee-thread-2-3');
    const thread34 = q(container, '#aee-thread-3-4');
    const thread45 = q(container, '#aee-thread-4-5');
    const thread56 = q(container, '#aee-thread-5-6');
    const thread67 = q(container, '#aee-thread-6-7');
    const thread78 = q(container, '#aee-thread-7-8');

    const hideThread = (el) => {
      if (el) {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
      }
    };

    if (isReduced) {
      [thread12, thread23, thread34, thread45, thread56, thread67, thread78].forEach(hideThread);
      return;
    }

    // Thread 1->2: != morphs into 10Y baseline and bond curve [0.095, 0.145]
    if (thread12) {
      if (p >= 0.095 && p <= 0.145) {
        const t = (p - 0.095) / 0.05;
        thread12.style.visibility = 'visible';
        thread12.style.opacity = (Math.sin(t * Math.PI) * 0.95).toFixed(3);
        const axisX = q(container, '#aee-t12-axis-x');
        if (axisX && typeof axisX.setAttribute === 'function') {
          axisX.setAttribute('x1', String((260 - t * 180).toFixed(1)));
          axisX.setAttribute('x2', String((340 + t * 180).toFixed(1)));
          axisX.setAttribute('y1', String((100 + t * 70).toFixed(1)));
          axisX.setAttribute('y2', String((100 + t * 70).toFixed(1)));
        }
        const axisY = q(container, '#aee-t12-axis-y');
        if (axisY && typeof axisY.setAttribute === 'function') {
          axisY.setAttribute('x1', String((260 - t * 180).toFixed(1)));
          axisY.setAttribute('y1', String((90 - t * 70).toFixed(1)));
          axisY.setAttribute('x2', String((340 - t * 260).toFixed(1)));
          axisY.setAttribute('y2', String((90 + t * 80).toFixed(1)));
        }
        const slash = q(container, '#aee-t12-slash');
        if (slash && typeof slash.setAttribute === 'function') {
          slash.setAttribute('x1', String((315 - t * 215).toFixed(1)));
          slash.setAttribute('y1', String((80 + t * 4).toFixed(1)));
          slash.setAttribute('x2', String((285 - t * 185).toFixed(1)));
          slash.setAttribute('y2', String((110 - t * 26).toFixed(1)));
        }
        const curveLead = q(container, '#aee-t12-curve');
        if (curveLead && curveLead.style) {
          curveLead.style.strokeDashoffset = String((1 - t) * 500);
        }
      } else {
        hideThread(thread12);
      }
    }

    // Thread 2->3: $92.28 apex zooms and blooms into root [0.225, 0.275]
    if (thread23) {
      if (p >= 0.225 && p <= 0.275) {
        const t = (p - 0.225) / 0.05;
        thread23.style.visibility = 'visible';
        thread23.style.opacity = (Math.sin(t * Math.PI)).toFixed(3);
        const anchor = q(container, '#aee-t23-apex-anchor');
        if (anchor && anchor.style) {
          const tx = (1 - t) * 120;
          const ty = (1 - t) * 28;
          anchor.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0px)`;
        }
        const pulse = q(container, '#aee-t23-pulse');
        if (pulse && pulse.style) {
          const s = (1 + t * 2.2).toFixed(2);
          pulse.style.transform = `scale(${s})`;
        }
        const priceTag = q(container, '#aee-t23-price-tag');
        if (priceTag && priceTag.style) {
          priceTag.style.opacity = clamp(1 - t * 2, 0, 1).toFixed(2);
        }
        const label = q(container, '#aee-t23-label');
        if (label && label.style) {
          label.style.opacity = clamp((t - 0.2) * 1.5, 0, 1).toFixed(2);
        }
      } else {
        hideThread(thread23);
      }
    }

    // Thread 3->4: Terminal nodes orbit into 6 institutional sectors [0.355, 0.405]
    if (thread34) {
      if (p >= 0.355 && p <= 0.405) {
        const t = (p - 0.355) / 0.05;
        thread34.style.visibility = 'visible';
        thread34.style.opacity = (Math.sin(t * Math.PI)).toFixed(3);
        const targets = [
          { id: '#aee-t34-node-1', sx: 171, sy: 101, ex: 132, ey: 74 },
          { id: '#aee-t34-node-2', sx: 512, sy: 101, ex: 481, ey: 74 },
          { id: '#aee-t34-node-3', sx: 853, sy: 101, ex: 795, ey: 74 },
          { id: '#aee-t34-node-4', sx: 512, sy: 202, ex: 417, ey: 195 },
          { id: '#aee-t34-node-5', sx: 853, sy: 202, ex: 802, ey: 195 },
          { id: '#aee-t34-node-6', sx: 512, sy: 304, ex: 543, ey: 333.5 }
        ];
        targets.forEach(tgt => {
          const node = q(container, tgt.id);
          if (node && typeof node.setAttribute === 'function') {
            const cx = tgt.sx + (tgt.ex - tgt.sx) * t;
            const cy = tgt.sy + (tgt.ey - tgt.sy) * t;
            node.setAttribute('cx', cx.toFixed(1));
            node.setAttribute('cy', cy.toFixed(1));
          }
        });
      } else {
        hideThread(thread34);
      }
    }

    // Thread 4->5: Vortex dive into horizontal clearing line [0.495, 0.545]
    if (thread45) {
      if (p >= 0.495 && p <= 0.545) {
        const t = (p - 0.495) / 0.05;
        thread45.style.visibility = 'visible';
        thread45.style.opacity = (Math.sin(t * Math.PI)).toFixed(3);
        const vortex = q(container, '#aee-t45-vortex');
        if (vortex && typeof vortex.setAttribute === 'function') {
          vortex.setAttribute('rx', String((160 + t * 40).toFixed(1)));
          vortex.setAttribute('ry', String(Math.max(2, 100 * (1 - t)).toFixed(1)));
        }
        const lead = q(container, '#aee-t45-clearing-lead');
        if (lead && lead.style) {
          lead.style.transform = `scaleX(${(1 + t * 0.5).toFixed(2)})`;
          lead.style.transformOrigin = 'center';
          lead.style.opacity = clamp((t - 0.25) * 1.6, 0, 1).toFixed(2);
        }
      } else {
        hideThread(thread45);
      }
    }

    // Thread 5->6: Clearing line elongates into DCF baseline and vertical waterfall [0.625, 0.675]
    if (thread56) {
      if (p >= 0.625 && p <= 0.675) {
        const t = (p - 0.625) / 0.05;
        thread56.style.visibility = 'visible';
        thread56.style.opacity = (Math.sin(t * Math.PI)).toFixed(3);
        const timeline = q(container, '#aee-t56-timeline');
        if (timeline && typeof timeline.setAttribute === 'function') {
          timeline.setAttribute('x1', String((180 - t * 80).toFixed(1)));
          timeline.setAttribute('x2', String((420 + t * 80).toFixed(1)));
        }
        const wfTargets = [
          { id: '#aee-t56-wf-1', h: 35 },
          { id: '#aee-t56-wf-2', h: 45 },
          { id: '#aee-t56-wf-3', h: 55 },
          { id: '#aee-t56-wf-4', h: 65 },
          { id: '#aee-t56-wf-5', h: 75 },
          { id: '#aee-t56-wf-tv', h: 100 }
        ];
        wfTargets.forEach(tgt => {
          const bar = q(container, tgt.id);
          if (bar && typeof bar.setAttribute === 'function') {
            const y2 = 130 - t * tgt.h;
            bar.setAttribute('y2', y2.toFixed(1));
          }
        });
      } else {
        hideThread(thread56);
      }
    }

    // Thread 6->7: Vibrating terminal value bar shatters into stochastic paths [0.745, 0.795]
    if (thread67) {
      if (p >= 0.745 && p <= 0.795) {
        const t = (p - 0.745) / 0.05;
        thread67.style.visibility = 'visible';
        thread67.style.opacity = (Math.sin(t * Math.PI)).toFixed(3);
        const jitter = Math.sin(t * 36) * (1 - t) * 4;
        const origin = q(container, '#aee-t67-origin');
        if (origin && typeof origin.setAttribute === 'function') {
          origin.setAttribute('cx', String((60 + jitter).toFixed(1)));
        }
        const tvBar = q(container, '#aee-t67-tv-bar');
        const tvLabel = q(container, '#aee-t67-tv-label');
        if (tvBar && typeof tvBar.setAttribute === 'function') {
          const barY2 = 25 + Math.sin(t * 42) * (1 - t) * 14;
          tvBar.setAttribute('x1', String((60 + jitter).toFixed(1)));
          tvBar.setAttribute('x2', String((60 + jitter).toFixed(1)));
          tvBar.setAttribute('y2', barY2.toFixed(1));
          tvBar.style.opacity = clamp(1 - t * 1.6, 0, 1).toFixed(2);
        }
        if (tvLabel && tvLabel.style) {
          tvLabel.style.opacity = clamp(1 - t * 2.2, 0, 1).toFixed(2);
        }
        const fanTargets = [
          { id: '#aee-t67-path-1', endY: 30, qY: 70 },
          { id: '#aee-t67-path-2', endY: 65, qY: 85 },
          { id: '#aee-t67-path-3', endY: 100, qY: 100 },
          { id: '#aee-t67-path-4', endY: 135, qY: 115 },
          { id: '#aee-t67-path-5', endY: 170, qY: 130 }
        ];
        fanTargets.forEach(tgt => {
          const path = q(container, tgt.id);
          if (path && typeof path.setAttribute === 'function') {
            const currentEndY = 100 + (tgt.endY - 100) * t;
            const currentQY = 100 + (tgt.qY - 100) * t;
            path.setAttribute('d', `M 60 100 Q 140 ${currentQY.toFixed(1)} 240 ${currentEndY.toFixed(1)}`);
            path.style.opacity = clamp((t - 0.15) * 1.4, 0, 1).toFixed(2);
          }
        });
      } else {
        hideThread(thread67);
      }
    }

    // Thread 7->8: Reverse-dolly zoom straightening stochastic paths into Cartesian grid [0.855, 0.905]
    if (thread78) {
      if (p >= 0.855 && p <= 0.905) {
        const t = (p - 0.855) / 0.05;
        thread78.style.visibility = 'visible';
        thread78.style.opacity = (Math.sin(t * Math.PI)).toFixed(3);
        
        const pTop = q(container, '#aee-t78-path-top');
        const pMid = q(container, '#aee-t78-path-mid');
        const pBot = q(container, '#aee-t78-path-bot');
        
        if (pTop && typeof pTop.setAttribute === 'function') {
          const startY = 120 - t * 80;
          const qY = 40 - (1 - t) * 35;
          pTop.setAttribute('d', `M 50 ${startY.toFixed(1)} Q 200 ${qY.toFixed(1)} 550 40`);
        }
        if (pMid && typeof pMid.setAttribute === 'function') {
          const wave = Math.sin((1 - t) * Math.PI * 2) * 15 * (1 - t);
          pMid.setAttribute('d', `M 50 120 Q 300 ${(120 + wave).toFixed(1)} 550 120`);
        }
        if (pBot && typeof pBot.setAttribute === 'function') {
          const startY = 120 + t * 80;
          const qY = 200 + (1 - t) * 35;
          pBot.setAttribute('d', `M 50 ${startY.toFixed(1)} Q 200 ${qY.toFixed(1)} 550 200`);
        }

        const v1 = q(container, '#aee-t78-v1');
        const v2 = q(container, '#aee-t78-v2');
        if (v1 && typeof v1.setAttribute === 'function') {
          const y2 = 40 + t * 160;
          v1.setAttribute('y2', y2.toFixed(1));
          if (v1.style) v1.style.opacity = t.toFixed(2);
        }
        if (v2 && typeof v2.setAttribute === 'function') {
          const y2 = 40 + t * 160;
          v2.setAttribute('y2', y2.toFixed(1));
          if (v2.style) v2.style.opacity = t.toFixed(2);
        }
      } else {
        hideThread(thread78);
      }
    }
  };

  updateMorphThreads();

  // Corner micro-tags visibility (Fade out as we reach the bottom of the cinematic stage)
  const tags = qAll(container, '.aee-corner-tag');
  if (tags && tags.length) {
    tags.forEach(tag => {
      if (p > 0.92) {
        tag.style.opacity = `${clamp((1 - p) / 0.08, 0, 1)}`;
      } else {
        tag.style.opacity = '1';
      }
    });
  }
}
