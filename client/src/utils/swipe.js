// Pixel width of the revealed action drawer (2 chips @ 7.2rem + gaps + padding).
export const REVEAL = 158;

// Slight overscroll allowed past the drawer for a natural rubber-band feel.
const OVERSCROLL = 28;

// Clamp a horizontal drag delta to the allowed translateX range, given whether
// the row started this drag already open. Result is always <= 0 (drawer is on
// the right) and never past -(REVEAL + OVERSCROLL).
export function clampSwipe(mx, open, reveal = REVEAL) {
  const base = open ? -reveal : 0;
  return Math.max(-reveal - OVERSCROLL, Math.min(0, base + mx));
}

// Whether releasing at translateX `tx` should commit the row open (dragged past
// half the reveal width).
export function shouldOpen(tx, reveal = REVEAL) {
  return tx < -reveal / 2;
}
