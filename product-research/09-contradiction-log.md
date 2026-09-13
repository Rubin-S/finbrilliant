# 09: Contradiction Log and Resolution Analysis

## Contradictions

### CNTR-001: Fractional Reserve Money Multiplier vs Endogenous Money Creation
- **Conflict ID**: CNTR-001
- **Competing Claims and Evidence IDs**:
  - Claim A: Commercial banks lend out pre-existing customer deposits; the central bank controls total broad money supply by changing reserve requirements via the textbook "money multiplier" (Traditional introductory economics textbooks).
  - Claim B: Commercial banks create new deposits endogenously whenever they originate loans; reserve levels do not physically constrain lending, but rather capital ratios and expected credit profitability do (EVD-BNK-001: Bank of England; EVD-BNK-002: BIS).
- **Context Differences**: Claim A is a pedagogical simplification originating from 1950s fractional reserve models; Claim B represents the modern empirical reality of central banking and electronic settlement systems.
- **Evaluation**: The Bank of England, Federal Reserve, and Bank for International Settlements explicitly state that the money multiplier is incorrect in modern economies. In reality, banks create loans first, which creates deposits, and banks subsequently seek reserves in the interbank market to meet liquidity settlement needs.
- **Working Conclusion**: ALL ELSE EQUAL will implement endogenous credit creation (loans create deposits) bounded by capital adequacy and risk margins. The textbook money multiplier will be explicitly demonstrated as an obsolete model with a toggleable side-by-side comparison.
- **Confidence**: HIGH
- **Unresolved Question**: How to teach this without confusing students whose university professors still test on the multiplier?
- **Resolution Research**: Provide interactive tooltips that explain how modern central banking actually works while acknowledging historical textbook terminology.

### CNTR-002: Dynamic Stochastic General Equilibrium (DSGE) vs Stock-Flow Consistent (SFC) Modeling
- **Conflict ID**: CNTR-002
- **Competing Claims and Evidence IDs**:
  - Claim A: Macroeconomics must be built on micro-foundations of hyper-rational, forward-looking optimizing agents with model-consistent rational expectations (EVD-CB-001, EVD-CB-002: DSGE / FRB/US).
  - Claim B: Rational expectations models fail to anticipate systemic debt crises; models must be built on rigorous accounting identities (SFC) and realistic behavioral heuristics where every financial flow has a balance sheet counterpart (EVD-SFC-001, EVD-SFC-002: Godley and Lavoie).
- **Context Differences**: DSGE models prioritize theoretical equilibrium mathematical elegance; SFC models prioritize empirical balance sheet conservation and financial sector realism.
- **Evaluation**: Following the 2008 financial crisis, central banks acknowledged that standard DSGE models failed because they omitted commercial bank balance sheets and default risks. SFC modeling successfully anticipated the crisis by tracking household debt-to-income accumulation.
- **Working Conclusion**: The simulation engine will use an SFC accounting foundation (Sum Delta NW_j = 0) combined with empirical policy reaction rules (Taylor rule) and forward-looking valuation discounting (DCF). This marries accounting integrity with intuitive policy dynamics.
- **Confidence**: HIGH
- **Unresolved Question**: Should expectations be strictly adaptive or allow user-selectable forward-looking modes?
- **Resolution Research**: Provide an expectation toggle (Adaptive vs Forward-Looking) in the simulation lab.

### CNTR-003: Continuous Continuous-Time Differential Equations vs Discrete Tick-Based Solvers
- **Conflict ID**: CNTR-003
- **Competing Claims and Evidence IDs**:
  - Claim A: Physical and economic time is continuous; simulation should be modeled as a system of stiff differential equations solved via continuous Runge-Kutta numerical integration (Academic economic modeling).
  - Claim B: Browser JavaScript runtimes execute on 60Hz/120Hz display refresh intervals (requestAnimationFrame); discrete time-step recurrence equations with finite clamping offer superior predictability, zero floating-point drift, and instant slider reactivity (EVD-SFC-003: LINVER / Browser benchmarks).
- **Context Differences**: Continuous differential equations are ideal for offline batch academic compute; discrete recurrence relations are optimal for client-side interactive visual manipulation.
- **Evaluation**: High-order continuous solvers can experience stiffness and numerical divergence when learners rapidly drag sliders to extreme values (e.g. 20% interest rate shock). Discrete time-step recurrence with numerical clamping maintains unconditional stability and sub-16ms latency.
- **Working Conclusion**: Implement discrete-time recurrence relations with explicit time delta (dt) and numerical bounds checking to guarantee 60fps responsiveness and rock-solid stability.
- **Confidence**: HIGH
- **Unresolved Question**: What time-scale mapping provides the most intuitive feel (1 tick = 1 month vs 1 quarter)?
- **Resolution Research**: Calibrate default simulation tick to 1 quarter (3 months) with adjustable playback speed.
