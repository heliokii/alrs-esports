// All site interaction. Pattern taken from arcisesports.com's motion.js, trimmed to what this site uses.
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/* Hero: texture follows the cursor; on touch it follows scroll instead */
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero && FINE && !RM) {
  const section = hero.closest('section') ?? hero;
  section.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    hero.style.setProperty('--mx', `${clamp(x, 0, 100)}%`);
    hero.style.setProperty('--my', `${clamp(y, 0, 100)}%`);
    hero.style.setProperty('--sx', `${x}%`);
    hero.style.setProperty('--sy', `${y}%`);
    hero.classList.add('is-lit');
  });
  section.addEventListener('pointerleave', () => hero.classList.remove('is-lit'));
}

/* Scroll progress bar, plus the touch version of the hero texture */
const bar = document.querySelector<HTMLElement>('[data-progress]');
const onScroll = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  if (hero && !FINE && !RM) hero.style.setProperty('--my', `${clamp(30 + (scrollY / innerHeight) * 60, 0, 100)}%`);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* Page wipe on internal navigation (the entrance is pure CSS) */
const wipe = document.querySelector<HTMLElement>('.wipe');
if (wipe && !RM) {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return; // external, mailto:
    if (url.pathname === location.pathname && url.hash) return; // same-page anchor
    e.preventDefault();
    wipe.classList.add('is-leaving');
    setTimeout(() => location.assign(url.href), 380);
  });
  // back/forward cache restores the covered page; uncover it
  addEventListener('pageshow', (e) => { if (e.persisted) wipe.classList.remove('is-leaving'); });
}

/* Mobile menu (<details>): Escape, link click and desktop width close it */
const menu = document.querySelector<HTMLDetailsElement>('details.menu');
if (menu) {
  const close = () => { menu.open = false; };
  menu.addEventListener('toggle', () => document.documentElement.classList.toggle('menu-open', menu.open));
  menu.querySelectorAll('nav a').forEach((a) => a.addEventListener('click', close));
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.open) { close(); menu.querySelector('summary')?.focus(); }
  });
  matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) close(); });
}

/* Scroll reveal, with a scramble on "01 / ..." section labels */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#';
const scramble = (el: HTMLElement) => {
  const final = el.textContent ?? '';
  let f = 0;
  const total = 20;
  const t = setInterval(() => {
    f++;
    el.textContent = [...final].map((c, i) => (c === ' ' || i < (f / total) * final.length ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join('');
    if (f >= total) { clearInterval(t); el.textContent = final; }
  }, 34);
};
const REVEAL = 'main .head, main .pcard, main .event, main .rows > *, main .tile, main .staff > div, main .post, main .prose, main .chips, main .form, main .lockup';
if (!RM) {
  const io = new IntersectionObserver((entries) => {
    let i = 0;
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      io.unobserve(en.target);
      const el = en.target as HTMLElement;
      el.style.transitionDelay = `${Math.min(i++, 5) * 60}ms`;
      el.classList.add('in');
      // drop the reveal state so the delay never lags later hover/tilt transitions
      setTimeout(() => { el.classList.remove('rv', 'in'); el.style.transitionDelay = ''; }, 900);
      el.querySelectorAll<HTMLElement>('.label').forEach((l) => { if (/^\d\d \/ /.test(l.textContent ?? '')) scramble(l); });
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  document.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
    if (el.parentElement?.closest(REVEAL)) return; // parent already reveals
    if (el.getBoundingClientRect().top < innerHeight) return; // visible on load: never hide it
    el.classList.add('rv');
    io.observe(el);
  });
}

/* Card tilt with a red glare under the cursor */
if (FINE && !RM) {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg)`;
      el.style.setProperty('--gx', `${(x + 0.5) * 100}%`);
      el.style.setProperty('--gy', `${(y + 0.5) * 100}%`);
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  /* Buttons lean toward the cursor, at most 8px */
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = clamp((e.clientX - r.left - r.width / 2) * 0.25, -8, 8);
      const dy = clamp((e.clientY - r.top - r.height / 2) * 0.35, -8, 8);
      el.style.translate = `${dx}px ${dy}px`;
    });
    el.addEventListener('pointerleave', () => { el.style.translate = ''; });
  });
}

/* Match countdown and status. Runs under reduced motion too: it is information, not decoration. */
const LIVE_MS = 12 * 3600e3; // shortcut: an event counts as live for 12h after start; add an end time to the data if matches run longer
const dayFmt = new Intl.DateTimeFormat('en-PH', { day: 'numeric', month: 'short', timeZone: 'Asia/Manila' });
document.querySelectorAll<HTMLElement>('[data-start]').forEach((card) => {
  const start = Date.parse(card.dataset.start ?? '');
  if (Number.isNaN(start)) return;
  const status = card.querySelector<HTMLElement>('[data-status]');
  const cells = card.querySelectorAll<HTMLElement>('[data-cd]');
  const tick = () => {
    const ms = start - Date.now();
    const live = ms <= 0 && ms > -LIVE_MS;
    const s = Math.max(0, Math.floor(ms / 1000));
    const v: Record<string, number> = { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
    cells.forEach((c) => { c.textContent = String(v[c.dataset.cd ?? 's']).padStart(2, '0'); });
    if (status) {
      status.textContent = ms <= -LIVE_MS ? 'Finished'
        : live ? 'Live now'
        : ms < 864e5 ? `Starts in ${v.h}h ${v.m}m`
        : `Starts ${dayFmt.format(start)}`;
    }
    card.classList.toggle('is-live', live);
  };
  tick();
  setInterval(tick, 1000);
});
