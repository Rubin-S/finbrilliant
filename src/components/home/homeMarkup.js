import { getNavbarMarkup } from '../navbar/navbarMarkup.js';

export function getHomePageMarkup(options = {}) {
  const navbarHtml = getNavbarMarkup({
    ...options,
    state: { currentView: 'home', ...(options.state || {}) }
  });

  return `
    <div class="aee-root relative min-h-screen bg-[#060709] text-[#f8fafc]">
      
      <!-- Standardized Navbar Mount (Pinned Top Header + Floating Bottom Dock + Palette Modal) -->
      <div id="navbar-mount">
        ${navbarHtml}
      </div>

      <!-- ===================================================================
           1. THE 8-SCENE CINEMATIC SCROLL EXPERIENCE
           =================================================================== -->
      <div id="aee-cinematic-mount"></div>

      <!-- ===================================================================
           2. POST-CINEMATIC SECTION: "CHANGE ONE THING" INTERACTIVE SANDBOX
           =================================================================== -->
      <section id="aee-sandbox-section" class="relative py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div class="text-center max-w-3xl mx-auto mb-14">
          <div class="text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
            INTERACTIVE REASONING
          </div>
          <h2 class="text-3xl sm:text-4xl font-light tracking-wide uppercase text-white mb-3">
            Change One Thing. Observe Everything.
          </h2>
          <p class="aee-editorial-serif text-lg text-slate-300 italic">
            Finance is an interconnected balance sheet. Drag any parameter below and watch real-time mathematical reverberations across bonds, valuations, and risk.
          </p>
        </div>

        <!-- Mode Tabs -->
        <div class="flex flex-wrap justify-center gap-2 mb-10">
          <button id="tab-world" class="px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase border border-white bg-white text-black font-bold transition cursor-pointer">
            1. The Financial World Model (SFC)
          </button>
          <button id="tab-rate" class="px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase border border-white/20 bg-transparent text-slate-400 hover:text-white hover:border-white/40 transition cursor-pointer">
            2. Interest Rates & Bonds
          </button>
          <button id="tab-dcf" class="px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase border border-white/20 bg-transparent text-slate-400 hover:text-white hover:border-white/40 transition cursor-pointer">
            3. Cash Flow & DCF Value
          </button>
          <button id="tab-vol" class="px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase border border-white/20 bg-transparent text-slate-400 hover:text-white hover:border-white/40 transition cursor-pointer">
            4. Volatility & Greeks
          </button>
        </div>

        <!-- Sandbox Display Card -->
        <div id="sandbox-content" class="p-6 sm:p-10 rounded-2xl border border-white/15 bg-white/[0.015] shadow-2xl">
          <!-- Dynamic sandbox content will render here -->
        </div>
      </section>

      <!-- ===================================================================
           3. POST-CINEMATIC SECTION: THE 6 REALMS OF FINANCE
           =================================================================== -->
      <section class="py-24 px-6 max-w-6xl mx-auto border-t border-white/10">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <div class="text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
            CURRICULUM ARCHITECTURE
          </div>
          <h2 class="text-3xl sm:text-4xl font-light tracking-wide uppercase text-white mb-3">
            The Entire Financial System.
          </h2>
          <p class="aee-editorial-serif text-lg text-slate-300 italic">
            We do not teach fragmented personal finance tricks. We teach the living machinery of global capital from first principles.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Realm 1: Economics -->
          <div class="p-6 rounded-xl border border-white/10 bg-white/[0.01] flex flex-col justify-between hover:border-white/30 transition group">
            <div>
              <div class="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">REALM 01</div>
              <h3 class="text-xl font-light tracking-wider uppercase text-white mb-2">ECONOMICS</h3>
              <p class="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                How central banks steer money supplies, how inflation alters real purchasing power, and how sovereign yield curves forecast macro contractions.
              </p>
              <div class="text-[11px] font-mono text-slate-500 space-y-1">
                <div>• Monetary Policy Transmission</div>
                <div>• Yield Curve Convexity & Inversion</div>
                <div>• FX Parity & Global Trade Flows</div>
              </div>
            </div>
            <button class="mt-6 w-full py-2 rounded border border-white/15 hover:border-white text-xs font-mono uppercase text-slate-300 hover:text-white transition cursor-pointer realm-btn" data-realm="courses">
              Explore Economics →
            </button>
          </div>

          <!-- Realm 2: Financial Markets -->
          <div class="p-6 rounded-xl border border-white/10 bg-white/[0.01] flex flex-col justify-between hover:border-white/30 transition group">
            <div>
              <div class="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">REALM 02</div>
              <h3 class="text-xl font-light tracking-wider uppercase text-white mb-2">FINANCIAL MARKETS</h3>
              <p class="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Step inside live Level 2 order books. Learn how buyers and sellers cross the bid-ask spread, how liquidity vanishes, and how market makers balance inventory.
              </p>
              <div class="text-[11px] font-mono text-slate-500 space-y-1">
                <div>• Continuous Double Auctions</div>
                <div>• Bid-Ask Spread & Price Slippage</div>
                <div>• Equities, Bonds, FX & Commodities</div>
              </div>
            </div>
            <button class="mt-6 w-full py-2 rounded border border-white/15 hover:border-white text-xs font-mono uppercase text-slate-300 hover:text-white transition cursor-pointer realm-btn" data-realm="courses">
              Explore Markets →
            </button>
          </div>

          <!-- Realm 3: Corporate Finance & Valuation -->
          <div class="p-6 rounded-xl border border-white/10 bg-white/[0.01] flex flex-col justify-between hover:border-white/30 transition group">
            <div>
              <div class="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">REALM 03</div>
              <h3 class="text-xl font-light tracking-wider uppercase text-white mb-2">CORPORATE FINANCE</h3>
              <p class="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Value is not an opinion; it is future cash flow discounted for time and risk. Build dynamic DCF models and master the mechanics of WACC and capital structure.
              </p>
              <div class="text-[11px] font-mono text-slate-500 space-y-1">
                <div>• 3-Statement Financial Modeling</div>
                <div>• Free Cash Flow to Firm (FCFF)</div>
                <div>• Gordon Growth & Terminal Multiples</div>
              </div>
            </div>
            <button class="mt-6 w-full py-2 rounded border border-white/15 hover:border-white text-xs font-mono uppercase text-slate-300 hover:text-white transition cursor-pointer realm-btn" data-realm="courses">
              Explore Valuation →
            </button>
          </div>

          <!-- Realm 4: Quantitative Finance & Derivatives -->
          <div class="p-6 rounded-xl border border-white/10 bg-white/[0.01] flex flex-col justify-between hover:border-white/30 transition group">
            <div>
              <div class="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">REALM 04</div>
              <h3 class="text-xl font-light tracking-wider uppercase text-white mb-2">QUANTITATIVE FINANCE</h3>
              <p class="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Black-Scholes pricing, stochastic geometric Brownian motion, Delta hedge ratios, Gamma curvature, and Vega volatility exposure.
              </p>
              <div class="text-[11px] font-mono text-slate-500 space-y-1">
                <div>• Non-Linear Option Payoffs</div>
                <div>• Black-Scholes Formula & Greeks</div>
                <div>• Monte Carlo Path Simulation</div>
              </div>
            </div>
            <button class="mt-6 w-full py-2 rounded border border-white/15 hover:border-white text-xs font-mono uppercase text-slate-300 hover:text-white transition cursor-pointer realm-btn" data-realm="courses">
              Explore Quant →
            </button>
          </div>

          <!-- Realm 5: Banking & Credit Creation -->
          <div class="p-6 rounded-xl border border-white/10 bg-white/[0.01] flex flex-col justify-between hover:border-white/30 transition group">
            <div>
              <div class="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">REALM 05</div>
              <h3 class="text-xl font-light tracking-wider uppercase text-white mb-2">BANKING & CREDIT</h3>
              <p class="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                How commercial banks originate loans, how fractional reserves expand the money supply, and how interbank repo markets supply overnight funding.
              </p>
              <div class="text-[11px] font-mono text-slate-500 space-y-1">
                <div>• Balance Sheet Mechanics</div>
                <div>• Interbank Liquidity & Repos</div>
                <div>• Credit Spreads & Default Probabilities</div>
              </div>
            </div>
            <button class="mt-6 w-full py-2 rounded border border-white/15 hover:border-white text-xs font-mono uppercase text-slate-300 hover:text-white transition cursor-pointer realm-btn" data-realm="courses">
              Explore Banking →
            </button>
          </div>

          <!-- Realm 6: Investing & Risk Allocation -->
          <div class="p-6 rounded-xl border border-white/10 bg-white/[0.01] flex flex-col justify-between hover:border-white/30 transition group">
            <div>
              <div class="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">REALM 06</div>
              <h3 class="text-xl font-light tracking-wider uppercase text-white mb-2">INVESTING & RISK</h3>
              <p class="text-xs text-slate-400 leading-relaxed font-sans mb-4">
                Modern Portfolio Theory, Markowitz correlation frontiers, Sharpe ratios, and behavioral biases that distort institutional capital allocation.
              </p>
              <div class="text-[11px] font-mono text-slate-500 space-y-1">
                <div>• Markowitz Efficient Frontier</div>
                <div>• Correlation & Diversification</div>
                <div>• Value at Risk (VaR) & Expected Shortfall</div>
              </div>
            </div>
            <button class="mt-6 w-full py-2 rounded border border-white/15 hover:border-white text-xs font-mono uppercase text-slate-300 hover:text-white transition cursor-pointer realm-btn" data-realm="courses">
              Explore Investing →
            </button>
          </div>

        </div>
      </section>

      <!-- ===================================================================
           4. POST-CINEMATIC SECTION: HOW LEARNING WORKS (FIRST PRINCIPLES)
           =================================================================== -->
      <section id="aee-about-section" class="py-24 px-6 max-w-5xl mx-auto border-t border-white/10">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <div class="text-xs font-mono tracking-widest text-slate-400 uppercase mb-2">
            PEDAGOGY
          </div>
          <h2 class="text-3xl sm:text-4xl font-light tracking-wide uppercase text-white mb-3">
            How Learning Works.
          </h2>
          <p class="aee-editorial-serif text-lg text-slate-300 italic">
            Zero passive video lectures. Touch the equations and see why systems behave the way they do.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 font-sans">
          <div class="p-6 rounded-xl border border-white/10 bg-white/[0.01]">
            <div class="text-2xl font-light text-white mb-2">01</div>
            <h4 class="text-lg font-semibold text-white mb-2">Manipulate First, Define Later</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Instead of memorizing that bond yields and bond prices are inversely related, you slide interest rates across a live curve and feel the mathematical seesaw in real time.
            </p>
          </div>

          <div class="p-6 rounded-xl border border-white/10 bg-white/[0.01]">
            <div class="text-2xl font-light text-white mb-2">02</div>
            <h4 class="text-lg font-semibold text-white mb-2">Second-Order Consequences</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Every decision reverberates. Learn how an interest-rate hike contracts commercial loans, increases discount rates, compresses corporate multiples, and redraws currency frontiers.
            </p>
          </div>

          <div class="p-6 rounded-xl border border-white/10 bg-white/[0.01]">
            <div class="text-2xl font-light text-white mb-2">03</div>
            <h4 class="text-lg font-semibold text-white mb-2">Quantitative & Wall Street Rigor</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Formulas are not black boxes. We dissect Black-Scholes Greeks, duration convexity, and Gordon Growth terminal values with the rigor expected in quantitative trading and investment banking interviews.
            </p>
          </div>

          <div class="p-6 rounded-xl border border-white/10 bg-white/[0.01]">
            <div class="text-2xl font-light text-white mb-2">04</div>
            <h4 class="text-lg font-semibold text-white mb-2">Micro-Step Problem Solving</h4>
            <p class="text-xs text-slate-400 leading-relaxed">
              Complex concepts are decomposed into bite-sized interactive challenges with instant feedback, auditory tactile cues, and zero cognitive bloat.
            </p>
          </div>
        </div>
      </section>

      <!-- ===================================================================
           5. FINAL CAPSTONE CALL TO ACTION & FOOTER
           =================================================================== -->
      <section id="aee-final-cta" class="py-24 px-6 border-t border-white/10 text-center flex flex-col items-center bg-white/[0.01]">
        <div class="text-3xl sm:text-5xl font-light tracking-[0.24em] uppercase text-white mb-2">
          ALL ELSE EQUAL
        </div>
        <div class="aee-editorial-serif text-xl sm:text-2xl text-slate-200 italic mb-4">
          Understand what changes when one thing does.
        </div>
        <p class="text-xs sm:text-sm text-slate-400 max-w-lg mb-8 font-sans">
          Begin your journey through the complete financial system today with interactive simulations, problems, and first-principles mastery.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <button id="cta-start-btn" class="px-8 py-3 rounded-lg bg-white hover:bg-slate-200 text-[#060709] font-bold text-xs tracking-wider uppercase transition transform active:scale-95 cursor-pointer shadow-lg shadow-white/10">
            Start Learning Today →
          </button>
          <button id="cta-grill-btn" class="px-8 py-3 rounded-lg border border-white/20 hover:border-white text-white font-semibold text-xs tracking-wider uppercase transition cursor-pointer">
            Wall Street Interview Arena
          </button>
        </div>
      </section>

      <!-- Minimalist Architectural Footer -->
      <footer id="aee-footer" class="aee-footer py-12 pb-32 sm:pb-36 px-6 sm:px-10 border-t border-white/10 bg-[#060709] text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span>© 2026 ALL ELSE EQUAL. The connected financial system from first principles.</span>
        </div>
        <div class="flex items-center gap-6">
          <a href="#/courses" class="hover:text-white transition">Curriculum</a>
          <a href="#/boost" class="hover:text-white transition">Daily Challenge</a>
          <a href="#/grill-me" class="hover:text-white transition">Superday Arena</a>
          <a href="#/lab" class="hover:text-white transition">Sandbox</a>
        </div>
      </footer>

    </div>
  `;
}
