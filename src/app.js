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
      <div class="aee-root min-h-screen flex flex-col bg-[#060709] text-[#f8fafc] transition-colors duration-200 font-sans selection:bg-white/20 selection:text-white">
        <div id="navbar-mount"></div>
        <main id="view-mount" class="flex-1 pb-24 sm:pb-28"></main>
        <footer class="py-12 pb-36 border-t border-white/10 bg-black/40 backdrop-blur-md text-xs text-slate-400 select-none">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="flex flex-col sm:flex-row items-center gap-3">
                <a href="#/" class="text-sm font-semibold tracking-[0.2em] uppercase text-white hover:text-slate-300 transition">
                  ALL ELSE EQUAL
                </a>
                <span class="hidden sm:inline text-white/20">|</span>
                <span class="aee-editorial-serif text-xs text-slate-400 italic">Understand what changes when one thing does.</span>
              </div>

              <div class="flex flex-wrap items-center justify-center gap-6 text-xs font-mono tracking-wider uppercase text-slate-400">
                <a href="#/courses" class="hover:text-white transition">Curriculum</a>
                <a href="#/boost" class="hover:text-white transition">Dialectic</a>
                <a href="#/grill-me" class="hover:text-white transition">Superday</a>
                <a href="#/goal" class="hover:text-white transition">Dossier</a>
                <a href="#/lab" class="hover:text-white transition">Laboratory</a>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono tracking-wider uppercase">
              <p>ALL ELSE EQUAL (FINBRILLIANT). FIRST-PRINCIPLES FINANCIAL SYSTEMS.</p>
              <p>FOUNDATIONAL PEDAGOGY AND INTERVIEW RIGOR. NOT INVESTMENT ADVICE.</p>
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
