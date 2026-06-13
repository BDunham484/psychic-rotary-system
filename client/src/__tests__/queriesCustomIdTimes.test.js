import * as queries from '../utils/queries';

// Any customId selection that can feed concertSlug MUST request `times`.
// Without it the client builds time-less /show URLs and shareable links fail to
// resolve same-day shows (regression guard for the 2026-06-13 "Show not found" bug).
const customIdBlocks = (doc) =>
  ((doc && doc.loc && doc.loc.source && doc.loc.source.body) || '').match(/customId\s*{[^}]*}/g) || [];

const queryNames = Object.keys(queries).filter((k) => customIdBlocks(queries[k]).length > 0);

describe('queries selecting customId also select times', () => {
  test('there is at least one query with a customId selection to check', () => {
    expect(queryNames.length).toBeGreaterThan(0);
  });

  test.each(queryNames)('%s requests customId.times', (name) => {
    customIdBlocks(queries[name]).forEach((block) => {
      expect(block).toMatch(/\btimes\b/);
    });
  });
});
