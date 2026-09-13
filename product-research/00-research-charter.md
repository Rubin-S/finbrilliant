# 00: Research Charter: Interactive Model of the Financial World

## Product Goal
The primary objective is to transform ALL ELSE EQUAL into a fully functioning, mathematically rigorous, and interactive model of the financial world. The platform enables students, investors, and educators to simulate macroeconomic policy decisions, credit cycles, institutional balance sheet mutations, corporate valuations, and market pricing in an interconnected, continuous simulation environment.

## Intended Outcomes
- Provide an integrated, stock-flow consistent (SFC) macroeconomic and financial simulator where every monetary flow and asset has an explicit counterpart liability across 6 core institutional sectors.
- Allow users to execute real-time policy shocks (e.g., policy rate adjustments, quantitative easing or tightening, tax changes, credit spread surges) and immediately observe first-order and second-order transmissions across the entire financial architecture.
- Bridge the educational gap between abstract macroeconomic equations and concrete financial market mechanics through interactive balance sheets, dynamic yield curves, discounted cash flow valuations, and order books.
- Maintain an ultra-fast, client-side, zero-install interactive experience adhering to the signature Swiss broadsheet monochrome aesthetic.

## Target Actors and Geographies
- Target Actors:
  - Undergraduate and graduate students studying economics, corporate finance, and investment banking.
  - Self-directed retail investors seeking deep institutional understanding of monetary policy and valuation.
  - Quantitative analysts and educators needing interactive visual tools to demonstrate economic principles.
- Target Geographies:
  - Global, with initial primary reference parameters calibrated to standard developed market institutions (Federal Reserve, commercial banking system, US Treasury, public equity and bond markets).

## Explicit User Requirements Table

| USR ID | Requirement | Exact Source Wording | Capability IDs | Status |
|---|---|---|---|---|
| USR-001 | Functioning interactive model of the financial world | "Turn ALL ELSE EQUAL into a functioning interactive model of the financial world." | CAP-SFC-ENGINE, CAP-CENTRAL-BANK, CAP-COMMERCIAL-BANKS, CAP-CORPORATE-FINANCE, CAP-HOUSEHOLDS, CAP-GOVERNMENT-FISCAL, CAP-FINANCIAL-MARKETS, CAP-INTERACTIVE-CONTROLS, CAP-TELEMETRY-VISUALIZATION | ACTIVE |
| USR-002 | Highly engaging, additive educational experience | "In terms of UI/UX our main motto is making the finance as additive as possible..." | CAP-INTERACTIVE-CONTROLS, CAP-TELEMETRY-VISUALIZATION | ACTIVE |
| USR-003 | Strict monochrome visual design | "Keep it mono chromatic all across." | CAP-TELEMETRY-VISUALIZATION, CAP-ACCESSIBILITY-COMPLIANCE | ACTIVE |
| USR-004 | Standardized global navigation | "Standardise the NAV bar every where first." | CAP-TELEMETRY-VISUALIZATION | ACTIVE |

## Constraints
- Architectural: Fully client-side execution in vanilla JavaScript (ES modules) within modern browsers, without mandatory server-side compute or third-party paid subscriptions.
- Mathematical: Absolute Stock-Flow Consistency (SFC) where the net financial assets across all sectors sum exactly to zero at every simulation step: Sum of Delta NW_j = 0.
- Visual: Strict Swiss monochrome broadsheet design language (#060709 deep ink in dark mode, #fafaf9 paper white in light mode, high-contrast typography, zero artificial neon slop).
- Performance: 60 frames per second smooth animation and sub-16ms recalculation latency during user slider interactions.
- Integrity: Exactly zero em-dashes and zero en-dashes across all code, comments, documentation, and user interfaces.

## Explicit Non-Goals
- Live broker execution or real-money trading functionality.
- High-frequency tick-by-tick market making engine or real-time live exchange market data streaming feeds.
- Personalized tax, investment, or legal financial advice.
- Black-box proprietary predictive forecasting claiming to predict actual future stock prices.

## Research Boundaries
- The research examines empirical monetary transmission models (Federal Reserve FRB/US, Bank of England, Bank for International Settlements), stock-flow consistent modeling (Godley and Lavoie), debt cycle dynamics (Ray Dalio / Economic Principles), and best-in-class educational simulation architectures (FRED, NetLogo, Brilliant.org).
- Research focuses on defining the complete final-state product capabilities and technical requirements rather than an MVP compromise.

## Assumptions
- ASM-001: Modern desktop and mobile browsers provide sufficient WebAssembly and JavaScript V8 performance to compute 6-sector differential or recurrence equations at 60Hz.
- ASM-002: Learners retain economic and financial principles significantly better when allowed to manipulate causal levers interactively rather than reading static formulas.
- ASM-003: Simplified yet mathematically disciplined SFC models provide higher pedagogical value than impenetrable 500-equation econometric forecast systems.

## Material Clarification Questions
- All core user requirements are sufficiently explicit; no blocking questions impede full research execution.

## Definition of Research Completion
Research is complete when all 13 required artifacts are produced, validated against the official schema script without errors, all active requirements are bidirectionally traced to empirical evidence, and clear technical specifications are documented.
