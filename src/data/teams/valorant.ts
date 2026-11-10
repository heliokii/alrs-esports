// One file per game. /roster renders every file in this folder, so a new game is a new file.
// photo: cut-out PNG in assets-src/players, built to /assets/players/<name>.webp by `npm run assets`
export type Player = { name: string; riotId?: string; role: string; tag: string; agents?: string[]; photo?: string };
export type Event = { series: string; name: string; status: string; date?: string };

export default {
  game: 'Valorant',
  name: 'ALRS Dark Eros',
  // PLACEHOLDER: real players, Riot IDs, roles and agent pools (Player 2 is real)
  players: [
    { name: 'Player 1', riotId: 'Player1#0000', role: 'IGL', tag: 'IGL', agents: ['Omen', 'Sova'] },
    { name: 'heliokzin', role: 'Duelist', tag: 'Main', agents: ['Neon', 'Phoenix'], photo: '/assets/players/heliokzin.webp' },
    { name: 'Player 3', riotId: 'Player3#0000', role: 'Initiator', tag: 'Main', agents: ['Fade', 'Skye'] },
    { name: 'Player 4', riotId: 'Player4#0000', role: 'Controller', tag: 'Main', agents: ['Clove', 'Viper'] },
    { name: 'Player 5', riotId: 'Player5#0000', role: 'Sentinel', tag: 'Main', agents: ['Killjoy', 'Cypher'] },
  ] as Player[],
  // PLACEHOLDER: substitutes, same shape as players. Empty hides the section.
  subs: [] as Player[],
  // PLACEHOLDER: real staff
  staff: [
    { name: 'Coach name', role: 'Coach' },
    { name: 'Manager name', role: 'Manager' },
  ],
  // PLACEHOLDER: real events. date is ISO with the Philippine offset, e.g. '2026-11-17T19:00:00+08:00'.
  // With a date the card shows a live countdown; without one it shows `status`.
  events: [{ series: 'Valorant', name: 'Next tournament to be announced', status: 'TBA', date: '' }] as Event[],
};
