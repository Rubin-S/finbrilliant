/**
 * Search Index Generator for Command Palette (Cmd+K / Ctrl+K)
 * Aggregates core platform destinations, courses, lessons, and daily challenges.
 */

import { COURSES } from '../../data/courses.js';
import { DAILY_BOOSTS } from '../../data/dailyBoosts.js';

export function getSearchIndex() {
  const items = [
    {
      title: 'Learn / Course Catalog',
      subtitle: 'All 6 interactive quantitative finance curricula',
      category: 'Curriculum',
      icon: '📚',
      badge: 'Core',
      view: 'courses',
      lessonId: null,
      keywords: 'learn courses catalog finance curriculum modules'
    },
    {
      title: 'Superday Interview Arena',
      subtitle: 'Technical quant and investment banking interview simulator',
      category: 'Practice',
      icon: '🔥',
      badge: 'Arena',
      view: 'grill',
      lessonId: null,
      keywords: 'practice grill me superday interview technical questions wall street'
    },
    {
      title: 'Daily Boost Challenges',
      subtitle: '7-day market dynamics and fast arbitrage micro-puzzles',
      category: 'Markets',
      icon: '⚡',
      badge: '2X XP',
      view: 'boost',
      lessonId: null,
      keywords: 'daily boost markets challenge arbitrage options dcf portfolio'
    },
    {
      title: 'Weekly Learning Goals',
      subtitle: 'Track habit streak, XP velocity, and rank milestones',
      category: 'Goals',
      icon: '🎯',
      badge: 'Habits',
      view: 'goal',
      lessonId: null,
      keywords: 'goals weekly target streak habit rank level xp'
    },
    {
      title: 'Quantitative Sandbox Lab',
      subtitle: 'Live interactive order book matching engine and options visualizer',
      category: 'Lab',
      icon: '🧪',
      badge: 'Sandbox',
      view: 'lab',
      lessonId: null,
      keywords: 'lab sandbox order book black scholes greeks simulator tools'
    },
    {
      title: 'Order Book Depth Simulator',
      subtitle: 'Limit order book, market orders, spread & slippage mechanics',
      category: 'Tools',
      icon: '📊',
      badge: 'Tool',
      view: 'lab',
      lessonId: null,
      keywords: 'order book depth simulator bid ask spread slippage market maker'
    },
    {
      title: 'Black-Scholes Options Greeks',
      subtitle: 'Interactive Delta, Gamma, Theta, Vega analytical visualizer',
      category: 'Tools',
      icon: '📈',
      badge: 'Tool',
      view: 'lab',
      lessonId: null,
      keywords: 'black scholes options greeks delta gamma theta vega implied volatility'
    }
  ];

  if (Array.isArray(COURSES)) {
    COURSES.forEach(c => {
      items.push({
        title: c.title,
        subtitle: `${c.category} • ${c.totalXP} XP • ${c.level}`,
        category: 'Course',
        icon: c.icon || '📘',
        badge: c.level,
        view: 'courses',
        lessonId: null,
        keywords: `${c.title} ${c.category} ${c.description || ''}`
      });

      if (Array.isArray(c.lessons)) {
        c.lessons.forEach(l => {
          items.push({
            title: l.title,
            subtitle: `${c.title} • +${l.xp} XP`,
            category: 'Lesson',
            icon: '📖',
            badge: `+${l.xp} XP`,
            view: 'lesson',
            lessonId: l.id,
            keywords: `${l.title} ${c.title} ${c.category}`
          });
        });
      }
    });
  }

  if (Array.isArray(DAILY_BOOSTS)) {
    DAILY_BOOSTS.forEach((b, idx) => {
      const cleanTitle = b.dayTitle ? b.dayTitle.replace(/^Today’s Boost:\s*/i, '') : `Challenge #${idx + 1}`;
      items.push({
        title: `Day ${idx + 1}: ${cleanTitle}`,
        subtitle: `${b.category} • +${b.xpReward} XP`,
        category: 'Markets',
        icon: '⚡',
        badge: b.multiplier || 'Challenge',
        view: 'boost',
        lessonId: null,
        keywords: `${b.dayTitle || ''} ${b.category || ''} ${b.scenario || ''}`
      });
    });
  }

  return items;
}
