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
    <div class="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <!-- Top Micro-Framing Tags -->
      <div class="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-6 select-none border-b border-white/10 pb-3">
        <span>WALL STREET SUPERDAY / TECHNICAL INTERVIEW ARENA</span>
        <span>QUESTION ${currentIndex + 1} OF ${totalQuestions}</span>
      </div>

      <!-- Top Status Bar -->
      <div class="flex items-center justify-between bg-white/[0.02] border border-white/15 rounded-xl px-5 py-3 mb-4 shadow-xl">
        <!-- Strikes / Lives -->
        <div class="flex items-center gap-2">
          <span class="text-[10px] font-mono uppercase tracking-widest text-slate-400 mr-1">STRIKES:</span>
          ${Array.from({ length: 3 }).map((_, i) => `
            <span class="text-xs font-mono tracking-wider ${i < lives ? 'text-white font-bold' : 'text-slate-600 line-through'}">
              [● ${i + 1}]
            </span>
          `).join('')}
        </div>

        <!-- Score & Multiplier -->
        <div class="flex items-center gap-3">
          <div class="text-right">
            <span class="text-[9px] uppercase font-mono tracking-widest text-slate-400">SCORE</span>
            <p class="text-sm font-mono font-bold text-white leading-none">${score} PTS</p>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider border ${streak >= 2 ? 'border-white bg-white text-black' : 'border-white/20 bg-white/5 text-slate-400'}">
            ${multiplier}
          </span>
        </div>

        <!-- Timer -->
        <div class="flex items-center gap-2 font-mono">
          <span class="text-[10px] uppercase tracking-widest text-slate-400">TIME:</span>
          <span id="grill-timer-val" class="text-sm font-bold ${timeLeft <= 5 ? 'text-white font-black underline animate-pulse' : 'text-white'}">${timeLeft}S</span>
        </div>
      </div>

      <!-- Timer progress bar -->
      <div class="w-full bg-white/10 h-[2px] rounded-full overflow-hidden mb-8 border border-white/10">
        <div id="grill-timer-bar" class="h-full bg-white transition-all duration-1000" style="width: ${(timeLeft / q.timeLimitSeconds) * 100}%"></div>
      </div>

      <!-- Question Card -->
      <div class="bg-white/[0.02] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all">
        <div class="flex items-center justify-between pb-3.5 border-b border-white/10 mb-6 select-none">
          <div class="flex items-center gap-2">
            <span class="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-white/20 text-slate-300 bg-white/5">${q.category.toUpperCase()}</span>
            <span class="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-white/15 text-slate-400">${q.tier.toUpperCase()}</span>
          </div>
          <span class="text-xs font-mono text-slate-400">Q ${currentIndex + 1} / ${totalQuestions}</span>
        </div>

        <h3 class="text-lg sm:text-xl font-light uppercase tracking-wide text-white leading-snug mb-6">${q.question}</h3>

        <!-- Options -->
        <div class="space-y-3">
          ${q.options.map((opt, oIdx) => {
            const letter = String.fromCharCode(65 + oIdx);
            let optStyle = 'border-white/15 bg-white/[0.02] hover:bg-white/5 hover:border-white/30 text-slate-200';
            if (isAnswered) {
              if (opt.isCorrect) {
                optStyle = 'border-white bg-white/15 text-white ring-1 ring-white font-bold';
              } else if (selectedOptionId === opt.id) {
                optStyle = 'border-slate-600 bg-white/[0.01] text-slate-400';
              } else {
                optStyle = 'border-white/5 bg-transparent text-slate-600 opacity-40';
              }
            }

            return `
              <button class="grill-opt-btn w-full p-4 rounded-lg border text-left text-xs sm:text-sm font-mono tracking-wide transition flex items-center justify-between select-none cursor-pointer ${optStyle}" data-opt-id="${opt.id}" ${isAnswered ? 'disabled' : ''}>
                <div class="flex items-center gap-3">
                  <span class="w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold border border-white/20 bg-white/5 text-slate-300 shrink-0">
                    ${letter}
                  </span>
                  <span>${opt.text}</span>
                </div>
                ${isAnswered && opt.isCorrect ? '<span class="text-white font-bold font-mono text-xs tracking-wider uppercase">[✓ VERIFIED]</span>' : ''}
                ${isAnswered && selectedOptionId === opt.id && !opt.isCorrect ? '<span class="text-slate-400 font-mono text-xs tracking-wider uppercase">[✕ MISSED]</span>' : ''}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Explanation if answered -->
        ${isAnswered ? `
          <div class="mt-6 p-5 rounded-lg text-xs leading-relaxed animate-fade-in font-mono border ${
            q.options.find(o => o.id === selectedOptionId)?.isCorrect 
              ? 'border-white/40 bg-white/10 text-white' 
              : 'border-white/20 bg-white/5 text-slate-300'
          }">
            <div class="font-bold mb-1 tracking-wider uppercase">
              ${q.options.find(o => o.id === selectedOptionId)?.isCorrect ? 'STATUS: VERIFIED CORRECT' : 'STATUS: INTERVIEW DIAGNOSTIC'}
            </div>
            <p class="mt-1 leading-relaxed text-slate-300">${q.options.find(o => o.isCorrect)?.explanation || ''}</p>
          </div>

          <div class="mt-6 flex justify-end">
            <button class="next-grill-btn px-6 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase border border-white bg-white text-black font-bold hover:bg-slate-200 transition cursor-pointer">
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
      <div class="bg-white/[0.02] border border-white/15 rounded-2xl p-6 sm:p-10 shadow-2xl text-center transition-all">
        <span class="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded border border-white/20 text-slate-300 bg-white/5 inline-block mb-3">
          ${passed ? 'SUPERDAY OFFER EXTENDED' : 'INTERVIEW DEBRIEF'}
        </span>
        <h2 class="text-2xl sm:text-3xl font-light uppercase tracking-wide text-white mt-1">
          ${passed ? 'Offer Extended: Superday Cleared' : 'Dinged at Superday'}
        </h2>
        <p class="aee-editorial-serif text-base text-slate-300 italic mt-2 leading-relaxed">
          ${passed ? 'Flawless mental math, Greeks intuition, and market-making velocity under pressure.' : 'Sharp instincts, but institutional quantitative desks require zero execution errors under pressure.'}
        </p>

        <!-- Result Card -->
        <div class="my-6 p-6 rounded-xl bg-white/[0.03] border border-white/15 text-center shadow-inner">
          <div class="flex items-center justify-center gap-2 mb-2 font-mono text-sm tracking-wider uppercase text-slate-300">
            <span>[RANK]</span>
            <span class="font-bold text-white">${tierLabel}</span>
          </div>
          <div class="text-4xl font-mono font-bold text-white tracking-tight">${score} <span class="text-sm text-slate-400 font-normal">PTS</span></div>

          <div class="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/10 text-xs font-mono">
            <div>
              <span class="text-slate-500 block text-[10px] tracking-widest uppercase">BEST STREAK</span>
              <span class="font-bold text-white text-sm">${maxStreak} IN A ROW</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px] tracking-widest uppercase">STRIKES LEFT</span>
              <span class="font-bold text-white text-sm">${safeLives} / 3</span>
            </div>
            <div>
              <span class="text-slate-500 block text-[10px] tracking-widest uppercase">XP AWARDED</span>
              <span class="font-bold text-white text-sm">+${Math.round(score / 2)} XP</span>
            </div>
          </div>
        </div>

        <!-- Interview Questions Diagnostic Breakdown -->
        ${sessionHistory.length > 0 ? `
          <div class="text-left my-6 pt-4 border-t border-white/10 font-mono">
            <h3 class="text-xs uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <span>QUESTIONS DIAGNOSTIC REVIEW (${sessionHistory.length})</span>
            </h3>
            <div class="space-y-3 max-h-72 overflow-y-auto pr-1 select-none">
              ${sessionHistory.map((item, idx) => `
                <div class="p-4 rounded-lg border text-xs leading-relaxed ${
                  item.correct 
                    ? 'bg-white/5 border-white/20 text-slate-200' 
                    : 'bg-white/[0.01] border-white/10 text-slate-400'
                }">
                  <div class="flex items-center justify-between font-bold mb-1">
                    <span class="text-white">Q${idx + 1}: ${item.question}</span>
                    <span class="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase ${
                      item.correct ? 'bg-white text-black' : 'border border-white/20 text-slate-400'
                    }">
                      ${item.correct ? `+${item.points} PTS` : item.timedOut ? 'TIMED OUT' : 'MISSED'}
                    </span>
                  </div>
                  ${!item.correct && item.chosenText ? `
                    <p class="text-slate-400 text-[11px] mt-0.5 font-mono">Your answer: [✕] ${item.chosenText}</p>
                  ` : ''}
                  ${!item.correct && item.correctText ? `
                    <p class="text-white text-[11px] font-mono mt-0.5">Correct answer: [✓] ${item.correctText}</p>
                  ` : ''}
                  <p class="text-slate-400 text-[11px] mt-1 aee-editorial-serif italic leading-normal">${item.explanation || ''}</p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="flex items-center justify-center gap-4 mt-6">
          <button class="retry-btn px-6 py-3 rounded-lg text-xs font-mono tracking-wider uppercase border border-white bg-white text-black font-bold hover:bg-slate-200 transition active:scale-95 cursor-pointer">
            Grill Me Again →
          </button>
          <button class="exit-btn px-5 py-3 rounded-lg text-xs font-mono tracking-wider uppercase border border-white/20 bg-transparent text-slate-300 hover:text-white hover:border-white/40 transition cursor-pointer">
            Back to Curriculum
          </button>
        </div>
      </div>
    </div>
  `;
}
