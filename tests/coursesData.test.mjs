import test from 'node:test';
import assert from 'node:assert';
import { COURSES } from '../src/data/courses.js';
import { GRILL_QUESTIONS } from '../src/data/grillQuestions.js';
import { DAILY_BOOSTS } from '../src/data/dailyBoosts.js';

test('COURSES structure is valid and adheres to Brilliant-style micro-steps', () => {
  assert.ok(COURSES.length >= 6, 'Must have at least 6 core finance courses');

  for (const course of COURSES) {
    assert.ok(course.id, 'Course must have id');
    assert.ok(course.title, 'Course must have title');
    assert.ok(course.lessons.length > 0, `Course ${course.title} must have lessons`);

    for (const lesson of course.lessons) {
      assert.ok(lesson.id, `Lesson must have id`);
      assert.ok(lesson.title, `Lesson must have title`);
      assert.ok(lesson.cards.length > 0, `Lesson ${lesson.title} must have cards`);

      // Every lesson MUST end with a summary card so clicking Next does not trigger an array out-of-bounds crash
      const lastCard = lesson.cards[lesson.cards.length - 1];
      assert.strictEqual(
        lastCard.type,
        'summary',
        `Lesson ${lesson.id} in ${course.title} must terminate with a summary card`
      );

      for (const card of lesson.cards) {
        assert.ok(card.id, 'Card must have id');
        assert.ok(card.title, 'Card must have title');
        assert.ok(card.type, 'Card must have type');

        if (card.options) {
          const correctOpts = card.options.filter(o => o.isCorrect);
          assert.strictEqual(
            correctOpts.length,
            1,
            `Card ${card.title} in lesson ${lesson.title} must have exactly one correct option`
          );
          for (const opt of card.options) {
            assert.ok(opt.explanation, `Option ${opt.id} in ${card.title} must have explanation`);
          }
        }
      }
    }
  }
});

test('GRILL_QUESTIONS bank has valid technical interview questions with full explanations', () => {
  assert.ok(GRILL_QUESTIONS.length >= 12, 'Must have at least 12 diverse grill questions');

  for (const q of GRILL_QUESTIONS) {
    assert.ok(q.id, 'Grill question must have id');
    assert.ok(q.category, 'Grill question must have category');
    assert.ok(q.tier, 'Grill question must have tier');
    assert.ok(q.timeLimitSeconds > 0, 'Grill question must have time limit');
    assert.ok(q.points > 0, 'Grill question must award points');

    const correctOpts = q.options.filter(o => o.isCorrect);
    assert.strictEqual(correctOpts.length, 1, `Question ${q.id} must have exactly one correct option`);

    // Every option must have an explanation so diagnostic debrief is fully informative
    for (const opt of q.options) {
      assert.ok(opt.explanation && opt.explanation.trim().length > 0, `Option ${opt.id} in grill question ${q.id} must have explanation`);
    }
  }
});

test('DAILY_BOOSTS challenges are configured properly with explanations', () => {
  assert.ok(DAILY_BOOSTS.length >= 3, 'Must have daily boost challenges');

  for (const b of DAILY_BOOSTS) {
    assert.ok(b.id, 'Boost must have id');
    assert.ok(b.scenario, 'Boost must have scenario');
    assert.ok(b.xpReward > 0, 'Boost must have xpReward');
    const correctOpts = b.options.filter(o => o.isCorrect);
    assert.strictEqual(correctOpts.length, 1, `Boost ${b.id} must have one correct option`);

    for (const opt of b.options) {
      assert.ok(opt.explanation && opt.explanation.trim().length > 0, `Option ${opt.id} in boost ${b.id} must have explanation`);
    }
  }
});
