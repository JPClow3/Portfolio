import type { Lang } from '@/lib/i18n';
import { getStudioCopy } from '@/lib/studio';

export const SITE = {
  name: 'jpclow.dev',
  company: 'JPCLOW',
  url: 'https://jpclow.dev',
  author: 'João Paulo Gonçalves Santos',
  shortAuthor: 'João Paulo Santos',
  email: 'joao@jpclow.dev',
  localeMap: {
    en: 'en-US',
    pt: 'pt-BR',
  } as const satisfies Record<Lang, string>,
} as const;

export const SOCIAL = {
  github: 'https://github.com/JPClow3',
  linkedin: 'https://linkedin.com/in/joaopaulosantosgo',
  instagram: 'https://www.instagram.com/_joao.paulo_sa/',
} as const;

export interface AlternateLink {
  hreflang: string;
  url: string;
}

export interface PageSeo {
  title: string;
  description: string;
  keywords: string[];
}

const HOME_SEO: Record<Lang, PageSeo> = {
  en: {
    title: 'JPCLOW | Software Engineering Studio — João Paulo Santos',
    description:
      'Founded by João Paulo Santos in Brazil, JPCLOW builds web platforms, APIs, automation, and data & AI products for companies, from discovery to production.',
    keywords: [
      'software development company',
      'custom software development',
      'software engineering studio',
      'web platform development',
      'API integration services',
      'workflow automation',
      'data engineering and geospatial',
      'AI integration services',
      'nearshore software development Brazil',
      'Cloudflare development',
      'JPCLOW',
    ],
  },
  pt: {
    title: 'JPCLOW: Estúdio de Engenharia de Software, João Paulo Santos',
    description:
      'Fundada por João Paulo Santos no Brasil, a JPCLOW cria plataformas web, APIs, automação e produtos de dados e IA para empresas, da descoberta à produção.',
    keywords: [
      'empresa de desenvolvimento de software',
      'software sob medida',
      'estúdio de engenharia de software',
      'desenvolvimento de sistemas web',
      'integração de APIs',
      'automação de processos',
      'software para agronegócio',
      'desenvolvimento de SaaS',
      'software house Goiás',
      'JPCLOW',
    ],
  },
};

type StudioPage = 'services' | 'about' | 'contact';

const PAGE_SEO: Record<StudioPage, Record<Lang, PageSeo>> = {
  services: {
    en: {
      title: 'Software Development Services | JPCLOW',
      description:
        'Web platforms, APIs and integrations, workflow automation, data and geospatial products, applied AI, and cloud reliability, delivered end to end.',
      keywords: ['software development services', 'custom web platforms', 'API development', 'workflow automation', 'applied AI', 'Cloudflare DevOps'],
    },
    pt: {
      title: 'Serviços de Desenvolvimento de Software | JPCLOW',
      description:
        'Plataformas web, APIs e integrações, automação de processos, dados e geoespacial, IA aplicada e confiabilidade em cloud, entregues de ponta a ponta.',
      keywords: ['serviços de desenvolvimento de software', 'plataformas web sob medida', 'desenvolvimento de APIs', 'automação de processos', 'IA aplicada', 'DevOps Cloudflare'],
    },
  },
  about: {
    en: {
      title: 'Company | JPCLOW — Software Engineering Studio',
      description:
        'JPCLOW is a software engineering studio founded by João Paulo Santos, building software for agribusiness, education, operations, and digital products.',
      keywords: ['JPCLOW', 'software studio Brazil', 'João Paulo Santos', 'software engineering company'],
    },
    pt: {
      title: 'Empresa | JPCLOW — Estúdio de Engenharia de Software',
      description:
        'A JPCLOW é um estúdio de engenharia de software fundado por João Paulo Santos, que cria software para agronegócio, educação, operações e produtos digitais.',
      keywords: ['JPCLOW', 'estúdio de software', 'João Paulo Santos', 'empresa de engenharia de software'],
    },
  },
  contact: {
    en: {
      title: 'Start a Project | JPCLOW',
      description:
        'Tell JPCLOW about your project. Share the problem, timeline, and systems involved, and get a first technical read with next steps.',
      keywords: ['hire software development company', 'software project proposal', 'contact JPCLOW'],
    },
    pt: {
      title: 'Iniciar um Projeto | JPCLOW',
      description:
        'Conte para a JPCLOW sobre o seu projeto. Compartilhe o problema, o prazo e os sistemas envolvidos e receba uma primeira leitura técnica com os próximos passos.',
      keywords: ['contratar empresa de software', 'proposta de projeto de software', 'contato JPCLOW'],
    },
  },
};

const BLOG_INDEX_SEO: Record<Lang, PageSeo> = {
  en: {
    title: 'Blog | JPCLOW — Engineering Notes',
    description:
      'Engineering notes from JPCLOW on real product decisions, including Moto Track\'s offline fuel workflow and the limits of local data capture.',
    keywords: [
      'product engineering notes',
      'offline web app design',
      'Moto Track case study',
      'SvelteKit offline workflow',
    ],
  },
  pt: {
    title: 'Blog | JPCLOW — Notas de Engenharia',
    description:
      'Notas de engenharia da JPCLOW sobre decisões reais de produto, incluindo o fluxo offline de abastecimento do Moto Track e seus limites.',
    keywords: [
      'notas de engenharia de produto',
      'aplicação web offline',
      'case Moto Track',
      'fluxo offline SvelteKit',
    ],
  },
};

export function getHomeSeo(lang: Lang): PageSeo {
  return HOME_SEO[lang];
}

export function getPageSeo(page: StudioPage, lang: Lang): PageSeo {
  return PAGE_SEO[page][lang] ?? PAGE_SEO[page].en;
}

export function getBlogIndexSeo(lang: Lang = 'en'): PageSeo {
  return BLOG_INDEX_SEO[lang] ?? BLOG_INDEX_SEO.en;
}

export function formatPageTitle(pageTitle: string, lang: Lang = 'en'): string {
  if (pageTitle.includes('|')) {
    return pageTitle;
  }

  const suffix = lang === 'pt' ? 'JPCLOW | Estúdio de Software' : 'JPCLOW | Software Studio';

  return `${pageTitle} | ${suffix}`;
}

function normalizePathname(pathname: string): string {
  if (pathname === '/pt' || pathname === '/pt/') {
    return '/pt/';
  }

  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  if (withLeadingSlash === '/') {
    return '/';
  }

  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

function absoluteUrl(pathname: string, siteUrl: URL): string {
  return new URL(normalizePathname(pathname), siteUrl).toString();
}

export function getPathAlternates(pathname: string, siteUrl: URL): AlternateLink[] {
  const normalized = normalizePathname(pathname);

  if (normalized === '/' || normalized === '/pt/') {
    return [
      { hreflang: SITE.localeMap.en, url: absoluteUrl('/', siteUrl) },
      { hreflang: SITE.localeMap.pt, url: absoluteUrl('/pt/', siteUrl) },
      { hreflang: 'x-default', url: absoluteUrl('/', siteUrl) },
    ];
  }

  const staticMatch = normalized.match(/^\/(?:pt\/)?(services|about|contact|projects)\/$/);
  if (staticMatch) {
    const path = `/${staticMatch[1]}/`;
    return [
      { hreflang: SITE.localeMap.en, url: absoluteUrl(path, siteUrl) },
      { hreflang: SITE.localeMap.pt, url: absoluteUrl(`/pt${path}`, siteUrl) },
      { hreflang: 'x-default', url: absoluteUrl(path, siteUrl) },
    ];
  }

  if (normalized === '/blog/' || normalized === '/pt/blog/') {
    return [
      { hreflang: SITE.localeMap.en, url: absoluteUrl('/blog/', siteUrl) },
      { hreflang: SITE.localeMap.pt, url: absoluteUrl('/pt/blog/', siteUrl) },
      { hreflang: 'x-default', url: absoluteUrl('/blog/', siteUrl) },
    ];
  }

  const blogMatch = normalized.match(/^\/(?:pt\/)?blog\/([^/]+)\/$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    return [
      { hreflang: SITE.localeMap.en, url: absoluteUrl(`/blog/${slug}/`, siteUrl) },
      { hreflang: SITE.localeMap.pt, url: absoluteUrl(`/pt/blog/${slug}/`, siteUrl) },
      { hreflang: 'x-default', url: absoluteUrl(`/blog/${slug}/`, siteUrl) },
    ];
  }

  const projectMatch = normalized.match(/^\/(?:pt\/)?projects\/([^/]+)\/$/);
  if (projectMatch) {
    const slug = projectMatch[1];
    return [
      { hreflang: SITE.localeMap.en, url: absoluteUrl(`/projects/${slug}/`, siteUrl) },
      { hreflang: SITE.localeMap.pt, url: absoluteUrl(`/pt/projects/${slug}/`, siteUrl) },
      { hreflang: 'x-default', url: absoluteUrl(`/projects/${slug}/`, siteUrl) },
    ];
  }

  if (normalized.startsWith('/pt/')) {
    const url = absoluteUrl(normalized, siteUrl);
    return [
      { hreflang: SITE.localeMap.pt, url },
      { hreflang: 'x-default', url: absoluteUrl(normalized.replace(/^\/pt/, '') || '/', siteUrl) },
    ];
  }

  const url = absoluteUrl(normalized, siteUrl);
  return [
    { hreflang: SITE.localeMap.en, url },
    { hreflang: 'x-default', url },
  ];
}

export function getOgLocale(lang: Lang): string {
  return SITE.localeMap[lang];
}

export function getAlternateOgLocales(lang: Lang): string[] {
  return (Object.entries(SITE.localeMap) as Array<[Lang, string]>)
    .filter(([entryLang]) => entryLang !== lang)
    .map(([, locale]) => locale);
}

interface SchemaOptions {
  lang: Lang;
  siteUrl: URL;
  description: string;
}

export function buildPersonSchema({ lang, siteUrl }: SchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}#person`,
    name: SITE.author,
    alternateName: ['João Paulo Santos', 'Joao Paulo Goncalves Santos'],
    url: new URL(lang === 'pt' ? '/pt/about/' : '/about/', siteUrl).toString(),
    email: SITE.email,
    jobTitle: lang === 'pt' ? 'Fundador e Engenheiro Principal' : 'Founder & Principal Engineer',
    worksFor: { '@id': `${siteUrl}#organization` },
    nationality: {
      '@type': 'Country',
      name: 'Brazil',
    },
    homeLocation: {
      '@type': 'Place',
      name: 'Rio Verde, GO, Brazil',
    },
    knowsAbout: ['Python', 'Django', 'TypeScript', 'SvelteKit', 'React', 'Astro', 'Cloudflare Workers', 'Neon Postgres'],
    sameAs: [SOCIAL.github, SOCIAL.linkedin, SOCIAL.instagram],
  };
}

export function buildProfessionalServiceSchema({ lang, siteUrl }: SchemaOptions) {
  const copy = getStudioCopy(lang);

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}#organization`,
    name: SITE.company,
    url: siteUrl.toString(),
    logo: new URL('/brand/logo-primary.svg', siteUrl).toString(),
    image: new URL('/og-image.png', siteUrl).toString(),
    description: HOME_SEO[lang].description,
    email: SITE.email,
    founder: { '@id': `${siteUrl}#person` },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rio Verde',
      addressRegion: 'GO',
      addressCountry: 'BR',
    },
    areaServed: [
      { '@type': 'Country', name: 'Brazil' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    availableLanguage: ['English', 'Portuguese'],
    serviceType: copy.services.map((service) => service.title),
    knowsAbout: ['TypeScript', 'Python', 'Django', 'SvelteKit', 'React', 'Astro', 'Cloudflare', 'PostgreSQL', 'Geospatial data', 'Applied AI'],
    sameAs: [SOCIAL.github, SOCIAL.linkedin],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: SITE.email,
      url: new URL(lang === 'pt' ? '/pt/contact/' : '/contact/', siteUrl).toString(),
      availableLanguage: ['English', 'Portuguese'],
      areaServed: 'Worldwide',
    },
  };
}

export function buildServicesSchema(lang: Lang, siteUrl: URL) {
  const copy = getStudioCopy(lang);
  const pageUrl = new URL(lang === 'pt' ? '/pt/services/' : '/services/', siteUrl).toString();

  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: lang === 'pt' ? 'Serviços JPCLOW' : 'JPCLOW services',
    url: pageUrl,
    itemListElement: copy.services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        url: `${pageUrl}#${service.id}`,
        provider: { '@id': `${siteUrl}#organization` },
      },
    })),
  };
}

export function buildWebsiteSchema({ lang, siteUrl }: Pick<SchemaOptions, 'lang' | 'siteUrl'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: SITE.company,
    url: siteUrl.toString(),
    inLanguage: SITE.localeMap[lang],
    publisher: {
      '@id': `${siteUrl}#organization`,
    },
    potentialAction: {
      '@type': 'ContactAction',
      target: new URL(lang === 'pt' ? '/pt/contact/' : '/contact/', siteUrl).toString(),
      name: lang === 'pt' ? 'Iniciar um projeto' : 'Start a project',
    },
  };
}

export function buildHomeFaqSchema(lang: Lang) {
  const faq = getStudioCopy(lang).faq;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildDefaultSchemas(options: SchemaOptions) {
  return [
    buildWebsiteSchema(options),
    buildProfessionalServiceSchema(options),
    buildPersonSchema(options),
  ];
}

export function buildHomeSchemas(options: SchemaOptions) {
  return [...buildDefaultSchemas(options), buildHomeFaqSchema(options.lang)];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildProjectBreadcrumbSchema({
  lang,
  siteUrl,
  title,
  slug,
}: {
  lang: Lang;
  siteUrl: URL;
  title: string;
  slug: string;
}) {
  const isPt = lang === 'pt';
  const prefix = isPt ? '/pt' : '';
  const baseUrl = siteUrl.origin || 'https://jpclow.dev';
  const homeUrl = new URL(isPt ? '/pt/' : '/', baseUrl).toString();
  const projectsUrl = new URL(`${prefix}/projects/`, baseUrl).toString();
  const caseUrl = new URL(`${prefix}/projects/${slug}/`, baseUrl).toString();

  return buildBreadcrumbSchema([
    {
      name: isPt ? 'Início' : 'Home',
      url: homeUrl,
    },
    {
      name: isPt ? 'Projetos e cases' : 'Projects & case studies',
      url: projectsUrl,
    },
    {
      name: title,
      url: caseUrl,
    },
  ]);
}

export function buildBlogBreadcrumbSchema({
  lang = 'en',
  siteUrl,
  title,
  slug,
}: {
  lang?: Lang;
  siteUrl: URL;
  title: string;
  slug: string;
}) {
  const isPt = lang === 'pt';
  const prefix = isPt ? '/pt' : '';
  const baseUrl = siteUrl.origin || 'https://jpclow.dev';
  const homeUrl = new URL(isPt ? '/pt/' : '/', baseUrl).toString();
  const blogUrl = new URL(`${prefix}/blog/`, baseUrl).toString();
  const postUrl = new URL(`${prefix}/blog/${slug}/`, baseUrl).toString();

  return buildBreadcrumbSchema([
    {
      name: isPt ? 'Início' : 'Home',
      url: homeUrl,
    },
    {
      name: 'Blog',
      url: blogUrl,
    },
    {
      name: title,
      url: postUrl,
    },
  ]);
}

export function getProjectOgImageUrl(slug: string, langOrSiteUrl?: Lang | URL, siteUrl?: URL): string {
  let lang: Lang = 'en';
  let url: URL | undefined = siteUrl;

  if (langOrSiteUrl instanceof URL) {
    url = langOrSiteUrl;
  } else if (langOrSiteUrl) {
    lang = langOrSiteUrl;
  }

  const isPt = lang === 'pt';
  const path = isPt ? `/open-graph/pt/projects/${slug}.png` : `/open-graph/projects/${slug}.png`;
  return url ? new URL(path, url).toString() : path;
}

export function getBlogOgImageUrl(slug: string, langOrSiteUrl?: Lang | URL, siteUrl?: URL): string {
  let lang: Lang = 'en';
  let url: URL | undefined = siteUrl;

  if (langOrSiteUrl instanceof URL) {
    url = langOrSiteUrl;
  } else if (langOrSiteUrl) {
    lang = langOrSiteUrl;
  }

  const isPt = lang === 'pt';
  const path = isPt ? `/open-graph/pt/blog/${slug}.png` : `/open-graph/blog/${slug}.png`;
  return url ? new URL(path, url).toString() : path;
}

export const SITE_OG_PAGES = ['home', 'services', 'about', 'contact', 'projects', 'blog'] as const;
export type SiteOgPageId = (typeof SITE_OG_PAGES)[number];

export function getSiteOgImageUrl(page: SiteOgPageId, lang: Lang = 'en'): string {
  return lang === 'pt' ? `/open-graph/pt/site/${page}.png` : `/open-graph/site/${page}.png`;
}

const STUDIO_PAGE_TYPES: Record<StudioPage, string> = {
  services: 'WebPage',
  about: 'AboutPage',
  contact: 'ContactPage',
};

const STUDIO_PAGE_CRUMBS: Record<StudioPage, Record<Lang, string>> = {
  services: { en: 'Services', pt: 'Serviços' },
  about: { en: 'Company', pt: 'Empresa' },
  contact: { en: 'Contact', pt: 'Contato' },
};

/** WebPage (typed) + BreadcrumbList for /services/, /about/, /contact/ in either locale. */
export function buildStudioPageSchemas(page: StudioPage, lang: Lang, siteUrl: URL) {
  const prefix = lang === 'pt' ? '/pt' : '';
  const pageUrl = new URL(`${prefix}/${page}/`, siteUrl).toString();
  const seo = getPageSeo(page, lang);

  return [
    {
      '@context': 'https://schema.org',
      '@type': STUDIO_PAGE_TYPES[page],
      '@id': `${pageUrl}#webpage`,
      name: seo.title,
      description: seo.description,
      url: pageUrl,
      inLanguage: SITE.localeMap[lang],
      isPartOf: { '@id': `${siteUrl}#website` },
      about: { '@id': `${siteUrl}#organization` },
      primaryImageOfPage: new URL(getSiteOgImageUrl(page, lang), siteUrl).toString(),
    },
    buildBreadcrumbSchema([
      { name: lang === 'pt' ? 'Início' : 'Home', url: new URL(`${prefix}/`, siteUrl).toString() },
      { name: STUDIO_PAGE_CRUMBS[page][lang], url: pageUrl },
    ]),
  ];
}
