// One file per game. /roster renders every file in this folder, so a new game is a new file.
// photo: cut-out PNG in assets-src/players, built to /assets/players/<name>.webp by `npm run assets`
// role is optional: substitutes without a set role show only their tag
export type Player = { name: string; riotId?: string; role?: string; tag: string; agents?: string[]; photo?: string };
export type Event = { series: string; name: string; status: string; date?: string };

export default {
  game: 'Valorant',
  name: 'ALRS Dark Eros',
  // Add `agents: [...]`, `riotId` or `photo` to any player when known.
  players: [
    { name: 'gil', role: 'IGL / Initiator', tag: 'IGL' },
    { name: 'heliokzin', role: 'Duelist', tag: 'Main', agents: ['Neon', 'Phoenix'], photo: '/assets/players/heliokzin.webp' },
    { name: 'Sipra', role: 'Controller', tag: 'Main' },
    { name: 'i0n', role: 'Flex', tag: 'Main' },
    { name: 'Empoleon', role: 'Sentinel / Initiator', tag: 'Main' },
  ] as Player[],
  subs: [
    { name: 'z4ichi', tag: 'Sub' },
    { name: 'jahi', tag: 'Sub' },
    { name: 'Drcy', tag: 'Sub' },
    { name: 'kingke', tag: 'Sub' },
    { name: 'sheepy', tag: 'Coach' }, // playing coach: also listed under staff
  ] as Player[],
  staff: [
    { name: 'sheepy', role: 'Coach / Player' },
    { name: 'Yzak', role: 'Manager' },
    { name: 'Marl', role: 'Co-manager' },
  ],
  // PLACEHOLDER: real events. date is ISO with the Philippine offset, e.g. '2026-11-17T19:00:00+08:00'.
  // With a date the card shows a live countdown; without one it shows `status`.
  events: [{ series: 'Valorant', name: 'Next tournament to be announced', status: 'TBA', date: '' }] as Event[],
};
