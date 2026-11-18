import test from 'node:test';
import assert from 'node:assert/strict';
import { KEYNOTE_SLIDES, getSlideByNumber } from './deckData';

test('keynote deck defines 18 sequential slides covering all required sections 05..17', () => {
  assert.equal(KEYNOTE_SLIDES.length, 18);
  for (let i = 0; i < KEYNOTE_SLIDES.length; i++) {
    assert.equal(KEYNOTE_SLIDES[i].number, i + 1);
  }

  const expectedTitles: Record<number, string> = {
    5: 'Meet KYRIX',
    6: 'The Interface',
    7: 'Voice-First Experience',
    8: 'Multilingual Intelligence',
    9: 'PC Control',
    10: 'Real-Time Screen Awareness',
    11: 'Intelligent Search',
    12: 'Personal Assistant',
    13: 'The Mascot',
    14: 'The Experience',
    15: 'Technology',
    16: 'Customization',
    17: 'Real-World Applications',
  };

  for (const [num, title] of Object.entries(expectedTitles)) {
    const slide = getSlideByNumber(Number(num));
    assert.equal(slide.title, title);
  }
});

test('getSlideByNumber clamps out-of-range slide indices cleanly', () => {
  assert.equal(getSlideByNumber(0).number, 1);
  assert.equal(getSlideByNumber(99).number, 18);
});
