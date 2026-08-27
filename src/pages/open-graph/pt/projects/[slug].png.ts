import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { generateProjectOgImage } from '@/lib/og-image';

export async function getStaticPaths() {
  const projects = await getCollection('projects', ({ data }) => data.caseStudy && data.lang === 'pt');
  return projects.map((project) => ({
    params: { slug: project.data.slug },
    props: { project },
  }));
}

interface Props {
  project: CollectionEntry<'projects'>;
}

export const GET: APIRoute = async ({ props }) => {
  const { project } = props as Props;
  const pngBuffer = await generateProjectOgImage(project, 'pt');

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
