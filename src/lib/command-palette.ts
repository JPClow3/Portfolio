import type { Lang } from '@/lib/i18n';

export type CommandKind = 'navigate' | 'external' | 'email' | 'download';

export interface CommandPaletteProject {
  title: string;
  slug: string;
  status: 'live' | 'in-development';
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
    sections: 'Sections',
    projects: 'Projects',
    experience: 'Experience',
    approach: 'What I optimize for',
    activity: 'GitHub activity',
    contact: 'Contact',
    blog: 'Blog',
    links: 'Links',
    github: 'GitHub profile',
    linkedin: 'LinkedIn',
    email: 'Email João',
    resume: 'Download resume',
    inDevelopment: 'In development',
  },
  pt: {
    sections: 'Seções',
    projects: 'Projetos',
    experience: 'Experiência',
    approach: 'O que eu otimizo',
    activity: 'Atividade no GitHub',
    contact: 'Contato',
    blog: 'Blog',
    links: 'Links',
    github: 'Perfil no GitHub',
    linkedin: 'LinkedIn',
    email: 'Enviar email para João',
    resume: 'Baixar currículo',
    inDevelopment: 'Em desenvolvimento',
  },
} as const;

export function buildCommandPaletteItems({ lang, profile, projects }: BuildCommandPaletteItemsOptions): CommandPaletteItem[] {
  const t = copy[lang];
  const localePrefix = lang === 'pt' ? '/pt' : '';
  const resumeHref = lang === 'pt' ? '/resume-pt.pdf' : '/resume-en.pdf';

  return [
    { id: 'section-projects', label: t.projects, group: t.sections, href: `${localePrefix}/#projects`, kind: 'navigate', keywords: ['work', 'portfolio'] },
    { id: 'section-experience', label: t.experience, group: t.sections, href: `${localePrefix}/#experience`, kind: 'navigate', keywords: ['journey', 'career'] },
    { id: 'section-approach', label: t.approach, group: t.sections, href: `${localePrefix}/#approach`, kind: 'navigate', keywords: ['principles', 'ai'] },
    { id: 'section-activity', label: t.activity, group: t.sections, href: `${localePrefix}/#activity`, kind: 'navigate', keywords: ['commits', 'repositories'] },
    { id: 'section-contact', label: t.contact, group: t.sections, href: `${localePrefix}/#contact`, kind: 'navigate', keywords: ['hire', 'message'] },
    { id: 'blog', label: t.blog, group: t.sections, href: '/blog', kind: 'navigate', keywords: ['writing', 'articles'] },
    ...projects.map((project) => ({
      id: `project-${project.slug}`,
      label: project.title,
      group: t.projects,
      href: `${localePrefix}/projects/${project.slug}/`,
      kind: 'navigate' as const,
      keywords: ['case study', project.status],
      status: project.status === 'in-development' ? t.inDevelopment : undefined,
    })),
    { id: 'github', label: t.github, group: t.links, href: profile.github, kind: 'external', keywords: ['repositories', 'code'] },
    { id: 'linkedin', label: t.linkedin, group: t.links, href: profile.linkedin, kind: 'external', keywords: ['professional', 'network'] },
    { id: 'email', label: t.email, group: t.links, href: `mailto:${profile.email}`, kind: 'email', keywords: ['contact', 'message'] },
    { id: 'resume', label: t.resume, group: t.links, href: resumeHref, kind: 'download', keywords: ['cv', 'curriculum'] },
  ];
}
