/**
 * Exponential Compounding Simulation Widget
 * Models principal, annual rate, continuous vs annual compounding, and rule of 72.
 * Pure Swiss Bauhaus monochrome broadsheet design language.
 */

import { calculateCompoundInterest, ruleOf72 } from '../../engines/financeMath.js';

export function renderCompoundWidget(container, initialProps = {}) {
  let principal = initialProps.principal || 5000;
  let rate = initialProps.rate || 8;
  let years = initialProps.years || 30;
  let annualContribution = initialProps.contribution !== undefined ? initialProps.contribution : 1200;

  function update() {
    const data = calculateCompoundInterest(principal, rate, years, 1, annualContribution);
    const dTime = ruleOf72(rate);
    const maxVal = Math.max(...data.history.map(d => d.balance), 1000);

    const width = 540;
    const height = 240;
    const padding = { top: 20, right: 30, bottom: 30, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const points = data.history.map(d => {
      const x = padding.left + (d.year / years) * chartW;
      const y = padding.top + chartH - (d.balance / maxVal) * chartH;
      return `${x},${y}`;
    }).join(' ');

    const contribPoints = data.history.map(d => {
      const x = padding.left + (d.year / years) * chartW;
      const y = padding.top + chartH - (d.contributed / maxVal) * chartH;
      return `${x},${y}`;
    }).join(' ');

    const last = data.history[data.history.length - 1];

    container.innerHTML = `
      <div class="widget-box p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl text-slate-100">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Interactive Simulation</span>
            <h4 class="text-base font-bold text-white">Exponential Compound Curve</h4>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400">Rule of 72 Doubling Time</span>
            <p class="text-sm font-bold text-white font-mono">${dTime === Infinity ? 'Never' : dTime + ' Years'}</p>
          </div>
        </div>

        <!-- SVG Chart -->
        <div class="my-3 relative overflow-hidden rounded-lg bg-slate-950/60 p-2 border border-slate-800">
          <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto select-none">
            <!-- Grid lines -->
            <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="#334155" stroke-dasharray="3 3"/>
            <line x1="${padding.left}" y1="${padding.top + chartH / 2}" x2="${width - padding.right}" y2="${padding.top + chartH / 2}" stroke="#334155" stroke-dasharray="3 3"/>
            <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="#475569"/>

            <!-- Area fill for interest -->
            <polygon points="${padding.left},${padding.top + chartH} ${points} ${width - padding.right},${padding.top + chartH}" fill="rgba(255, 255, 255, 0.08)"/>

            <!-- Contributed Line -->
            <polyline fill="none" stroke="#71717a" stroke-width="2" stroke-dasharray="4 4" points="${contribPoints}"/>

            <!-- Total Balance Curve -->
            <polyline fill="none" stroke="#ffffff" stroke-width="3.5" points="${points}"/>

            <!-- Final marker point -->
            <circle cx="${width - padding.right}" cy="${padding.top + chartH - (last.balance / maxVal) * chartH}" r="6" fill="#ffffff" stroke="#060709" stroke-width="2"/>

            <!-- Labels -->
            <text x="${padding.left}" y="${padding.top + 12}" fill="#94a3b8" font-size="11">$${(maxVal / 1000).toFixed(0)}k</text>
            <text x="${padding.left}" y="${padding.top + chartH - 4}" fill="#94a3b8" font-size="11">$0</text>
            <text x="${width - padding.right}" y="${padding.top + chartH + 18}" fill="#94a3b8" font-size="11" text-anchor="end">Year ${years}</text>
          </svg>

          <!-- Floating metrics -->
          <div class="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800/80 text-center">
            <div class="bg-slate-800/40 p-1.5 rounded">
              <span class="text-[11px] text-slate-400 block">Total Principal</span>
              <span class="text-sm font-bold text-slate-300 font-mono">$${last.contributed.toLocaleString()}</span>
            </div>
            <div class="bg-slate-800/40 p-1.5 rounded">
              <span class="text-[11px] text-slate-400 block">Pure Interest</span>
              <span class="text-sm font-bold text-white font-mono">+$${last.interestEarned.toLocaleString()}</span>
            </div>
            <div class="bg-slate-800/40 p-1.5 rounded border border-white/20">
              <span class="text-[11px] text-slate-300 block">Future Value</span>
              <span class="text-base font-extrabold text-white font-mono">$${last.balance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div class="space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Annual Return:</span>
              <strong class="text-white font-mono">${rate}%</strong>
            </div>
            <input type="range" min="1" max="15" step="0.5" value="${rate}" class="rate-slider w-full accent-white cursor-pointer"/>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Time Horizon:</span>
              <strong class="text-white font-mono">${years} yrs</strong>
            </div>
            <input type="range" min="5" max="40" step="1" value="${years}" class="years-slider w-full accent-white cursor-pointer"/>
          </div>

          <div class="space-y-1">
            <div class="flex justify-between">
              <span class="text-slate-400">Annual Contrib:</span>
              <strong class="text-white font-mono">$${annualContribution}</strong>
            </div>
            <input type="range" min="0" max="10000" step="200" value="${annualContribution}" class="contrib-slider w-full accent-white cursor-pointer"/>
          </div>
        </div>
      </div>
    `;

    container.querySelector('.rate-slider').oninput = (e) => {
      rate = parseFloat(e.target.value);
      update();
    };
    container.querySelector('.years-slider').oninput = (e) => {
      years = parseInt(e.target.value);
      update();
    };
    container.querySelector('.contrib-slider').oninput = (e) => {
      annualContribution = parseInt(e.target.value);
      update();
    };
  }

  update();
}
