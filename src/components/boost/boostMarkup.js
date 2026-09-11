/**
 * Boost View Markup Generator
 * Generates the daily challenge arena header, day navigation tabs,
 * financial scenario cards, options list, and takeaway feedback.
 */

import { DAILY_BOOSTS } from '../../data/dailyBoosts.js';
import { renderBoostVisualModel, getBoostMeta } from './boostVisualModels.js';

export function getResetCountdown() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diffMs = Math.max(0, midnight - now);
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m`;
}

export function getBoostViewMarkup({
  profile,
  activeBoostIndex,
  currentBoost,
  selectedOptId,
  hasChecked,
  wasCorrect,
  isAlreadyCompleted,
  todayDayIndex
}) {
  const numOpts = currentBoost.options.length;
  const maxLetter = String.fromCharCode(64 + numOpts);
  const meta = getBoostMeta(currentBoost.id);
  const visualModelSvg = renderBoostVisualModel(currentBoost.id);

  return `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <!-- Daily Challenge Hero Banner -->
      <div class="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 mb-8 shadow-sm dark:shadow-2xl transition-all relative overflow-hidden glass-panel">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-3 select-none">
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Daily Challenge Arena</span>
              </div>

              <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-black uppercase tracking-wider">
                <span>⚡</span> <span>2X XP Active</span>
              </div>

              <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 text-xs font-mono">
                <span>⏱️</span> <span>Resets in ${getResetCountdown()}</span>
              </div>
            </div>

            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              ${currentBoost.dayTitle}
            </h1>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Every day at midnight, FinBrilliant rotates a new live quantitative market problem. Solve it in one attempt to claim <strong class="text-emerald-600 dark:text-emerald-400 font-bold">+${currentBoost.xpReward} XP</strong> and maintain your streak.
            </p>
          </div>

          <!-- Streak & XP Trophy Widget -->
          <div class="flex items-center gap-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-2xl shadow-sm shrink-0 select-none">
            <div class="text-center px-2">
              <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Current Streak</span>
              <span class="text-xl font-black text-amber-500 flex items-center justify-center gap-1 mt-0.5">
                🔥 ${profile.streak || 0} <span class="text-xs font-normal text-slate-400">days</span>
              </span>
            </div>
            <div class="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            <div class="text-center px-2">
              <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Today's Reward</span>
              <span class="text-xl font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
                +${currentBoost.xpReward} <span class="text-xs font-normal text-slate-400">XP</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Day Tabs Navigation (7 Days of Quantitative Puzzles) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none select-none">
        ${DAILY_BOOSTS.map((b, idx) => {
          const isDone = profile.boostsCompleted && profile.boostsCompleted.includes(b.id);
          const isCurrentDay = idx === todayDayIndex;
          const isSelected = idx === activeBoostIndex;
          const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx] || `Day ${idx + 1}`;

          let tabStyle = 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/80';
          if (isSelected) {
            tabStyle = 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-md font-bold ring-2 ring-emerald-500/20';
          }

          return `
            <button class="boost-tab-btn flex-1 min-w-[110px] p-3 rounded-2xl border text-left transition relative flex flex-col justify-between select-none ${tabStyle}" data-boost-idx="${idx}">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[10px] font-mono font-bold uppercase tracking-wider ${isSelected ? 'text-emerald-400 dark:text-emerald-600' : 'text-slate-400'}">${dayName}</span>
                ${isDone 
                  ? '<span class="text-emerald-500 text-xs font-bold">✓</span>' 
                  : isCurrentDay
                  ? '<span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>'
                  : ''
                }
              </div>
              <div class="text-xs font-black truncate">${b.category}</div>
              <div class="flex items-center justify-between mt-1 text-[10px] opacity-75">
                <span>+${b.xpReward} XP</span>
                ${isCurrentDay ? '<span class="font-extrabold uppercase text-[9px] tracking-wider text-emerald-400 dark:text-emerald-600">Today</span>' : ''}
              </div>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Main Challenge Interactive Arena -->
      <div class="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-sm dark:shadow-2xl transition-all relative card-modern">
        <!-- Pillar & Difficulty Badge Bar -->
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6 select-none">
          <div class="flex items-center gap-2.5">
            <span class="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              ${currentBoost.category}
            </span>
            <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
              Day ${activeBoostIndex + 1} of 7
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-slate-400">Status:</span>
            ${isAlreadyCompleted ? `
              <span class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                <span>✓</span> Solved
              </span>
            ` : `
              <span class="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-500/30">
                <span>⚡</span> Available
              </span>
            `}
          </div>
        </div>

        <!-- Market Scenario Prompt -->
        <div class="mb-6">
          <h2 class="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 mb-2">Market Scenario</h2>
          <p class="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/80 p-4 sm:p-5 rounded-2xl font-normal">
            ${currentBoost.scenario}
          </p>
        </div>

        <!-- Visual Mathematical Model -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2 select-none">
            <span class="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <span>📐</span> <span>Visual Mathematical Model</span>
            </span>
            <span class="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ${meta.formula}
            </span>
          </div>
          ${visualModelSvg}
        </div>

        <!-- Challenge Question -->
        <div class="mb-6">
          <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            ${currentBoost.question}
          </h3>
        </div>

        <!-- Multiple Choice Options -->
        <div class="space-y-3">
          ${currentBoost.options.map((opt, oIdx) => {
            const letter = String.fromCharCode(65 + oIdx);
            const isSelected = selectedOptId === opt.id;
            
            let btnStyle = 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm';
            let badgeStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';

            if (isAlreadyCompleted) {
              if (opt.isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 font-semibold ring-2 ring-emerald-500/30';
                badgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-400';
              } else {
                btnStyle = 'border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 opacity-50';
              }
            } else if (hasChecked) {
              if (opt.isCorrect) {
                btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-semibold';
                badgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-400';
              } else if (isSelected) {
                btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 ring-2 ring-rose-500/30 font-semibold';
                badgeStyle = 'bg-rose-500 text-white border-rose-400';
              } else {
                btnStyle = 'border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 opacity-50';
              }
            } else if (isSelected) {
              btnStyle = 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-950 dark:text-white ring-2 ring-emerald-500/30 font-semibold shadow-sm';
              badgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-400';
            }

            return `
              <button class="boost-opt-btn w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition flex items-center gap-3.5 select-none ${btnStyle}" data-opt-id="${opt.id}" ${isAlreadyCompleted ? 'disabled' : ''}>
                <span class="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold border shrink-0 transition-transform ${badgeStyle}">
                  ${letter}
                </span>
                <span class="flex-1 leading-relaxed">${opt.text}</span>
                <span class="kbd-badge hidden sm:inline-flex text-slate-400">
                  key ${oIdx + 1}
                </span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Explanation / Takeaway Box -->
        ${(hasChecked || isAlreadyCompleted) ? `
          <div class="mt-6 p-5 rounded-2xl text-xs sm:text-sm leading-relaxed animate-fade-in ${
            wasCorrect || isAlreadyCompleted
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-950 dark:text-rose-200'
          }">
            <div class="font-mono font-black mb-1.5 flex items-center gap-2 text-sm tracking-tight">
              ${wasCorrect || isAlreadyCompleted ? '💡 Daily Financial Takeaway' : '❌ Quantitative Analysis & Correction'}
            </div>
            <p class="leading-relaxed font-sans text-slate-800 dark:text-slate-200">${currentBoost.options.find(o => o.isCorrect)?.explanation}</p>
          </div>
        ` : ''}

        <!-- Action Footer & Keyboard Nav Bar -->
        <div class="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 select-none">
            <span class="text-amber-500">🔥 Streak Active</span>
            <span>•</span>
            <span class="text-slate-400 font-mono text-[11px]">
              ${isAlreadyCompleted
                ? 'Completed • Select another day above to practice'
                : hasChecked && !wasCorrect
                ? 'Press Enter or R to retry • 1-' + numOpts + ' to switch'
                : hasChecked && wasCorrect
                ? 'Press Enter to claim +' + currentBoost.xpReward + ' XP 🎉'
                : 'Press 1-' + numOpts + ' or A-' + maxLetter + ' to select, Enter to submit'}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            ${isAlreadyCompleted ? `
              <div class="px-4 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold text-xs border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1.5 shadow-sm select-none">
                <span>✓ Completed & Claimed</span>
              </div>
              <button class="next-boost-btn px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-xs shadow-md transition active:scale-95 flex items-center gap-1">
                <span>Next Daily Boost</span> <span>→</span>
              </button>
              <button class="goal-boost-nav-btn px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition">
                Goals
              </button>
              <button class="courses-boost-nav-btn px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition">
                Courses
              </button>
            ` : !hasChecked ? `
              <button class="check-boost-btn w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm transition ${
                selectedOptId 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
              }">
                Submit Answer ↵
              </button>
            ` : wasCorrect ? `
              <button class="done-boost-btn w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 transition text-sm active:scale-95">
                Claim +${currentBoost.xpReward} XP 🎉 ↵
              </button>
            ` : `
              <button class="retry-boost-btn w-full sm:w-auto bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold px-6 py-2.5 rounded-xl transition text-sm border border-slate-200 dark:border-slate-700 active:scale-95">
                ↺ Try Again (Enter)
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}
