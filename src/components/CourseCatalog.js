/**
 * Course Catalog View
 * High-End Quantitative Curriculum Hub.
 * Features first-principles interactive learning tracks,
 * editorial hero presentation, asymmetric bento layout, and crisp lesson trees.
 */

import { COURSES } from '../data/courses.js';
import { soundEngine } from '../audio.js';
import { staggerCardEntrance } from '../utils/motion.js';

export function renderCourseCatalog(container, state, onStartLesson, onNavigate) {
  const profile = state.profile;
  const completedLessons = profile.completedLessons || [];

  const totalLessonsCount = COURSES.reduce((acc, c) => acc + c.lessons.length, 0);
  const completedTracksCount = COURSES.filter(c => c.lessons.every(l => completedLessons.includes(l.id))).length;

  container.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <!-- Hero Banner with Editorial Visual Artwork -->
      <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 lg:p-12 mb-10 shadow-sm dark:shadow-2xl transition-all glass-panel">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div class="lg:col-span-7">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-4 select-none">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Interactive First-Principles Finance</span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Master Finance from <br class="hidden sm:inline" />
              <span class="text-emerald-600 dark:text-emerald-400">First Principles</span>.
            </h1>

            <p class="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              No dry accounting textbooks. No passive video lectures. Touch the order book, manipulate Black-Scholes Greeks, discount cash flows, and balance the Markowitz efficient frontier in real time.
            </p>
            
            <div class="mt-8 flex flex-wrap items-center gap-3">
              <button class="hero-start-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center gap-2 text-sm select-none">
                <span>⚡ Start First Lesson</span>
                <span>→</span>
              </button>
              <button class="hero-grill-btn bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold px-5 py-3 rounded-2xl transition flex items-center gap-2 text-sm shadow-sm select-none">
                <span>🔥 Superday Grill Arena</span>
              </button>
            </div>

            <!-- Quantitative Telemetry Bar -->
            <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 select-none">
              <div class="flex items-center gap-2">
                <span class="font-mono font-black text-slate-900 dark:text-white tabular-nums text-sm">${COURSES.length}</span>
                <span>Core Tracks</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-mono font-black text-emerald-600 dark:text-emerald-400 tabular-nums text-sm">${totalLessonsCount}</span>
                <span>Interactive Simulations</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-mono font-black text-amber-500 tabular-nums text-sm">🔥 ${profile.streak}d</span>
                <span>Daily Streak</span>
              </div>
            </div>
          </div>

          <!-- Editorial Hero Artwork -->
          <div class="lg:col-span-5 relative">
            <div class="relative rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-2xl group">
              <img 
                src="./assets/quant_terminal_hero.jpg" 
                alt="FinBrilliant Quantitative Analytics Interface" 
                class="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <div class="flex items-center justify-between w-full text-[11px] font-mono text-emerald-400 select-none">
                  <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>QUANT SIMULATION ENGINE</span>
                  </span>
                  <span class="text-slate-300">LIVE FEED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Asymmetric Bento Grid (Anti-slop rhythm: 5 / 4 / 3 column split) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-12">
        <!-- Daily Boost Callout (Prominent, col-span-5) -->
        <div class="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 flex flex-col justify-between cursor-pointer group transition shadow-sm dark:shadow-xl card-modern select-none" data-nav="boost">
          <div>
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-105 transition border border-emerald-500/20">
                ⚡
              </div>
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-mono font-bold tracking-wider uppercase border border-emerald-500/25">
                2X XP Multiplier
              </span>
            </div>
            <div>
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Daily Challenge Arena</span>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition mt-1">
                Quantitative Daily Boost
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Solve today's quantitative micro-puzzle to preserve your ${profile.streak}-day streak and collect double XP.
              </p>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span>Solve Daily Boost</span>
            <span class="group-hover:translate-x-1 transition font-mono">→</span>
          </div>
        </div>

        <!-- Grill Me Arena Callout (High-intensity, col-span-4) -->
        <div class="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/40 dark:hover:border-amber-500/40 flex flex-col justify-between cursor-pointer group transition shadow-sm dark:shadow-xl card-modern select-none" data-nav="grill">
          <div>
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl group-hover:scale-105 transition border border-amber-500/20">
                🔥
              </div>
              <span class="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-mono font-bold tracking-wider uppercase border border-amber-500/25">
                25s Rapid-Fire
              </span>
            </div>
            <div>
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Technical Interview Arena</span>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition mt-1">
                Wall Street Superday
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                High score: <strong class="font-mono tabular-nums font-bold">${profile.grillStats?.highScore || 0} pts</strong> • 3 Lives • Mental math & Greeks
              </p>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>Enter Arena</span>
            <span class="group-hover:translate-x-1 transition font-mono">→</span>
          </div>
        </div>

        <!-- Goals Callout (Compact, col-span-3) -->
        <div class="lg:col-span-3 p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-cyan-500/40 dark:hover:border-cyan-500/40 flex flex-col justify-between cursor-pointer group transition shadow-sm dark:shadow-xl card-modern select-none" data-nav="goal">
          <div>
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-2xl group-hover:scale-105 transition border border-cyan-500/20">
                🎯
              </div>
              <span class="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono tabular-nums">
                ${profile.weeklyGoal.completedThisWeek}/${profile.weeklyGoal.targetLessons}
              </span>
            </div>
            <div>
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Weekly Target</span>
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition mt-1">
                Mastery Hub
              </h3>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
                <div class="bg-cyan-500 h-full rounded-full transition-all duration-300" style="width: ${Math.min(100, Math.round((profile.weeklyGoal.completedThisWeek / profile.weeklyGoal.targetLessons) * 100))}%"></div>
              </div>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400">
            <span>View Goals</span>
            <span class="group-hover:translate-x-1 transition font-mono">→</span>
          </div>
        </div>
      </div>

      <!-- Course Tracks Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3">
        <div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Core Curriculum</h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">6 interactive tracks spanning foundational finance to institutional quant trading</p>
        </div>
        <div class="text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm self-start sm:self-auto select-none font-mono">
          Completed: <strong class="text-emerald-600 dark:text-emerald-400 font-bold">${completedTracksCount}</strong> / ${COURSES.length} Tracks <span class="text-slate-400">(${completedLessons.length}/${totalLessonsCount} Lessons)</span>
        </div>
      </div>

      <!-- Course Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${COURSES.map(course => {
          const totalLessons = course.lessons.length;
          const completedCount = course.lessons.filter(l => completedLessons.includes(l.id)).length;
          const pct = Math.round((completedCount / totalLessons) * 100);

          return `
            <div class="course-card rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 p-6 sm:p-7 flex flex-col justify-between shadow-sm dark:shadow-xl transition hover:-translate-y-1 group">
              <div>
                <div class="flex items-start justify-between gap-3 mb-4 select-none">
                  <span class="text-3xl p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 group-hover:scale-105 transition">${course.icon}</span>
                  <div class="flex flex-col items-end gap-1">
                    <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      course.level === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                      course.level === 'Intermediate' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }">${course.level}</span>
                    <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">${course.estimatedMinutes} min</span>
                  </div>
                </div>

                <span class="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase block mb-1">${course.category}</span>
                <h3 class="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug tracking-tight">${course.title}</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">${course.description}</p>
              </div>

              <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <!-- Progress bar -->
                <div class="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5 select-none font-mono">
                  <span>Progress</span>
                  <span class="font-bold tabular-nums ${pct === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}">${pct}%</span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-4 border border-slate-200/50 dark:border-slate-700/40">
                  <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300" style="width: ${pct}%"></div>
                </div>

                <!-- Lessons List -->
                <div class="space-y-2 select-none">
                  ${course.lessons.map(lesson => {
                    const isDone = completedLessons.includes(lesson.id);
                    return `
                      <button class="lesson-item-btn w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-left transition active:scale-98" data-lesson-id="${lesson.id}">
                        <div class="flex items-center gap-2.5">
                          <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold ${isDone ? 'bg-emerald-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}">
                            ${isDone ? '✓' : '•'}
                          </span>
                          <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">${lesson.title}</span>
                        </div>
                        <span class="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400">+${lesson.xp} XP</span>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Bind interactions
  const firstLesson = COURSES[0].lessons[0].id;
  const startHeroBtn = container.querySelector('.hero-start-btn');
  if (startHeroBtn) {
    startHeroBtn.onclick = () => {
      soundEngine.playClick();
      onStartLesson(firstLesson);
    };
  }

  const grillHeroBtn = container.querySelector('.hero-grill-btn');
  if (grillHeroBtn) {
    grillHeroBtn.onclick = () => {
      soundEngine.playClick();
      onNavigate('grill');
    };
  }

  container.querySelectorAll('[data-nav]').forEach(el => {
    el.onclick = () => {
      soundEngine.playClick();
      onNavigate(el.getAttribute('data-nav'));
    };
  });

  container.querySelectorAll('.lesson-item-btn').forEach(btn => {
    btn.onclick = () => {
      soundEngine.playClick();
      const lessonId = btn.getAttribute('data-lesson-id');
      onStartLesson(lessonId);
    };
  });

  // Staggered subtle card reveal via Motion.dev
  staggerCardEntrance(container, '.card-modern, .course-card');
}
