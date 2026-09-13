# 01: Complete Final-Product Capability Map

## Overview
This capability map outlines the complete functional, technical, and operational architecture required to build a functioning interactive model of the financial world in ALL ELSE EQUAL.

## Capability Directory

### CAP-SFC-ENGINE: Stock-Flow Consistent Macroeconomic Simulation Engine
- **Purpose**: Computes multi-sector balance sheet transitions and monetary flows under strict accounting conservation laws where every asset is another sector's liability.
- **Actors**: Quantitative learners, simulation engine, scenario orchestrator.
- **Sub-capabilities**:
  - `CAP-SFC-01`: Multi-sector balance sheet matrix computation (Central Bank, Commercial Banks, Corporations, Households, Government, Financial Markets).
  - `CAP-SFC-02`: Transaction-flow matrix solver ensuring zero net leakage (Sum of Delta NW_j = 0).
  - `CAP-SFC-03`: Continuous tick/step simulation loop with adjustable time step (dt) and frequency.
  - `CAP-SFC-04`: Numerical stability guardrails preventing non-physical divergence or negative stock quantities.
- **Critical Workflows**:
  - Step initialization -> exogenous shock injection -> recursive sectoral updates -> conservation verification -> telemetry publication.
- **Data Touched**: Sectoral assets, liabilities, equities, transaction flows, interest cash flows, capital stocks.
- **External Dependencies**: None (fully local client-side execution).
- **Operational Dependencies**: High-performance JavaScript execution loop.
- **Related Explicit Requirements**: USR-001.
- **Risk Classification**: HIGH (core mathematical engine).

### CAP-CENTRAL-BANK: Central Bank & Monetary Transmission
- **Purpose**: Simulates central bank policy rate targeting, reserve operations, asset purchases (QE/QT), and Taylor rule monetary reaction functions.
- **Actors**: Central bank controller, macro student, policy analyst.
- **Sub-capabilities**:
  - `CAP-CB-01`: Policy rate corridor management (interest on reserves, discount window rate).
  - `CAP-CB-02`: Open market operations and central bank balance sheet expansion/contraction (QE and QT).
  - `CAP-CB-03`: Taylor Rule reaction function: r_t = r_neutral + pi_t + 0.5*(pi_t - pi_target) + 0.5*(y_t - y_potential).
  - `CAP-CB-04`: Reserve requirement and liquidity facility modeling.
- **Critical Workflows**:
  - User adjusts policy rate -> interbank liquidity shifts -> commercial bank reserve yields adjust -> policy rate transmission begins.
- **Data Touched**: Central bank assets (Treasuries, MBS, repo claims), central bank liabilities (currency in circulation, bank reserves).
- **External Dependencies**: None.
- **Operational Dependencies**: Synchronized tick with CAP-SFC-ENGINE.
- **Related Explicit Requirements**: USR-001.
- **Risk Classification**: HIGH (foundational monetary catalyst).

### CAP-COMMERCIAL-BANKS: Commercial Banking & Endogenous Credit Creation
- **Purpose**: Models fractional reserve banking, loan origination (endogenous money creation), deposit liabilities, capital adequacy ratios (Basel III), and net interest margin (NIM).
- **Actors**: Commercial banks, corporate borrowers, retail depositors.
- **Sub-capabilities**:
  - `CAP-BNK-01`: Endogenous deposit and loan creation (loans create deposits).
  - `CAP-BNK-02`: Interbank lending and reserve settlement.
  - `CAP-BNK-03`: Bank capital adequacy and leverage ratio monitoring (Equity / Risk-Weighted Assets).
  - `CAP-BNK-04`: Loan default, credit loss provisioning, and write-down mechanics.
- **Critical Workflows**:
  - Corporate/household loan demand -> bank risk appraisal -> loan asset and deposit liability creation -> interest margin compounding.
- **Data Touched**: Bank reserves, commercial loans, corporate bonds held, customer deposits, bank equity capital, net interest income.
- **External Dependencies**: None.
- **Operational Dependencies**: Connected to CAP-CENTRAL-BANK and CAP-CORPORATE-FINANCE.
- **Related Explicit Requirements**: USR-001.
- **Risk Classification**: HIGH (endogenous credit engine).

### CAP-CORPORATE-FINANCE: Non-Financial Corporations & DCF Valuation
- **Purpose**: Simulates corporate operations, capital expenditure (CapEx), debt/equity financing, revenue generation, payroll, and discounted cash flow (DCF) enterprise valuation.
- **Actors**: Corporate finance analyst, equity investor, CFO simulator.
- **Sub-capabilities**:
  - `CAP-CORP-01`: Operating income statement generation (Revenue - Operating Costs - Wages = EBITDA).
  - `CAP-CORP-02`: Free cash flow to firm (FCFF) calculation and capital budgeting.
  - `CAP-CORP-03`: Weighted Average Cost of Capital (WACC) and DCF enterprise valuation under dynamic discount rates.
  - `CAP-CORP-04`: Corporate bond issuance, leverage metrics, and debt servicing coverage ratio (DSCR).
- **Critical Workflows**:
  - Interest rate shift -> WACC recalculation -> present value discounting -> equity valuation adjustment -> CapEx revision.
- **Data Touched**: Corporate revenues, wage expenses, operating profits, debt obligations, CapEx, FCFF, enterprise value, equity value.
- **External Dependencies**: None.
- **Operational Dependencies**: Connected to CAP-COMMERCIAL-BANKS, CAP-HOUSEHOLDS, and CAP-FINANCIAL-MARKETS.
- **Related Explicit Requirements**: USR-001.
- **Risk Classification**: HIGH (valuation and production core).

### CAP-HOUSEHOLDS: Household Sector & Consumer Economics
- **Purpose**: Models household labor income, consumption demand, savings allocation between deposits and securities, and mortgage debt servicing.
- **Actors**: Consumer, worker, household investor.
- **Sub-capabilities**:
  - `CAP-HH-01`: Consumption function based on disposable income and marginal propensity to consume (MPC).
  - `CAP-HH-02`: Labor supply and wage income dynamics.
  - `CAP-HH-03`: Portfolio allocation across bank deposits, Treasury bonds, and corporate equities.
  - `CAP-HH-04`: Wealth effect transmission (changes in asset prices influencing consumer spending).
- **Critical Workflows**:
  - Wages received -> tax deducted -> consumption expenditures to corporations -> remaining surplus saved into deposits/assets.
- **Data Touched**: Disposable income, consumption spending, savings, deposits held, equities held, mortgage liabilities.
- **External Dependencies**: None.
- **Operational Dependencies**: Connected to CAP-CORPORATE-FINANCE and CAP-GOVERNMENT-FISCAL.
- **Related Explicit Requirements**: USR-001.
- **Risk Classification**: MEDIUM (macro demand aggregator).

### CAP-GOVERNMENT-FISCAL: Fiscal Policy & Sovereign Debt
- **Purpose**: Models government fiscal budgets, progressive/flat taxation, public expenditures, deficit funding, and sovereign debt (Treasury) issuance.
- **Actors**: Treasury official, fiscal policymaker, citizen taxpayer.
- **Sub-capabilities**:
  - `CAP-GOV-01`: Tax revenue collection from households and corporate profits.
  - `CAP-GOV-02`: Public expenditure disbursement (infrastructure, public sector payroll, transfers).
  - `CAP-GOV-03`: Fiscal balance computation (Deficit = Expenditures + Interest - Tax Receipts).
  - `CAP-GOV-04`: Treasury debt auction and issuance across maturity buckets.
- **Critical Workflows**:
  - Fiscal deficit incurred -> Treasury issues new sovereign bonds -> primary dealers/banks absorb bonds -> debt stock increases.
- **Data Touched**: Tax revenues, government spending, sovereign debt stock, interest paid on national debt.
- **External Dependencies**: None.
- **Operational Dependencies**: Connected to CAP-HOUSEHOLDS, CAP-CORPORATE-FINANCE, and CAP-CENTRAL-BANK.
- **Related Explicit Requirements**: USR-001.
- **Risk Classification**: MEDIUM (macro policy lever).

### CAP-FINANCIAL-MARKETS: Financial Markets, Yield Curves & Order Book
- **Purpose**: Models the term structure of interest rates (yield curve), credit risk spreads, continuous double auction order books, and asset repricing.
- **Actors**: Market maker, trader, asset manager.
- **Sub-capabilities**:
  - `CAP-MKT-01`: Nelson-Siegel or Svensson term structure yield curve modeling across maturities (3M to 30Y).
  - `CAP-MKT-02`: Credit spread widening/tightening based on corporate default probability and liquidity.
  - `CAP-MKT-03`: Continuous double auction order book matching (bids, asks, market depth, clearing price).
  - `CAP-MKT-04`: Bond convexity and duration repricing under interest rate shocks.
- **Critical Workflows**:
  - Policy rate change -> short yield shifts -> term premium recalculation -> yield curve steepens/inverts -> bond and equity repricing.
- **Data Touched**: Yield curve points, credit spreads, bid/ask queues, clearing prices, market liquidity depth.
- **External Dependencies**: None.
- **Operational Dependencies**: Connected to all institutional sectors.
- **Related Explicit Requirements**: USR-001.
- **Risk Classification**: HIGH (market pricing hub).

### CAP-INTERACTIVE-CONTROLS: Interactive Sliders, Scenarios & Simulation Controls
- **Purpose**: Provides real-time user manipulation of macroeconomic parameters, historical crisis scenarios, playback speed, and step-by-step debugging.
- **Actors**: Student, instructor, researcher.
- **Sub-capabilities**:
  - `CAP-CTL-01`: Live interactive sliders for Policy Rate, Tax Rates, Reserve Ratios, and Credit Spreads with immediate reactive updates.
  - `CAP-CTL-02`: Preset historical shock scenarios (e.g. 2008 Global Financial Crisis, 2020 Liquidity Injection, 1970s Volcker Rate Shock, Modern Soft Landing).
  - `CAP-CTL-03`: Simulation run controls (Play, Pause, Step 1-Tick, Reset to Baseline, Playback Speed 0.5x to 5x).
  - `CAP-CTL-04`: Parameter inspection and custom initial state configuration.
- **Critical Workflows**:
  - User drags slider -> engine receives input event -> simulation recalculates next state within 16ms -> UI reflects new state without reload.
- **Data Touched**: User input events, simulation control flags, scenario preset configs.
- **External Dependencies**: None.
- **Operational Dependencies**: DOM event listeners and requestAnimationFrame scheduler.
- **Related Explicit Requirements**: USR-001, USR-002.
- **Risk Classification**: MEDIUM (interactive usability).

### CAP-TELEMETRY-VISUALIZATION: Broadsheet Visual Architecture & Telemetry
- **Purpose**: Renders flowing multi-sector conduits, real-time balance sheet T-accounts, dynamic metric inspector graphs, and unified Swiss broadsheet layouts.
- **Actors**: User observer, visual learner.
- **Sub-capabilities**:
  - `CAP-VIS-01`: Animated SVG vector conduits representing directional monetary flows between sectors.
  - `CAP-VIS-02`: Dynamic T-account balance sheet inspectors showing Assets and Liabilities for any selected sector.
  - `CAP-VIS-03`: Real-time mini-charts for GDP, Inflation, Unemployment, Debt-to-GDP, and Bond Yields.
  - `CAP-VIS-04`: Strict Swiss monochrome broadsheet design system implementation across dark and light modes.
- **Critical Workflows**:
  - Simulation tick -> state published -> SVG flow velocity and stroke opacity update -> T-account figures animate -> telemetry charts append points.
- **Data Touched**: UI render state, SVG path definitions, DOM elements, theme tokens.
- **External Dependencies**: None.
- **Operational Dependencies**: GPU-accelerated SVG and CSS styling.
- **Related Explicit Requirements**: USR-001, USR-002, USR-003, USR-004.
- **Risk Classification**: MEDIUM (visual engagement and brand aesthetic).

### CAP-ACCESSIBILITY-COMPLIANCE: Web Accessibility & Motion Preferences
- **Purpose**: Ensures the interactive model satisfies WCAG 2.2 AA standards, keyboard navigability, screen reader semantics, and reduced-motion user preferences.
- **Actors**: Assistive technology users, keyboard-only navigators, photosensitive users.
- **Sub-capabilities**:
  - `CAP-A11Y-01`: Full keyboard navigability (Tab, Arrow keys, Enter, Escape) for all sliders, switches, and inspectors.
  - `CAP-A11Y-02`: Accessible ARIA labels and live regions (aria-live="polite") announcing financial parameter updates.
  - `CAP-A11Y-03`: Strict compliance with prefers-reduced-motion media query (disabling high-speed particle flows while preserving mathematical updates).
  - `CAP-A11Y-04`: High contrast ratio adherence (minimum 4.5:1 for normal text, 3:1 for graphical UI components).
- **Critical Workflows**:
  - User tabs to slider -> adjusts with Arrow keys -> aria-valuenow updates -> screen reader announces new value -> visuals update.
- **Data Touched**: ARIA attributes, keyboard event handlers, media query listeners.
- **External Dependencies**: Standard browser accessibility APIs.
- **Operational Dependencies**: None.
- **Related Explicit Requirements**: USR-003.
- **Risk Classification**: LOW (standard compliance).

## Requirement-Preservation Check

| User Requirement ID | Description | Mapped Capability IDs | Status |
|---|---|---|---|
| USR-001 | Turn ALL ELSE EQUAL into a functioning interactive model of the financial world | CAP-SFC-ENGINE, CAP-CENTRAL-BANK, CAP-COMMERCIAL-BANKS, CAP-CORPORATE-FINANCE, CAP-HOUSEHOLDS, CAP-GOVERNMENT-FISCAL, CAP-FINANCIAL-MARKETS, CAP-INTERACTIVE-CONTROLS, CAP-TELEMETRY-VISUALIZATION | PRESERVED (100% covered across all 6 sectors, engine, and controls) |
| USR-002 | Highly engaging, additive educational experience | CAP-INTERACTIVE-CONTROLS, CAP-TELEMETRY-VISUALIZATION | PRESERVED (Covered in interactive sliders, instant feedback, live conduits) |
| USR-003 | Strict monochrome visual design | CAP-TELEMETRY-VISUALIZATION, CAP-ACCESSIBILITY-COMPLIANCE | PRESERVED (Enforced in broadsheet UI tokens and high-contrast styling) |
| USR-004 | Standardized global navigation | CAP-TELEMETRY-VISUALIZATION | PRESERVED (Enforced in unified navbar and routing parity) |

Zero explicit requirements have been dropped or compromised.
