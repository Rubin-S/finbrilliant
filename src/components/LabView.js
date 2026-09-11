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
    { id: 'orderbook', label: '⚡ Order Book & Matching Engine', icon: '⚡' },
    { id: 'options', label: '🎯 Options & Greeks Visualizer', icon: '🎯' },
    { id: 'dcf', label: '🏛️ DCF Valuation Model', icon: '🏛️' },
    { id: 'mpt', label: '⚖️ Portfolio Efficient Frontier', icon: '⚖️' },
    { id: 'compound', label: '📈 Compound Interest & FIRE', icon: '📈' },
    { id: 'bonds', label: '🌐 Bond Yield Seesaw', icon: '🌐' }
  ];

  function render() {
    container.innerHTML = `
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <!-- Header -->
        <div class="mb-6">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
            <span>🧪</span> <span>Quantitative Sandbox</span>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Financial Modeling Lab</h1>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">First-principles playgrounds without lesson constraints. Manipulate parameters and observe mechanics.</p>
        </div>

        <!-- Simulator Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none select-none">
          ${tabs.map(t => `
            <button class="lab-tab-btn whitespace-nowrap px-4 py-2.5 rounded-2xl font-bold text-xs transition flex items-center gap-2 border select-none ${
              activeTab === t.id 
                ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20' 
                : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm'
            }" data-tab-id="${t.id}">
              <span>${t.icon}</span>
              <span>${t.label}</span>
            </button>
          `).join('')}
        </div>

        <!-- Sandbox Mount Area -->
        <div id="sandbox-active-mount" class="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl transition-all"></div>
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
