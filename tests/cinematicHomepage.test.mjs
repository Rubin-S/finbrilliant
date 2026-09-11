import test from 'node:test';
import assert from 'node:assert';
import {
  SCENE_BOUNDS,
  clamp,
  remap,
  getRangeProgress,
  getActiveScene,
  bindCinematicScroller
} from '../src/utils/cinematicScroller.js';
import {
  renderCinematicHero,
  updateCinematicHero,
  setupMetabolismInteractions
} from '../src/components/CinematicHero.js';
import { getCinematicHeroMarkup } from '../src/components/hero/scenesMarkup.js';
import { renderHomePage } from '../src/components/HomePage.js';
import { calculateBondPrice, calculateDCF, blackScholes } from '../src/engines/financeMath.js';

// Minimal Node DOM simulator for headless component verification
class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.attributes = {};
    this.style = {};
    this.children = [];
    this.classList = {
      _classes: new Set(),
      add: (...cls) => cls.forEach(c => this.classList._classes.add(c)),
      remove: (...cls) => cls.forEach(c => this.classList._classes.delete(c)),
      contains: (c) => this.classList._classes.has(c)
    };
    this.eventListeners = {};
    this.textContent = '';
    this.innerHTML = '';
  }

  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k] || null; }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (!this.eventListeners[event]) return;
    this.eventListeners[event] = this.eventListeners[event].filter(fn => fn !== handler);
  }

  dispatchEvent(event) {
    const list = this.eventListeners[event.type || event] || [];
    list.forEach(fn => fn(event));
  }

  querySelector(selector) {
    return this._findChild(this, selector);
  }

  querySelectorAll(selector) {
    const results = [];
    this._findAllChildren(this, selector, results);
    return results;
  }

  getBoundingClientRect() {
    return { top: 0, bottom: 8000, height: 8000, width: 1440 };
  }

  scrollIntoView() {}

  _findChild(node, selector) {
    if (this._matches(node, selector)) return node;
    for (const child of node.children || []) {
      const found = this._findChild(child, selector);
      if (found) return found;
    }
    return null;
  }

  _findAllChildren(node, selector, list) {
    if (this._matches(node, selector)) list.push(node);
    for (const child of node.children || []) {
      this._findAllChildren(child, selector, list);
    }
  }

  _matches(node, selector) {
    if (!node || !selector) return false;
    if (selector.startsWith('#')) return node.attributes?.id === selector.slice(1);
    if (selector.startsWith('.')) return node.classList?.contains(selector.slice(1));
    return node.tagName?.toLowerCase() === selector.toLowerCase();
  }
}

// Simple HTML-to-DOM parser mock for extracting key IDs and classes
function parseMockHTML(htmlString) {
  const root = new MockElement('div');
  root.innerHTML = htmlString;

  // Extract ID matches
  const idMatches = [...htmlString.matchAll(/id=["']([^"']+)["']/g)];
  idMatches.forEach(m => {
    const el = new MockElement('div');
    el.setAttribute('id', m[1]);
    root.children.push(el);
  });

  // Extract Corner tag classes
  const tagMatches = [...htmlString.matchAll(/class=["'][^"']*?(aee-corner-tag)[^"']*?["']/g)];
  tagMatches.forEach(() => {
    const el = new MockElement('div');
    el.classList.add('aee-corner-tag');
    root.children.push(el);
  });

  return root;
}

test('cinematicScroller maps math and scene ranges accurately', () => {
  assert.strictEqual(clamp(1.5, 0, 1), 1.0);
  assert.strictEqual(clamp(-0.2, 0, 1), 0.0);
  assert.strictEqual(clamp(0.42, 0, 1), 0.42);

  assert.strictEqual(remap(5, 0, 10, 0, 100), 50);
  assert.strictEqual(remap(0, 0, 10, 20, 80), 20);

  assert.strictEqual(getRangeProgress(0.06, 0.00, 0.12), 0.5);
  assert.strictEqual(getRangeProgress(0.00, 0.12, 0.25), 0.0);
  assert.strictEqual(getRangeProgress(0.30, 0.12, 0.25), 1.0);

  assert.strictEqual(getActiveScene(0.05).id, 'change');
  assert.strictEqual(getActiveScene(0.18).id, 'first-effect');
  assert.strictEqual(getActiveScene(0.30).id, 'second-order');
  assert.strictEqual(getActiveScene(0.45).id, 'system');
  assert.strictEqual(getActiveScene(0.58).id, 'price');
  assert.strictEqual(getActiveScene(0.70).id, 'value');
  assert.strictEqual(getActiveScene(0.82).id, 'risk');
  assert.strictEqual(getActiveScene(0.95).id, 'world');

  // SSR safety
  const unsubscribe = bindCinematicScroller(null, () => {});
  assert.strictEqual(typeof unsubscribe, 'function');
  unsubscribe();
});

test('renderCinematicHero produces all 8 scene layers and corner framing elements', () => {
  const container = new MockElement('div');
  const hero = renderCinematicHero(container);

  assert.ok(container.innerHTML.includes('id="aee-scene-1"'), 'Scene 1 must be present');
  assert.ok(container.innerHTML.includes('id="aee-scene-2"'), 'Scene 2 must be present');
  assert.ok(container.innerHTML.includes('id="aee-scene-3"'), 'Scene 3 must be present');
  assert.ok(container.innerHTML.includes('id="aee-scene-4"'), 'Scene 4 must be present');
  assert.ok(container.innerHTML.includes('id="aee-scene-5"'), 'Scene 5 must be present');
  assert.ok(container.innerHTML.includes('id="aee-scene-6"'), 'Scene 6 must be present');
  assert.ok(container.innerHTML.includes('id="aee-scene-7"'), 'Scene 7 must be present');
  assert.ok(container.innerHTML.includes('id="aee-scene-8"'), 'Scene 8 must be present');

  assert.ok(container.innerHTML.includes('SAME PEOPLE.'), 'Top-left corner tag present');
  assert.ok(container.innerHTML.includes('FINANCIAL LITERACY'), 'Top-right corner tag present');
  assert.ok(container.innerHTML.includes('SAME QUESTIONS.'), 'Bottom-left corner tag present');
  assert.ok(container.innerHTML.includes('A SMALL CHANGE'), 'Bottom-right corner tag present');

  assert.ok(container.innerHTML.includes('What changes?'), 'Rhetorical prompt present');
  assert.ok(container.innerHTML.includes('10Y GOVERNMENT BOND'), 'Bond curve parameters present');
  assert.ok(container.innerHTML.includes('INTEREST RATES ↑'), 'Causal tree root present');
  assert.ok(container.innerHTML.includes('HOUSEHOLDS'), 'System network households present');
  assert.ok(container.innerHTML.includes('CENTRAL BANK'), 'System network central bank present');
  assert.ok(container.innerHTML.includes('102.41'), 'Clearing price present');
  assert.ok(container.innerHTML.includes('VALUE IS A MODEL'), 'DCF model headline present');
  assert.ok(container.innerHTML.includes('UNCERTAINTY CAN BE MEASURED'), 'Quant risk headline present');
  assert.ok(container.innerHTML.includes('UNDERSTAND THE FINANCIAL WORLD'), 'Curriculum atlas present');

  // Scene 4 living metabolism blueprint conduits, flow streams, and solitons
  assert.ok(container.innerHTML.includes('aee-conduit-track'), 'Passive conduit tracks present');
  assert.ok(container.innerHTML.includes('aee-flow-stream'), 'Active flow streams present');
  assert.ok(container.innerHTML.includes('aee-soliton'), 'Kinetic soliton packets present');
  assert.ok(container.innerHTML.includes('track-hb-savings'), 'Households to Banks conduit present');
  assert.ok(container.innerHTML.includes('track-hc-consumption'), 'Households to Companies conduit present');
  assert.ok(container.innerHTML.includes('track-cm-capital'), 'Companies to Markets conduit present');
  assert.ok(container.innerHTML.includes('track-cbg-policy'), 'Central Bank to Government policy conduit present');
  assert.ok(container.innerHTML.includes('track-cbg-liquidity'), 'Government to Central Bank liquidity conduit present');

  // Verify restored clean geometry definitions
  assert.ok(container.innerHTML.includes('d="M 535 187 L 535 130"'), 'cm-capital clean vertical vector present');
  assert.ok(container.innerHTML.includes('d="M 232 131 L 340 183"'), 'hc-consumption clean diagonal vector present');
  assert.ok(container.innerHTML.includes('d="M 725 288 L 725 252"'), 'cbg-policy clean vertical vector present');
  assert.ok(container.innerHTML.includes('d="M 758 254 L 758 289"'), 'cbg-liquidity clean vertical vector present');

  // Verify 3D Camera Rig and Persistent Morphing Threads Layer
  assert.ok(container.innerHTML.includes('id="aee-camera-rig"'), '3D camera rig container must be present');
  assert.ok(container.innerHTML.includes('id="aee-morph-threads-layer"'), 'Persistent morph threads layer must be present');
  assert.ok(container.innerHTML.includes('id="aee-thread-1-2"'), 'Thread 1->2 must be present');
  assert.ok(container.innerHTML.includes('id="aee-thread-2-3"'), 'Thread 2->3 must be present');
  assert.ok(container.innerHTML.includes('id="aee-thread-3-4"'), 'Thread 3->4 must be present');
  assert.ok(container.innerHTML.includes('id="aee-thread-4-5"'), 'Thread 4->5 must be present');
  assert.ok(container.innerHTML.includes('id="aee-thread-5-6"'), 'Thread 5->6 must be present');
  assert.ok(container.innerHTML.includes('id="aee-thread-6-7"'), 'Thread 6->7 must be present');
  assert.ok(container.innerHTML.includes('id="aee-thread-7-8"'), 'Thread 7->8 must be present');

  // Verify carrier soliton and carrier rails are completely removed (clean scene canvas)
  assert.ok(!container.innerHTML.includes('id="aee-carrier-soliton"'), 'Carrier soliton element must be completely removed');
  assert.ok(!container.innerHTML.includes('id="aee-carrier-rails-layer"'), 'Carrier rails layer must be completely removed');
  assert.ok(!container.innerHTML.includes('id="aee-carrier-rail-base"'), 'Carrier base hairline rail must be completely removed');
  assert.ok(!container.innerHTML.includes('id="aee-carrier-rail-active"'), 'Carrier active illuminated rail must be completely removed');
  assert.ok(!container.innerHTML.includes('id="aee-carrier-satellites"'), 'Carrier satellites must be completely removed');

  // Lifecycle destroy and updateProgress methods
  assert.strictEqual(typeof hero.destroy, 'function');
  assert.strictEqual(typeof hero.updateProgress, 'function');
  hero.updateProgress(0.18);
  hero.destroy();
});

test('Scene 4 metabolism setup enables interactive adjacency focus and lifecycle teardown', () => {
  const container = new MockElement('div');
  const scene4 = new MockElement('div');
  scene4.setAttribute('id', 'aee-scene-4');
  container.children.push(scene4);

  // All 6 Institutional Nodes
  const nodeNames = ['households', 'banks', 'markets', 'companies', 'government', 'central_bank'];
  const nodes = {};
  nodeNames.forEach(name => {
    const nodeEl = new MockElement('g');
    nodeEl.classList.add('aee-node');
    nodeEl.setAttribute('data-node', name);
    const box = new MockElement('rect');
    box.classList.add('aee-node-box');
    nodeEl.children.push(box);
    scene4.children.push(nodeEl);
    nodes[name] = nodeEl;
  });

  // Conduits
  const conduitDefs = [
    { id: 'hb-savings', from: 'households', to: 'banks' },
    { id: 'hb-loans', from: 'banks', to: 'households' },
    { id: 'hc-consumption', from: 'households', to: 'companies' },
    { id: 'bc-lending', from: 'banks', to: 'companies' },
    { id: 'bm-capital', from: 'banks', to: 'markets' },
    { id: 'bm-funding', from: 'markets', to: 'banks' },
    { id: 'cm-capital', from: 'companies', to: 'markets' },
    { id: 'cg-taxes', from: 'companies', to: 'government' },
    { id: 'cg-spending', from: 'government', to: 'companies' },
    { id: 'gm-investment', from: 'markets', to: 'government' },
    { id: 'gm-securities', from: 'government', to: 'markets' },
    { id: 'cbg-policy', from: 'central_bank', to: 'government' },
    { id: 'cbg-liquidity', from: 'government', to: 'central_bank' }
  ];

  const conduits = {};
  conduitDefs.forEach(def => {
    const cEl = new MockElement('g');
    cEl.classList.add('aee-vector-conduit');
    cEl.setAttribute('data-conduit', def.id);
    cEl.setAttribute('data-from', def.from);
    cEl.setAttribute('data-to', def.to);

    const track = new MockElement('path');
    track.setAttribute('id', `track-${def.id}`);
    cEl.children.push(track);
    scene4.children.push(cEl);

    // Soliton for track
    const soliton = new MockElement('g');
    soliton.classList.add('aee-soliton');
    soliton.setAttribute('data-soliton-for', `track-${def.id}`);
    soliton.setAttribute('data-duration', '2.5');
    const anim = new MockElement('animateMotion');
    anim.remove = () => { anim._removed = true; };
    soliton.children.push(anim);
    cEl.children.push(soliton);

    conduits[def.id] = cEl;
  });

  // Mock GSAP and MotionPathPlugin
  let registeredPlugin = null;
  const createdTimelines = [];
  const killedTargets = [];

  global.window = {
    MotionPathPlugin: { name: 'motionPath' },
    gsap: {
      plugins: { motionPath: true },
      registerPlugin: (plugin) => { registeredPlugin = plugin; },
      to: (target, vars) => {
        const tl = {
          target,
          vars,
          killed: false,
          kill: () => { tl.killed = true; }
        };
        if (vars.motionPath) {
          createdTimelines.push(tl);
        }
        return tl;
      },
      killTweensOf: (target) => { killedTargets.push(target); }
    },
    matchMedia: () => ({ matches: false }),
    __FIN_REDUCE_MOTION: false
  };

  // Initialize metabolism interactions
  const destroy = setupMetabolismInteractions(container);
  assert.strictEqual(typeof destroy, 'function');
  assert.ok(registeredPlugin, 'MotionPathPlugin should be registered');
  assert.strictEqual(createdTimelines.length, conduitDefs.length, 'All soliton timelines must be created');

  // Trigger mouseenter on Banks
  nodes.banks.dispatchEvent('mouseenter');
  assert.ok(nodes.banks.classList.contains('is-focused'), 'Hovered node must be focused');
  assert.strictEqual(nodes.banks.classList.contains('is-dimmed'), false, 'Focused node must not be dimmed');

  // Direct incident conduits should be highlighted
  assert.ok(conduits['hb-savings'].classList.contains('is-highlighted'), 'hb-savings must be highlighted');
  assert.ok(conduits['hb-loans'].classList.contains('is-highlighted'), 'hb-loans must be highlighted');
  assert.ok(conduits['bc-lending'].classList.contains('is-highlighted'), 'bc-lending must be highlighted');
  assert.ok(conduits['bm-capital'].classList.contains('is-highlighted'), 'bm-capital must be highlighted');
  assert.ok(conduits['bm-funding'].classList.contains('is-highlighted'), 'bm-funding must be highlighted');

  // Unrelated conduits (cbg-policy, cbg-liquidity, hc-consumption, cm-capital, etc) should be dimmed
  assert.ok(conduits['cbg-policy'].classList.contains('is-dimmed'), 'cbg-policy must be dimmed');
  assert.ok(conduits['cbg-liquidity'].classList.contains('is-dimmed'), 'cbg-liquidity must be dimmed');
  assert.ok(conduits['hc-consumption'].classList.contains('is-dimmed'), 'hc-consumption must be dimmed');
  assert.ok(conduits['cm-capital'].classList.contains('is-dimmed'), 'cm-capital must be dimmed');
  assert.ok(nodes.central_bank.classList.contains('is-dimmed'), 'central_bank must be dimmed');
  assert.ok(nodes.government.classList.contains('is-dimmed'), 'government must be dimmed');

  // Trigger mouseleave on Banks
  nodes.banks.dispatchEvent('mouseleave');
  assert.strictEqual(nodes.banks.classList.contains('is-focused'), false, 'Focus must clear on leave');
  assert.strictEqual(conduits['hb-savings'].classList.contains('is-highlighted'), false, 'Highlight must clear on leave');
  assert.strictEqual(conduits['cbg-policy'].classList.contains('is-dimmed'), false, 'Dimming must clear on leave');
  assert.strictEqual(nodes.central_bank.classList.contains('is-dimmed'), false, 'Node dimming must clear on leave');

  // Trigger hover on Central Bank
  nodes.central_bank.dispatchEvent('mouseenter');
  assert.ok(nodes.central_bank.classList.contains('is-focused'), 'central_bank must be focused');
  assert.ok(conduits['cbg-policy'].classList.contains('is-highlighted'), 'cbg-policy must be highlighted');
  assert.ok(conduits['cbg-liquidity'].classList.contains('is-highlighted'), 'cbg-liquidity must be highlighted');
  assert.ok(conduits['hb-savings'].classList.contains('is-dimmed'), 'hb-savings must be dimmed');
  assert.ok(nodes.banks.classList.contains('is-dimmed'), 'banks must be dimmed');

  nodes.central_bank.dispatchEvent('mouseleave');

  // Trigger hover on Companies
  nodes.companies.dispatchEvent('mouseenter');
  assert.ok(nodes.companies.classList.contains('is-focused'), 'companies must be focused');
  assert.ok(conduits['hc-consumption'].classList.contains('is-highlighted'), 'hc-consumption must be highlighted on companies hover');
  assert.ok(conduits['cm-capital'].classList.contains('is-highlighted'), 'cm-capital must be highlighted on companies hover');
  assert.ok(conduits['bc-lending'].classList.contains('is-highlighted'), 'bc-lending must be highlighted on companies hover');
  assert.ok(conduits['cg-taxes'].classList.contains('is-highlighted'), 'cg-taxes must be highlighted on companies hover');
  assert.ok(conduits['cg-spending'].classList.contains('is-highlighted'), 'cg-spending must be highlighted on companies hover');
  assert.ok(conduits['cbg-policy'].classList.contains('is-dimmed'), 'cbg-policy must be dimmed on companies hover');
  assert.ok(conduits['hb-savings'].classList.contains('is-dimmed'), 'hb-savings must be dimmed on companies hover');

  nodes.companies.dispatchEvent('mouseleave');
  assert.strictEqual(nodes.companies.classList.contains('is-focused'), false, 'companies focus must clear on leave');
  assert.strictEqual(conduits['hc-consumption'].classList.contains('is-highlighted'), false, 'hc-consumption highlight must clear on leave');
  assert.strictEqual(conduits['cm-capital'].classList.contains('is-highlighted'), false, 'cm-capital highlight must clear on leave');

  // Teardown verification
  destroy();
  assert.ok(createdTimelines.every(tl => tl.killed), 'All GSAP particle timelines must be killed on unmount');
  assert.ok(killedTargets.length > 0, 'In-flight tweens must be killed on unmount');

  // Clean up global window mock
  delete global.window;
});

test('updateCinematicHero updates layer transforms and values without throwing', () => {
  const mockDOM = parseMockHTML(`
    <div id="aee-camera-rig"></div>
    <div id="aee-morph-threads-layer"></div>
    <div id="aee-thread-1-2"></div>
    <div id="aee-t12-axis-x"></div>
    <div id="aee-t12-axis-y"></div>
    <div id="aee-t12-slash"></div>
    <div id="aee-t12-curve"></div>
    <div id="aee-thread-2-3"></div>
    <div id="aee-t23-apex-anchor"></div>
    <div id="aee-t23-pulse"></div>
    <div id="aee-t23-price-tag"></div>
    <div id="aee-t23-label"></div>
    <div id="aee-thread-3-4"></div>
    <div id="aee-t34-node-1"></div>
    <div id="aee-t34-node-2"></div>
    <div id="aee-t34-node-3"></div>
    <div id="aee-t34-node-4"></div>
    <div id="aee-t34-node-5"></div>
    <div id="aee-t34-node-6"></div>
    <div id="aee-thread-4-5"></div>
    <div id="aee-t45-vortex"></div>
    <div id="aee-t45-clearing-lead"></div>
    <div id="aee-thread-5-6"></div>
    <div id="aee-t56-timeline"></div>
    <div id="aee-t56-wf-1"></div>
    <div id="aee-t56-wf-2"></div>
    <div id="aee-t56-wf-3"></div>
    <div id="aee-t56-wf-4"></div>
    <div id="aee-t56-wf-5"></div>
    <div id="aee-t56-wf-tv"></div>
    <div id="aee-thread-6-7"></div>
    <div id="aee-t67-origin"></div>
    <div id="aee-t67-tv-bar"></div>
    <div id="aee-t67-tv-label"></div>
    <div id="aee-t67-path-1"></div>
    <div id="aee-t67-path-2"></div>
    <div id="aee-t67-path-3"></div>
    <div id="aee-t67-path-4"></div>
    <div id="aee-t67-path-5"></div>
    <div id="aee-thread-7-8"></div>
    <div id="aee-t78-path-top"></div>
    <div id="aee-t78-path-mid"></div>
    <div id="aee-t78-path-bot"></div>
    <div id="aee-t78-v1"></div>
    <div id="aee-t78-v2"></div>
    <div id="aee-scene-1"></div>
    <div id="aee-s1-equal">=</div>
    <div id="aee-s1-mutation-block"></div>
    <div id="aee-scene-2"></div>
    <div id="aee-s2-curve"></div>
    <div id="aee-scene-3"></div>
    <div id="aee-scene-4"></div>
    <div id="aee-scene-5"></div>
    <div id="aee-s5-price">102.41</div>
    <div id="aee-scene-6"></div>
    <div id="aee-scene-7"></div>
    <div id="aee-scene-8"></div>
    <div class="aee-corner-tag"></div>
    <div class="aee-corner-tag"></div>
  `);

  assert.doesNotThrow(() => {
    updateCinematicHero(mockDOM, 0.05); // Scene 1
    updateCinematicHero(mockDOM, 0.20); // Scene 2
    updateCinematicHero(mockDOM, 0.35); // Scene 3
    updateCinematicHero(mockDOM, 0.45); // Scene 4
    updateCinematicHero(mockDOM, 0.60); // Scene 5
    updateCinematicHero(mockDOM, 0.72); // Scene 6
    updateCinematicHero(mockDOM, 0.82); // Scene 7
    updateCinematicHero(mockDOM, 0.95); // Scene 8
  });

  // Test 1: Verify overlapping transitions across all 7 scene boundaries (30% to 50% overlap, no blackouts)
  const transitions = [
    { p: 0.12, sA: '#aee-scene-1', sB: '#aee-scene-2' },
    { p: 0.25, sA: '#aee-scene-2', sB: '#aee-scene-3' },
    { p: 0.38, sA: '#aee-scene-3', sB: '#aee-scene-4' },
    { p: 0.52, sA: '#aee-scene-4', sB: '#aee-scene-5' },
    { p: 0.65, sA: '#aee-scene-5', sB: '#aee-scene-6' },
    { p: 0.77, sA: '#aee-scene-6', sB: '#aee-scene-7' },
    { p: 0.88, sA: '#aee-scene-7', sB: '#aee-scene-8' }
  ];

  transitions.forEach(({ p, sA, sB }) => {
    updateCinematicHero(mockDOM, p);
    const opA = parseFloat(mockDOM.querySelector(sA).style.opacity || '0');
    const opB = parseFloat(mockDOM.querySelector(sB).style.opacity || '0');
    assert.ok(opA > 0.2, `Scene ${sA} must maintain non-zero opacity during transition at p=${p}`);
    assert.ok(opB > 0.2, `Scene ${sB} must maintain non-zero opacity during transition at p=${p}`);
    assert.ok(opA + opB >= 0.8, `Overlapping transitions at p=${p} must eliminate blackouts (combined opacity >= 0.8)`);
  });

  // Test 2: Verify 3D camera transforms on scene layers
  updateCinematicHero(mockDOM, 0.12);
  const s1Transform = mockDOM.querySelector('#aee-scene-1').style.transform;
  const s2Transform = mockDOM.querySelector('#aee-scene-2').style.transform;
  assert.ok(s1Transform.includes('translate3d'), 'Exiting scene must use GPU translate3d');
  assert.ok(s2Transform.includes('translate3d'), 'Entering scene must use GPU translate3d');
  assert.ok(mockDOM.querySelector('#aee-scene-1').style.filter.includes('blur'), 'Exiting scene must apply blur');
  assert.ok(mockDOM.querySelector('#aee-scene-2').style.filter.includes('blur'), 'Entering scene must apply blur');

  // Test 3: Verify dynamic 3D camera rig transformations across key focal transitions
  updateCinematicHero(mockDOM, 0.25);
  const cam25 = mockDOM.querySelector('#aee-camera-rig').style.transform;
  assert.ok(cam25.includes('translate3d(0, 0, 70.0px)'), 'Transition 2 focal zoom must advance camZ');

  updateCinematicHero(mockDOM, 0.52);
  const cam52 = mockDOM.querySelector('#aee-camera-rig').style.transform;
  assert.ok(!cam52.includes('rotateZ(2.5deg)'), 'Transition 4 must not tilt camera to the right');
  assert.ok(cam52.includes('rotateZ(0deg)'), 'Transition 4 keeps camera strictly level at 0deg');

  updateCinematicHero(mockDOM, 0.88);
  const cam88 = mockDOM.querySelector('#aee-camera-rig').style.transform;
  assert.ok(cam88.includes('translate3d(0, 0, -95.0px)') && cam88.includes('scale(0.950)'), 'Transition 7 must apply wide reverse-dolly zoom');

  // Test 4: Verify persistent anchor morphing threads activation and attribute updates
  updateCinematicHero(mockDOM, 0.12);
  const t12 = mockDOM.querySelector('#aee-thread-1-2');
  assert.ok(parseFloat(t12.style.opacity) > 0.8, 'Thread 1->2 must be visible at transition midpoint');
  assert.strictEqual(mockDOM.querySelector('#aee-t12-axis-x').getAttribute('x1'), '170.0');
  assert.strictEqual(mockDOM.querySelector('#aee-t12-axis-y').getAttribute('x1'), '170.0');

  updateCinematicHero(mockDOM, 0.25);
  const t23 = mockDOM.querySelector('#aee-thread-2-3');
  assert.ok(parseFloat(t23.style.opacity) > 0.8, 'Thread 2->3 must be visible at transition midpoint');

  updateCinematicHero(mockDOM, 0.38);
  const t34 = mockDOM.querySelector('#aee-thread-3-4');
  assert.ok(parseFloat(t34.style.opacity) > 0.8, 'Thread 3->4 must be visible at transition midpoint');
  assert.strictEqual(mockDOM.querySelector('#aee-t34-node-1').getAttribute('cx'), '151.5');

  updateCinematicHero(mockDOM, 0.52);
  const t45 = mockDOM.querySelector('#aee-thread-4-5');
  assert.ok(parseFloat(t45.style.opacity) > 0.8, 'Thread 4->5 must be visible at transition midpoint');

  updateCinematicHero(mockDOM, 0.65);
  const t56 = mockDOM.querySelector('#aee-thread-5-6');
  assert.ok(parseFloat(t56.style.opacity) > 0.8, 'Thread 5->6 must be visible at transition midpoint');
  assert.strictEqual(mockDOM.querySelector('#aee-t56-wf-tv').getAttribute('y2'), '80.0');

  updateCinematicHero(mockDOM, 0.77);
  const t67 = mockDOM.querySelector('#aee-thread-6-7');
  assert.ok(parseFloat(t67.style.opacity) > 0.8, 'Thread 6->7 must be visible at transition midpoint');

  updateCinematicHero(mockDOM, 0.88);
  const t78 = mockDOM.querySelector('#aee-thread-7-8');
  assert.ok(parseFloat(t78.style.opacity) > 0.8, 'Thread 7->8 must be visible at transition midpoint');

  // Test 5: Verify full reduced motion compliance (transforms, blur, and threads disabled)
  global.window = {
    __FIN_REDUCE_MOTION: true,
    matchMedia: () => ({ matches: false })
  };
  updateCinematicHero(mockDOM, 0.12);
  assert.strictEqual(mockDOM.querySelector('#aee-scene-1').style.transform, 'none', 'Reduced motion must disable transforms');
  assert.strictEqual(mockDOM.querySelector('#aee-scene-2').style.transform, 'none', 'Reduced motion must disable transforms');
  assert.strictEqual(mockDOM.querySelector('#aee-scene-1').style.filter, 'none', 'Reduced motion must disable blur filter');
  assert.strictEqual(mockDOM.querySelector('#aee-scene-2').style.filter, 'none', 'Reduced motion must disable blur filter');
  assert.strictEqual(mockDOM.querySelector('#aee-camera-rig').style.transform, 'none', 'Reduced motion must disable camera rig transform');
  assert.strictEqual(mockDOM.querySelector('#aee-thread-1-2').style.opacity, '0', 'Reduced motion must hide morph threads');

  // Verify explicit false override permits motion even if matchMedia reports reduce
  global.window = {
    __FIN_REDUCE_MOTION: false,
    matchMedia: () => ({ matches: true })
  };
  updateCinematicHero(mockDOM, 0.18);
  assert.strictEqual(mockDOM.querySelector('#aee-scene-2').style.opacity, '1.000', 'Explicit motion override must allow motion');
  delete global.window;
});

test('Carrier soliton and trace rails are completely removed from hero markup and DOM', () => {
  const container = new MockElement('div');
  renderCinematicHero(container);
  const html = container.innerHTML;

  assert.ok(!html.includes('id="aee-carrier-soliton"'), 'Zero carrier soliton in markup');
  assert.ok(!html.includes('id="aee-carrier-rails-layer"'), 'Zero carrier rails in markup');
  assert.ok(!html.includes('id="aee-carrier-rail-active"'), 'Zero active rails in markup');
  assert.ok(!html.includes('aee-carrier-core'), 'Zero carrier core in markup');
  assert.ok(!html.includes('aee-carrier-halo'), 'Zero carrier halo in markup');
  assert.ok(!html.includes('aee-carrier-pulse'), 'Zero carrier pulse in markup');

  // Verify updates across 100 sample points execute cleanly without any carrier element
  for (let i = 0; i <= 100; i++) {
    const p = i / 100;
    assert.doesNotThrow(() => {
      updateCinematicHero(container, p);
    }, `updateCinematicHero must succeed without carrier at p=${p}`);
  }
});

test('renderHomePage renders top header with Bauhaus monochrome aperture toggle, sandbox, 6 realms, and provides cleanup', () => {
  const container = new MockElement('div');
  const cleanup = renderHomePage(container, { currentView: 'home' }, () => {});

  assert.ok(container.innerHTML.includes('ALL ELSE EQUAL'), 'Wordmark present');
  assert.ok(container.innerHTML.includes('id="aee-theme-toggle"'), 'Theme toggle present');
  assert.ok(container.innerHTML.includes('aee-theme-aperture'), 'Bauhaus aperture icon present');
  assert.ok(container.innerHTML.includes('id="aee-theme-label"'), 'Theme mode label present');
  assert.ok(!container.innerHTML.includes('☀️') && !container.innerHTML.includes('🌙'), 'Zero emojis in header theme toggle');
  assert.ok(container.innerHTML.includes('A more thoughtful financial future.'), 'Tagline present');
  assert.ok(container.innerHTML.includes('id="aee-sandbox-section"'), 'Interactive sandbox present');
  assert.ok(container.innerHTML.includes('REALM 01'), 'Economics realm present');
  assert.ok(container.innerHTML.includes('REALM 02'), 'Markets realm present');
  assert.ok(container.innerHTML.includes('REALM 03'), 'Corporate Finance realm present');
  assert.ok(container.innerHTML.includes('REALM 04'), 'Quant realm present');
  assert.ok(container.innerHTML.includes('REALM 05'), 'Banking realm present');
  assert.ok(container.innerHTML.includes('REALM 06'), 'Investing realm present');

  assert.strictEqual(typeof cleanup, 'function');
  cleanup();
});

test('Bauhaus monochrome theme toggle switches modes, updates aperture transform and provides teardown', () => {
  const container = new MockElement('div');
  const mockToggleBtn = new MockElement('button');
  mockToggleBtn.setAttribute('id', 'aee-theme-toggle');

  const mockLabel = new MockElement('span');
  mockLabel.setAttribute('id', 'aee-theme-label');
  mockLabel.textContent = 'DARK';

  const mockAperture = new MockElement('svg');
  mockAperture.classList.add('aee-theme-aperture');

  container.children = [mockToggleBtn, mockLabel, mockAperture];

  // Intercept querySelector on container to return our mock elements
  const origQuerySelector = container.querySelector.bind(container);
  container.querySelector = (selector) => {
    if (selector === '#aee-theme-toggle') return mockToggleBtn;
    if (selector === '#aee-theme-label') return mockLabel;
    if (selector === '.aee-theme-aperture') return mockAperture;
    return origQuerySelector(selector);
  };

  let toggleCount = 0;
  let currentTheme = 'dark';
  const mockToggleTheme = () => {
    toggleCount++;
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    return currentTheme;
  };

  const cleanup = renderHomePage(container, { profile: { theme: 'dark' } }, () => {}, mockToggleTheme);

  assert.strictEqual(mockLabel.textContent, 'DARK', 'Initial label is DARK');
  assert.strictEqual(mockAperture.style.transform, 'rotate(0deg)', 'Initial aperture rotation is 0deg');

  // Click toggle
  mockToggleBtn.dispatchEvent({ type: 'click' });
  assert.strictEqual(toggleCount, 1, 'Toggle callback executed once');
  assert.strictEqual(mockLabel.textContent, 'LIGHT', 'Theme label updated to LIGHT');
  assert.strictEqual(mockAperture.style.transform, 'rotate(180deg)', 'Aperture rotated to 180deg');

  // Click toggle back to dark
  mockToggleBtn.dispatchEvent({ type: 'click' });
  assert.strictEqual(toggleCount, 2, 'Toggle callback executed twice');
  assert.strictEqual(mockLabel.textContent, 'DARK', 'Theme label returned to DARK');
  assert.strictEqual(mockAperture.style.transform, 'rotate(0deg)', 'Aperture returned to 0deg');

  cleanup();
});

test('Interactive sandbox financial mathematics compute accurately', () => {
  // Mode 1: 10Y Bond Price seesaw
  const parBond = calculateBondPrice(100, 4, 4, 10, 1);
  assert.strictEqual(parBond.price, 100.00);

  const discountedBond = calculateBondPrice(100, 4, 5, 10, 1);
  assert.strictEqual(discountedBond.price, 92.28);

  // Mode 2: DCF Share Price sensitivity
  const baseDCF = calculateDCF(3.5, 8.0, 5, 7.0, 2.5, 1, 0);
  assert.ok(baseDCF.enterpriseValue > 0, 'Enterprise value should be positive');
  assert.ok(baseDCF.sharePrice > 0, 'Share price should be positive');

  // Mode 3: Black-Scholes Greeks
  const bs = blackScholes(100, 100, 1.0, 5, 30);
  assert.ok(bs.callPrice > 0, 'Call price should be positive');
  assert.ok(bs.deltaCall > 0.5 && bs.deltaCall < 0.7, 'ATM call delta should be around 0.55-0.65');
  assert.ok(bs.gamma > 0, 'Gamma should be strictly positive');
  assert.ok(bs.vega > 0, 'Vega should be strictly positive');
});

test('Scene 4 restored clean conduit geometry eliminates line crossings and label collisions', () => {
  const container = new MockElement('div');
  renderCinematicHero(container);
  const html = container.innerHTML;

  // 1. cm-capital: clean vertical straight arrow pointing straight UP at x=535 from y=187 to y=130
  assert.ok(html.includes('id="track-cm-capital" d="M 535 187 L 535 130"'), 'cm-capital track must be straight vertical UP');
  assert.ok(html.includes('data-soliton-for="track-cm-capital"'), 'cm-capital soliton bound to track');
  assert.ok(html.includes('path="M 535 187 L 535 130"'), 'cm-capital soliton path matches straight vertical track');
  assert.ok(html.includes('x="544" y="156" class="aee-conduit-label" text-anchor="start">CAPITAL RAISING</text>'), 'CAPITAL RAISING label placed cleanly at x=544, y=156');

  // 2. hc-consumption: clean single diagonal vector from (232, 131) to (340, 183) with stacked labels
  assert.ok(html.includes('id="track-hc-consumption" d="M 232 131 L 340 183"'), 'hc-consumption track must be clean single diagonal');
  assert.ok(html.includes('data-soliton-for="track-hc-consumption"'), 'hc-consumption soliton bound to track');
  assert.ok(html.includes('path="M 232 131 L 340 183"'), 'hc-consumption soliton path matches diagonal track');
  assert.ok(html.includes('x="270" y="173" class="aee-conduit-label" text-anchor="middle">CONSUMPTION</text>'), 'CONSUMPTION label positioned at y=173');
  assert.ok(html.includes('x="270" y="186" class="aee-conduit-label" text-anchor="middle">INCOME</text>'), 'INCOME label positioned at y=186');

  // 3. cbg-policy: clean vertical vector at x=725 from y=288 to y=252 pointing UP
  assert.ok(html.includes('id="track-cbg-policy" d="M 725 288 L 725 252"'), 'cbg-policy track must be vertical UP below Government');
  assert.ok(html.includes('data-soliton-for="track-cbg-policy"'), 'cbg-policy soliton bound to track');
  assert.ok(html.includes('path="M 725 288 L 725 252"'), 'cbg-policy soliton path matches vertical track');
  assert.ok(html.includes('x="716" y="271" class="aee-conduit-label" text-anchor="end">POLICY DIRECTION</text>'), 'POLICY DIRECTION label placed at x=716, y=271');

  // 4. cbg-liquidity: clean vertical vector at x=758 from y=254 to y=289 pointing DOWN
  assert.ok(html.includes('id="track-cbg-liquidity" d="M 758 254 L 758 289"'), 'cbg-liquidity track must be vertical DOWN below Government');
  assert.ok(html.includes('data-soliton-for="track-cbg-liquidity"'), 'cbg-liquidity soliton bound to track');
  assert.ok(html.includes('path="M 758 254 L 758 289"'), 'cbg-liquidity soliton path matches vertical track');
  assert.ok(html.includes('x="768" y="271" class="aee-conduit-label" text-anchor="start">LIQUIDITY FACILITIES</text>'), 'LIQUIDITY FACILITIES label placed at x=768, y=271');
});

test('Scene 1 single-stage anchor and 4-beat physical transformation into Scene 2', () => {
  const container = new MockElement('div');
  renderCinematicHero(container);
  const html = container.innerHTML;

  // Verify single stationary anchor headline structure
  assert.ok(html.includes('id="aee-s1-anchor-headline"'), 'Single stationary anchor headline must be present');
  assert.ok(html.includes('id="aee-s1-left-word"'), 'Left word container must be present');
  assert.ok(html.includes('id="aee-s1-equal"'), 'Center equal sign must be present');
  assert.ok(html.includes('id="aee-s1-right-word"'), 'Right word container must be present');
  assert.ok(html.includes('id="aee-s1-initial-block"'), 'Initial prompt block must be present');
  assert.ok(html.includes('id="aee-s1-mutation-block"'), 'Mutation consequence block must be present');
  assert.ok(html.includes('id="aee-s1-pill"'), 'Rate delta pill must be present');
  assert.ok(html.includes('id="aee-s1-question"'), 'Rhetorical question must be present');

  // Verify duplicate ALL ELSE EQUAL is not inside mutation block
  const mutationBlockStart = html.indexOf('id="aee-s1-mutation-block"');
  const mutationBlockSlice = html.slice(mutationBlockStart, mutationBlockStart + 800);
  assert.strictEqual(mutationBlockSlice.includes('ALL ELSE'), false, 'Duplicate ALL ELSE text must not exist in mutation block');

  // Parse mock DOM for behavior simulation
  const mockDOM = parseMockHTML(`
    <div id="aee-camera-rig"></div>
    <div id="aee-morph-threads-layer"></div>
    <div id="aee-thread-1-2"></div>
    <div id="aee-t12-axis-x"></div>
    <div id="aee-t12-axis-y"></div>
    <div id="aee-t12-slash"></div>
    <div id="aee-t12-curve"></div>
    <div id="aee-scene-1"></div>
    <div id="aee-s1-left-word">ALL ELSE </div>
    <div id="aee-s1-equal">=</div>
    <div id="aee-s1-right-word"> EQUAL</div>
    <div id="aee-s1-initial-block">Change one thing.</div>
    <div id="aee-s1-mutation-block">
      <div id="aee-s1-pill">INTEREST RATE 4.00% ----> 5.00%</div>
      <div id="aee-s1-question">What changes?</div>
    </div>
    <div id="aee-s1-eyebrow">PROLOGUE</div>
    <div id="aee-s1-hairline"></div>
    <div id="aee-s1-scroll-prompt">SCROLL</div>
    <div id="aee-scene-2"></div>
    <div id="aee-s2-curve"></div>
    <div id="aee-s2-yield-box"></div>
    <div id="aee-s2-price-box"></div>
  `);

  // Beat 1 (p = 0.01): Rest on stationary ALL ELSE = EQUAL
  updateCinematicHero(mockDOM, 0.01);
  assert.strictEqual(mockDOM.querySelector('#aee-s1-equal').textContent, '=');
  assert.strictEqual(mockDOM.querySelector('#aee-s1-initial-block').style.opacity, '1.00');
  assert.strictEqual(mockDOM.querySelector('#aee-s1-mutation-block').style.opacity, '0.00');

  // Beat 2 (p = 0.04): In-place glyph mutation to != and rate pill fade-in
  updateCinematicHero(mockDOM, 0.04);
  assert.strictEqual(mockDOM.querySelector('#aee-s1-equal').textContent, '≠');
  assert.ok(parseFloat(mockDOM.querySelector('#aee-s1-initial-block').style.opacity) < 0.5, 'Initial block fades out in Beat 2');
  assert.ok(parseFloat(mockDOM.querySelector('#aee-s1-mutation-block').style.opacity) > 0.3, 'Mutation block fades in in Beat 2');

  // Beat 3 (p = 0.07): Hold ALL ELSE != EQUAL, rate shock, and What changes?
  updateCinematicHero(mockDOM, 0.07);
  assert.strictEqual(mockDOM.querySelector('#aee-s1-equal').textContent, '≠');
  assert.strictEqual(mockDOM.querySelector('#aee-s1-initial-block').style.opacity, '0.00');
  assert.strictEqual(mockDOM.querySelector('#aee-s1-mutation-block').style.opacity, '1.00');

  // Beat 4 (p = 0.12): Physical hand-off to Scene 2
  updateCinematicHero(mockDOM, 0.12);
  const leftTransform = mockDOM.querySelector('#aee-s1-left-word').style.transform;
  const rightTransform = mockDOM.querySelector('#aee-s1-right-word').style.transform;
  assert.ok(leftTransform.includes('translateX(-'), 'Left word drifts outward to the left');
  assert.ok(rightTransform.includes('translateX('), 'Right word drifts outward to the right');
  assert.ok(parseFloat(mockDOM.querySelector('#aee-s1-left-word').style.opacity) < 0.1, 'Words dissolve cleanly');

  const pillTransform = mockDOM.querySelector('#aee-s1-pill').style.transform;
  assert.ok(pillTransform.includes('translateY('), 'Rate pill glides downward toward Scene 2 Yield box');

  // Thread 1->2 active during Beat 4
  const t12 = mockDOM.querySelector('#aee-thread-1-2');
  assert.ok(parseFloat(t12.style.opacity) > 0.8, 'Morph thread 1->2 active and visible');

  // Scene 2 price box extrudes downward
  const priceTransform = mockDOM.querySelector('#aee-s2-price-box').style.transform;
  assert.ok(priceTransform.includes('translateY('), 'Scene 2 price box extrudes downward');
});

test('Scene 8 curriculum grid preserves mobile 2x4 symmetry, desktop floor, and carrier docking', () => {
  const markup = getCinematicHeroMarkup();
  assert.ok(markup.includes('ACT VII / THE COMPLETE ARCHITECTURE'), 'Act VII header present');
  assert.ok(markup.includes('ECONOMICS'), 'Economics card present');
  assert.ok(markup.includes('FINANCIAL MARKETS'), 'Financial markets card present');
  assert.ok(markup.includes('CORPORATE FINANCE'), 'Corporate finance card present');
  assert.ok(markup.includes('INVESTING & RISK'), 'Investing & risk card present');
  assert.ok(markup.includes('QUANTITATIVE FINANCE'), 'Quantitative finance card present');
  assert.ok(markup.includes('THE FINANCIAL WORLD'), 'Center core card present');
  assert.ok(markup.includes('sm:hidden p-2 border border-white/10 rounded-lg bg-[#060709]/80'), 'Mobile banking card present');
  assert.ok(markup.includes('hidden sm:block mt-2 sm:mt-3'), 'Desktop banking floor present');

  const mockDOM = parseMockHTML(markup);
  const s8 = mockDOM.querySelector('#aee-scene-8');
  assert.ok(s8, 'Scene 8 layer exists');

  // Verify Scene 8 settles with full opacity and visibility at p = 0.96
  updateCinematicHero(mockDOM, 0.96);
  assert.strictEqual(s8.style.opacity, '1.000');
  assert.strictEqual(s8.style.visibility, 'visible');

  // Verify continuous sweep stability across 100 sample points
  for (let i = 0; i <= 100; i++) {
    const p = i / 100;
    assert.doesNotThrow(() => {
      updateCinematicHero(mockDOM, p);
    }, `updateCinematicHero should not throw at p = ${p}`);
  }
});

test('Scene transitions maintain exact handoff thresholds with zero editorial collisions', () => {
  const markup = getCinematicHeroMarkup();
  const mockDOM = parseMockHTML(markup);

  const testHandoffs = [
    { p: 0.25, activeScene: '#aee-scene-2', inactiveScene: '#aee-scene-3' },
    { p: 0.31, activeScene: '#aee-scene-3', inactiveScene: '#aee-scene-2' },
    { p: 0.38, activeScene: '#aee-scene-3', inactiveScene: '#aee-scene-4' },
    { p: 0.45, activeScene: '#aee-scene-4', inactiveScene: '#aee-scene-3' },
    { p: 0.52, activeScene: '#aee-scene-4', inactiveScene: '#aee-scene-5' },
    { p: 0.58, activeScene: '#aee-scene-5', inactiveScene: '#aee-scene-4' },
    { p: 0.65, activeScene: '#aee-scene-5', inactiveScene: '#aee-scene-6' },
    { p: 0.71, activeScene: '#aee-scene-6', inactiveScene: '#aee-scene-5' },
    { p: 0.77, activeScene: '#aee-scene-6', inactiveScene: '#aee-scene-7' },
    { p: 0.82, activeScene: '#aee-scene-7', inactiveScene: '#aee-scene-6' },
    { p: 0.88, activeScene: '#aee-scene-7', inactiveScene: '#aee-scene-8' },
    { p: 0.95, activeScene: '#aee-scene-8', inactiveScene: '#aee-scene-7' }
  ];

  testHandoffs.forEach(({ p, activeScene, inactiveScene }) => {
    updateCinematicHero(mockDOM, p);
    const activeEl = mockDOM.querySelector(activeScene);
    const inactiveEl = mockDOM.querySelector(inactiveScene);

    assert.ok(activeEl, `Active scene ${activeScene} should exist in DOM`);
    assert.ok(inactiveEl, `Inactive scene ${inactiveScene} should exist in DOM`);

    const inactiveOp = parseFloat(inactiveEl.style.opacity || '0');
    const inactiveVis = inactiveEl.style.visibility;
    
    // During pure hold states, inactive scenes are completely hidden
    if ((p === 0.31 || p === 0.45 || p === 0.58 || p === 0.71 || p === 0.82 || p === 0.95)) {
      assert.strictEqual(inactiveOp, 0, `Scene ${inactiveScene} must be fully hidden at p=${p}`);
      assert.strictEqual(inactiveVis, 'hidden', `Scene ${inactiveScene} must have visibility hidden at p=${p}`);
    }

    // During transition scramble states, the entering scene must not leak static text
    if (p === 0.25 || p === 0.38 || p === 0.52 || p === 0.65 || p === 0.77 || p === 0.88) {
      assert.strictEqual(inactiveEl.style.visibility, 'visible', `Scene ${inactiveScene} emerges smoothly`);
    }
  });
});

test('Persistent unified stage editorial stays permanently solid with zero fading across scene handoffs', () => {
  const markup = getCinematicHeroMarkup();
  assert.ok(markup.includes('id="aee-stage-editorial"'), 'Stage editorial element must exist');
  assert.ok(markup.includes('id="aee-stage-headline"'), 'Stage headline element must exist');
  assert.ok(markup.includes('id="aee-stage-eyebrow"'), 'Stage eyebrow element must exist');
  assert.ok(markup.includes('id="aee-stage-footer"'), 'Stage footer element must exist');
  assert.ok(markup.includes('id="aee-stage-footer-title"'), 'Stage footer title element must exist');

  const mockDOM = parseMockHTML(markup);
  const stage = mockDOM.querySelector('#aee-stage-editorial');
  const headline = mockDOM.querySelector('#aee-stage-headline');
  const eyebrow = mockDOM.querySelector('#aee-stage-eyebrow');
  const footerTitle = mockDOM.querySelector('#aee-stage-footer-title');

  assert.ok(stage, 'Stage editorial element found in DOM');
  assert.ok(headline, 'Headline found in DOM');

  // 1. Prologue (p = 0.05): Hidden to allow Scene 1 anchor layout
  updateCinematicHero(mockDOM, 0.05);
  assert.strictEqual(stage.style.opacity, '0');
  assert.strictEqual(stage.style.visibility, 'hidden');

  // 2. Emergence (p = 0.12): Smooth fade-in
  updateCinematicHero(mockDOM, 0.12);
  assert.strictEqual(stage.style.visibility, 'visible');
  assert.ok(parseFloat(stage.style.opacity) > 0.4);

  // 3. Scene 2 Hold (p = 0.18): Solid opacity 1.0
  updateCinematicHero(mockDOM, 0.18);
  assert.strictEqual(stage.style.opacity, '1');
  assert.strictEqual(stage.style.visibility, 'visible');
  assert.strictEqual(headline.textContent, 'ONE VARIABLE CHANGED.');
  assert.strictEqual(footerTitle.textContent, 'ONE PRICE MOVED.');

  // 4. Scene 2 -> 3 Transition (p = 0.25): In-place character scramble without any fading
  updateCinematicHero(mockDOM, 0.25);
  assert.strictEqual(stage.style.opacity, '1', 'Stage editorial MUST remain opacity 1.0 during transition');
  assert.strictEqual(stage.style.visibility, 'visible', 'Stage editorial MUST remain visible during transition');
  assert.ok(headline.textContent.length > 0, 'Headline must contain scrambled text');

  // 5. Scene 3 Hold (p = 0.275 and p = 0.30): Clean arrival at target text, zero disappearance
  updateCinematicHero(mockDOM, 0.275);
  assert.strictEqual(stage.style.opacity, '1', 'Stage editorial MUST stay solid at p=0.275');
  assert.strictEqual(stage.style.visibility, 'visible', 'Stage editorial MUST stay visible at p=0.275');
  assert.strictEqual(headline.textContent, 'FINANCE IS RARELY ABOUT THE FIRST EFFECT.');

  updateCinematicHero(mockDOM, 0.30);
  assert.strictEqual(stage.style.opacity, '1');
  assert.strictEqual(stage.style.visibility, 'visible');
  assert.strictEqual(headline.textContent, 'FINANCE IS RARELY ABOUT THE FIRST EFFECT.');

  // 6. Complete sweep across all scenes (p in [0.15, 0.90]): Permanently 1.0
  for (let i = 15; i <= 90; i++) {
    const p = i / 100;
    updateCinematicHero(mockDOM, p);
    assert.strictEqual(stage.style.opacity, '1', `Stage editorial opacity must be 1.0 at p=${p}`);
    assert.strictEqual(stage.style.visibility, 'visible', `Stage editorial visibility must be visible at p=${p}`);
  }

  // 7. Scene 8 Final Settle (p = 0.95): Headline remains solid, footer yields space to CTAs
  updateCinematicHero(mockDOM, 0.95);
  assert.strictEqual(headline.textContent, 'UNDERSTAND THE FINANCIAL WORLD.');
  assert.strictEqual(eyebrow.textContent, 'ACT VII / THE COMPLETE ARCHITECTURE');
});

test('Stage editorial typography adjusts per scene without transform scale and compacts Scene 4 footer', () => {
  const markup = getCinematicHeroMarkup();
  const mockDOM = parseMockHTML(markup);
  const headline = mockDOM.querySelector('#aee-stage-headline');
  const footerTitle = mockDOM.querySelector('#aee-stage-footer-title');
  const footerSub = mockDOM.querySelector('#aee-stage-footer-sub');

  // Scene 2 (p = 0.18): Large headline and footer title
  updateCinematicHero(mockDOM, 0.18);
  assert.ok(headline.style.fontSize.includes('clamp(1.5000rem, 3.500vw, 2.7500rem)'), 'Scene 2 headline typography');
  assert.ok(footerTitle.style.fontSize.includes('clamp(1.5000rem, 3.500vw, 2.7500rem)'), 'Scene 2 footer title typography');
  assert.strictEqual(footerTitle.style.letterSpacing, '0.2200em');

  // Scene 3 (p = 0.30): Scaled for longer phrase (41 characters)
  updateCinematicHero(mockDOM, 0.30);
  assert.ok(headline.style.fontSize.includes('clamp(1.2500rem, 2.600vw, 2.1250rem)'), 'Scene 3 headline typography');
  assert.ok(footerTitle.style.fontSize.includes('clamp(1.3500rem, 2.800vw, 2.2500rem)'), 'Scene 3 footer title typography');

  // Scene 4 (p = 0.45): Compact footer title for 67 characters to avoid network node collision
  updateCinematicHero(mockDOM, 0.45);
  assert.ok(headline.style.fontSize.includes('clamp(1.4000rem, 3.200vw, 2.5000rem)'), 'Scene 4 headline typography');
  assert.ok(footerTitle.style.fontSize.includes('clamp(0.8125rem, 1.300vw, 1.1250rem)'), 'Scene 4 footer title compact typography');
  assert.strictEqual(footerTitle.style.letterSpacing, '0.1500em');
  assert.strictEqual(footerTitle.style.minHeight, '2.250rem');

  // Scene 5 (p = 0.58): Concise headline and footer title
  updateCinematicHero(mockDOM, 0.58);
  assert.ok(footerTitle.style.fontSize.includes('clamp(1.4000rem, 3.200vw, 2.5000rem)'), 'Scene 5 footer title typography');

  // Transition 3 -> 4 (p = 0.38): Smooth interpolation without jumps
  updateCinematicHero(mockDOM, 0.38);
  assert.ok(footerTitle.style.fontSize.startsWith('clamp('), 'Transition smoothly interpolates font-size clamp');

  // Verify ZERO transform: scale on headline and footer elements
  assert.strictEqual(headline.style.transform || '', '', 'Zero transform scale on headline');
  assert.strictEqual(footerTitle.style.transform || '', '', 'Zero transform scale on footer title');
});

test('Scene 7 quantitative risk graphs respond dynamically to scroll progress', () => {
  const markup = getCinematicHeroMarkup();
  const mockDOM = parseMockHTML(markup);

  // 1. Check initial state at p = 0.77 (early in Scene 7)
  updateCinematicHero(mockDOM, 0.77);
  const timeCursorEarly = mockDOM.querySelector('#aee-s7-time-cursor');
  const timeReadoutEarly = mockDOM.querySelector('#aee-s7-time-readout');
  const path0Early = mockDOM.querySelector('#aee-s7-path-0');
  const tracer0Early = mockDOM.querySelector('#aee-s7-tracer-0');
  const bellMetricEarly = mockDOM.querySelector('#aee-s7-bell-metric');
  const bellCurveEarly = mockDOM.querySelector('#aee-s7-bell-curve');
  const optionReadoutEarly = mockDOM.querySelector('#aee-s7-option-readout');
  const assetDotEarly = mockDOM.querySelector('#aee-s7-asset-dot');

  const dashOffsetEarly = parseFloat(path0Early.style.strokeDashoffset);
  const bellCurveEarlyD = bellCurveEarly.getAttribute('d');
  const assetDotEarlyX = parseFloat(assetDotEarly.getAttribute('cx'));

  assert.ok(timeCursorEarly, 'Time cursor element exists');
  assert.ok(parseFloat(timeCursorEarly.getAttribute('x1')) < 50, 'Time cursor begins near origin (x < 50)');
  assert.ok(dashOffsetEarly > 70, 'Stochastic path dashOffset is high early on');
  assert.ok(tracer0Early.getAttribute('cx'), 'Tracer 0 has active cx coordinate');
  assert.ok(bellMetricEarly.textContent.includes('σ: 12.'), 'Bell curve metric reflects low initial volatility');
  assert.ok(optionReadoutEarly.textContent.includes('CALL: $0'), 'Option starts out of the money at strike or below');

  // 2. Check midpoint state at p = 0.82
  updateCinematicHero(mockDOM, 0.82);
  const timeCursorMid = mockDOM.querySelector('#aee-s7-time-cursor');
  const timeReadoutMid = mockDOM.querySelector('#aee-s7-time-readout');
  const path0Mid = mockDOM.querySelector('#aee-s7-path-0');
  const bellMetricMid = mockDOM.querySelector('#aee-s7-bell-metric');
  const bellCurveMid = mockDOM.querySelector('#aee-s7-bell-curve');
  const assetDotMid = mockDOM.querySelector('#aee-s7-asset-dot');
  const optionReadoutMid = mockDOM.querySelector('#aee-s7-option-readout');

  const xMid = parseFloat(timeCursorMid.getAttribute('x1'));
  assert.ok(xMid > 80 && xMid < 160, 'Time cursor sweeps across midpoint (80 < x < 160)');
  assert.ok(timeReadoutMid.textContent.includes('T: '), 'Time readout displays intermediate year');
  assert.ok(parseFloat(path0Mid.style.strokeDashoffset) < dashOffsetEarly, 'Path unfurls as scroll advances');
  assert.notStrictEqual(bellCurveMid.getAttribute('d'), bellCurveEarlyD, 'Bell curve morphs geometry');
  assert.ok(parseFloat(assetDotMid.getAttribute('cx')) > assetDotEarlyX, 'Asset price tracer glides to the right');

  // 3. Check near completion at p = 0.86
  updateCinematicHero(mockDOM, 0.86);
  const timeCursorLate = mockDOM.querySelector('#aee-s7-time-cursor');
  const path0Late = mockDOM.querySelector('#aee-s7-path-0');
  const bellMetricLate = mockDOM.querySelector('#aee-s7-bell-metric');
  const assetDotLate = mockDOM.querySelector('#aee-s7-asset-dot');
  const optionReadoutLate = mockDOM.querySelector('#aee-s7-option-readout');

  assert.ok(parseFloat(timeCursorLate.getAttribute('x1')) > 170, 'Time cursor reaches end of horizon (x > 170)');
  assert.strictEqual(path0Late.style.strokeDashoffset, '0.00', 'Stochastic path is fully unfurled');
  assert.ok(bellMetricLate.textContent.includes('σ: 20.'), 'Volatility metric broadens to max range');
  assert.ok(parseFloat(assetDotLate.getAttribute('cx')) > 130, 'Asset price dot reaches in the money payoff');
  assert.ok(optionReadoutLate.textContent.includes('+$'), 'Option payoff shows positive intrinsic value');

  // 4. Check reduced motion compliance
  updateCinematicHero(mockDOM, 0.82, true);
  const path0Reduced = mockDOM.querySelector('#aee-s7-path-0');
  assert.strictEqual(path0Reduced.style.strokeDasharray, 'none', 'Reduced motion resets strokeDasharray');
  assert.strictEqual(path0Reduced.style.strokeDashoffset, '0', 'Reduced motion rests at zero offset');
});

test('Scene 6 DCF valuation model and dual sensitivity curves respond dynamically without ASCII slop', () => {
  const markup = getCinematicHeroMarkup();
  const s6Markup = markup.substring(markup.indexOf('id="aee-scene-6"'), markup.indexOf('id="aee-scene-7"'));
  assert.ok(!s6Markup.includes('---->'), 'Zero ASCII slop arrows in Scene 6 (----> is strictly eliminated)');

  const mockDOM = parseMockHTML(markup);
  const growthSvg = mockDOM.querySelector('#aee-s6-growth-svg');
  const waterfall = mockDOM.querySelector('#aee-s6-waterfall');
  const rateSvg = mockDOM.querySelector('#aee-s6-rate-svg');

  assert.ok(growthSvg, 'Growth sensitivity coordinate curve exists');
  assert.ok(waterfall, 'Cash flow transmission waterfall exists');
  assert.ok(rateSvg, 'Cost of capital sensitivity coordinate curve exists');

  // Early in Scene 6 (p = 0.68)
  updateCinematicHero(mockDOM, 0.68);
  const gTracerEarly = mockDOM.querySelector('#aee-s6-growth-tracer');
  const rTracerEarly = mockDOM.querySelector('#aee-s6-rate-tracer');
  const gEarlyX = parseFloat(gTracerEarly.getAttribute('cx'));
  const rEarlyX = parseFloat(rTracerEarly.getAttribute('cx'));

  assert.ok(gEarlyX > 140, 'Growth tracer begins near 8% base case (x > 140)');
  assert.ok(rEarlyX < 65, 'Rate tracer begins near 7% base case (x < 65)');

  // Late in Scene 6 (p = 0.74)
  updateCinematicHero(mockDOM, 0.74);
  const gTracerLate = mockDOM.querySelector('#aee-s6-growth-tracer');
  const rTracerLate = mockDOM.querySelector('#aee-s6-rate-tracer');
  const gLateX = parseFloat(gTracerLate.getAttribute('cx'));
  const rLateX = parseFloat(rTracerLate.getAttribute('cx'));
  const gReadout = mockDOM.querySelector('#aee-s6-growth-readout');
  const rReadout = mockDOM.querySelector('#aee-s6-rate-readout');

  assert.ok(gLateX < gEarlyX, 'Growth tracer moves left toward lower 5% terminal');
  assert.ok(rLateX > rEarlyX, 'Rate tracer moves right toward higher 9% discount rate');
  assert.ok(gReadout.textContent.includes('5.'), 'Growth readout displays compressed terminal multiple');
  assert.ok(rReadout.textContent.includes('-3'), 'Rate readout displays equity value compression (-33%)');

  // Reduced motion compliance
  updateCinematicHero(mockDOM, 0.72, true);
  assert.strictEqual(gTracerLate.getAttribute('cx'), '107.5', 'Growth tracer rests at equilibrium under reduced motion');
  assert.strictEqual(rTracerLate.getAttribute('cx'), '102.5', 'Rate tracer rests at equilibrium under reduced motion');
});





