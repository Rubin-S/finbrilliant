/**
 * Storage & User State Persistence Engine
 * Manages XP, leveling, streaks, completed lessons, goal targets, and sound/theme preferences.
 */

const STORAGE_KEY = 'finbrilliant_user_profile_v1';

export const LEVEL_TIERS = [
  { minXP: 0, title: 'Retail Inquirer', rank: 1, icon: '🌱' },
  { minXP: 300, title: 'Compound Saver', rank: 2, icon: '📈' },
  { minXP: 800, title: 'Market Analyst', rank: 3, icon: '📊' },
  { minXP: 1600, title: 'Derivatives Specialist', rank: 4, icon: '⚡' },
  { minXP: 2600, title: 'Portfolio Architect', rank: 5, icon: '🏛️' },
  { minXP: 4000, title: 'Prop Market Maker', rank: 6, icon: '🦅' },
  { minXP: 6000, title: 'Quantitative Strategist', rank: 7, icon: '🧠' }
];

export function getTierForXP(xp) {
  let currentTier = LEVEL_TIERS[0];
  for (const tier of LEVEL_TIERS) {
    if (xp >= tier.minXP) {
      currentTier = tier;
    } else {
      break;
    }
  }
  const nextTierIndex = LEVEL_TIERS.findIndex(t => t.rank === currentTier.rank) + 1;
  const nextTier = LEVEL_TIERS[nextTierIndex] || null;
  const currentLevelMin = currentTier.minXP;
  const nextLevelMin = nextTier ? nextTier.minXP : currentTier.minXP + 2000;
  const progressPct = Math.min(100, Math.round(((xp - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100));

  return {
    ...currentTier,
    nextTier,
    progressPct
  };
}

export function getDefaultProfile() {
  return {
    xp: 120, // Starter encouragement
    streak: 3,
    lastActiveDate: new Date().toISOString().split('T')[0],
    completedLessons: ['compound-101'], // 1 completed by default to show progress
    completedCards: { 'compound-101': [0, 1, 2, 3] },
    theme: 'dark',
    soundEnabled: true,
    weeklyGoal: {
      targetLessons: 5,
      completedThisWeek: 2
    },
    grillStats: {
      totalAttempts: 3,
      highScore: 420,
      bestStreak: 6,
      passedInterviews: 1
    },
    boostsCompleted: []
  };
}

export class StorageManager {
  constructor(customStorage = null) {
    this.storage = customStorage || (typeof window !== 'undefined' ? window.localStorage : null);
  }

  loadProfile() {
    if (!this.storage) return getDefaultProfile();
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) {
        const defaultProf = getDefaultProfile();
        this.saveProfile(defaultProf);
        return defaultProf;
      }
      const defaultProf = getDefaultProfile();
      const parsed = JSON.parse(raw);
      return {
        ...defaultProf,
        ...parsed,
        weeklyGoal: {
          ...defaultProf.weeklyGoal,
          ...(parsed.weeklyGoal && typeof parsed.weeklyGoal === 'object' ? parsed.weeklyGoal : {})
        },
        grillStats: {
          ...defaultProf.grillStats,
          ...(parsed.grillStats && typeof parsed.grillStats === 'object' ? parsed.grillStats : {})
        },
        boostsCompleted: Array.isArray(parsed.boostsCompleted) ? parsed.boostsCompleted : defaultProf.boostsCompleted,
        completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : defaultProf.completedLessons,
        completedCards: typeof parsed.completedCards === 'object' && parsed.completedCards !== null ? parsed.completedCards : defaultProf.completedCards
      };
    } catch (e) {
      console.warn('Failed to load profile, using fallback:', e);
      return getDefaultProfile();
    }
  }

  saveProfile(profile) {
    if (!this.storage) return;
    try {
      this.storage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile:', e);
    }
  }

  addXP(amount) {
    const profile = this.loadProfile();
    profile.xp += amount;
    this.saveProfile(profile);
    return profile;
  }

  recordLessonComplete(lessonId, xpEarned = 50) {
    const profile = this.loadProfile();
    if (!profile.completedLessons.includes(lessonId)) {
      profile.completedLessons.push(lessonId);
      profile.weeklyGoal.completedThisWeek = (profile.weeklyGoal.completedThisWeek || 0) + 1;
    }
    profile.xp += xpEarned;
    this.updateStreak(profile);
    this.saveProfile(profile);
    return profile;
  }

  updateStreak(profile) {
    const today = new Date().toISOString().split('T')[0];
    const last = profile.lastActiveDate;

    if (last === today) {
      // Already active today
      return profile;
    }

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (last === yesterday) {
      profile.streak += 1;
    } else if (last) {
      // Streak broken, reset to 1
      profile.streak = 1;
    } else {
      profile.streak = 1;
    }

    profile.lastActiveDate = today;
    return profile;
  }

  saveGrillScore(score, streak, passed) {
    const profile = this.loadProfile();
    profile.grillStats.totalAttempts += 1;
    if (score > profile.grillStats.highScore) profile.grillStats.highScore = score;
    if (streak > profile.grillStats.bestStreak) profile.grillStats.bestStreak = streak;
    if (passed) profile.grillStats.passedInterviews += 1;
    profile.xp += Math.round(score / 2);
    this.saveProfile(profile);
    return profile;
  }

  recordBoostComplete(boostId, xpEarned = 100) {
    const profile = this.loadProfile();
    if (!profile.boostsCompleted) profile.boostsCompleted = [];
    if (!profile.boostsCompleted.includes(boostId)) {
      profile.boostsCompleted.push(boostId);
    }
    profile.xp += xpEarned;
    this.updateStreak(profile);
    this.saveProfile(profile);
    return profile;
  }

  toggleTheme() {
    const profile = this.loadProfile();
    profile.theme = profile.theme === 'dark' ? 'light' : 'dark';
    this.saveProfile(profile);
    return profile.theme;
  }

  toggleSound() {
    const profile = this.loadProfile();
    profile.soundEnabled = !profile.soundEnabled;
    this.saveProfile(profile);
    return profile.soundEnabled;
  }
}
