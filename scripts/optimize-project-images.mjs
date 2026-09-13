import { readdir, stat } from 'node:fs/promises';
import { extname, join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectImagesDirectory = fileURLToPath(new URL('../public/projects/', import.meta.url));
const entries = await readdir(projectImagesDirectory);
const pngFiles = entries.filter((entry) => extname(entry).toLowerCase() === '.png');

if (pngFiles.length === 0) {
  console.log('[OK] No PNG project previews need optimization.');
  process.exit(0);
}

for (const file of pngFiles) {
  const input = join(projectImagesDirectory, file);
  const output = join(projectImagesDirectory, `${parse(file).name}.webp`);
  await sharp(input).webp({ quality: 82, effort: 6 }).toFile(output);

  const [before, after] = await Promise.all([stat(input), stat(output)]);
  const reduction = Math.round((1 - after.size / before.size) * 100);
  console.log(`[OK] ${file} -> ${parse(file).name}.webp (${reduction}% smaller)`);
}
