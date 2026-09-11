import test from 'node:test';
import assert from 'node:assert';
import { StorageManager, getTierForXP } from '../src/storage.js';

class MockStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, val) {
    this.store[key] = String(val);
  }
}

test('getTierForXP properly resolves ranks and progress percentages', () => {
  const tier0 = getTierForXP(50);
  assert.strictEqual(tier0.rank, 1);
  assert.strictEqual(tier0.title, 'Retail Inquirer');
  assert.ok(tier0.progressPct > 0);

  const tier3 = getTierForXP(1000);
  assert.strictEqual(tier3.rank, 3);
  assert.strictEqual(tier3.title, 'Market Analyst');

  const maxTier = getTierForXP(10000);
  assert.strictEqual(maxTier.rank, 7);
  assert.strictEqual(maxTier.title, 'Quantitative Strategist');
});

test('StorageManager correctly records lesson completion and increments XP & goals', () => {
  const mockStorage = new MockStorage();
  const manager = new StorageManager(mockStorage);

  const initialProfile = manager.loadProfile();
  const initialXP = initialProfile.xp;

  const updated = manager.recordLessonComplete('orderbook-101', 80);
  assert.ok(updated.completedLessons.includes('orderbook-101'));
  assert.strictEqual(updated.xp, initialXP + 80);
  assert.strictEqual(updated.weeklyGoal.completedThisWeek, initialProfile.weeklyGoal.completedThisWeek + 1);

  // Re-completing the same lesson shouldn't duplicate in completedLessons array
  const updatedAgain = manager.recordLessonComplete('orderbook-101', 80);
  const count = updatedAgain.completedLessons.filter(id => id === 'orderbook-101').length;
  assert.strictEqual(count, 1);
});
test('StorageManager records grill scores and updates high scores', () => {
  const mockStorage = new MockStorage();
  const manager = new StorageManager(mockStorage);

  const profile = manager.saveGrillScore(850, 9, true);
  assert.strictEqual(profile.grillStats.highScore, 850);
  assert.strictEqual(profile.grillStats.bestStreak, 9);
  assert.strictEqual(profile.grillStats.passedInterviews, 2); // default was 1
});

test('StorageManager deep merges defaults when loaded with partial or old profiles', () => {
  const mockStorage = new MockStorage();
  // Simulate legacy/partial storage with missing nested fields
  mockStorage.setItem('finbrilliant_user_profile_v1', JSON.stringify({
    xp: 500,
    weeklyGoal: { targetLessons: 7 }, // missing completedThisWeek
    grillStats: { highScore: 900 } // missing totalAttempts, bestStreak, passedInterviews
  }));

  const manager = new StorageManager(mockStorage);
  const loaded = manager.loadProfile();

  assert.strictEqual(loaded.xp, 500);
  assert.strictEqual(loaded.weeklyGoal.targetLessons, 7);
  assert.strictEqual(loaded.weeklyGoal.completedThisWeek, 2, 'Default completedThisWeek should be preserved');
  assert.strictEqual(loaded.grillStats.highScore, 900);
  assert.strictEqual(loaded.grillStats.totalAttempts, 3, 'Default totalAttempts should be preserved');
  assert.strictEqual(loaded.grillStats.bestStreak, 6, 'Default bestStreak should be preserved');
  assert.ok(Array.isArray(loaded.boostsCompleted), 'boostsCompleted array should be preserved');
});

test('StorageManager recordBoostComplete records boost, prevents duplicates, and increments XP', () => {
  const mockStorage = new MockStorage();
  const manager = new StorageManager(mockStorage);

  const initial = manager.loadProfile();
  const initialXP = initial.xp;

  const updated = manager.recordBoostComplete('boost-1', 100);
  assert.ok(updated.boostsCompleted.includes('boost-1'));
  assert.strictEqual(updated.xp, initialXP + 100);

  // Calling again with same boost shouldn't duplicate the ID in boostsCompleted
  const again = manager.recordBoostComplete('boost-1', 100);
  const occurrences = again.boostsCompleted.filter(id => id === 'boost-1').length;
  assert.strictEqual(occurrences, 1);
});

