import type { Lang } from '@/lib/i18n';

export type CommandKind = 'navigate' | 'external' | 'email' | 'download';

export interface CommandPaletteProject {
  title: string;
  slug: string;
  status: 'live' | 'in-development' | 'research' | 'prototype' | 'private-source' | 'archived';
}

export interface CommandPaletteProfile {
  github: string;
  linkedin: string;
  email: string;
}

export interface CommandPaletteItem {
  id: string;
  label: string;
  group: string;
  href: string;
  kind: CommandKind;
  keywords: string[];
  status?: string;
}

interface BuildCommandPaletteItemsOptions {
  lang: Lang;
  profile: CommandPaletteProfile;
  projects: CommandPaletteProject[];
}

const copy = {
  en: {
    sections: 'Pages',
    services: 'Services',
    projects: 'Projects & case studies',
    process: 'Process',
    company: 'Company',
    blog: 'Blog',
    contact: 'Start a project',
    links: 'Links',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    email: 'Email JPCLOW',
    inDevelopment: 'In development',
    research: 'Research',
    prototype: 'Prototype',
    privateSource: 'Private source',
    archived: 'Archived',
  },
  pt: {
    sections: 'Páginas',
    services: 'Serviços',
    projects: 'Projetos e cases',
    process: 'Processo',
    company: 'Empresa',
    blog: 'Blog',
    contact: 'Iniciar um projeto',
    links: 'Links',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    email: 'Enviar email para a JPCLOW',
    inDevelopment: 'Em desenvolvimento',
    research: 'Pesquisa',
    prototype: 'Protótipo',
    privateSource: 'Código privado',
    archived: 'Arquivado',
  },
} as const;

export function buildCommandPaletteItems({ lang, profile, projects }: BuildCommandPaletteItemsOptions): CommandPaletteItem[] {
  const t = copy[lang];
  const localePrefix = lang === 'pt' ? '/pt' : '';
  const projectStatus = {
    live: undefined,
    'in-development': t.inDevelopment,
    research: t.research,
    prototype: t.prototype,
    'private-source': t.privateSource,
    archived: t.archived,
  } as const;

  return [
    { id: 'section-services', label: t.services, group: t.sections, href: `${localePrefix}/services/`, kind: 'navigate', keywords: ['capabilities', 'development', 'automation', 'ai'] },
    { id: 'section-projects', label: t.projects, group: t.sections, href: `${localePrefix}/projects/`, kind: 'navigate', keywords: ['work', 'portfolio', 'cases'] },
    { id: 'section-process', label: t.process, group: t.sections, href: `${localePrefix}/#process`, kind: 'navigate', keywords: ['delivery', 'sprints'] },
    { id: 'section-company', label: t.company, group: t.sections, href: `${localePrefix}/about/`, kind: 'navigate', keywords: ['about', 'founder', 'studio'] },
    { id: 'section-blog', label: t.blog, group: t.sections, href: `${localePrefix}/blog/`, kind: 'navigate', keywords: ['articles', 'notes'] },
    { id: 'section-contact', label: t.contact, group: t.sections, href: `${localePrefix}/contact/`, kind: 'navigate', keywords: ['hire', 'proposal', 'message'] },
    ...projects.map((project) => ({
      id: `project-${project.slug}`,
      label: project.title,
      group: t.projects,
      href: `${localePrefix}/projects/${project.slug}/`,
      kind: 'navigate' as const,
      keywords: ['case study', project.status],
      status: projectStatus[project.status],
    })),
    { id: 'github', label: t.github, group: t.links, href: profile.github, kind: 'external', keywords: ['repositories', 'code'] },
    { id: 'linkedin', label: t.linkedin, group: t.links, href: profile.linkedin, kind: 'external', keywords: ['professional', 'network'] },
    { id: 'email', label: t.email, group: t.links, href: `mailto:${profile.email}`, kind: 'email', keywords: ['contact', 'message'] },
  ];
}
