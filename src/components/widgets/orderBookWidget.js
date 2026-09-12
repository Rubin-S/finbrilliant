/**
 * Interactive Order Book & Matching Engine Widget
 * Visualizes Level 2 depth ladder, bid-ask spread, market sweeps, and limit orders.
 * Pure Swiss Bauhaus monochrome broadsheet design language.
 */

import { OrderBook } from '../../engines/orderBookEngine.js';

export function renderOrderBookWidget(container, initialProps = {}) {
  const book = OrderBook.createDefaultBook(100.0, 0.08, 5);
  let lastExecution = null;
  let orderSide = 'buy';

  function update() {
    const bestBid = book.getBestBid();
    const bestAsk = book.getBestAsk();
    const mid = book.getMidPrice();
    const spread = book.getSpread();
    const spreadBps = book.getSpreadBps();
    const { bidDepth, askDepth, maxDepth } = book.getCumulativeDepth();

    const spreadText = spread !== null ? `$${spread.toFixed(2)}` : 'No Spread (One-sided Book)';
    const midText = mid !== null ? `$${mid.toFixed(2)}` : 'N/A';

    container.innerHTML = `
      <div class="widget-box p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 shadow-2xl text-slate-100">
        <div class="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Matching Engine Lab</span>
            <h4 class="text-base font-bold text-white">Live Level 2 Order Book</h4>
          </div>
          <div class="text-right flex items-center gap-3">
            <div>
              <span class="text-xs text-slate-400">Spread: <strong class="text-white font-mono">${spreadText}</strong> ${spread !== null ? `(${spreadBps} bps)` : ''}</span>
              <p class="text-xs text-slate-300">Mid: <strong class="font-mono">${midText}</strong></p>
            </div>
            <button class="reset-book-btn px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition shadow cursor-pointer" title="Reset book liquidity">
              ↺ Reset
            </button>
          </div>
        </div>

        <!-- Book Ladder -->
        <div class="my-3 bg-slate-950/80 rounded-lg p-3 font-mono text-xs border border-slate-800 select-none">
          <div class="flex justify-between text-slate-500 pb-1 border-b border-slate-800/80 uppercase text-[10px]">
            <span>Depth (Shares)</span>
            <span>Price ($)</span>
          </div>

          <!-- ASKS (Subtle Upper Depth) -->
          <div class="space-y-1 my-1.5 min-h-[60px] flex flex-col justify-end">
            ${askDepth.length > 0 ? [...askDepth].reverse().map(ask => {
              const pct = Math.min(100, Math.round((ask.cumQty / maxDepth) * 100));
              return `
                <div class="relative flex justify-between px-2 py-0.5 rounded overflow-hidden">
                  <div class="absolute inset-y-0 right-0 bg-white/[0.06] pointer-events-none transition-all" style="width: ${pct}%"></div>
                  <span class="text-slate-300 z-10">${ask.qty} shs <span class="text-slate-500 text-[10px]">(${ask.cumQty})</span></span>
                  <span class="font-bold text-slate-300 z-10">$${ask.price.toFixed(2)}</span>
                </div>
              `;
            }).join('') : '<div class="text-center text-slate-500 py-1 text-[11px] italic">Asks completely swept!</div>'}
          </div>

          <!-- SPREAD DIVIDER -->
          <div class="py-1 my-1 border-y border-dashed border-white/20 flex justify-between items-center px-2 bg-white/[0.02]">
            <span class="text-[11px] text-white font-mono font-semibold">SPREAD: ${spreadText}</span>
            <span class="text-slate-400 font-mono text-[11px]">MID: ${midText}</span>
          </div>

          <!-- BIDS (High Contrast Lower Depth) -->
          <div class="space-y-1 my-1.5 min-h-[60px]">
            ${bidDepth.length > 0 ? bidDepth.map(bid => {
              const pct = Math.min(100, Math.round((bid.cumQty / maxDepth) * 100));
              return `
                <div class="relative flex justify-between px-2 py-0.5 rounded overflow-hidden">
                  <div class="absolute inset-y-0 right-0 bg-white/[0.14] pointer-events-none transition-all" style="width: ${pct}%"></div>
                  <span class="text-slate-300 z-10">${bid.qty} shs <span class="text-slate-500 text-[10px]">(${bid.cumQty})</span></span>
                  <span class="font-bold text-white z-10">$${bid.price.toFixed(2)}</span>
                </div>
              `;
            }).join('') : '<div class="text-center text-slate-500 py-1 text-[11px] italic">Bids completely swept!</div>'}
          </div>
        </div>

        <!-- Execution Panel: Market & Limit Orders -->
        <div class="space-y-2.5 p-3 bg-slate-800/40 rounded-lg border border-slate-700/60">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-xs text-slate-300 font-medium">Market Order Sweeps:</span>
            <div class="flex items-center gap-1.5">
              <button class="buy-btn bg-white hover:bg-slate-200 text-black font-bold text-xs px-2.5 py-1.5 rounded transition shadow-md active:scale-95 cursor-pointer" data-side="buy" data-shares="50">
                Buy 50
              </button>
              <button class="buy-btn bg-white hover:bg-slate-200 text-black font-bold text-xs px-2.5 py-1.5 rounded transition shadow-md active:scale-95 cursor-pointer" data-side="buy" data-shares="200">
                Buy 200 (Sweep)
              </button>
              <button class="sell-btn bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs px-2.5 py-1.5 rounded transition shadow-md active:scale-95 cursor-pointer" data-side="sell" data-shares="50">
                Sell 50
              </button>
              <button class="sell-btn bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs px-2.5 py-1.5 rounded transition shadow-md active:scale-95 cursor-pointer" data-side="sell" data-shares="200">
                Sell 200 (Sweep)
              </button>
            </div>
          </div>

          <!-- Limit Order Form -->
          <div class="pt-2 border-t border-slate-700/60 flex flex-wrap items-center gap-2 text-xs">
            <span class="text-slate-400 font-medium">Place Limit Order:</span>
            <div class="flex rounded bg-slate-900 border border-slate-700 overflow-hidden">
              <button class="side-btn px-2 py-1 font-bold transition ${orderSide === 'buy' ? 'bg-white text-black' : 'text-slate-400'}" data-set-side="buy">Buy</button>
              <button class="side-btn px-2 py-1 font-bold transition ${orderSide === 'sell' ? 'bg-white text-black' : 'text-slate-400'}" data-set-side="sell">Sell</button>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-slate-400">$</span>
              <input type="number" step="0.05" class="limit-price-input w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono text-xs"
                value="${orderSide === 'buy' ? (bestBid ? (bestBid + 0.01).toFixed(2) : '100.00') : (bestAsk ? (bestAsk - 0.01).toFixed(2) : '100.10')}" />
            </div>
            <div class="flex items-center gap-1">
              <span class="text-slate-400">Qty:</span>
              <input type="number" step="10" min="10" max="500" value="75" class="limit-qty-input w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white font-mono text-xs" />
            </div>
            <button class="submit-limit-btn bg-white hover:bg-slate-200 text-black font-bold px-3 py-1 rounded transition shadow active:scale-95 text-xs cursor-pointer">
              Post Limit
            </button>
          </div>

          ${lastExecution ? `
            <div class="mt-2 p-2 bg-slate-900 rounded border border-white/20 text-xs animate-fade-in font-mono">
              <div class="flex justify-between font-bold text-white">
                <span>${lastExecution.type.toUpperCase()} ${lastExecution.side.toUpperCase()}: ${lastExecution.totalFilled || lastExecution.filledQty} shs filled</span>
                <span>Avg Price: $${Number(lastExecution.avgPrice).toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Remaining/Resting: ${lastExecution.remainingQty || lastExecution.restingQty || 0} shs</span>
                <span>Fills: ${lastExecution.fills.length} level(s)</span>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    container.querySelectorAll('.buy-btn, .sell-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const side = btn.getAttribute('data-side');
        const qty = parseInt(btn.getAttribute('data-shares'));
        lastExecution = book.executeMarketOrder(side, qty);
        update();
      });
    });

    const resetBtn = container.querySelector('.reset-book-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        book.reset();
        lastExecution = null;
        update();
      });
    }

    container.querySelectorAll('.side-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        orderSide = btn.getAttribute('data-set-side');
        update();
      });
    });

    const submitLimitBtn = container.querySelector('.submit-limit-btn');
    if (submitLimitBtn) {
      submitLimitBtn.addEventListener('click', () => {
        const price = parseFloat(container.querySelector('.limit-price-input').value);
        const qty = parseInt(container.querySelector('.limit-qty-input').value);
        if (price > 0 && qty > 0) {
          lastExecution = book.placeLimitOrder(orderSide, price, qty);
          update();
        }
      });
    }
  }

  update();
}
