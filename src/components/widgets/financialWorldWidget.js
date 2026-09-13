/**
 * Functioning Interactive Model of the Financial World
 * Interactive Stock-Flow Consistent Macroeconomic Simulator Widget
 * 
 * Renders the 6-sector financial laboratory:
 * - Central Bank, Commercial Banks, Corporations, Households, Government, Financial Markets
 * - Real-time policy levers (Taylor rule, policy rate, QE/QT, tax, credit spread)
 * - Dynamic balance sheet T-accounts, yield curve SVG, DCF repricing
 * - Pure Swiss monochrome broadsheet design system
 */

import { FinancialWorldEngine, financialWorld } from '../../engines/financialWorldEngine.js';
import { soundEngine } from '../../audio.js';

export function renderFinancialWorldWidget(container, options = {}) {
  if (!container) return () => {};

  const engine = options.engine || financialWorld;
  let selectedSector = 'centralBank';

  // Helper to format currency
  const fmtMoney = (val) => {
    const n = Math.abs(val);
    const sign = val < 0 ? '-' : '';
    if (n >= 1000) return `${sign}$${(n / 1000).toFixed(2)}T`;
    return `${sign}$${n.toFixed(1)}B`;
  };

  const fmtPercent = (val) => `${val >= 0 ? '' : ''}${val.toFixed(2)}%`;

  function render() {
    const audit = engine.getSystemConservationAudit();
    const tAccount = engine.getSectorTAccount(selectedSector);
    const yieldCurvePoints = engine.financialMarkets.yieldCurve;

    // Generate SVG yield curve path
    const svgW = 280;
    const svgH = 100;
    const minYield = 0.0;
    const maxYield = 16.0;
    const pts = yieldCurvePoints.map((p, idx) => {
      const x = 30 + (idx * (svgW - 50) / (yieldCurvePoints.length - 1));
      const normalizedY = (p.yield - minYield) / (maxYield - minYield);
      const y = svgH - 20 - (normalizedY * (svgH - 35));
      return { x, y, tenor: p.tenor, yield: p.yield };
    });

    const polylineStr = pts.map(p => `${p.x},${p.y}`).join(' ');

    container.innerHTML = `
      <div class="aee-financial-world-simulator font-mono space-y-6 select-none" id="financial-world-root">
        
        <!-- Top Micro-Framing Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 text-[10px] tracking-widest uppercase text-slate-400 pb-3 border-b border-white/10">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full ${engine.isPlaying ? 'bg-white animate-pulse' : 'bg-white/40'}"></span>
            <span class="text-white font-bold">SYSTEM METABOLISM: ${engine.isPlaying ? 'RUNNING' : 'IDLE'}</span>
            <span class="text-slate-500">/ QUARTER ${engine.clock + 1}</span>
          </div>
          <div class="flex items-center gap-4 text-slate-300">
            <span>SFC AUDIT: <strong class="text-white">${audit.isConsistent ? 'CONSERVED (DELTA $0.00)' : 'IMBALANCE'}</strong></span>
            <span>SPEED: <strong class="text-white">${engine.playbackSpeed}x</strong></span>
          </div>
        </div>

        <!-- Macroeconomic HUD Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div class="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
            <div class="text-[9px] text-slate-400 uppercase tracking-wider">REAL GDP</div>
            <div class="text-sm font-bold text-white mt-1">${fmtMoney(engine.macro.gdp)}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Gap: ${engine.macro.outputGap >= 0 ? '+' : ''}${engine.macro.outputGap.toFixed(2)}%</div>
          </div>
          <div class="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
            <div class="text-[9px] text-slate-400 uppercase tracking-wider">INFLATION (CPI)</div>
            <div class="text-sm font-bold text-white mt-1">${fmtPercent(engine.macro.inflationRate)}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Target: 2.00%</div>
          </div>
          <div class="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
            <div class="text-[9px] text-slate-400 uppercase tracking-wider">UNEMPLOYMENT</div>
            <div class="text-sm font-bold text-white mt-1">${fmtPercent(engine.macro.unemploymentRate)}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Natural: 4.00%</div>
          </div>
          <div class="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
            <div class="text-[9px] text-slate-400 uppercase tracking-wider">POLICY RATE</div>
            <div class="text-sm font-bold text-white mt-1" id="hud-policy-rate">${fmtPercent(engine.centralBank.policyRate)}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">${engine.centralBank.taylorRuleActive ? 'Taylor Rule' : 'Discretionary'}</div>
          </div>
          <div class="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
            <div class="text-[9px] text-slate-400 uppercase tracking-wider">10Y TREASURY YIELD</div>
            <div class="text-sm font-bold text-white mt-1">${fmtPercent(engine.financialMarkets.yield10Y)}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Price: $${engine.financialMarkets.bondPrice10Y.toFixed(2)}</div>
          </div>
          <div class="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
            <div class="text-[9px] text-slate-400 uppercase tracking-wider">EQUITY SHARE PRICE</div>
            <div class="text-sm font-bold text-white mt-1" id="hud-share-price">$${engine.corporations.sharePrice.toFixed(2)}</div>
            <div class="text-[10px] text-slate-400 mt-0.5">WACC: ${fmtPercent(engine.corporations.wacc)}</div>
          </div>
        </div>

        <!-- Simulation Control Bar & Crisis Presets -->
        <div class="p-4 rounded-xl border border-white/15 bg-white/[0.015] space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <!-- Execution buttons -->
            <div class="flex items-center gap-2">
              <button id="sim-play-pause-btn" class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-white ${engine.isPlaying ? 'bg-white text-black' : 'bg-transparent text-white hover:bg-white/10'} transition cursor-pointer">
                <span>${engine.isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>
              <button id="sim-step-btn" class="px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border border-white/20 bg-white/[0.02] text-slate-300 hover:text-white hover:border-white/40 transition cursor-pointer" title="Advance simulation by 1 quarter">
                <span>STEP (+1 QTR)</span>
              </button>
              <button id="sim-reset-btn" class="px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border border-white/20 bg-white/[0.02] text-slate-400 hover:text-white hover:border-white/40 transition cursor-pointer">
                <span>RESET</span>
              </button>
            </div>

            <!-- Historical crisis scenarios -->
            <div class="flex items-center gap-1.5 overflow-x-auto text-[10px]">
              <span class="text-slate-500 uppercase tracking-widest mr-1">SCENARIOS:</span>
              <button class="sim-scenario-btn px-2.5 py-1.5 rounded border border-white/15 text-slate-400 hover:text-white hover:border-white/30 transition cursor-pointer" data-scenario="baseline">BASELINE</button>
              <button class="sim-scenario-btn px-2.5 py-1.5 rounded border border-white/15 text-slate-400 hover:text-white hover:border-white/30 transition cursor-pointer" data-scenario="gfc_2008">2008 GFC</button>
              <button class="sim-scenario-btn px-2.5 py-1.5 rounded border border-white/15 text-slate-400 hover:text-white hover:border-white/30 transition cursor-pointer" data-scenario="volcker_1979">1979 VOLCKER</button>
              <button class="sim-scenario-btn px-2.5 py-1.5 rounded border border-white/15 text-slate-400 hover:text-white hover:border-white/30 transition cursor-pointer" data-scenario="covid_2020">2020 COVID</button>
              <button class="sim-scenario-btn px-2.5 py-1.5 rounded border border-white/15 text-slate-400 hover:text-white hover:border-white/30 transition cursor-pointer" data-scenario="soft_landing">SOFT LANDING</button>
            </div>
          </div>
        </div>

        <!-- Policy Shock Controls & Levers -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-xl border border-white/15 bg-white/[0.01]">
          <!-- Lever 1: Policy Rate -->
          <div class="space-y-2">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400">CENTRAL BANK RATE:</span>
              <span id="disp-policy-rate" class="font-bold text-white">${fmtPercent(engine.centralBank.policyRate)}</span>
            </div>
            <input id="slider-policy-rate" type="range" min="0.0" max="16.0" step="0.25" value="${engine.centralBank.policyRate}" class="w-full accent-white cursor-pointer" aria-label="Central Bank Policy Rate" />
            <div class="flex justify-between text-[9px] text-slate-500">
              <span>0.00% (ZIRP)</span>
              <span>16.00% (Tight)</span>
            </div>
          </div>

          <!-- Lever 2: Taylor Rule & QE Toggles -->
          <div class="space-y-2 flex flex-col justify-between">
            <div class="text-xs text-slate-400">MONETARY OPERATIONS:</div>
            <div class="flex items-center gap-2">
              <button id="toggle-taylor-btn" class="flex-1 px-2.5 py-1.5 rounded text-[10px] font-bold uppercase border transition cursor-pointer ${engine.centralBank.taylorRuleActive ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-white/20 hover:text-white'}">
                <span>TAYLOR RULE: ${engine.centralBank.taylorRuleActive ? 'ON' : 'OFF'}</span>
              </button>
              <button id="toggle-qe-btn" class="flex-1 px-2.5 py-1.5 rounded text-[10px] font-bold uppercase border transition cursor-pointer ${engine.centralBank.qeActive ? 'bg-white text-black border-white' : 'bg-transparent text-slate-400 border-white/20 hover:text-white'}">
                <span>QE: ${engine.centralBank.qeActive ? 'ACTIVE' : 'OFF'}</span>
              </button>
            </div>
            <div class="text-[9px] text-slate-500">Balance sheet expansion / contraction</div>
          </div>

          <!-- Lever 3: Corporate Tax Rate -->
          <div class="space-y-2">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400">CORPORATE TAX RATE:</span>
              <span id="disp-tax-rate" class="font-bold text-white">${Math.round(engine.government.taxRate * 100)}%</span>
            </div>
            <input id="slider-tax-rate" type="range" min="0.10" max="0.45" step="0.01" value="${engine.government.taxRate}" class="w-full accent-white cursor-pointer" aria-label="Corporate Tax Rate" />
            <div class="flex justify-between text-[9px] text-slate-500">
              <span>10% (Low tax)</span>
              <span>45% (High tax)</span>
            </div>
          </div>

          <!-- Lever 4: Credit Risk Spread -->
          <div class="space-y-2">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400">CREDIT RISK SPREAD:</span>
              <span id="disp-credit-spread" class="font-bold text-white">+${engine.financialMarkets.creditSpreadBps} bps</span>
            </div>
            <input id="slider-credit-spread" type="range" min="50" max="800" step="25" value="${engine.financialMarkets.creditSpreadBps}" class="w-full accent-white cursor-pointer" aria-label="Credit Risk Spread" />
            <div class="flex justify-between text-[9px] text-slate-500">
              <span>+50 bps (Tight)</span>
              <span>+800 bps (Distress)</span>
            </div>
          </div>
        </div>

        <!-- The 6 Institutional Sectors Grid -->
        <div class="space-y-3">
          <div class="text-xs uppercase tracking-widest text-slate-400 flex items-center justify-between">
            <span>THE 6 INSTITUTIONAL SECTORS (SELECT TO INSPECT T-ACCOUNT)</span>
            <span class="text-[10px] text-slate-500">CLICK ANY SECTOR FOR DETAILED BALANCE SHEET</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- 1. Central Bank Card -->
            <div class="sector-card p-4 rounded-xl border transition cursor-pointer ${selectedSector === 'centralBank' ? 'border-white bg-white/[0.05] shadow-lg ring-1 ring-white/30' : 'border-white/15 bg-white/[0.015] hover:border-white/40'}" data-sector="centralBank">
              <div class="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
                <span class="text-xs font-bold text-white uppercase">1. Central Bank</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">Rate: ${fmtPercent(engine.centralBank.policyRate)}</span>
              </div>
              <div class="text-[11px] space-y-1 text-slate-300">
                <div class="flex justify-between"><span>Treasuries Held:</span><span class="text-white font-semibold">${fmtMoney(engine.centralBank.treasuriesHeld)}</span></div>
                <div class="flex justify-between"><span>Bank Reserves:</span><span class="text-white font-semibold">${fmtMoney(engine.centralBank.reserves)}</span></div>
                <div class="flex justify-between"><span>Currency in Circulation:</span><span class="text-slate-400">${fmtMoney(engine.centralBank.currencyInCirculation)}</span></div>
              </div>
            </div>

            <!-- 2. Commercial Banks Card -->
            <div class="sector-card p-4 rounded-xl border transition cursor-pointer ${selectedSector === 'commercialBanks' ? 'border-white bg-white/[0.05] shadow-lg ring-1 ring-white/30' : 'border-white/15 bg-white/[0.015] hover:border-white/40'}" data-sector="commercialBanks">
              <div class="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
                <span class="text-xs font-bold text-white uppercase">2. Commercial Banks</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">CAR: ${(engine.commercialBanks.capitalAdequacyRatio * 100).toFixed(1)}%</span>
              </div>
              <div class="text-[11px] space-y-1 text-slate-300">
                <div class="flex justify-between"><span>Loans to Corporations:</span><span class="text-white font-semibold">${fmtMoney(engine.commercialBanks.corporateLoans)}</span></div>
                <div class="flex justify-between"><span>Mortgage Loans:</span><span class="text-white font-semibold">${fmtMoney(engine.commercialBanks.mortgageLoans)}</span></div>
                <div class="flex justify-between"><span>Customer Deposits:</span><span class="text-white font-semibold">${fmtMoney(engine.commercialBanks.customerDeposits)}</span></div>
              </div>
            </div>

            <!-- 3. Corporations Card -->
            <div class="sector-card p-4 rounded-xl border transition cursor-pointer ${selectedSector === 'corporations' ? 'border-white bg-white/[0.05] shadow-lg ring-1 ring-white/30' : 'border-white/15 bg-white/[0.015] hover:border-white/40'}" data-sector="corporations">
              <div class="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
                <span class="text-xs font-bold text-white uppercase">3. Corporations</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">Share: $${engine.corporations.sharePrice.toFixed(2)}</span>
              </div>
              <div class="text-[11px] space-y-1 text-slate-300">
                <div class="flex justify-between"><span>Revenue:</span><span class="text-white font-semibold">${fmtMoney(engine.corporations.revenue)}</span></div>
                <div class="flex justify-between"><span>Free Cash Flow:</span><span class="text-white font-semibold">${fmtMoney(engine.corporations.freeCashFlow)}</span></div>
                <div class="flex justify-between"><span>Enterprise Value:</span><span class="text-white font-semibold">${fmtMoney(engine.corporations.enterpriseValue)}</span></div>
              </div>
            </div>

            <!-- 4. Households Card -->
            <div class="sector-card p-4 rounded-xl border transition cursor-pointer ${selectedSector === 'households' ? 'border-white bg-white/[0.05] shadow-lg ring-1 ring-white/30' : 'border-white/15 bg-white/[0.015] hover:border-white/40'}" data-sector="households">
              <div class="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
                <span class="text-xs font-bold text-white uppercase">4. Households</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">Net: ${fmtMoney(engine.households.netWorth)}</span>
              </div>
              <div class="text-[11px] space-y-1 text-slate-300">
                <div class="flex justify-between"><span>Wage Income:</span><span class="text-white font-semibold">${fmtMoney(engine.households.wageIncome)}</span></div>
                <div class="flex justify-between"><span>Consumption Spending:</span><span class="text-white font-semibold">${fmtMoney(engine.households.consumptionSpending)}</span></div>
                <div class="flex justify-between"><span>Bank Deposits:</span><span class="text-white font-semibold">${fmtMoney(engine.households.bankDeposits)}</span></div>
              </div>
            </div>

            <!-- 5. Government Card -->
            <div class="sector-card p-4 rounded-xl border transition cursor-pointer ${selectedSector === 'government' ? 'border-white bg-white/[0.05] shadow-lg ring-1 ring-white/30' : 'border-white/15 bg-white/[0.015] hover:border-white/40'}" data-sector="government">
              <div class="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
                <span class="text-xs font-bold text-white uppercase">5. Government</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">Debt/GDP: ${engine.government.debtToGdp.toFixed(1)}%</span>
              </div>
              <div class="text-[11px] space-y-1 text-slate-300">
                <div class="flex justify-between"><span>Tax Revenues:</span><span class="text-white font-semibold">${fmtMoney(engine.government.taxRevenue)}</span></div>
                <div class="flex justify-between"><span>Expenditures:</span><span class="text-white font-semibold">${fmtMoney(engine.government.expenditures)}</span></div>
                <div class="flex justify-between"><span>Budget Deficit:</span><span class="text-slate-300 font-semibold">${fmtMoney(engine.government.budgetDeficit)}</span></div>
              </div>
            </div>

            <!-- 6. Financial Markets Card -->
            <div class="sector-card p-4 rounded-xl border transition cursor-pointer ${selectedSector === 'financialMarkets' ? 'border-white bg-white/[0.05] shadow-lg ring-1 ring-white/30' : 'border-white/15 bg-white/[0.015] hover:border-white/40'}" data-sector="financialMarkets">
              <div class="flex justify-between items-center pb-2 border-b border-white/10 mb-2">
                <span class="text-xs font-bold text-white uppercase">6. Financial Markets</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300">10Y: ${fmtPercent(engine.financialMarkets.yield10Y)}</span>
              </div>
              <div class="text-[11px] space-y-1 text-slate-300">
                <div class="flex justify-between"><span>10Y Bond Price:</span><span class="text-white font-semibold">$${engine.financialMarkets.bondPrice10Y.toFixed(2)}</span></div>
                <div class="flex justify-between"><span>Credit Risk Spread:</span><span class="text-white font-semibold">+${engine.financialMarkets.creditSpreadBps} bps</span></div>
                <div class="flex justify-between"><span>Auction Clearing:</span><span class="text-white font-semibold">$${engine.financialMarkets.orderBook.clearingPrice.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>

        <!-- In-Depth Sector T-Account & Repricing Visualizer -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 rounded-2xl border border-white/15 bg-white/[0.015]">
          <!-- Left: T-Account Balance Sheet -->
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 class="text-sm font-bold uppercase text-white tracking-wider">${tAccount.title} T-Account</h3>
              <span class="text-[10px] text-slate-400 uppercase tracking-widest">STOCK-FLOW CONSISTENT</span>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs">
              <!-- Assets Column -->
              <div class="p-3 rounded-lg border border-white/10 bg-black/40 space-y-2">
                <div class="text-[10px] font-bold text-slate-300 uppercase tracking-wider pb-1 border-b border-white/10">ASSETS (+)</div>
                ${tAccount.assets.map(a => `
                  <div class="flex justify-between items-center text-[11px]">
                    <span class="text-slate-400">${a.label}:</span>
                    <span class="font-bold text-white">${fmtMoney(a.value)}</span>
                  </div>
                `).join('')}
              </div>

              <!-- Liabilities Column -->
              <div class="p-3 rounded-lg border border-white/10 bg-black/40 space-y-2">
                <div class="text-[10px] font-bold text-slate-300 uppercase tracking-wider pb-1 border-b border-white/10">LIABILITIES & EQUITY (-)</div>
                ${tAccount.liabilities.map(l => `
                  <div class="flex justify-between items-center text-[11px]">
                    <span class="text-slate-400">${l.label}:</span>
                    <span class="font-bold text-white">${fmtMoney(l.value)}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="p-3 rounded-lg border border-white/10 bg-white/[0.02] flex justify-between items-center text-xs">
              <span class="text-slate-400">NET FINANCIAL POSITION:</span>
              <span class="font-bold text-white">${fmtMoney(tAccount.netWorth)}</span>
            </div>
          </div>

          <!-- Right: Dynamic Yield Curve & DCF Sensitivities -->
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 class="text-sm font-bold uppercase text-white tracking-wider">Yield Curve & DCF Repricing</h3>
              <span class="text-[10px] text-slate-400">NELSON-SIEGEL TERM STRUCTURE</span>
            </div>

            <!-- SVG Yield Curve Chart -->
            <div class="p-3 rounded-lg border border-white/10 bg-black/40 space-y-2">
              <div class="flex justify-between items-center text-[10px] text-slate-400">
                <span>SOVEREIGN TREASURY YIELD CURVE</span>
                <span>BENCHMARK 10Y: <strong class="text-white">${fmtPercent(engine.financialMarkets.yield10Y)}</strong></span>
              </div>
              <svg viewBox="0 0 ${svgW} ${svgH}" class="w-full h-24 overflow-visible">
                <!-- Grid lines -->
                <line x1="30" y1="20" x2="${svgW - 20}" y2="20" stroke="rgba(255,255,255,0.06)" stroke-dasharray="2 2" />
                <line x1="30" y1="50" x2="${svgW - 20}" y2="50" stroke="rgba(255,255,255,0.06)" stroke-dasharray="2 2" />
                <line x1="30" y1="80" x2="${svgW - 20}" y2="80" stroke="rgba(255,255,255,0.1)" />
                <!-- Polyline yield curve -->
                <polyline points="${polylineStr}" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <!-- Data dots and labels -->
                ${pts.map(p => `
                  <circle cx="${p.x}" cy="${p.y}" r="3" fill="#ffffff" stroke="#000000" stroke-width="1.5" />
                  <text x="${p.x}" y="${svgH - 5}" font-size="8" font-family="monospace" fill="#94a3b8" text-anchor="middle">${p.tenor}</text>
                  <text x="${p.x}" y="${p.y - 6}" font-size="7" font-family="monospace" fill="#ffffff" font-weight="bold" text-anchor="middle">${p.yield.toFixed(1)}%</text>
                `).join('')}
              </svg>
            </div>

            <!-- DCF & Repricing readouts -->
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                <div class="text-[9px] text-slate-400 uppercase">10Y BOND CAPITAL GAIN / LOSS</div>
                <div class="text-base font-bold text-white mt-1">$${engine.financialMarkets.bondPrice10Y.toFixed(2)}</div>
                <div class="text-[10px] text-slate-400 mt-0.5">${((engine.financialMarkets.bondPrice10Y - 100) / 100 * 100).toFixed(2)}% vs Par</div>
              </div>
              <div class="p-3 rounded-lg border border-white/10 bg-white/[0.02]">
                <div class="text-[9px] text-slate-400 uppercase">CORPORATE SHARE FAIR VALUE</div>
                <div class="text-base font-bold text-white mt-1">$${engine.corporations.sharePrice.toFixed(2)}</div>
                <div class="text-[10px] text-slate-400 mt-0.5">WACC: ${fmtPercent(engine.corporations.wacc)}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    `;

    bindEvents();
  }

  function bindEvents() {
    // Play / Pause
    const playPauseBtn = container.querySelector('#sim-play-pause-btn');
    if (playPauseBtn) {
      playPauseBtn.onclick = () => {
        soundEngine.playClick();
        if (engine.isPlaying) engine.pause();
        else engine.play();
      };
    }

    // Step 1 Tick
    const stepBtn = container.querySelector('#sim-step-btn');
    if (stepBtn) {
      stepBtn.onclick = () => {
        soundEngine.playClick();
        engine.step(1);
      };
    }

    // Reset
    const resetBtn = container.querySelector('#sim-reset-btn');
    if (resetBtn) {
      resetBtn.onclick = () => {
        soundEngine.playClick();
        engine.resetToDefaults();
      };
    }

    // Presets
    container.querySelectorAll('.sim-scenario-btn').forEach(btn => {
      btn.onclick = () => {
        soundEngine.playClick();
        const scenario = btn.getAttribute('data-scenario');
        if (scenario) engine.loadScenario(scenario);
      };
    });

    // Policy Rate Slider
    const rateSlider = container.querySelector('#slider-policy-rate');
    if (rateSlider) {
      rateSlider.oninput = () => {
        engine.setPolicyRate(parseFloat(rateSlider.value));
      };
    }

    // Tax Rate Slider
    const taxSlider = container.querySelector('#slider-tax-rate');
    if (taxSlider) {
      taxSlider.oninput = () => {
        engine.setCorporateTaxRate(parseFloat(taxSlider.value));
      };
    }

    // Credit Spread Slider
    const spreadSlider = container.querySelector('#slider-credit-spread');
    if (spreadSlider) {
      spreadSlider.oninput = () => {
        engine.setCreditSpreadBps(parseInt(spreadSlider.value, 10));
      };
    }

    // Taylor Rule Toggle
    const taylorBtn = container.querySelector('#toggle-taylor-btn');
    if (taylorBtn) {
      taylorBtn.onclick = () => {
        soundEngine.playClick();
        engine.toggleTaylorRule();
      };
    }

    // QE Toggle
    const qeBtn = container.querySelector('#toggle-qe-btn');
    if (qeBtn) {
      qeBtn.onclick = () => {
        soundEngine.playClick();
        engine.toggleQE();
      };
    }

    // Sector Selection
    container.querySelectorAll('.sector-card').forEach(card => {
      card.onclick = () => {
        soundEngine.playClick();
        const sec = card.getAttribute('data-sector');
        if (sec) {
          selectedSector = sec;
          render();
        }
      };
    });
  }

  // Subscribe to engine mutations for instant reactive rendering
  const unsubscribe = engine.subscribe(() => {
    render();
  });

  render();

  return () => {
    unsubscribe();
    engine.pause();
  };
}
