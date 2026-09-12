/**
 * Bespoke Quantitative SVG Visual Models & Metadata for Daily Boost Challenges
 * Transforms theoretical finance into intuitive, first-principles visual mechanics.
 * Pure Swiss Bauhaus monochrome broadsheet design language.
 */

export function renderBoostVisualModel(boostId) {
  switch (boostId) {
    case 'boost-1':
      // The Coffee Millionaire Paradox: Compounding Exponential Curve
      return `
        <div class="boost-chart w-full bg-black/5 dark:bg-white/[0.02] rounded-2xl p-4 sm:p-5 border border-black/10 dark:border-white/15 text-slate-900 dark:text-white select-none transition-colors">
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-slate-900 dark:bg-white animate-pulse"></span>
              <strong class="text-slate-900 dark:text-white font-mono tracking-wider">EXPONENTIAL COMPOUND ACCUMULATOR</strong>
            </span>
            <span>$180/mo @ 9% Annualized · 35 Years</span>
          </div>
          <svg viewBox="0 0 600 160" class="w-full h-auto overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="compGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#71717a" class="boost-comp-stop" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#71717a" class="boost-comp-stop" stop-opacity="0.0" />
              </linearGradient>
              <linearGradient id="cashGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#71717a" stop-opacity="0.2" />
                <stop offset="100%" stop-color="#71717a" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <!-- Grid lines -->
            <line x1="40" y1="20" x2="560" y2="20" class="grid-line" stroke-dasharray="4 4" stroke-width="1" />
            <line x1="40" y1="70" x2="560" y2="70" class="grid-line" stroke-dasharray="4 4" stroke-width="1" />
            <line x1="40" y1="120" x2="560" y2="120" class="grid-line" stroke-dasharray="4 4" stroke-width="1" />
            <!-- Axis lines -->
            <line x1="40" y1="135" x2="560" y2="135" class="axis-line" stroke-width="1.5" />
            <line x1="40" y1="15" x2="40" y2="135" class="axis-line" stroke-width="1.5" />
            <!-- Linear Principal Area: 75.6k -->
            <polygon points="40,135 40,135 560,105 560,135" fill="url(#cashGrad)" />
            <line x1="40" y1="135" x2="560" y2="105" stroke="#71717a" stroke-width="2" stroke-dasharray="3 3" />
            <!-- Exponential Compounding Area: 530k -->
            <path d="M 40 135 Q 320 120 440 70 T 560 25 L 560 135 Z" fill="url(#compGrad)" />
            <path d="M 40 135 Q 320 120 440 70 T 560 25" fill="none" class="boost-curve-primary" stroke="#09090b" stroke-width="3" />
            <!-- Peak Data Callout -->
            <circle cx="560" cy="25" r="5" class="boost-peak-circle" fill="#09090b" stroke="#ffffff" stroke-width="2" />
            <text x="555" y="16" fill="currentColor" class="text-slate-900 dark:text-white" font-size="12" font-family="monospace" font-weight="bold" text-anchor="end">$530,000+ (86% Compound Interest)</text>
            <!-- Principal Callout -->
            <circle cx="560" cy="105" r="3.5" fill="#71717a" />
            <text x="555" y="118" class="axis-text" font-size="10" font-family="monospace" text-anchor="end">$75,600 Principal Contributed</text>
            <!-- X Axis Labels -->
            <text x="40" y="150" class="axis-text" font-size="10" font-family="monospace">Year 0</text>
            <text x="300" y="150" class="axis-text" font-size="10" font-family="monospace" text-anchor="middle">Year 17</text>
            <text x="560" y="150" class="axis-text" font-size="10" font-family="monospace" text-anchor="end">Year 35</text>
          </svg>
        </div>
      `;

    case 'boost-2':
      // Flash Arbitrage Challenge: ETF vs Basket NAV Arbitrage Spread
      return `
        <div class="boost-chart w-full bg-black/5 dark:bg-white/[0.02] rounded-2xl p-4 sm:p-5 border border-black/10 dark:border-white/15 text-slate-900 dark:text-white select-none transition-colors">
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-slate-900 dark:bg-white animate-pulse"></span>
              <strong class="text-slate-900 dark:text-white font-mono tracking-wider">ETF CREATION / REDEMPTION ARBITRAGE SPREAD</strong>
            </span>
            <span>Market Price vs Net Asset Value (NAV)</span>
          </div>
          <svg viewBox="0 0 600 130" class="w-full h-auto overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" class="boost-arrow-marker" fill="#09090b" />
              </marker>
            </defs>
            <!-- ETF Price Bar -->
            <rect x="50" y="25" width="220" height="42" rx="8" class="card-subtle" stroke-width="1.5" />
            <text x="65" y="44" class="axis-text" font-size="10" font-family="monospace" font-weight="bold">ETF MARKET PRICE</text>
            <text x="65" y="60" fill="currentColor" class="text-slate-800 dark:text-slate-300" font-size="14" font-family="monospace" font-weight="900">$99.20 <tspan font-size="10" fill="#71717a">(Undervalued)</tspan></text>
            <!-- Basket NAV Bar -->
            <rect x="330" y="25" width="220" height="42" rx="8" class="card-subtle" stroke-width="1.5" />
            <text x="345" y="44" class="axis-text" font-size="10" font-family="monospace" font-weight="bold">UNDERLYING BASKET NAV</text>
            <text x="345" y="60" fill="currentColor" class="text-slate-900 dark:text-white" font-size="14" font-family="monospace" font-weight="900">$100.00 <tspan font-size="10" fill="#71717a">(Fair Value)</tspan></text>
            <!-- Spread Capture Arrow & Badge -->
            <path d="M 270 46 L 330 46" class="boost-curve-primary" stroke="#09090b" stroke-width="2.5" marker-end="url(#arrow)" />
            <rect x="250" y="80" width="100" height="26" rx="6" class="boost-badge-bg" fill="#09090b" />
            <text x="300" y="97" class="boost-badge-text" fill="#ffffff" font-size="11" font-family="monospace" font-weight="900" text-anchor="middle">+$0.80 ARB / SH</text>
            <!-- Execution Step Callouts -->
            <text x="160" y="98" fill="currentColor" class="text-slate-600 dark:text-slate-400" font-size="10" font-family="monospace" text-anchor="middle">1. BUY ETF ($99.20)</text>
            <text x="440" y="98" fill="currentColor" class="text-slate-600 dark:text-slate-400" font-size="10" font-family="monospace" text-anchor="middle">2. SHORT BASKET ($100.00)</text>
          </svg>
        </div>
      `;

    case 'boost-3':
      // Earnings Straddle Intuition: Long ATM Straddle Payoff Curve
      return `
        <div class="boost-chart w-full bg-black/5 dark:bg-white/[0.02] rounded-2xl p-4 sm:p-5 border border-black/10 dark:border-white/15 text-slate-900 dark:text-white select-none transition-colors">
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-slate-900 dark:bg-white animate-pulse"></span>
              <strong class="text-slate-900 dark:text-white font-mono tracking-wider">LONG STRADDLE (ATM CALL + PUT) PAYOFF PROFILE</strong>
            </span>
            <span>Delta-Neutral · Pure Volatility Vega Play</span>
          </div>
          <svg viewBox="0 0 600 140" class="w-full h-auto overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <!-- Zero Profit Line -->
            <line x1="40" y1="80" x2="560" y2="80" class="axis-line" stroke-width="1.5" />
            <text x="565" y="84" class="axis-text" font-size="9" font-family="monospace">P&amp;L = 0</text>
            <!-- Strike Price Marker -->
            <line x1="300" y1="20" x2="300" y2="120" class="grid-line" stroke-dasharray="3 3" stroke-width="1" />
            <text x="300" y="132" class="axis-text" font-size="10" font-family="monospace" text-anchor="middle">Strike K (ATM)</text>
            <!-- Straddle V Payoff Line -->
            <polyline points="60,20 300,110 540,20" fill="none" class="boost-curve-primary" stroke="#09090b" stroke-width="3" />
            <!-- Max Loss Dot at Strike -->
            <circle cx="300" cy="110" r="4.5" class="boost-peak-circle" fill="#71717a" stroke="#09090b" stroke-width="1.5" />
            <text x="300" y="102" fill="currentColor" class="text-slate-600 dark:text-slate-400" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">Max Loss: Net Debit Paid</text>
            <!-- Break-even Callouts -->
            <circle cx="160" cy="80" r="3.5" class="boost-dot-primary" fill="#09090b" />
            <text x="160" y="72" fill="currentColor" class="text-slate-700 dark:text-slate-300" font-size="9" font-family="monospace" text-anchor="middle">Put BE (K - Premium)</text>
            <circle cx="440" cy="80" r="3.5" class="boost-dot-primary" fill="#09090b" />
            <text x="440" y="72" fill="currentColor" class="text-slate-700 dark:text-slate-300" font-size="9" font-family="monospace" text-anchor="middle">Call BE (K + Premium)</text>
            <!-- Profit Zones -->
            <text x="80" y="35" fill="currentColor" class="text-slate-900 dark:text-white" font-size="10" font-family="monospace" font-weight="bold">PROFIT (Big Drop)</text>
            <text x="520" y="35" fill="currentColor" class="text-slate-900 dark:text-white" font-size="10" font-family="monospace" font-weight="bold" text-anchor="end">PROFIT (Big Rally)</text>
          </svg>
        </div>
      `;

    case 'boost-4':
      // The Bond Seesaw Paradox: Yield vs Bond Price Inverse Mechanical Seesaw
      return `
        <div class="boost-chart w-full bg-black/5 dark:bg-white/[0.02] rounded-2xl p-4 sm:p-5 border border-black/10 dark:border-white/15 text-slate-900 dark:text-white select-none transition-colors">
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-slate-900 dark:bg-white animate-pulse"></span>
              <strong class="text-slate-900 dark:text-white font-mono tracking-wider">FIXED INCOME INVERSE RELATIONSHIP (SEESAW)</strong>
            </span>
            <span>Duration Leverage · Rate Hike Impact</span>
          </div>
          <svg viewBox="0 0 600 130" class="w-full h-auto overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <!-- Seesaw Plank (Tilted: Left down, Right up) -->
            <line x1="80" y1="95" x2="520" y2="35" class="boost-curve-primary" stroke="#09090b" stroke-width="4" stroke-linecap="round" />
            <!-- Fulcrum Triangle -->
            <polygon points="300,65 285,115 315,115" class="card-subtle" stroke-width="2" />
            <circle cx="300" cy="65" r="4" class="boost-dot-primary" fill="#09090b" />
            <text x="300" y="125" class="axis-text" font-size="9" font-family="monospace" text-anchor="middle">Fixed Par Fulcrum</text>
            <!-- Left Side: Bond Price (Dipped Down) -->
            <circle cx="100" cy="92" r="24" fill="#71717a" fill-opacity="0.1" stroke="#71717a" stroke-width="2" />
            <text x="100" y="89" fill="currentColor" class="text-slate-700 dark:text-slate-300" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">BOND PRICE</text>
            <text x="100" y="103" fill="currentColor" class="text-slate-600 dark:text-slate-400" font-size="11" font-family="monospace" font-weight="900" text-anchor="middle">DROPS &lt; PAR</text>
            <!-- Right Side: Market Yield (Tilted Up) -->
            <circle cx="500" cy="38" r="24" class="boost-circle-highlight" fill="#09090b" fill-opacity="0.1" stroke="#09090b" stroke-width="2" />
            <text x="500" y="35" fill="currentColor" class="text-slate-800 dark:text-slate-200" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">MARKET YIELD</text>
            <text x="500" y="49" fill="currentColor" class="text-slate-900 dark:text-white" font-size="11" font-family="monospace" font-weight="900" text-anchor="middle">+200 BPS (5%)</text>
          </svg>
        </div>
      `;

    case 'boost-5':
      // Order Book Liquidity Void: Ask Depth Sweep & Slippage
      return `
        <div class="boost-chart w-full bg-black/5 dark:bg-white/[0.02] rounded-2xl p-4 sm:p-5 border border-black/10 dark:border-white/15 text-slate-900 dark:text-white select-none transition-colors">
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-slate-900 dark:bg-white animate-pulse"></span>
              <strong class="text-slate-900 dark:text-white font-mono tracking-wider">ORDER BOOK L2 DEPTH SWEEP EXECUTION</strong>
            </span>
            <span>Market Buy: 500 Shares Across Depth Levels</span>
          </div>
          <svg viewBox="0 0 600 130" class="w-full h-auto overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <!-- Level 1: 100 @ 50.00 -->
            <rect x="50" y="20" width="140" height="34" rx="6" class="card-subtle" stroke="#71717a" stroke-width="1.5" />
            <text x="60" y="36" fill="currentColor" class="text-slate-800 dark:text-slate-200" font-size="10" font-family="monospace" font-weight="bold">ASK 1: $50.00</text>
            <text x="60" y="48" class="axis-text" font-size="9" font-family="monospace">100 shs (Full fill)</text>
            <!-- Level 2: 200 @ 50.50 -->
            <rect x="230" y="20" width="140" height="34" rx="6" class="card-subtle" stroke="#71717a" stroke-width="1.5" />
            <text x="240" y="36" fill="currentColor" class="text-slate-800 dark:text-slate-200" font-size="10" font-family="monospace" font-weight="bold">ASK 2: $50.50</text>
            <text x="240" y="48" class="axis-text" font-size="9" font-family="monospace">200 shs (Full fill)</text>
            <!-- Level 3: 200 of 500 @ 52.00 -->
            <rect x="410" y="20" width="140" height="34" rx="6" class="card-subtle" stroke="#71717a" stroke-width="1.5" />
            <text x="420" y="36" fill="currentColor" class="text-slate-800 dark:text-slate-200" font-size="10" font-family="monospace" font-weight="bold">ASK 3: $52.00</text>
            <text x="420" y="48" class="axis-text" font-size="9" font-family="monospace">200 shs (Partial fill)</text>
            <!-- Execution Path Line & Weighted Result -->
            <path d="M 120 54 L 120 75 L 480 75 L 480 54" fill="none" class="boost-curve-primary" stroke="#09090b" stroke-width="2" stroke-dasharray="4 4" />
            <rect x="170" y="85" width="260" height="30" rx="8" class="boost-badge-bg" fill="#09090b" />
            <text x="300" y="104" class="boost-badge-text" fill="#ffffff" font-size="12" font-family="monospace" font-weight="900" text-anchor="middle">AVG EXECUTION FILL = $51.00</text>
          </svg>
        </div>
      `;

    case 'boost-6':
      // Markowitz Free Lunch: Modern Portfolio Theory Diversification Curve
      return `
        <div class="boost-chart w-full bg-black/5 dark:bg-white/[0.02] rounded-2xl p-4 sm:p-5 border border-black/10 dark:border-white/15 text-slate-900 dark:text-white select-none transition-colors">
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-slate-900 dark:bg-white animate-pulse"></span>
              <strong class="text-slate-900 dark:text-white font-mono tracking-wider">MARKOWITZ EFFICIENT FRONTIER (FREE LUNCH)</strong>
            </span>
            <span>Two Assets @ 20% Volatility, Correlation ρ = 0.0</span>
          </div>
          <svg viewBox="0 0 600 130" class="w-full h-auto overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <!-- Axes -->
            <line x1="60" y1="110" x2="540" y2="110" class="axis-line" stroke-width="1.5" />
            <line x1="60" y1="15" x2="60" y2="110" class="axis-line" stroke-width="1.5" />
            <text x="540" y="125" class="axis-text" font-size="9" font-family="monospace" text-anchor="end">Volatility σ (Risk)</text>
            <text x="50" y="20" class="axis-text" font-size="9" font-family="monospace">Return E(R)</text>
            <!-- Individual Assets Dots -->
            <circle cx="480" cy="30" r="5" fill="#71717a" stroke="#ffffff" stroke-width="1.5" />
            <text x="470" y="25" fill="currentColor" class="text-slate-700 dark:text-slate-300" font-size="10" font-family="monospace" font-weight="bold" text-anchor="end">Asset A (20% Vol, 10% Ret)</text>
            <circle cx="480" cy="90" r="5" fill="#71717a" stroke="#ffffff" stroke-width="1.5" />
            <text x="470" y="98" fill="currentColor" class="text-slate-700 dark:text-slate-300" font-size="10" font-family="monospace" font-weight="bold" text-anchor="end">Asset B (20% Vol, 10% Ret)</text>
            <!-- Diversification Hyperbolic Curve bowing left -->
            <path d="M 480 30 Q 230 60 480 90" fill="none" class="boost-curve-primary" stroke="#09090b" stroke-width="3" />
            <!-- Free Lunch Vertex Point -->
            <circle cx="340" cy="60" r="6" class="boost-peak-circle" fill="#09090b" stroke="#ffffff" stroke-width="2" />
            <text x="330" y="52" fill="currentColor" class="text-slate-900 dark:text-white" font-size="12" font-family="monospace" font-weight="900" text-anchor="end">50/50 Portfolio: 14.14% Vol</text>
            <text x="330" y="66" class="axis-text" font-size="9" font-family="monospace" text-anchor="end">Identical 10% Return · -29.3% Risk</text>
          </svg>
        </div>
      `;

    case 'boost-7':
      // DCF Terminal Value Dominance: Explicit FCF vs Perpetuity Capitalization
      return `
        <div class="boost-chart w-full bg-black/5 dark:bg-white/[0.02] rounded-2xl p-4 sm:p-5 border border-black/10 dark:border-white/15 text-slate-900 dark:text-white select-none transition-colors">
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-2">
            <span class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-slate-900 dark:bg-white animate-pulse"></span>
              <strong class="text-slate-900 dark:text-white font-mono tracking-wider">DCF VALUATION: EXPLICIT CASH FLOWS VS PERPETUITY</strong>
            </span>
            <span>TV = FCF × (1+g) / (WACC - g)</span>
          </div>
          <svg viewBox="0 0 600 130" class="w-full h-auto overflow-visible" xmlns="http://www.w3.org/2000/svg">
            <!-- Explicit 5Y PV Bar: 20% -->
            <rect x="60" y="30" width="100" height="50" rx="8" class="card-subtle" stroke="#71717a" stroke-width="1.5" fill="rgba(255, 255, 255, 0.05)" />
            <text x="110" y="52" fill="currentColor" class="text-slate-800 dark:text-slate-200" font-size="13" font-family="monospace" font-weight="900" text-anchor="middle">$20M</text>
            <text x="110" y="68" class="axis-text" font-size="9" font-family="monospace" text-anchor="middle">5Y Explicit (20%)</text>
            <!-- Gordon Growth Terminal Value Bar: 80% -->
            <rect x="175" y="30" width="365" height="50" rx="8" class="boost-tv-bar" fill="rgba(9, 9, 11, 0.08)" stroke="#09090b" stroke-width="2" />
            <text x="357" y="52" fill="currentColor" class="text-slate-900 dark:text-white" font-size="15" font-family="monospace" font-weight="900" text-anchor="middle">$80M TERMINAL VALUE (80% OF TOTAL)</text>
            <text x="357" y="68" fill="currentColor" class="text-slate-600 dark:text-slate-400" font-size="9" font-family="monospace" text-anchor="middle">Extreme sensitivity to denominator: (WACC - g)</text>
            <!-- Bottom bracket label -->
            <text x="300" y="105" class="axis-text" font-size="10" font-family="monospace" text-anchor="middle">Total Enterprise Value = $100M · Tiny 50 bps WACC shift swings TV by ±15%</text>
          </svg>
        </div>
      `;

    default:
      return '';
  }
}

export function getBoostMeta(boostId) {
  const metaMap = {
    'boost-1': { ticker: 'NASDAQ: SPX_COMP', desk: 'QUANT WEALTH DESK', level: 'Quant Associate', estTime: '60s' },
    'boost-2': { ticker: 'ARBITRAGE: SPY/NAV', desk: 'ETF ARBITRAGE DESK', level: 'HFT Associate', estTime: '75s' },
    'boost-3': { ticker: 'VOL: STRADDLE_K', desk: 'EQUITY DERIVATIVES', level: 'Options Trader', estTime: '60s' },
    'boost-4': { ticker: 'UST: 10Y_BOND', desk: 'RATES & MACRO DESK', level: 'Fixed Income Trader', estTime: '60s' },
    'boost-5': { ticker: 'L2: DEPTH_SWEEP', desk: 'MICROSTRUCTURE LAB', level: 'Execution Quant', estTime: '90s' },
    'boost-6': { ticker: 'MPT: ALPHA_2ASSET', desk: 'PORTFOLIO STRATEGY', level: 'Asset Allocation', estTime: '75s' },
    'boost-7': { ticker: 'DCF: GORDON_TV', desk: 'CORPORATE FINANCE', level: 'Valuation Lead', estTime: '90s' }
  };
  return metaMap[boostId] || { ticker: 'WALLST: QUANT_DESK', desk: 'TRADING ARENA', level: 'Quant Associate', estTime: '60s' };
}
