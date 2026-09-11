/**
 * Main Application Orchestrator & State Coordinator
 * Handles view routing (including /grill-me, /boost, /goal, /lab),
 * storage synchronization, and view mounts.
 */

import { StorageManager } from './storage.js';
import { soundEngine } from './audio.js';
import { renderNavbar } from './components/Navbar.js';
import { renderHomePage } from './components/HomePage.js';
import { renderCourseCatalog } from './components/CourseCatalog.js';
import { renderLessonViewer } from './components/LessonViewer.js';
import { renderGrillMeView } from './components/GrillMeView.js';
import { renderGoalView } from './components/GoalView.js';
import { renderBoostView } from './components/BoostView.js';
import { renderLabView } from './components/LabView.js';
import { animateViewEntrance } from './utils/motion.js';
import { initSmoothScroll } from './utils/smoothScroll.js';

export class App {
  constructor(rootElement) {
    this.root = rootElement;
    this.storage = new StorageManager();
    this.state = {
      profile: this.storage.loadProfile(),
      currentView: 'home',
      activeLessonId: null
    };

    // Apply saved audio and theme preferences
    soundEngine.enabled = this.state.profile.soundEnabled;
    this.applyTheme(this.state.profile.theme);

    this.activeViewCleanup = null;
    this.handleHashRouting = this.handleHashRouting.bind(this);
  }

  init() {
    initSmoothScroll();
    window.addEventListener('hashchange', this.handleHashRouting);
    window.addEventListener('popstate', this.handleHashRouting);
    this.handleHashRouting();
  }

  handleHashRouting() {
    let route = window.location.hash.replace('#/', '').replace('#', '').trim();
    if (!route && typeof window !== 'undefined' && window.location.pathname) {
      const path = window.location.pathname.replace(/^\/+/, '').trim();
      if (path && path !== 'index.html') {
        route = path;
      }
    }

    if (!route || route === 'home') {
      this.navigate('home', null, false);
    } else if (route === 'courses') {
      this.navigate('courses', null, false);
    } else if (route === 'grill' || route === 'grill-me') {
      this.navigate('grill', null, false);
    } else if (route === 'boost') {
      this.navigate('boost', null, false);
    } else if (route === 'goal' || route === 'goals') {
      this.navigate('goal', null, false);
    } else if (route === 'lab') {
      this.navigate('lab', null, false);
    } else if (route.startsWith('lesson/')) {
      const lessonId = route.split('lesson/')[1];
      this.navigate('lesson', lessonId, false);
    } else {
      this.navigate('home', null, false);
    }
  }

  applyTheme(theme) {
    if (typeof document === 'undefined') return;
    const isDark = theme !== 'light';
    const root = document.documentElement;
    root.classList.toggle('dark', isDark);
    root.classList.toggle('light', !isDark);
    document.body.classList.toggle('theme-light', !isDark);
    document.body.classList.toggle('theme-dark', isDark);
    try {
      root.style.colorScheme = isDark ? 'dark' : 'light';
    } catch (e) {}
  }

  navigate(view, lessonId = null, updateHash = true) {
    if (this.activeViewCleanup && typeof this.activeViewCleanup === 'function') {
      try {
        this.activeViewCleanup();
      } catch (err) {
        console.warn('Error during view cleanup:', err);
      }
      this.activeViewCleanup = null;
    }

    this.state.currentView = view;
    this.state.activeLessonId = lessonId;

    if (updateHash) {
      if (view === 'home') {
        window.location.hash = '#/';
      } else if (view === 'lesson' && lessonId) {
        window.location.hash = `#/lesson/${lessonId}`;
      } else if (view === 'grill') {
        window.location.hash = '#/grill-me';
      } else {
        window.location.hash = `#/${view}`;
      }
    }

    this.render();
  }

  render() {
    if (this.activeViewCleanup && typeof this.activeViewCleanup === 'function') {
      try {
        this.activeViewCleanup();
      } catch (err) {
        console.warn('Error during view cleanup:', err);
      }
      this.activeViewCleanup = null;
    }

    if (this.state.currentView === 'home') {
      this.activeViewCleanup = renderHomePage(
        this.root,
        this.state,
        (view, lessonId = null) => this.navigate(view, lessonId),
        () => {
          const nextTheme = this.storage.toggleTheme();
          this.state.profile.theme = nextTheme;
          this.applyTheme(nextTheme);
          return nextTheme;
        }
      );
      return;
    }

    this.root.innerHTML = `
      <div class="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans selection:bg-emerald-500/20 selection:text-emerald-800 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-200 fin-grid-backdrop">
        <div id="navbar-mount"></div>
        <main id="view-mount" class="flex-1 pb-24 sm:pb-28"></main>
        <footer class="py-10 pb-32 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/90 backdrop-blur-md text-xs text-slate-500 dark:text-slate-400 transition-colors select-none">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="flex flex-col sm:flex-row items-center gap-3">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 text-xs font-black">
                    ⚡
                  </div>
                  <span class="font-black text-slate-900 dark:text-white text-sm tracking-tight">FinBrilliant</span>
                </div>
                <span class="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
                <span class="text-xs text-slate-500 dark:text-slate-400">First-Principles Quantitative Finance</span>
              </div>

              <div class="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <a href="#/courses" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Courses</a>
                <a href="#/boost" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Daily Boost</a>
                <a href="#/grill-me" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Superday Arena</a>
                <a href="#/goal" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Goals</a>
                <a href="#/lab" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Sandbox Lab</a>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              <p>© 2026 FinBrilliant. Quantitative mechanics, order books, and derivatives from first principles.</p>
              <p>For educational & interview mastery. Not investment advice.</p>
            </div>
          </div>
        </footer>
      </div>
    `;

    // Render Navbar
    const navMount = this.root.querySelector('#navbar-mount');
    renderNavbar(
      navMount,
      this.state,
      (view, lessonId = null) => this.navigate(view, lessonId),
      () => {
        const nextTheme = this.storage.toggleTheme();
        this.state.profile.theme = nextTheme;
        this.applyTheme(nextTheme);
        this.render();
      },
      () => {
        const nextSound = this.storage.toggleSound();
        this.state.profile.soundEnabled = nextSound;
        soundEngine.enabled = nextSound;
        this.render();
      }
    );

    // Render View Content
    const viewMount = this.root.querySelector('#view-mount');
    const { currentView, activeLessonId } = this.state;

    if (currentView === 'courses') {
      renderCourseCatalog(
        viewMount,
        this.state,
        (lessonId) => this.navigate('lesson', lessonId),
        (view) => this.navigate(view)
      );
    } else if (currentView === 'lesson' && activeLessonId) {
      renderLessonViewer(
        viewMount,
        activeLessonId,
        this.state,
        (lessonId, xp) => {
          this.state.profile = this.storage.recordLessonComplete(lessonId, xp);
          this.navigate('courses');
        },
        () => this.navigate('courses')
      );
    } else if (currentView === 'grill') {
      this.activeViewCleanup = renderGrillMeView(
        viewMount,
        this.state,
        (score, streak, passed) => {
          this.state.profile = this.storage.saveGrillScore(score, streak, passed);
        },
        () => this.navigate('courses')
      );
    } else if (currentView === 'goal') {
      renderGoalView(
        viewMount,
        this.state,
        (target) => {
          const profile = this.storage.loadProfile();
          profile.weeklyGoal.targetLessons = target;
          this.storage.saveProfile(profile);
          this.state.profile = profile;
          this.render();
        },
        (view, lessonId = null) => this.navigate(view, lessonId)
      );
    } else if (currentView === 'boost') {
      this.activeViewCleanup = renderBoostView(
        viewMount,
        this.state,
        (boostId, xp) => {
          this.state.profile = this.storage.recordBoostComplete(boostId, xp);
          this.render();
        },
        (view) => this.navigate(view)
      );
    } else if (currentView === 'lab') {
      renderLabView(viewMount, this.state);
    } else {
      this.navigate('courses');
    }

    // Light, professional view entrance transition via Motion.dev
    animateViewEntrance(viewMount);
  }
}
