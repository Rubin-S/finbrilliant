/**
 * High-Performance Order Book & Microstructure Simulation Engine
 * Models Level 2 Depth, matching engine logic, slippage, and spread dynamics.
 */

export class OrderBook {
  constructor(initialBids = [], initialAsks = []) {
    // bids: [{ price, qty, id }] sorted descending by price
    this.bids = [...initialBids].sort((a, b) => b.price - a.price);
    // asks: [{ price, qty, id }] sorted ascending by price
    this.asks = [...initialAsks].sort((a, b) => a.price - b.price);
    this.tradeHistory = [];
    this.orderCounter = 1;
  }

  static createDefaultBook(mid = 100.00, spread = 0.05, depthLevels = 6) {
    const bids = [];
    const asks = [];
    const halfSpread = spread / 2;

    for (let i = 0; i < depthLevels; i++) {
      const bidPrice = Math.round((mid - halfSpread - i * 0.05) * 100) / 100;
      const askPrice = Math.round((mid + halfSpread + i * 0.05) * 100) / 100;
      const baseQty = 100 + i * 50 + Math.floor(Math.random() * 40);

      bids.push({ id: `bid-${i}`, price: bidPrice, qty: baseQty });
      asks.push({ id: `ask-${i}`, price: askPrice, qty: baseQty });
    }

    return new OrderBook(bids, asks);
  }

  getBestBid() {
    return this.bids.length > 0 ? this.bids[0].price : null;
  }

  getBestAsk() {
    return this.asks.length > 0 ? this.asks[0].price : null;
  }

  getSpread() {
    const bestBid = this.getBestBid();
    const bestAsk = this.getBestAsk();
    if (bestBid === null || bestAsk === null) return null;
    return Math.round((bestAsk - bestBid) * 100) / 100;
  }

  getMidPrice() {
    const bestBid = this.getBestBid();
    const bestAsk = this.getBestAsk();
    if (bestBid === null && bestAsk === null) return 100;
    if (bestBid === null) return bestAsk;
    if (bestAsk === null) return bestBid;
    return Math.round(((bestBid + bestAsk) / 2) * 100) / 100;
  }

  getSpreadBps() {
    const spread = this.getSpread();
    const mid = this.getMidPrice();
    if (!spread || !mid) return 0;
    return Math.round((spread / mid) * 10000);
  }

  getCumulativeDepth() {
    let cumBid = 0;
    const bidDepth = this.bids.map(b => {
      cumBid += b.qty;
      return { price: b.price, qty: b.qty, cumQty: cumBid };
    });

    let cumAsk = 0;
    const askDepth = this.asks.map(a => {
      cumAsk += a.qty;
      return { price: a.price, qty: a.qty, cumQty: cumAsk };
    });

    return { bidDepth, askDepth, maxDepth: Math.max(cumBid, cumAsk, 1) };
  }

  reset(mid = 100.00, spread = 0.05, depthLevels = 6) {
    const defaultBook = OrderBook.createDefaultBook(mid, spread, depthLevels);
    this.bids = defaultBook.bids;
    this.asks = defaultBook.asks;
    this.tradeHistory = [];
    return this;
  }

  // Execute Market Order
  executeMarketOrder(side, rawQty) {
    const qty = Math.floor(Number(rawQty));
    if (!Number.isFinite(qty) || qty <= 0) {
      return { type: 'market', side, qtyRequested: 0, totalFilled: 0, avgPrice: 0, remainingQty: 0, slippage: 0, fills: [] };
    }

    const targetBook = side === 'buy' ? this.asks : this.bids;
    const initialMid = this.getMidPrice() || 100.0;
    let remaining = qty;
    const fills = [];
    let totalSpent = 0;

    while (remaining > 0 && targetBook.length > 0) {
      const bestLevel = targetBook[0];
      const matchQty = Math.min(remaining, bestLevel.qty);
      const matchPrice = bestLevel.price;

      fills.push({ price: matchPrice, qty: matchQty });
      totalSpent += matchPrice * matchQty;
      remaining -= matchQty;
      bestLevel.qty -= matchQty;

      if (bestLevel.qty === 0) {
        targetBook.shift(); // remove empty level
      }
    }

    const totalFilled = qty - remaining;
    const avgPrice = totalFilled > 0 ? Math.round((totalSpent / totalFilled) * 100) / 100 : 0;
    const expectedCostAtMid = totalFilled * initialMid;
    const actualCost = totalSpent;
    const slippage = side === 'buy' 
      ? Math.round((actualCost - expectedCostAtMid) * 100) / 100
      : Math.round((expectedCostAtMid - actualCost) * 100) / 100;

    const executionRecord = {
      timestamp: Date.now(),
      type: 'market',
      side,
      qtyRequested: qty,
      totalFilled,
      avgPrice,
      remainingQty: remaining,
      slippage,
      fills
    };

    if (totalFilled > 0) {
      this.tradeHistory.unshift(executionRecord);
    }
    return executionRecord;
  }

  // Place Limit Order
  placeLimitOrder(side, rawPrice, rawQty) {
    const price = Math.round(Number(rawPrice) * 100) / 100;
    const qty = Math.floor(Number(rawQty));

    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(qty) || qty <= 0) {
      return { type: 'limit', side, price: 0, qtyRequested: 0, totalFilled: 0, filledQty: 0, restingQty: 0, remainingQty: 0, avgPrice: 0, fills: [] };
    }

    let remaining = qty;
    const fills = [];
    let totalSpent = 0;

    if (side === 'buy') {
      // Crosses spread if price >= best ask
      while (remaining > 0 && this.asks.length > 0 && price >= this.asks[0].price) {
        const bestAsk = this.asks[0];
        const matchQty = Math.min(remaining, bestAsk.qty);
        fills.push({ price: bestAsk.price, qty: matchQty });
        totalSpent += bestAsk.price * matchQty;
        remaining -= matchQty;
        bestAsk.qty -= matchQty;
        if (bestAsk.qty === 0) this.asks.shift();
      }

      // Rest on bid book if remaining
      if (remaining > 0) {
        const existing = this.bids.find(b => b.price === price);
        if (existing) {
          existing.qty += remaining;
        } else {
          this.bids.push({ id: `bid-${++this.orderCounter}`, price, qty: remaining });
          this.bids.sort((a, b) => b.price - a.price);
        }
      }
    } else {
      // Sell limit order: crosses spread if price <= best bid
      while (remaining > 0 && this.bids.length > 0 && price <= this.bids[0].price) {
        const bestBid = this.bids[0];
        const matchQty = Math.min(remaining, bestBid.qty);
        fills.push({ price: bestBid.price, qty: matchQty });
        totalSpent += bestBid.price * matchQty;
        remaining -= matchQty;
        bestBid.qty -= matchQty;
        if (bestBid.qty === 0) this.bids.shift();
      }

      // Rest on ask book if remaining
      if (remaining > 0) {
        const existing = this.asks.find(a => a.price === price);
        if (existing) {
          existing.qty += remaining;
        } else {
          this.asks.push({ id: `ask-${++this.orderCounter}`, price, qty: remaining });
          this.asks.sort((a, b) => a.price - b.price);
        }
      }
    }

    const filledQty = qty - remaining;
    const avgPrice = filledQty > 0 ? Math.round((totalSpent / filledQty) * 100) / 100 : 0;

    const record = {
      timestamp: Date.now(),
      type: 'limit',
      side,
      price,
      qtyRequested: qty,
      totalFilled: filledQty,
      filledQty,
      restingQty: remaining,
      remainingQty: remaining,
      avgPrice,
      fills
    };

    if (filledQty > 0) {
      this.tradeHistory.unshift(record);
    }

    return record;
  }
}
