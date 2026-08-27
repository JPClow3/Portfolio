import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { CollectionEntry } from 'astro:content';
import type { Lang } from './i18n';
import { SITE } from './seo';


export interface OgImageOptions {
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  lang?: Lang;
  author?: string;
  role?: string;
  badge?: string;
  siteDomain?: string;
}

interface LoadedFont {
  name: string;
  data: ArrayBuffer | Buffer;
  weight: 400 | 600 | 700;
  style: 'normal';
}

let cachedFonts: LoadedFont[] | null = null;

function loadFonts(): LoadedFont[] {
  if (cachedFonts) return cachedFonts;

  const fontPaths = [
    {
      weight: 400 as const,
      subpath: 'node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-400-normal.woff',
    },
    {
      weight: 600 as const,
      subpath: 'node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-600-normal.woff',
    },
    {
      weight: 700 as const,
      subpath: 'node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff',
    },
  ];

  const fonts: LoadedFont[] = [];
  const cwd = process.cwd();

  for (const { weight, subpath } of fontPaths) {
    const fullPath = resolve(cwd, subpath);
    if (existsSync(fullPath)) {
      fonts.push({
        name: 'Plus Jakarta Sans',
        data: readFileSync(fullPath),
        weight,
        style: 'normal',
      });
    }
  }

  if (fonts.length === 0) {
    throw new Error('Could not load Plus Jakarta Sans fonts for OG image generation');
  }

  cachedFonts = fonts;
  return fonts;
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trimEnd() + '...';
}

export async function renderOgSvg(options: OgImageOptions): Promise<string> {
  const fonts = loadFonts();

  const title = options.title.trim();
  const description = options.description ? truncateText(options.description.trim(), 135) : '';
  const category = options.category ?? (options.lang === 'pt' ? 'Estudo de Caso' : 'Case Study');
  const author = options.author ?? 'João Paulo Santos';
  const role = options.role ?? (options.lang === 'pt' ? 'Desenvolvedor Freelancer' : 'Freelance Software Developer');
  const siteDomain = options.siteDomain ?? 'jpclow.dev';
  const tags = (options.tags ?? []).slice(0, 4);

  // Dynamic font sizing
  const titleFontSize = title.length > 50 ? 40 : title.length > 32 ? 48 : 56;

  return await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 64px',
          background: 'linear-gradient(145deg, #090D16 0%, #0c1527 50%, #0F172A 100%)',
          color: 'white',
          fontFamily: 'Plus Jakarta Sans',
          position: 'relative',
        },
        children: [
          // Top right subtle ambient glow
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '0px',
                right: '0px',
                width: '500px',
                height: '380px',
                background: 'radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.12), transparent 70%)',
              },
            },
          },
          // Bottom left subtle ambient glow
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '0px',
                left: '0px',
                width: '450px',
                height: '320px',
                background: 'radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1), transparent 70%)',
              },
            },
          },
          // Header Bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(56, 189, 248, 0.12)',
                            border: '1px solid rgba(56, 189, 248, 0.35)',
                            borderRadius: '9999px',
                            padding: '6px 16px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '9999px',
                                  backgroundColor: '#38BDF8',
                                },
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  fontWeight: 700,
                                  color: '#38BDF8',
                                  letterSpacing: '0.12em',
                                  textTransform: 'uppercase',
                                },
                                children: category,
                              },
                            },
                          ],
                        },
                      },
                      options.badge
                        ? {
                            type: 'div',
                            props: {
                              style: {
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '9999px',
                                padding: '6px 14px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#94A3B8',
                              },
                              children: options.badge,
                            },
                          }
                        : null,
                    ].filter(Boolean),
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#64748B',
                      letterSpacing: '0.02em',
                    },
                    children: siteDomain,
                  },
                },
              ],
            },
          },
          // Center Body
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                margin: 'auto 0',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: `${titleFontSize}px`,
                      fontWeight: 700,
                      color: '#F8FAFC',
                      lineHeight: 1.15,
                      letterSpacing: '-0.025em',
                    },
                    children: title,
                  },
                },
                description
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '22px',
                          fontWeight: 400,
                          color: '#94A3B8',
                          lineHeight: 1.45,
                        },
                        children: description,
                      },
                    }
                  : null,
              ].filter(Boolean),
            },
          },
          // Bottom Footer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                width: '100%',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '10px',
                      flexWrap: 'wrap',
                    },
                    children: tags.map((t) => ({
                      type: 'div',
                      props: {
                        style: {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          padding: '7px 14px',
                          color: '#CBD5E1',
                          fontSize: '15px',
                          fontWeight: 600,
                        },
                        children: t,
                      },
                    })),
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '4px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#F1F5F9',
                          },
                          children: author,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#64748B',
                          },
                          children: role,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
}

export async function renderOgPng(options: OgImageOptions): Promise<Buffer> {
  const svg = await renderOgSvg(options);
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });
  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}

export async function generateProjectOgImage(
  project: CollectionEntry<'projects'>,
  lang: Lang = project.data.lang
): Promise<Buffer> {
  const isPt = lang === 'pt';
  return renderOgPng({
    title: project.data.title,
    description: project.data.description,
    category: isPt ? 'Estudo de Caso' : 'Case Study',
    tags: project.data.tech,
    lang,
    author: SITE.shortAuthor,
    role: isPt ? 'Desenvolvedor Freelancer' : 'Freelance Software Developer',
    badge: project.data.year ?? (project.data.status === 'in-development' ? (isPt ? 'Em Desenvolvimento' : 'In Dev') : undefined),
    siteDomain: SITE.name,
  });
}

export async function generateBlogOgImage(
  post: CollectionEntry<'blog'>,
  lang: Lang = post.data.lang
): Promise<Buffer> {
  const isPt = lang === 'pt';
  return renderOgPng({
    title: post.data.title,
    description: post.data.description,
    category: isPt ? 'Artigo' : 'Blog Article',
    tags: post.data.tags,
    lang,
    author: SITE.shortAuthor,
    role: isPt ? 'Desenvolvedor Freelancer' : 'Freelance Software Developer',
    siteDomain: SITE.name,
  });
}
