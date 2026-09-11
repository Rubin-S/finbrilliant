/**
 * Modern Portfolio Theory (MPT) Efficient Frontier Widget
 * Visualizes the 2-asset risk-return hyperbola, correlation effects, and Sharpe ratios.
 */

import { calculateTwoAssetPortfolio, generateEfficientFrontier } from '../../engines/financeMath.js';

export function renderEfficientFrontierWidget(container, initialProps = {}) {
  let correlation = initialProps.correlation !== undefined ? initialProps.correlation : 0.2;
  let weightA = 0.5;
  const rA = 12, sA = 20; // Asset A: Stocks
  const rB = 6, sB = 10;   // Asset B: Bonds

  function update() {
    const frontier = generateEfficientFrontier(rA, sA, rB, sB, correlation, 20);
    const currentPt = calculateTwoAssetPortfolio(rA, sA, rB, sB, correlation, weightA);

    const width = 540;
    const height = 220;
    const padding = { top: 20, right: 30, bottom: 30, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const maxX = 25; // Volatility %
    const maxY = 15; // Return %

    const points = frontier.map(pt => {
      const x = padding.left + (pt.volatility / maxX) * chartW;
      const y = padding.top + chartH - (pt.expectedReturn / maxY) * chartH;
      return `${x},${y}`;
    }).join(' ');

    const curX = padding.left + (currentPt.volatility / maxX) * chartW;
    const curY = padding.top + chartH - (currentPt.expectedReturn / maxY) * chartH;

    container.innerHTML = `
      <div class="widget-box p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl text-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-emerald-400">MPT Frontier</span>
            <h4 class="text-base font-bold text-white">Risk-Return Hyperbola</h4>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400">Portfolio Sharpe</span>
            <p class="text-sm font-bold text-emerald-400">${currentPt.sharpeRatio}</p>
          </div>
        </div>

        <div class="my-3 bg-slate-950/70 rounded-lg p-2 border border-slate-800">
          <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto select-none">
            <!-- Grid lines -->
            <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="#475569"/>
            <line x1="${padding.left}" y1="${padding.top}" x2="${padding.left}" y2="${padding.top + chartH}" stroke="#475569"/>

            <!-- Frontier curve -->
            <polyline fill="none" stroke="#10b981" stroke-width="3" points="${points}"/>

            <!-- Current Portfolio Point -->
            <circle cx="${curX}" cy="${curY}" r="7" fill="#fbbf24" stroke="#78350f" stroke-width="2"/>

            <!-- Axis Labels -->
            <text x="${width - padding.right}" y="${padding.top + chartH + 18}" fill="#94a3b8" font-size="10" text-anchor="end">Risk (Volatility σ %)</text>
            <text x="${padding.left}" y="${padding.top - 6}" fill="#94a3b8" font-size="10">Expected Return (E[R] %)</text>
          </svg>

          <div class="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-center text-xs">
            <div class="bg-slate-800/40 p-1.5 rounded">
              <span class="text-[10px] text-slate-400 block">Stocks / Bonds Mix</span>
              <span class="font-bold text-slate-200">${Math.round(weightA * 100)}% / ${Math.round((1 - weightA) * 100)}%</span>
            </div>
            <div class="bg-slate-800/40 p-1.5 rounded">
              <span class="text-[10px] text-slate-400 block">Expected Return</span>
              <span class="font-bold text-emerald-400">${currentPt.expectedReturn}%</span>
            </div>
            <div class="bg-slate-800/40 p-1.5 rounded">
              <span class="text-[10px] text-slate-400 block">Portfolio Volatility</span>
              <span class="font-bold text-amber-400">${currentPt.volatility}%</span>
            </div>
          </div>
        </div>

        <div class="space-y-2 mt-2 text-xs">
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-slate-300">Correlation (ρ): <strong class="text-emerald-400">${correlation}</strong></span>
              <span class="text-slate-400">${correlation < 0 ? 'Negative Correlation (Huge Benefit)' : correlation === 1 ? 'Zero Diversification' : 'Moderate Correlation'}</span>
            </div>
            <input type="range" min="-1" max="1" step="0.1" value="${correlation}" class="corr-slider w-full accent-emerald-500 cursor-pointer"/>
          </div>

          <div>
            <div class="flex justify-between mb-1">
              <span class="text-slate-300">Stock Weight: <strong class="text-amber-400">${Math.round(weightA * 100)}%</strong></span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value="${weightA}" class="weight-slider w-full accent-amber-500 cursor-pointer"/>
          </div>
        </div>
      </div>
    `;

    container.querySelector('.corr-slider').oninput = (e) => {
      correlation = parseFloat(e.target.value);
      update();
    };
    container.querySelector('.weight-slider').oninput = (e) => {
      weightA = parseFloat(e.target.value);
      update();
    };
  }

  update();
}
