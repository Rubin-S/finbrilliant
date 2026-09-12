/**
 * Goal & Mastery Dashboard Component (/goal)
 * Weekly commitment calibrator, curriculum mastery across 6 financial pillars,
 * interactive milestone badges, and Wall Street XP rank progression.
 * Clean, minimal, modern UI/UX across Light and Dark themes.
 */

import { getTierForXP } from '../storage.js';
import { COURSES } from '../data/courses.js';
import { soundEngine } from '../audio.js';
import { getGoalBadges, filterGoalBadges } from './goal/goalBadges.js';
import { getGoalViewMarkup } from './goal/goalMarkup.js';

export function renderGoalView(container, state, onUpdateWeeklyGoal = () => {}, onNavigate = () => {}) {
  const profile = state.profile || {};
  const tier = getTierForXP(profile.xp);
  const completedLessons = profile.completedLessons || [];

  // Active badge filter state ('all', 'unlocked', 'locked')
  let activeBadgeFilter = 'all';

  // Calculate pillar mastery percentages & next available lesson
  const pillars = COURSES.map(course => {
    const total = course.lessons.length;
    const done = course.lessons.filter(l => completedLessons.includes(l.id)).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    const nextLesson = course.lessons.find(l => !completedLessons.includes(l.id)) || course.lessons[0];
    return {
      id: course.id,
      title: course.title,
      category: course.category,
      icon: course.icon,
      level: course.level,
      estimatedMinutes: course.estimatedMinutes,
      done,
      total,
      pct,
      nextLessonId: nextLesson?.id || 'compound-101'
    };
  });

  const totalLessonsCount = COURSES.reduce((acc, c) => acc + c.lessons.length, 0);
  const totalCompletedCount = completedLessons.length;
  const overallPct = totalLessonsCount > 0 ? Math.min(100, Math.round((totalCompletedCount / totalLessonsCount) * 100)) : 0;

  const badges = getGoalBadges(profile, completedLessons);
  const targetLessons = profile.weeklyGoal?.targetLessons || 5;
  const completedThisWeek = profile.weeklyGoal?.completedThisWeek || 0;

  // Day index for week tracking (0 = Mon, 6 = Sun)
  const todayDayIndex = (new Date().getDay() + 6) % 7;

  function render() {
    const isGoalAchieved = completedThisWeek >= targetLessons;
    const progressPct = Math.min(100, Math.round((completedThisWeek / targetLessons) * 100));
    const filteredBadges = filterGoalBadges(badges, activeBadgeFilter);

    container.innerHTML = getGoalViewMarkup({
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
    });

    // Bind Target Slider & live sync
    const targetSlider = container.querySelector('.target-slider');
    const progressText = container.querySelector('#goal-progress-text');
    const progressBar = container.querySelector('#goal-progress-bar');
    const goalMsg = container.querySelector('#goal-message');
    const targetLabel = container.querySelector('#target-label');
    const targetMins = container.querySelector('#target-mins-label');

    function updatePresetHighlight(val) {
      container.querySelectorAll('.preset-btn').forEach(btn => {
        const pVal = parseInt(btn.getAttribute('data-preset-val'), 10);
        if (pVal === val) {
          btn.className = 'preset-btn py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center bg-cyan-500/10 border-white text-white dark:text-white shadow-sm font-bold ring-1 ring-white/30';
        } else {
          btn.className = 'preset-btn py-2 px-2.5 rounded-xl text-xs font-semibold border transition text-center bg-white/[0.02] border-white/15 text-slate-400 hover:text-white hover:border-white/30';
        }
      });
    }

    if (targetSlider) {
      targetSlider.oninput = (e) => {
        const val = parseInt(e.target.value, 10);
        if (progressText) progressText.innerHTML = `${completedThisWeek} <span class="text-slate-400 text-lg font-medium">/ ${val}</span>`;
        if (progressBar) progressBar.style.width = `${Math.min(100, Math.round((completedThisWeek / val) * 100))}%`;
        if (targetLabel) targetLabel.innerHTML = `Custom Target: <strong class="text-white font-bold">${val} Lessons / Week</strong>`;
        if (targetMins) targetMins.textContent = `~${val * 15} mins/week`;
        if (goalMsg) {
          const remaining = val - completedThisWeek;
          goalMsg.textContent = completedThisWeek >= val
            ? '🎉 Congratulations! You have crushed your weekly financial learning goal! Every extra lesson builds your quant rank.'
            : `Complete ${remaining} more lesson${remaining === 1 ? '' : 's'} to hit your goal (~${remaining * 15} minutes of interactive focus).`;
        }
        updatePresetHighlight(val);
      };

      targetSlider.onchange = (e) => {
        const val = parseInt(e.target.value, 10);
        soundEngine.playClick();
        onUpdateWeeklyGoal(val);
      };
    }

    // Bind Preset pace buttons
    container.querySelectorAll('.preset-btn').forEach(btn => {
      btn.onclick = () => {
        const val = parseInt(btn.getAttribute('data-preset-val'), 10);
        soundEngine.playClick();
        onUpdateWeeklyGoal(val);
      };
    });

    // Shortcut button to boost view
    const boostBtn = container.querySelector('.boost-shortcut-btn');
    if (boostBtn) {
      boostBtn.onclick = () => {
        soundEngine.playClick();
        onNavigate('boost');
      };
    }

    // Direct track action buttons (launch specific lesson)
    container.querySelectorAll('.track-action-btn').forEach(btn => {
      btn.onclick = () => {
        const lessonId = btn.getAttribute('data-lesson-id');
        soundEngine.playClick();
        onNavigate('lesson', lessonId);
      };
    });

    // Badge filter buttons
    container.querySelectorAll('.badge-filter-btn').forEach(btn => {
      btn.onclick = () => {
        soundEngine.playClick();
        activeBadgeFilter = btn.getAttribute('data-filter');
        render();
      };
    });
  }

  render();
}
