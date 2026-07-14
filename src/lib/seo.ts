import type { Lang } from '@/lib/i18n';

export const SITE = {
  name: 'jpclow.dev',
  url: 'https://jpclow.dev',
  author: 'João Paulo Gonçalves Santos',
  shortAuthor: 'João Paulo Santos',
  email: 'joaopaulo.grv4@gmail.com',
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
    title: 'João Paulo Santos | Freelance Software Developer — Python, Django & React',
    description:
      'Freelance software developer in Brazil. I build web apps, APIs, and automation with Python, Django, React, and TypeScript. Available for contract work — view projects and get in touch.',
    keywords: [
      'freelance software developer',
      'freelance web developer',
      'hire freelance developer',
      'Python developer for hire',
      'Django developer freelance',
      'React developer Brazil',
      'remote freelance developer',
      'contract software developer',
      'full stack freelance developer',
      'João Paulo Santos developer',
    ],
  },
  pt: {
    title: 'João Paulo Santos | Desenvolvedor Freelancer — Python, Django e React',
    description:
      'Desenvolvedor freelancer no Brasil. Crio aplicações web, APIs e automações com Python, Django, React e TypeScript. Disponível para projetos e contratos — veja o portfólio e entre em contato.',
    keywords: [
      'desenvolvedor freelancer',
      'desenvolvedor de software freelancer',
      'contratar desenvolvedor freelancer',
      'desenvolvedor Python freelance',
      'desenvolvedor Django freelancer',
      'desenvolvedor React Brasil',
      'desenvolvedor remoto freelancer',
      'desenvolvedor full stack freelance',
      'João Paulo Santos desenvolvedor',
    ],
  },
};

const BLOG_INDEX_SEO: PageSeo = {
  title: 'Blog | João Paulo Santos — Freelance Developer',
  description:
    'Notes on web development, automation, and building reliable software from a freelance developer working with Python, Django, and React.',
  keywords: [
    'freelance developer blog',
    'web development blog',
    'Python Django tutorials',
    'software engineering notes',
  ],
};

export function getHomeSeo(lang: Lang): PageSeo {
  return HOME_SEO[lang];
}

export function getBlogIndexSeo(): PageSeo {
  return BLOG_INDEX_SEO;
}

export function formatPageTitle(pageTitle: string, lang: Lang = 'en'): string {
  if (pageTitle.includes('|')) {
    return pageTitle;
  }

  const suffix =
    lang === 'pt'
      ? 'João Paulo Santos | Desenvolvedor Freelancer'
      : 'João Paulo Santos | Freelance Developer';

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

  const projectMatch = normalized.match(/^\/(?:pt\/)?projects\/([^/]+)\/$/);
  if (projectMatch) {
    const slug = projectMatch[1];
    return [
      { hreflang: SITE.localeMap.en, url: absoluteUrl(`/projects/${slug}/`, siteUrl) },
      { hreflang: SITE.localeMap.pt, url: absoluteUrl(`/pt/projects/${slug}/`, siteUrl) },
      { hreflang: 'x-default', url: absoluteUrl(`/projects/${slug}/`, siteUrl) },
    ];
  }

  if (normalized.startsWith('/blog')) {
    const url = absoluteUrl(normalized, siteUrl);
    return [
      { hreflang: SITE.localeMap.en, url },
      { hreflang: 'x-default', url },
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

export function buildPersonSchema({ lang, siteUrl, description }: SchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${siteUrl}#person`,
    name: SITE.author,
    alternateName: ['João Paulo Santos', 'Joao Paulo Goncalves Santos'],
    url: siteUrl.toString(),
    email: SITE.email,
    image: new URL('/og-image.svg', siteUrl).toString(),
    jobTitle: lang === 'pt' ? 'Desenvolvedor de Software Freelancer' : 'Freelance Software Developer',
    description,
    nationality: {
      '@type': 'Country',
      name: 'Brazil',
    },
    homeLocation: {
      '@type': 'Place',
      name: 'Brazil',
    },
    knowsAbout: [
      'Python',
      'Django',
      'React',
      'TypeScript',
      'Astro',
      'Web Development',
      'API Development',
      'Automation',
      'Software Engineering',
    ],
    sameAs: [SOCIAL.github, SOCIAL.linkedin, SOCIAL.instagram],
  };
}

export function buildProfessionalServiceSchema({ lang, siteUrl, description }: SchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}#freelance-service`,
    name: lang === 'pt' ? 'João Paulo Santos — Desenvolvimento Freelancer' : 'João Paulo Santos — Freelance Development',
    url: siteUrl.toString(),
    description,
    image: new URL('/og-image.svg', siteUrl).toString(),
    areaServed: [
      { '@type': 'Country', name: 'Brazil' },
      { '@type': 'Place', name: 'Worldwide' },
    ],
    availableLanguage: ['English', 'Portuguese'],
    provider: {
      '@id': `${siteUrl}#person`,
    },
    serviceType: [
      'Web Application Development',
      'API Development',
      'Automation Engineering',
      'Full Stack Development',
    ],
    knowsAbout: ['Python', 'Django', 'React', 'TypeScript', 'Astro', 'Tailwind CSS'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: SITE.email,
      availableLanguage: ['English', 'Portuguese'],
      areaServed: 'Worldwide',
    },
  };
}

export function buildWebsiteSchema({ lang, siteUrl }: Pick<SchemaOptions, 'lang' | 'siteUrl'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    name: SITE.name,
    url: siteUrl.toString(),
    inLanguage: SITE.localeMap[lang],
    publisher: {
      '@id': `${siteUrl}#person`,
    },
    potentialAction: {
      '@type': 'ContactAction',
      target: `${siteUrl.toString()}#contact`,
      name: lang === 'pt' ? 'Entrar em contato' : 'Get in touch',
    },
  };
}

export function buildHomeFaqSchema(lang: Lang) {
  const faq =
    lang === 'pt'
      ? [
          {
            question: 'Você trabalha como desenvolvedor freelancer?',
            answer:
              'Sim. Trabalho como desenvolvedor freelancer em projetos de aplicações web, APIs, automação e integrações com Python, Django, React e TypeScript.',
          },
          {
            question: 'Quais serviços você oferece?',
            answer:
              'Desenvolvimento full stack, criação de APIs, automação de processos, integrações, dashboards e produtos web com foco em performance, acessibilidade e entrega confiável.',
          },
          {
            question: 'Você aceita trabalho remoto?',
            answer:
              'Sim. Trabalho remotamente com clientes no Brasil e no exterior, com comunicação em português e inglês.',
          },
          {
            question: 'Como contratar você para um projeto?',
            answer:
              'Envie uma mensagem pelo formulário de contato em jpclow.dev ou conecte pelo LinkedIn. Respondo com disponibilidade, escopo e próximos passos.',
          },
        ]
      : [
          {
            question: 'Do you work as a freelance software developer?',
            answer:
              'Yes. I take on freelance projects building web applications, APIs, automation pipelines, and integrations with Python, Django, React, and TypeScript.',
          },
          {
            question: 'What freelance development services do you offer?',
            answer:
              'Full stack web development, API design, workflow automation, integrations, dashboards, and product engineering with a focus on performance, accessibility, and reliable delivery.',
          },
          {
            question: 'Are you available for remote freelance work?',
            answer:
              'Yes. I work remotely with clients in Brazil and internationally, in both English and Portuguese.',
          },
          {
            question: 'How do I hire you for a project?',
            answer:
              'Send a message through the contact form at jpclow.dev or connect on LinkedIn. I reply with availability, scope, and next steps.',
          },
        ];

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
    buildPersonSchema(options),
    buildProfessionalServiceSchema(options),
  ];
}

export function buildHomeSchemas(options: SchemaOptions) {
  return [...buildDefaultSchemas(options), buildHomeFaqSchema(options.lang)];
}
