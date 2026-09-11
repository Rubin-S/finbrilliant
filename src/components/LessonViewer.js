/**
 * Brilliant-Style Interactive Lesson Player
 * Step-by-step card progression, segmented progress pill bar,
 * live widget mounting, instant feedback, and celebration animations.
 */

import { COURSES } from '../data/courses.js';
import { soundEngine } from '../audio.js';
import {
  renderCompoundWidget,
  renderDelayCostWidget,
  renderThetaDecayWidget,
  renderOrderBookWidget,
  renderOptionsPayoffWidget,
  renderBondSeesawWidget,
  renderEfficientFrontierWidget,
  renderDCFWidget
} from './InteractiveWidgets.js';
import {
  animateStepTransition,
  animateOptionSelect,
  animatePillComplete
} from '../utils/motion.js';

export function renderLessonViewer(container, lessonId, state, onCompleteLesson, onExit) {
  // Find lesson and course
  let targetCourse = null;
  let targetLesson = null;

  for (const course of COURSES) {
    const l = course.lessons.find(item => item.id === lessonId);
    if (l) {
      targetCourse = course;
      targetLesson = l;
      break;
    }
  }

  if (!targetLesson) {
    container.innerHTML = `<div class="p-8 text-center text-rose-400">Lesson not found. <button class="mt-4 px-4 py-2 bg-slate-800 text-white rounded exit-btn">Return</button></div>`;
    container.querySelector('.exit-btn').onclick = onExit;
    return;
  }

  let currentStepIndex = 0;
  let selectedOptionId = null;
  let hasChecked = false;

  function renderCurrentStep(direction = 'next') {
    // Clamp currentStepIndex to valid range
    currentStepIndex = Math.max(0, Math.min(currentStepIndex, targetLesson.cards.length - 1));
    const card = targetLesson.cards[currentStepIndex];
    const totalSteps = targetLesson.cards.length;
    const isLastStep = currentStepIndex === totalSteps - 1;

    container.innerHTML = `
      <div class="max-w-3xl mx-auto px-4 py-6">
        <!-- Top Navigation & Segmented Progress Bar -->
        <div class="mb-6">
          <div class="flex items-center justify-between mb-3">
            <button class="exit-lesson-btn flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition">
              <span>←</span> <span>Exit Lesson</span>
            </button>
            <div class="text-xs font-bold text-slate-600 dark:text-slate-300">
              ${targetCourse.title} • <span class="text-emerald-600 dark:text-emerald-400 font-bold">Step ${currentStepIndex + 1} of ${totalSteps}</span>
            </div>
          </div>

          <!-- Segmented Progress Pills -->
          <div class="flex items-center gap-1.5">
            ${targetLesson.cards.map((c, idx) => {
              let colorClass = 'bg-slate-200 dark:bg-slate-800';
              let extraClass = '';
              if (idx < currentStepIndex) colorClass = 'bg-emerald-500';
              else if (idx === currentStepIndex) {
                colorClass = 'bg-emerald-400';
                extraClass = 'progress-pill-active';
              }
              return `<div class="h-2 flex-1 rounded-full ${colorClass} ${extraClass} transition-all duration-300"></div>`;
            }).join('')}
          </div>
        </div>

        <!-- Card Container -->
        <div class="lesson-card-surface bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-2xl transition-all">
          <div class="mb-5">
            <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">Concept Mastery</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">${card.title}</h2>
            ${card.prompt ? `<p class="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${card.prompt}</p>` : ''}
          </div>

          <!-- Interactive Widget Mount Point -->
          ${card.widgetType ? `<div id="interactive-widget-mount" class="my-5"></div>` : ''}

          <!-- Summary Card View -->
          ${card.type === 'summary' ? `
            <div class="my-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-teal-50/40 dark:from-emerald-950/40 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-500/40 text-center animate-fade-in shadow-sm">
              <span class="text-6xl block mb-3 animate-bounce">🏆</span>
              <h3 class="text-xl font-black text-slate-900 dark:text-white">Lesson Completed!</h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 mt-1">You just absorbed first-principles financial mechanics.</p>
              
              <div class="my-4 py-3 px-4 bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700/60 inline-flex items-center gap-2 shadow-sm">
                <span class="text-xl">⚡</span>
                <span class="text-base font-extrabold text-emerald-600 dark:text-emerald-400">+${card.xpReward || targetLesson.xp} XP Earned</span>
              </div>

              <div class="text-left mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Key Insights:</span>
                ${(card.takeaways || []).map(t => `
                  <div class="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200">
                    <span class="text-emerald-500 font-bold">•</span>
                    <span>${t}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Question & Options (for quizzes & challenges) -->
          ${card.options ? `
            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <h4 class="text-sm font-bold text-slate-900 dark:text-white mb-3">${card.question}</h4>
              <div class="space-y-2.5">
                ${card.options.map(opt => {
                  let optStyle = 'border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm';
                  let icon = '○';

                  if (hasChecked) {
                    if (opt.isCorrect) {
                      optStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-semibold';
                      icon = '✓';
                    } else if (selectedOptionId === opt.id) {
                      optStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-950 dark:text-rose-200 ring-2 ring-rose-500/30 font-semibold';
                      icon = '✕';
                    }
                  } else if (selectedOptionId === opt.id) {
                    optStyle = 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-950 dark:text-white ring-2 ring-emerald-500/30 font-semibold shadow-sm';
                    icon = '●';
                  }

                  return `
                    <button class="option-btn w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition flex items-start gap-3 select-none ${optStyle}" data-opt-id="${opt.id}">
                      <span class="text-base leading-none mt-0.5 font-bold ${hasChecked && opt.isCorrect ? 'text-emerald-500' : ''}">${icon}</span>
                      <span class="flex-1 leading-relaxed">${opt.text}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Explanation Box -->
              ${hasChecked && selectedOptionId ? `
                <div class="mt-4 p-4 rounded-xl text-xs sm:text-sm leading-relaxed animate-fade-in ${
                  card.options.find(o => o.id === selectedOptionId)?.isCorrect 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/50 text-emerald-950 dark:text-emerald-200' 
                    : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/50 text-rose-950 dark:text-rose-200'
                }">
                  <div class="font-bold mb-1 flex items-center gap-1.5">
                    ${card.options.find(o => o.id === selectedOptionId)?.isCorrect ? '💡 Spot On!' : '⚠️ Not Quite'}
                  </div>
                  <p>${card.options.find(o => o.id === selectedOptionId)?.explanation || ''}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Bottom Action Buttons -->
          <div class="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button class="prev-step-btn px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition ${currentStepIndex === 0 ? 'invisible' : ''}">
              ← Previous
            </button>

            <div>
              ${card.type === 'summary' || (isLastStep && (!card.options || hasChecked)) ? `
                <button class="complete-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5 active:scale-95 text-sm">
                  Complete Track 🎉
                </button>
              ` : card.options && !hasChecked ? `
                <button class="check-btn px-6 py-2.5 rounded-xl font-bold text-sm transition ${selectedOptionId ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 cursor-pointer shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'}">
                  Check Answer
                </button>
              ` : `
                <button class="next-step-btn bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 transition transform hover:-translate-y-0.5 active:scale-95 text-sm">
                  Continue →
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;

    // Mount live interactive widgets if specified
    if (card.widgetType) {
      const mount = container.querySelector('#interactive-widget-mount');
      if (mount) {
        if (card.widgetType === 'compound_growth') {
          renderCompoundWidget(mount, card.initialState || {});
        } else if (card.widgetType === 'delay_cost') {
          renderDelayCostWidget(mount, card.initialState || {});
        } else if (card.widgetType === 'orderbook_ladder' || card.widgetType === 'orderbook_sandbox') {
          renderOrderBookWidget(mount, card.initialState || {});
        } else if (card.widgetType === 'options_payoff') {
          renderOptionsPayoffWidget(mount, card.initialState || {});
        } else if (card.widgetType === 'theta_decay') {
          renderThetaDecayWidget(mount, card.initialState || {});
        } else if (card.widgetType === 'bond_seesaw') {
          renderBondSeesawWidget(mount, card.initialState || {});
        } else if (card.widgetType === 'efficient_frontier') {
          renderEfficientFrontierWidget(mount, card.initialState || {});
        } else if (card.widgetType === 'dcf_discount') {
          renderDCFWidget(mount, card.initialState || {});
        }
      }
    }

    // Attach step event listeners
    const exitBtn = container.querySelector('.exit-lesson-btn');
    if (exitBtn) exitBtn.onclick = onExit;

    const prevBtn = container.querySelector('.prev-step-btn');
    if (prevBtn) {
      prevBtn.onclick = () => {
        if (currentStepIndex > 0) {
          currentStepIndex--;
          selectedOptionId = null;
          hasChecked = false;
          renderCurrentStep('prev');
        }
      };
    }

    container.querySelectorAll('.option-btn').forEach(btn => {
      btn.onclick = () => {
        if (hasChecked) return;
        soundEngine.playClick();
        animateOptionSelect(btn);
        selectedOptionId = btn.getAttribute('data-opt-id');
        renderCurrentStep();
      };
    });

    const checkBtn = container.querySelector('.check-btn');
    if (checkBtn) {
      checkBtn.onclick = () => {
        if (!selectedOptionId) return;
        hasChecked = true;
        const chosen = card.options.find(o => o.id === selectedOptionId);
        if (chosen && chosen.isCorrect) {
          soundEngine.playSuccess();
        } else {
          soundEngine.playError();
        }
        renderCurrentStep();
      };
    }

    const nextBtn = container.querySelector('.next-step-btn');
    if (nextBtn) {
      nextBtn.onclick = () => {
        soundEngine.playClick();
        if (currentStepIndex < targetLesson.cards.length - 1) {
          currentStepIndex++;
          selectedOptionId = null;
          hasChecked = false;
          renderCurrentStep('next');
        }
      };
    }

    const completeBtn = container.querySelector('.complete-btn');
    if (completeBtn) {
      completeBtn.onclick = () => {
        soundEngine.playLevelUp();
        triggerConfetti();
        onCompleteLesson(targetLesson.id, targetLesson.xp);
      };
    }

    // Trigger Motion.dev card transition and active progress pill pulse
    const cardContainer = container.querySelector('.lesson-card-surface');
    if (cardContainer) {
      animateStepTransition(cardContainer, direction);
    }
    const activePill = container.querySelector('.progress-pill-active');
    if (activePill) {
      animatePillComplete(activePill);
    }
  }

  renderCurrentStep();
}

function triggerConfetti() {
  if (typeof document === 'undefined') return;
  const colors = ['#10b981', '#38bdf8', '#f59e0b', '#a855f7', '#ec4899'];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = `${1.5 + Math.random() * 2}s`;
    el.style.opacity = `${0.7 + Math.random() * 0.3}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  }
}
