// Shared brand tokens: app name, and a small, deliberately limited palette
// used to color-code people and departments consistently across the app
// (avatar initials, department chips). Keeping the set small (instead of an
// unlimited hash-to-any-hue) keeps the roster feeling designed, not random.

export const APP_NAME = 'CrewHub';
export const APP_TAGLINE = 'Employee Management';

export const IDENTITY_PALETTE = [
  { bg: '#0E7C7B', fg: '#FFFFFF' }, // harbor teal
  { bg: '#E8A33D', fg: '#1F2A33' }, // signal amber
  { bg: '#7C5CBF', fg: '#FFFFFF' }, // plum
  { bg: '#3D6A91', fg: '#FFFFFF' }, // slate blue
  { bg: '#D96C5F', fg: '#FFFFFF' }, // coral
  { bg: '#4C8C63', fg: '#FFFFFF' }, // moss
];

// Simple deterministic string hash -> stable index, so the same person or
// department always gets the same color across renders and reloads.
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function colorFor(seed) {
  if (!seed) return IDENTITY_PALETTE[0];
  return IDENTITY_PALETTE[hashString(seed) % IDENTITY_PALETTE.length];
}

export function initialsFor(firstName, lastName) {
  const a = (firstName || '').trim().charAt(0);
  const b = (lastName || '').trim().charAt(0);
  return `${a}${b}`.toUpperCase() || '?';
}
