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
      
      <!-- Top Micro-Framing Tags -->
      <div class="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-6 select-none border-b border-white/10 pb-3">
        <span>DAILY DIALECTIC / QUANTITATIVE CHALLENGE</span>
        <span>DAY ${activeBoostIndex + 1} OF 7</span>
      </div>

      <!-- Daily Challenge Hero Banner -->
      <div class="rounded-2xl bg-white/[0.02] border border-white/15 p-6 sm:p-8 mb-8 shadow-2xl transition-all relative overflow-hidden">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-3 select-none">
              <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-white/20 bg-white/5 text-[10px] font-mono tracking-widest uppercase text-slate-300">
                <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                <span>Daily Challenge Arena</span>
              </div>

              <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-white/20 bg-white/10 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                <span>2X XP Active</span>
              </div>

              <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-white/10 text-slate-400 text-[10px] font-mono">
                <span>RESETS IN ${getResetCountdown().toUpperCase()}</span>
              </div>
            </div>

            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-light uppercase tracking-wide text-white leading-tight">
              ${currentBoost.dayTitle}
            </h1>
            <p class="aee-editorial-serif text-sm sm:text-base text-slate-300 italic mt-2 max-w-2xl leading-relaxed">
              Every day at midnight, a new quantitative market anomaly rotates into the arena. Solve it in one attempt to claim <strong class="font-mono text-white font-normal">+${currentBoost.xpReward} XP</strong> and maintain your streak.
            </p>
          </div>

          <!-- Streak & XP Telemetry Box -->
          <div class="flex items-center gap-4 bg-white/[0.03] border border-white/15 p-4 rounded-xl shadow-inner shrink-0 select-none font-mono">
            <div class="text-center px-2">
              <span class="text-[9px] uppercase tracking-widest text-slate-400 block">CURRENT STREAK</span>
              <span class="text-lg font-bold text-white block mt-0.5">
                ${profile.streak || 0} <span class="text-[10px] font-normal text-slate-400">DAYS</span>
              </span>
            </div>
            <div class="h-8 w-[1px] bg-white/10"></div>
            <div class="text-center px-2">
              <span class="text-[9px] uppercase tracking-widest text-slate-400 block">TODAY REWARD</span>
              <span class="text-lg font-bold text-white block mt-0.5">
                +${currentBoost.xpReward} <span class="text-[10px] font-normal text-slate-400">XP</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Day Tabs Navigation (7 Days of Quantitative Puzzles) -->
      <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none select-none">
        ${DAILY_BOOSTS.map((b, idx) => {
          const isDone = profile.boostsCompleted && profile.boostsCompleted.includes(b.id);
          const isCurrentDay = idx === todayDayIndex;
          const isSelected = idx === activeBoostIndex;
          const dayName = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][idx] || `DAY ${idx + 1}`;

          let tabStyle = 'bg-white/[0.02] border-white/15 text-slate-400 hover:text-white hover:border-white/30';
          if (isSelected) {
            tabStyle = 'bg-white text-black border-white font-bold shadow-lg';
          }

          return `
            <button class="boost-tab-btn flex-1 min-w-[110px] p-3 rounded-lg border text-left transition relative flex flex-col justify-between select-none cursor-pointer font-mono ${tabStyle}" data-boost-idx="${idx}">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[10px] tracking-widest uppercase ${isSelected ? 'text-black' : 'text-slate-400'}">${dayName}</span>
                ${isDone 
                  ? '<span class="text-xs font-bold">[✓]</span>' 
                  : isCurrentDay
                  ? '<span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>'
                  : ''
                }
              </div>
              <div class="text-xs font-bold truncate tracking-tight">${b.category}</div>
              <div class="flex items-center justify-between mt-1 text-[9px] opacity-75">
                <span>+${b.xpReward} XP</span>
                ${isCurrentDay ? '<span class="font-bold uppercase tracking-wider">[TODAY]</span>' : ''}
              </div>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Main Challenge Interactive Arena -->
      <div class="bg-white/[0.02] border border-white/15 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl transition-all relative card-modern">
        <!-- Pillar & Difficulty Badge Bar -->
        <div class="flex items-center justify-between pb-4 border-b border-white/10 mb-6 select-none font-mono">
          <div class="flex items-center gap-2.5">
            <span class="text-[10px] tracking-widest uppercase px-2.5 py-1 rounded bg-white/5 border border-white/20 text-slate-300">
              ${currentBoost.category.toUpperCase()}
            </span>
            <span class="text-[10px] text-slate-400 uppercase">
              DAY ${activeBoostIndex + 1} / 7
            </span>
          </div>

          <div class="flex items-center gap-2 text-xs">
            <span class="text-slate-400 text-[10px] uppercase tracking-wider">STATUS:</span>
            ${isAlreadyCompleted ? `
              <span class="text-[10px] font-bold text-white bg-white/10 px-2.5 py-0.5 rounded border border-white/20">
                [✓ SOLVED]
              </span>
            ` : `
              <span class="text-[10px] font-bold text-slate-300 bg-white/5 px-2.5 py-0.5 rounded border border-white/15">
                [AVAILABLE]
              </span>
            `}
          </div>
        </div>

        <!-- Market Scenario Prompt -->
        <div class="mb-6">
          <h2 class="text-[10px] font-mono tracking-widest uppercase text-slate-400 mb-2">MARKET SCENARIO / CONTEXT</h2>
          <p class="aee-editorial-serif text-base sm:text-lg text-slate-300 italic leading-relaxed bg-white/[0.02] border border-white/10 p-5 rounded-xl">
            ${currentBoost.scenario}
          </p>
        </div>

        <!-- Visual Mathematical Model -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2 select-none font-mono">
            <span class="text-[10px] tracking-widest uppercase text-slate-400">
              VISUAL MATHEMATICAL TOPOLOGY
            </span>
            <span class="text-[10px] text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/15">
              ${meta.formula}
            </span>
          </div>
          <div class="border border-white/15 bg-black/20 rounded-xl p-4">
            ${visualModelSvg}
          </div>
        </div>

        <!-- Challenge Question -->
        <div class="mb-6">
          <h3 class="text-base sm:text-lg font-light uppercase tracking-wide text-white leading-snug">
            ${currentBoost.question}
          </h3>
        </div>

        <!-- Multiple Choice Options -->
        <div class="space-y-3">
          ${currentBoost.options.map((opt, oIdx) => {
            const letter = String.fromCharCode(65 + oIdx);
            const isSelected = selectedOptId === opt.id;
            
            let btnStyle = 'border-white/15 bg-white/[0.02] text-slate-200 hover:bg-white/5 hover:border-white/30';
            let badgeStyle = 'bg-white/5 text-slate-300 border-white/20';

            if (isAlreadyCompleted) {
              if (opt.isCorrect) {
                btnStyle = 'border-white bg-white/15 text-white ring-1 ring-white font-bold';
                badgeStyle = 'bg-white text-black border-white';
              } else {
                btnStyle = 'border-white/5 bg-transparent text-slate-600 opacity-40';
              }
            } else if (hasChecked) {
              if (opt.isCorrect) {
                btnStyle = 'border-white bg-white/15 text-white ring-1 ring-white font-bold';
                badgeStyle = 'bg-white text-black border-white';
              } else if (isSelected) {
                btnStyle = 'border-slate-600 bg-white/[0.01] text-slate-400';
                badgeStyle = 'border-slate-600 text-slate-500';
              } else {
                btnStyle = 'border-white/5 bg-transparent text-slate-600 opacity-40';
              }
            } else if (isSelected) {
              btnStyle = 'border-white bg-white/10 text-white ring-1 ring-white font-bold';
              badgeStyle = 'bg-white text-black border-white';
            }

            return `
              <button class="boost-opt-btn w-full p-4 rounded-lg border text-left text-xs sm:text-sm font-mono tracking-wide transition flex items-center gap-3.5 select-none cursor-pointer ${btnStyle}" data-opt-id="${opt.id}" ${isAlreadyCompleted ? 'disabled' : ''}>
                <span class="w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold border shrink-0 ${badgeStyle}">
                  ${letter}
                </span>
                <span class="flex-1 leading-relaxed">${opt.text}</span>
                <span class="kbd-badge hidden sm:inline-flex text-[10px] font-mono text-slate-500">
                  KEY ${oIdx + 1}
                </span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Explanation / Takeaway Box -->
        ${(hasChecked || isAlreadyCompleted) ? `
          <div class="mt-6 p-5 rounded-lg text-xs leading-relaxed animate-fade-in font-mono border ${
            wasCorrect || isAlreadyCompleted
              ? 'border-white/40 bg-white/10 text-white'
              : 'border-white/20 bg-white/5 text-slate-300'
          }">
            <div class="font-bold mb-1.5 tracking-wider uppercase">
              ${wasCorrect || isAlreadyCompleted ? 'STATUS: VERIFIED CORRECT · Daily Financial Takeaway' : 'Quantitative Analysis & Correction'}
            </div>
            <p class="leading-relaxed text-slate-300 aee-editorial-serif text-sm italic">${currentBoost.options.find(o => o.isCorrect)?.explanation}</p>
          </div>
        ` : ''}

        <!-- Action Footer & Keyboard Nav Bar -->
        <div class="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div class="flex items-center gap-2 text-slate-400 select-none">
            <span class="text-white font-bold">[STREAK ACTIVE]</span>
            <span>·</span>
            <span class="text-slate-500 text-[10px] tracking-wider uppercase">
              ${isAlreadyCompleted
                ? 'Completed · Select another day above to practice'
                : hasChecked && !wasCorrect
                ? 'Press Enter or R to retry · 1-' + numOpts + ' to switch'
                : hasChecked && wasCorrect
                ? 'Press Enter to claim +' + currentBoost.xpReward + ' XP'
                : 'Press 1-' + numOpts + ' or A-' + maxLetter + ' to select, Enter to submit'}
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            ${isAlreadyCompleted ? `
              <div class="px-4 py-2 rounded-lg bg-white/10 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 select-none">
                <span>[✓ COMPLETED & CLAIMED]</span>
              </div>
              <button class="next-boost-btn px-4 py-2 rounded-lg bg-white text-black font-bold text-xs uppercase tracking-wider transition active:scale-95 flex items-center gap-1 cursor-pointer hover:bg-slate-200">
                <span>Next Daily Boost</span> <span>→</span>
              </button>
              <button class="goal-boost-nav-btn px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs border border-white/15 transition cursor-pointer">
                Goals
              </button>
              <button class="courses-boost-nav-btn px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs border border-white/15 transition cursor-pointer">
                Courses
              </button>
            ` : !hasChecked ? `
              <button class="check-boost-btn w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-xs font-mono uppercase tracking-wider transition ${
                selectedOptId 
                  ? 'border border-white bg-white text-black cursor-pointer hover:bg-slate-200' 
                  : 'border border-white/20 bg-transparent text-slate-600 cursor-not-allowed'
              }">
                Submit Answer ↵
              </button>
            ` : wasCorrect ? `
              <button class="done-boost-btn w-full sm:w-auto border border-white bg-white text-black font-bold px-6 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider transition active:scale-95 cursor-pointer hover:bg-slate-200">
                Claim +${currentBoost.xpReward} XP ↵
              </button>
            ` : `
              <button class="retry-boost-btn w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-2.5 rounded-lg transition text-xs font-mono uppercase tracking-wider border border-white/20 active:scale-95 cursor-pointer">
                Try Again (Enter) ↺
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}
