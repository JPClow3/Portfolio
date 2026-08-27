import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { generateBlogOgImage } from '@/lib/og-image';

export async function getStaticPaths() {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft);
  const ptPosts = allPosts.filter((p) => p.data.lang === 'pt');
  const enPosts = allPosts.filter((p) => p.data.lang === 'en');

  const paths: Array<{ params: { slug: string }; props: { post: CollectionEntry<'blog'> } }> = [];
  const seenSlugs = new Set<string>();

  for (const post of ptPosts) {
    const slug = post.data.slug ?? post.id.replace(/^pt\//, '').replace(/\.(md|mdx)$/i, '');
    seenSlugs.add(slug);
    paths.push({ params: { slug }, props: { post } });
  }

  for (const post of enPosts) {
    const slug = post.data.slug ?? post.id.replace(/^pt\//, '').replace(/\.(md|mdx)$/i, '');
    if (!seenSlugs.has(slug)) {
      seenSlugs.add(slug);
      paths.push({ params: { slug }, props: { post } });
    }
  }

  return paths;
}

interface Props {
  post: CollectionEntry<'blog'>;
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as Props;
  const pngBuffer = await generateBlogOgImage(post, 'pt');

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
