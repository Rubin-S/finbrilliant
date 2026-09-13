import test from 'node:test';
import assert from 'node:assert';
import { FinancialWorldEngine } from '../src/engines/financialWorldEngine.js';
import { renderFinancialWorldWidget } from '../src/components/widgets/financialWorldWidget.js';

// Minimal mock DOM for testing widget rendering
class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.attributes = {};
    this._innerHTML = '';
    this.children = [];
    this.style = {};
    this.value = '';
    this.textContent = '';
    this.onclick = null;
    this.oninput = null;
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  setAttribute(name, val) {
    this.attributes[name] = String(val);
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = val;
    this._parseHTML(val);
  }

  _parseHTML(html) {
    this.children = [];
    // Extract elements with id
    const idMatches = html.matchAll(/id=["']([^"']+)["']/g);
    for (const match of idMatches) {
      const el = new MockElement('div');
      el.setAttribute('id', match[1]);
      this.children.push(el);
    }
    // Extract elements with class sector-card
    const sectorMatches = html.matchAll(/class=["'][^"']*sector-card[^"']*["'][^>]*data-sector=["']([^"']+)["']/g);
    for (const match of sectorMatches) {
      const el = new MockElement('div');
      el.setAttribute('class', 'sector-card');
      el.setAttribute('data-sector', match[1]);
      this.children.push(el);
    }
    // Extract elements with class sim-scenario-btn
    const scenarioMatches = html.matchAll(/class=["'][^"']*sim-scenario-btn[^"']*["'][^>]*data-scenario=["']([^"']+)["']/g);
    for (const match of scenarioMatches) {
      const el = new MockElement('button');
      el.setAttribute('class', 'sim-scenario-btn');
      el.setAttribute('data-scenario', match[1]);
      this.children.push(el);
    }
  }

  querySelector(selector) {
    if (selector.startsWith('#')) {
      const id = selector.slice(1);
      return this.children.find(c => c.getAttribute('id') === id) || null;
    }
    return null;
  }

  querySelectorAll(selector) {
    if (selector.startsWith('.')) {
      const cls = selector.slice(1);
      return this.children.filter(c => (c.getAttribute('class') || '').includes(cls));
    }
    return [];
  }
}

test('FinancialWorldEngine initializes with valid 6-sector state and verified SFC conservation', () => {
  const engine = new FinancialWorldEngine();
  
  // 1. Sector presence
  assert.ok(engine.centralBank, 'Central Bank sector must exist');
  assert.ok(engine.commercialBanks, 'Commercial Banks sector must exist');
  assert.ok(engine.corporations, 'Corporations sector must exist');
  assert.ok(engine.households, 'Households sector must exist');
  assert.ok(engine.government, 'Government sector must exist');
  assert.ok(engine.financialMarkets, 'Financial Markets sector must exist');

  // 2. Initial parameters
  assert.strictEqual(engine.centralBank.policyRate, 4.00);
  assert.ok(engine.macro.gdp > 4000, 'Real GDP should exceed 4000B');
  assert.strictEqual(engine.macro.targetInflation, 2.00);

  // 3. Stock-Flow Consistency Invariant
  const audit = engine.getSystemConservationAudit();
  assert.ok(audit.isConsistent, 'System must be stock-flow consistent at baseline');
  assert.strictEqual(audit.netDiscrepancy, 0.00, 'Sum of all net financial discrepancies must be 0.00');
});

test('FinancialWorldEngine Taylor Rule computes policy rate deterministically', () => {
  const engine = new FinancialWorldEngine();
  engine.centralBank.policyRate = 4.00;
  engine.macro.inflationRate = 4.00; // 2% inflation gap
  engine.macro.outputGap = 1.00; // 1% output gap
  
  engine.toggleTaylorRule(true);
  
  // Taylor rate = rNeutral(2.5) + pi(4.0) + 0.5*(4-2) + 0.5*(1.0) = 2.5 + 4.0 + 1.0 + 0.5 = 8.00%
  assert.strictEqual(engine.centralBank.policyRate, 8.00);
  assert.ok(engine.centralBank.taylorRuleActive, 'Taylor rule flag should be active');
});

test('FinancialWorldEngine Nelson-Siegel term structure reprices 10Y bond convexity', () => {
  const engine = new FinancialWorldEngine();
  
  // Baseline at 4.00% policy rate
  engine.setPolicyRate(4.00);
  const baselinePrice = engine.financialMarkets.bondPrice10Y;
  
  // Hike to 6.00% policy rate
  engine.setPolicyRate(6.00);
  const hikedPrice = engine.financialMarkets.bondPrice10Y;
  
  assert.ok(hikedPrice < baselinePrice, 'Bond price must drop when interest rates rise');
  assert.ok(engine.financialMarkets.yield10Y > 4.25, '10Y yield must rise');
  
  // Check yield curve tenors
  const tenors = engine.financialMarkets.yieldCurve.map(y => y.tenor);
  assert.deepStrictEqual(tenors, ['3M', '2Y', '5Y', '10Y', '30Y']);
});

test('FinancialWorldEngine corporate DCF valuation responds dynamically to interest rates', () => {
  const engine = new FinancialWorldEngine();
  
  engine.setPolicyRate(3.00);
  const lowRateSharePrice = engine.corporations.sharePrice;
  const lowRateWACC = engine.corporations.wacc;
  
  engine.setPolicyRate(7.00);
  const highRateSharePrice = engine.corporations.sharePrice;
  const highRateWACC = engine.corporations.wacc;
  
  assert.ok(highRateWACC > lowRateWACC, 'WACC must rise when policy rate increases');
  assert.ok(highRateSharePrice < lowRateSharePrice, 'Share price must drop when discount rate increases');
});

test('FinancialWorldEngine Quantitative Easing expands central bank and commercial bank balance sheets', () => {
  const engine = new FinancialWorldEngine();
  const initialCBReserves = engine.centralBank.reserves;
  const initialBankReserves = engine.commercialBanks.reserves;
  
  engine.toggleQE(true);
  
  assert.ok(engine.centralBank.reserves > initialCBReserves, 'Central bank reserves expand under QE');
  assert.ok(engine.commercialBanks.reserves > initialBankReserves, 'Commercial bank reserves expand under QE');
  assert.strictEqual(engine.centralBank.qeActive, true);
  
  // Stock-Flow Consistency remains intact
  const audit = engine.getSystemConservationAudit();
  assert.ok(audit.isConsistent, 'System must maintain SFC conservation after QE');
});

test('FinancialWorldEngine loads historical crisis scenarios accurately', () => {
  const engine = new FinancialWorldEngine();
  
  // 1. 2008 GFC
  engine.loadScenario('gfc_2008');
  assert.strictEqual(engine.centralBank.policyRate, 0.25, 'GFC policy rate should drop to near zero');
  assert.strictEqual(engine.financialMarkets.creditSpreadBps, 580, 'GFC credit spreads spike');
  assert.strictEqual(engine.centralBank.qeActive, true, 'QE should be active in GFC');
  
  // 2. 1979 Volcker
  engine.loadScenario('volcker_1979');
  assert.strictEqual(engine.centralBank.policyRate, 15.50, 'Volcker policy rate jumps to 15.50%');
  assert.strictEqual(engine.macro.inflationRate, 12.8, 'High inflation in 1979');
  
  // 3. 2020 Covid
  engine.loadScenario('covid_2020');
  assert.strictEqual(engine.centralBank.policyRate, 0.25);
  assert.strictEqual(engine.centralBank.qeActive, true);
  
  // 4. Baseline reset
  engine.loadScenario('baseline');
  assert.strictEqual(engine.centralBank.policyRate, 4.00);
  assert.strictEqual(engine.financialMarkets.creditSpreadBps, 180);
});

test('FinancialWorldEngine advances simulation clock and accumulates balances', () => {
  const engine = new FinancialWorldEngine();
  const initialClock = engine.clock;
  const initialDebt = engine.government.treasuryDebtStock;
  
  engine.step(1);
  
  assert.strictEqual(engine.clock, initialClock + 1);
  assert.ok(engine.government.treasuryDebtStock >= initialDebt, 'Debt stock accumulates from deficit');
  
  const audit = engine.getSystemConservationAudit();
  assert.ok(audit.isConsistent, 'Conservation must hold across simulation ticks');
});

test('renderFinancialWorldWidget mounts and binds interactive controls', () => {
  const container = new MockElement('div');
  const engine = new FinancialWorldEngine();
  
  const cleanup = renderFinancialWorldWidget(container, { engine });
  
  assert.ok(container.innerHTML.includes('SYSTEM METABOLISM'), 'HUD metabolism header rendered');
  assert.ok(container.innerHTML.includes('1. Central Bank'), 'Central bank sector card rendered');
  assert.ok(container.innerHTML.includes('2. Commercial Banks'), 'Commercial banks sector card rendered');
  assert.ok(container.innerHTML.includes('3. Corporations'), 'Corporations sector card rendered');
  assert.ok(container.innerHTML.includes('4. Households'), 'Households sector card rendered');
  assert.ok(container.innerHTML.includes('5. Government'), 'Government sector card rendered');
  assert.ok(container.innerHTML.includes('6. Financial Markets'), 'Financial markets sector card rendered');
  assert.ok(container.innerHTML.includes('SFC AUDIT:'), 'SFC audit indicator rendered');

  assert.strictEqual(typeof cleanup, 'function', 'Cleanup function returned');
  cleanup();
});
