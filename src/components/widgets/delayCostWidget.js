/**
 * Cost of Delay Simulation Widget (Alice vs. Bob)
 * Demonstrates the dramatic wealth impact of early compounding versus delayed contributions.
 * Pure Swiss Bauhaus monochrome broadsheet design language.
 */

export function renderDelayCostWidget(container, initialProps = {}) {
  let annualRate = initialProps.rate || 8;
  const annualContrib = 2400; // $200/mo

  function update() {
    const r = annualRate / 100;
    const aliceData = [{ age: 20, balance: 0, contributed: 0 }];
    const bobData = [{ age: 20, balance: 0, contributed: 0 }];

    let aliceBal = 0;
    let aliceContributed = 0;
    let bobBal = 0;
    let bobContributed = 0;

    for (let age = 21; age <= 60; age++) {
      if (age <= 30) {
        aliceBal = (aliceBal + annualContrib) * (1 + r);
        aliceContributed += annualContrib;
      } else {
        aliceBal = aliceBal * (1 + r);
      }
      aliceData.push({ age, balance: Math.round(aliceBal), contributed: aliceContributed });

      if (age > 30) {
        bobBal = (bobBal + annualContrib) * (1 + r);
        bobContributed += annualContrib;
      }
      bobData.push({ age, balance: Math.round(bobBal), contributed: bobContributed });
    }

    const aliceFinal = aliceData[aliceData.length - 1];
    const bobFinal = bobData[bobData.length - 1];
    const maxVal = Math.max(aliceFinal.balance, bobFinal.balance, 50000);

    const width = 540;
    const height = 240;
    const padding = { top: 20, right: 30, bottom: 30, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const alicePts = aliceData.map(d => {
      const x = padding.left + ((d.age - 20) / 40) * chartW;
      const y = padding.top + chartH - (d.balance / maxVal) * chartH;
      return `${x},${y}`;
    }).join(' ');

    const bobPts = bobData.map(d => {
      const x = padding.left + ((d.age - 20) / 40) * chartW;
      const y = padding.top + chartH - (d.balance / maxVal) * chartH;
      return `${x},${y}`;
    }).join(' ');

    container.innerHTML = `
      <div class="widget-box p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl text-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">The Power of Starting Early</span>
            <h4 class="text-base font-bold text-white">Alice vs. Bob: The 10-Year Head Start</h4>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400">Return Assumption</span>
            <p class="text-sm font-bold text-white font-mono">${annualRate}% Annual</p>
          </div>
        </div>

        <div class="my-3 bg-slate-950/70 rounded-lg p-2 border border-slate-800">
          <svg viewBox="0 0 ${width} ${height}" class="w-full h-auto select-none">
            <!-- Grid lines -->
            <line x1="${padding.left}" y1="${padding.top}" x2="${width - padding.right}" y2="${padding.top}" stroke="#334155" stroke-dasharray="3 3"/>
            <line x1="${padding.left}" y1="${padding.top + chartH / 2}" x2="${width - padding.right}" y2="${padding.top + chartH / 2}" stroke="#334155" stroke-dasharray="3 3"/>
            <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="#475569"/>
            <line x1="${padding.left + (10 / 40) * chartW}" y1="${padding.top}" x2="${padding.left + (10 / 40) * chartW}" y2="${padding.top + chartH}" stroke="#475569" stroke-dasharray="2 2"/>

            <!-- Bob Curve (Dashed Silver Line) -->
            <polyline fill="none" stroke="#71717a" stroke-width="2.5" stroke-dasharray="4 4" points="${bobPts}"/>

            <!-- Alice Curve (Solid White Line) -->
            <polyline fill="none" stroke="#ffffff" stroke-width="3.5" points="${alicePts}"/>

            <!-- Axis Labels -->
            <text x="${padding.left}" y="${padding.top + 12}" fill="#94a3b8" font-size="10">$${(maxVal / 1000).toFixed(0)}k</text>
            <text x="${padding.left}" y="${padding.top + chartH - 4}" fill="#94a3b8" font-size="10">$0</text>
            <text x="${padding.left}" y="${padding.top + chartH + 16}" fill="#94a3b8" font-size="10">Age 20</text>
            <text x="${padding.left + (10 / 40) * chartW}" y="${padding.top + chartH + 16}" fill="#cbd5e1" font-size="10" text-anchor="middle">Age 30 (Alice stops)</text>
            <text x="${width - padding.right}" y="${padding.top + chartH + 16}" fill="#94a3b8" font-size="10" text-anchor="end">Age 60</text>
          </svg>

          <!-- Metrics comparison -->
          <div class="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800 text-xs">
            <div class="p-2.5 rounded-lg bg-white/10 border border-white/20">
              <div class="flex items-center justify-between">
                <span class="font-bold text-white">Alice (Invested 20-30 only)</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-semibold">10 yrs</span>
              </div>
              <p class="text-[11px] text-slate-300 mt-1">Total Put In: <strong class="text-white">$${aliceFinal.contributed.toLocaleString()}</strong></p>
              <p class="text-sm font-extrabold text-white font-mono mt-1">Final Wealth: $${aliceFinal.balance.toLocaleString()}</p>
            </div>

            <div class="p-2.5 rounded-lg bg-white/[0.03] border border-white/10">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-300">Bob (Invested 30-60 continuous)</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-semibold">30 yrs</span>
              </div>
              <p class="text-[11px] text-slate-300 mt-1">Total Put In: <strong class="text-white">$${bobFinal.contributed.toLocaleString()}</strong> (3x more!)</p>
              <p class="text-sm font-extrabold text-slate-200 font-mono mt-1">Final Wealth: $${bobFinal.balance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div class="space-y-2 mt-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-300">Annual Return Rate: <strong class="text-white font-mono">${annualRate}%</strong></span>
            <span class="text-slate-400">S&P 500 Historical (~9%)</span>
          </div>
          <input type="range" min="4" max="12" step="0.5" value="${annualRate}" class="delay-rate-slider w-full accent-white cursor-pointer"/>
        </div>
      </div>
    `;

    container.querySelector('.delay-rate-slider').oninput = (e) => {
      annualRate = parseFloat(e.target.value);
      update();
    };
  }

  update();
}
