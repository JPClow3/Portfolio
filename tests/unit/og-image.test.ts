import { describe, it, expect } from 'vitest';
import { renderOgSvg, renderOgPng } from '../../src/lib/og-image';

describe('OG Image Generation', () => {
  it('renders SVG markup with expected elements and structure', async () => {
    const svg = await renderOgSvg({
      title: 'Resonant Echoes: AI Audio Generation',
      description: 'Generative ambient soundscapes using neural audio synthesis.',
      category: 'Case Study',
      tags: ['TypeScript', 'AI/ML', 'Gemini'],
      author: 'João Paulo Santos',
      role: 'Freelance Software Developer',
      siteDomain: 'jpclow.dev',
      badge: '2025',
    });

    expect(typeof svg).toBe('string');
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 1200 630"');
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('<path');
  });

  it('renders valid PNG binary buffer with correct magic header', async () => {
    const buffer = await renderOgPng({
      title: 'Veins of Eridûn: Tactical RPG Engine',
      description: 'A procedural tactical RPG engine in TypeScript.',
      tags: ['TypeScript', 'Algorithms'],
      lang: 'pt',
    });

    expect(Buffer.isBuffer(buffer)).toBe(true);
    expect(buffer.length).toBeGreaterThan(1000);

    // Check PNG magic bytes: 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
    const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    expect(buffer.subarray(0, 8)).toEqual(pngMagic);
  });

  it('truncates long descriptions gracefully without throwing', async () => {
    const longDesc = 'A'.repeat(200);
    const svg = await renderOgSvg({
      title: 'Short Title',
      description: longDesc,
    });

    expect(typeof svg).toBe('string');
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 1200 630"');
  });
});
