/**
 * Daily Boost Challenges
 * Quick daily financial micro-puzzles for the /boost mode.
 */

export const DAILY_BOOSTS = [
  {
    id: 'boost-1',
    dayTitle: 'Today’s Boost: The Coffee Millionaire Paradox',
    category: 'Personal Finance Math',
    xpReward: 100,
    multiplier: '2X XP',
    scenario: 'You spend $6/day on artisan coffee ($180/month). Suppose you invested that $180/month instead into an S&P 500 index fund earning an average of 9% annualized for 35 years.',
    question: 'How much would that coffee money grow to after 35 years of compound interest?',
    options: [
      { id: 'a', text: 'Around $75,000 (roughly just the cash saved)', isCorrect: false, explanation: 'Total cash invested is only $75,600, but compound interest multiplies it massively!' },
      { id: 'b', text: 'Over $500,000 half a million dollars!', isCorrect: true, explanation: 'Astounding reality: $180/month compounded at 9% over 35 years explodes to ~$530,000! Over 85% of that fortune is pure compound interest.' },
      { id: 'c', text: 'Exactly $120,000', isCorrect: false, explanation: 'Compounding at 9% produces over $500,000.' }
    ]
  },
  {
    id: 'boost-2',
    dayTitle: 'Flash Arbitrage Challenge',
    category: 'Quantitative Arbitrage',
    xpReward: 120,
    multiplier: '2X XP',
    scenario: 'An ETF trades at $99.20 per share on the exchange, but the exact Net Asset Value (NAV) of its underlying stock basket is calculated at $100.00.',
    question: 'As an authorized participant / arbitrageur, how do you lock in a risk-free profit?',
    options: [
      { id: 'a', text: 'Buy the ETF at $99.20 and short/sell the underlying basket at $100.00, pocketing the $0.80 spread per share', isCorrect: true, explanation: 'Textbook ETF arbitrage! You buy the undervalued ETF, redeem it with the issuer for the actual basket shares, and deliver them to close your short.' },
      { id: 'b', text: 'Sell the ETF and buy the basket', isCorrect: false, explanation: 'That would sell the cheap asset and buy the expensive asset, losing money.' },
      { id: 'c', text: 'Wait for the Fed to intervene', isCorrect: false, explanation: 'Arbitrageurs act in milliseconds, restoring fair value without central banks.' }
    ]
  },
  {
    id: 'boost-3',
    dayTitle: 'Earnings Straddle Intuition',
    category: 'Derivatives Strategy',
    xpReward: 120,
    multiplier: '2X XP',
    scenario: 'Tech giant XYZ reports earnings tonight. You know the stock will swing violently by at least 15%, but you have no idea whether it will beat or miss.',
    question: 'Which option position allows you to profit purely from the magnitude of the move regardless of direction?',
    options: [
      { id: 'a', text: 'Long Straddle (Buy ATM Call + Buy ATM Put)', isCorrect: true, explanation: 'Exact! A Long Straddle profits whenever the underlying makes a large move in EITHER direction exceeding the combined premium paid.' },
      { id: 'b', text: 'Short Put', isCorrect: false, explanation: 'A short put loses heavily if the stock plunges.' },
      { id: 'c', text: 'Covered Call', isCorrect: false, explanation: 'Covered calls have capped upside and full downside risk.' }
    ]
  },
  {
    id: 'boost-4',
    dayTitle: 'The Bond Seesaw Paradox',
    category: 'Fixed Income Mechanics',
    xpReward: 110,
    multiplier: '2X XP',
    scenario: 'You hold a 10-year Treasury bond with a 3.0% coupon. The Federal Reserve unexpectedly hikes benchmark interest rates by 200 bps, driving prevailing market yields up to 5.0%.',
    question: 'What happens immediately to the market resale price of your existing 3.0% bond?',
    options: [
      { id: 'a', text: 'The bond price plummets below par ($1,000) because existing 3% coupons are now less attractive than new 5% bonds', isCorrect: true, explanation: 'The fundamental bond seesaw: when market interest rates rise, existing bond prices drop so their yield-to-maturity aligns with the higher current market rates.' },
      { id: 'b', text: 'The bond price increases because higher interest rates mean higher yield for you', isCorrect: false, explanation: 'Fixed coupon payments do not increase when market rates rise; instead the capital value drops.' },
      { id: 'c', text: 'The bond price remains strictly unchanged until maturity', isCorrect: false, explanation: 'While the bond will return par at maturity, its secondary market trading price fluctuates constantly with yields.' }
    ]
  },
  {
    id: 'boost-5',
    dayTitle: 'Order Book Liquidity Void',
    category: 'Market Microstructure',
    xpReward: 130,
    multiplier: '2X XP',
    scenario: 'The order book for stock ABC shows 100 shares offered at $50.00, 200 shares at $50.50, and 500 shares at $52.00. A large institutional trader drops an unconstrained Market Buy order for 500 shares.',
    question: 'What is the average execution fill price for this trader, and what phenomenon occurred?',
    options: [
      { id: 'a', text: 'Exactly $50.00 with zero slippage', isCorrect: false, explanation: 'Only 100 shares were available at $50.00; the remaining 400 shares had to sweep deeper into the book.' },
      { id: 'b', text: '$51.00 average fill price due to depth slippage (100 @ $50 + 200 @ $50.50 + 200 @ $52.00)', isCorrect: true, explanation: 'Market orders sweep through the ask depth: (100×$50 + 200×$50.50 + 200×$52.00) / 500 = $25,500 / 500 = $51.00, causing a full dollar of execution slippage!' },
      { id: 'c', text: '$52.00 flat for all 500 shares', isCorrect: false, explanation: 'The order book matches orders sequentially from the best ask upward.' }
    ]
  },
  {
    id: 'boost-6',
    dayTitle: 'Markowitz Free Lunch',
    category: 'Modern Portfolio Theory',
    xpReward: 140,
    multiplier: '2X XP',
    scenario: 'You combine two volatile technology and energy stocks that each have an expected return of 10% and standard deviation (volatility) of 20%. Their return correlation is 0.0 (completely uncorrelated).',
    question: 'If you allocate 50% to each stock, what happens to the overall portfolio volatility?',
    options: [
      { id: 'a', text: 'Volatility stays at 20% because both assets have 20% volatility', isCorrect: false, explanation: 'When assets are uncorrelated, independent random shocks partially offset each other, dampening total variance.' },
      { id: 'b', text: 'Volatility drops to ~14.1% with zero sacrifice in expected 10% return', isCorrect: true, explanation: 'The only free lunch in finance! Portfolio standard deviation = sqrt(0.5²×20² + 0.5²×20²) = sqrt(100) × sqrt(2) ≈ 14.14%. You eliminated nearly 30% of your risk for free.' },
      { id: 'c', text: 'Volatility drops to 0% risk-free', isCorrect: false, explanation: 'Only a perfectly negative correlation (-1.0) can theoretically eliminate all volatility in a two-asset portfolio.' }
    ]
  },
  {
    id: 'boost-7',
    dayTitle: 'DCF Terminal Value Dominance',
    category: 'Valuation Modeling',
    xpReward: 150,
    multiplier: '2X XP',
    scenario: 'In a 5-year Discounted Cash Flow (DCF) model of a mature cash-generating company, the present value of explicit cash flows is $20M and the Gordon Growth Terminal Value discounted to today is $80M.',
    question: 'Why is Terminal Value so sensitive to tiny 50 bps shifts in the discount rate (WACC) or perpetual growth rate (g)?',
    options: [
      { id: 'a', text: 'Because Terminal Value relies on the denominator (WACC - g), where small changes create huge mathematical leverage on cash flows capitalized into perpetuity', isCorrect: true, explanation: 'Gordon Growth formula TV = FCF×(1+g)/(WACC - g). When (WACC - g) changes from 4.0% to 3.5%, the capitalization multiple jumps from 25x to 28.6x, swinging the entire company valuation by tens of millions.' },
      { id: 'b', text: 'Because terminal value only models year 6 and ignores years thereafter', isCorrect: false, explanation: 'Terminal value encapsulates ALL cash flows from year 6 into infinity.' },
      { id: 'c', text: 'Terminal value is not sensitive to WACC', isCorrect: false, explanation: 'WACC is the primary discount factor compounding over decades.' }
    ]
  }
];
