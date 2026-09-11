import test from 'node:test';
import assert from 'node:assert';
import {
  calculateCompoundInterest,
  ruleOf72,
  calculateBondPrice,
  calculateDCF,
  blackScholes,
  calculateTwoAssetPortfolio,
  generateEfficientFrontier
} from '../src/engines/financeMath.js';

test('calculateCompoundInterest calculates expected future value', () => {
  // $10,000 at 10% annual rate for 10 years, no additions
  const res = calculateCompoundInterest(10000, 10, 10, 1, 0);
  // (1 + 0.1)^10 = 2.59374246 -> $25,937.42
  assert.strictEqual(res.futureValue, 25937.42);
  assert.strictEqual(res.totalContributed, 10000);
  assert.strictEqual(res.totalInterest, 15937.42);
  assert.strictEqual(res.history.length, 11);
});

test('ruleOf72 accurately approximates doubling time', () => {
  assert.strictEqual(ruleOf72(7.2), 10);
  assert.strictEqual(ruleOf72(10), 7.2);
  assert.strictEqual(ruleOf72(0), Infinity);
});

test('calculateBondPrice behaves correctly with interest rate seesaw', () => {
  // Par bond: coupon = 5%, yield = 5%, face = 1000 -> price = 1000
  const parBond = calculateBondPrice(1000, 5, 5, 10, 2);
  assert.strictEqual(parBond.price, 1000);

  // When yield rises to 7%, bond price MUST drop below 1000
  const discountBond = calculateBondPrice(1000, 5, 7, 10, 2);
  assert.ok(discountBond.price < 1000, 'Bond price must drop when yield rises');
  assert.ok(discountBond.modifiedDuration > 0, 'Duration must be positive');

  // When yield drops to 3%, bond price MUST rise above 1000
  const premiumBond = calculateBondPrice(1000, 5, 3, 10, 2);
  assert.ok(premiumBond.price > 1000, 'Bond price must rise when yield falls');
});

test('calculateDCF computes enterprise value and handles Gordon Growth', () => {
  // FCF = 100, growth = 10%, 5 years, WACC = 8%, g_term = 3%
  const dcf = calculateDCF(100, 10, 5, 8, 3, 10, 200);
  assert.ok(dcf.enterpriseValue > 0);
  assert.ok(dcf.sharePrice > 0);
  assert.ok(dcf.terminalValuePct > 40, 'Terminal value should be a major fraction of EV');

  // WACC <= terminal growth rate must throw
  assert.throws(() => calculateDCF(100, 10, 5, 3, 3), /WACC must be strictly greater/);
});

test('blackScholes satisfies call/put parity & Greeks bounds', () => {
  const spot = 100;
  const strike = 100;
  const t = 1;
  const r = 5;
  const vol = 20;

  const bs = blackScholes(spot, strike, t, r, vol);
  assert.ok(bs.callPrice > 0);
  assert.ok(bs.putPrice > 0);
  // Put-Call Parity: C - P = S - K * e^(-r * T)
  const discountFactor = Math.exp(-0.05 * 1);
  const diff = bs.callPrice - bs.putPrice;
  const expectedDiff = spot - strike * discountFactor;
  assert.ok(Math.abs(diff - expectedDiff) < 0.1, `Put-call parity check failed: ${diff} vs ${expectedDiff}`);

  // ATM call delta should be around 0.5 ~ 0.6
  assert.ok(bs.deltaCall >= 0.5 && bs.deltaCall <= 0.7, 'Call delta ATM must be ~0.55-0.64');
  assert.ok(bs.deltaPut <= 0 && bs.deltaPut >= -0.5, 'Put delta ATM must be negative');
});

test('calculateTwoAssetPortfolio shows diversification benefit when correlation < 1', () => {
  const rA = 10, sA = 15;
  const rB = 5, sB = 10;
  
  const pCorr1 = calculateTwoAssetPortfolio(rA, sA, rB, sB, 1.0, 0.5);
  const pCorrNeg = calculateTwoAssetPortfolio(rA, sA, rB, sB, -0.5, 0.5);

  // Negative correlation must result in lower portfolio volatility than positive correlation
  assert.ok(pCorrNeg.volatility < pCorr1.volatility, 'Negative correlation must reduce risk');
  
  const frontier = generateEfficientFrontier(rA, sA, rB, sB, 0.2, 10);
  assert.strictEqual(frontier.length, 11);
});

test('calculateBondPrice handles 0% yield and zero maturity edge cases', () => {
  // 0% market yield: price equals face + sum of coupons (1000 + 10 * 50 = 1500)
  const zeroYield = calculateBondPrice(1000, 5, 0, 10, 1);
  assert.strictEqual(typeof zeroYield, 'object', 'Must return an object even with 0% yield');
  assert.strictEqual(zeroYield.price, 1500);
  assert.ok(zeroYield.modifiedDuration > 0, 'Duration must be computed and positive');
  assert.ok(!isNaN(zeroYield.macaulayDuration), 'Macaulay duration must not be NaN');

  // Zero maturity: price equals face value
  const zeroMat = calculateBondPrice(1000, 5, 5, 0, 1);
  assert.strictEqual(zeroMat.price, 1000);
  assert.strictEqual(zeroMat.modifiedDuration, 0);
});

test('calculateDCF guards against zero shares and handles negative growth', () => {
  assert.throws(() => calculateDCF(100, 10, 5, 8, 3, 0, 200), /Shares outstanding must be positive/);
  
  // High negative growth is allowed (e.g. contracting business)
  const contracting = calculateDCF(100, -10, 5, 8, 1, 10, 0);
  assert.ok(contracting.enterpriseValue > 0);
  assert.ok(contracting.sharePrice > 0);
});

test('blackScholes gracefully handles zero/negative inputs without throwing or returning NaN', () => {
  const zeroSpot = blackScholes(0, 100, 1, 5, 20);
  assert.strictEqual(zeroSpot.callPrice, 0);
  assert.ok(!isNaN(zeroSpot.putPrice));

  const zeroExpiry = blackScholes(100, 90, 0, 5, 20);
  // Immediate intrinsic value: Call = 100 - 90 = 10
  assert.strictEqual(zeroExpiry.callPrice, 10);
  assert.strictEqual(zeroExpiry.putPrice, 0);
});

test('calculateTwoAssetPortfolio clamps extreme correlation values', () => {
  const resOver = calculateTwoAssetPortfolio(10, 15, 5, 10, 2.5, 0.5);
  const resOne = calculateTwoAssetPortfolio(10, 15, 5, 10, 1.0, 0.5);
  assert.strictEqual(resOver.volatility, resOne.volatility);

  const resUnder = calculateTwoAssetPortfolio(10, 15, 5, 10, -5.0, 0.5);
  const resMinusOne = calculateTwoAssetPortfolio(10, 15, 5, 10, -1.0, 0.5);
  assert.strictEqual(resUnder.volatility, resMinusOne.volatility);
});

