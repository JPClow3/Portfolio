import { describe, it, expect } from 'vitest';
import { calculateReadingTime } from '../../src/lib/blog';

describe('blog utilities', () => {
  describe('calculateReadingTime()', () => {
    it('returns 1 min for short or empty text', () => {
      expect(calculateReadingTime('', 'en').minutes).toBe(1);
      expect(calculateReadingTime('', 'en').text).toBe('1 min read');
      expect(calculateReadingTime('', 'pt').text).toBe('1 min de leitura');
    });

    it('calculates reading time for English articles based on 200 wpm', () => {
      const shortText = 'word '.repeat(100);
      const mediumText = 'word '.repeat(450);
      const longText = 'word '.repeat(1000);

      expect(calculateReadingTime(shortText, 'en').minutes).toBe(1);
      expect(calculateReadingTime(shortText, 'en').text).toBe('1 min read');

      expect(calculateReadingTime(mediumText, 'en').minutes).toBe(3);
      expect(calculateReadingTime(mediumText, 'en').text).toBe('3 min read');

      expect(calculateReadingTime(longText, 'en').minutes).toBe(5);
      expect(calculateReadingTime(longText, 'en').text).toBe('5 min read');
    });

    it('calculates reading time for Portuguese articles with localized text', () => {
      const mediumText = 'palavra '.repeat(600);

      const result = calculateReadingTime(mediumText, 'pt');
      expect(result.minutes).toBe(3);
      expect(result.text).toBe('3 min de leitura');
    });

    it('strips code blocks, html and markdown symbols from word count', () => {
      const textWithCode = `
# Title

This is a paragraph with several words.

\`\`\`typescript
const a = 1;
const b = 2;
const c = 3;
function test() { return a + b + c; }
\`\`\`

<div class="note">Some HTML note</div>
      `;

      const result = calculateReadingTime(textWithCode, 'en');
      expect(result.minutes).toBe(1);
      expect(result.words).toBeLessThan(20);
    });
  });
});
