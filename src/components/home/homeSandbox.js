/**
 * Interactive Sandbox Controller & Simulators
 * 3 live financial mechanics:
 * 1. 10Y Benchmark Interest Rate & Bond Price Seesaw
 * 2. Discounted Cash Flow (DCF) Equity Valuation & Sensitivity
 * 3. Black-Scholes Options Pricing & Greeks
 * Pure Swiss monochrome styling with high-contrast readouts.
 */

import { calculateBondPrice, calculateDCF, blackScholes } from '../../engines/financeMath.js';

export function setupInteractiveSandbox(container) {
  const sandboxContent = container.querySelector('#sandbox-content');
  const tabRate = container.querySelector('#tab-rate');
  const tabDcf = container.querySelector('#tab-dcf');
  const tabVol = container.querySelector('#tab-vol');
  if (!sandboxContent) return;

  let activeMode = 'rate';

  const updateTabs = (mode) => {
    activeMode = mode;
    [tabRate, tabDcf, tabVol].forEach(t => {
      if (!t) return;
      t.className = 'px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase border border-white/20 bg-transparent text-slate-400 hover:text-white hover:border-white/40 transition cursor-pointer';
    });

    const activeBtn = mode === 'rate' ? tabRate : (mode === 'dcf' ? tabDcf : tabVol);
    if (activeBtn) {
      activeBtn.className = 'px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase border border-white bg-white text-black font-bold transition cursor-pointer';
    }
    renderModeContent();
  };

  const renderModeContent = () => {
    if (activeMode === 'rate') {
      renderRateMode(sandboxContent);
    } else if (activeMode === 'dcf') {
      renderDcfMode(sandboxContent);
    } else if (activeMode === 'vol') {
      renderVolMode(sandboxContent);
    }
  };

  if (tabRate) tabRate.addEventListener('click', () => updateTabs('rate'));
  if (tabDcf) tabDcf.addEventListener('click', () => updateTabs('dcf'));
  if (tabVol) tabVol.addEventListener('click', () => updateTabs('vol'));

  renderModeContent();
}

function renderRateMode(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div>
        <div class="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">VARIABLE 01</div>
        <h3 class="text-xl font-light tracking-wide uppercase text-white mb-2">10Y Benchmark Interest Rate</h3>
        <p class="text-xs text-slate-400 font-sans mb-6">
          When the central bank hikes benchmark rates, existing fixed-rate bonds must reprice immediately so their yield matches new market rates.
        </p>

        <div class="space-y-4 font-mono text-xs">
          <div class="flex justify-between items-center">
            <span class="text-slate-400">BENCHMARK RATE:</span>
            <span id="rate-val-display" class="text-lg font-bold text-white">5.00%</span>
          </div>
          <input id="rate-slider" type="range" min="2.0" max="8.0" step="0.25" value="5.0" class="w-full accent-white cursor-pointer" />
          <div class="flex justify-between text-[10px] text-slate-500">
            <span>2.00% (Low rate environment)</span>
            <span>8.00% (Tight monetary policy)</span>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-xl border border-white/10 bg-[#060709] font-mono space-y-4">
        <div class="flex justify-between items-center pb-3 border-b border-white/10">
          <span class="text-xs text-slate-400">10Y BOND PRICE:</span>
          <span id="rate-price-result" class="text-xl font-bold text-white">$92.28</span>
        </div>
        <div class="flex justify-between items-center pb-3 border-b border-white/10">
          <span class="text-xs text-slate-400">CAPITAL GAIN / LOSS:</span>
          <span id="rate-delta-result" class="text-xs font-bold text-slate-300">-7.72%</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-slate-400">CORPORATE BORROWING COST:</span>
          <span id="rate-borrow-result" class="text-xs font-semibold text-white">6.50% (+150 bps spread)</span>
        </div>
      </div>
    </div>
  `;

  const slider = container.querySelector('#rate-slider');
  const valDisp = container.querySelector('#rate-val-display');
  const priceDisp = container.querySelector('#rate-price-result');
  const deltaDisp = container.querySelector('#rate-delta-result');
  const borrowDisp = container.querySelector('#rate-borrow-result');

  if (!slider) return;

  const recalcRate = () => {
    const rateVal = parseFloat(slider.value);
    if (valDisp) valDisp.textContent = `${rateVal.toFixed(2)}%`;
    const res = calculateBondPrice(100, 4, rateVal, 10, 1);
    const price = res.price;
    if (priceDisp) priceDisp.textContent = `$${price.toFixed(2)}`;
    const delta = ((price - 100) / 100) * 100;
    if (deltaDisp) {
      deltaDisp.textContent = `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}%`;
      deltaDisp.className = `text-xs font-bold ${delta >= 0 ? 'text-white' : 'text-slate-400'}`;
    }
    if (borrowDisp) borrowDisp.textContent = `${(rateVal + 1.5).toFixed(2)}% (+150 bps spread)`;
  };

  slider.addEventListener('input', recalcRate);
  recalcRate();
}

function renderDcfMode(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div>
        <div class="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">VARIABLE 02</div>
        <h3 class="text-xl font-light tracking-wide uppercase text-white mb-2">Discounted Cash Flow Model</h3>
        <p class="text-xs text-slate-400 font-sans mb-6">
          A company is worth the present value of its future cash flows. Small changes in growth expectations or discount rates radically alter equity valuations.
        </p>

        <div class="space-y-5 font-mono text-xs">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-slate-400">CASH FLOW GROWTH (g):</span>
              <span id="dcf-growth-display" class="text-sm font-bold text-white">5.00%</span>
            </div>
            <input id="dcf-growth-slider" type="range" min="2.0" max="8.0" step="0.5" value="5.0" class="w-full accent-white cursor-pointer" />
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-slate-400">DISCOUNT RATE (WACC):</span>
              <span id="dcf-wacc-display" class="text-sm font-bold text-white">9.00%</span>
            </div>
            <input id="dcf-wacc-slider" type="range" min="8.5" max="15.0" step="0.5" value="9.0" class="w-full accent-white cursor-pointer" />
          </div>
        </div>
      </div>

      <div class="p-6 rounded-xl border border-white/10 bg-[#060709] font-mono space-y-4">
        <div class="flex justify-between items-center pb-3 border-b border-white/10">
          <span class="text-xs text-slate-400">SHARE VALUATION:</span>
          <span id="dcf-val-result" class="text-xl font-bold text-white">$68.27</span>
        </div>
        <div class="flex justify-between items-center pb-3 border-b border-white/10">
          <span class="text-xs text-slate-400">BASE CASE COMPARISON:</span>
          <span id="dcf-base-result" class="text-xs text-slate-300">Base case at 8% g / 7% r: $102.41</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-xs text-slate-400">VALUATION SENSITIVITY:</span>
          <span id="dcf-elasticity-result" class="text-xs font-semibold text-slate-400">-33.3% multiple contraction</span>
        </div>
      </div>
    </div>
  `;

  const gSlider = container.querySelector('#dcf-growth-slider');
  const wSlider = container.querySelector('#dcf-wacc-slider');
  const gDisp = container.querySelector('#dcf-growth-display');
  const wDisp = container.querySelector('#dcf-wacc-display');
  const valDisp = container.querySelector('#dcf-val-result');
  const elastDisp = container.querySelector('#dcf-elasticity-result');

  if (!gSlider || !wSlider) return;

  const recalcDCF = () => {
    const gVal = parseFloat(gSlider.value);
    const wVal = parseFloat(wSlider.value);
    if (gDisp) gDisp.textContent = `${gVal.toFixed(1)}%`;
    if (wDisp) wDisp.textContent = `${wVal.toFixed(1)}%`;

    const res = calculateDCF(3.5, gVal, 5, wVal, 2.5, 1, 0);
    const sharePrice = res.sharePrice;
    if (valDisp) valDisp.textContent = `$${sharePrice.toFixed(2)}`;

    const basePrice = 102.41;
    const diff = ((sharePrice - basePrice) / basePrice) * 100;
    if (elastDisp) {
      elastDisp.textContent = `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}% valuation change`;
      elastDisp.className = `text-xs font-semibold ${diff >= 0 ? 'text-white' : 'text-slate-400'}`;
    }
  };

  gSlider.addEventListener('input', recalcDCF);
  wSlider.addEventListener('input', recalcDCF);
  recalcDCF();
}

function renderVolMode(container) {
  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div>
        <div class="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">VARIABLE 03</div>
        <h3 class="text-xl font-light tracking-wide uppercase text-white mb-2">Options Pricing & Greeks</h3>
        <p class="text-xs text-slate-400 font-sans mb-6">
          Derivatives price probability distributions. When volatility increases, the probability of deep in-the-money outcomes expands, boosting option values.
        </p>

        <div class="space-y-4 font-mono text-xs">
          <div class="flex justify-between items-center">
            <span class="text-slate-400">ANNUALIZED VOLATILITY (σ):</span>
            <span id="vol-display" class="text-lg font-bold text-white">30%</span>
          </div>
          <input id="vol-slider" type="range" min="10" max="60" step="5" value="30" class="w-full accent-white cursor-pointer" />
          <div class="flex justify-between text-[10px] text-slate-500">
            <span>10% (Calm market)</span>
            <span>60% (High uncertainty)</span>
          </div>
        </div>
      </div>

      <div class="p-6 rounded-xl border border-white/10 bg-[#060709] font-mono space-y-3">
        <div class="flex justify-between items-center pb-2 border-b border-white/10">
          <span class="text-xs text-slate-400">CALL OPTION PRICE (ATM):</span>
          <span id="vol-call-result" class="text-lg font-bold text-white">$11.92</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-slate-400">DELTA (Δ):</span>
          <span id="vol-delta-result" class="text-white font-semibold">0.59</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-slate-400">GAMMA (Γ):</span>
          <span id="vol-gamma-result" class="text-white font-semibold">0.013</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-slate-400">VEGA (V):</span>
          <span id="vol-vega-result" class="text-white font-semibold">0.39 / vol point</span>
        </div>
      </div>
    </div>
  `;

  const slider = container.querySelector('#vol-slider');
  const vDisp = container.querySelector('#vol-display');
  const callDisp = container.querySelector('#vol-call-result');
  const deltaDisp = container.querySelector('#vol-delta-result');
  const gammaDisp = container.querySelector('#vol-gamma-result');
  const vegaDisp = container.querySelector('#vol-vega-result');

  if (!slider) return;

  const recalcVol = () => {
    const volVal = parseFloat(slider.value);
    if (vDisp) vDisp.textContent = `${volVal.toFixed(0)}%`;
    const res = blackScholes(100, 100, 1.0, 5, volVal);
    if (callDisp) callDisp.textContent = `$${res.callPrice.toFixed(2)}`;
    if (deltaDisp) deltaDisp.textContent = res.deltaCall.toFixed(3);
    if (gammaDisp) gammaDisp.textContent = res.gamma.toFixed(4);
    if (vegaDisp) vegaDisp.textContent = `${res.vega.toFixed(2)} per +1% vol`;
  };

  slider.addEventListener('input', recalcVol);
  recalcVol();
}
