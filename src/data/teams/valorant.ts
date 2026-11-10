// One file per game. /roster renders every file in this folder, so a new game is a new file.
export type Player = { name: string; riotId: string; role: string; tag: string; agents?: string[] };
export type Event = { series: string; name: string; status: string; date?: string };

export default {
  game: 'Valorant',
  // PLACEHOLDER: real players, Riot IDs, roles and agent pools
  players: [
    { name: 'Player 1', riotId: 'Player1#0000', role: 'IGL', tag: 'IGL', agents: ['Omen', 'Sova'] },
    { name: 'Player 2', riotId: 'Player2#0000', role: 'Duelist', tag: 'Main', agents: ['Jett', 'Raze'] },
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
