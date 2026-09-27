/**
 * Responsive sources for project screenshots in public/projects/.
 * `npm run images:optimize` emits a `<name>-800.webp` variant next to every full-size WebP.
 */
export const RESPONSIVE_WIDTH = 800;
export const FULL_WIDTH = 1440;

export interface ResponsiveImage {
  src: string;
  srcset?: string;
}

export function projectImageSources(image: string): ResponsiveImage {
  if (!/^\/projects\/[^/]+\.webp$/.test(image) || image.endsWith(`-${RESPONSIVE_WIDTH}.webp`)) {
    return { src: image };
  }

  const small = image.replace(/\.webp$/, `-${RESPONSIVE_WIDTH}.webp`);
  return {
    src: image,
    srcset: `${small} ${RESPONSIVE_WIDTH}w, ${image} ${FULL_WIDTH}w`,
  };
}
