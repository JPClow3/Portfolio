import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const site = context.site ?? 'https://jpclow.dev';

  return rss({
    title: 'João Paulo Santos — Blog',
    description:
      'Notes on web development, automation, APIs, and software engineering from a freelance developer working with Python, Django, and React.',
    site,
    items: sortedPosts.map((post) => {
      const slug = post.data.slug ?? post.id.replace(/^pt\//, '').replace(/\.(md|mdx)$/i, '');
      const link = post.data.lang === 'pt' ? `/pt/blog/${slug}/` : `/blog/${slug}/`;
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link,
        categories: post.data.tags,
        customData: `<language>${post.data.lang === 'pt' ? 'pt-BR' : 'en-US'}</language>`,
      };
    }),
    customData: `<language>en-US</language><atom:link href="${new URL('/rss.xml', site).toString()}" rel="self" type="application/rss+xml"/>`,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
  });
};
