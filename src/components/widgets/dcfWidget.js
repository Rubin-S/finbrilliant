/**
 * Discounted Cash Flow (DCF) Valuation Waterfall Widget
 * Visualizes multi-year projected cash flows and their discounted present values.
 */

export function renderDCFWidget(container, initialProps = {}) {
  let discountRate = initialProps.discountRate || 10;
  const cashFlow = initialProps.cashFlow || 1000;
  const years = 5;

  function update() {
    const bars = [];
    for (let yr = 1; yr <= years; yr++) {
      const pv = cashFlow / Math.pow(1 + discountRate / 100, yr);
      bars.push({ year: yr, nominal: cashFlow, pv: Math.round(pv) });
    }

    const totalPV = bars.reduce((acc, b) => acc + b.pv, 0);

    container.innerHTML = `
      <div class="widget-box p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl text-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-emerald-400">DCF Calculator</span>
            <h4 class="text-base font-bold text-white">Present Value Waterfall</h4>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400">5-Yr Total PV</span>
            <p class="text-base font-extrabold text-emerald-400">$${totalPV.toLocaleString()}</p>
          </div>
        </div>

        <div class="my-3 bg-slate-950/70 rounded-lg p-3 border border-slate-800">
          <div class="grid grid-cols-5 gap-2 text-center text-xs">
            ${bars.map(b => {
              const heightPct = Math.round((b.pv / cashFlow) * 100);
              return `
                <div class="flex flex-col items-center justify-end h-36">
                  <span class="text-[11px] font-bold text-emerald-400 mb-1">$${b.pv}</span>
                  <div class="w-full bg-slate-800 rounded-t overflow-hidden flex flex-col justify-end h-28 relative">
                    <div class="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all duration-200" style="height: ${heightPct}%"></div>
                  </div>
                  <span class="text-[10px] text-slate-400 mt-1">Yr ${b.year}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <div class="space-y-2 mt-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-300">Discount Rate (WACC): <strong class="text-emerald-400">${discountRate}%</strong></span>
          </div>
          <input type="range" min="4" max="25" step="0.5" value="${discountRate}" class="wacc-slider w-full accent-emerald-500 cursor-pointer"/>
        </div>
      </div>
    `;

    container.querySelector('.wacc-slider').oninput = (e) => {
      discountRate = parseFloat(e.target.value);
      update();
    };
  }

  update();
}
