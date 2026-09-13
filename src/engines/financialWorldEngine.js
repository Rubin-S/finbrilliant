/**
 * Financial World Simulation Engine
 * A Stock-Flow Consistent (SFC) Macroeconomic & Multi-Sector Financial Model
 * 
 * Sectors modeled:
 * 1. Central Bank (monetary policy rate, reserves, quantitative easing/tightening)
 * 2. Commercial Banks (endogenous deposit/credit creation, capital adequacy, NIM)
 * 3. Non-Financial Corporations (operating cash flow, DCF valuation, debt & equity)
 * 4. Households (labor income, consumption, savings, mortgage debt, wealth effect)
 * 5. Government (fiscal budget, taxation, public spending, Treasury debt issuance)
 * 6. Financial Markets (yield curve term structure, credit spreads, order book clearing)
 * 
 * Invariants:
 * - Stock-Flow Consistency: Every financial asset is another sector's liability.
 * - Systemic Conservation: Sum of all Net Financial Assets equals zero.
 */

import { calculateBondPrice, calculateDCF } from './financeMath.js';

export class FinancialWorldEngine {
  constructor(initialConfig = {}) {
    this.listeners = new Set();
    this.clock = 0;
    this.isPlaying = false;
    this.playbackSpeed = 1.0;
    this.timerId = null;

    this.resetToDefaults(initialConfig);
  }

  resetToDefaults(config = {}) {
    this.clock = 0;

    // Macroeconomic indicators
    this.macro = {
      gdp: 4320.0,
      potentialGdp: 4300.0,
      outputGap: 0.46, // (gdp - potential) / potential * 100
      inflationRate: 2.10,
      targetInflation: 2.00,
      unemploymentRate: 4.10,
      naturalUnemployment: 4.00,
      productivityGrowth: 1.80
    };

    // 1. Central Bank
    this.centralBank = {
      policyRate: config.policyRate ?? 4.00,
      taylorRuleActive: config.taylorRuleActive ?? false,
      qeActive: config.qeActive ?? false,
      neutralRate: 2.50,
      targetInflation: 2.00,
      reserves: 3200.0,
      treasuriesHeld: 4800.0,
      repoClaims: 200.0,
      currencyInCirculation: 1800.0
    };

    // 2. Commercial Banks
    this.commercialBanks = {
      reserves: 3200.0,
      corporateLoans: 4500.0,
      mortgageLoans: 5200.0,
      treasuriesHeld: 2100.0,
      customerDeposits: 13400.0,
      interbankBorrowing: 200.0,
      equity: 1400.0,
      reserveRequirementRatio: 0.10,
      capitalAdequacyRatio: 0.144, // Equity / (Risk Weighted Assets)
      netInterestMargin: 2.15,
      loanDefaultRate: 0.012
    };

    // 3. Non-Financial Corporations
    this.corporations = {
      capitalStock: 11500.0,
      inventory: 1200.0,
      cashDeposits: 2400.0,
      bankLoans: 4500.0,
      corporateBonds: 3200.0,
      bookEquity: 7400.0,
      sharePrice: 68.50,
      sharesOutstanding: 100.0,
      marketCap: 6850.0,
      revenue: 4500.0,
      wagesPaid: 2800.0,
      operatingCosts: 700.0,
      interestExpense: 280.0,
      corporateTax: 114.0,
      freeCashFlow: 577.0,
      wacc: 8.20,
      enterpriseValue: 10050.0
    };

    // 4. Households
    this.households = {
      bankDeposits: 11000.0,
      treasuriesHeld: 1200.0,
      equitiesHeld: 6850.0,
      housingWealth: 9500.0,
      mortgageDebt: 5200.0,
      netWorth: 23350.0,
      wageIncome: 2800.0,
      disposableIncome: 2184.0,
      consumptionSpending: 2750.0,
      savings: 80.0,
      marginalPropensityToConsume: 0.72,
      wealthEffectAlpha: 0.03
    };

    // 5. Government
    this.government = {
      taxRate: config.taxRate ?? 0.22,
      taxRevenue: 680.0,
      expenditures: 780.0,
      interestOnDebt: 210.0,
      budgetDeficit: 310.0,
      treasuryDebtStock: 8100.0,
      debtToGdp: 187.5
    };

    // 6. Financial Markets
    this.financialMarkets = {
      yield10Y: 4.25,
      creditSpreadBps: config.creditSpreadBps ?? 180,
      bondPrice10Y: 98.02,
      orderBook: {
        bids: [
          { price: 68.45, size: 500 },
          { price: 68.40, size: 850 },
          { price: 68.35, size: 1200 },
          { price: 68.30, size: 2100 }
        ],
        asks: [
          { price: 68.55, size: 600 },
          { price: 68.60, size: 900 },
          { price: 68.65, size: 1400 },
          { price: 68.70, size: 1800 }
        ],
        clearingPrice: 68.50,
        volume24h: 34500
      },
      yieldCurve: this.calculateYieldCurve(this.centralBank.policyRate)
    };

    this.recomputeAll();
  }

  // Nelson-Siegel style term structure calculation
  calculateYieldCurve(policyRate) {
    const base = Math.max(0.1, policyRate);
    const beta1 = 0.25;
    const beta2 = 0.45;
    
    return [
      { tenor: '3M', yield: Math.round((base + 0.10) * 100) / 100 },
      { tenor: '2Y', yield: Math.round((base + beta1 * 0.5) * 100) / 100 },
      { tenor: '5Y', yield: Math.round((base + beta1 * 1.0 + beta2 * 0.3) * 100) / 100 },
      { tenor: '10Y', yield: Math.round((base + 0.25 + (this.centralBank.qeActive ? -0.40 : 0.0)) * 100) / 100 },
      { tenor: '30Y', yield: Math.round((base + 0.55 + (this.centralBank.qeActive ? -0.30 : 0.0)) * 100) / 100 }
    ];
  }

  // Stock-Flow Consistency Audit
  getSystemConservationAudit() {
    // Net Financial Assets per sector
    // 1. Central Bank: Assets(Treasuries + Repo) - Liabilities(Reserves + Currency)
    const cbNFA = (this.centralBank.treasuriesHeld + this.centralBank.repoClaims) - 
                  (this.centralBank.reserves + this.centralBank.currencyInCirculation);

    // 2. Commercial Banks: Assets(Reserves + CorpLoans + Mortgages + Treasuries) - Liabilities(Deposits + Interbank + Equity)
    const bnkNFA = (this.commercialBanks.reserves + this.commercialBanks.corporateLoans + 
                    this.commercialBanks.mortgageLoans + this.commercialBanks.treasuriesHeld) -
                   (this.commercialBanks.customerDeposits + this.commercialBanks.interbankBorrowing + this.commercialBanks.equity);

    // 3. Corporations: Assets(CashDeposits) - Liabilities(BankLoans + CorporateBonds + BookEquity)
    const corpNFA = this.corporations.cashDeposits - 
                    (this.corporations.bankLoans + this.corporations.corporateBonds + this.corporations.bookEquity);

    // 4. Households: Assets(Deposits + Treasuries + Equities) - Liabilities(MortgageDebt + NetFinancialWorth)
    const hhNFA = (this.households.bankDeposits + this.households.treasuriesHeld + this.households.equitiesHeld) -
                  (this.households.mortgageDebt + (this.households.netWorth - this.households.housingWealth));

    // 5. Government: Assets(0) - Liabilities(TreasuryDebtStock)
    const govNFA = 0 - this.government.treasuryDebtStock;

    // Total Treasuries Check: Gov Debt = CB held + Banks held + Households held
    const treasuriesHeldTotal = this.centralBank.treasuriesHeld + 
                                this.commercialBanks.treasuriesHeld + 
                                this.households.treasuriesHeld;
    const treasuryBalanceDiscrepancy = this.government.treasuryDebtStock - treasuriesHeldTotal;

    // Total Deposits Check: Customer Deposits = Corp Cash + Household Deposits
    const depositsTotal = this.corporations.cashDeposits + this.households.bankDeposits;
    const depositDiscrepancy = this.commercialBanks.customerDeposits - depositsTotal;

    // Sum of net financial claims
    const netDiscrepancy = Math.abs(cbNFA) + Math.abs(bnkNFA) + Math.abs(treasuryBalanceDiscrepancy) + Math.abs(depositDiscrepancy);

    return {
      isConsistent: netDiscrepancy < 1e-4,
      netDiscrepancy: Math.round(netDiscrepancy * 10000) / 10000,
      cbNFA: Math.round(cbNFA * 100) / 100,
      bnkNFA: Math.round(bnkNFA * 100) / 100,
      treasuryDiscrepancy: Math.round(treasuryBalanceDiscrepancy * 100) / 100,
      depositDiscrepancy: Math.round(depositDiscrepancy * 100) / 100
    };
  }

  // Recomputes all equilibrium equations based on current state variables
  recomputeAll() {
    // 1. Taylor Rule reaction function
    if (this.centralBank.taylorRuleActive) {
      const rNeutral = this.centralBank.neutralRate;
      const piGap = this.macro.inflationRate - this.centralBank.targetInflation;
      const yGap = this.macro.outputGap;
      const taylorRate = rNeutral + this.macro.inflationRate + 0.5 * piGap + 0.5 * yGap;
      this.centralBank.policyRate = Math.max(0.1, Math.min(15.0, Math.round(taylorRate * 100) / 100));
    }

    // 2. Financial Markets yield curve & bond pricing
    const policyRate = this.centralBank.policyRate;
    this.financialMarkets.yieldCurve = this.calculateYieldCurve(policyRate);
    const tenYearObj = this.financialMarkets.yieldCurve.find(y => y.tenor === '10Y') || { yield: policyRate + 0.25 };
    this.financialMarkets.yield10Y = tenYearObj.yield;

    // 10Y Bond Price recomputation (100 face value, 4.0% coupon, market yield)
    const bondCalc = calculateBondPrice(100, 4.0, this.financialMarkets.yield10Y, 10, 2);
    this.financialMarkets.bondPrice10Y = Math.round(bondCalc.price * 100) / 100;

    // 3. Bank lending and borrowing rates
    const primeLendingRate = policyRate + (this.financialMarkets.creditSpreadBps / 100);
    const depositRate = Math.max(0.05, policyRate - 1.85);
    this.commercialBanks.netInterestMargin = Math.round((primeLendingRate - depositRate) * 100) / 100;

    // 4. Corporate Finance & DCF Valuation
    const costOfDebt = primeLendingRate * (1 - this.government.taxRate);
    const riskFreeRate = this.financialMarkets.yield10Y;
    const equityRiskPremium = 5.0;
    const costOfEquity = riskFreeRate + equityRiskPremium;
    const debtWeight = 0.40;
    const equityWeight = 0.60;
    const wacc = (costOfEquity * equityWeight) + (costOfDebt * debtWeight);
    this.corporations.wacc = Math.round(wacc * 100) / 100;

    // Free Cash Flow sensitivity to interest expense
    this.corporations.interestExpense = Math.round((this.corporations.bankLoans + this.corporations.corporateBonds) * (costOfDebt / 100));
    const ebitda = this.corporations.revenue - this.corporations.wagesPaid - this.corporations.operatingCosts;
    const ebt = Math.max(10, ebitda - this.corporations.interestExpense);
    this.corporations.corporateTax = Math.round(ebt * this.government.taxRate);
    const nopat = ebt - this.corporations.corporateTax;
    this.corporations.freeCashFlow = Math.round((nopat + 60 - 45) * 100) / 100; // NOPAT + D&A - CapEx

    // DCF Share valuation
    const safeWacc = Math.max(3.5, this.corporations.wacc);
    let enterpriseVal = 10050.0;
    try {
      const dcfResult = calculateDCF(this.corporations.freeCashFlow, 3.0, 5, safeWacc, 2.0, this.corporations.sharesOutstanding, 0);
      enterpriseVal = dcfResult.enterpriseValue;
    } catch (e) {
      const gTerm = 0.02;
      const r = Math.max(gTerm + 0.01, safeWacc / 100);
      enterpriseVal = this.corporations.freeCashFlow * (1 + gTerm) / (r - gTerm);
    }
    this.corporations.enterpriseValue = Math.max(1000, Math.round(enterpriseVal * 100) / 100);
    const netDebt = (this.corporations.bankLoans + this.corporations.corporateBonds) - this.corporations.cashDeposits;
    const equityValue = Math.max(500, this.corporations.enterpriseValue - netDebt);
    this.corporations.marketCap = Math.round(equityValue * 100) / 100;
    this.corporations.sharePrice = Math.round((equityValue / this.corporations.sharesOutstanding) * 100) / 100;
    this.households.equitiesHeld = this.corporations.marketCap;

    // Order book clearing price alignment
    this.financialMarkets.orderBook.clearingPrice = this.corporations.sharePrice;

    // 5. Households income & consumption
    const totalWageIncome = this.corporations.wagesPaid;
    this.households.wageIncome = totalWageIncome;
    const personalIncomeTax = Math.round(totalWageIncome * this.government.taxRate);
    this.households.disposableIncome = totalWageIncome - personalIncomeTax;
    
    // Wealth effect: asset value changes impact consumption
    this.households.netWorth = this.households.bankDeposits + this.households.treasuriesHeld + 
                               this.households.equitiesHeld + this.households.housingWealth - 
                               this.households.mortgageDebt;
    const wealthBoost = (this.households.netWorth - 23350) * this.households.wealthEffectAlpha;
    const baselineConsumption = 1200 + (this.households.disposableIncome * this.households.marginalPropensityToConsume) + wealthBoost;
    this.households.consumptionSpending = Math.max(300, Math.round(baselineConsumption * 100) / 100);
    this.households.savings = Math.round((this.households.disposableIncome - this.households.consumptionSpending) * 100) / 100;

    // 6. Government fiscal accounts
    this.government.taxRevenue = personalIncomeTax + this.corporations.corporateTax;
    this.government.interestOnDebt = Math.round(this.government.treasuryDebtStock * (this.financialMarkets.yield10Y / 100) * 0.45); // blended historical yield
    this.government.budgetDeficit = Math.round((this.government.expenditures + this.government.interestOnDebt - this.government.taxRevenue) * 100) / 100;

    // 7. GDP & Macro aggregates
    const corporateInvestment = 640 + (this.corporations.freeCashFlow * 0.2);
    this.macro.gdp = Math.round((this.households.consumptionSpending + corporateInvestment + this.government.expenditures) * 100) / 100;
    this.macro.outputGap = Math.round(((this.macro.gdp - this.macro.potentialGdp) / this.macro.potentialGdp) * 100 * 100) / 100;

    // Unemployment Okun's law
    const unempDelta = -0.4 * this.macro.outputGap;
    this.macro.unemploymentRate = Math.max(2.5, Math.min(15.0, Math.round((this.macro.naturalUnemployment + unempDelta) * 100) / 100));
    this.government.debtToGdp = Math.round((this.government.treasuryDebtStock / this.macro.gdp) * 100 * 10) / 10;

    this.notify();
  }

  // Advances simulation by 1 tick (1 quarter)
  step(dt = 1) {
    this.clock += dt;

    // Accumulate flows into balance sheet stocks under exact conservation
    if (this.government.budgetDeficit > 0) {
      const deficitFlow = this.government.budgetDeficit * 0.05 * dt;
      this.government.treasuryDebtStock += deficitFlow;

      if (this.centralBank.qeActive) {
        const cbPurchase = deficitFlow * 0.60;
        const bnkPurchase = deficitFlow * 0.25;
        const hhPurchase = deficitFlow * 0.15;

        this.centralBank.treasuriesHeld += cbPurchase;
        this.centralBank.reserves += cbPurchase;
        this.commercialBanks.reserves += cbPurchase;
        this.commercialBanks.treasuriesHeld += bnkPurchase;
        this.households.treasuriesHeld += hhPurchase;

        const depositInflow = cbPurchase + bnkPurchase;
        this.commercialBanks.customerDeposits += depositInflow;
        this.corporations.cashDeposits += depositInflow;
      } else {
        const bnkPurchase = deficitFlow * 0.65;
        const hhPurchase = deficitFlow * 0.35;

        this.commercialBanks.treasuriesHeld += bnkPurchase;
        this.households.treasuriesHeld += hhPurchase;

        this.commercialBanks.customerDeposits += bnkPurchase;
        this.corporations.cashDeposits += bnkPurchase;
      }
    }

    // Dynamic Phillips curve evolution on tick
    const inflDelta = (this.macro.outputGap * 0.15) - ((this.centralBank.policyRate - 4.0) * 0.20);
    this.macro.inflationRate = Math.max(0.1, Math.min(18.0, Math.round((this.macro.inflationRate + inflDelta * 0.05 * dt) * 100) / 100));

    this.recomputeAll();
  }

  // Interactive Policy Controls
  setPolicyRate(rate) {
    this.centralBank.policyRate = Math.max(0.0, Math.min(18.0, parseFloat(rate)));
    this.recomputeAll();
  }

  setCorporateTaxRate(rate) {
    this.government.taxRate = Math.max(0.05, Math.min(0.50, parseFloat(rate)));
    this.recomputeAll();
  }

  setCreditSpreadBps(bps) {
    this.financialMarkets.creditSpreadBps = Math.max(20, Math.min(1500, parseInt(bps, 10)));
    this.recomputeAll();
  }

  setReserveRequirement(ratio) {
    this.commercialBanks.reserveRequirementRatio = Math.max(0.0, Math.min(0.30, parseFloat(ratio)));
    this.recomputeAll();
  }

  toggleTaylorRule(active = null) {
    this.centralBank.taylorRuleActive = active !== null ? Boolean(active) : !this.centralBank.taylorRuleActive;
    this.recomputeAll();
  }

  toggleQE(active = null) {
    this.centralBank.qeActive = active !== null ? Boolean(active) : !this.centralBank.qeActive;
    if (this.centralBank.qeActive) {
      // Balance sheet expansion: Buy Treasuries, expand reserves
      const qeAmount = 600.0;
      this.centralBank.treasuriesHeld += qeAmount;
      this.centralBank.reserves += qeAmount;
      this.commercialBanks.reserves += qeAmount;
      this.commercialBanks.treasuriesHeld -= qeAmount;
    } else {
      // Quantitative Tightening: Roll off Treasuries
      const qtAmount = 400.0;
      this.centralBank.treasuriesHeld = Math.max(1000, this.centralBank.treasuriesHeld - qtAmount);
      this.centralBank.reserves = Math.max(500, this.centralBank.reserves - qtAmount);
      this.commercialBanks.reserves = Math.max(500, this.commercialBanks.reserves - qtAmount);
      this.commercialBanks.treasuriesHeld += qtAmount;
    }
    this.recomputeAll();
  }

  // Historical Crisis Scenarios
  loadScenario(scenarioId) {
    switch (scenarioId) {
      case 'gfc_2008':
        // 2008 Global Financial Crisis: Credit crunch, spiking spreads, zero rates, QE
        this.resetToDefaults({
          policyRate: 0.25,
          creditSpreadBps: 580,
          qeActive: true,
          taylorRuleActive: false
        });
        this.macro.outputGap = -4.5;
        this.macro.unemploymentRate = 9.8;
        this.macro.inflationRate = 0.5;
        this.commercialBanks.corporateLoans -= 600;
        this.corporations.revenue -= 500;
        break;

      case 'volcker_1979':
        // 1979 Volcker Rate Shock: Severe inflation, policy rate to 16%, inverted curve
        this.resetToDefaults({
          policyRate: 15.50,
          creditSpreadBps: 350,
          qeActive: false,
          taylorRuleActive: false
        });
        this.macro.inflationRate = 12.8;
        this.macro.outputGap = -2.8;
        this.macro.unemploymentRate = 8.5;
        break;

      case 'covid_2020':
        // 2020 Liquidity Injection: Zero rates, massive QE, high fiscal deficit
        this.resetToDefaults({
          policyRate: 0.25,
          creditSpreadBps: 280,
          qeActive: true,
          taylorRuleActive: false,
          taxRate: 0.18
        });
        this.government.expenditures += 400;
        this.macro.inflationRate = 1.2;
        break;

      case 'soft_landing':
        // Modern Soft Landing: Taylor rule active, inflation 2.1%, healthy employment
        this.resetToDefaults({
          policyRate: 4.25,
          creditSpreadBps: 120,
          qeActive: false,
          taylorRuleActive: true
        });
        this.macro.inflationRate = 2.1;
        this.macro.outputGap = 0.1;
        this.macro.unemploymentRate = 3.9;
        break;

      case 'baseline':
      default:
        this.resetToDefaults();
        break;
    }

    this.recomputeAll();
  }

  // Simulation play loop
  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    const intervalMs = Math.round(1000 / this.playbackSpeed);
    this.timerId = setInterval(() => {
      this.step(1);
    }, intervalMs);
    this.notify();
  }

  pause() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.notify();
  }

  setPlaybackSpeed(speed) {
    this.playbackSpeed = Math.max(0.25, Math.min(5.0, speed));
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  // Sector T-Account Inspection Data
  getSectorTAccount(sectorKey) {
    switch (sectorKey) {
      case 'centralBank':
        return {
          title: 'Central Bank',
          assets: [
            { label: 'U.S. Treasury Securities', value: this.centralBank.treasuriesHeld },
            { label: 'Liquidity Facilities & Repo Claims', value: this.centralBank.repoClaims }
          ],
          liabilities: [
            { label: 'Commercial Bank Reserve Balances', value: this.centralBank.reserves },
            { label: 'Currency in Circulation', value: this.centralBank.currencyInCirculation }
          ],
          netWorth: 0.0,
          policyRate: this.centralBank.policyRate,
          taylorRule: this.centralBank.taylorRuleActive ? 'Active' : 'Manual',
          qeStatus: this.centralBank.qeActive ? 'Active (Expanding)' : 'Neutral'
        };

      case 'commercialBanks':
        return {
          title: 'Commercial Banking System',
          assets: [
            { label: 'Central Bank Reserves', value: this.commercialBanks.reserves },
            { label: 'Commercial & Industrial Loans', value: this.commercialBanks.corporateLoans },
            { label: 'Residential Mortgages', value: this.commercialBanks.mortgageLoans },
            { label: 'Treasury Securities Held', value: this.commercialBanks.treasuriesHeld }
          ],
          liabilities: [
            { label: 'Customer Transaction Deposits', value: this.commercialBanks.customerDeposits },
            { label: 'Interbank Borrowing / Repo', value: this.commercialBanks.interbankBorrowing },
            { label: 'Bank Equity Capital (Tier 1)', value: this.commercialBanks.equity }
          ],
          netWorth: this.commercialBanks.equity,
          capitalRatio: `${(this.commercialBanks.capitalAdequacyRatio * 100).toFixed(1)}%`,
          nim: `${this.commercialBanks.netInterestMargin.toFixed(2)}%`
        };

      case 'corporations':
        return {
          title: 'Non-Financial Corporations',
          assets: [
            { label: 'Productive Capital Stock', value: this.corporations.capitalStock },
            { label: 'Operating Inventories', value: this.corporations.inventory },
            { label: 'Cash & Short-Term Deposits', value: this.corporations.cashDeposits }
          ],
          liabilities: [
            { label: 'Commercial Bank Loans', value: this.corporations.bankLoans },
            { label: 'Corporate Bond Debt', value: this.corporations.corporateBonds },
            { label: 'Shareholder Equity (Book)', value: this.corporations.bookEquity }
          ],
          netWorth: this.corporations.bookEquity,
          marketCap: this.corporations.marketCap,
          sharePrice: `$${this.corporations.sharePrice.toFixed(2)}`,
          wacc: `${this.corporations.wacc.toFixed(2)}%`,
          fcf: `$${this.corporations.freeCashFlow.toFixed(1)}`
        };

      case 'households':
        return {
          title: 'Household Sector',
          assets: [
            { label: 'Bank Deposits & Savings', value: this.households.bankDeposits },
            { label: 'Treasury Securities', value: this.households.treasuriesHeld },
            { label: 'Corporate Equities Portfolio', value: this.households.equitiesHeld },
            { label: 'Residential Real Estate', value: this.households.housingWealth }
          ],
          liabilities: [
            { label: 'Mortgage Debt Outstanding', value: this.households.mortgageDebt }
          ],
          netWorth: this.households.netWorth,
          disposableIncome: `$${this.households.disposableIncome.toFixed(1)}`,
          consumption: `$${this.households.consumptionSpending.toFixed(1)}`,
          mpc: this.households.marginalPropensityToConsume
        };

      case 'government':
        return {
          title: 'Government / Sovereign Treasury',
          assets: [
            { label: 'Operating Cash & Sovereign Claims', value: 0.0 }
          ],
          liabilities: [
            { label: 'Treasury Debt Outstanding', value: this.government.treasuryDebtStock }
          ],
          netWorth: -this.government.treasuryDebtStock,
          taxRevenue: `$${this.government.taxRevenue.toFixed(1)}`,
          spending: `$${this.government.expenditures.toFixed(1)}`,
          deficit: `$${this.government.budgetDeficit.toFixed(1)}`,
          debtToGdp: `${this.government.debtToGdp.toFixed(1)}%`
        };

      case 'financialMarkets':
      default:
        return {
          title: 'Financial Markets & Yield Curve',
          assets: [
            { label: '10Y Benchmark Sovereign Bond', value: this.financialMarkets.bondPrice10Y },
            { label: 'Aggregate Equity Market Capitalization', value: this.corporations.marketCap }
          ],
          liabilities: [
            { label: 'Market Liquidity Depth Queue', value: this.financialMarkets.orderBook.volume24h }
          ],
          netWorth: 0.0,
          yield10Y: `${this.financialMarkets.yield10Y.toFixed(2)}%`,
          creditSpread: `+${this.financialMarkets.creditSpreadBps} bps`,
          clearingPrice: `$${this.financialMarkets.orderBook.clearingPrice.toFixed(2)}`
        };
    }
  }

  // Inter-sector monetary flow matrix
  getInterSectorFlowMatrix() {
    return [
      { from: 'households', to: 'commercialBanks', flow: 'DEPOSITS / SAVINGS', amount: this.households.savings },
      { from: 'commercialBanks', to: 'households', flow: 'MORTGAGE CREDIT', amount: 85.0 },
      { from: 'households', to: 'corporations', flow: 'CONSUMPTION SPENDING', amount: this.households.consumptionSpending },
      { from: 'corporations', to: 'households', flow: 'LABOR WAGES', amount: this.corporations.wagesPaid },
      { from: 'commercialBanks', to: 'corporations', flow: 'COMMERCIAL LENDING', amount: 120.0 },
      { from: 'corporations', to: 'commercialBanks', flow: 'LOAN REPAYMENT & INTEREST', amount: this.corporations.interestExpense },
      { from: 'corporations', to: 'government', flow: 'CORPORATE TAXES', amount: this.corporations.corporateTax },
      { from: 'government', to: 'corporations', flow: 'PUBLIC PROCUREMENT', amount: 260.0 },
      { from: 'households', to: 'government', flow: 'INCOME TAXES', amount: Math.round(this.households.wageIncome * this.government.taxRate) },
      { from: 'government', to: 'households', flow: 'SOCIAL TRANSFERS', amount: 180.0 },
      { from: 'government', to: 'financialMarkets', flow: 'TREASURY ISSUANCE', amount: this.government.budgetDeficit },
      { from: 'centralBank', to: 'commercialBanks', flow: 'RESERVES / LIQUIDITY', amount: this.centralBank.qeActive ? 350.0 : 45.0 }
    ];
  }

  // Observer pattern
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    for (const cb of this.listeners) {
      try {
        cb(this);
      } catch (err) {
        console.error('FinancialWorldEngine subscriber error:', err);
      }
    }
  }
}

// Singleton global simulator instance
export const financialWorld = new FinancialWorldEngine();
