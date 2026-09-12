/**
 * Bond Yield vs Price Seesaw Visualizer Widget
 * Demonstrates the inverse relationship between market yield and bond valuation.
 * Pure Swiss Bauhaus monochrome broadsheet design language.
 */

import { calculateBondPrice } from '../../engines/financeMath.js';

export function renderBondSeesawWidget(container, initialProps = {}) {
  let faceValue = 1000;
  let coupon = initialProps.coupon || 5;
  let yieldRate = initialProps.yield || 5;
  let maturity = initialProps.maturity || 10;

  function update() {
    const bond = calculateBondPrice(faceValue, coupon, yieldRate, maturity, 2);
    const priceDiff = Math.round((bond.price - faceValue) * 100) / 100;
    const angle = Math.max(-22, Math.min(22, -(yieldRate - coupon) * 3.5));

    container.innerHTML = `
      <div class="widget-box p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl text-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Fixed Income Seesaw</span>
            <h4 class="text-base font-bold text-white">Price vs. Yield Inversion</h4>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400">Modified Duration</span>
            <p class="text-sm font-bold text-white font-mono">${bond.modifiedDuration} yrs</p>
          </div>
        </div>

        <!-- Seesaw graphic -->
        <div class="my-4 py-4 bg-slate-950/70 rounded-lg p-3 border border-slate-800 flex flex-col items-center select-none">
          <div class="relative w-80 h-28 flex items-center justify-center">
            <!-- Fulcrum (triangle) -->
            <div class="absolute bottom-2 w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[36px] border-b-slate-600 z-0"></div>
            <div class="absolute bottom-0 w-24 h-2 bg-slate-700 rounded z-0"></div>

            <!-- Rotating Plank -->
            <div class="plank absolute w-72 h-3.5 bg-white/30 border border-white/60 rounded-full transition-transform duration-200 z-10 flex items-center justify-between px-3"
                 style="transform: rotate(${angle}deg)">
              <div class="bg-slate-900/95 px-2 py-1 rounded border border-white/20 text-[11px] font-bold text-white shadow -translate-y-5">
                Price: $${bond.price.toFixed(0)}
              </div>
              <div class="bg-slate-900/95 px-2 py-1 rounded border border-white/20 text-[11px] font-bold text-slate-300 shadow -translate-y-5">
                Yield: ${yieldRate}%
              </div>
            </div>
          </div>

          <div class="w-full grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-center text-xs">
            <div class="bg-slate-800/40 p-2 rounded">
              <span class="text-slate-400 block text-[11px]">Trading Status</span>
              <span class="font-bold text-white font-mono">
                ${priceDiff > 0 ? `Premium (+$${priceDiff})` : priceDiff < 0 ? `Discount (-$${Math.abs(priceDiff)})` : 'Trading at Par ($1000)'}
              </span>
            </div>
            <div class="bg-slate-800/40 p-2 rounded">
              <span class="text-slate-400 block text-[11px]">Sensitivity to +100 bps Hike</span>
              <span class="font-bold text-slate-300 font-mono">${bond.estimatedPriceChangePer100Bps}%</span>
            </div>
          </div>
        </div>

        <div class="space-y-2 mt-2 text-xs">
          <div>
            <div class="flex justify-between mb-1">
              <span class="text-slate-300">Market Yield: <strong class="text-white font-mono">${yieldRate}%</strong></span>
              <span class="text-slate-400">Par Rate = ${coupon}%</span>
            </div>
            <input type="range" min="0" max="14" step="0.25" value="${yieldRate}" class="yield-slider w-full accent-white cursor-pointer"/>
          </div>

          <div class="grid grid-cols-2 gap-3 pt-1">
            <div>
              <div class="flex justify-between mb-1 text-[11px]">
                <span class="text-slate-300">Fixed Coupon: <strong>${coupon}%</strong></span>
              </div>
              <input type="range" min="1" max="10" step="0.5" value="${coupon}" class="coupon-slider w-full accent-white cursor-pointer"/>
            </div>
            <div>
              <div class="flex justify-between mb-1 text-[11px]">
                <span class="text-slate-300">Maturity: <strong>${maturity} yrs</strong></span>
              </div>
              <input type="range" min="1" max="30" step="1" value="${maturity}" class="maturity-slider w-full accent-white cursor-pointer"/>
            </div>
          </div>
        </div>
      </div>
    `;

    container.querySelector('.yield-slider').oninput = (e) => {
      yieldRate = parseFloat(e.target.value);
      update();
    };
    container.querySelector('.coupon-slider').oninput = (e) => {
      coupon = parseFloat(e.target.value);
      update();
    };
    container.querySelector('.maturity-slider').oninput = (e) => {
      maturity = parseInt(e.target.value);
      update();
    };
  }

  update();
}
