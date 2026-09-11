/**
 * Options Payoff & Greeks Visualizer Widget
 * Models Call/Put payoffs, break-even points, and Black-Scholes Delta.
 */

import { blackScholes } from '../../engines/financeMath.js';

export function renderOptionsPayoffWidget(container, initialProps = {}) {
  let strike = initialProps.strike || 100;
  let premium = initialProps.premium || 5;
  let spot = 100;
  let optionType = initialProps.optionType || 'call';

  function update() {
    const width = 540;
    const height = 220;
    const padding = { top: 20, right: 30, bottom: 30, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minS = 70;
    const maxS = 130;
    const zeroY = padding.top + chartH * 0.6; // horizontal zero P&L line

    const points = [];
    for (let s = minS; s <= maxS; s += 2) {
      let intrinsic = 0;
      if (optionType === 'call') {
        intrinsic = Math.max(0, s - strike);
      } else {
        intrinsic = Math.max(0, strike - s);
      }
      const pnl = intrinsic - premium;
      const x = padding.left + ((s - minS) / (maxS - minS)) * chartW;
      const y = zeroY - pnl * 4.5;
      points.push(`${x},${y}`);
    }

    const breakEven = optionType === 'call' ? strike + premium : strike - premium;
    const bs = blackScholes(spot, strike, 0.25, 5, 25);

    container.innerHTML = `
      <div class="widget-box p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl text-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-emerald-400">Derivatives Lab</span>
            <h4 class="text-base font-bold text-white">${optionType.toUpperCase()} Option Payoff</h4>
          </div>
          <div class="flex gap-2">
            <button class="toggle-call px-2.5 py-1 text-xs font-bold rounded ${optionType === 'call' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}">Call</button>
            <button class="toggle-put px-2.5 py-1 text-xs font-bold rounded ${optionType === 'put' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'}">Put</button>
          </div>
        </div>

        <div class="my-3 bg-slate-950/70 rounded-lg p-2 border border-slate-800">
          <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto select-none">
            <!-- Zero axis -->
            <line x1="${padding.left}" y1="${zeroY}" x2="${width - padding.right}" y2="${zeroY}" stroke="#64748b" stroke-width="1.5"/>
            <text x="${padding.left - 5}" y="${zeroY + 4}" fill="#94a3b8" font-size="10" text-anchor="end">$0</text>

            <!-- Payoff Line -->
            <polyline fill="none" stroke="#10b981" stroke-width="3" points="${points.join(' ')}"/>

            <!-- Strike marker -->
            <line x1="${padding.left + ((strike - minS) / (maxS - minS)) * chartW}" y1="${padding.top}" x2="${padding.left + ((strike - minS) / (maxS - minS)) * chartW}" y2="${padding.top + chartH}" stroke="#e2e8f0" stroke-dasharray="2 2" stroke-width="1"/>
            <text x="${padding.left + ((strike - minS) / (maxS - minS)) * chartW}" y="${padding.top + chartH + 15}" fill="#cbd5e1" font-size="10" text-anchor="middle">Strike $${strike}</text>

            <!-- Break-even marker -->
            <text x="${padding.left + ((breakEven - minS) / (maxS - minS)) * chartW}" y="${zeroY - 8}" fill="#34d399" font-size="10" text-anchor="middle">BE: $${breakEven}</text>
          </svg>

          <div class="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-center">
            <div class="bg-slate-800/40 p-1.5 rounded">
              <span class="text-[10px] text-slate-400 block">Max Loss (Premium)</span>
              <span class="text-xs font-bold text-red-400">-$${premium * 100}</span>
            </div>
            <div class="bg-slate-800/40 p-1.5 rounded">
              <span class="text-[10px] text-slate-400 block">Break-Even Price</span>
              <span class="text-xs font-bold text-emerald-400">$${breakEven}</span>
            </div>
            <div class="bg-slate-800/40 p-1.5 rounded">
              <span class="text-[10px] text-slate-400 block">Estimated Delta (Δ)</span>
              <span class="text-xs font-bold text-emerald-400">${optionType === 'call' ? bs.deltaCall : bs.deltaPut}</span>
            </div>
          </div>
        </div>

        <div class="space-y-2 mt-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-300">Strike Price: <strong class="text-emerald-400">$${strike}</strong></span>
          </div>
          <input type="range" min="80" max="120" step="5" value="${strike}" class="strike-slider w-full accent-emerald-500 cursor-pointer"/>
        </div>
      </div>
    `;

    container.querySelector('.toggle-call').onclick = () => { optionType = 'call'; update(); };
    container.querySelector('.toggle-put').onclick = () => { optionType = 'put'; update(); };
    container.querySelector('.strike-slider').oninput = (e) => { strike = parseInt(e.target.value); update(); };
  }

  update();
}
