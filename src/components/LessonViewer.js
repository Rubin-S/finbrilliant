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
    container.innerHTML = `<div class="p-8 text-center text-slate-400 font-mono">Lesson not found. <button class="mt-4 px-4 py-2 border border-white/20 text-white rounded exit-btn cursor-pointer">Return</button></div>`;
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
      <div class="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <!-- Top Navigation & Segmented Progress Bar -->
        <div class="mb-8 select-none">
          <div class="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
            <button class="exit-lesson-btn flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-400 hover:text-white transition cursor-pointer">
              <span>←</span> <span>Exit Lesson</span>
            </button>
            <div class="text-xs font-mono text-slate-400 tracking-wider uppercase">
              ${targetCourse.title} · <span class="text-white font-bold">STEP ${currentStepIndex + 1} OF ${totalSteps}</span>
            </div>
          </div>

          <!-- Segmented Progress Pills -->
          <div class="flex items-center gap-1.5 mt-4">
            ${targetLesson.cards.map((c, idx) => {
              let colorClass = 'bg-white/10';
              let extraClass = '';
              if (idx < currentStepIndex) colorClass = 'bg-white';
              else if (idx === currentStepIndex) {
                colorClass = 'bg-white';
                extraClass = 'progress-pill-active';
              }
              return `<div class="h-[2px] flex-1 rounded-full ${colorClass} ${extraClass} transition-all duration-300"></div>`;
            }).join('')}
          </div>
        </div>

        <!-- Card Container -->
        <div class="lesson-card-surface bg-white/[0.02] border border-white/15 rounded-2xl p-6 sm:p-10 shadow-2xl transition-all">
          <div class="mb-6">
            <span class="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1">CONCEPT MASTERY / STEP ${currentStepIndex + 1}</span>
            <h2 class="text-xl sm:text-2xl font-light uppercase tracking-wide text-white">${card.title}</h2>
            ${card.prompt ? `<p class="mt-3 aee-editorial-serif text-base sm:text-lg text-slate-300 italic leading-relaxed">${card.prompt}</p>` : ''}
          </div>

          <!-- Interactive Widget Mount Point -->
          ${card.widgetType ? `<div id="interactive-widget-mount" class="my-6 border border-white/10 rounded-xl p-4 bg-black/20"></div>` : ''}

          <!-- Summary Card View -->
          ${card.type === 'summary' ? `
            <div class="my-6 p-8 rounded-xl bg-white/[0.03] border border-white/20 text-center animate-fade-in shadow-xl">
              <span class="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded border border-white/30 text-white bg-white/10 inline-block mb-4">
                TRACK COMPLETED
              </span>
              <h3 class="text-2xl font-light uppercase tracking-wide text-white">All Else Equal: Discipline Mastered</h3>
              <p class="aee-editorial-serif text-base text-slate-300 italic mt-2">You have synthesized the first-principles mechanics of this discipline.</p>
              
              <div class="my-6 py-3 px-5 bg-white/5 rounded-lg border border-white/15 inline-flex items-center gap-3">
                <span class="font-mono text-sm tracking-wider uppercase text-white font-bold">+${card.xpReward || targetLesson.xp} XP AWARDED</span>
              </div>

              <div class="text-left mt-6 pt-6 border-t border-white/10 space-y-3 font-mono text-xs">
                <span class="text-[10px] tracking-widest uppercase text-slate-400 block">KEY INSIGHTS:</span>
                ${(card.takeaways || []).map((t, tIdx) => `
                  <div class="flex items-start gap-2.5 text-slate-300">
                    <span class="text-white font-bold">[${String(tIdx + 1).padStart(2, '0')}]</span>
                    <span class="leading-relaxed">${t}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Question & Options (for quizzes & challenges) -->
          ${card.options ? `
            <div class="mt-8 pt-6 border-t border-white/10">
              <h4 class="text-sm font-mono tracking-wider uppercase text-white mb-4">${card.question}</h4>
              <div class="space-y-3">
                ${card.options.map((opt, oIdx) => {
                  const letter = String.fromCharCode(65 + oIdx);
                  let optStyle = 'border-white/15 bg-white/[0.02] hover:bg-white/5 hover:border-white/30 text-slate-200';
                  let mark = `[${letter}]`;

                  if (hasChecked) {
                    if (opt.isCorrect) {
                      optStyle = 'border-white bg-white/15 text-white ring-1 ring-white font-bold';
                      mark = `[✓ ${letter}]`;
                    } else if (selectedOptionId === opt.id) {
                      optStyle = 'border-slate-600 bg-white/[0.01] text-slate-400';
                      mark = `[✕ ${letter}]`;
                    } else {
                      optStyle = 'border-white/5 bg-transparent text-slate-600 opacity-40';
                    }
                  } else if (selectedOptionId === opt.id) {
                    optStyle = 'border-white bg-white/10 text-white ring-1 ring-white';
                    mark = `[● ${letter}]`;
                  }

                  return `
                    <button class="option-btn w-full p-4 rounded-lg border text-left text-xs sm:text-sm font-mono tracking-wide transition flex items-start gap-3 select-none cursor-pointer ${optStyle}" data-opt-id="${opt.id}">
                      <span class="leading-none mt-0.5 font-bold shrink-0">${mark}</span>
                      <span class="flex-1 leading-relaxed">${opt.text}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- Explanation Box -->
              ${hasChecked && selectedOptionId ? `
                <div class="mt-5 p-5 rounded-lg text-xs leading-relaxed animate-fade-in font-mono border ${
                  card.options.find(o => o.id === selectedOptionId)?.isCorrect 
                    ? 'border-white/40 bg-white/10 text-white' 
                    : 'border-white/20 bg-white/5 text-slate-300'
                }">
                  <div class="font-bold mb-1 tracking-wider uppercase">
                    ${card.options.find(o => o.id === selectedOptionId)?.isCorrect ? 'STATUS: VERIFIED CORRECT' : 'STATUS: ANALYSIS & REASONING'}
                  </div>
                  <p class="mt-1 leading-relaxed text-slate-300">${card.options.find(o => o.id === selectedOptionId)?.explanation || ''}</p>
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- Bottom Action Buttons -->
          <div class="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
            <button class="prev-step-btn px-4 py-2 rounded-lg text-xs font-mono tracking-wider uppercase border border-white/20 text-slate-400 hover:text-white transition cursor-pointer ${currentStepIndex === 0 ? 'invisible' : ''}">
              ← PREVIOUS
            </button>

            <div>
              ${card.type === 'summary' || (isLastStep && (!card.options || hasChecked)) ? `
                <button class="complete-btn px-6 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase border border-white bg-white text-black font-bold hover:bg-slate-200 transition cursor-pointer">
                  COMPLETE DISCIPLINE →
                </button>
              ` : card.options && !hasChecked ? `
                <button class="check-btn px-6 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase border font-bold transition ${selectedOptionId ? 'border-white bg-white text-black cursor-pointer hover:bg-slate-200' : 'border-white/20 bg-transparent text-slate-600 cursor-not-allowed'}">
                  CHECK ANSWER
                </button>
              ` : `
                <button class="next-step-btn px-6 py-2.5 rounded-lg text-xs font-mono tracking-wider uppercase border border-white bg-white text-black font-bold hover:bg-slate-200 transition cursor-pointer">
                  CONTINUE →
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
  const colors = ['#ffffff', '#cbd5e1', '#94a3b8', '#64748b'];
  for (let i = 0; i < 30; i++) {
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
