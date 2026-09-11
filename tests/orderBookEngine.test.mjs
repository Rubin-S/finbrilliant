import test from 'node:test';
import assert from 'node:assert';
import { OrderBook } from '../src/engines/orderBookEngine.js';

test('OrderBook initializes with proper sorting and calculates spread & mid', () => {
  const initialBids = [
    { id: 'b1', price: 99.8, qty: 100 },
    { id: 'b2', price: 99.9, qty: 50 },
    { id: 'b3', price: 99.5, qty: 200 }
  ];
  const initialAsks = [
    { id: 'a1', price: 100.2, qty: 150 },
    { id: 'a2', price: 100.1, qty: 80 },
    { id: 'a3', price: 100.5, qty: 300 }
  ];

  const book = new OrderBook(initialBids, initialAsks);

  // Bids must be sorted descending: 99.9, 99.8, 99.5
  assert.strictEqual(book.getBestBid(), 99.9);
  // Asks must be sorted ascending: 100.1, 100.2, 100.5
  assert.strictEqual(book.getBestAsk(), 100.1);

  // Spread = 100.1 - 99.9 = 0.2
  assert.strictEqual(book.getSpread(), 0.2);
  // Mid price = (100.1 + 99.9) / 2 = 100.0
  assert.strictEqual(book.getMidPrice(), 100.0);
  // Spread bps = (0.2 / 100) * 10000 = 20 bps
  assert.strictEqual(book.getSpreadBps(), 20);
});

test('OrderBook executes market buy order and calculates slippage through book depth', () => {
  const bids = [{ id: 'b1', price: 99.9, qty: 100 }];
  const asks = [
    { id: 'a1', price: 100.1, qty: 50 },
    { id: 'a2', price: 100.3, qty: 50 }
  ];

  const book = new OrderBook(bids, asks);
  const midBefore = book.getMidPrice(); // 100.0

  // Market buy for 80 shares: should consume all 50 @ 100.1 + 30 @ 100.3
  const execution = book.executeMarketOrder('buy', 80);

  assert.strictEqual(execution.totalFilled, 80);
  assert.strictEqual(execution.remainingQty, 0);
  // Cost = 50 * 100.1 + 30 * 100.3 = 5005 + 3009 = 8014. Avg = 8014 / 80 = 100.175 -> 100.18
  assert.strictEqual(execution.avgPrice, 100.18);
  // Benchmark cost at mid (100.0 * 80) = 8000. Slippage = 8014 - 8000 = 14
  assert.strictEqual(execution.slippage, 14);

  // Ask book should now have only remaining 20 shares @ 100.3
  assert.strictEqual(book.getBestAsk(), 100.3);
  assert.strictEqual(book.asks[0].qty, 20);
});

test('OrderBook limit order matches immediately if crossing spread or rests if passive', () => {
  const bids = [{ id: 'b1', price: 99.5, qty: 100 }];
  const asks = [{ id: 'a1', price: 100.5, qty: 100 }];

  const book = new OrderBook(bids, asks);

  // Passive limit order: Buy @ 99.8 for 50 shares
  const passive = book.placeLimitOrder('buy', 99.8, 50);
  assert.strictEqual(passive.filledQty, 0);
  assert.strictEqual(passive.restingQty, 50);
  assert.strictEqual(book.getBestBid(), 99.8); // new best bid!

  // Aggressive limit order: Sell @ 99.7 for 75 shares -> crosses 99.8 (50 shares) and rests 25 @ 99.7
  const agg = book.placeLimitOrder('sell', 99.7, 75);
  assert.strictEqual(agg.filledQty, 50);
  assert.strictEqual(agg.restingQty, 25);
  assert.strictEqual(book.getBestAsk(), 99.7);
  assert.strictEqual(book.getBestBid(), 99.5);
  assert.ok(book.tradeHistory.length > 0, 'Limit order fills must be recorded in trade history');
});

test('OrderBook handles empty book states safely without throwing', () => {
  const emptyBook = new OrderBook([], []);
  assert.strictEqual(emptyBook.getBestBid(), null);
  assert.strictEqual(emptyBook.getBestAsk(), null);
  assert.strictEqual(emptyBook.getSpread(), null);
  assert.strictEqual(emptyBook.getMidPrice(), 100);
  assert.strictEqual(emptyBook.getSpreadBps(), 0);

  // Market order on empty book should fill 0
  const exec = emptyBook.executeMarketOrder('buy', 50);
  assert.strictEqual(exec.totalFilled, 0);
  assert.strictEqual(exec.remainingQty, 50);
});

test('OrderBook reset method re-seeds liquidity', () => {
  const book = new OrderBook([], []);
  assert.strictEqual(book.bids.length, 0);
  book.reset();
  assert.ok(book.bids.length > 0, 'Reset must replenish bids');
  assert.ok(book.asks.length > 0, 'Reset must replenish asks');
  assert.strictEqual(book.tradeHistory.length, 0, 'Reset must clear trade history');
});

