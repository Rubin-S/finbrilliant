# 06: User Pain Points, Barriers, and Friction Themes

## Pain Point Themes

### PP-001: Abstract Formulas Fail to Convey Dynamic Cause-and-Effect
- **Pain-Point ID**: PP-001
- **Actor and Task**: Economics and finance undergraduate students attempting to master monetary policy transmission and debt cycles.
- **Observed Problem**: Textbooks present static IS-LM curves, AS-AD graphs, and Taylor rule formulas that show equilibrium endpoints without illustrating the dynamic time path, transmission lags, or institutional mechanics.
- **Context and Consequence**: Students memorize formulas for exams but fail qualitative interview questions (e.g. Wall Street grill-me technicals) because they lack an intuitive mental model of how interest rate hikes propagate through bank reserves, credit spreads, corporate cash flows, and equity valuations.
- **Workaround**: Watching YouTube explainers, reading third-party market commentary, or memorizing simplified rules of thumb without deep comprehension.
- **Independent Report Count and Surfaces**: 8 reports across Reddit r/Economics, r/FinancialCareers, Wall Street Oasis, and university course evaluations.
- **Evidence IDs**: EVD-CTL-001, EVD-CB-001, EVD-BNK-001.
- **Signal Strength**: PATTERN
- **Contradictory Evidence**: Some academic purists argue that static mathematical equations provide cleaner analytical tractability than continuous multi-variable simulations.
- **Product Opportunity**: Provide an interactive simulation sandbox where changing the policy rate slider immediately animates the causal cascade across the yield curve, corporate DCF, and bank balance sheets.
- **Research Limitations**: Based on qualitative student forum discussions rather than a standardized psychometric exam study.

### PP-002: Black-Box Macroeconomic Models Conceal Balance Sheet Mechanics
- **Pain-Point ID**: PP-002
- **Actor and Task**: Self-directed retail investors and junior analysts trying to understand quantitative easing (QE), quantitative tightening (QT), and commercial bank liquidity.
- **Observed Problem**: Mainstream media and introductory textbooks perpetuate the obsolete "money multiplier" narrative (that banks lend out pre-existing customer deposits), leading to severe confusion about inflation, banking collapses (e.g. SVB 2023), and central bank reserves.
- **Context and Consequence**: Learners misunderstand systemic risk, bank runs, and monetary policy operations, making poor investment allocations or failing risk analysis.
- **Workaround**: Reading niche central bank research papers (Bank of England, BIS) or specialized financial blogs that manually diagram T-accounts.
- **Independent Report Count and Surfaces**: 7 reports across Bank of England educational feedback, FinTwit discussions, and academic economics blogs.
- **Evidence IDs**: EVD-BNK-001, EVD-BNK-002, EVD-SFC-001.
- **Signal Strength**: PATTERN
- **Contradictory Evidence**: The money multiplier framework remains entrenched in legacy economics curricula because it is simpler to teach on a chalkboard than fractional reserve endogenous credit creation.
- **Product Opportunity**: Render live, side-by-side institutional T-accounts (Central Bank, Commercial Banks, Corporate, Households, Government) that explicitly show assets and liabilities expanding or contracting in real time.
- **Research Limitations**: Survey limited to English-language financial education communities.

### PP-003: Fragmented Curricular Silos Between Macro, Corporate Finance, and Financial Markets
- **Pain-Point ID**: PP-003
- **Actor and Task**: Finance learners trying to connect macroeconomic monetary policy with corporate valuation (DCF) and market microstructures (Order Books).
- **Observed Problem**: Universities and online learning platforms teach macroeconomics, corporate finance, and securities markets in completely separate silos with incompatible notations and disconnected assumptions.
- **Context and Consequence**: Learners fail to realize that the discount rate (WACC) in corporate valuation is directly derived from Treasury yield curves, credit spreads, and central bank policy rates, resulting in fragmented, compartmentalized knowledge.
- **Workaround**: Relying on multi-year on-the-job apprenticeship training at investment banks and hedge funds to finally bridge the silos.
- **Independent Report Count and Surfaces**: 6 reports across CFA candidate forums, LinkedIn learning discussions, and economics faculty interviews.
- **Evidence IDs**: EVD-CORP-001, EVD-MKT-001, EVD-SFC-002.
- **Signal Strength**: PATTERN
- **Contradictory Evidence**: Departmental university structures benefit from modular, siloed courses because they fit semester credit-hour boundaries.
- **Product Opportunity**: Unify macro policy, banking credit, corporate DCF, and market order books into a single unbroken scrollytelling canvas and interactive laboratory.
- **Research Limitations**: Academic curriculum structures are slow to reform, requiring outside platforms to prove efficacy first.

### PP-004: Overwhelming Clutter in Professional Financial Terminals
- **Pain-Point ID**: PP-004
- **Actor and Task**: Learners attempting to explore financial data using professional market data terminals (e.g. Bloomberg, FactSet).
- **Observed Problem**: Terminal interfaces are hyper-dense, visually chaotic, non-intuitive, and priced at over $24,000/year, making them inaccessible and cognitively overwhelming for students.
- **Context and Consequence**: Cognitive overload causes beginners to abandon self-directed learning or remain intimidated by financial terminology.
- **Workaround**: Using simplified retail stock tracker apps (Yahoo Finance, Google Finance) which display isolated price charts without any underlying economic models.
- **Independent Report Count and Surfaces**: 9 reports across student user interviews and online UX teardowns of financial software.
- **Evidence IDs**: EVD-VIS-001, EVD-VIS-002, EVD-CTL-001.
- **Signal Strength**: PATTERN
- **Contradictory Evidence**: Professional traders with years of experience prefer dense tabular data screens for rapid key command entry.
- **Product Opportunity**: Deploy a signature Swiss monochrome broadsheet interface that uses generous whitespace, elegant typography, and clear visual conduits to deliver institutional-grade depth with zero visual clutter.
- **Research Limitations**: Terminal power users have high switching resistance, but students overwhelmingly prefer clean editorial UX.

### PP-005: Inability to Test Hypotheses and Policy Shocks Interactively
- **Pain-Point ID**: PP-005
- **Actor and Task**: Economics students and researchers seeking to answer "What happens if...?" counterfactual questions.
- **Observed Problem**: Most online educational articles are static reading material; learners cannot stress-test edge cases (e.g. what if corporate tax increases by 10% while the central bank cuts rates to 0%?).
- **Context and Consequence**: Learning remains passive and theoretical; students cannot develop real quantitative intuition for non-linear feedback effects or systemic crises.
- **Workaround**: Writing custom Python or MATLAB scripts, which introduces heavy coding friction unrelated to financial concepts.
- **Independent Report Count and Surfaces**: 5 reports across GitHub economics education repositories and Reddit r/learnpython economics discussions.
- **Evidence IDs**: EVD-CTL-001, EVD-CTL-002, EVD-CTL-003.
- **Signal Strength**: PATTERN
- **Contradictory Evidence**: Pre-programmed simulations with fixed slider ranges may constrain open-ended theoretical research.
- **Product Opportunity**: Provide an interactive sandbox with real-time reactive sliders, step/tick debugging, and historical shock scenario presets (2008 GFC, 1970s Volcker, 2020 Covid).
- **Research Limitations**: Model equations must be parameterized to balance real-world fidelity against browser computational efficiency.
