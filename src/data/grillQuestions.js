/**
 * Wall Street / Quant Technical Interview Question Bank
 * Rapid-fire questions for the /grill-me arena.
 */

export const GRILL_QUESTIONS = [
  {
    id: 'g-math-1',
    category: 'Mental Math',
    tier: 'Analyst',
    question: 'Mental Math: What is 16 × 25?',
    timeLimitSeconds: 20,
    options: [
      { id: 'a', text: '350', isCorrect: false, explanation: 'Incorrect: 16 × 25 = 4 × (4 × 25) = 4 × 100 = 400.' },
      { id: 'b', text: '400', isCorrect: true, explanation: 'Trick: 16 × 25 = (16 / 4) × 100 = 4 × 100 = 400.' },
      { id: 'c', text: '420', isCorrect: false, explanation: 'Incorrect: 16 × 25 ends in 00 because 4 × 25 = 100.' },
      { id: 'd', text: '450', isCorrect: false, explanation: 'Incorrect: 18 × 25 would be 450; 16 × 25 is 400.' }
    ],
    points: 100
  },
  {
    id: 'g-math-2',
    category: 'Mental Math',
    tier: 'Analyst',
    question: 'What is 1 / 16 expressed as a percentage?',
    timeLimitSeconds: 20,
    options: [
      { id: 'a', text: '5.25%', isCorrect: false, explanation: 'Incorrect: 1/16 is half of 1/8 (12.5%), which is 6.25%.' },
      { id: 'b', text: '6.25%', isCorrect: true, explanation: '1/2 = 50%, 1/4 = 25%, 1/8 = 12.5%, 1/16 = 6.25%.' },
      { id: 'c', text: '6.75%', isCorrect: false, explanation: 'Incorrect: 1/16 = 0.0625 = 6.25%.' },
      { id: 'd', text: '7.15%', isCorrect: false, explanation: 'Incorrect: 1/14 is ~7.14%, but 1/16 is 6.25%.' }
    ],
    points: 100
  },
  {
    id: 'g-mm-1',
    category: 'Market Making',
    tier: 'Associate',
    question: 'You flip a fair coin: Heads pays $100, Tails pays $0. What is the fair value, and what is a two-sided market with a $2 spread centered on fair value?',
    timeLimitSeconds: 25,
    options: [
      { id: 'a', text: 'Fair $50; Quote: 49 @ 51', isCorrect: true, explanation: 'EV = 0.5($100) + 0.5($0) = $50. A $2 spread centered at 50 is Bid $49, Ask $51.' },
      { id: 'b', text: 'Fair $50; Quote: 48 @ 52', isCorrect: false, explanation: 'That would be a $4 spread (52 - 48 = 4).' },
      { id: 'c', text: 'Fair $100; Quote: 99 @ 101', isCorrect: false, explanation: 'Fair value is 50%, not 100% of maximum payout.' },
      { id: 'd', text: 'Fair $25; Quote: 24 @ 26', isCorrect: false, explanation: 'Fair value is 0.5 × 100 = $50, not $25.' }
    ],
    points: 150
  },
  {
    id: 'g-acc-1',
    category: 'Accounting & DCF',
    tier: 'Associate',
    question: 'Depreciation increases by $10. Tax rate is 20%. What happens to Net Income and Cash from Operations?',
    timeLimitSeconds: 30,
    options: [
      { id: 'a', text: 'Net Income drops by $8; Cash increases by $2', isCorrect: true, explanation: 'Pre-tax income drops by $10. Taxes drop by $2 (tax shield). Net Income drops by $8. In the Cash Flow statement, non-cash depreciation is added back: -8 + 10 = +$2 cash.' },
      { id: 'b', text: 'Net Income drops by $10; Cash drops by $10', isCorrect: false, explanation: 'Depreciation is a non-cash expense and creates a tax shield saving real cash.' },
      { id: 'c', text: 'Net Income drops by $8; Cash stays flat', isCorrect: false, explanation: 'The tax shield saves $2 in actual cash income taxes.' },
      { id: 'd', text: 'Net Income drops by $10; Cash increases by $10', isCorrect: false, explanation: 'Taxes must be deducted from pre-tax depreciation.' }
    ],
    points: 150
  },
  {
    id: 'g-val-1',
    category: 'Valuation',
    tier: 'Analyst',
    question: 'A company has Enterprise Value of $100M, Debt of $30M, and Cash of $10M. What is its Equity Value?',
    timeLimitSeconds: 25,
    options: [
      { id: 'a', text: '$120M', isCorrect: false, explanation: 'Debt is owed to lenders, so it decreases equity value; cash increases it.' },
      { id: 'b', text: '$80M', isCorrect: true, explanation: 'Enterprise Value = Equity Value + Debt - Cash. Rearranging: Equity Value = EV - Debt + Cash = 100 - 30 + 10 = $80M.' },
      { id: 'c', text: '$60M', isCorrect: false, explanation: 'You forgot to add back the $10M in cash reserves.' },
      { id: 'd', text: '$70M', isCorrect: false, explanation: 'Arithmetic: 100 - 30 + 10 = 80.' }
    ],
    points: 120
  },
  {
    id: 'g-val-2',
    category: 'Valuation & Multiples',
    tier: 'Associate',
    question: 'A firm generates $25M in EBITDA and trades at an 8.0x EV/EBITDA multiple. It carries $40M in debt and $10M in cash. What is its Equity Value?',
    timeLimitSeconds: 25,
    options: [
      { id: 'a', text: '$170M', isCorrect: true, explanation: 'EV = 25M × 8.0x = $200M. Equity Value = EV - Net Debt = 200 - (40 - 10) = 200 - 30 = $170M.' },
      { id: 'b', text: '$200M', isCorrect: false, explanation: '$200M is the Enterprise Value before net debt deduction.' },
      { id: 'c', text: '$150M', isCorrect: false, explanation: 'You deducted gross debt without crediting cash.' },
      { id: 'd', text: '$230M', isCorrect: false, explanation: 'Debt must be subtracted, not added to Equity Value.' }
    ],
    points: 160
  },
  {
    id: 'g-opt-1',
    category: 'Options & Greeks',
    tier: 'VP',
    question: 'Stock is at $100. A $100-strike call has Delta = 0.50. If the stock immediately jumps to $103, by approximately how much does the call price increase (first-order approximation)?',
    timeLimitSeconds: 25,
    options: [
      { id: 'a', text: '$3.00', isCorrect: false, explanation: 'Delta is 0.50, meaning the option moves ~50% of the underlying stock move.' },
      { id: 'b', text: '$1.50', isCorrect: true, explanation: 'ΔP_option ≈ Delta × ΔS = 0.50 × $3.00 = $1.50 (plus higher-order Gamma contribution).' },
      { id: 'c', text: '$0.50', isCorrect: false, explanation: 'Delta is 0.50 per $1 move; a $3 move yields $1.50.' },
      { id: 'd', text: '$6.00', isCorrect: false, explanation: 'Options do not produce 2x linear gains without leverage calculation.' }
    ],
    points: 200
  },
  {
    id: 'g-opt-2',
    category: 'Options & Greeks',
    tier: 'VP',
    question: 'Implied Volatility surges across the market from 14% to 38%. All else equal, what happens to the prices of Long Calls and Long Puts?',
    timeLimitSeconds: 25,
    options: [
      { id: 'a', text: 'Calls go up, Puts go down', isCorrect: false, explanation: 'Directional stock price moves do that, but volatility affects both calls and puts identically.' },
      { id: 'b', text: 'Both Calls and Puts increase in price', isCorrect: true, explanation: 'Both calls and puts have positive Vega (∂V/∂σ > 0). Higher volatility expands the probability of extreme favorable payoffs while downside is capped at premium paid!' },
      { id: 'c', text: 'Both Calls and Puts drop in price', isCorrect: false, explanation: 'Volatility creates option value; it never destroys it for long holders.' },
      { id: 'd', text: 'Puts go up, Calls stay flat', isCorrect: false, explanation: 'Both calls and puts gain from higher Vega.' }
    ],
    points: 200
  },
  {
    id: 'g-opt-3',
    category: 'Derivatives & Arbitrage',
    tier: 'Quant Partner',
    question: 'According to Put-Call Parity (C - P = S - K·e^(-rT)), how do you synthetically recreate a Long Stock (S) position using options and cash?',
    timeLimitSeconds: 30,
    options: [
      { id: 'a', text: 'Long Call + Short Put + PV(Strike Cash)', isCorrect: true, explanation: 'Rearranging Put-Call Parity: S = Call - Put + PV(Strike). Buying a call and selling a put at the same strike and expiration replicates the 100% linear payoff of holding stock!' },
      { id: 'b', text: 'Long Call + Long Put', isCorrect: false, explanation: 'That is a Straddle, which is non-linear volatility, not directional stock.' },
      { id: 'c', text: 'Short Call + Long Put', isCorrect: false, explanation: 'That creates a synthetic Short Stock position.' },
      { id: 'd', text: 'Short Put + Cash only', isCorrect: false, explanation: 'A short put alone has capped upside and does not replicate stock upside.' }
    ],
    points: 220
  },
  {
    id: 'g-macro-1',
    category: 'Fixed Income & Macro',
    tier: 'Quant Partner',
    question: 'A 10-year Treasury bond has a Modified Duration of 8.0. If market yields rise by 50 basis points (0.50%), what is the approximate percentage change in the bond price?',
    timeLimitSeconds: 30,
    options: [
      { id: 'a', text: '+4.0%', isCorrect: false, explanation: 'Bond prices fall when yields rise.' },
      { id: 'b', text: '-4.0%', isCorrect: true, explanation: '%ΔP ≈ -Modified Duration × ΔYield = -8.0 × 0.50% = -4.0% price decline.' },
      { id: 'c', text: '-8.0%', isCorrect: false, explanation: 'That would be for a 100 bps move (1.00%).' },
      { id: 'd', text: '-0.50%', isCorrect: false, explanation: 'Duration multiplies yield changes by 8x.' }
    ],
    points: 250
  },
  {
    id: 'g-micro-1',
    category: 'Market Microstructure',
    tier: 'Associate',
    question: 'The order book ask ladder has: 100 shares @ $50.10 and 200 shares @ $50.20. You send a Market Buy for 150 shares. What is your volume-weighted average fill price?',
    timeLimitSeconds: 25,
    options: [
      { id: 'a', text: '$50.13', isCorrect: true, explanation: 'Cost = (100 × $50.10) + (50 × $50.20) = $5,010 + $2,510 = $7,520. Average price = $7,520 / 150 = $50.133 -> $50.13.' },
      { id: 'b', text: '$50.10', isCorrect: false, explanation: '$50.10 only had 100 shares; the remaining 50 shares had to sweep into the $50.20 level.' },
      { id: 'c', text: '$50.15', isCorrect: false, explanation: 'Simple midpoint would be $50.15, but you bought 100 shares at 50.10 and only 50 at 50.20.' },
      { id: 'd', text: '$50.20', isCorrect: false, explanation: 'The first 100 shares were filled at $50.10.' }
    ],
    points: 180
  },
  {
    id: 'g-prob-1',
    category: 'Probability & Games',
    tier: 'Quant Partner',
    question: 'You flip 3 fair coins. What is the probability that you obtain AT LEAST 2 heads?',
    timeLimitSeconds: 25,
    options: [
      { id: 'a', text: '3/8 (37.5%)', isCorrect: false, explanation: 'Exactly 2 heads is 3/8, but "at least 2" includes 3 heads (1/8).' },
      { id: 'b', text: '4/8 or 1/2 (50.0%)', isCorrect: true, explanation: 'Possible outcomes: HHH (1), HHT, HTH, THH (3). Total favorable = 1 + 3 = 4 out of 8 possible states = 50%!' },
      { id: 'c', text: '5/8 (62.5%)', isCorrect: false, explanation: 'Check combinations: 4 / 8 = 1/2.' },
      { id: 'd', text: '2/3 (66.7%)', isCorrect: false, explanation: 'Total space is 2^3 = 8.' }
    ],
    points: 250
  }
];
