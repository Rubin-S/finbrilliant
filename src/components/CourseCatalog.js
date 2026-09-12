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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      
      <!-- Top Micro-Framing Tags -->
      <div class="flex items-center justify-between text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-6 select-none border-b border-white/10 pb-3">
        <span>CURRICULUM ATLAS / THE 6 REALMS</span>
        <span>FIRST-PRINCIPLES PEDAGOGY</span>
      </div>

      <!-- Hero Banner with Editorial Visual Artwork -->
      <div class="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/15 p-8 sm:p-10 lg:p-12 mb-12 shadow-2xl transition-all">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div class="lg:col-span-7">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-[10px] font-mono tracking-widest uppercase text-slate-300 mb-4 select-none">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              <span>INTERACTIVE FINANCIAL REASONING</span>
            </div>

            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide uppercase text-white leading-tight">
              Master Finance from <br class="hidden sm:inline" />
              <span class="font-serif italic lowercase tracking-normal text-slate-200">first principles</span>.
            </h1>

            <p class="mt-4 aee-editorial-serif text-base sm:text-lg text-slate-300 italic leading-relaxed max-w-xl">
              No dry accounting textbooks. No passive video lectures. Touch the order book, manipulate Black-Scholes Greeks, discount cash flows, and balance the efficient frontier in real time.
            </p>
            
            <div class="mt-8 flex flex-wrap items-center gap-3">
              <button class="hero-start-btn px-5 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase border border-white bg-white text-black font-bold hover:bg-slate-200 transition active:scale-95 flex items-center gap-2 select-none cursor-pointer">
                <span>Start First Lesson</span>
                <span>→</span>
              </button>
              <button class="hero-grill-btn px-5 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase border border-white/20 bg-transparent text-slate-300 hover:text-white hover:border-white/40 transition flex items-center gap-2 select-none cursor-pointer">
                <span>Superday Grill Arena</span>
                <span>→</span>
              </button>
            </div>

            <!-- Quantitative Telemetry Bar -->
            <div class="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-8 text-xs text-slate-400 select-none font-mono">
              <div class="flex items-center gap-2">
                <span class="font-bold text-white tabular-nums text-sm">${COURSES.length}</span>
                <span class="text-[10px] tracking-wider uppercase">Core Tracks</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-white tabular-nums text-sm">${totalLessonsCount}</span>
                <span class="text-[10px] tracking-wider uppercase">Interactive Models</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-white tabular-nums text-sm">${profile.streak}D</span>
                <span class="text-[10px] tracking-wider uppercase">Active Streak</span>
              </div>
            </div>
          </div>

          <!-- Editorial Hero Artwork -->
          <div class="lg:col-span-5 relative">
            <div class="relative rounded-xl overflow-hidden border border-white/15 shadow-2xl group">
              <img 
                src="./assets/quant_terminal_hero.jpg" 
                alt="FinBrilliant Quantitative Analytics Interface" 
                class="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105 filter grayscale contrast-125"
                loading="eager"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div class="flex items-center justify-between w-full text-[10px] font-mono tracking-widest text-slate-300 uppercase select-none">
                  <span class="flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>QUANT ENGINE SIMULATION</span>
                  </span>
                  <span class="text-slate-400">STATUS: ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Asymmetric Bento Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-14">
        <!-- Daily Boost Callout -->
        <div class="lg:col-span-5 p-6 rounded-xl bg-white/[0.02] border border-white/15 hover:border-white/40 flex flex-col justify-between cursor-pointer group transition shadow-xl card-modern select-none" data-nav="boost">
          <div>
            <div class="flex items-start justify-between gap-4 mb-4">
              <span class="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded border border-white/20 text-slate-300 bg-white/5">
                01 / DAILY CHALLENGE
              </span>
              <span class="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                2X XP ACTIVE
              </span>
            </div>
            <div>
              <span class="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1">Daily Challenge Arena</span>
              <h3 class="text-lg font-medium text-white tracking-wide uppercase group-hover:text-slate-200 transition">
                Quantitative Daily Boost
              </h3>
              <p class="aee-editorial-serif text-sm text-slate-400 italic mt-2 leading-relaxed">
                Solve today's quantitative micro-puzzle to preserve your ${profile.streak}-day streak and collect double XP.
              </p>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono tracking-wider uppercase text-slate-300 group-hover:text-white">
            <span>Solve Daily Boost</span>
            <span class="group-hover:translate-x-1 transition">→</span>
          </div>
        </div>

        <!-- Grill Me Arena Callout -->
        <div class="lg:col-span-4 p-6 rounded-xl bg-white/[0.02] border border-white/15 hover:border-white/40 flex flex-col justify-between cursor-pointer group transition shadow-xl card-modern select-none" data-nav="grill">
          <div>
            <div class="flex items-start justify-between gap-4 mb-4">
              <span class="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded border border-white/20 text-slate-300 bg-white/5">
                02 / TECHNICAL ARENA
              </span>
              <span class="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                25S RAPID-FIRE
              </span>
            </div>
            <div>
              <span class="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1">Technical Interview Arena</span>
              <h3 class="text-lg font-medium text-white tracking-wide uppercase group-hover:text-slate-200 transition">
                Wall Street Superday
              </h3>
              <p class="aee-editorial-serif text-sm text-slate-400 italic mt-2 leading-relaxed">
                High score: <strong class="font-mono tabular-nums font-normal text-white">${profile.grillStats?.highScore || 0} PTS</strong>. 3 strikes. Mental math and options Greeks under pressure.
              </p>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono tracking-wider uppercase text-slate-300 group-hover:text-white">
            <span>Enter Arena</span>
            <span class="group-hover:translate-x-1 transition">→</span>
          </div>
        </div>

        <!-- Goals Callout -->
        <div class="lg:col-span-3 p-6 rounded-xl bg-white/[0.02] border border-white/15 hover:border-white/40 flex flex-col justify-between cursor-pointer group transition shadow-xl card-modern select-none" data-nav="goal">
          <div>
            <div class="flex items-start justify-between gap-4 mb-4">
              <span class="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded border border-white/20 text-slate-300 bg-white/5">
                03 / MASTERY
              </span>
              <span class="text-xs font-mono text-white tabular-nums">
                ${profile.weeklyGoal.completedThisWeek}/${profile.weeklyGoal.targetLessons}
              </span>
            </div>
            <div>
              <span class="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1">Weekly Commitment</span>
              <h3 class="text-lg font-medium text-white tracking-wide uppercase group-hover:text-slate-200 transition">
                Mastery Hub
              </h3>
              <div class="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden border border-white/10">
                <div class="bg-white h-full rounded-full transition-all duration-300" style="width: ${Math.min(100, Math.round((profile.weeklyGoal.completedThisWeek / profile.weeklyGoal.targetLessons) * 100))}%"></div>
              </div>
            </div>
          </div>
          <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono tracking-wider uppercase text-slate-300 group-hover:text-white">
            <span>View Goals</span>
            <span class="group-hover:translate-x-1 transition">→</span>
          </div>
        </div>
      </div>

      <!-- Course Tracks Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-3 border-b border-white/10 pb-4">
        <div>
          <div class="text-[10px] font-mono tracking-widest uppercase text-slate-400 mb-1">CURRICULUM ARCHITECTURE</div>
          <h2 class="text-2xl sm:text-3xl font-light tracking-wide uppercase text-white">Six Foundational Disciplines</h2>
        </div>
        <div class="text-xs text-slate-400 bg-white/5 px-3.5 py-1.5 rounded border border-white/15 self-start sm:self-auto select-none font-mono">
          COMPLETED: <strong class="text-white font-bold">${completedTracksCount}</strong> / ${COURSES.length} TRACKS <span class="text-slate-500">(${completedLessons.length}/${totalLessonsCount} LESSONS)</span>
        </div>
      </div>

      <!-- Course Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${COURSES.map((course, idx) => {
          const totalLessons = course.lessons.length;
          const completedCount = course.lessons.filter(l => completedLessons.includes(l.id)).length;
          const pct = Math.round((completedCount / totalLessons) * 100);
          const courseNum = String(idx + 1).padStart(2, '0');

          return `
            <div class="course-card rounded-xl bg-white/[0.02] border border-white/15 hover:border-white/40 p-6 flex flex-col justify-between shadow-xl transition hover:-translate-y-0.5 group">
              <div>
                <div class="flex items-start justify-between gap-3 mb-4 select-none">
                  <span class="text-xs font-mono tracking-widest px-2.5 py-1 rounded bg-white/5 border border-white/20 text-white font-bold">${courseNum} / ${course.category.toUpperCase()}</span>
                  <div class="flex flex-col items-end gap-1">
                    <span class="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-white/15 text-slate-300">${course.level.toUpperCase()}</span>
                    <span class="text-[10px] font-mono text-slate-400">${course.estimatedMinutes} MIN</span>
                  </div>
                </div>

                <h3 class="text-base sm:text-lg font-medium tracking-wide uppercase text-white group-hover:text-slate-200 transition leading-snug">${course.title}</h3>
                <p class="aee-editorial-serif text-xs sm:text-sm text-slate-400 italic mt-2.5 leading-relaxed">${course.description}</p>
              </div>

              <div class="mt-6 pt-4 border-t border-white/10">
                <!-- Progress bar -->
                <div class="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 select-none font-mono">
                  <span>MASTERY PROGRESS</span>
                  <span class="font-bold tabular-nums text-white">${pct}%</span>
                </div>
                <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-4 border border-white/10">
                  <div class="h-full bg-white rounded-full transition-all duration-300" style="width: ${pct}%"></div>
                </div>

                <!-- Lessons List -->
                <div class="space-y-2 select-none">
                  ${course.lessons.map((lesson, lIdx) => {
                    const isDone = completedLessons.includes(lesson.id);
                    const stepNum = String(lIdx + 1).padStart(2, '0');
                    return `
                      <button class="lesson-item-btn w-full p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 flex items-center justify-between text-left transition cursor-pointer" data-lesson-id="${lesson.id}">
                        <div class="flex items-center gap-2.5">
                          <span class="text-[10px] font-mono ${isDone ? 'text-white font-bold' : 'text-slate-500'}">
                            [${isDone ? '✓' : stepNum}]
                          </span>
                          <span class="text-xs font-medium text-slate-200">${lesson.title}</span>
                        </div>
                        <span class="text-[10px] font-mono text-slate-400">+${lesson.xp} XP</span>
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
