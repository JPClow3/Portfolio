import type { Lang } from '@/lib/i18n';

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  text: string;
}

/**
 * Calculates estimated reading time from markdown/MDX raw body content.
 * Average reading speed: 200 words per minute.
 */
export function calculateReadingTime(content?: string, lang: Lang = 'en'): ReadingTimeResult {
  if (!content || typeof content !== 'string') {
    return {
      minutes: 1,
      words: 0,
      text: lang === 'pt' ? '1 min de leitura' : '1 min read',
    };
  }

  // Remove code blocks
  const cleanText = content
    .replace(/```[\s\S]*?```/g, '') // remove code blocks
    .replace(/<[^>]+>/g, '') // remove HTML tags
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // replace markdown links with label
    .replace(/[#*`_~>\-+]/g, '') // remove markdown symbols
    .trim();

  const words = cleanText.split(/\s+/).filter((word) => word.length > 0).length;
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));

  const text = lang === 'pt'
    ? `${minutes} min de leitura`
    : `${minutes} min read`;

  return {
    minutes,
    words,
    text,
  };
}
