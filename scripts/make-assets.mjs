// Builds web assets in public/assets from the originals in assets-src.
// Run: npm run assets
//
// Player photos: cut the background out first (one-time install: python -m pip install "rembg[cpu,cli]"):
//   rembg i -m isnet-general-use -a assets-src/players/<ign>.png assets-src/players/<ign>-cut.png
// then rerun this script. Only the -cut.png files are used here, so this script never needs Python.
import sharp from 'sharp';
import { mkdirSync, readdirSync } from 'node:fs';

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

// Player card backdrop, 4:5 like the card: white studio wall with a metallic red ribbon top right.
const CARD_W = 800;
const CARD_H = 1000;
const playerBackdrop = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#ebe7e3"/>
    </linearGradient>
    <linearGradient id="metal" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#5a0309"/><stop offset="0.35" stop-color="#9f0507"/>
      <stop offset="0.5" stop-color="#e0142a"/><stop offset="0.56" stop-color="#ffd6da"/>
      <stop offset="0.62" stop-color="#c0101e"/><stop offset="1" stop-color="#4a0207"/>
    </linearGradient>
    <radialGradient id="haze" cx="0.85" cy="0.15" r="0.6">
      <stop offset="0" stop-color="#e0142a" stop-opacity="0.18"/><stop offset="1" stop-color="#e0142a" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="edge"><feGaussianBlur stdDeviation="1.5"/></filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#wall)"/>
  <rect width="100%" height="100%" fill="url(#haze)"/>
  <path d="M470 0 C580 120 660 240 800 300 L800 400 C640 340 550 200 400 0 Z" fill="url(#metal)" opacity="0.5" filter="url(#soft)"/>
  <path d="M590 0 C660 85 715 155 800 190 L800 212 C705 178 645 105 570 0 Z" fill="url(#metal)" opacity="0.55" filter="url(#edge)"/>
  <path d="M0 610 C80 575 135 505 170 420 L184 426 C150 520 90 590 0 632 Z" fill="url(#metal)" opacity="0.25" filter="url(#edge)"/>
</svg>`);

async function players() {
  mkdirSync(`${OUT}/players`, { recursive: true });
  const cuts = readdirSync(`${SRC}/players`).filter((f) => f.endsWith('-cut.png'));
  for (const file of cuts) {
    const name = file.replace(/-cut\.png$/, '');
    // person fills the card width and stands on the bottom edge, leaving headroom for the tag row
    const person = await sharp(`${SRC}/players/${file}`).trim().resize({ width: CARD_W }).toBuffer({ resolveWithObject: true });
    const top = Math.max(0, CARD_H - person.info.height);
    const info = await sharp(playerBackdrop)
      .composite([{ input: person.data, left: 0, top }])
      .webp({ quality: 82 })
      .toFile(`${OUT}/players/${name}.webp`);
    console.log(`players/${name}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)} KB`);
  }
}

await mark();
await backgrounds();
await players();
