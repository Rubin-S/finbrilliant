/**
 * Grill Me Arena Component (/grill-me)
 * Fast-paced technical interview simulation with countdown timer,
 * lives counter, multiplier streaks, and Superday outcome debrief.
 */

import { GRILL_QUESTIONS } from '../data/grillQuestions.js';
import { soundEngine } from '../audio.js';
import { getQuestionMarkup, getDebriefMarkup } from './grill/grillMarkup.js';

export function renderGrillMeView(container, state, onSaveScore = () => {}, onExit = () => {}) {
  let questions = [...GRILL_QUESTIONS].sort(() => 0.5 - Math.random());
  let currentIndex = 0;
  let score = 0;
  let lives = 3;
  let streak = 0;
  let maxStreak = 0;
  let timerInterval = null;
  let timeLeft = 25;
  let isAnswered = false;
  let selectedOptionId = null;
  let sessionHistory = [];

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer() {
    stopTimer();
    timeLeft = questions[currentIndex]?.timeLimitSeconds || 25;
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 5 && timeLeft > 0) {
        soundEngine.playTick();
      }
      if (timeLeft <= 0) {
        stopTimer();
        handleTimeout();
      } else {
        const timerEl = container.querySelector('#grill-timer-val');
        if (timerEl) timerEl.textContent = `${timeLeft}s`;
        const barEl = container.querySelector('#grill-timer-bar');
        if (barEl) {
          const pct = Math.max(0, (timeLeft / (questions[currentIndex]?.timeLimitSeconds || 25)) * 100);
          barEl.style.width = `${pct}%`;
        }
      }
    }, 1000);
  }

  function handleTimeout() {
    if (isAnswered) return;
    isAnswered = true;
    lives--;
    streak = 0;
    soundEngine.playError();
    sessionHistory.push({
      question: questions[currentIndex].question,
      timedOut: true,
      correct: false,
      correctText: questions[currentIndex].options.find(o => o.isCorrect)?.text,
      explanation: 'Time expired!'
    });
    renderQuestion();
  }

  function handleAnswer(optId) {
    if (isAnswered) return;
    stopTimer();
    isAnswered = true;
    selectedOptionId = optId;

    const q = questions[currentIndex];
    const opt = q.options.find(o => o.id === optId);

    if (opt && opt.isCorrect) {
      streak++;
      if (streak > maxStreak) maxStreak = streak;
      const multiplier = streak >= 3 ? 2.0 : streak >= 2 ? 1.5 : 1.0;
      const gainedPoints = Math.round(q.points * multiplier);
      score += gainedPoints;
      soundEngine.playSuccess();
      sessionHistory.push({
        question: q.question,
        correct: true,
        points: gainedPoints,
        explanation: opt.explanation
      });
    } else {
      lives--;
      streak = 0;
      soundEngine.playError();
      sessionHistory.push({
        question: q.question,
        correct: false,
        chosenText: opt?.text,
        correctText: q.options.find(o => o.isCorrect)?.text,
        explanation: q.options.find(o => o.isCorrect)?.explanation
      });
    }

    renderQuestion();
  }

  function renderQuestion() {
    if (lives <= 0 || currentIndex >= questions.length) {
      renderDebrief();
      return;
    }

    const q = questions[currentIndex];
    const multiplier = streak >= 3 ? '2.0x' : streak >= 2 ? '1.5x' : '1.0x';

    container.innerHTML = getQuestionMarkup({
      q,
      currentIndex,
      totalQuestions: questions.length,
      lives,
      score,
      streak,
      multiplier,
      timeLeft,
      isAnswered,
      selectedOptionId
    });

    // Bind option clicks
    container.querySelectorAll('.grill-opt-btn').forEach(btn => {
      btn.onclick = () => {
        handleAnswer(btn.getAttribute('data-opt-id'));
      };
    });

    const nextBtn = container.querySelector('.next-grill-btn');
    if (nextBtn) {
      nextBtn.onclick = () => {
        soundEngine.playClick();
        currentIndex++;
        isAnswered = false;
        selectedOptionId = null;
        renderQuestion();
        startTimer();
      };
    }
  }

  function renderDebrief() {
    stopTimer();
    const safeLives = Math.max(0, lives);
    const passed = safeLives > 0 && score >= 400;
    onSaveScore(score, maxStreak, passed);

    let tierLabel = 'Summer Analyst';
    let tierBadge = '🌱';
    if (score >= 800) {
      tierLabel = 'Citadel / Jane Street Partner';
      tierBadge = '🦅';
    } else if (score >= 500) {
      tierLabel = 'Goldman Sachs VP';
      tierBadge = '🏛️';
    } else if (score >= 300) {
      tierLabel = 'Prop Firm Associate';
      tierBadge = '⚡';
    }

    container.innerHTML = getDebriefMarkup({
      passed,
      tierBadge,
      tierLabel,
      score,
      maxStreak,
      safeLives,
      sessionHistory
    });

    container.querySelector('.retry-btn').onclick = () => {
      soundEngine.playClick();
      renderGrillMeView(container, state, onSaveScore, onExit);
    };
    container.querySelector('.exit-btn').onclick = onExit;
  }

  renderQuestion();
  startTimer();

  // Return cleanup function to stop interval on view unmount
  return () => {
    stopTimer();
  };
}

export { renderGrillMeView as renderGrillView };
