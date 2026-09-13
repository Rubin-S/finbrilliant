# 05: Product and Workflow Comparison

## Capability: CAP-SFC-ENGINE & CAP-SECTOR-SIM

### Product: Federal Reserve FRB/US Model
- **Product, Version/Tier, Geography, Observation Date**: Federal Reserve Board FRB/US Model (Python / EViews 2022 release), US, Observed 2026-09-13.
- **User Workflow and States**: Economist specifies exogenous policy paths -> sets expectation mode (VAR-based vs Model-Consistent) -> executes batch simulation -> exports tabular time-series forecasts.
- **Strong Patterns**: Unrivaled empirical rigor; incorporates full national product and income accounts; captures forward-looking asset pricing and optimal policy reaction functions.
- **Weak Patterns and Failures**: Monolithic, non-interactive batch environment; takes minutes to solve non-linear stochastic forward simulations; requires specialized econometric software (Python/EViews) with steep learning curves.
- **User-Reported Pain Points**: Inaccessible to students and non-specialists; zero visual exploration; impossible to see dynamic balance sheet flows in real time.
- **Technical/Operational Dependencies**: Python / EViews runtime, large matrix solver libraries, proprietary FEDS data feeds.
- **Evidence IDs**: EVD-CB-001, EVD-CB-002, EVD-SFC-003.
- **Adapt Conceptually**: Taylor rule specifications, policy rate corridors, and model-consistent vs adaptive expectation toggles.
- **Avoid**: Heavy batch scripts, terminal output walls, and static econometric tables.
- **Limitations**: Designed for policy forecasting by PhD economists, not real-time pedagogical exploration.

### Product: NetLogo Macroeconomic Systems
- **Product, Version/Tier, Geography, Observation Date**: NetLogo 6.3 / Center for Connected Learning, Global, Observed 2026-09-13.
- **User Workflow and States**: User loads agent-based macro model -> adjusts sliders for bank reserve ratio and tax rate -> clicks "setup" and "go" -> observes agent grid and time-series line charts.
- **Strong Patterns**: Direct manipulation of agent rules; emergence of macro phenomena from micro foundations; live slider adjustments.
- **Weak Patterns and Failures**: Antiquated Java/desktop UI; low visual fidelity; agent randomness often causes unstable chaos without structural balance sheet conservation.
- **User-Reported Pain Points**: Archaic visual design; lack of authentic institutional financial mechanics (no bond convexity, no DCF, no yield curves); difficult web embedding.
- **Technical/Operational Dependencies**: NetLogo desktop JVM or NetLogo Web transpiler.
- **Evidence IDs**: EVD-SFC-001, EVD-CTL-001.
- **Adapt Conceptually**: Continuous simulation loop, tick counter, and live parameter adjustment sliders.
- **Avoid**: Clunky 1990s desktop dialogs, pixelated 2D agent grids, and non-conserved ad-hoc monetary flows.
- **Limitations**: Educational toy models often violate macro accounting identities.

### Product: Ray Dalio's Economic Machine
- **Product, Version/Tier, Geography, Observation Date**: EconomicPrinciples.org Interactive Web Template, Global, Observed 2026-09-13.
- **User Workflow and States**: User watches 30-minute animated presentation -> steps through interactive chapters (Transactions, Credit, Short-Term Debt Cycle, Long-Term Debt Cycle, Beautiful Deleveraging).
- **Strong Patterns**: Exceptional clarity of core credit concepts; intuitive visualization of transactions between buyers and sellers; clear articulation of deleveraging trade-offs.
- **Weak Patterns and Failures**: Passive linear media format; limited user autonomy; user cannot stress-test custom counterfactual numbers or inspect balance sheet ledgers.
- **User-Reported Pain Points**: Learners want to experiment with custom policy rates and observe exact balance sheet impacts rather than watching pre-rendered video clips.
- **Technical/Operational Dependencies**: Web video player, pre-rendered vector animations.
- **Evidence IDs**: EVD-DALIO-01, EVD-HH-002, EVD-MKT-002, EVD-CTL-003.
- **Adapt Conceptually**: Three-force macroeconomic framework (Productivity growth, Short-term debt cycle, Long-term debt cycle) and transaction-based credit creation.
- **Avoid**: Purely passive video consumption; lack of quantitative math models.
- **Limitations**: Conceptual framework lacks explicit numerical balance sheet equations.

### Product: Brilliant.org Interactive Learning
- **Product, Version/Tier, Geography, Observation Date**: Brilliant.org Web & Mobile Platform, Global, Observed 2026-09-13.
- **User Workflow and States**: Learner progresses through bite-sized interactive cards -> manipulates sliders/switches -> visual widget updates instantly (<16ms) -> answers interactive challenge -> receives immediate diagnostic feedback.
- **Strong Patterns**: World-class interactive engagement; addictive hands-on manipulation; pristine visual typography; cognitive chunking.
- **Weak Patterns and Failures**: Almost no macro finance or institutional monetary curriculum; existing models are isolated single-variable puzzles rather than an interconnected living economy.
- **User-Reported Pain Points**: Financial content is limited to personal finance basics; lack of holistic systems-level macroeconomic simulators.
- **Technical/Operational Dependencies**: Custom React/SVG interactive widget engine, cloud progress persistence.
- **Evidence IDs**: EVD-CTL-001, EVD-VIS-002.
- **Adapt Conceptually**: Immediate reactive slider feedback, bite-sized interactive challenges, diagnostic explanations, and clean typography.
- **Avoid**: Fragmenting the simulation into isolated micro-puzzles that fail to show the whole macro economy.
- **Limitations**: Does not offer multi-sector macroeconomic simulation engines.

---

## Opportunity Synthesis
Existing products present a clear structural divide:
1. Academic econometric engines (FRB/US) are mathematically rigorous but impenetrable, non-interactive, and visually inaccessible to learners.
2. Conceptual explainers (Ray Dalio's Economic Machine) provide intuitive clarity but remain passive video narratives without hands-on simulation autonomy.
3. STEM learning platforms (Brilliant.org) provide exceptional interactive mechanics but lack systemic macroeconomic and monetary models.

ALL ELSE EQUAL has the unprecedented opportunity to synthesize all three: combining the mathematical rigor of Stock-Flow Consistent balance sheet conservation, the intuitive narrative power of credit cycle transactions, and the addictive instant-feedback UX of Brilliant into an unbroken Swiss broadsheet simulator.
