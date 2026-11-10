# Reference notes: arcisesports.com

Captured 10 Nov 2026 from the live site's HTML, `motion.js` and `config.js`. Used for structure and layout only. No Arcis text, images, logo or code is copied into this project.

## Stack (observed)

- Static HTML on Netlify. Every style is inline on the element; one `<style>` block per page holds hover and breakpoint rules.
- `support.js` (69 KB) is a page-builder runtime (`<x-dc>`, `<helmet>`, `dc-import`).
- `motion.js` adds: page wipe on navigation, mobile menu, scroll progress bar, reveal on scroll, text scramble on section numbers, magnetic buttons, 3D tilt on cards, ticker loop, light sweep on the hero word.
- Forms open a `FormModal` component and post to Supabase (`config.js`).

## Layout (observed)

- Container 1280px, side padding `clamp(16px, 4vw, 40px)`.
- Header sticky, 69px tall, desktop nav from 900px, menu button below that.
- Section padding `clamp(64px, 10vw, 112px)`, 1px hairline between sections, alternating `#000` and `#0A0A0A` backgrounds.
- Section head: small numbered label (`01 / Who we are`) above a serif heading `clamp(40px, 6vw, 72px)`.
- Two-column sections use `repeat(auto-fit, minmax(min(100%, 380px), 1fr))`, gap 48px.
- Player card: 3:4 (home) or 4:5 (roster), outlined ghost number behind, tag top right, name bottom, Role row under a hairline.
- Event card: max 560px wide, min 320px tall, status tag, start date row.
- Fonts: Instrument Serif for headings, Instrument Sans for text. Labels are 12px uppercase with 0.2em tracking.
- Palette: black, `#0A0A0A`, `#262626` lines, `#F2F2F0` text, `#8A8A87` muted.

## What this project does differently (design choices)

- Palette: maroon `#7A1626` hero and accent, near-black surfaces, cream `#F3EBDD` text.
- Fraunces instead of Instrument Serif; labels in sentence case, no wide tracking.
- No page wipe, scramble, tilt, magnetic buttons or sweep. Motion is one hero fade-in and the ticker, both off under reduced motion.
- Forms are plain inline forms (mailto until a Formspree endpoint is set), not a modal.
- FAQ uses native `<details>`; mobile menu is a `<details>` too, so the site ships no JavaScript.
