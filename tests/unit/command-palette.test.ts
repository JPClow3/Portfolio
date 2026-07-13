import { describe, expect, it } from 'vitest';
import { buildCommandPaletteItems } from '../../src/lib/command-palette';

const profile = {
  github: 'https://github.com/JPClow3',
  linkedin: 'https://linkedin.com/in/joaopaulosantosgo',
  email: 'joaopaulo.grv4@gmail.com',
};

const projects = [
  { title: 'Throughline', slug: 'throughline', status: 'live' as const },
  { title: 'Lorebound', slug: 'lorebound', status: 'in-development' as const },
];

describe('buildCommandPaletteItems', () => {
  it('creates English section, project, and external commands', () => {
    const items = buildCommandPaletteItems({ lang: 'en', profile, projects });

    expect(items.find((item) => item.id === 'section-projects')).toMatchObject({
      label: 'Projects',
      href: '/#projects',
      kind: 'navigate',
    });
    expect(items.find((item) => item.id === 'project-throughline')).toMatchObject({
      label: 'Throughline',
      href: '/projects/throughline/',
      kind: 'navigate',
    });
    expect(items.find((item) => item.id === 'github')).toMatchObject({
      href: profile.github,
      kind: 'external',
    });
    expect(items.find((item) => item.id === 'email')).toMatchObject({
      href: `mailto:${profile.email}`,
      kind: 'email',
    });
  });

  it('uses Portuguese labels and routes for internal commands', () => {
    const items = buildCommandPaletteItems({ lang: 'pt', profile, projects });

    expect(items.find((item) => item.id === 'section-projects')).toMatchObject({
      label: 'Projetos',
      href: '/pt/#projects',
    });
    expect(items.find((item) => item.id === 'project-lorebound')).toMatchObject({
      label: 'Lorebound',
      href: '/pt/projects/lorebound/',
      status: 'Em desenvolvimento',
    });
    expect(items.find((item) => item.id === 'resume')).toMatchObject({
      href: '/resume-pt.pdf',
      kind: 'download',
    });
  });
});
