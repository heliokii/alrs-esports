// Builds web assets in public/assets from the originals in assets-src.
// Run: npm run assets
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'assets-src';
const OUT = 'public/assets';
const CREAM = [0xf3, 0xeb, 0xdd];
mkdirSync(OUT, { recursive: true });

// Helmet sits above the "ALANGILAN RED SPARTANS" text; only scan that band.
const HELMET_BAND = { left: 300, top: 100, width: 525, height: 690 };

async function mark() {
  const { data, info } = await sharp(`${SRC}/logo.png`)
    .extract(HELMET_BAND)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const reds = [];
  for (let i = 0; i < data.length; i += 3) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (r - Math.max(g, b) > 110) reds.push([r, g, b]);
  }
  if (reds.length < 100) throw new Error(`logo red not found (${reds.length} px), check HELMET_BAND`);
  // 85th percentile: the median lands in the shaded side of the red panels and reads too dark on black
  const pct = (k) => reds.map((p) => p[k]).sort((a, b) => a - b)[Math.floor(reds.length * 0.85)];
  const RED = [pct(0), pct(1), pct(2)];

  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += 3, o += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    const redness = r - Math.max(g, b);
    let color = CREAM;
    let a;
    if (redness > 50) {
      color = RED;
      a = Math.min(1, redness / 100);
    } else {
      // white page, background stripes and the soft drop shadow are all lighter than 160
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      a = Math.max(0, Math.min(1, (160 - lum) / 100));
    }
    out[o] = color[0]; out[o + 1] = color[1]; out[o + 2] = color[2]; out[o + 3] = Math.round(a * 255);
  }

  const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim()
    .png()
    .toBuffer();

  await sharp(trimmed).resize({ height: 512 }).png({ compressionLevel: 9 }).toFile(`${OUT}/alrs-mark.png`);
  for (const [name, size] of [['favicon.png', 64], ['icon-192.png', 192]]) {
    await sharp(trimmed)
      .resize(size, size, { fit: 'contain', background: { r: 10, g: 7, b: 8, alpha: 1 } })
      .png()
      .toFile(`${OUT}/${name}`);
  }
  const hex = '#' + RED.map((v) => v.toString(16).padStart(2, '0')).join('');
  console.log(`mark ok, logo red ${hex} from ${reds.length} px`);
}

async function backgrounds() {
  for (const name of ['bg-liquid', 'bg-silk', 'bg-neon']) {
    const info = await sharp(`${SRC}/${name}.png`)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(`${OUT}/${name}.webp`);
    console.log(`${name}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
}

await mark();
await backgrounds();
