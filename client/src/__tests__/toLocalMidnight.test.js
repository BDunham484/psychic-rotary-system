// Force a negative-UTC-offset timezone so the off-by-one bug is reproducible
// regardless of the machine's local timezone. Must run before any Date is created.
process.env.TZ = 'America/Chicago';

import { toLocalMidnight } from '../utils/helpers';

// Concert dates are stored as midnight UTC of the venue's calendar day
// (e.g. a June 3 show => "2026-06-03T00:00:00.000Z"). toLocalMidnight must yield a
// Date whose LOCAL Y/M/D match that UTC calendar day, so the display components'
// local getDate()/getMonth() calls render the correct day in any timezone.
describe('toLocalMidnight', () => {
  test('preserves the UTC calendar day (no off-by-one in negative-offset zones)', () => {
    const d = toLocalMidnight('2026-06-03T00:00:00.000Z');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5); // June (0-indexed)
    expect(d.getDate()).toBe(3);
  });

  test('handles a winter (CST) date', () => {
    const d = toLocalMidnight('2026-01-15T00:00:00.000Z');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(15);
  });
});
