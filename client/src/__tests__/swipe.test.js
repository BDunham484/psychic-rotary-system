import { clampSwipe, shouldOpen, REVEAL } from '../utils/swipe';

describe('clampSwipe', () => {
  test('closed row: no movement at zero delta', () => {
    expect(clampSwipe(0, false)).toBe(0);
  });
  test('closed row: follows a left drag', () => {
    expect(clampSwipe(-50, false)).toBe(-50);
  });
  test('closed row: cannot drag right past closed', () => {
    expect(clampSwipe(50, false)).toBe(0);
  });
  test('closed row: clamps to reveal width plus overscroll', () => {
    expect(clampSwipe(-1000, false)).toBe(-(REVEAL + 28));
  });
  test('open row: base offset is the reveal width', () => {
    expect(clampSwipe(0, true)).toBe(-REVEAL);
  });
  test('open row: a right drag moves toward closed', () => {
    expect(clampSwipe(50, true)).toBe(-REVEAL + 50);
  });
});

describe('shouldOpen', () => {
  test('commits open past half the reveal width', () => {
    expect(shouldOpen(-(REVEAL / 2) - 1)).toBe(true);
  });
  test('snaps closed at or before half', () => {
    expect(shouldOpen(-(REVEAL / 2))).toBe(false);
    expect(shouldOpen(-10)).toBe(false);
  });
});
