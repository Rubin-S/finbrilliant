export function getCinematicHeroMarkup() {
  return `
    <div class="aee-stage-track relative w-full" id="aee-stage-track">
      <div class="aee-stage-viewport sticky top-0 w-full h-screen overflow-hidden bg-[#060709] text-[#f8fafc] select-none">
        
        <!-- Pinned 4-Corner Framing (AEE Identity Marks) -->
        <div class="aee-corner-tag aee-corner-tl" id="aee-tag-tl">
          SAME PEOPLE.<br/>DIFFERENT POSSIBILITIES.
        </div>
        <div class="aee-corner-tag aee-corner-tr" id="aee-tag-tr">
          FINANCIAL LITERACY<br/>FOR A MORE<br/>EQUAL TOMORROW.
        </div>
        <div class="aee-corner-tag aee-corner-bl" id="aee-tag-bl">
          SAME QUESTIONS.<br/>DEEPER UNDERSTANDING.
        </div>
        <div class="aee-corner-tag aee-corner-br" id="aee-tag-br">
          A SMALL CHANGE<br/>CAN LEAD TO A<br/>DIFFERENT TOMORROW.
        </div>

        <!-- 3D Perspective Camera Rig Container -->
        <div class="aee-camera-rig" id="aee-camera-rig">

          <!-- Persistent Anchor Morphing Threads Layer (Preserved for DOM test hooks; hidden to ensure zero intermediate morph elements) -->
          <div class="aee-morph-threads-layer" id="aee-morph-threads-layer" style="display: none !important;">
            <!-- Morph Thread 1->2: Unequal sign morphing into 10Y maturity baseline & bond curve -->
            <div id="aee-thread-1-2" class="aee-morph-thread" style="display: none !important;">
              <svg viewBox="0 0 600 200" class="w-full max-w-2xl h-44 sm:h-52 overflow-visible">
                <line id="aee-t12-axis-y" x1="260" y1="90" x2="340" y2="90" stroke="rgba(255,255,255,0.8)" stroke-width="1.8" />
                <line id="aee-t12-axis-x" x1="260" y1="100" x2="340" y2="100" stroke="rgba(255,255,255,0.8)" stroke-width="1.8" />
                <line id="aee-t12-slash" x1="315" y1="80" x2="285" y2="110" stroke="#ffffff" stroke-width="2" />
                <path id="aee-t12-curve" d="M 100 84 C 150 95, 210 105, 300 116 S 450 132, 500 138" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="500" stroke-dashoffset="500" />
              </svg>
            </div>

            <!-- Morph Thread 2->3: $92.28 bond repricing apex blooming into INTEREST RATES ↑ root -->
            <div id="aee-thread-2-3" class="aee-morph-thread" style="display: none !important;">
              <div id="aee-t23-apex-anchor" class="relative flex flex-col items-center justify-center opacity-0 pointer-events-none">
                <div id="aee-t23-pulse"></div>
                <div id="aee-t23-price-tag"></div>
                <div id="aee-t23-label"></div>
              </div>
            </div>

            <!-- Morph Thread 3->4: Terminal nodes orbiting into 6 institutional sectors -->
            <div id="aee-thread-3-4" class="aee-morph-thread" style="display: none !important;">
              <svg viewBox="0 0 1024 371" class="w-full max-w-5xl h-auto overflow-visible">
                <path id="aee-t34-orb-1" d="M 171 101 Q 140 80 132 74" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-dasharray="3,3" />
                <path id="aee-t34-orb-2" d="M 512 101 Q 500 80 481 74" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-dasharray="3,3" />
                <path id="aee-t34-orb-3" d="M 853 101 Q 830 80 795 74" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-dasharray="3,3" />
                <path id="aee-t34-orb-4" d="M 512 202 Q 450 210 417 195" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-dasharray="3,3" />
                <path id="aee-t34-orb-5" d="M 853 202 Q 835 210 802 195" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-dasharray="3,3" />
                <path id="aee-t34-orb-6" d="M 512 304 Q 520 325 543 333.5" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-dasharray="3,3" />
                <circle id="aee-t34-node-1" cx="132" cy="74" r="3.5" fill="#ffffff" />
                <circle id="aee-t34-node-2" cx="481" cy="74" r="3.5" fill="#ffffff" />
                <circle id="aee-t34-node-3" cx="795" cy="74" r="3.5" fill="#ffffff" />
                <circle id="aee-t34-node-4" cx="417" cy="195" r="3.5" fill="#ffffff" />
                <circle id="aee-t34-node-5" cx="802" cy="195" r="3.5" fill="#ffffff" />
                <circle id="aee-t34-node-6" cx="543" cy="333.5" r="3.5" fill="#ffffff" />
              </svg>
            </div>

            <!-- Morph Thread 4->5: Vortex dive into horizontal clearing price line -->
            <div id="aee-thread-4-5" class="aee-morph-thread" style="display: none !important;">
              <svg viewBox="0 0 540 280" class="w-full max-w-xl h-72 sm:h-80 overflow-visible">
                <ellipse id="aee-t45-vortex" cx="270" cy="140" rx="160" ry="100" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.2" stroke-dasharray="4,4" />
                <line id="aee-t45-clearing-lead" x1="180" y1="140" x2="360" y2="140" stroke="#ffffff" stroke-width="2" style="opacity: 0;" />
              </svg>
            </div>

            <!-- Morph Thread 5->6: Clearing line elongates into DCF baseline & vertical waterfall -->
            <div id="aee-thread-5-6" class="aee-morph-thread" style="display: none !important;">
              <svg viewBox="0 0 600 220" class="w-full max-w-2xl h-56 sm:h-64 overflow-visible">
                <line id="aee-t56-timeline" x1="180" y1="130" x2="420" y2="130" stroke="#ffffff" stroke-width="1.5" />
                <line id="aee-t56-wf-1" x1="160" y1="130" x2="160" y2="130" stroke="rgba(255,255,255,0.6)" stroke-width="7" />
                <line id="aee-t56-wf-2" x1="225" y1="130" x2="225" y2="130" stroke="rgba(255,255,255,0.6)" stroke-width="7" />
                <line id="aee-t56-wf-3" x1="290" y1="130" x2="290" y2="130" stroke="rgba(255,255,255,0.6)" stroke-width="7" />
                <line id="aee-t56-wf-4" x1="355" y1="130" x2="355" y2="130" stroke="rgba(255,255,255,0.6)" stroke-width="7" />
                <line id="aee-t56-wf-5" x1="420" y1="130" x2="420" y2="130" stroke="rgba(255,255,255,0.6)" stroke-width="7" />
                <line id="aee-t56-wf-tv" x1="480" y1="130" x2="480" y2="130" stroke="#ffffff" stroke-width="9" />
              </svg>
            </div>

            <!-- Morph Thread 6->7: Terminal value bar shatters into stochastic Brownian paths -->
            <div id="aee-thread-6-7" class="aee-morph-thread" style="display: none !important;">
              <svg viewBox="0 0 400 200" class="w-full max-w-lg h-44 overflow-visible">
                <line id="aee-t67-tv-bar" x1="60" y1="100" x2="60" y2="25" stroke="#ffffff" stroke-width="8" />
                <text id="aee-t67-tv-label" x="60" y="18" fill="#ffffff" font-size="8" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">TERMINAL VALUE</text>
                <path id="aee-t67-path-1" d="M 60 100 Q 140 70 240 30" fill="none" stroke="#ffffff" stroke-width="1.5" />
                <path id="aee-t67-path-2" d="M 60 100 Q 140 85 240 65" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
                <path id="aee-t67-path-3" d="M 60 100 Q 140 100 240 100" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
                <path id="aee-t67-path-4" d="M 60 100 Q 140 115 240 135" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1" />
                <path id="aee-t67-path-5" d="M 60 100 Q 140 130 240 170" fill="none" stroke="#ffffff" stroke-width="1.5" />
                <circle id="aee-t67-origin" cx="60" cy="100" r="3.5" fill="#ffffff" />
              </svg>
            </div>

            <!-- Morph Thread 7->8: Reverse-dolly zoom straightening stochastic paths into Cartesian grid -->
            <div id="aee-thread-7-8" class="aee-morph-thread" style="display: none !important;">
              <svg viewBox="0 0 600 240" class="w-full max-w-2xl h-56 sm:h-64 overflow-visible">
                <path id="aee-t78-path-top" d="M 50 120 Q 200 40 550 40" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" />
                <path id="aee-t78-path-mid" d="M 50 120 Q 300 120 550 120" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" />
                <path id="aee-t78-path-bot" d="M 50 120 Q 200 200 550 200" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.2" />
                <line id="aee-t78-v1" x1="216" y1="40" x2="216" y2="40" stroke="rgba(255,255,255,0.5)" stroke-width="1" />
                <line id="aee-t78-v2" x1="384" y1="40" x2="384" y2="40" stroke="rgba(255,255,255,0.5)" stroke-width="1" />
              </svg>
            </div>
          </div>

          <!-- Unified Persistent Stage Editorial Layer (Single continuous canvas editorial) -->
          <div class="aee-stage-editorial pointer-events-none absolute inset-0 w-full h-full flex flex-col justify-between items-center z-20 py-6 sm:py-8 px-4" id="aee-stage-editorial" style="opacity: 0; visibility: hidden;">
            <!-- Top Persistent Editorial -->
            <div class="flex flex-col items-center text-center max-w-4xl mx-auto w-full">
              <div id="aee-stage-eyebrow" class="text-[10px] font-mono tracking-[0.28em] text-slate-400 uppercase mb-2">
                ACT I / THE DIRECT PHYSICAL SHOCK
              </div>
              <div id="aee-stage-headline" class="font-light uppercase text-white text-center flex items-center justify-center">
                ONE VARIABLE CHANGED.
              </div>
              <div id="aee-stage-divider" class="w-[1px] h-6 bg-white/20 my-2"></div>
              <div id="aee-stage-sub" class="text-xs sm:text-sm font-mono tracking-widest text-slate-400 uppercase text-center mb-1">
                10Y GOVERNMENT BOND
              </div>
            </div>

            <!-- Bottom Persistent Editorial -->
            <div id="aee-stage-footer" class="flex flex-col items-center text-center max-w-5xl mx-auto w-full">
              <div class="w-[1px] h-6 bg-white/20 my-2"></div>
              <div id="aee-stage-footer-title" class="font-light uppercase text-white text-center flex items-center justify-center">
                ONE PRICE MOVED.
              </div>
              <div id="aee-stage-footer-sub" class="aee-editorial-serif text-slate-300 italic text-center mt-1">
                The first effect is visible.
              </div>
            </div>
          </div>

          <!-- ===================================================================
               SCENE 1: CHANGE (0.00 - 0.12)
               The Ceteris Paribus condition and the initial catalyst
               =================================================================== -->
          <section class="aee-scene-layer" id="aee-scene-1" style="opacity: 1; transform: translate3d(0, 0, 0px);">
          <div class="max-w-4xl mx-auto px-6 text-center relative flex flex-col items-center justify-center min-h-[420px]">
            
            <!-- Eyebrow -->
            <div id="aee-s1-eyebrow" class="text-[9px] sm:text-[10px] font-mono tracking-[0.14em] sm:tracking-[0.28em] text-slate-400 uppercase mb-3">
              PROLOGUE / THE CETERIS PARIBUS CONDITION
            </div>

            <!-- Single Stationary Anchor Headline -->
            <div id="aee-s1-anchor-headline" class="text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.22em] uppercase text-white mb-2 flex items-center justify-center whitespace-nowrap">
              <span id="aee-s1-left-word" class="inline-block">ALL ELSE&nbsp;</span>
              <span id="aee-s1-equal" class="inline-block font-normal text-white">=</span
              ><span id="aee-s1-right-word" class="inline-block">&nbsp;EQUAL</span>
            </div>

            <!-- Vertical Hairline -->
            <div id="aee-s1-hairline" class="w-[1px] h-7 bg-white/20 my-3"></div>

            <!-- Subcontent Stack: Initial Prompt & Mutated Consequence in the exact same position -->
            <div class="relative w-full max-w-xl h-28 flex flex-col items-center justify-center">
              
              <!-- Initial Prompt (Visible at scroll = 0) -->
              <div id="aee-s1-initial-block" class="absolute inset-0 flex flex-col items-center justify-center">
                <div class="aee-editorial-serif text-xl sm:text-2xl text-slate-300 italic">
                  Change one thing.
                </div>
              </div>

              <!-- Mutated Consequence Sequence (Overlaid in same slot without duplicate headline) -->
              <div id="aee-s1-mutation-block" class="absolute inset-0 flex flex-col items-center justify-center opacity-0 pointer-events-none">
                <!-- Variable Delta Display Pill -->
                <div id="aee-s1-pill" class="inline-flex items-center gap-4 sm:gap-6 px-6 py-2 rounded-full border border-white/20 bg-white/[0.02] text-xs sm:text-sm font-mono tracking-widest uppercase mb-3">
                  <span class="text-slate-400">INTEREST RATE</span>
                  <span class="text-slate-300">4.00%</span>
                  <span class="text-white/40">----></span>
                  <span id="aee-s1-rate" class="text-white font-bold text-base sm:text-lg">5.00%</span>
                </div>

                <!-- Rhetorical Question -->
                <div id="aee-s1-question" class="aee-editorial-serif text-3xl sm:text-4xl text-white font-normal">
                  What changes?
                </div>
              </div>

            </div>

            <!-- Scroll Prompt -->
            <div id="aee-s1-scroll-prompt" class="absolute bottom-2 inset-x-0 mx-auto text-center flex flex-col items-center gap-1 text-[10px] tracking-[0.25em] text-slate-500 uppercase pointer-events-none transition-opacity duration-300">
              <span>SCROLL</span>
              <span class="animate-bounce">↓</span>
            </div>

          </div>
        </section>


        <!-- ===================================================================
             SCENE 2: FIRST EFFECT (0.12 - 0.25)
             Direct bond pricing and yield curve convexity
             =================================================================== -->
        <section class="aee-scene-layer opacity-0" id="aee-scene-2" style="opacity: 0; transform: translate3d(0, 0, -200px) scale(0.8); filter: blur(8px);">
          <div class="max-w-4xl mx-auto px-4 w-full flex flex-col items-center">
            
            <div class="aee-scene-editorial aee-scene-header flex flex-col items-center">
              <div id="aee-s2-eyebrow" class="text-[10px] font-mono tracking-[0.28em] text-slate-400 uppercase mb-2">
                ACT I / THE DIRECT PHYSICAL SHOCK
              </div>

              <div id="aee-s2-headline" class="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.22em] uppercase text-white text-center min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center">
                ONE VARIABLE CHANGED.
              </div>

              <div class="w-[1px] h-6 bg-white/20 my-3"></div>

              <div id="aee-s2-sub" class="text-xs sm:text-sm font-mono tracking-widest text-slate-400 uppercase text-center mb-3">
                10Y GOVERNMENT BOND
              </div>
            </div>

            <!-- Yield and Price Delta Box -->
            <div id="aee-s2-metric-container" class="flex items-center justify-center gap-3 sm:gap-14 font-mono text-[11px] sm:text-sm mb-6 min-h-[2.5rem]">
              <div id="aee-s2-yield-box" class="flex items-center gap-2 sm:gap-3 transition-all duration-200">
                <span class="text-slate-500 uppercase">YIELD</span>
                <span class="text-slate-400">4.00%</span>
                <span class="text-white/40">----></span>
                <span class="text-white font-bold">5.00%</span>
              </div>
              <div id="aee-s2-price-box" class="flex items-center gap-2 sm:gap-3 transition-all duration-200">
                <span class="text-slate-500 uppercase">PRICE</span>
                <span class="text-slate-400">100.00</span>
                <span class="text-white/40">----></span>
                <span class="text-white font-bold">92.28</span>
              </div>
            </div>

            <!-- Interactive SVG Bond Convexity Curve -->
            <div class="relative w-full max-w-2xl h-56 sm:h-64 my-1">
              <svg id="aee-s2-svg" viewBox="0 0 600 220" class="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
                <!-- Axes Group (Fades during morph) -->
                <g id="aee-s2-axes-group">
                  <line x1="80" y1="20" x2="80" y2="170" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                  <line x1="80" y1="170" x2="520" y2="170" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                  
                  <!-- Y-Axis Labels -->
                  <text x="35" y="100" fill="#64748b" font-size="10" font-family="Geist, sans-serif" letter-spacing="0.15em" transform="rotate(-90 35 100)" text-anchor="middle">BOND PRICE</text>
                  <text x="70" y="30" fill="#64748b" font-size="9" font-family="JetBrains Mono" text-anchor="end">120</text>
                  <text x="70" y="65" fill="#64748b" font-size="9" font-family="JetBrains Mono" text-anchor="end">110</text>
                  <text x="70" y="100" fill="#64748b" font-size="9" font-family="JetBrains Mono" text-anchor="end">100</text>
                  <text x="70" y="135" fill="#64748b" font-size="9" font-family="JetBrains Mono" text-anchor="end">90</text>
                  <text x="70" y="170" fill="#64748b" font-size="9" font-family="JetBrains Mono" text-anchor="end">80</text>

                  <!-- X-Axis Labels -->
                  <text x="180" y="188" fill="#f8fafc" font-size="10" font-family="JetBrains Mono" text-anchor="middle">4.00%</text>
                  <text x="420" y="188" fill="#ffffff" font-size="10" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">5.00%</text>
                  <text x="300" y="202" fill="#64748b" font-size="9" font-family="Geist, sans-serif" letter-spacing="0.12em" text-anchor="middle">YIELD (INTEREST RATE)</text>

                  <!-- Vertical Drop Lines -->
                  <line x1="180" y1="100" x2="180" y2="170" stroke="rgba(255,255,255,0.2)" stroke-dasharray="3,3" stroke-width="1" />
                  <line x1="420" y1="128" x2="420" y2="170" stroke="rgba(255,255,255,0.3)" stroke-dasharray="3,3" stroke-width="1" />

                  <!-- Point 1 (Par: 100.00) -->
                  <circle cx="180" cy="100" r="4.5" fill="#ffffff" stroke="#060709" stroke-width="2" />
                  <text x="180" y="74" fill="#ffffff" font-size="11" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">100.00</text>

                  <!-- Right Side Arrow Indicators -->
                  <line x1="530" y1="20" x2="530" y2="170" stroke="rgba(255,255,255,0.1)" stroke-width="1" />
                  <text x="548" y="90" fill="#f8fafc" font-size="10" font-family="Geist" letter-spacing="0.12em">RATES <tspan fill="#ffffff">↑</tspan></text>
                  <text x="548" y="118" fill="#f8fafc" font-size="10" font-family="Geist" letter-spacing="0.12em">BONDS <tspan fill="#ffffff">↓</tspan></text>
                </g>

                <!-- The Bond Price Convexity Curve -->
                <path id="aee-s2-curve" d="M 100 84 C 150 95, 210 105, 300 116 S 450 132, 500 138" fill="none" stroke="#ffffff" stroke-width="2" />
                <line id="aee-s2-tracer-trunk" x1="420" y1="128" x2="420" y2="128" stroke="#ffffff" stroke-width="2" style="display: none !important;" />

                <!-- Point 2 (Discount: 92.28) -->
                <g id="aee-s2-dot-group">
                  <circle id="aee-s2-dot-92" cx="420" cy="128" r="5" fill="#ffffff" stroke="#060709" stroke-width="2" />
                  <text id="aee-s2-dot-text" x="420" y="108" fill="#ffffff" font-size="12" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">92.28</text>
                </g>
              </svg>
            </div>

            <div class="aee-scene-editorial aee-scene-footer flex flex-col items-center">
              <div class="w-[1px] h-6 bg-white/20 my-3"></div>

              <div id="aee-s2-footer-title" class="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.22em] uppercase text-white text-center min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center">
                ONE PRICE MOVED.
              </div>

              <div id="aee-s2-footer-sub" class="aee-editorial-serif text-base sm:text-lg text-slate-300 italic text-center mt-2">
                The first effect is visible.
              </div>
            </div>

          </div>
        </section>


        <!-- ===================================================================
             SCENE 3: SECOND ORDER (0.25 - 0.38)
             Causal branching tree: what happens next
             =================================================================== -->
        <section class="aee-scene-layer opacity-0" id="aee-scene-3" style="opacity: 0; transform: translate3d(0, 0, -200px) scale(0.8); filter: blur(8px);">
          <div class="max-w-4xl mx-auto px-4 w-full flex flex-col items-center">
            
            <div class="aee-scene-editorial aee-scene-header flex flex-col items-center">
              <div id="aee-s3-eyebrow" class="text-[10px] font-mono tracking-[0.28em] text-slate-400 uppercase mb-2">
                ACT II / SECOND-ORDER CONSEQUENCES
              </div>

              <div id="aee-s3-headline" class="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.22em] uppercase text-white text-center min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center">
                FINANCE IS RARELY ABOUT THE FIRST EFFECT.
              </div>

              <div class="w-[1px] h-6 bg-white/20 my-3"></div>
            </div>

            <!-- Root Trigger Node -->
            <div id="aee-s3-root" class="px-5 py-2 rounded border border-white/30 bg-white/[0.04] text-xs sm:text-sm font-mono tracking-widest text-white font-semibold mb-4">
              INTEREST RATES ↑
            </div>

            <!-- Causal Branching Tree SVG + Nodes -->
            <div class="relative w-full max-w-2xl h-56 sm:h-64 my-1">
              <svg id="aee-s3-tree-svg" viewBox="0 0 600 220" class="w-full h-full overflow-visible">
                <!-- Main trunk down -->
                <line x1="300" y1="0" x2="300" y2="30" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
                <!-- Horizontal distribution line -->
                <line x1="100" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />

                <!-- Branch 1: Left to Bonds -->
                <line x1="100" y1="30" x2="100" y2="60" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />

                <!-- Branch 2: Center to Loans -->
                <line x1="300" y1="30" x2="300" y2="60" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
                <line x1="300" y1="90" x2="300" y2="120" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
                <line x1="300" y1="150" x2="300" y2="180" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />

                <!-- Branch 3: Right to Discount Rate -->
                <line x1="500" y1="30" x2="500" y2="60" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
                <line x1="500" y1="90" x2="500" y2="120" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" />
              </svg>

              <!-- Node Overlays -->
              <div class="absolute inset-0 pointer-events-none text-[10px] sm:text-xs font-mono">
                <!-- Left Branch -->
                <div class="aee-s3-node absolute left-[16.7%] top-[60px] transform -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-1.5 border border-white/20 bg-[#060709] rounded text-white whitespace-nowrap">
                  BONDS <span class="text-slate-300">↓</span>
                </div>

                <!-- Center Branch -->
                <div class="aee-s3-node absolute left-1/2 top-[60px] transform -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-1.5 border border-white/20 bg-[#060709] rounded text-white whitespace-nowrap">
                  LOANS <span class="text-slate-300">↑</span>
                </div>
                <div class="aee-s3-node absolute left-1/2 top-[120px] transform -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-1.5 border border-white/20 bg-[#060709] rounded text-slate-300 whitespace-nowrap">
                  BORROWING <span class="text-slate-300">↓</span>
                </div>
                <div class="aee-s3-node absolute left-1/2 top-[180px] transform -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-1.5 border border-white/20 bg-[#060709] rounded text-slate-300 whitespace-nowrap">
                  BUSINESS INVESTMENT <span class="text-slate-300">↓</span>
                </div>

                <!-- Right Branch -->
                <div class="aee-s3-node absolute left-[83.3%] top-[60px] transform -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-1.5 border border-white/20 bg-[#060709] rounded text-white whitespace-nowrap">
                  DISCOUNT RATE <span class="text-slate-300">↑</span>
                </div>
                <div class="aee-s3-node absolute left-[83.3%] top-[120px] transform -translate-x-1/2 px-2 sm:px-3 py-1 sm:py-1.5 border border-white/20 bg-[#060709] rounded text-slate-300 whitespace-nowrap">
                  VALUATIONS <span class="text-slate-300">↓</span>
                </div>
              </div>
            </div>

            <div class="aee-scene-editorial aee-scene-footer flex flex-col items-center">
              <div class="w-[1px] h-6 bg-white/20 my-3"></div>

              <div id="aee-s3-footer-title" class="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.22em] uppercase text-white text-center min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center">
                IT IS ABOUT WHAT HAPPENS NEXT.
              </div>

              <div id="aee-s3-footer-sub" class="aee-editorial-serif text-base sm:text-lg text-slate-300 italic text-center mt-2">
                Second-order effects shape the financial system.
              </div>
            </div>

          </div>
        </section>


        <!-- ===================================================================
             SCENE 4: THE SYSTEM (0.38 - 0.52)
             Macroeconomic circulatory network
             =================================================================== -->
        <section class="aee-scene-layer opacity-0" id="aee-scene-4" style="opacity: 0; transform: translate3d(0, 0, -200px) scale(0.8); filter: blur(8px);">
          <div class="max-w-6xl mx-auto px-4 w-full flex flex-col items-center">
            
            <div class="aee-scene-editorial aee-scene-header flex flex-col items-center">
              <div id="aee-s4-eyebrow" class="text-[10px] font-mono tracking-[0.28em] text-slate-400 uppercase mb-2">
                ACT III / THE LIVING METABOLISM
              </div>

              <div id="aee-s4-headline" class="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.22em] uppercase text-white text-center min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center">
                EVERYTHING IS CONNECTED.
              </div>

              <div class="w-[1px] h-4 bg-white/20 my-2"></div>

              <div id="aee-s4-sub" class="text-xs font-mono tracking-widest text-slate-300 uppercase mb-2">
                INTEREST RATES ↑
              </div>
            </div>

            <!-- Macroeconomic Institutional Web (Unified SVG System) -->
            <div class="relative w-full max-w-5xl overflow-hidden select-none">
              <svg viewBox="0 0 1024 371" class="w-full h-auto block select-none" id="aee-metabolism-svg">
                <defs>
                  <marker id="arrow-white" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 1 2 L 7 5 L 1 8 z" fill="rgba(255,255,255,0.85)" />
                  </marker>
                  <marker id="arrow-dashed" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <path d="M 1 2 L 7 5 L 1 8 z" fill="rgba(255,255,255,0.5)" />
                  </marker>
                </defs>

                <!-- Outer Card Frame -->
                <rect id="aee-s4-card-frame" class="aee-s4-card-frame" x="8" y="7" width="1008" height="356" rx="16" fill="#0a0b0d" stroke="rgba(255,255,255,0.15)" stroke-width="1.2" />

                <!-- Top Injection Bus -->
                <g class="aee-top-injection">
                  <line x1="512" y1="30" x2="512" y2="52" stroke="rgba(255,255,255,0.35)" stroke-dasharray="3 3" stroke-width="1.2" class="aee-flow-stream" />
                  <line x1="232" y1="52" x2="792" y2="52" stroke="rgba(255,255,255,0.35)" stroke-dasharray="3 3" stroke-width="1.2" class="aee-flow-stream" />
                  <line x1="232" y1="52" x2="232" y2="76" stroke="rgba(255,255,255,0.35)" stroke-dasharray="3 3" stroke-width="1.2" marker-end="url(#arrow-dashed)" class="aee-flow-stream" />
                </g>

                <!-- =======================================================
                     TRANSMISSION CONDUITS (Tracks, Streams & Solitons)
                     ======================================================= -->

                <!-- Flow: HOUSEHOLDS <-> BANKS (Savings / Deposits) -->
                <g class="aee-vector-conduit" data-conduit="hb-savings" data-from="households" data-to="banks">
                  <path id="track-hb-savings" d="M 195 70 L 427 70" class="aee-conduit-track" />
                  <path d="M 195 70 L 427 70" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 195 70 L 427 70" class="aee-flow-stream" />
                  <text x="311" y="62" class="aee-conduit-label" text-anchor="middle">SAVINGS / DEPOSITS</text>
                  <g class="aee-soliton" data-soliton-for="track-hb-savings" data-duration="2.4">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.4s" repeatCount="indefinite" path="M 195 70 L 427 70" />
                  </g>
                </g>

                <!-- Flow: BANKS <-> HOUSEHOLDS (Loans / Credit) -->
                <g class="aee-vector-conduit" data-conduit="hb-loans" data-from="banks" data-to="households">
                  <path id="track-hb-loans" d="M 431 86 L 199 86" class="aee-conduit-track" />
                  <path d="M 431 86 L 199 86" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 431 86 L 199 86" class="aee-flow-stream" />
                  <text x="311" y="98" class="aee-conduit-label" text-anchor="middle">LOANS / CREDIT</text>
                  <g class="aee-soliton" data-soliton-for="track-hb-loans" data-duration="2.5">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 431 86 L 199 86" />
                  </g>
                </g>

                <!-- Flow: HOUSEHOLDS -> COMPANIES (Consumption / Income) -->
                <g class="aee-vector-conduit" data-conduit="hc-consumption" data-from="households" data-to="companies">
                  <path id="track-hc-consumption" d="M 232 131 L 340 183" class="aee-conduit-track" />
                  <path d="M 232 131 L 340 183" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 232 131 L 340 183" class="aee-flow-stream" />
                  <text x="270" y="173" class="aee-conduit-label" text-anchor="middle">CONSUMPTION</text>
                  <text x="270" y="186" class="aee-conduit-label" text-anchor="middle">INCOME</text>
                  <g class="aee-soliton" data-soliton-for="track-hc-consumption" data-duration="2.6">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.6s" repeatCount="indefinite" path="M 232 131 L 340 183" />
                  </g>
                </g>

                <!-- Flow: BANKS -> COMPANIES (Lending) -->
                <g class="aee-vector-conduit" data-conduit="bc-lending" data-from="banks" data-to="companies">
                  <path id="track-bc-lending" d="M 490 95 L 490 170" class="aee-conduit-track" />
                  <path d="M 490 95 L 490 170" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 490 95 L 490 170" class="aee-flow-stream" />
                  <text x="480" y="136" class="aee-conduit-label" text-anchor="end">LENDING</text>
                  <g class="aee-soliton" data-soliton-for="track-bc-lending" data-duration="2.0">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.0s" repeatCount="indefinite" path="M 490 95 L 490 170" />
                  </g>
                </g>

                <!-- Flow: BANKS <-> MARKETS (Capital) -->
                <g class="aee-vector-conduit" data-conduit="bm-capital" data-from="banks" data-to="markets">
                  <path id="track-bm-capital" d="M 531 70 L 732 70" class="aee-conduit-track" />
                  <path d="M 531 70 L 732 70" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 531 70 L 732 70" class="aee-flow-stream" />
                  <text x="633" y="62" class="aee-conduit-label" text-anchor="middle">CAPITAL</text>
                  <g class="aee-soliton" data-soliton-for="track-bm-capital" data-duration="2.5">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 531 70 L 732 70" />
                  </g>
                </g>

                <!-- Flow: MARKETS <-> BANKS (Funding) -->
                <g class="aee-vector-conduit" data-conduit="bm-funding" data-from="markets" data-to="banks">
                  <path id="track-bm-funding" d="M 736 86 L 535 86" class="aee-conduit-track" />
                  <path d="M 736 86 L 535 86" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 736 86 L 535 86" class="aee-flow-stream" />
                  <text x="633" y="98" class="aee-conduit-label" text-anchor="middle">FUNDING</text>
                  <g class="aee-soliton" data-soliton-for="track-bm-funding" data-duration="2.7">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.7s" repeatCount="indefinite" path="M 736 86 L 535 86" />
                  </g>
                </g>

                <!-- Flow: COMPANIES -> MARKETS (Capital Raising) -->
                <g class="aee-vector-conduit" data-conduit="cm-capital" data-from="companies" data-to="markets">
                  <path id="track-cm-capital" d="M 535 187 L 535 130" class="aee-conduit-track" />
                  <path d="M 535 187 L 535 130" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 535 187 L 535 130" class="aee-flow-stream" />
                  <text x="544" y="156" class="aee-conduit-label" text-anchor="start">CAPITAL RAISING</text>
                  <g class="aee-soliton" data-soliton-for="track-cm-capital" data-duration="2.2">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.2s" repeatCount="indefinite" path="M 535 187 L 535 130" />
                  </g>
                </g>

                <!-- Flow: COMPANIES <-> GOVERNMENT (Taxes) -->
                <g class="aee-vector-conduit" data-conduit="cg-taxes" data-from="companies" data-to="government">
                  <path id="track-cg-taxes" d="M 494 187 L 726 187" class="aee-conduit-track" />
                  <path d="M 494 187 L 726 187" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 494 187 L 726 187" class="aee-flow-stream" />
                  <text x="610" y="179" class="aee-conduit-label" text-anchor="middle">TAXES</text>
                  <g class="aee-soliton" data-soliton-for="track-cg-taxes" data-duration="2.6">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.6s" repeatCount="indefinite" path="M 494 187 L 726 187" />
                  </g>
                </g>

                <!-- Flow: GOVERNMENT <-> COMPANIES (Spending / Contracts) -->
                <g class="aee-vector-conduit" data-conduit="cg-spending" data-from="government" data-to="companies">
                  <path id="track-cg-spending" d="M 730 203 L 498 203" class="aee-conduit-track" />
                  <path d="M 730 203 L 498 203" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 730 203 L 498 203" class="aee-flow-stream" />
                  <text x="610" y="217" class="aee-conduit-label" text-anchor="middle">SPENDING / CONTRACTS</text>
                  <g class="aee-soliton" data-soliton-for="track-cg-spending" data-duration="2.8">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.8s" repeatCount="indefinite" path="M 730 203 L 498 203" />
                  </g>
                </g>

                <!-- Flow: GOVERNMENT <-> MARKETS (Investment Capital) -->
                <g class="aee-vector-conduit" data-conduit="gm-investment" data-from="markets" data-to="government">
                  <path id="track-gm-investment" d="M 775 95 L 775 170" class="aee-conduit-track" />
                  <path d="M 775 95 L 775 170" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 775 95 L 775 170" class="aee-flow-stream" />
                  <text x="766" y="136" class="aee-conduit-label" text-anchor="end">INVESTMENT CAPITAL</text>
                  <g class="aee-soliton" data-soliton-for="track-gm-investment" data-duration="2.3">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.3s" repeatCount="indefinite" path="M 775 95 L 775 170" />
                  </g>
                </g>

                <!-- Flow: GOVERNMENT <-> MARKETS (Gov Securities) -->
                <g class="aee-vector-conduit" data-conduit="gm-securities" data-from="government" data-to="markets">
                  <path id="track-gm-securities" d="M 815 174 L 815 99" class="aee-conduit-track" />
                  <path d="M 815 174 L 815 99" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 815 174 L 815 99" class="aee-flow-stream" />
                  <text x="824" y="136" class="aee-conduit-label" text-anchor="start">GOV SECURITIES</text>
                  <g class="aee-soliton" data-soliton-for="track-gm-securities" data-duration="2.3">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.3s" repeatCount="indefinite" path="M 815 174 L 815 99" />
                  </g>
                </g>

                <!-- Flow: CENTRAL BANK <-> GOVERNMENT (Policy Direction) -->
                <g class="aee-vector-conduit" data-conduit="cbg-policy" data-from="central_bank" data-to="government">
                  <path id="track-cbg-policy" d="M 725 288 L 725 252" class="aee-conduit-track" />
                  <path d="M 725 288 L 725 252" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 725 288 L 725 252" class="aee-flow-stream" />
                  <text x="716" y="271" class="aee-conduit-label" text-anchor="end">POLICY DIRECTION</text>
                  <g class="aee-soliton" data-soliton-for="track-cbg-policy" data-duration="2.0">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.0s" repeatCount="indefinite" path="M 725 288 L 725 252" />
                  </g>
                </g>

                <!-- Flow: GOVERNMENT <-> CENTRAL BANK (Liquidity Facilities) -->
                <g class="aee-vector-conduit" data-conduit="cbg-liquidity" data-from="government" data-to="central_bank">
                  <path id="track-cbg-liquidity" d="M 758 254 L 758 289" class="aee-conduit-track" />
                  <path d="M 758 254 L 758 289" class="aee-stream-base" marker-end="url(#arrow-white)" />
                  <path d="M 758 254 L 758 289" class="aee-flow-stream" />
                  <text x="768" y="271" class="aee-conduit-label" text-anchor="start">LIQUIDITY FACILITIES</text>
                  <g class="aee-soliton" data-soliton-for="track-cbg-liquidity" data-duration="2.0">
                    <circle r="4" class="aee-soliton-halo" />
                    <circle r="2" class="aee-soliton-core" />
                    <animateMotion dur="2.0s" repeatCount="indefinite" path="M 758 254 L 758 289" />
                  </g>
                </g>

                <!-- MARKETS Sub-list -->
                <g class="aee-markets-sublist" data-from="markets" data-to="markets">
                  <line x1="886" y1="86" x2="904" y2="86" stroke="rgba(255,255,255,0.35)" stroke-width="1" />
                  <text x="912" y="89" fill="#cbd5e1" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="600" letter-spacing="0.05em">EQUITY</text>

                  <line x1="886" y1="103" x2="904" y2="103" stroke="rgba(255,255,255,0.35)" stroke-width="1" />
                  <text x="912" y="106" fill="#cbd5e1" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="600" letter-spacing="0.05em">DEBT</text>

                  <line x1="886" y1="120" x2="904" y2="120" stroke="rgba(255,255,255,0.35)" stroke-width="1" />
                  <text x="912" y="123" fill="#cbd5e1" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="600" letter-spacing="0.05em">FX</text>

                  <line x1="886" y1="137" x2="904" y2="137" stroke="rgba(255,255,255,0.35)" stroke-width="1" />
                  <text x="912" y="140" fill="#cbd5e1" font-size="9" font-family="'JetBrains Mono', monospace" font-weight="600" letter-spacing="0.05em">DERIVATIVES</text>
                </g>

                <!-- =======================================================
                     THE 6 INSTITUTIONAL NODES (Top Stacking Order)
                     ======================================================= -->

                <!-- Node 1: HOUSEHOLDS (top-left) -->
                <g class="aee-node" data-node="households" tabindex="0" role="button" aria-label="Households institutional sector">
                  <rect x="69" y="53" width="126" height="42" rx="6" fill="#060709" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" class="aee-node-box" />
                  <text x="132" y="74" fill="#ffffff" font-size="12" font-family="'JetBrains Mono', monospace" font-weight="700" letter-spacing="0.08em" text-anchor="middle" dominant-baseline="central" class="pointer-events-none">HOUSEHOLDS</text>
                </g>

                <!-- Node 2: BANKS (top-center) -->
                <g class="aee-node" data-node="banks" tabindex="0" role="button" aria-label="Banks institutional sector">
                  <rect x="431" y="53" width="100" height="42" rx="6" fill="#060709" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" class="aee-node-box" />
                  <text x="481" y="74" fill="#ffffff" font-size="12" font-family="'JetBrains Mono', monospace" font-weight="700" letter-spacing="0.08em" text-anchor="middle" dominant-baseline="central" class="pointer-events-none">BANKS</text>
                </g>

                <!-- Node 3: MARKETS (top-right) -->
                <g class="aee-node" data-node="markets" tabindex="0" role="button" aria-label="Markets institutional sector">
                  <rect x="736" y="53" width="118" height="42" rx="6" fill="#060709" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" class="aee-node-box" />
                  <text x="795" y="74" fill="#ffffff" font-size="12" font-family="'JetBrains Mono', monospace" font-weight="700" letter-spacing="0.08em" text-anchor="middle" dominant-baseline="central" class="pointer-events-none">MARKETS</text>
                </g>

                <!-- Node 4: COMPANIES (center-left) -->
                <g class="aee-node" data-node="companies" tabindex="0" role="button" aria-label="Companies institutional sector">
                  <rect x="340" y="174" width="154" height="42" rx="6" fill="#060709" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" class="aee-node-box" />
                  <text x="417" y="195" fill="#ffffff" font-size="12" font-family="'JetBrains Mono', monospace" font-weight="700" letter-spacing="0.08em" text-anchor="middle" dominant-baseline="central" class="pointer-events-none">COMPANIES</text>
                </g>

                <!-- Node 5: GOVERNMENT (center-right) -->
                <g class="aee-node" data-node="government" tabindex="0" role="button" aria-label="Government institutional sector">
                  <rect x="730" y="174" width="144" height="42" rx="6" fill="#060709" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" class="aee-node-box" />
                  <text x="802" y="195" fill="#ffffff" font-size="12" font-family="'JetBrains Mono', monospace" font-weight="700" letter-spacing="0.08em" text-anchor="middle" dominant-baseline="central" class="pointer-events-none">GOVERNMENT</text>
                </g>

                <!-- Node 6: CENTRAL BANK (bottom-center) -->
                <g class="aee-node" data-node="central_bank" tabindex="0" role="button" aria-label="Central Bank institutional sector">
                  <rect x="462" y="315" width="162" height="37" rx="6" fill="#060709" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" class="aee-node-box" />
                  <text x="543" y="333.5" fill="#ffffff" font-size="12" font-family="'JetBrains Mono', monospace" font-weight="700" letter-spacing="0.08em" text-anchor="middle" dominant-baseline="central" class="pointer-events-none">CENTRAL BANK</text>
                </g>
              </svg>
            </div>

            <div class="aee-scene-editorial aee-scene-footer flex flex-col items-center">
              <div class="w-[1px] h-4 bg-white/20 my-2"></div>

              <div id="aee-s4-footer-title" class="text-sm sm:text-base md:text-lg font-light tracking-[0.16em] uppercase text-white text-center min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
                BANKS PRICE CREDIT. MARKETS PRICE RISK. COMPANIES ALLOCATE CAPITAL.
              </div>

              <div id="aee-s4-footer-sub" class="aee-editorial-serif text-sm sm:text-base text-slate-300 italic text-center mt-1">
                The financial world is a system of connected decisions.
              </div>
            </div>

          </div>
        </section>


        <!-- ===================================================================
             SCENE 5: PRICE (0.52 - 0.65)
             Converging forces into market clearing price & order book
             =================================================================== -->
        <section class="aee-scene-layer opacity-0" id="aee-scene-5" style="opacity: 0; transform: translate3d(0, 0, -200px) scale(0.8); filter: blur(8px);">
          <div class="max-w-4xl mx-auto px-4 w-full flex flex-col items-center">
            
            <div class="aee-scene-editorial aee-scene-header flex flex-col items-center">
              <div id="aee-s5-eyebrow" class="text-[10px] font-mono tracking-[0.28em] text-slate-400 uppercase mb-2">
                ACT IV / THE AUCTION AT GROUND ZERO
              </div>

              <div id="aee-s5-headline" class="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.22em] uppercase text-white text-center min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center">
                A PRICE IS NOT A NUMBER.
              </div>

              <div class="w-[1px] h-5 bg-white/20 my-2"></div>
            </div>

            <!-- Converging Vectors & Price Core -->
            <div id="aee-s5-assembly" class="relative w-full max-w-2xl my-2 flex flex-col items-center justify-center">
              
              <!-- Top Conduit: Information Flow -->
              <div class="flex flex-col items-center mb-2 font-mono">
                <span class="text-[9px] text-slate-400 uppercase tracking-[0.2em]">INFORMATION</span>
                <div class="w-[1px] h-4 bg-white/30 relative my-0.5">
                  <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 border-b border-r border-white/60 rotate-45"></div>
                </div>
              </div>

              <!-- Mobile Top Forces: Valuation & Supply Drivers (< 640px) -->
              <div class="grid grid-cols-3 gap-1.5 w-72 mb-2 sm:hidden font-mono text-[9px] text-slate-400">
                <div class="border border-white/10 rounded px-1.5 py-1 text-center bg-white/[0.01]">
                  <div class="text-slate-500 uppercase tracking-tight text-[7.5px]">EXP</div>
                  <div class="text-slate-300">102.40</div>
                </div>
                <div class="border border-white/10 rounded px-1.5 py-1 text-center bg-white/[0.01]">
                  <div class="text-slate-500 uppercase tracking-tight text-[7.5px]">RISK</div>
                  <div class="text-slate-300">σ 14.2%</div>
                </div>
                <div class="border border-white/10 rounded px-1.5 py-1 text-center bg-white/[0.01]">
                  <div class="text-slate-500 uppercase tracking-tight text-[7.5px]">SUPPLY</div>
                  <div class="text-slate-300">530L</div>
                </div>
              </div>

              <!-- Central Assembly: Flanking Forces & Level 2 Order Book -->
              <div class="w-full flex items-center justify-center gap-3 sm:gap-6">
                
                <!-- Left Flank: Valuation & Supply Drivers (Desktop) -->
                <div class="hidden sm:flex flex-col justify-between h-48 text-right font-mono py-1">
                  <!-- Expectations -->
                  <div class="flex items-center gap-2.5">
                    <div class="flex flex-col items-end">
                      <span class="text-[9px] text-slate-400 uppercase tracking-widest">EXPECTATIONS</span>
                      <span class="text-[10px] text-slate-300">102.40</span>
                    </div>
                    <div class="w-6 sm:w-8 h-[1px] bg-white/30 relative">
                      <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-white/60 rotate-45"></div>
                    </div>
                  </div>

                  <!-- Risk -->
                  <div class="flex items-center gap-2.5">
                    <div class="flex flex-col items-end">
                      <span class="text-[9px] text-slate-400 uppercase tracking-widest">RISK</span>
                      <span class="text-[10px] text-slate-300">σ 14.2%</span>
                    </div>
                    <div class="w-6 sm:w-8 h-[1px] bg-white/30 relative">
                      <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-white/60 rotate-45"></div>
                    </div>
                  </div>

                  <!-- Supply -->
                  <div class="flex items-center gap-2.5">
                    <div class="flex flex-col items-end">
                      <span class="text-[9px] text-slate-400 uppercase tracking-widest">SUPPLY</span>
                      <span class="text-[10px] text-slate-300">530 LOTS</span>
                    </div>
                    <div class="w-6 sm:w-8 h-[1px] bg-white/30 relative">
                      <div class="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-white/60 rotate-45"></div>
                    </div>
                  </div>
                </div>

                <!-- Center: The Order Book & Clearing Spread Card -->
                <div id="aee-s5-card" class="w-72 sm:w-80 rounded-xl border border-white/15 bg-white/[0.02] backdrop-blur-sm p-4 font-mono shadow-2xl relative">
                  <!-- Card Header -->
                  <div class="flex justify-between items-center text-[9px] text-slate-400 tracking-[0.16em] uppercase pb-2 border-b border-white/10">
                    <span>CONTINUOUS AUCTION</span>
                    <span class="text-slate-500">DOM L2</span>
                  </div>

                  <!-- Asks Section -->
                  <div class="py-1.5">
                    <div class="flex justify-between text-[8.5px] text-slate-500 tracking-wider uppercase mb-1">
                      <span>SELL (ASKS)</span>
                      <span>DEPTH</span>
                    </div>
                    <div class="flex justify-between text-[11px] text-slate-400 leading-snug py-0.5">
                      <span>102.44</span><span class="text-slate-500">260</span>
                    </div>
                    <div class="flex justify-between text-[11px] text-slate-400 leading-snug py-0.5">
                      <span>102.43</span><span class="text-slate-500">180</span>
                    </div>
                    <div class="flex justify-between text-[11px] text-slate-300 font-semibold leading-snug py-0.5">
                      <span>102.42</span><span class="text-slate-400">90</span>
                    </div>
                  </div>

                  <!-- Clearing Spread Band (The Agreement) -->
                  <div class="my-1 py-1.5 px-2.5 rounded border border-white/30 bg-white/[0.06] flex items-center justify-between">
                    <div class="flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      <span class="text-[9px] text-slate-300 font-semibold uppercase tracking-wider">CLEARING</span>
                    </div>
                    <div id="aee-s5-price" class="text-xl sm:text-2xl font-mono font-bold text-white tracking-widest">
                      102.41
                    </div>
                    <span class="text-[9px] font-mono text-slate-400 uppercase tracking-wide">SPREAD 0.01</span>
                  </div>

                  <!-- Bids Section -->
                  <div class="py-1.5">
                    <div class="flex justify-between text-[11px] text-white font-bold leading-snug py-0.5">
                      <span>102.41</span><span class="text-slate-300">40</span>
                    </div>
                    <div class="flex justify-between text-[11px] text-slate-400 leading-snug py-0.5">
                      <span>102.40</span><span class="text-slate-500">110</span>
                    </div>
                    <div class="flex justify-between text-[11px] text-slate-400 leading-snug py-0.5">
                      <span>102.39</span><span class="text-slate-500">300</span>
                    </div>
                    <div class="flex justify-between text-[8.5px] text-slate-500 tracking-wider uppercase mt-1">
                      <span>BUY (BIDS)</span>
                      <span>DEPTH</span>
                    </div>
                  </div>
                </div>

                <!-- Right Flank: Execution & Demand Drivers (Desktop) -->
                <div class="hidden sm:flex flex-col justify-between h-48 text-left font-mono py-1">
                  <!-- Liquidity -->
                  <div class="flex items-center gap-2.5">
                    <div class="w-6 sm:w-8 h-[1px] bg-white/30 relative">
                      <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-b border-l border-white/60 rotate-45"></div>
                    </div>
                    <div class="flex flex-col items-start">
                      <span class="text-[9px] text-slate-400 uppercase tracking-widest">LIQUIDITY</span>
                      <span class="text-[10px] text-slate-300">$48.2M</span>
                    </div>
                  </div>

                  <!-- Time -->
                  <div class="flex items-center gap-2.5">
                    <div class="w-6 sm:w-8 h-[1px] bg-white/30 relative">
                      <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-b border-l border-white/60 rotate-45"></div>
                    </div>
                    <div class="flex flex-col items-start">
                      <span class="text-[9px] text-slate-400 uppercase tracking-widest">TIME</span>
                      <span class="text-[10px] text-slate-300">T + 0</span>
                    </div>
                  </div>

                  <!-- Demand -->
                  <div class="flex items-center gap-2.5">
                    <div class="w-6 sm:w-8 h-[1px] bg-white/30 relative">
                      <div class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-b border-l border-white/60 rotate-45"></div>
                    </div>
                    <div class="flex flex-col items-start">
                      <span class="text-[9px] text-slate-400 uppercase tracking-widest">DEMAND</span>
                      <span class="text-[10px] text-slate-300">450 LOTS</span>
                    </div>
                  </div>
                </div>

              </div>

              <!-- Mobile Bottom Forces: Execution & Demand Drivers (< 640px) -->
              <div class="grid grid-cols-3 gap-1.5 w-72 mt-2 sm:hidden font-mono text-[9px] text-slate-400">
                <div class="border border-white/10 rounded px-1.5 py-1 text-center bg-white/[0.01]">
                  <div class="text-slate-500 uppercase tracking-tight text-[7.5px]">LIQ</div>
                  <div class="text-slate-300">$48.2M</div>
                </div>
                <div class="border border-white/10 rounded px-1.5 py-1 text-center bg-white/[0.01]">
                  <div class="text-slate-500 uppercase tracking-tight text-[7.5px]">TIME</div>
                  <div class="text-slate-300">T+0</div>
                </div>
                <div class="border border-white/10 rounded px-1.5 py-1 text-center bg-white/[0.01]">
                  <div class="text-slate-500 uppercase tracking-tight text-[7.5px]">DEMAND</div>
                  <div class="text-slate-300">450L</div>
                </div>
              </div>

            </div>

            <div class="aee-scene-editorial aee-scene-footer flex flex-col items-center">
              <div class="w-[1px] h-5 bg-white/20 my-2"></div>

              <div id="aee-s5-footer-title" class="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.22em] uppercase text-white text-center min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center">
                IT IS AN AGREEMENT.
              </div>

              <div id="aee-s5-footer-sub" class="aee-editorial-serif text-sm sm:text-base text-slate-300 italic text-center mt-2">
                Expectations, information, liquidity, risk, time, supply and demand converge into price.
              </div>
            </div>

          </div>
        </section>


        <!-- ===================================================================
             SCENE 6: VALUE (0.65 - 0.77)
             DCF fundamentals and assumption sensitivity
             =================================================================== -->
        <!-- ===================================================================
             SCENE 6: VALUE (0.65 - 0.77)
             DCF fundamentals and assumption sensitivity
             =================================================================== -->
        <section class="aee-scene-layer opacity-0" id="aee-scene-6" style="opacity: 0; transform: translate3d(0, 0, -200px) scale(0.8); filter: blur(8px);">
          <div class="max-w-5xl mx-auto px-4 w-full flex flex-col items-center scale-[0.85] sm:scale-100 origin-center">
            
            <div class="aee-scene-editorial aee-scene-header flex flex-col items-center">
              <div id="aee-s6-eyebrow" class="text-[10px] font-mono tracking-[0.28em] text-slate-400 uppercase mb-1 sm:mb-2">
                ACT V / THE ANATOMY OF VALUE
              </div>

              <div id="aee-s6-headline" class="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.22em] uppercase text-white text-center min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center">
                VALUE IS A MODEL.
              </div>

              <div class="w-[1px] h-4 sm:h-5 bg-white/20 my-1 sm:my-2"></div>
            </div>

            <!-- 3-Pillar DCF Architecture & Sensitivity Matrix -->
            <div id="aee-s6-grid" class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 w-full items-stretch my-1 sm:my-2">
              
              <!-- Column 1: Terminal Growth Assumption (Delta g) -->
              <div class="aee-s6-card p-3.5 sm:p-5 rounded-xl border border-white/15 bg-white/[0.015] font-mono flex flex-col justify-between select-none min-h-[260px] sm:min-h-[295px]">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-[9px] sm:text-[10px] tracking-widest text-slate-400 uppercase font-semibold">01 / TERMINAL GROWTH</span>
                    <span id="aee-s6-growth-badge" class="text-[8.5px] px-1.5 py-0.5 rounded border border-white/20 bg-white/[0.04] text-slate-300 font-normal">Δg: -300 BPS</span>
                  </div>

                  <div class="flex items-center justify-center gap-2.5 my-1 font-mono">
                    <span class="text-xl sm:text-2xl text-white font-bold tracking-tight">8.0%</span>
                    <span class="text-slate-400 text-sm font-light">→</span>
                    <span class="text-xl sm:text-2xl text-white font-bold tracking-tight underline decoration-white/30 underline-offset-4">5.0%</span>
                  </div>

                  <div class="text-[9px] sm:text-[9.5px] text-slate-400 uppercase tracking-wider text-center mb-2">
                    LOWER GROWTH LOWERS TERMINAL VALUE
                  </div>
                </div>

                <!-- Growth Sensitivity Coordinate Curve SVG -->
                <div class="w-full h-24 sm:h-28 relative my-1">
                  <svg id="aee-s6-growth-svg" viewBox="0 0 200 95" class="w-full h-full overflow-visible">
                    <line x1="30" y1="12" x2="30" y2="72" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                    <line x1="30" y1="72" x2="185" y2="72" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                    
                    <text x="14" y="42" fill="#64748b" font-size="7" font-family="Geist" transform="rotate(-90 14 42)" text-anchor="middle">VALUE ($)</text>
                    <text x="110" y="85" fill="#64748b" font-size="7" font-family="Geist" text-anchor="middle">TERMINAL GROWTH (g)</text>

                    <!-- Sensitivity Curve V(g) -->
                    <path id="aee-s6-growth-curve" d="M 40 60 Q 95 40 165 18" fill="none" stroke="#ffffff" stroke-width="1.8" />
                    
                    <!-- Base Case Point -->
                    <circle cx="150" cy="22" r="3" fill="#ffffff" />
                    <text x="150" y="14" fill="#ffffff" font-size="7.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">8% g · $102.41</text>

                    <!-- Lower Terminal Point -->
                    <circle cx="65" cy="52" r="3" fill="#ffffff" />
                    <text x="65" y="64" fill="#64748b" font-size="7.5" font-family="JetBrains Mono" text-anchor="middle">5% g · $84.15</text>

                    <!-- Dynamic Tracer & Projections -->
                    <line id="aee-s6-growth-proj-x" x1="150" y1="22" x2="150" y2="72" stroke="rgba(255,255,255,0.3)" stroke-dasharray="2,2" stroke-width="1" />
                    <line id="aee-s6-growth-proj-y" x1="30" y1="22" x2="150" y2="22" stroke="rgba(255,255,255,0.3)" stroke-dasharray="2,2" stroke-width="1" />
                    <circle id="aee-s6-growth-tracer" cx="150" cy="22" r="3.5" fill="#ffffff" />
                  </svg>
                </div>

                <div class="flex items-center justify-between text-[8.5px] text-slate-400 border-t border-white/10 pt-1.5 mt-1">
                  <span>TERMINAL MULTIPLE</span>
                  <span id="aee-s6-growth-readout" class="text-white font-bold">18.4x → 12.1x</span>
                </div>
              </div>

              <!-- Column 2: The Cash Flow Transmission Engine -->
              <div class="aee-s6-card p-3.5 sm:p-5 rounded-xl border border-white/15 bg-white/[0.015] font-mono flex flex-col justify-between select-none min-h-[260px] sm:min-h-[295px]">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-[9px] sm:text-[10px] tracking-widest text-slate-400 uppercase font-semibold">02 / CASH FLOW ENGINE</span>
                    <span class="text-[8.5px] px-1.5 py-0.5 rounded border border-white/20 bg-white/[0.04] text-slate-300 font-normal">EQUILIBRIUM</span>
                  </div>

                  <div class="text-center my-0.5">
                    <div class="text-[8.5px] text-slate-400 uppercase tracking-widest">INTRINSIC VALUATION APEX</div>
                    <div class="text-2xl sm:text-3xl text-white font-bold tracking-tight">$102.41</div>
                  </div>
                </div>

                <!-- 4-Stage Cash Flow Waterfall Ladder -->
                <div id="aee-s6-waterfall" class="flex flex-col gap-1.5 my-1.5 w-full">
                  <div id="aee-s6-tier-1" class="aee-s6-tier flex items-center justify-between px-2.5 py-1 rounded border border-white/10 bg-white/[0.02] text-[8.5px] sm:text-[9px] transition-all">
                    <span class="text-slate-400">1. GROSS REVENUE</span>
                    <span class="text-white font-semibold">$1,000M</span>
                  </div>
                  <div id="aee-s6-tier-2" class="aee-s6-tier flex items-center justify-between px-2.5 py-1 rounded border border-white/10 bg-white/[0.02] text-[8.5px] sm:text-[9px] transition-all">
                    <span class="text-slate-400">2. OPERATING CASH FLOW</span>
                    <span class="text-white font-semibold">$220M (22%)</span>
                  </div>
                  <div id="aee-s6-tier-3" class="aee-s6-tier flex items-center justify-between px-2.5 py-1 rounded border border-white/10 bg-white/[0.02] text-[8.5px] sm:text-[9px] transition-all">
                    <span class="text-slate-400">3. FREE CASH FLOW (FCF)</span>
                    <span class="text-white font-semibold">$145M</span>
                  </div>
                  <div id="aee-s6-tier-4" class="aee-s6-tier flex items-center justify-between px-2.5 py-1 rounded border border-white/10 bg-white/[0.02] text-[8.5px] sm:text-[9px] transition-all">
                    <span class="text-slate-400">4. DISCOUNTED PV + TV</span>
                    <span class="text-white font-bold">$102.41 / SH</span>
                  </div>
                </div>

                <div id="aee-s6-formula-pill" class="p-2 rounded border border-white/15 bg-white/[0.03] text-center border-t border-white/10">
                  <div class="text-[9px] sm:text-[9.5px] text-white font-semibold tracking-tight">VALUE = Σ [ FCF_t / (1+r)^t ] + TV</div>
                  <div class="text-[8px] text-slate-400 mt-0.5 font-sans">Future cash flows adjusted for time and risk</div>
                </div>
              </div>

              <!-- Column 3: Cost of Capital Assumption (Delta r) -->
              <div class="aee-s6-card p-3.5 sm:p-5 rounded-xl border border-white/15 bg-white/[0.015] font-mono flex flex-col justify-between select-none min-h-[260px] sm:min-h-[295px]">
                <div>
                  <div class="flex items-center justify-between mb-1.5">
                    <span class="text-[9px] sm:text-[10px] tracking-widest text-slate-400 uppercase font-semibold">03 / COST OF CAPITAL</span>
                    <span id="aee-s6-rate-badge" class="text-[8.5px] px-1.5 py-0.5 rounded border border-white/20 bg-white/[0.04] text-slate-300 font-normal">Δr: +200 BPS</span>
                  </div>

                  <div class="flex items-center justify-center gap-2.5 my-1 font-mono">
                    <span class="text-xl sm:text-2xl text-white font-bold tracking-tight">7.0%</span>
                    <span class="text-slate-400 text-sm font-light">→</span>
                    <span class="text-xl sm:text-2xl text-white font-bold tracking-tight underline decoration-white/30 underline-offset-4">9.0%</span>
                  </div>

                  <div class="text-[9px] sm:text-[9.5px] text-slate-400 uppercase tracking-wider text-center mb-2">
                    HIGHER DISCOUNT RATE COMPRESSES VALUE
                  </div>
                </div>

                <!-- Discount Sensitivity Convex Curve SVG -->
                <div class="w-full h-24 sm:h-28 relative my-1">
                  <svg id="aee-s6-rate-svg" viewBox="0 0 200 95" class="w-full h-full overflow-visible">
                    <line x1="30" y1="12" x2="30" y2="72" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                    <line x1="30" y1="72" x2="185" y2="72" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                    
                    <text x="14" y="42" fill="#64748b" font-size="7" font-family="Geist" transform="rotate(-90 14 42)" text-anchor="middle">VALUE ($)</text>
                    <text x="110" y="85" fill="#64748b" font-size="7" font-family="Geist" text-anchor="middle">DISCOUNT RATE (r)</text>

                    <!-- Convex Sensitivity Curve V(r) -->
                    <path id="aee-s6-rate-curve" d="M 40 18 Q 95 38 165 65" fill="none" stroke="#ffffff" stroke-width="1.8" />
                    
                    <!-- Base Case Point -->
                    <circle cx="55" cy="22" r="3" fill="#ffffff" />
                    <text x="55" y="14" fill="#ffffff" font-size="7.5" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">7% r · $102.41</text>

                    <!-- Higher Risk Point -->
                    <circle cx="150" cy="58" r="3" fill="#ffffff" />
                    <text x="150" y="68" fill="#64748b" font-size="7.5" font-family="JetBrains Mono" text-anchor="middle">9% r · $68.27</text>

                    <!-- Dynamic Tracer & Projections -->
                    <line id="aee-s6-rate-proj-x" x1="55" y1="22" x2="55" y2="72" stroke="rgba(255,255,255,0.3)" stroke-dasharray="2,2" stroke-width="1" />
                    <line id="aee-s6-rate-proj-y" x1="30" y1="22" x2="55" y2="22" stroke="rgba(255,255,255,0.3)" stroke-dasharray="2,2" stroke-width="1" />
                    <circle id="aee-s6-rate-tracer" cx="55" cy="22" r="3.5" fill="#ffffff" />
                  </svg>
                </div>

                <div class="flex items-center justify-between text-[8.5px] text-slate-400 border-t border-white/10 pt-1.5 mt-1">
                  <span>EQUITY IMPACT</span>
                  <span id="aee-s6-rate-readout" class="text-white font-bold">$102.41 → $68.27 (-33%)</span>
                </div>
              </div>

            </div>

            <div class="aee-scene-editorial aee-scene-footer flex flex-col items-center">
              <div class="w-[1px] h-4 bg-white/20 my-2"></div>

              <div id="aee-s6-footer-title" class="text-lg sm:text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-white text-center min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
                CHANGE THE ASSUMPTIONS. CHANGE THE ANSWER.
              </div>

              <div id="aee-s6-footer-sub" class="aee-editorial-serif text-sm sm:text-base text-slate-300 italic text-center mt-1">
                Revenue, growth, cash flow, time and risk all shape value.
              </div>
            </div>

          </div>
        </section>


        <!-- ===================================================================
             SCENE 7: RISK (0.77 - 0.88)
             Quantitative risk: Monte Carlo paths, normal distribution, option payoff
             =================================================================== -->
        <section class="aee-scene-layer opacity-0" id="aee-scene-7" style="opacity: 0; transform: translate3d(0, 0, -200px) scale(0.8); filter: blur(8px);">
          <div class="max-w-5xl mx-auto px-4 w-full flex flex-col items-center scale-[0.80] sm:scale-100 origin-center">
            
            <div class="aee-scene-editorial aee-scene-header flex flex-col items-center">
              <div id="aee-s7-eyebrow" class="text-[10px] font-mono tracking-[0.28em] text-slate-400 uppercase mb-1 sm:mb-2">
                ACT VI / NAVIGATING UNCERTAINTY
              </div>

              <div id="aee-s7-headline" class="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.22em] uppercase text-white text-center min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center">
                UNCERTAINTY CAN BE MEASURED.
              </div>

              <div class="w-[1px] h-3 sm:h-4 bg-white/20 my-1 sm:my-2"></div>
            </div>

            <!-- 3-Column Quantitative Risk Model Matrix -->
            <div id="aee-s7-grid" class="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-6 w-full items-start my-1 sm:my-2">
              
              <!-- Column 1: Monte Carlo Diffusion Paths -->
              <div class="flex flex-col items-center text-center">
                <div class="text-xs font-mono tracking-widest text-slate-300 uppercase flex items-center justify-center gap-1.5">
                  <span>UNCERTAIN FUTURES</span>
                  <span id="aee-s7-time-readout" class="text-[9px] px-1.5 py-0.5 rounded border border-white/20 bg-white/[0.04] text-slate-300 font-normal">T: 0.0Y</span>
                </div>
                <div class="text-[9.5px] sm:text-[10px] text-slate-500 uppercase mb-1 sm:mb-3">MANY POSSIBLE PATHS.</div>
                
                <div class="w-full h-24 sm:h-36 relative">
                  <svg id="aee-s7-monte-svg" viewBox="0 0 200 130" class="w-full h-full overflow-visible">
                    <line x1="30" y1="15" x2="30" y2="110" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                    <line x1="30" y1="110" x2="190" y2="110" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                    <circle cx="30" cy="62" r="3" fill="#ffffff" />
                    <text x="22" y="66" fill="#ffffff" font-size="9" font-family="JetBrains Mono" text-anchor="end">100</text>

                    <!-- Time Cursor Line -->
                    <line id="aee-s7-time-cursor" x1="30" y1="15" x2="30" y2="110" stroke="rgba(255,255,255,0.3)" stroke-dasharray="2,2" stroke-width="1" opacity="0.6" />

                    <!-- Stochastic Fan Paths with pathLength for exact percentage drawing -->
                    <path id="aee-s7-path-0" class="aee-s7-path" d="M 30 62 Q 70 50 110 35 T 190 20" fill="none" stroke="#ffffff" stroke-width="1.5" pathLength="100" />
                    <path id="aee-s7-path-1" class="aee-s7-path" d="M 30 62 Q 70 60 110 45 T 190 38" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1" pathLength="100" />
                    <path id="aee-s7-path-2" class="aee-s7-path" d="M 30 62 Q 70 65 110 60 T 190 55" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1" pathLength="100" />
                    <path id="aee-s7-path-3" class="aee-s7-path" d="M 30 62 Q 70 70 110 75 T 190 70" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1" pathLength="100" />
                    <path id="aee-s7-path-4" class="aee-s7-path" d="M 30 62 Q 70 80 110 90 T 190 102" fill="none" stroke="#ffffff" stroke-width="1.5" pathLength="100" />

                    <!-- Kinetic Tracer Dots at current path tip -->
                    <circle id="aee-s7-tracer-0" cx="30" cy="62" r="2.5" fill="#ffffff" class="aee-s7-tracer transition-transform" />
                    <circle id="aee-s7-tracer-1" cx="30" cy="62" r="2" fill="#ffffff" class="aee-s7-tracer transition-transform" />
                    <circle id="aee-s7-tracer-2" cx="30" cy="62" r="2" fill="#ffffff" class="aee-s7-tracer transition-transform" />
                    <circle id="aee-s7-tracer-3" cx="30" cy="62" r="2" fill="#ffffff" class="aee-s7-tracer transition-transform" />
                    <circle id="aee-s7-tracer-4" cx="30" cy="62" r="2.5" fill="#ffffff" class="aee-s7-tracer transition-transform" />

                    <!-- Time Ticks -->
                    <text x="30" y="122" fill="#64748b" font-size="8" font-family="JetBrains Mono" text-anchor="middle">0</text>
                    <text x="70" y="122" fill="#64748b" font-size="8" font-family="JetBrains Mono" text-anchor="middle">1</text>
                    <text x="110" y="122" fill="#64748b" font-size="8" font-family="JetBrains Mono" text-anchor="middle">2</text>
                    <text x="150" y="122" fill="#64748b" font-size="8" font-family="JetBrains Mono" text-anchor="middle">3</text>
                    <text x="190" y="122" fill="#64748b" font-size="8" font-family="JetBrains Mono" text-anchor="middle">5</text>
                    <text x="110" y="132" fill="#64748b" font-size="8" font-family="Geist" text-anchor="middle">YEARS</text>
                  </svg>
                </div>
              </div>

              <!-- Column 2: Gaussian Normal Distribution & Greeks -->
              <div class="flex flex-col items-center text-center">
                <div class="text-xs font-mono tracking-widest text-slate-300 uppercase flex items-center justify-center gap-1.5">
                  <span>MEASURABLE RISK</span>
                  <span id="aee-s7-bell-metric" class="text-[9px] px-1.5 py-0.5 rounded border border-white/20 bg-white/[0.04] text-slate-300 font-normal">σ: 15.0%</span>
                </div>
                <div class="text-[9.5px] sm:text-[10px] text-slate-500 uppercase mb-1 sm:mb-2">TURNING UNCERTAINTY INTO INSIGHT.</div>
                
                <div class="flex flex-wrap justify-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-mono text-slate-400 mb-1 sm:mb-2">
                  <span>RETURN</span>·<span>VOLATILITY</span>·<span>CORRELATION</span>·<span>DURATION</span>·<span>DELTA</span>·<span>GAMMA</span>·<span>VEGA</span>
                </div>

                <div class="w-full h-20 sm:h-28 relative">
                  <svg id="aee-s7-bell-svg" viewBox="0 0 200 90" class="w-full h-full overflow-visible">
                    <line x1="20" y1="75" x2="180" y2="75" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                    
                    <!-- Shaded Confidence Interval Core & Body -->
                    <path id="aee-s7-bell-ci" d="M 65 75 Q 85 75 100 15 Q 115 75 135 75 Z" fill="rgba(255,255,255,0.12)" />
                    <path id="aee-s7-bell-fill" d="M 20 75 Q 70 75 100 15 Q 130 75 180 75 Z" fill="rgba(255,255,255,0.06)" />
                    
                    <!-- Dynamic Bell Curve Outline -->
                    <path id="aee-s7-bell-curve" d="M 20 75 Q 70 75 100 15 Q 130 75 180 75" fill="none" stroke="#ffffff" stroke-width="1.5" />
                    <line id="aee-s7-bell-median" x1="100" y1="15" x2="100" y2="72" stroke="rgba(255,255,255,0.4)" stroke-dasharray="2,2" stroke-width="1" />
                    <circle id="aee-s7-bell-peak" cx="100" cy="15" r="2.5" fill="#ffffff" />
                    
                    <text x="35" y="86" fill="#64748b" font-size="7" font-family="JetBrains Mono" text-anchor="middle">-3σ</text>
                    <text x="65" y="86" fill="#64748b" font-size="7" font-family="JetBrains Mono" text-anchor="middle">-2σ</text>
                    <text x="85" y="86" fill="#64748b" font-size="7" font-family="JetBrains Mono" text-anchor="middle">-1σ</text>
                    <text x="100" y="86" fill="#ffffff" font-size="8" font-family="JetBrains Mono" font-weight="bold" text-anchor="middle">0</text>
                    <text x="115" y="86" fill="#64748b" font-size="7" font-family="JetBrains Mono" text-anchor="middle">1σ</text>
                    <text x="135" y="86" fill="#64748b" font-size="7" font-family="JetBrains Mono" text-anchor="middle">2σ</text>
                    <text x="165" y="86" fill="#64748b" font-size="7" font-family="JetBrains Mono" text-anchor="middle">3σ</text>
                    <text x="100" y="96" fill="#64748b" font-size="7" font-family="Geist" text-anchor="middle">RETURNS</text>
                  </svg>
                </div>
              </div>

              <!-- Column 3: Call Option Payoff Hockey Stick Curve -->
              <div class="flex flex-col items-center text-center">
                <div class="text-xs font-mono tracking-widest text-slate-300 uppercase flex items-center justify-center gap-1.5">
                  <span>RISK CAN BE PRICED</span>
                  <span id="aee-s7-option-readout" class="text-[9px] px-1.5 py-0.5 rounded border border-white/20 bg-white/[0.04] text-slate-300 font-normal">S: $100 · C: $0</span>
                </div>
                <div class="text-[9.5px] sm:text-[10px] text-slate-500 uppercase mb-1 sm:mb-3">AND TRANSFERRED.</div>
                
                <div class="w-full h-20 sm:h-28 relative">
                  <svg id="aee-s7-option-svg" viewBox="0 0 180 85" class="w-full h-full overflow-visible">
                    <line x1="20" y1="10" x2="20" y2="65" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                    <line x1="20" y1="65" x2="170" y2="65" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
                    
                    <text x="10" y="35" fill="#64748b" font-size="7" font-family="Geist" transform="rotate(-90 10 35)" text-anchor="middle">PAYOFF</text>
                    <text x="16" y="67" fill="#64748b" font-size="7" font-family="JetBrains Mono" text-anchor="end">0</text>

                    <!-- Pre-Expiration Smooth Black-Scholes Curve -->
                    <path id="aee-s7-bs-curve" d="M 20 62 Q 70 60 90 48 T 160 15" fill="none" stroke="rgba(255,255,255,0.3)" stroke-dasharray="3,2" stroke-width="1" />

                    <!-- Intrinsic Hockey Stick Payoff -->
                    <line id="aee-s7-payoff-flat" x1="20" y1="65" x2="90" y2="65" stroke="#ffffff" stroke-width="1.8" />
                    <line id="aee-s7-payoff-slope" x1="90" y1="65" x2="160" y2="15" stroke="#ffffff" stroke-width="1.8" />
                    <circle id="aee-s7-strike-dot" cx="90" cy="65" r="3" fill="#ffffff" />

                    <!-- Dynamic Asset Price Tracer & Crosshair Projections -->
                    <line id="aee-s7-proj-x" x1="90" y1="65" x2="90" y2="65" stroke="rgba(255,255,255,0.3)" stroke-dasharray="2,2" stroke-width="1" />
                    <line id="aee-s7-proj-y" x1="20" y1="65" x2="90" y2="65" stroke="rgba(255,255,255,0.3)" stroke-dasharray="2,2" stroke-width="1" />
                    <circle id="aee-s7-asset-dot" cx="90" cy="65" r="3.5" fill="#ffffff" />
                    
                    <text x="90" y="77" fill="#ffffff" font-size="7" font-family="JetBrains Mono" text-anchor="middle">STRIKE</text>
                    <text x="150" y="77" fill="#64748b" font-size="7" font-family="Geist" text-anchor="middle">ASSET PRICE</text>
                  </svg>
                </div>

                <div class="flex flex-wrap justify-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] font-mono text-slate-400 mt-1 sm:mt-2">
                  <span>OPTIONS</span>·<span>FUTURES</span>·<span>SWAPS</span>·<span>HEDGES</span>·<span>PORTFOLIOS</span>
                </div>
              </div>

            </div>

            <div class="aee-scene-editorial aee-scene-footer flex flex-col items-center">
              <div class="w-[1px] h-4 bg-white/20 my-2"></div>

              <div id="aee-s7-footer-title" class="text-lg sm:text-2xl md:text-3xl font-light tracking-[0.2em] uppercase text-white text-center min-h-[2.5rem] sm:min-h-[3rem] flex items-center justify-center">
                RISK CAN BE PRICED. RISK CAN BE TRANSFERRED.
              </div>

              <div id="aee-s7-footer-sub" class="aee-editorial-serif text-sm sm:text-base text-slate-300 italic text-center mt-1">
                Returns, volatility and exposure shape the way financial risk is understood.
              </div>
            </div>

          </div>
        </section>


        <!-- ===================================================================
             SCENE 8: THE FINANCIAL WORLD (0.88 - 1.00)
             The complete unified architecture
             =================================================================== -->
        <section class="aee-scene-layer opacity-0" id="aee-scene-8" style="opacity: 0; transform: translate3d(0, 0, -200px) scale(0.8); filter: blur(8px);">
          <div class="max-w-5xl mx-auto px-4 w-full flex flex-col items-center scale-[0.78] sm:scale-100 origin-center">
            
            <div class="aee-scene-editorial aee-scene-header flex flex-col items-center">
              <div id="aee-s8-eyebrow" class="text-[10px] font-mono tracking-[0.28em] text-slate-400 uppercase mb-1">
                ACT VII / THE COMPLETE ARCHITECTURE
              </div>

              <div id="aee-s8-headline" class="text-xl sm:text-3xl md:text-4xl font-light tracking-[0.2em] uppercase text-white text-center min-h-[3.5rem] sm:min-h-[4.5rem] flex items-center justify-center">
                UNDERSTAND THE FINANCIAL WORLD.
              </div>
              <div id="aee-s8-sub" class="text-[10px] sm:text-xs font-mono tracking-widest text-slate-400 uppercase text-center mt-0.5">
                A CONNECTED SYSTEM. A BRIGHTER TOMORROW.
              </div>
            </div>

            <!-- Complete Unified Curriculum Atlas Map -->
            <div id="aee-s8-curriculum-card" class="relative w-full max-w-4xl border border-white/15 rounded-xl bg-white/[0.015] p-2.5 sm:p-5 my-1 sm:my-2">
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 text-left">
                
                <!-- Economics -->
                <div class="p-2 sm:p-3 border border-white/10 rounded-lg bg-[#060709]/80">
                  <div class="text-[11px] sm:text-xs font-mono font-semibold text-white tracking-wider uppercase mb-0.5 sm:mb-1">ECONOMICS</div>
                  <ul class="text-[10px] sm:text-[11px] text-slate-400 space-y-0.5 font-sans">
                    <li>• Monetary policy</li>
                    <li>• Inflation & rates</li>
                    <li>• GDP & growth</li>
                    <li>• Trade & FX</li>
                  </ul>
                </div>

                <!-- Financial Markets -->
                <div class="p-2 sm:p-3 border border-white/10 rounded-lg bg-[#060709]/80">
                  <div class="text-[11px] sm:text-xs font-mono font-semibold text-white tracking-wider uppercase mb-0.5 sm:mb-1">FINANCIAL MARKETS</div>
                  <ul class="text-[10px] sm:text-[11px] text-slate-400 space-y-0.5 font-sans">
                    <li>• Equities & debt</li>
                    <li>• Fixed income</li>
                    <li>• Foreign exchange</li>
                    <li>• Derivatives & commodities</li>
                  </ul>
                </div>

                <!-- Corporate Finance -->
                <div class="p-2 sm:p-3 border border-white/10 rounded-lg bg-[#060709]/80">
                  <div class="text-[11px] sm:text-xs font-mono font-semibold text-white tracking-wider uppercase mb-0.5 sm:mb-1">CORPORATE FINANCE</div>
                  <ul class="text-[10px] sm:text-[11px] text-slate-400 space-y-0.5 font-sans">
                    <li>• Accounting & 3-statements</li>
                    <li>• Valuation & DCF</li>
                    <li>• Capital structure</li>
                    <li>• M&A and restructuring</li>
                  </ul>
                </div>

                <!-- Investing & Risk -->
                <div class="p-2 sm:p-3 border border-white/10 rounded-lg bg-[#060709]/80">
                  <div class="text-[11px] sm:text-xs font-mono font-semibold text-white tracking-wider uppercase mb-0.5 sm:mb-1">INVESTING & RISK</div>
                  <ul class="text-[10px] sm:text-[11px] text-slate-400 space-y-0.5 font-sans">
                    <li>• Portfolio theory</li>
                    <li>• Asset management</li>
                    <li>• Risk management</li>
                    <li>• Behavioral finance</li>
                  </ul>
                </div>

                <!-- Center Core -->
                <div class="col-span-2 sm:col-span-1 p-2 sm:p-3.5 border border-white/30 rounded-lg bg-white/[0.04] text-center flex flex-col items-center justify-center">
                  <div class="text-[9.5px] sm:text-[10px] font-mono text-white font-bold tracking-widest uppercase">THE FINANCIAL WORLD</div>
                  <div class="text-[11px] sm:text-xs text-white font-semibold my-0.5 sm:my-1">PEOPLE · CAPITAL · IDEAS · MARKETS</div>
                  <div class="text-[9px] sm:text-[9.5px] text-slate-400 uppercase tracking-wider">A MORE EQUAL TOMORROW</div>
                </div>

                <!-- Quantitative Finance -->
                <div class="p-2 sm:p-3 border border-white/10 rounded-lg bg-[#060709]/80">
                  <div class="text-[11px] sm:text-xs font-mono font-semibold text-white tracking-wider uppercase mb-0.5 sm:mb-1">QUANTITATIVE FINANCE</div>
                  <ul class="text-[10px] sm:text-[11px] text-slate-400 space-y-0.5 font-sans">
                    <li>• Probability & statistics</li>
                    <li>• Stochastic calculus</li>
                    <li>• Market microstructure</li>
                    <li>• Systematic algorithms</li>
                  </ul>
                </div>

                <!-- Banking (Mobile Grid Complement to complete 2x4 symmetry) -->
                <div class="sm:hidden p-2 border border-white/10 rounded-lg bg-[#060709]/80">
                  <div class="text-[11px] font-mono font-semibold text-white tracking-wider uppercase mb-0.5">BANKING</div>
                  <ul class="text-[10px] text-slate-400 space-y-0.5 font-sans">
                    <li>• Lending & deposits</li>
                    <li>• Payments infrastructure</li>
                    <li>• Credit creation</li>
                    <li>• Central bank liquidity</li>
                  </ul>
                </div>

              </div>

              <!-- Banking Floor (Desktop Foundation) -->
              <div class="hidden sm:block mt-2 sm:mt-3 p-2 sm:p-2.5 border border-white/10 rounded-lg bg-[#060709]/80 text-center">
                <span class="text-[11px] sm:text-xs font-mono font-semibold text-white tracking-wider uppercase mr-2 sm:mr-3">BANKING</span>
                <span class="text-[10px] sm:text-[11px] text-slate-400 font-sans">Lending · Deposits · Payments · Credit creation · Central bank liquidity</span>
              </div>
            </div>

            <!-- Final Brand Showcase & Action CTAs -->
            <div id="aee-s8-brand-cta" class="aee-scene-editorial text-center mt-1 sm:mt-2 flex flex-col items-center">
              <div class="text-xl sm:text-4xl font-light tracking-[0.24em] uppercase text-white">
                ALL ELSE EQUAL
              </div>
              <div class="aee-editorial-serif text-sm sm:text-xl text-slate-200 italic mt-0.5 sm:mt-1">
                Understand what changes when one thing does.
              </div>
              <p class="text-[11px] sm:text-xs text-slate-400 max-w-lg mt-0.5 sm:mt-1 font-sans">
                Learn the financial world through interactive explanations, problems, and simulations.
              </p>

              <div class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-2 sm:mt-5">
                <button id="aee-enter-btn" class="px-5 sm:px-8 py-2 sm:py-3 rounded-full bg-white hover:bg-slate-200 text-[#060709] font-bold text-[11px] sm:text-xs tracking-widest uppercase transition transform active:scale-95 cursor-pointer shadow-lg shadow-white/10">
                  Enter the financial world →
                </button>
                <button id="aee-explore-btn" class="px-5 sm:px-8 py-2 sm:py-3 rounded-full border border-white/30 hover:border-white text-white font-semibold text-[11px] sm:text-xs tracking-widest uppercase transition cursor-pointer">
                  Explore the map
                </button>
              </div>
            </div>

          </div>
        </section>

        </div> <!-- End of #aee-camera-rig -->
      </div>
    </div>
  `;
}
