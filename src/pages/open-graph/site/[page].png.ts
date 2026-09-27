import type { APIRoute } from 'astro';
import { generateSiteOgImage } from '@/lib/og-image';
import { SITE_OG_PAGES, type SiteOgPageId } from '@/lib/seo';
import { getSiteOgPage } from '@/lib/site-og';

export function getStaticPaths() {
  return SITE_OG_PAGES.map((page) => ({ params: { page } }));
}

export const GET: APIRoute = async ({ params }) => {
  const page = params.page as SiteOgPageId;
  const pngBuffer = await generateSiteOgImage(getSiteOgPage(page, 'en'), 'en');

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
