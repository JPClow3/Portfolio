import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { getStudioCopy, localePath, projectHref, type StudioCopy } from '../../src/lib/studio';
import { SITE } from '../../src/lib/seo';

const en = getStudioCopy('en');
const pt = getStudioCopy('pt');
const projectsDir = resolve(__dirname, '../../src/content/projects');

function allProofSlugs(copy: StudioCopy) {
  return [
    ...copy.services.flatMap((service) => service.proof),
    ...copy.sectors.flatMap((sector) => sector.proof),
  ].map((project) => project.slug);
}

describe('studio copy', () => {
  it('keeps English and Portuguese structurally identical', () => {
    expect(pt.services.map((service) => service.id)).toEqual(en.services.map((service) => service.id));
    expect(pt.services.map((service) => service.icon)).toEqual(en.services.map((service) => service.icon));
    expect(pt.process).toHaveLength(en.process.length);
    expect(pt.standards).toHaveLength(en.standards.length);
    expect(pt.architecture).toHaveLength(en.architecture.length);
    expect(pt.sectors).toHaveLength(en.sectors.length);
    expect(pt.engagement).toHaveLength(en.engagement.length);
    expect(pt.faq).toHaveLength(en.faq.length);
    expect(pt.about.principles).toHaveLength(en.about.principles.length);
    expect(pt.contactPage.next).toHaveLength(en.contactPage.next.length);
  });

  it('actually translates Portuguese copy instead of reusing English', () => {
    expect(pt.hero.lead).not.toBe(en.hero.lead);
    pt.services.forEach((service, index) => {
      expect(service.description).not.toBe(en.services[index].description);
    });
    pt.faq.forEach((item, index) => {
      expect(item.question).not.toBe(en.faq[index].question);
    });
  });

  it('uses unique, anchor-safe service ids', () => {
    const ids = en.services.map((service) => service.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(id).toMatch(/^[a-z][a-z0-9-]*$/));
  });

  it('highlights exactly one engagement model', () => {
    for (const copy of [en, pt]) {
      expect(copy.engagement.filter((model) => model.featured)).toHaveLength(1);
    }
  });

  it('only cites case studies that exist in both locales', () => {
    const slugs = new Set([...allProofSlugs(en), ...allProofSlugs(pt)]);
    for (const slug of slugs) {
      expect(existsSync(resolve(projectsDir, `${slug}.md`)), `${slug}.md`).toBe(true);
      expect(existsSync(resolve(projectsDir, 'pt', `${slug}.md`)), `pt/${slug}.md`).toBe(true);
    }
  });

  it('only cites projects that publish a case study page', () => {
    const slugs = new Set(allProofSlugs(en));
    for (const slug of slugs) {
      const frontmatter = readFileSync(resolve(projectsDir, `${slug}.md`), 'utf-8');
      expect(frontmatter, slug).toMatch(/^caseStudy:\s*true/m);
    }
  });

  it('points proposal requests at the real contact address', () => {
    for (const copy of [en, pt]) {
      expect(copy.faq.at(-1)?.answer).toContain(SITE.email);
    }
  });

  it('does not invent client counts, testimonials, or prices', () => {
    const text = JSON.stringify(en) + JSON.stringify(pt);
    expect(text).not.toMatch(/\b\d+\+?\s*(clients|clientes)\b/i);
    expect(text).not.toMatch(/testimonial|depoimento/i);
    expect(text).not.toMatch(/(US\$|R\$|\$)\s?\d/);
  });

  it('does not claim production delivery for sections that cite research or prototypes', () => {
    const statusOf = (slug: string) =>
      readFileSync(resolve(projectsDir, `${slug}.md`), 'utf-8').match(/^status:\s*"?([a-z-]+)"?/m)?.[1];

    for (const copy of [en, pt]) {
      const citesNonLive = copy.sectors.some((sector) => sector.proof.some((project) => statusOf(project.slug) !== 'live'));
      if (citesNonLive) {
        expect(copy.sections.sectors.lead).not.toMatch(/shipped production|em produção/i);
        expect(copy.labels.provenIn).not.toMatch(/proven|comprovado|aplicado/i);
      }
    }
  });

  it('keeps each hero headline to three short lines', () => {
    for (const copy of [en, pt]) {
      expect(copy.hero.lines).toHaveLength(3);
      copy.hero.lines.forEach((line) => expect(line.length).toBeLessThanOrEqual(24));
    }
  });
});

describe('studio path helpers', () => {
  it('builds locale-aware internal paths', () => {
    expect(localePath('/services/', 'en')).toBe('/services/');
    expect(localePath('/services/', 'pt')).toBe('/pt/services/');
    expect(localePath('/', 'pt')).toBe('/pt/');
  });

  it('builds case study URLs', () => {
    expect(projectHref('moto-track', 'en')).toBe('/projects/moto-track/');
    expect(projectHref('moto-track', 'pt')).toBe('/pt/projects/moto-track/');
  });
});
