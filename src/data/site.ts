export const site = {
  name: 'ALRS Esports',
  short: 'ALRS',
  fullName: 'Alangilan Red Spartans Esports',
  city: 'Batangas City',
  country: 'Philippines',
  url: 'https://example.com', // PLACEHOLDER: real domain
  description: "ALRS Esports is the Alangilan Red Spartans' Valorant team from Batangas City.",
  facebook: 'https://www.facebook.com/ALRS.Esports',
  email: 'alrs.esports@example.com', // PLACEHOLDER: real contact email
  // Cut from assets-src/logo.png by `npm run assets`. Swap in an official transparent file there and rerun.
  logo: '/assets/alrs-mark.png',
  // shortcut: empty endpoint makes forms open the visitor's mail app (mailto). Paste a Formspree URL here to send without one.
  formEndpoint: '',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/roster', label: 'Roster' },
    { href: '/news', label: 'News' },
    { href: '/partner', label: 'Partner' },
    { href: '/contact', label: 'Contact' },
  ],
  ticker: ['Tryouts open', 'Valorant', 'Batangas City', 'Alangilan Red Spartans', 'ALRS Esports'],
};

// PLACEHOLDER: confirm what a sponsor actually gets
export const partnerPerks = [
  { title: 'Jersey placement', body: 'Your logo on the team kit, worn in every match and photo.' },
  { title: 'Social content', body: 'Logo and mentions across our Facebook posts and match announcements.' },
  { title: 'Stream and tournament presence', body: 'Your brand on overlays, team graphics and tournament registrations.' },
];

export const tryoutSteps = [
  { title: 'Riot ID and IGN', body: 'Your in-game name and full Riot ID (name#tag).' },
  { title: 'Rank', body: 'Current and peak rank.' },
  { title: 'Role and agent pool', body: 'Your main role and the agents you play most.' },
  { title: 'Availability', body: 'The days and hours you can scrim, Philippine time.' },
];
