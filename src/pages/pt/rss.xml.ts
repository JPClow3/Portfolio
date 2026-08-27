import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async (context) => {
  const ptPosts = await getCollection('blog', ({ data }) => !data.draft && data.lang === 'pt');
  const allPosts = await getCollection('blog', ({ data }) => !data.draft);
  const posts = ptPosts.length > 0 ? ptPosts : allPosts;
  const sortedPosts = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const site = context.site ?? 'https://jpclow.dev';

  return rss({
    title: 'João Paulo Santos — Blog (Português)',
    description:
      'Artigos e reflexões sobre desenvolvimento web, automação, APIs e engenharia de software por um desenvolvedor freelancer com Python, Django e React.',
    site,
    items: sortedPosts.map((post) => {
      const slug = post.data.slug ?? post.id.replace(/^pt\//, '').replace(/\.(md|mdx)$/i, '');
      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/pt/blog/${slug}/`,
        categories: post.data.tags,
        customData: `<language>${post.data.lang === 'pt' ? 'pt-BR' : 'en-US'}</language>`,
      };
    }),
    customData: `<language>pt-BR</language><atom:link href="${new URL('/pt/rss.xml', site).toString()}" rel="self" type="application/rss+xml"/>`,
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
    },
  });
};
