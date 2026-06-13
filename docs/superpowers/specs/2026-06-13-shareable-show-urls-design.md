# Shareable `/show` URLs via Reversible customId Path Segments — Design

- **Date:** 2026-06-13
- **Repo:** psychic-rotary-system (read-side consumer app)
- **Status:** Draft — awaiting review
- **Upstream context:** This is the read-side hand-off required by the antecedent-journey
  datetime/multi-show overhaul (`antecedent-journey/docs/superpowers/specs/2026-05-31-scraper-datetime-normalization-design.md`,
  §"customId.times hand-off to psychic"). The write side now stores same-day/same-artist/same-venue
  shows as distinct records keyed by a four-field `customId` (`{ headliner, date, venue, times }`).

## Problem

Show-detail URLs do not uniquely or durably identify a show, and direct visits don't work at all.

**Symptom A — non-unique URLs.** `concertSlug(customId)` builds the `/show/...` path from
`{ headliner, date, venue }` only — it ignores `times`. After the upstream multi-show change,
two shows by the same artist at the same venue on the same day (e.g. a 7:00 PM and a 10:00 PM set)
now coexist as distinct records but produce the **identical** slug. The URL can no longer name a
specific show.

**Symptom B — direct/refreshed/shared URLs show "Show not found."** `Show.jsx` reads the concert
solely from React Router's in-memory `location.state` (`const { concert } = location.state || {}`).
It never calls `useParams()` — the URL slug is purely cosmetic. So any arrival at `/show/...`
*without* that in-memory object — a page refresh, a bookmarked link, a shared link, or a direct
type-in — has no state and renders "Show not found." This is a pre-existing bug, independent of
the multi-show change, but the same fix resolves both.

### What works today and must be preserved

In-app navigation passes the full concert object via router state
(`<Link to={...} state={{ concert }}>` in `ConcertList.jsx`, `Profile/ConcertsList.jsx`, and
`navigate(..., { state: { concert } })` in `ShowsByVenue.jsx`). This renders the detail page
**instantly with no network round-trip**, and because each link carries its own concert, it already
distinguishes two same-day shows correctly. This fast path stays exactly as-is.

### Audit of slug consumers

`concertSlug` has exactly three consumers, all of which use it *only* to build the `/show/...`
URL string; **nothing parses the slug back into data**, and no test asserts its format:
- `client/src/components/ConcertList/ConcertList.jsx:65`
- `client/src/components/Profile/ConcertsList.jsx:123`
- `client/src/components/ShowsByVenue/ShowsByVenue.jsx:96-97`

Because the slug is currently write-only (never reversed), changing its format breaks nothing
functionally. Existing bookmarked/shared URLs would change shape, but those don't resolve today
anyway (no state → "Show not found"), so there is no regression.

## Guiding principle: state-first, URL as durable fallback

Use both mechanisms for what each is good at:
- **`location.state`** is a performance optimization for in-app navigation — instant render, no
  refetch, already carries the loaded concert. Keep it as the default fast path.
- **The URL** is durable identity — it survives refresh, bookmarking, sharing, and direct entry.
  Make the detail page able to resolve a concert *from the URL* when state is absent.

The URL must therefore be **reversible** into a concert lookup. We encode the deterministic
`customId` (not the Mongo `_id`): `customId` is stable across the DB wipe/re-scrape cycle the
write side performs as normal development, so shared links survive rebuilds; `_id` would rot on
every re-scrape.

## Goals

- Make `/show` URLs uniquely identify a single show, including disambiguating two same-day shows
  by `times`.
- Make a `/show` URL resolve to the correct concert on direct visit / refresh / shared / bookmarked
  links — fixing Symptom B.
- Keep the in-app `location.state` fast path unchanged (no refetch on click).
- Keep URLs durable across DB wipe/re-scrape by encoding `customId`, not `_id`.
- Ensure the slug is fully URL-safe **and lossless** (so it round-trips exactly to the stored
  `customId` for the lookup).

## Non-goals

- No change to the in-app navigation fast path or to how concert lists pass state.
- No dependency upgrade. We stay on `react-router-dom` 6.4.3 (see Architecture §3). Evaluating a
  react-router upgrade is tracked as a separate follow-up.
- No change to `concertsByVenue` (its exact-venue-string match is a separate read-side issue).
- No "pretty"/lossy slugification — it would break reversibility.

## Architecture

Four pieces: a new backend lookup query, a rewritten slug builder, a route change, and a fallback
in the detail page.

### 1. Backend — `concertByCustomId` query

The compound `customId` is the unique identity of a show post-multi-show, so we look up by its four
fields.

- **`server/schemas/typeDefs.js`** — add to `Query`:
  ```graphql
  concertByCustomId(headliner: String!, date: String!, venue: String!, times: String): Concert
  ```
  `times` is nullable to accommodate timeless shows; the resolver coerces a missing value to `''`,
  matching how the write side stores "no time."

- **`server/schemas/resolvers.js`** — add the resolver:
  ```js
  concertByCustomId: async (parent, { headliner, date, venue, times }) => {
      return await Concert.findOne({
          'customId.headliner': headliner,
          'customId.date': date,
          'customId.venue': venue,
          'customId.times': times || '',
      })
          .populate('yes')
          .populate('no')
          .populate('maybe');
  },
  ```
  `findOne` is correct because the four-field key is unique. `populate` mirrors `concertsByVenue`
  so the returned shape is consistent with what other concert queries deliver.

### 2. `concertSlug` rewrite (client `src/utils/helpers.js`)

Encode each `customId` field as one URL path segment, lossless and URL-safe:

```js
export const concertSlug = (customId) => {
  if (!customId || typeof customId === 'string') return customId || '';
  const seg = (s) => encodeURIComponent(s ?? '');
  const parts = [seg(customId.headliner), seg(customId.date), seg(customId.venue)];
  if (customId.times) parts.push(seg(customId.times)); // omit the segment when there is no time
  return parts.join('/');
};
```

- `encodeURIComponent` handles every URL-significant character that survives `customId`
  normalization — `&`→`%26`, `:`→`%3A`, `/`→`%2F`, spaces, unicode. `useParams()` auto-decodes on
  the way back, yielding the **exact** stored `customId` value for the query.
- The previous `.split(/[,.'"\s]+/).join('')` strip is **removed**. It was lossy and subtly desynced
  from the write side's `buildCustomId` (it stripped `"`, which the stored `customId` keeps), which
  would break an exact-match lookup. Removing it makes the round-trip exact. Safe because nothing
  parses the slug today.
- Result strings: `blackpumas/20260601/acllive/2000` (with time) or
  `blackpumas/20260601/acllive` (no time). Consumers keep calling `` `/show/${concertSlug(...)}` ``
  unchanged — they now emit a multi-segment path automatically.

### 3. Routes (client `src/App.js`)

Replace the single cosmetic param route with two arity-distinct routes, both rendering `<Show />`:

```jsx
<Route path="/show/:headliner/:date/:venue/:times" element={<Show />} />
<Route path="/show/:headliner/:date/:venue"        element={<Show />} />
```

- The 4-segment route matches shows with a time; the 3-segment route matches timeless shows, where
  `useParams().times` is `undefined` → coerced to `''`.
- Two routes (rather than an optional `:times?` param) is a deliberate choice: optional path-segment
  syntax was introduced in react-router 6.5.0, and this app is locked at **6.4.3**. The two-route
  form produces byte-identical URLs and behavior with zero dependency change and a blast radius
  scoped to the new route. Collapsing to a single `:times?` route is deferred to the react-router
  upgrade follow-up.
- Distinct arities mean no match ambiguity; react-router ranks by specificity.

### 4. `Show.jsx` — state-first with URL fallback

```js
const location = useLocation();
const params = useParams();
const { concert: stateConcert } = location.state || {};

const { data, loading } = useQuery(CONCERT_BY_CUSTOM_ID, {
  variables: {
    headliner: params.headliner,
    date: params.date,
    venue: params.venue,
    times: params.times || '',
  },
  skip: !!stateConcert,           // in-app click already has the concert; no network hit
});

const concert = stateConcert || data?.concertByCustomId;
```

- The hook is called unconditionally (React hooks rules); `skip` prevents the query when state is
  present, preserving the zero-refetch fast path.
- The `CONCERT_BY_CUSTOM_ID` gql document is added to `client/src/utils/queries.js` (where the app's
  other query documents live), selecting the same concert fields the detail page renders.
- Render states:
  - `concert` present → existing detail UI (unchanged).
  - no state, `loading` → loading placeholder (skeleton/spinner consistent with the app).
  - no state, resolved `null` → existing "Show not found." (Covers a show deleted or removed by a
    re-scrape since the link was shared.)
- `useParams()` returns the decoded segment values, so they equal the stored `customId` fields and
  the query matches exactly.

## Data flow

```
In-app click:
  <Link state={{concert}}>  ──►  Show.jsx reads location.state  ──►  renders instantly (query skipped)

Refresh / shared / bookmarked / direct:
  /show/blackpumas/20260601/acllive/2000
        │  useParams() (auto-decoded)
        ▼
  concertByCustomId(headliner, date, venue, times) ── findOne on unique 4-field customId
        ▼
  one concert  ──►  renders   |   null  ──►  "Show not found"
```

## Error handling

- **Query error** → treat as not-found ("Show not found"); no crash.
- **No match** (deleted show, or removed by a re-scrape after the link was created) → "Show not found."
- **Malformed URL** (missing required segments) → no route matches → existing `NoMatch` page.
- **Loading** → placeholder, never a flash of "Show not found" before data resolves.

## Testing strategy

- **`concertSlug` unit tests:**
  - encodes URL-significant chars that survive normalization (`&`, `:`) and a hyphenated venue
    (e.g. `c-boys`) without corruption;
  - omits the 4th segment when `times` is `''`/absent; includes it (`2000`) when present;
  - round-trip: `decodeURIComponent` of each emitted segment equals the original `customId` field.
- **`Show.test.js` (update the existing suite, currently built around `/show/:artists`):**
  - renders from `location.state` **without** firing the query;
  - renders from a mocked `concertByCustomId` result when state is absent;
  - shows "Show not found" when the query resolves `null`;
  - shows a loading state while the query is in flight with no state.
- **Backend resolver test (if server suite exists):** `concertByCustomId` returns the correct single
  show for a four-field match, and distinguishes two same-day shows that differ only by `times`.
- **Route test:** both the 4-segment and 3-segment paths resolve to `<Show />`; the 3-segment path
  yields `times` → `''`.

## Migration / backfill

None. The slug is write-only today and no persisted data encodes it. Existing in-flight shared links
(if any) do not resolve under the current code either, so there is nothing to preserve. New links
use the new format immediately.

## Out of scope (follow-ups)

- **`concertsByVenue` venue matching** — its date floor is fixed; the exact-venue-string match
  (vs. the daily list's date-range query) remains a separate read-side issue.
- **Unrecognized-format PendingReview category** — write-side observability follow-up in
  antecedent-journey.
- **react-router-dom upgrade** — evaluate bumping from 6.4.3 within 6.x (accumulated fixes,
  data-router/loader APIs); would let the two `/show` routes collapse to one `:times?` route.
  Decided and tested on its own merits, not bundled here.

## Open questions

None outstanding. (Slug format, no-time handling, and the no-dependency-bump decision were resolved
during brainstorming.)
