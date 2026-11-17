// Turns a source photo into the smallest AVIF and JPEG files that still look
// the same as the original, for each requested width.
//
// Usage:
//   bun run image <source> <name> <width> [width...] [options]
//
// Options:
//   --aspect=W:H     crop to this shape first, e.g. 4:5 or 3:1
//   --gravity=G      which part to keep when cropping: center (default),
//                    north, south, east, west or attention (most detail)
//   --focus=F        exact crop position from 0 (top or left) to 1
//                    (bottom or right); overrides --gravity
//   --grayscale      bake in black and white, for images always shown so
//   --target=N       SSIMULACRA 2 score to reach (default 80)
//
// Writes public/images/<name>-<width>.avif and .jpg. For each file, it
// searches for the lowest encoder quality whose SSIMULACRA 2 score reaches
// the target (80 = no visible difference side by side). Widths larger than
// the (cropped) source are skipped, so nothing is upscaled. Needs the
// `ssimulacra2` binary from libjxl (`brew install jpeg-xl`).
//
// All metadata (EXIF, including GPS location, XMP and IPTC) is dropped.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';

const OUT_DIR = 'public/images';
const MIN_QUALITY = 30;
const MAX_QUALITY = 95;
const USAGE = 'Usage: bun run image <source> <name> <width> [width...] '
  + '[--aspect=W:H] [--gravity=center] [--grayscale] [--target=80]';

const encoders = {
  avif: (image, quality) => image.avif({
    quality,
    effort: 9
  }),
  jpg: (image, quality) => image.jpeg({
    quality,
    mozjpeg: true
  })
};

const args = process.argv.slice(2);
const option = key => args.find(arg => arg.startsWith(`--${key}=`))?.split('=')[1];
const target = Number(option('target') ?? 80);
const gravity = option('gravity') ?? 'center';
const focus = option('focus') === undefined ? undefined : Number(option('focus'));
const grayscale = args.includes('--grayscale');
const aspect = option('aspect')?.split(':')
  .map(Number);
const [source, name, ...widthArgs] = args.filter(arg => !arg.startsWith('--'));
const widths = widthArgs.map(Number);

const invalidAspect = aspect && (aspect.length !== 2 || aspect.some(n => !(n > 0)));
const invalidFocus = focus !== undefined && !(focus >= 0 && focus <= 1);
const invalid = !source || !name || widths.length === 0 || widths.some(Number.isNaN);
if (invalid || invalidAspect || invalidFocus) {
  console.error(USAGE);
  process.exit(1);
}

const work = mkdtempSync(join(tmpdir(), 'optimize-image-'));

/**
 * Scores an encoded image against the reference with SSIMULACRA 2.
 * Higher is better: 90 is indistinguishable, 80 is not noticeable side by
 * side, 70 is medium quality.
 */
async function score(referencePng, encoded) {
  const decoded = join(work, 'decoded.png');
  await sharp(encoded).png()
    .toFile(decoded);
  const output = execFileSync('ssimulacra2', [referencePng, decoded]);
  return Number(output.toString().trim());
}

/**
 * Binary-searches the lowest quality that reaches the target score. Falls
 * back to the maximum quality when even that misses the target.
 */
async function smallestPassing(prepare, referencePng, encode) {
  let low = MIN_QUALITY;
  let high = MAX_QUALITY;
  let best = null;
  while (low <= high) {
    const quality = Math.floor((low + high) / 2);
    const buffer = await encode(prepare(), quality).toBuffer();
    const result = await score(referencePng, buffer);
    if (result >= target) {
      best = {
        quality,
        buffer,
        result
      };
      high = quality - 1;
    }
    else {
      low = quality + 1;
    }
  }
  if (best) {
    return best;
  }
  const buffer = await encode(prepare(), MAX_QUALITY).toBuffer();
  return {
    quality: MAX_QUALITY,
    buffer,
    result: await score(referencePng, buffer)
  };
}

/**
 * The region to cut out of the upright source for --focus: the largest area
 * with the requested aspect ratio, slid along the axis being cropped.
 */
function focusRegion(sourceWidth, sourceHeight) {
  const ratio = aspect[0] / aspect[1];
  if (sourceWidth / sourceHeight > ratio) {
    const width = Math.round(sourceHeight * ratio);
    return {
      left: Math.round((sourceWidth - width) * focus),
      top: 0,
      width,
      height: sourceHeight
    };
  }
  const height = Math.round(sourceWidth / ratio);
  return {
    left: 0,
    top: Math.round((sourceHeight - height) * focus),
    width: sourceWidth,
    height
  };
}

/**
 * Builds the resize pipeline for one width: orientation, crop, optional
 * black and white, sRGB output.
 */
function pipeline(width, region) {
  const height = aspect ? Math.round(width * aspect[1] / aspect[0]) : undefined;
  let image = sharp(source).rotate();
  if (region) {
    image = image.extract(region);
  }
  image = image.resize({
    width,
    height,
    fit: 'cover',
    position: gravity === 'attention' ? sharp.strategy.attention : gravity
  });
  if (grayscale) {
    // Matches the design's CSS: grayscale(1) contrast(1.05).
    image = image.grayscale().linear(1.05, -0.05 * 128);
  }
  return image.toColorspace('srgb');
}

try {
  const meta = await sharp(source).metadata();
  // EXIF orientations 5 to 8 are rotated by 90 degrees.
  const rotated = (meta.orientation ?? 1) >= 5;
  const sourceWidth = rotated ? meta.height : meta.width;
  const sourceHeight = rotated ? meta.width : meta.height;
  const maxWidth = aspect
    ? Math.min(sourceWidth, Math.floor(sourceHeight * aspect[0] / aspect[1]))
    : sourceWidth;

  for (const width of widths) {
    if (width > maxWidth) {
      console.warn(`Skipping ${width}px: the largest possible width is ${maxWidth}px.`);
      continue;
    }
    const region = aspect && focus !== undefined
      ? focusRegion(sourceWidth, sourceHeight)
      : undefined;
    const prepare = () => pipeline(width, region);
    const referencePng = join(work, `reference-${width}.png`);
    await prepare().png()
      .toFile(referencePng);

    for (const [extension, encode] of Object.entries(encoders)) {
      const { quality, buffer, result } = await smallestPassing(prepare, referencePng, encode);
      const file = join(OUT_DIR, `${name}-${width}.${extension}`);
      // Write the scored bytes as-is; re-encoding would change them.
      writeFileSync(file, buffer);
      const size = (buffer.length / 1024).toFixed(1);
      console.log(`${file}  q${quality}  ${size} KB  score ${result.toFixed(1)}`);
    }
  }
}
finally {
  rmSync(work, {
    recursive: true,
    force: true
  });
}
