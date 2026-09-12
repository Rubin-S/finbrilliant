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
    <div class="mt-6 pt-5 border-t border-white/10 font-mono">
      <div class="flex items-center justify-between mb-2.5">
        <span class="text-[10px] uppercase tracking-widest text-slate-400">WEEKLY HABIT CADENCE:</span>
        <span class="text-[10px] text-slate-400 font-bold">${completedThisWeek} OF 7 DAYS ACTIVE</span>
      </div>
      <div class="grid grid-cols-7 gap-2">
        ${DAY_NAMES.map((day, dIdx) => {
          const isCompleted = dIdx < Math.min(completedThisWeek, 7);
          const isToday = dIdx === todayDayIndex;
          return `
            <div class="flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all border ${
              isToday
                ? 'bg-white/10 border-white/40'
                : 'bg-white/[0.02] border-white/10'
            }">
              <span class="text-[9px] tracking-wider uppercase ${
                isToday ? 'text-white font-bold' : 'text-slate-500'
              }">
                ${day}
              </span>
              <div class="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border ${
                isCompleted
                  ? 'bg-white text-black border-white'
                  : isToday
                  ? 'border-white/40 text-white'
                  : 'border-white/10 text-slate-600'
              }">
                ${isCompleted ? '✓' : isToday ? '●' : '○'}
              </div>
              ${isToday ? `
                <span class="text-[8px] font-bold uppercase text-white tracking-widest">TODAY</span>
              ` : `
                <span class="text-[8px] text-transparent tracking-widest select-none">·</span>
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
      <div class="p-6 rounded-xl bg-white/[0.02] border border-white/15 hover:border-white/30 flex flex-col justify-between shadow-xl transition-all card-modern">
        <div>
          <div class="flex items-start justify-between gap-3 mb-4 select-none">
            <div>
              <span class="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1">${p.category}</span>
              <h4 class="text-base font-medium uppercase tracking-wide text-white">${p.title}</h4>
            </div>

            <!-- Status Badge -->
            <span class="px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-widest border ${
              isPillarMastered
                ? 'bg-white text-black border-white'
                : p.done > 0
                ? 'bg-white/10 text-white border-white/20'
                : 'bg-transparent text-slate-600 border-white/10'
            }">
              ${isPillarMastered ? '[✓ MASTERED]' : p.done > 0 ? `[${p.pct}%]` : '[NOT STARTED]'}
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-1.5 my-4 font-mono text-[10px]">
            <div class="flex justify-between text-slate-400">
              <span>${p.done} OF ${p.total} LESSONS COMPLETE</span>
              <span class="font-bold text-white">${p.pct}%</span>
            </div>
            <div class="w-full bg-white/10 h-[2px] rounded-full overflow-hidden border border-white/10">
              <div class="bg-white h-full rounded-full transition-all duration-300" style="width: ${p.pct}%"></div>
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <div class="pt-4 mt-2 border-t border-white/10 flex items-center justify-between font-mono">
          <span class="text-[10px] text-slate-400">${p.estimatedMinutes} MINS CURRICULUM</span>
          <button class="track-action-btn px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition flex items-center gap-1 cursor-pointer border ${
            isPillarMastered
              ? 'border-white/20 bg-transparent text-slate-300 hover:text-white hover:border-white/40'
              : 'border-white bg-white text-black font-bold hover:bg-slate-200'
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
    <div class="p-5 rounded-xl border text-center transition flex flex-col justify-between card-modern ${
      b.unlocked 
        ? 'bg-white/[0.03] border-white/30 shadow-xl' 
        : 'bg-white/[0.01] border-white/10 opacity-50'
    }">
      <div>
        <span class="text-xs font-mono font-bold tracking-widest uppercase block mb-2 text-white">
          ${b.unlocked ? '[UNLOCKED]' : '[LOCKED]'}
        </span>
        <h5 class="text-xs font-mono font-bold text-white truncate tracking-wide">${b.name}</h5>
        <p class="aee-editorial-serif text-xs text-slate-400 italic mt-1.5 leading-tight line-clamp-2">${b.desc}</p>
      </div>
      <div class="mt-4 pt-3 border-t border-white/10 font-mono">
        <span class="text-[9px] uppercase tracking-widest block ${
          b.unlocked ? 'text-white font-bold' : 'text-slate-600'
        }">
          ${b.unlocked ? '✓ Verified' : 'Locked Requirement'}
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
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      <!-- Top Micro-Framing Tags -->
      <div class="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-6 select-none border-b border-white/10 pb-3">
        <span>QUANTITATIVE MASTERY DOSSIER</span>
        <span>CADENCE & DISCIPLINE METRICS</span>
      </div>

      <!-- Header -->
      <div class="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[10px] font-mono tracking-widest uppercase text-slate-300 mb-3 select-none">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>Quantitative Mastery Hub</span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-light uppercase tracking-wide text-white">Your Goals & Mastery</h1>
          <p class="aee-editorial-serif text-base sm:text-lg text-slate-300 italic mt-2 max-w-2xl leading-relaxed">
            Calibrate your weekly commitment, track mastery across all 6 financial pillars, and unlock Wall Street quantitative ranks.
          </p>
        </div>

        <!-- Quick Stats Pill Strip -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 select-none font-mono text-xs">
          <div class="px-3 py-1.5 rounded bg-white/5 border border-white/15 text-slate-300 whitespace-nowrap">
            <span class="text-slate-500">TOTAL XP:</span>
            <strong class="text-white ml-1">${profile.xp}</strong>
          </div>
          <div class="px-3 py-1.5 rounded bg-white/5 border border-white/15 text-slate-300 whitespace-nowrap">
            <span class="text-slate-500">STREAK:</span>
            <strong class="text-white ml-1">${profile.streak}D</strong>
          </div>
          <div class="px-3 py-1.5 rounded bg-white/5 border border-white/15 text-slate-300 whitespace-nowrap">
            <span class="text-slate-500">MASTERY:</span>
            <strong class="text-white ml-1">${overallPct}%</strong>
          </div>
          <div class="px-3 py-1.5 rounded bg-white/5 border border-white/15 text-slate-300 whitespace-nowrap">
            <span class="text-slate-500">RANK:</span>
            <strong class="text-white ml-1">${tier.title.toUpperCase()}</strong>
          </div>
        </div>
      </div>

      <!-- Top Grid: Weekly Target & XP Tier Progression -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <!-- Weekly Target Card -->
        <div class="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/15 p-6 sm:p-8 shadow-2xl flex flex-col justify-between transition-all">
          <div>
            <div class="flex items-start justify-between mb-4 font-mono">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-[10px] uppercase tracking-widest text-slate-400">Weekly Commitment</span>
                  ${isGoalAchieved ? `
                    <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white text-black border border-white">
                      [GOAL ACHIEVED]
                    </span>
                  ` : `
                    <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/10 text-white border border-white/20">
                      [CADENCE ACTIVE]
                    </span>
                  `}
                </div>
                <h3 class="text-xl font-light uppercase tracking-wide text-white">Interactive Lesson Goal</h3>
              </div>

              <div class="text-right">
                <div id="goal-progress-text" class="text-2xl sm:text-3xl font-bold text-white leading-none">
                  ${completedThisWeek} <span class="text-slate-500 text-base font-normal">/ ${targetLessons}</span>
                </div>
                <span class="text-[10px] text-slate-400 mt-1 block uppercase tracking-wider">LESSONS THIS WEEK</span>
              </div>
            </div>

            <!-- Dual-tone Target Progress Bar -->
            <div class="w-full bg-white/10 h-[2px] rounded-full overflow-hidden mb-4 border border-white/10">
              <div id="goal-progress-bar" class="bg-white h-full rounded-full transition-all duration-300"
                   style="width: ${progressPct}%"></div>
            </div>

            <!-- Motivational Microcopy -->
            <p id="goal-message" class="aee-editorial-serif text-sm sm:text-base text-slate-300 italic leading-relaxed">
              ${isGoalAchieved
                ? 'Congratulations! You have crushed your weekly financial learning goal. Every additional lesson compounds your quant mastery.'
                : `Complete ${targetLessons - completedThisWeek} more lesson${targetLessons - completedThisWeek === 1 ? '' : 's'} to hit your goal (~${(targetLessons - completedThisWeek) * 15} minutes of interactive focus).`}
            </p>

            <!-- 7-Day Habit Tracker Strip with Clear Day Labels -->
            ${getHabitTrackerMarkup(completedThisWeek, todayDayIndex)}
          </div>

          <!-- Pace Presets & Custom Precision Slider -->
          <div class="mt-8 pt-6 border-t border-white/10 font-mono">
            <!-- Preset Buttons -->
            <div class="mb-4">
              <span class="text-[10px] uppercase tracking-widest text-slate-400 block mb-2.5">Target Pace Presets</span>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 select-none" id="presets-container">
                ${PACE_PRESETS.map(preset => `
                  <button class="preset-btn py-2.5 px-3 rounded-lg text-xs border transition text-center cursor-pointer ${
                    targetLessons === preset.count
                      ? 'bg-white text-black border-white font-bold shadow-lg'
                      : 'bg-white/[0.02] border-white/15 text-slate-400 hover:text-white hover:border-white/30'
                  }" data-preset-val="${preset.count}">
                    <div class="font-bold">${preset.count} / WK</div>
                    <div class="text-[9px] opacity-75 uppercase tracking-wider">${preset.label} (~${preset.mins}M)</div>
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Precision Slider -->
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span id="target-label">Custom Target: <strong class="text-white font-bold">${targetLessons} Lessons / Week</strong></span>
                <span id="target-mins-label" class="text-slate-400 font-mono">~${targetLessons * 15} mins/week</span>
              </div>
              <input type="range" min="1" max="14" step="1" value="${targetLessons}" class="target-slider w-full accent-white cursor-pointer"/>
            </div>
          </div>
        </div>

        <!-- Tier & XP Card -->
        <div class="rounded-2xl bg-white/[0.02] border border-white/15 p-6 sm:p-7 shadow-2xl flex flex-col justify-between transition-all font-mono">
          <div>
            <div class="mb-6 pb-4 border-b border-white/10">
              <span class="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Current Rank</span>
              <h3 class="text-xl font-light uppercase tracking-wide text-white leading-snug">${tier.title}</h3>
              <span class="text-[10px] text-slate-400 block mt-1">RANK ${tier.rank} OF ${LEVEL_TIERS.length} · ${profile.xp} TOTAL XP</span>
            </div>

            <!-- XP to Next Rank -->
            <div class="space-y-2 mt-4">
              <div class="flex justify-between text-xs">
                <span class="text-slate-400">
                  ${tier.nextTier ? `NEXT: ${tier.nextTier.title.toUpperCase()}` : 'MAX TIER ATTAINED'}
                </span>
                <span class="font-bold text-white">${tier.progressPct}%</span>
              </div>
              <div class="w-full bg-white/10 h-[2px] rounded-full overflow-hidden border border-white/10">
                <div class="bg-white h-full rounded-full transition-all duration-300" style="width: ${tier.progressPct}%"></div>
              </div>
              <span class="text-[10px] text-slate-400 block mt-1">
                ${tier.nextTier ? `${tier.nextTier.minXP - profile.xp} XP to unlock next level perks` : 'Legendary quantitative mastery attained'}
              </span>
            </div>
          </div>

          <!-- Streak Callout & Direct Link to Daily Boost -->
          <div class="mt-8 pt-4 border-t border-white/10 space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-400">Active Streak:</span>
              <span class="text-white font-bold">${profile.streak} Days Streak</span>
            </div>
            <button class="boost-shortcut-btn w-full py-2.5 px-3 rounded-lg border border-white bg-white text-black text-xs font-bold uppercase tracking-wider transition flex items-center justify-between group shadow-sm active:scale-95 cursor-pointer hover:bg-slate-200">
              <span>Play Today's Daily Boost</span>
              <span>+2X XP →</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Curriculum Mastery Breakdown (6 Pillars) -->
      <div class="mb-14">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 border-b border-white/10 pb-4">
          <div>
            <div class="text-[10px] font-mono tracking-widest uppercase text-slate-400 mb-1">CURRICULUM TELEMETRY</div>
            <h2 class="text-xl sm:text-2xl font-light uppercase tracking-wide text-white">Curriculum Mastery Breakdown</h2>
          </div>
          <div class="text-xs font-mono px-3.5 py-1.5 rounded bg-white/5 border border-white/15 text-slate-300 self-start sm:self-auto">
            MASTERED: <strong class="text-white font-bold">${totalCompletedCount}</strong> / ${totalLessonsCount} LESSONS (${overallPct}%)
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="pillars-container">
          ${getPillarsMarkup(pillars)}
        </div>
      </div>

      <!-- Achievements & Mastery Badges -->
      <div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3 border-b border-white/10 pb-4">
          <div>
            <div class="text-[10px] font-mono tracking-widest uppercase text-slate-400 mb-1">ACHIEVEMENT REGISTER</div>
            <h2 class="text-xl sm:text-2xl font-light uppercase tracking-wide text-white">Mastery Badges</h2>
          </div>

          <!-- Badge Filter Pills -->
          <div class="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/15 text-xs font-mono select-none self-start sm:self-auto">
            <button class="badge-filter-btn px-3 py-1 rounded transition cursor-pointer ${
              activeBadgeFilter === 'all'
                ? 'bg-white text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }" data-filter="all">
              All (${badges.length})
            </button>
            <button class="badge-filter-btn px-3 py-1 rounded transition cursor-pointer ${
              activeBadgeFilter === 'unlocked'
                ? 'bg-white text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }" data-filter="unlocked">
              Unlocked (<span id="unlocked-count-text">${unlockedBadgesCount}</span>)
            </button>
            <button class="badge-filter-btn px-3 py-1 rounded transition cursor-pointer ${
              activeBadgeFilter === 'locked'
                ? 'bg-white text-black font-bold'
                : 'text-slate-400 hover:text-white'
            }" data-filter="locked">
              Locked (${badges.length - unlockedBadgesCount})
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" id="badges-container">
          ${getBadgesMarkup(filteredBadges)}
        </div>
      </div>
    </div>
  `;
}
