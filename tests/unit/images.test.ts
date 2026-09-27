import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { projectImageSources, RESPONSIVE_WIDTH } from '../../src/lib/images';

const root = resolve(__dirname, '../..');

describe('projectImageSources()', () => {
  it('adds a narrow variant for project WebP screenshots', () => {
    expect(projectImageSources('/projects/moto-track.webp')).toEqual({
      src: '/projects/moto-track.webp',
      srcset: `/projects/moto-track-${RESPONSIVE_WIDTH}.webp ${RESPONSIVE_WIDTH}w, /projects/moto-track.webp 1440w`,
    });
  });

  it('leaves SVGs, external URLs, and existing variants alone', () => {
    expect(projectImageSources('/projects/hefesto-risk-grid.svg').srcset).toBeUndefined();
    expect(projectImageSources('https://example.com/a.webp').srcset).toBeUndefined();
    expect(projectImageSources(`/projects/a-${RESPONSIVE_WIDTH}.webp`).srcset).toBeUndefined();
  });

  it('has a generated variant for every screenshot the content references', () => {
    const contentDir = resolve(root, 'src/content/projects');
    const files = [
      ...readdirSync(contentDir).filter((file) => file.endsWith('.md')).map((file) => resolve(contentDir, file)),
      ...readdirSync(resolve(contentDir, 'pt')).filter((file) => file.endsWith('.md')).map((file) => resolve(contentDir, 'pt', file)),
    ];
    const images = new Set(
      files
        .map((file) => readFileSync(file, 'utf-8').match(/^image:\s*"?([^"\n]+)"?/m)?.[1])
        .filter((image): image is string => Boolean(image)),
    );

    const missing = [...images]
      .map((image) => projectImageSources(image).srcset?.split(' ')[0])
      .filter((variant): variant is string => Boolean(variant))
      .filter((variant) => !existsSync(resolve(root, 'public', variant.slice(1))));

    expect(missing, 'run `npm run images:optimize`').toEqual([]);
  });
});
