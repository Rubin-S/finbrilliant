/**
 * Comprehensive Interactive Finance Courses
 * 6 full courses with first-principles bite-sized micro-steps, interactive visualizers,
 * and intuitive quiz challenges modeled on Brilliant.org.
 */

export const COURSES = [
  {
    id: 'course-compound',
    title: 'The Magic of Compound Growth',
    category: 'Foundations of Wealth',
    icon: '🌱',
    level: 'Beginner',
    tagline: 'Why Einstein called compounding the eighth wonder of the world.',
    description: 'Master exponential curves, the Rule of 72, compounding frequency limits, and the staggering mathematical penalty of waiting 10 years.',
    totalXP: 180,
    estimatedMinutes: 20,
    lessons: [
      {
        id: 'compound-101',
        title: 'The Exponential Curve & The Rule of 72',
        xp: 60,
        cards: [
          {
            id: 'c1-step1',
            type: 'interactive_slider',
            title: 'Linear vs. Exponential Growth',
            prompt: 'Linear growth adds by addition ($10 + $10 + $10). Compounding grows by multiplication. Adjust the annual return rate below to see how tiny percentage changes compound over 30 years.',
            widgetType: 'compound_growth',
            initialState: { principal: 5000, rate: 7, years: 30, contribution: 300 },
            question: 'At an 8% annual return, about how much does an initial $5,000 with $300/year become after 30 years compared to simple cash in a zero-interest mattress ($14,000)?',
            options: [
              { id: 'opt1', text: 'Around $22,000 (just 50% more)', isCorrect: false, explanation: 'Incorrect. Compounding is non-linear; it produces far more than simple interest.' },
              { id: 'opt2', text: 'Over $85,000 (more than 6x initial total)', isCorrect: true, explanation: 'Correct! $5,000 alone grows to over $50,000, and regular additions push the final sum past $85,000 due to interest earning interest.' },
              { id: 'opt3', text: 'Exactly $14,000', isCorrect: false, explanation: 'No interest would yield $14,000. Compounding compounds gains exponentially.' }
            ]
          },
          {
            id: 'c1-step2',
            type: 'quiz_choice',
            title: 'The Rule of 72 Shortcut',
            prompt: 'Wall Street quants and mental math wizards estimate doubling time using the Rule of 72: Doubling Years ≈ 72 / Rate (in %).',
            question: 'If the stock market historically averages ~9% nominal annualized returns, how many years does it take for your invested capital to double?',
            options: [
              { id: 'a', text: '4 years', isCorrect: false, explanation: '72 / 9 = 8 years, not 4.' },
              { id: 'b', text: '8 years', isCorrect: true, explanation: 'Spot on! 72 / 9 = 8 years. In 24 years, your money doubles 3 times (2^3 = 8x original capital)!' },
              { id: 'c', text: '12 years', isCorrect: false, explanation: '72 / 9 = 8 years. 12 years would be a 6% return.' }
            ]
          },
          {
            id: 'c1-step3',
            type: 'interactive_slider',
            title: 'The Cost of Delay',
            prompt: 'Compare two investors: Alice invests $200/mo from age 20 to 30 then stops completely. Bob invests $200/mo from age 30 to 60 (30 continuous years!). Both earn 8% annually.',
            widgetType: 'delay_cost',
            question: 'Who ends up with more wealth at age 60?',
            options: [
              { id: 'a', text: 'Bob, because he invested $72,000 total while Alice only invested $24,000', isCorrect: false, explanation: 'Counter-intuitively, Alice wins! Her early money had 30 uninterrupted years of compound velocity.' },
              { id: 'b', text: 'Alice, even though she contributed 3x less principal total!', isCorrect: true, explanation: 'Mind-blowing truth of compound math: Alice invested $24,000 and ends up with ~$500k+, while Bob invested $72,000 and ends up with ~$300k. Time in the market trumps total dollars invested.' },
              { id: 'c', text: 'They end up with identical balances', isCorrect: false, explanation: 'The timing of contributions vastly changes the compounding curve.' }
            ]
          },
          {
            id: 'c1-step4',
            type: 'summary',
            title: 'Lesson Mastery: Compounding',
            takeaways: [
              'Compound interest is convex: the hockey-stick inflection happens in the back half of the time horizon.',
              'Rule of 72 gives immediate mental math intuition for doubling periods.',
              'Starting 10 years earlier is worth more than tripling your lifetime contributions later.'
            ],
            xpReward: 60
          }
        ]
      },
      {
        id: 'compound-102',
        title: 'Compounding Frequency & The Euler Limit e',
        xp: 60,
        cards: [
          {
            id: 'c2-step1',
            type: 'quiz_choice',
            title: 'From Annual to Daily Compounding',
            prompt: 'If a bank offers 100% interest on $1 for one year, compounding once gives (1 + 1)^1 = $2. Compounding semi-annually gives (1 + 0.5)^2 = $2.25. Compounding monthly gives (1 + 1/12)^12 = $2.61.',
            question: 'What happens if you compound every millisecond or continuously infinitely many times?',
            options: [
              { id: 'a', text: 'The balance explodes to infinity', isCorrect: false, explanation: 'No! It encounters a mathematical ceiling discovered by Jacob Bernoulli in 1683.' },
              { id: 'b', text: 'It converges to Euler\'s number e ≈ $2.71828...', isCorrect: true, explanation: 'Precisely! lim_{n -> ∞} (1 + 1/n)^n = e ≈ 2.71828. This constant is the foundation of continuous compounding, bond yields, and Black-Scholes pricing!' },
              { id: 'c', text: 'It collapses back to $2.00', isCorrect: false, explanation: 'More frequent compounding always increases yield, but with diminishing marginal gains.' }
            ]
          },
          {
            id: 'c2-step2',
            type: 'quiz_choice',
            title: 'Real vs. Nominal Returns (The Inflation Tax)',
            prompt: 'You earn a 7% nominal return on your high-yield bond, but annual inflation runs at 3.5%.',
            question: 'What is your approximate real purchasing power growth rate according to the Fisher Equation (r_real ≈ r_nominal - inflation)?',
            options: [
              { id: 'a', text: '3.5%', isCorrect: true, explanation: 'Correct. 7% - 3.5% = 3.5%. Nominal numbers hide the real erosion of purchasing power.' },
              { id: 'b', text: '10.5%', isCorrect: false, explanation: 'Inflation subtracts from your return, it doesn\'t add to it.' },
              { id: 'c', text: '0%', isCorrect: false, explanation: 'You still beat inflation by 3.5%.' }
            ]
          },
          {
            id: 'c2-step3',
            type: 'summary',
            title: 'Lesson Mastery: Frequency & Inflation',
            takeaways: [
              'Continuous compounding converges to Euler’s constant e ≈ 2.71828.',
              'Real return = Nominal return - Inflation (Fisher Equation).',
              'Inflation is a silent erosion tax on non-yielding cash.'
            ],
            xpReward: 60
          }
        ]
      }
    ]
  },
  {
    id: 'course-orderbook',
    title: 'Market Microstructure & Order Books',
    category: 'Trading & Market Architecture',
    icon: '⚡',
    level: 'Intermediate',
    tagline: 'How prices actually move: Bids, Asks, Slippage, and Market Makers.',
    description: 'Step inside an electronic exchange matching engine. Understand Level 2 depth, bid-ask spread, adverse selection, and why large market orders suffer slippage.',
    totalXP: 240,
    estimatedMinutes: 25,
    lessons: [
      {
        id: 'orderbook-101',
        title: 'Anatomy of an Order Book & The Spread',
        xp: 80,
        cards: [
          {
            id: 'ob1-step1',
            type: 'interactive_widget',
            title: 'The Continuous Double Auction',
            prompt: 'In modern electronic markets (NASDAQ, CME, Binance), prices do not magically exist. They are determined by an order book containing passive limit orders from buyers (Bids) and sellers (Asks).',
            widgetType: 'orderbook_ladder',
            question: 'If the best bid is $100.10 and the best ask is $100.15, what is the Bid-Ask Spread?',
            options: [
              { id: 'a', text: '$0.05 (5 cents)', isCorrect: true, explanation: 'Correct! Spread = Best Ask - Best Bid = $100.15 - $100.10 = $0.05. This 5 cents is the transaction fee captured by market makers for providing immediate liquidity.' },
              { id: 'b', text: '$0.15', isCorrect: false, explanation: 'Spread is the difference between the best bid and ask.' },
              { id: 'c', text: '$100.125', isCorrect: false, explanation: '$100.125 is the Mid-Market price, not the spread!' }
            ]
          },
          {
            id: 'ob1-step2',
            type: 'interactive_widget',
            title: 'Market Orders vs. Limit Orders (The Price of Immediacy)',
            prompt: 'Test executing orders directly in our matching engine below! Place a Market Buy order for 200 shares and observe how it eats through the ask levels.',
            widgetType: 'orderbook_sandbox',
            question: 'Why did your average fill price end up higher than the best visible ask price?',
            options: [
              { id: 'a', text: 'Exchange platform fee bug', isCorrect: false, explanation: 'Not a bug, but the physical mechanics of market depth!' },
              { id: 'b', text: 'Slippage: your order size exceeded the shares available at the best ask, walking up the book to higher prices', isCorrect: true, explanation: 'Bullseye! When order volume > level depth, the matching engine sweeps into deeper, more expensive asks. This penalty is called slippage.' },
              { id: 'c', text: 'Because sellers canceled their quotes', isCorrect: false, explanation: 'The matching engine executed your market order against available inventory.' }
            ]
          },
          {
            id: 'ob1-step3',
            type: 'quiz_choice',
            title: 'Adverse Selection (The Market Maker\'s Nightmare)',
            prompt: 'A market maker posts bids and asks simultaneously to pocket the spread. But if a hedge fund with proprietary news hits their bid aggressively, what risk does the market maker face?',
            question: 'What do quantitative traders call the risk of trading with someone who knows more than you?',
            options: [
              { id: 'a', text: 'Adverse Selection', isCorrect: true, explanation: 'Spot on! You buy right before the price plunges, or sell right before it rockets. Market makers widen their spreads when informed trading risk spikes.' },
              { id: 'b', text: 'Moral Hazard', isCorrect: false, explanation: 'Moral hazard refers to reckless risk-taking due to insurance or bailouts.' },
              { id: 'c', text: 'Systemic Contagion', isCorrect: false, explanation: 'Systemic contagion is broader macro domino failure.' }
            ]
          },
          {
            id: 'ob1-step4',
            type: 'summary',
            title: 'Lesson Mastery: Market Microstructure',
            takeaways: [
              'Spread is the price of immediacy captured by liquidity providers.',
              'Market orders pay slippage when order size exceeds top-of-book depth.',
              'Adverse selection causes market makers to widen spreads during volatility.'
            ],
            xpReward: 80
          }
        ]
      }
    ]
  },
  {
    id: 'course-options',
    title: 'Options, Derivatives & Volatility',
    category: 'Derivatives & Quantitative Trading',
    icon: '🎯',
    level: 'Advanced',
    tagline: 'Non-linear payoffs, the Black-Scholes formula, and the Greeks.',
    description: 'Unlock options intuition. Build visual call/put payoff diagrams, master Delta hedging, witness Theta time decay, and discover why implied volatility is the price of uncertainty.',
    totalXP: 260,
    estimatedMinutes: 30,
    lessons: [
      {
        id: 'options-101',
        title: 'Payoff Diagrams & The Option Asymmetry',
        xp: 80,
        cards: [
          {
            id: 'opt1-step1',
            type: 'interactive_widget',
            title: 'The Hockey Stick Payoff',
            prompt: 'A Call Option gives the buyer the RIGHT, but not the obligation, to buy a stock at Strike price K. If stock price S < K at expiration, the call expires worthless. If S > K, profit expands dollar-for-dollar.',
            widgetType: 'options_payoff',
            initialState: { strike: 100, premium: 5, optionType: 'call' },
            question: 'You buy a $100 Call option for a $5 premium. What is your break-even stock price at expiration?',
            options: [
              { id: 'a', text: '$100', isCorrect: false, explanation: 'At $100 the option is worth $0, but you spent $5 on the premium, meaning a net loss of $5.' },
              { id: 'b', text: '$105', isCorrect: true, explanation: 'Exact! Break-even = Strike + Premium = $100 + $5 = $105. Any price above $105 produces pure profit.' },
              { id: 'c', text: '$95', isCorrect: false, explanation: 'That would be the break-even for a Put option ($100 - $5 = $95).' }
            ]
          },
          {
            id: 'opt1-step2',
            type: 'quiz_choice',
            title: 'Delta (Δ): The Hedge Ratio & Probability',
            prompt: 'Delta measures how much the option price moves for every $1 change in the underlying stock price.',
            question: 'For an At-The-Money (ATM) call option where Strike ≈ Spot price, what is Delta approximately equal to?',
            options: [
              { id: 'a', text: '0.0 (does not react to price)', isCorrect: false, explanation: 'Deep out-of-the-money options have Delta near 0.' },
              { id: 'b', text: '0.50 (moves $0.50 for every $1.00 stock move)', isCorrect: true, explanation: 'Yes! An ATM option has roughly a 50% probability of expiring in the money, giving it a Delta of ~0.50.' },
              { id: 'c', text: '1.00 (moves 1-for-1 like stock)', isCorrect: false, explanation: 'Deep in-the-money options have Delta near 1.0.' }
            ]
          },
          {
            id: 'opt1-step3',
            type: 'interactive_widget',
            title: 'Theta (θ): The Melting Ice Cube',
            prompt: 'Options have an expiration date. Every single day that passes without price movement erodes extrinsic value.',
            widgetType: 'theta_decay',
            question: 'As expiration approaches, does the rate of time decay (Theta) accelerate or slow down for ATM options?',
            options: [
              { id: 'a', text: 'It accelerates dramatically in the final 30 days', isCorrect: true, explanation: 'Crucial insight! Time value decay is non-linear. The curve plunges like a cliff in the final weeks before expiration.' },
              { id: 'b', text: 'It decays linearly at a constant rate every day', isCorrect: false, explanation: 'Options decay follows a square-root of time curve, accelerating toward zero.' },
              { id: 'c', text: 'It slows down to zero', isCorrect: false, explanation: 'Decay accelerates, penalizing buyers and rewarding option sellers.' }
            ]
          },
          {
            id: 'opt1-step4',
            type: 'summary',
            title: 'Lesson Mastery: Derivatives & Greeks',
            takeaways: [
              'Options provide asymmetric, non-linear convex payoffs.',
              'Delta (Δ) approximates hedge ratios and probability of expiring in the money.',
              'Theta (θ) time decay accelerates aggressively in the final 30 days.'
            ],
            xpReward: 80
          }
        ]
      }
    ]
  },
  {
    id: 'course-dcf',
    title: 'Corporate Valuation & DCF Intuition',
    category: 'Corporate Finance & Investment Banking',
    icon: '🏛️',
    level: 'Intermediate',
    tagline: 'What is a business actually worth? Discounting cash flows from first principles.',
    description: 'Learn how Warren Buffett and Wall Street analysts value cash-generating assets. Master Free Cash Flow to Firm (FCFF), WACC, Terminal Value, and sensitivity tables.',
    totalXP: 220,
    estimatedMinutes: 25,
    lessons: [
      {
        id: 'dcf-101',
        title: 'The Time Value of Future Cash Flows',
        xp: 75,
        cards: [
          {
            id: 'dcf1-step1',
            type: 'interactive_widget',
            title: 'Present Value Machine',
            prompt: 'A dollar tomorrow is worth less than a dollar today due to opportunity cost and risk. Use the discount rate slider below to see how $1,000 received in year 5 shrinks in present value.',
            widgetType: 'dcf_discount',
            initialState: { cashFlow: 1000, discountRate: 10, years: 5 },
            question: 'At a 10% discount rate, how much is $1,000 to be received in 5 years worth today?',
            options: [
              { id: 'a', text: '$1,000', isCorrect: false, explanation: 'Without discounting that would be true, but money has time value.' },
              { id: 'b', text: 'About $621', isCorrect: true, explanation: 'Correct! PV = $1,000 / (1.10)^5 = $620.92. You would only pay $621 today for the promise of $1,000 in 5 years.' },
              { id: 'c', text: '$500', isCorrect: false, explanation: '$500 would correspond to an ~15% discount rate.' }
            ]
          },
          {
            id: 'dcf1-step2',
            type: 'quiz_choice',
            title: 'The 70% Elephant: Terminal Value',
            prompt: 'In a 5-year DCF model, cash flows are projected for years 1-5. But the company continues operating for decades afterwards.',
            question: 'In most realistic DCF models, roughly how much of the total enterprise value comes from the Terminal Value?',
            options: [
              { id: 'a', text: 'Less than 10%', isCorrect: false, explanation: 'Discrete 5-year cash flows only represent a fraction of perpetual value.' },
              { id: 'b', text: 'Between 65% and 85%', isCorrect: true, explanation: 'Accurate! Terminal Value typically accounts for 70%+ of total valuation. That is why small tweaks to the discount rate or terminal growth rate swing stock targets wildly!' },
              { id: 'c', text: 'Exactly 100%', isCorrect: false, explanation: 'The 5 explicit years still contribute 15-35%.' }
            ]
          },
          {
            id: 'dcf1-step3',
            type: 'summary',
            title: 'Lesson Mastery: DCF Valuation',
            takeaways: [
              'Enterprise value is the present value of all future Free Cash Flows discounted at WACC.',
              'Terminal Value makes up 65-85% of total enterprise valuation in most DCFs.',
              'Small changes to the discount rate or terminal growth swing valuation targets drastically.'
            ],
            xpReward: 75
          }
        ]
      }
    ]
  },
  {
    id: 'course-portfolio',
    title: 'Modern Portfolio Theory & Risk',
    category: 'Quantitative Asset Management',
    icon: '⚖️',
    level: 'Intermediate',
    tagline: 'The only free lunch in finance: Diversification and the Sharpe Ratio.',
    description: 'Discover Harry Markowitz’s Nobel-prize winning insight: how combining two risky assets with low correlation can LOWER overall risk while maintaining expected returns.',
    totalXP: 200,
    estimatedMinutes: 20,
    lessons: [
      {
        id: 'mpt-101',
        title: 'The Correlation Paradox',
        xp: 70,
        cards: [
          {
            id: 'mpt1-step1',
            type: 'interactive_widget',
            title: 'The Diversification Free Lunch',
            prompt: 'Combine Asset A (Return 12%, Volatility 20%) and Asset B (Return 6%, Volatility 10%). Slide correlation from +1.0 down to -0.5 and observe how the frontier curve bows leftward.',
            widgetType: 'efficient_frontier',
            initialState: { rA: 12, sA: 20, rB: 6, sB: 10, correlation: 0.1 },
            question: 'When the correlation between two assets is less than 1 (ρ < 1), what happens to total portfolio volatility?',
            options: [
              { id: 'a', text: 'Portfolio volatility is strictly less than the weighted average of individual volatilities', isCorrect: true, explanation: 'Eureka! When assets zig while others zag, the cross-terms cancel out variance. This mathematical anomaly is the foundation of institutional investing.' },
              { id: 'b', text: 'Volatility increases because you hold more assets', isCorrect: false, explanation: 'Adding uncorrelated assets suppresses idiosyncratic noise.' },
              { id: 'c', text: 'Expected return drops to zero', isCorrect: false, explanation: 'Expected return remains a linear weighted average; only variance shrinks!' }
            ]
          },
          {
            id: 'mpt1-step2',
            type: 'quiz_choice',
            title: 'The Sharpe Ratio',
            prompt: 'Sharpe Ratio = (Portfolio Return - Risk-Free Rate) / Portfolio Standard Deviation.',
            question: 'Portfolio X has 15% return with 20% volatility. Portfolio Y has 10% return with 8% volatility. If the risk-free rate is 2%, which portfolio is more efficient?',
            options: [
              { id: 'a', text: 'Portfolio X (Sharpe = 0.65)', isCorrect: false, explanation: 'Portfolio X: (15 - 2) / 20 = 0.65.' },
              { id: 'b', text: 'Portfolio Y (Sharpe = 1.00)', isCorrect: true, explanation: 'Spot on! Portfolio Y: (10 - 2) / 8 = 1.00. Portfolio Y generates 1.00% excess return per unit of risk, making it significantly superior on a risk-adjusted basis!' },
              { id: 'c', text: 'Both are equally efficient', isCorrect: false, explanation: '1.00 is much higher than 0.65.' }
            ]
          },
          {
            id: 'mpt1-step3',
            type: 'summary',
            title: 'Lesson Mastery: Modern Portfolio Theory',
            takeaways: [
              'Diversification reduces portfolio variance whenever asset correlation ρ < 1.',
              'The Sharpe ratio measures excess return per unit of total risk.',
              'The Efficient Frontier maps optimal asset weightings maximizing return for a target volatility.'
            ],
            xpReward: 70
          }
        ]
      }
    ]
  },
  {
    id: 'course-macro',
    title: 'Central Banking & The Yield Curve',
    category: 'Macroeconomics & Global Markets',
    icon: '🌐',
    level: 'Beginner',
    tagline: 'How the Federal Reserve controls liquidity and why yield curve inversions predict recessions.',
    description: 'Understand bond yields, the Fed Funds Rate, duration risk, and why the 10-year minus 2-year Treasury spread is the most watched recession barometer on Wall Street.',
    totalXP: 190,
    estimatedMinutes: 20,
    lessons: [
      {
        id: 'macro-101',
        title: 'Bond Prices vs. Yields (The Seesaw)',
        xp: 65,
        cards: [
          {
            id: 'macro1-step1',
            type: 'interactive_widget',
            title: 'The Interest Rate Seesaw',
            prompt: 'Bond prices and market yields move in opposite directions. Move the market interest rate slider and watch what happens to a 10-year bond paying a fixed 4% coupon.',
            widgetType: 'bond_seesaw',
            initialState: { faceValue: 1000, coupon: 4, yield: 4, maturity: 10 },
            question: 'When the central bank hikes market yields from 4% to 6%, what happens to the market price of existing 4% coupon bonds?',
            options: [
              { id: 'a', text: 'The bond price drops (trades at a discount)', isCorrect: true, explanation: 'Yes! Investors won\'t pay full par for an old bond paying 4% when new bonds pay 6%. The old bond\'s price must drop until its yield-to-maturity matches the current 6% market rate.' },
              { id: 'b', text: 'The bond price increases (trades at a premium)', isCorrect: false, explanation: 'Bond prices drop when yields rise.' },
              { id: 'c', text: 'The coupon automatically rises to 6%', isCorrect: false, explanation: 'Fixed-rate coupon bonds have invariant nominal coupon dollar payments.' }
            ]
          },
          {
            id: 'macro1-step2',
            type: 'quiz_choice',
            title: 'The Inverted Yield Curve Signal',
            prompt: 'In normal times, lending money for 10 years carries more term premium than lending for 2 years (upward sloping yield curve).',
            question: 'What does it indicate when the 2-Year Treasury yield is HIGHER than the 10-Year yield (Yield Curve Inversion)?',
            options: [
              { id: 'a', text: 'Bond traders expect the central bank will have to aggressively cut interest rates in the future due to an upcoming recession', isCorrect: true, explanation: 'Correct! Every US recession since 1955 has been preceded by a 10Y-2Y yield curve inversion (with only 1 false positive).' },
              { id: 'b', text: 'High long-term economic growth is guaranteed', isCorrect: false, explanation: 'High growth produces a steep upward-sloping curve, not an inverted one.' },
              { id: 'c', text: 'Inflation is expected to accelerate permanently', isCorrect: false, explanation: 'Inversion signals anticipated economic contraction and policy easing.' }
            ]
          },
          {
            id: 'macro1-step3',
            type: 'summary',
            title: 'Lesson Mastery: Fixed Income & Macro',
            takeaways: [
              'Bond prices and yields move inversely like a seesaw.',
              'Modified duration measures price sensitivity to a 100 bps change in yield.',
              'Inverted 10Y-2Y yield curves are Wall Street’s most reliable recession indicator.'
            ],
            xpReward: 65
          }
        ]
      }
    ]
  }
];
