import { concertSlug } from '../utils/helpers';

describe('concertSlug', () => {
  test('joins headliner/date/venue/times as path segments', () => {
    const customId = { headliner: 'blackpumas', date: '20260601', venue: 'acllive', times: '2000' };
    expect(concertSlug(customId)).toBe('blackpumas/20260601/acllive/2000');
  });

  test('omits the times segment when times is empty', () => {
    const customId = { headliner: 'blackpumas', date: '20260601', venue: 'acllive', times: '' };
    expect(concertSlug(customId)).toBe('blackpumas/20260601/acllive');
  });

  test('percent-encodes URL-significant characters that survive normalization', () => {
    // ":" from a "/"->":" headliner swap, "&" never stripped, "-" kept in venue
    const customId = { headliner: 'ac:dc', date: '20260601', venue: 'c-boys', times: '2230' };
    expect(concertSlug(customId)).toBe('ac%3Adc/20260601/c-boys/2230');
  });

  test('each segment round-trips exactly via decodeURIComponent', () => {
    const customId = { headliner: 'x&y', date: '20260601', venue: 'a/b', times: '' };
    const segs = concertSlug(customId).split('/');
    expect(decodeURIComponent(segs[0])).toBe('x&y');
    expect(decodeURIComponent(segs[1])).toBe('20260601');
    expect(decodeURIComponent(segs[2])).toBe('a/b'); // "/" in a field encodes to %2F, not a separator
    expect(segs).toHaveLength(3); // no times segment
  });

  test('returns a string through unchanged (legacy guard)', () => {
    expect(concertSlug('already-a-string')).toBe('already-a-string');
  });

  test('returns empty string for nullish input', () => {
    expect(concertSlug(null)).toBe('');
  });
});
