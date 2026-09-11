/**
 * Goal View Markup Generator
 * Generates the weekly commitment calibrator, habit tracker strip,
 * 6 pillar curriculum mastery cards, and mastery badge collection.
 */

import { LEVEL_TIERS } from '../../storage.js';

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const PACE_PRESETS = [
  { count: 3, label: 'Casual', mins: 45 },
  { count: 5, label: 'Balanced', mins: 75 },
  { count: 7, label: 'Intensive', mins: 105 },
  { count: 10, label: 'Superday', mins: 150 }
];

export function getHabitTrackerMarkup(completedThisWeek, todayDayIndex) {
  return `
    <div class="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold text-slate-600 dark:text-slate-400">Weekly Habit Tracker:</span>
        <span class="text-[11px] text-slate-400 font-medium">${completedThisWeek} of 7 days active</span>
      </div>
      <div class="grid grid-cols-7 gap-1.5 sm:gap-3">
        ${DAY_NAMES.map((day, dIdx) => {
          const isCompleted = dIdx < Math.min(completedThisWeek, 7);
          const isToday = dIdx === todayDayIndex;
          return `
            <div class="flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all ${
              isToday
                ? 'bg-cyan-50/70 dark:bg-cyan-950/30 border border-cyan-300/80 dark:border-cyan-500/40'
                : 'bg-slate-50/60 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60'
            }">
              <span class="text-[10px] font-bold ${
                isToday ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-500 dark:text-slate-400'
              }">
                ${day}
              </span>
              <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isCompleted
                  ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                  : isToday
                  ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 animate-pulse'
                  : 'bg-slate-200/70 dark:bg-slate-700/60 text-slate-400'
              }">
                ${isCompleted ? '✓' : isToday ? '•' : '○'}
              </div>
              ${isToday ? `
                <span class="text-[9px] font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-wider">TODAY</span>
              ` : `
                <span class="text-[9px] text-transparent tracking-wider select-none">·</span>
              `}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function getPillarsMarkup(pillars) {
  return pillars.map(p => {
    const isPillarMastered = p.pct === 100;
    return `
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 flex flex-col justify-between shadow-sm dark:shadow-lg transition-all card-modern">
        <div>
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <span class="text-3xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">${p.icon}</span>
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">${p.category}</span>
                <h4 class="text-sm sm:text-base font-bold text-slate-900 dark:text-white">${p.title}</h4>
              </div>
            </div>

            <!-- Status Badge -->
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isPillarMastered
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                : p.done > 0
                ? 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }">
              ${isPillarMastered ? '✓ Mastered' : p.done > 0 ? `${p.pct}% Done` : 'Not Started'}
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-1.5 my-3">
            <div class="flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>${p.done} of ${p.total} lessons complete</span>
              <span class="font-bold ${isPillarMastered ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}">${p.pct}%</span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/40">
              <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300" style="width: ${p.pct}%"></div>
            </div>
          </div>
        </div>

        <!-- Action Button to Dive Straight into the Track -->
        <div class="pt-3 mt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span class="text-[11px] text-slate-400 font-medium">${p.estimatedMinutes} mins curriculum</span>
          <button class="track-action-btn px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
            isPillarMastered
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              : 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-sm shadow-emerald-500/20 active:scale-95'
          }" data-lesson-id="${p.nextLessonId}">
            <span>${isPillarMastered ? 'Review Track' : p.done > 0 ? 'Continue Track →' : 'Start Track →'}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

export function getBadgesMarkup(filteredBadges) {
  return filteredBadges.map(b => `
    <div class="p-4 rounded-2xl border text-center transition flex flex-col justify-between card-modern ${
      b.unlocked 
        ? 'bg-white dark:bg-slate-900/90 border-emerald-500/40 dark:border-emerald-500/40 shadow-sm dark:shadow-lg dark:shadow-emerald-500/5' 
        : 'bg-slate-50/70 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
    }">
      <div>
        <span class="text-3xl block mb-2 transform transition-transform hover:scale-110 ${b.unlocked ? '' : 'grayscale'}">${b.icon}</span>
        <h5 class="text-xs font-bold text-slate-900 dark:text-white truncate">${b.name}</h5>
        <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-tight line-clamp-2">${b.desc}</p>
      </div>
      <div class="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <span class="text-[9px] font-extrabold uppercase tracking-wider block ${
          b.unlocked ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'
        }">
          ${b.unlocked ? '✓ Unlocked' : '🔒 Locked'}
        </span>
      </div>
    </div>
  `).join('');
}

export function getGoalViewMarkup({
  profile,
  tier,
  completedThisWeek,
  targetLessons,
  progressPct,
  isGoalAchieved,
  pillars,
  badges,
  filteredBadges,
  activeBadgeFilter,
  totalCompletedCount,
  totalLessonsCount,
  overallPct,
  todayDayIndex
}) {
  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  return `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <!-- Header -->
      <div class="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-700 dark:text-cyan-400 text-xs font-semibold mb-2">
            <span>🎯</span> <span>Quantitative Mastery Hub</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Goals & Mastery</h1>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Calibrate your weekly commitment, track mastery across all 6 financial pillars, and unlock Wall Street quantitative ranks.
          </p>
        </div>

        <!-- Quick Stats Pill Strip -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 select-none">
          <div class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs whitespace-nowrap">
            <span class="text-slate-400">Total XP:</span>
            <strong class="text-slate-900 dark:text-white font-bold ml-1">${profile.xp}</strong>
          </div>
          <div class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs whitespace-nowrap">
            <span class="text-slate-400">Streak:</span>
            <strong class="text-amber-500 font-bold ml-1">🔥 ${profile.streak}d</strong>
          </div>
          <div class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs whitespace-nowrap">
            <span class="text-slate-400">Mastery:</span>
            <strong class="text-emerald-600 dark:text-emerald-400 font-bold ml-1">${overallPct}%</strong>
          </div>
          <div class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-xs whitespace-nowrap">
            <span class="text-slate-400">Rank:</span>
            <strong class="text-cyan-600 dark:text-cyan-400 font-bold ml-1">${tier.icon} ${tier.title}</strong>
          </div>
        </div>
      </div>

      <!-- Top Grid: Weekly Target & XP Tier Progression -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <!-- Weekly Target Card -->
        <div class="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm dark:shadow-xl flex flex-col justify-between transition-all">
          <div>
            <div class="flex items-start justify-between mb-4">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Weekly Commitment</span>
                  ${isGoalAchieved ? `
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                      🎉 Smashed!
                    </span>
                  ` : `
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-500/30">
                      ⚡ Active
                    </span>
                  `}
                </div>
                <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">Interactive Lesson Goal</h3>
              </div>

              <div class="text-right">
                <div id="goal-progress-text" class="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400 leading-none">
                  ${completedThisWeek} <span class="text-slate-400 text-lg font-medium">/ ${targetLessons}</span>
                </div>
                <span class="text-xs text-slate-500 dark:text-slate-400 mt-1 block">Lessons this week</span>
              </div>
            </div>

            <!-- Dual-tone Target Progress Bar -->
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-3 border border-slate-200/60 dark:border-slate-700/50">
              <div id="goal-progress-bar" class="bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm"
                   style="width: ${progressPct}%"></div>
            </div>

            <!-- Motivational Microcopy -->
            <p id="goal-message" class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              ${isGoalAchieved
                ? '🎉 Congratulations! You have crushed your weekly financial learning goal! Every extra lesson builds your quant rank.'
                : `Complete ${targetLessons - completedThisWeek} more lesson${targetLessons - completedThisWeek === 1 ? '' : 's'} to hit your goal (~${(targetLessons - completedThisWeek) * 15} minutes of interactive focus).`}
            </p>

            <!-- 7-Day Habit Tracker Strip with Clear Day Labels -->
            ${getHabitTrackerMarkup(completedThisWeek, todayDayIndex)}
          </div>

          <!-- Pace Presets & Custom Precision Slider -->
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <!-- Preset Buttons -->
            <div class="mb-3">
              <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Target Pace Presets</span>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 select-none" id="presets-container">
                ${PACE_PRESETS.map(preset => `
                  <button class="preset-btn py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                    targetLessons === preset.count
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-700 dark:text-cyan-300 shadow-sm font-bold ring-1 ring-cyan-500/30'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }" data-preset-val="${preset.count}">
                    <div class="font-bold">${preset.count} / wk</div>
                    <div class="text-[10px] opacity-75">${preset.label} (~${preset.mins}m)</div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Precision Slider -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span id="target-label">Custom Target: <strong class="text-cyan-600 dark:text-cyan-400 font-bold">${targetLessons} Lessons / Week</strong></span>
                <span id="target-mins-label" class="text-slate-400 font-mono">~${targetLessons * 15} mins/week</span>
              </div>
              <input type="range" min="1" max="14" step="1" value="${targetLessons}" class="target-slider w-full accent-cyan-500 cursor-pointer"/>
            </div>
          </div>
        </div>

        <!-- Tier & XP Card -->
        <div class="rounded-3xl bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-500/30 p-6 sm:p-7 shadow-sm dark:shadow-xl flex flex-col justify-between transition-all">
          <div>
            <div class="flex items-center gap-3.5 mb-5">
              <div class="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800/80 border border-emerald-200 dark:border-slate-700 flex items-center justify-center text-3xl shadow-sm">
                ${tier.icon}
              </div>
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Current Rank</span>
                <h3 class="text-lg font-black text-slate-900 dark:text-white leading-snug">${tier.title}</h3>
                <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">Rank ${tier.rank} of ${LEVEL_TIERS.length} • ${profile.xp} XP</span>
              </div>
            </div>

            <!-- XP to Next Rank -->
            <div class="space-y-2 mt-4">
              <div class="flex justify-between text-xs">
                <span class="text-slate-500 dark:text-slate-400 font-medium">
                  ${tier.nextTier ? `Next: ${tier.nextTier.title}` : 'Max Tier Reached'}
                </span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400">${tier.progressPct}%</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/60 dark:border-slate-700/50">
                <div class="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300" style="width: ${tier.progressPct}%"></div>
              </div>
              <span class="text-[11px] text-slate-400 block">
                ${tier.nextTier ? `${tier.nextTier.minXP - profile.xp} XP to unlock next level perks` : 'Legendary quantitative mastery attained'}
              </span>
            </div>
          </div>

          <!-- Streak Callout & Direct Link to Daily Boost -->
          <div class="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-500 dark:text-slate-400 font-medium">Active Streak:</span>
              <span class="text-amber-500 font-bold flex items-center gap-1">🔥 ${profile.streak} Days Streak</span>
            </div>
            <button class="boost-shortcut-btn w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition flex items-center justify-between group shadow-sm active:scale-95">
              <span class="flex items-center gap-1.5">
                <span>⚡</span> <span>Play Today's Daily Boost</span>
              </span>
              <span class="group-hover:translate-x-0.5 transition-transform">+2X XP →</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Curriculum Mastery Breakdown (6 Pillars) -->
      <div class="mb-10">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-2">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Curriculum Mastery Breakdown</h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">First-principles mastery across all 6 core financial disciplines.</p>
          </div>
          <div class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-sm self-start sm:self-auto">
            Mastered: <strong class="text-emerald-600 dark:text-emerald-400 font-bold">${totalCompletedCount}</strong> / ${totalLessonsCount} Lessons (${overallPct}%)
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${getPillarsMarkup(pillars)}
        </div>
      </div>

      <!-- Achievements & Mastery Badges -->
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-3">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Mastery Badges</h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Collect quantitative achievement trophies by completing core challenges.</p>
          </div>

          <!-- Badge Filter Pills -->
          <div class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold select-none self-start sm:self-auto">
            <button class="badge-filter-btn px-3 py-1 rounded-lg transition ${
              activeBadgeFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }" data-filter="all">
              All (${badges.length})
            </button>
            <button class="badge-filter-btn px-3 py-1 rounded-lg transition ${
              activeBadgeFilter === 'unlocked'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }" data-filter="unlocked">
              Unlocked (${unlockedBadgesCount})
            </button>
            <button class="badge-filter-btn px-3 py-1 rounded-lg transition ${
              activeBadgeFilter === 'locked'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }" data-filter="locked">
              Locked (${badges.length - unlockedBadgesCount})
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          ${getBadgesMarkup(filteredBadges)}
        </div>
      </div>
    </div>
  `;
}
