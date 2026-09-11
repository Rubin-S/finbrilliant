/**
 * Core Financial Mathematics Engine
 * First-principles calculations for compounding, valuation, options, bonds, and portfolio theory.
 */

// 1. Compound Interest & Time Value of Money
export function calculateCompoundInterest(principal, annualRate, years, compoundsPerYear = 1, annualContribution = 0) {
  const r = annualRate / 100;
  const n = Math.max(0, compoundsPerYear);
  const t = Math.max(0, Math.round(years));
  
  const history = [];
  let currentBalance = principal;
  let totalContributed = principal;

  for (let year = 0; year <= t; year++) {
    if (year === 0) {
      history.push({
        year: 0,
        balance: Math.round(principal * 100) / 100,
        contributed: Math.round(totalContributed * 100) / 100,
        interestEarned: 0
      });
      continue;
    }

    if (n === 0) {
      // Continuous compounding: A = P * e^(rt) + contribution approximation
      currentBalance = currentBalance * Math.exp(r) + annualContribution;
    } else {
      // Standard compounding
      for (let period = 0; period < n; period++) {
        currentBalance = currentBalance * (1 + r / n);
      }
      currentBalance += annualContribution;
    }

    totalContributed += annualContribution;
    const interestEarned = Math.max(0, currentBalance - totalContributed);

    history.push({
      year,
      balance: Math.round(currentBalance * 100) / 100,
      contributed: Math.round(totalContributed * 100) / 100,
      interestEarned: Math.round(interestEarned * 100) / 100
    });
  }

  return {
    futureValue: history[history.length - 1].balance,
    totalContributed: history[history.length - 1].contributed,
    totalInterest: history[history.length - 1].interestEarned,
    history
  };
}

export function ruleOf72(annualRate) {
  if (annualRate <= 0) return Infinity;
  return Math.round((72 / annualRate) * 10) / 10;
}

// 2. Bond Pricing & Duration
export function calculateBondPrice(faceValue, couponRate, marketYield, yearsToMaturity, couponsPerYear = 2) {
  if (yearsToMaturity <= 0) {
    return {
      price: Math.round(faceValue * 100) / 100,
      macaulayDuration: 0,
      modifiedDuration: 0,
      estimatedPriceChangePer100Bps: 0
    };
  }

  const coupon = (faceValue * (couponRate / 100)) / couponsPerYear;
  const y = marketYield / 100 / couponsPerYear;
  const n = yearsToMaturity * couponsPerYear;

  let price = 0;
  let weightedTimeSum = 0;

  if (y === 0) {
    price = coupon * n + faceValue;
    for (let t = 1; t <= n; t++) {
      const cashFlow = t === n ? coupon + faceValue : coupon;
      weightedTimeSum += (t / couponsPerYear) * cashFlow;
    }
  } else {
    // PV of coupon annuity + PV of face value
    const pvCoupons = coupon * ((1 - Math.pow(1 + y, -n)) / y);
    const pvFace = faceValue / Math.pow(1 + y, n);
    price = pvCoupons + pvFace;

    for (let t = 1; t <= n; t++) {
      const cashFlow = t === n ? coupon + faceValue : coupon;
      const pvCashFlow = cashFlow / Math.pow(1 + y, t);
      weightedTimeSum += (t / couponsPerYear) * pvCashFlow;
    }
  }

  const macaulayDuration = price > 0 ? weightedTimeSum / price : 0;
  const modifiedDuration = y >= 0 ? macaulayDuration / (1 + y) : macaulayDuration;

  return {
    price: Math.round(price * 100) / 100,
    macaulayDuration: Math.round(macaulayDuration * 100) / 100,
    modifiedDuration: Math.round(modifiedDuration * 100) / 100,
    estimatedPriceChangePer100Bps: Math.round(-modifiedDuration * 100) / 100
  };
}

// 3. Discounted Cash Flow (DCF) & Enterprise Valuation
export function calculateDCF(fcf0, growthRate, years, wacc, terminalGrowthRate, sharesOutstanding = 1, netDebt = 0) {
  const g = growthRate / 100;
  const r = wacc / 100;
  const gTerm = terminalGrowthRate / 100;

  if (r <= gTerm) {
    throw new Error('WACC must be strictly greater than terminal growth rate for Gordon Growth model.');
  }

  if (sharesOutstanding <= 0) {
    throw new Error('Shares outstanding must be positive for per-share valuation.');
  }

  const safeYears = Math.max(1, Math.round(years));
  const projectedFCFs = [];
  let pvDiscreteSum = 0;
  let currentFCF = fcf0;

  for (let i = 1; i <= safeYears; i++) {
    currentFCF = currentFCF * (1 + g);
    const discountFactor = Math.pow(1 + r, i);
    const pv = currentFCF / discountFactor;
    pvDiscreteSum += pv;
    projectedFCFs.push({
      year: i,
      fcf: Math.round(currentFCF * 100) / 100,
      pv: Math.round(pv * 100) / 100
    });
  }

  // Terminal value: TV = FCF_(n+1) / (WACC - g_term)
  const finalFCF = projectedFCFs[projectedFCFs.length - 1].fcf;
  const fcfNext = finalFCF * (1 + gTerm);
  const terminalValue = fcfNext / (r - gTerm);
  const pvTerminalValue = terminalValue / Math.pow(1 + r, safeYears);

  const enterpriseValue = pvDiscreteSum + pvTerminalValue;
  const equityValue = enterpriseValue - netDebt;
  const sharePrice = sharesOutstanding > 0 ? equityValue / sharesOutstanding : 0;
  const terminalValuePct = enterpriseValue > 0 ? Math.round((pvTerminalValue / enterpriseValue) * 1000) / 10 : 0;

  return {
    enterpriseValue: Math.round(enterpriseValue * 100) / 100,
    equityValue: Math.round(equityValue * 100) / 100,
    sharePrice: Math.round(sharePrice * 100) / 100,
    pvDiscreteSum: Math.round(pvDiscreteSum * 100) / 100,
    pvTerminalValue: Math.round(pvTerminalValue * 100) / 100,
    terminalValuePct,
    projectedFCFs
  };
}

// 4. Black-Scholes Formula & Options Payoff
function normalCDF(x) {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * absX);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return 0.5 * (1.0 + sign * erf);
}

function normalPDF(x) {
  return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

export function blackScholes(spot, strike, timeToExpiryYears, riskFreeRate, volatility) {
  const S = Math.max(0.0001, spot);
  const K = Math.max(0.0001, strike);
  const T = Math.max(0.0001, timeToExpiryYears);
  const r = riskFreeRate / 100;
  const v = Math.max(0.0001, volatility / 100);

  const d1 = (Math.log(S / K) + (r + (v * v) / 2) * T) / (v * Math.sqrt(T));
  const d2 = d1 - v * Math.sqrt(T);

  const Nd1 = normalCDF(d1);
  const Nd2 = normalCDF(d2);
  const N_neg_d1 = normalCDF(-d1);
  const N_neg_d2 = normalCDF(-d2);

  const callPrice = S * Nd1 - K * Math.exp(-r * T) * Nd2;
  const putPrice = K * Math.exp(-r * T) * N_neg_d2 - S * N_neg_d1;

  // Greeks
  const deltaCall = Nd1;
  const deltaPut = Nd1 - 1;
  const gamma = normalPDF(d1) / (S * v * Math.sqrt(T));
  const thetaCall = (- (S * normalPDF(d1) * v) / (2 * Math.sqrt(T)) - r * K * Math.exp(-r * T) * Nd2) / 365;
  const thetaPut = (- (S * normalPDF(d1) * v) / (2 * Math.sqrt(T)) + r * K * Math.exp(-r * T) * N_neg_d2) / 365;
  const vega = (S * Math.sqrt(T) * normalPDF(d1)) / 100;

  return {
    callPrice: Math.round(callPrice * 100) / 100,
    putPrice: Math.round(putPrice * 100) / 100,
    deltaCall: Math.round(deltaCall * 1000) / 1000,
    deltaPut: Math.round(deltaPut * 1000) / 1000,
    gamma: Math.round(gamma * 10000) / 10000,
    thetaCall: Math.round(thetaCall * 100) / 100,
    thetaPut: Math.round(thetaPut * 100) / 100,
    vega: Math.round(vega * 100) / 100
  };
}

// 5. Modern Portfolio Theory (MPT) - 2-Asset Allocation
export function calculateTwoAssetPortfolio(rA, sA, rB, sB, correlation, weightA) {
  const wA = Math.max(0, Math.min(1, weightA));
  const wB = 1 - wA;
  const rho = Math.max(-1, Math.min(1, correlation));

  const returnP = wA * rA + wB * rB;
  const varianceP = (wA * sA) ** 2 + (wB * sB) ** 2 + 2 * wA * wB * sA * sB * rho;
  const stdevP = Math.sqrt(Math.max(0, varianceP));

  const riskFree = 3.0; // 3% risk-free rate assumption
  const sharpe = stdevP > 0 ? (returnP - riskFree) / stdevP : 0;

  return {
    weightA: Math.round(wA * 100) / 100,
    weightB: Math.round(wB * 100) / 100,
    expectedReturn: Math.round(returnP * 100) / 100,
    volatility: Math.round(stdevP * 100) / 100,
    sharpeRatio: Math.round(sharpe * 100) / 100
  };
}

export function generateEfficientFrontier(rA, sA, rB, sB, correlation, steps = 21) {
  const curve = [];
  for (let i = 0; i <= steps; i++) {
    const wA = i / steps;
    const pt = calculateTwoAssetPortfolio(rA, sA, rB, sB, correlation, wA);
    curve.push(pt);
  }
  return curve;
}
