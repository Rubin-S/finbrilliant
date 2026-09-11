/**
 * Grill Me Arena Markup Generator
 * Generates the live question HUD, timer bar, multiple-choice options,
 * and post-interview diagnostic debrief cards.
 */

export function getQuestionMarkup({
  q,
  currentIndex,
  totalQuestions,
  lives,
  score,
  streak,
  multiplier,
  timeLeft,
  isAnswered,
  selectedOptionId
}) {
  return `
    <div class="max-w-3xl mx-auto px-4 py-6 animate-fade-in">
      <!-- Top Status Bar -->
      <div class="flex items-center justify-between bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-5 py-3 mb-6 shadow-sm dark:shadow-xl">
        <!-- Lives -->
        <div class="flex items-center gap-1.5">
          <span class="text-xs text-slate-500 dark:text-slate-400 font-semibold mr-1">Lives:</span>
          ${Array.from({ length: 3 }).map((_, i) => `
            <span class="text-lg transition-transform ${i < lives ? 'text-rose-500 scale-100' : 'text-slate-300 dark:text-slate-700 scale-75'}">❤️</span>
          `).join('')}
        </div>

        <!-- Score & Multiplier -->
        <div class="flex items-center gap-3">
          <div class="text-right">
            <span class="text-[10px] uppercase font-bold text-slate-400">Score</span>
            <p class="text-base font-black text-amber-500 dark:text-amber-400 leading-none">${score} pts</p>
          </div>
          <span class="px-2 py-0.5 rounded text-xs font-extrabold ${streak >= 2 ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}">
            ${multiplier}
          </span>
        </div>

        <!-- Timer -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-400">⏱️</span>
          <span id="grill-timer-val" class="font-mono text-base font-extrabold ${timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-cyan-600 dark:text-cyan-400'}">${timeLeft}s</span>
        </div>
      </div>

      <!-- Timer progress bar -->
      <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-6 border border-slate-200/40 dark:border-slate-700/40">
        <div id="grill-timer-bar" class="h-full bg-cyan-500 transition-all duration-1000" style="width: ${(timeLeft / q.timeLimitSeconds) * 100}%"></div>
      </div>

      <!-- Question Card -->
      <div class="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl transition-all">
        <div class="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-slate-800 mb-5 select-none">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25">${q.category}</span>
            <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">${q.tier}</span>
          </div>
          <span class="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">Q ${currentIndex + 1} of ${totalQuestions}</span>
        </div>

        <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-snug mb-6">${q.question}</h3>

        <!-- Options -->
        <div class="space-y-3">
          ${q.options.map((opt, oIdx) => {
            const letter = String.fromCharCode(65 + oIdx);
            let optStyle = 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm';
            if (isAnswered) {
              if (opt.isCorrect) {
                optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-semibold';
              } else if (selectedOptionId === opt.id) {
                optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/30 font-semibold';
              } else {
                optStyle = 'border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 text-slate-400 dark:text-slate-500 opacity-50';
              }
            }

            return `
              <button class="grill-opt-btn w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition flex items-center justify-between select-none ${optStyle}" data-opt-id="${opt.id}" ${isAnswered ? 'disabled' : ''}>
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shrink-0">
                    ${letter}
                  </span>
                  <span>${opt.text}</span>
                </div>
                ${isAnswered && opt.isCorrect ? '<span class="text-emerald-500 font-bold font-mono">✓ CORRECT</span>' : ''}
                ${isAnswered && selectedOptionId === opt.id && !opt.isCorrect ? '<span class="text-rose-500 font-bold font-mono">✕ MISSED</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Explanation if answered -->
        ${isAnswered ? `
          <div class="mt-5 p-4 rounded-xl text-xs sm:text-sm leading-relaxed animate-fade-in ${
            q.options.find(o => o.id === selectedOptionId)?.isCorrect 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-200' 
              : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-900 dark:text-rose-200'
          }">
            <div class="font-bold mb-1">${q.options.find(o => o.id === selectedOptionId)?.isCorrect ? '🎯 Bullseye!' : '❌ Dinged on this question!'}</div>
            <p>${q.options.find(o => o.isCorrect)?.explanation || ''}</p>
          </div>

          <div class="mt-6 flex justify-end">
            <button class="next-grill-btn bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 active:scale-95 text-sm">
              Next Challenge →
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

export function getDebriefMarkup({
  passed,
  tierBadge,
  tierLabel,
  score,
  maxStreak,
  safeLives,
  sessionHistory
}) {
  return `
    <div class="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div class="bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl text-center transition-all">
        <span class="text-6xl block mb-3 animate-bounce">${passed ? '🍾' : '💼'}</span>
        <span class="text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 font-mono">${passed ? 'SUPERDAY OFFER EXTENDED' : 'INTERVIEW DEBRIEF'}</span>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">${passed ? 'You Passed the Grilling!' : 'Dinged at Superday'}</h2>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
          ${passed ? 'Outstanding mental math, Greeks intuition, and market making speed.' : 'Sharp instincts, but hedge funds require flawless execution under pressure.'}
        </p>

        <!-- Result Card -->
        <div class="my-6 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-center shadow-inner">
          <div class="flex items-center justify-center gap-2 mb-2">
            <span class="text-2xl">${tierBadge}</span>
            <span class="text-lg font-bold text-slate-900 dark:text-white">${tierLabel}</span>
          </div>
          <div class="text-3xl font-black text-amber-500 dark:text-amber-400">${score} <span class="text-base text-slate-400 font-normal">pts</span></div>

          <div class="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div>
              <span class="text-slate-500 dark:text-slate-400 block font-medium">Best Streak</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">${maxStreak} in a row</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block font-medium">Remaining Lives</span>
              <span class="font-bold text-rose-500 dark:text-rose-400">${safeLives} / 3</span>
            </div>
            <div>
              <span class="text-slate-500 dark:text-slate-400 block font-medium">XP Awarded</span>
              <span class="font-bold text-cyan-600 dark:text-cyan-400">+${Math.round(score / 2)} XP</span>
            </div>
          </div>
        </div>

        <!-- Interview Questions Diagnostic Breakdown -->
        ${sessionHistory.length > 0 ? `
          <div class="text-left my-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 class="text-sm font-bold text-slate-900 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span>📋</span> <span>Questions Diagnostic Review (${sessionHistory.length})</span>
            </h3>
            <div class="space-y-3 max-h-72 overflow-y-auto pr-1 select-none">
              ${sessionHistory.map((item, idx) => `
                <div class="p-3.5 rounded-xl border text-xs leading-relaxed ${
                  item.correct 
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200' 
                    : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/30 text-rose-950 dark:text-rose-200'
                }">
                  <div class="flex items-center justify-between font-bold mb-1">
                    <span class="text-slate-800 dark:text-slate-300">Q${idx + 1}: ${item.question}</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      item.correct ? 'bg-emerald-500 text-white dark:text-slate-950' : 'bg-rose-500 text-white'
                    }">
                      ${item.correct ? `+${item.points} pts` : item.timedOut ? 'Timed Out' : 'Missed'}
                    </span>
                  </div>
                  ${!item.correct && item.chosenText ? `
                    <p class="text-rose-700 dark:text-rose-300 text-[11px] mt-0.5 font-medium">Your answer: ✕ ${item.chosenText}</p>
                  ` : ''}
                  ${!item.correct && item.correctText ? `
                    <p class="text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold mt-0.5">Correct answer: ✓ ${item.correctText}</p>
                  ` : ''}
                  <p class="text-slate-500 dark:text-slate-400 text-[11px] mt-1 italic leading-normal">${item.explanation || ''}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="flex items-center justify-center gap-3 mt-4">
          <button class="retry-btn bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3 rounded-xl shadow-lg shadow-amber-500/25 transition active:scale-95 text-sm">
            🔥 Grill Me Again
          </button>
          <button class="exit-btn bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-5 py-3 rounded-xl transition text-sm border border-slate-200 dark:border-slate-700 shadow-sm">
            Back to Catalog
          </button>
        </div>
      </div>
    </div>
  `;
}
