/**
 * Mastery Badges Data and Evaluation Engine
 * Tracks user achievements across all 6 financial pillars and practice milestones.
 */

export function getGoalBadges(profile, completedLessons = []) {
  const completed = Array.isArray(completedLessons) ? completedLessons : [];

  return [
    {
      id: 'b1',
      name: 'Rule of 72 Pro',
      icon: '🌱',
      desc: 'Mastered exponential compound math & doubling periods',
      category: 'Foundation',
      unlocked: completed.includes('compound-101')
    },
    {
      id: 'b2',
      name: 'Euler Inquirer',
      icon: '✨',
      desc: 'Discovered the continuous compounding limit e and Euler constant',
      category: 'Theory',
      unlocked: completed.includes('compound-102')
    },
    {
      id: 'b3',
      name: 'Spread Hunter',
      icon: '⚡',
      desc: 'Executed order book depth sweeps without adverse slippage',
      category: 'Trading',
      unlocked: completed.includes('orderbook-101')
    },
    {
      id: 'b4',
      name: 'Greeks Intuition',
      icon: '🎯',
      desc: 'Mastered Delta, Vega, and nonlinear Theta time-decay',
      category: 'Derivatives',
      unlocked: completed.includes('options-101')
    },
    {
      id: 'b5',
      name: 'DCF Architect',
      icon: '🏛️',
      desc: 'Valued enterprise cash flows and Gordon Growth perpetuity',
      category: 'Valuation',
      unlocked: completed.includes('dcf-101')
    },
    {
      id: 'b6',
      name: 'Frontier Pioneer',
      icon: '⚖️',
      desc: 'Optimized risk-return tradeoffs on the Markowitz Efficient Frontier',
      category: 'Portfolio',
      unlocked: completed.includes('mpt-101')
    },
    {
      id: 'b7',
      name: 'Yield Master',
      icon: '🌐',
      desc: 'Predicted bond price inversions across central bank rate hikes',
      category: 'Fixed Income',
      unlocked: completed.includes('macro-101')
    },
    {
      id: 'b8',
      name: 'Wall Street Griller',
      icon: '🔥',
      desc: 'Scored 400+ points under rapid-fire pressure in Superday arena',
      category: 'Superday',
      unlocked: Boolean(profile?.grillStats?.highScore >= 400)
    },
    {
      id: 'b9',
      name: 'Daily Alpha',
      icon: '🚀',
      desc: 'Solved 2X XP quantitative puzzles in the Daily Boost arena',
      category: 'Daily Boost',
      unlocked: Boolean(profile?.boostsCompleted?.length >= 1)
    },
    {
      id: 'b10',
      name: 'Streak Master',
      icon: '⏳',
      desc: 'Maintained 3+ days of continuous quantitative study momentum',
      category: 'Consistency',
      unlocked: Boolean(profile?.streak >= 3)
    }
  ];
}

export function filterGoalBadges(badges, activeFilter) {
  if (activeFilter === 'unlocked') return badges.filter(b => b.unlocked);
  if (activeFilter === 'locked') return badges.filter(b => !b.unlocked);
  return badges;
}
