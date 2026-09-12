/**
 * Financial Sandbox Lab View (/lab)
 * Freeform interactive simulators for order books, options, DCF, MPT, and compounding.
 */

import {
  renderCompoundWidget,
  renderOrderBookWidget,
  renderOptionsPayoffWidget,
  renderBondSeesawWidget,
  renderEfficientFrontierWidget,
  renderDCFWidget
} from './InteractiveWidgets.js';
import { soundEngine } from '../audio.js';

export function renderLabView(container, state) {
  let activeTab = 'orderbook';

  const tabs = [
    { id: 'orderbook', label: '1. Order Book & Matching Engine' },
    { id: 'options', label: '2. Options & Greeks Visualizer' },
    { id: 'dcf', label: '3. DCF Valuation Model' },
    { id: 'mpt', label: '4. Portfolio Efficient Frontier' },
    { id: 'compound', label: '5. Compound Growth Equilibrium' },
    { id: 'bonds', label: '6. Bond Yield Seesaw' }
  ];

  function render() {
    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
        
        <!-- Top Micro-Framing Tags -->
        <div class="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-6 select-none border-b border-white/10 pb-3">
          <span>EXPERIMENTAL LABORATORY / FIRST-PRINCIPLES SIMULATION</span>
          <span>FREEFORM PARAMETRIC PLAYGROUND</span>
        </div>

        <!-- Header -->
        <div class="mb-8 border-b border-white/10 pb-6">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[10px] font-mono tracking-widest uppercase text-slate-300 mb-3 select-none">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>Quantitative Sandbox</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-light uppercase tracking-wide text-white">Financial Modeling Lab</h1>
          <p class="aee-editorial-serif text-sm sm:text-base text-slate-300 italic mt-2 max-w-2xl leading-relaxed">
            First-principles playgrounds without lesson constraints. Manipulate parameters and observe mechanics in real time.
          </p>
        </div>

        <!-- Simulator Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none select-none font-mono">
          ${tabs.map(t => `
            <button class="lab-tab-btn whitespace-nowrap px-4 py-2 rounded-lg text-xs tracking-wider uppercase border transition select-none cursor-pointer ${
              activeTab === t.id 
                ? 'bg-white border-white text-black font-bold shadow-lg' 
                : 'bg-white/[0.02] border-white/15 text-slate-400 hover:text-white hover:border-white/30'
            }" data-tab-id="${t.id}">
              <span>${t.label}</span>
            </button>
          `).join('')}
        </div>

        <!-- Sandbox Mount Area -->
        <div id="sandbox-active-mount" class="p-6 sm:p-10 rounded-2xl border border-white/15 bg-white/[0.015] shadow-2xl transition-all"></div>
      </div>
    `;

    // Mount active widget
    const mount = container.querySelector('#sandbox-active-mount');
    if (mount) {
      if (activeTab === 'orderbook') renderOrderBookWidget(mount);
      else if (activeTab === 'options') renderOptionsPayoffWidget(mount, { strike: 100, premium: 5, optionType: 'call' });
      else if (activeTab === 'dcf') renderDCFWidget(mount, { cashFlow: 1000, discountRate: 9 });
      else if (activeTab === 'mpt') renderEfficientFrontierWidget(mount, { correlation: 0.1 });
      else if (activeTab === 'compound') renderCompoundWidget(mount, { principal: 10000, rate: 8.5, years: 30, contribution: 2400 });
      else if (activeTab === 'bonds') renderBondSeesawWidget(mount, { coupon: 4.5, yield: 5.5, maturity: 10 });
    }

    container.querySelectorAll('.lab-tab-btn').forEach(btn => {
      btn.onclick = () => {
        soundEngine.playClick();
        activeTab = btn.getAttribute('data-tab-id');
        render();
      };
    });
  }

  render();
}
