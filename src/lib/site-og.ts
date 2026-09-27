import type { Lang } from '@/lib/i18n';
import type { SiteOgPage } from '@/lib/og-image';
import type { SiteOgPageId } from '@/lib/seo';
import { getStudioCopy } from '@/lib/studio';

/** Copy for the build-time social preview of each top-level page. */
export function getSiteOgPage(page: SiteOgPageId, lang: Lang): SiteOgPage {
  const copy = getStudioCopy(lang);
  const isPt = lang === 'pt';
  const serviceTags = ['Web platforms', 'APIs', 'Automation', 'Data & AI'];
  const serviceTagsPt = ['Plataformas web', 'APIs', 'Automação', 'Dados e IA'];
  const tags = isPt ? serviceTagsPt : serviceTags;

  switch (page) {
    case 'home':
      return {
        title: copy.hero.lines.join(' '),
        description: copy.hero.lead,
        category: copy.brand.descriptor,
        tags,
      };
    case 'services':
      return {
        title: copy.servicesPage.heroTitle,
        description: copy.servicesPage.heroLead,
        category: copy.servicesPage.heroEyebrow,
        tags: copy.services.map((service) => service.title).slice(0, 4),
      };
    case 'about':
      return {
        title: copy.about.heroTitle,
        description: copy.about.heroLead,
        category: copy.about.heroEyebrow,
        tags: copy.about.principles.map((principle) => principle.title).slice(0, 4),
      };
    case 'contact':
      return {
        title: copy.contactPage.heroTitle,
        description: copy.contactPage.heroLead,
        category: copy.contactPage.heroEyebrow,
        tags,
      };
    case 'projects':
      return {
        title: copy.sections.work.title,
        description: copy.sections.work.lead,
        category: isPt ? 'Projetos e cases' : 'Projects & case studies',
        tags: copy.sectors.map((sector) => sector.title).slice(0, 4),
      };
    case 'blog':
      return {
        title: isPt ? 'Notas de engenharia' : 'Engineering notes',
        description: isPt
          ? 'Notas práticas sobre engenharia de produto, plataformas web, automação e sistemas de dados.'
          : 'Practical notes on product engineering, web platforms, automation, and data systems.',
        category: 'Blog',
        tags,
      };
  }
}
