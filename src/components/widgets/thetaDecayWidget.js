/**
 * Options Theta Decay Acceleration Visualizer Widget
 * Demonstrates the non-linear acceleration of time-decay as options approach expiration.
 */

import { blackScholes } from '../../engines/financeMath.js';

export function renderThetaDecayWidget(container, initialProps = {}) {
  let daysLeft = initialProps.days || 45;
  const spot = 100;
  const strike = 100;
  const r = 5;
  const vol = 25;

  function update() {
    const width = 540;
    const height = 220;
    const padding = { top: 20, right: 30, bottom: 30, left: 50 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const curvePoints = [];
    const maxVal = 7;

    for (let d = 90; d >= 1; d -= 1) {
      const tY = d / 365;
      const bs = blackScholes(spot, strike, tY, r, vol);
      const x = padding.left + ((90 - d) / 90) * chartW;
      const y = padding.top + chartH - (bs.callPrice / maxVal) * chartH;
      curvePoints.push(`${x},${y}`);
    }

    const currentT = Math.max(0.0001, daysLeft / 365);
    const currentBS = blackScholes(spot, strike, currentT, r, vol);
    const curX = padding.left + ((90 - daysLeft) / 90) * chartW;
    const curY = padding.top + chartH - (currentBS.callPrice / maxVal) * chartH;

    container.innerHTML = `
      <div class="widget-box p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl text-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-rose-400">Options Time Decay</span>
            <h4 class="text-base font-bold text-white">Theta (θ) Acceleration Cliff</h4>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400">Daily Decay (θ)</span>
            <p class="text-sm font-bold text-rose-400">$${currentBS.thetaCall} / day</p>
          </div>
        </div>

        <div class="my-3 bg-slate-950/70 rounded-lg p-2 border border-slate-800">
          <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto select-none">
            <!-- Grid lines -->
            <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="#334155" stroke-dasharray="3 3"/>
            <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="#475569"/>
            <!-- 30-day cliff marker -->
            <line x1="${padding.left + (60 / 90) * chartW}" y1="${padding.top}" x2="${padding.left + (60 / 90) * chartW}" y2="${padding.top + chartH}" stroke="#f43f5e" stroke-dasharray="2 2"/>
            <text x="${padding.left + (60 / 90) * chartW}" y="${padding.top + 10}" fill="#f43f5e" font-size="9" text-anchor="middle">30-Day Cliff</text>

            <!-- Decay Curve -->
            <polyline fill="none" stroke="#f43f5e" stroke-width="3" points="${curvePoints.join(' ')}"/>

            <!-- Current Marker -->
            <circle cx="${curX}" cy="${curY}" r="6" fill="#fb7185" stroke="#881337" stroke-width="2"/>

            <!-- Labels -->
            <text x="${padding.left - 5}" y="${padding.top + 12}" fill="#94a3b8" font-size="10" text-anchor="end">$${maxVal}</text>
            <text x="${padding.left - 5}" y="${padding.top + chartH}" fill="#94a3b8" font-size="10" text-anchor="end">$0</text>
            <text x="${padding.left}" y="${padding.top + chartH + 16}" fill="#94a3b8" font-size="10">90 Days</text>
            <text x="${width - padding.right}" y="${padding.top + chartH + 16}" fill="#94a3b8" font-size="10" text-anchor="end">0 Days (Expiry)</text>
          </svg>

          <div class="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-center text-xs">
            <div class="bg-slate-800/40 p-1.5 rounded">
              <span class="text-[10px] text-slate-400 block">ATM Option Value</span>
              <span class="text-sm font-bold text-white">$${currentBS.callPrice}</span>
            </div>
            <div class="bg-slate-800/40 p-1.5 rounded">
              <span class="text-[10px] text-slate-400 block">Daily Theta Burn</span>
              <span class="text-sm font-bold text-rose-400">${currentBS.thetaCall}</span>
            </div>
            <div class="bg-slate-800/40 p-1.5 rounded">
              <span class="text-[10px] text-slate-400 block">Time to Expiration</span>
              <span class="text-sm font-bold text-amber-400">${daysLeft} Days</span>
            </div>
          </div>
        </div>

        <div class="space-y-2 mt-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-300">Days to Expiration: <strong class="text-rose-400">${daysLeft} Days</strong></span>
            <span class="text-slate-400">${daysLeft <= 30 ? '⚠️ High Decay Zone (Cliff)' : 'Mild Linear Decay'}</span>
          </div>
          <input type="range" min="1" max="90" step="1" value="${daysLeft}" class="days-slider w-full accent-rose-500 cursor-pointer"/>
        </div>
      </div>
    `;

    container.querySelector('.days-slider').oninput = (e) => {
      daysLeft = parseInt(e.target.value);
      update();
    };
  }

  update();
}
