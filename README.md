# FinBrilliant ⚡: Brilliant.org for Finance

> **Master Finance from First Principles.**
> No dry textbooks. No passive video lectures. Touch the order book, manipulate Black-Scholes volatility, and discount cash flows in real-time.

FinBrilliant is an interactive, bite-sized learning platform modeled directly on the pedagogy and design philosophy of **Brilliant.org**, tailored specifically for quantitative finance, financial literacy, market microstructure, and Wall Street technical interviews.

---

## 🚀 Key Features & Modes

### 1. 📚 Core Interactive Curriculum
Six comprehensive, multi-step courses built with interactive SVG visualizers, live sliders, and intuitive quiz mechanics:
1. **The Magic of Compound Growth**: Exponential curves, the Rule of 72, the Euler limit ($e$), and the mathematical cost of delay.
2. **Market Microstructure & Order Books**: Live continuous double auction matching engine, Level 2 depth, bid-ask spread, slippage, and adverse selection.
3. **Options, Derivatives & Volatility**: Non-linear call/put payoff diagrams, At-The-Money Delta hedge ratios, and Theta time decay acceleration.
4. **Corporate Valuation & DCF Intuition**: Time value of future cash flows, WACC discounting waterfall, and Gordon Growth terminal value.
5. **Modern Portfolio Theory & Risk**: Harry Markowitz's diversification "free lunch", 2-asset correlation ($\rho$) frontier curves, and Sharpe ratio optimization.
6. **Central Banking & The Yield Curve**: Fixed income seesaw (prices vs. yields), Macaulay/Modified duration sensitivity, and 10Y-2Y recession inversion signals.

### 2. 🔥 `/grill-me`: Wall Street Superday Interview Arena
- Fast-paced, timed technical interview challenge (25 seconds per question).
- 3 Lives (❤️ ❤️ ❤️) and combo multiplier streaks ($1.5\times$, $2.0\times$).
- Real Wall Street technical questions covering mental math shortcuts, market making spreads, options Greeks first-order approximations, DCF accounting, and probability.
- Post-interview Superday Debrief with performance tiers (*Jane Street/Citadel Partner*, *Goldman VP*, *Associate*, or *Dinged in Round 1*).

### 3. 🚀 `/boost`: Daily Brain Boost Challenge
- Rotating daily financial micro-puzzles.
- $2\times$ XP multiplier to reward daily consistency and maintain streaks.

### 4. 🎯 `/goal`: Financial Mastery & Goals Hub
- Customizable weekly lesson target (e.g. 5 lessons/week).
- Real-time progress bar across the 6 financial pillars.
- Milestone badges (*Rule of 72 Pro*, *Euler Inquirer*, *Spread Hunter*, *Greeks Intuition*, *DCF Architect*, *Wall Street Griller*).
- Leveling & rank progression from *Retail Inquirer* to *Quantitative Strategist*.

### 5. 🧪 `/lab`: Interactive Quantitative Sandbox
- Freeform playground to manipulate models without lesson constraints:
  - Live Order Book & Market Buy Sweep Simulator
  - Options Payoff & Greeks Visualizer
  - DCF Cash Flow Present Value Waterfall
  - Portfolio Efficient Frontier & Correlation Hyperbola
  - Compound Interest & FIRE Retirement Calculator
  - Bond Yield & Price Seesaw

### 6. 🔊 Zero-Dependency Web Audio API Sound Engine
- Procedural audio synthesizer creating ascending success chords, error boops, tactile clicks, and timer ticks without any external sound files.
- Toggleable sound mute button and dark/light theme switcher.

---

## 🛠️ Quick Start

### Running Locally
No heavy dependencies or build steps required. Simply run:

```bash
node server.js
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

Alternatively, you can open `index.html` directly in any modern browser!

---

## 🧪 Automated Test Suite

FinBrilliant includes a built-in automated test suite covering financial math engines, order book matching logic, curriculum completeness, and local server integration:

```bash
npm test
# or
node test.mjs
```

All 33 test suites run in under 120ms using Node.js's native test runner!
