import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Keep in sync with RESPONSIVE_WIDTH in src/lib/images.ts
const RESPONSIVE_WIDTH = 800;

const projectImagesDirectory = fileURLToPath(new URL('../public/projects/', import.meta.url));
const entries = await readdir(projectImagesDirectory);

// 1. Convert source PNG previews to WebP
for (const file of entries.filter((entry) => extname(entry).toLowerCase() === '.png')) {
  const input = join(projectImagesDirectory, file);
  const output = join(projectImagesDirectory, `${parse(file).name}.webp`);
  await sharp(input).webp({ quality: 82, effort: 6 }).toFile(output);

  const [before, after] = await Promise.all([stat(input), stat(output)]);
  const reduction = Math.round((1 - after.size / before.size) * 100);
  console.log(`[OK] ${file} -> ${parse(file).name}.webp (${reduction}% smaller)`);
}

// 2. Emit a narrower variant of every full-size WebP for mobile srcset
const webpFiles = (await readdir(projectImagesDirectory)).filter(
  (entry) => entry.endsWith('.webp') && !entry.endsWith(`-${RESPONSIVE_WIDTH}.webp`),
);

for (const file of webpFiles) {
  const input = join(projectImagesDirectory, file);
  const output = join(projectImagesDirectory, `${parse(file).name}-${RESPONSIVE_WIDTH}.webp`);
  if (existsSync(output) && (await stat(output)).mtimeMs >= (await stat(input)).mtimeMs) continue;

  await sharp(input).resize({ width: RESPONSIVE_WIDTH, withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toFile(output);
  const [before, after] = await Promise.all([stat(input), stat(output)]);
  console.log(`[OK] ${file} -> ${parse(file).name}-${RESPONSIVE_WIDTH}.webp (${Math.round(after.size / 1024)} KiB, was ${Math.round(before.size / 1024)} KiB)`);
}
