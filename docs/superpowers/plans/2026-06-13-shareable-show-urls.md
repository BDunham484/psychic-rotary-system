# Shareable `/show` URLs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/show` URLs uniquely and durably identify a show (disambiguating same-day shows by `times`) and resolve on direct/refreshed/shared visits, while keeping the in-app `location.state` fast path unchanged.

**Architecture:** Encode the four-field `customId` as reversible URL path segments. In-app navigation still renders instantly from router state; when state is absent (refresh/share/direct), `Show.jsx` reads the decoded path params and looks the concert up via a new `concertByCustomId` GraphQL query. The slug is built with `encodeURIComponent` per segment so it is URL-safe and round-trips exactly to the stored `customId`.

**Tech Stack:** React 18, react-router-dom 6.4.3, Apollo Client (`@apollo/client`), CRA Jest + React Testing Library (client). Apollo Server + Mongoose (server, no test harness).

**Spec:** `docs/superpowers/specs/2026-06-13-shareable-show-urls-design.md`

---

## Conventions

- Client commands run from `client/`: `cd client && CI=true npm test -- --watchAll=false <pathPattern>`.
- The **server has no test framework** (no jest, no `test` script). Backend changes are verified manually against a running GraphQL endpoint; do not scaffold a server test framework for this plan (follows the existing repo pattern).
- Commit after each task with the message shown in its final step.
- Do not add `Co-Authored-By` lines to commit messages.

## File structure

- **Modify** `server/schemas/typeDefs.js` — add the `concertByCustomId` query to the `Query` type.
- **Modify** `server/schemas/resolvers.js` — add the `concertByCustomId` resolver (Mongo `findOne` on the compound `customId`).
- **Modify** `client/src/utils/queries.js` — add the `CONCERT_BY_CUSTOM_ID` gql document.
- **Modify** `client/src/utils/helpers.js` — rewrite `concertSlug` (lossless, URL-safe, segment-joined).
- **Create** `client/src/__tests__/concertSlug.test.js` — unit tests for `concertSlug`.
- **Modify** `client/src/App.js` — replace the single `/show/:artists` route with two arity-distinct routes.
- **Modify** `client/src/pages/Show.jsx` — state-first with URL fallback via `concertByCustomId`.
- **Modify** `client/src/pages/Show.test.js` — cover state render, query-fallback render, loading, not-found.

---

## Task 1: Backend `concertByCustomId` query

**Files:**
- Modify: `server/schemas/typeDefs.js` (the `type Query` block, near `concertsByVenue` at line 76)
- Modify: `server/schemas/resolvers.js` (the `Query` object, near `concertsByVenue` at line 249)

No server test framework exists, so this task uses manual GraphQL verification.

- [ ] **Step 1: Add the query to the schema**

In `server/schemas/typeDefs.js`, inside `type Query`, add the line immediately after the existing `concertsByVenue(venue: String!): [Concert]` (line 76):

```graphql
        concertByCustomId(headliner: String!, date: String!, venue: String!, times: String): Concert
```

- [ ] **Step 2: Add the resolver**

In `server/schemas/resolvers.js`, inside the `Query` object, add this resolver immediately after the `concertsByVenue` resolver (which ends around line 266). `Concert` is already imported/in scope in this file (used by `concertsByVenue`).

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

- [ ] **Step 3: Start the server and verify manually**

Run (from `server/`): `npm start`

In Apollo Sandbox (`http://localhost:3001/graphql` or the configured port) or via curl, run the query below, substituting `customId` values that exist in your DB (pick a concert from a daily-list query first, copying its `customId`):

```graphql
query {
  concertByCustomId(headliner: "blackpumas", date: "20260601", venue: "acllive", times: "2000") {
    _id
    artists
    venue
    date
    times
    customId { headliner date venue times }
  }
}
```

Expected: a single concert whose `customId` matches all four fields. Change `times` to a non-existent value and confirm it returns `null` (proves `times` participates in the match). For a timeless show, omit `times` from the query (or pass `""`) and confirm it matches the record whose `customId.times` is `""`.

- [ ] **Step 4: Commit**

```bash
git add server/schemas/typeDefs.js server/schemas/resolvers.js
git commit -m "feat: add concertByCustomId query for single-show lookup by customId"
```

---

## Task 2: Rewrite `concertSlug` (lossless, URL-safe)

**Files:**
- Create: `client/src/__tests__/concertSlug.test.js`
- Modify: `client/src/utils/helpers.js:50-56` (the `concertSlug` export)

- [ ] **Step 1: Write the failing test**

Create `client/src/__tests__/concertSlug.test.js`:

```js
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd client && CI=true npm test -- --watchAll=false src/__tests__/concertSlug.test.js`
Expected: FAIL — the current `concertSlug` strips punctuation and joins with `''` (no slashes), so `'blackpumas/20260601/acllive/2000'` will not match.

- [ ] **Step 3: Replace the implementation**

In `client/src/utils/helpers.js`, replace the existing `concertSlug` (lines 50-56) with:

```js
export const concertSlug = (customId) => {
  if (!customId || typeof customId === 'string') return customId || '';
  const seg = (s) => encodeURIComponent(s ?? '');
  const parts = [seg(customId.headliner), seg(customId.date), seg(customId.venue)];
  if (customId.times) parts.push(seg(customId.times)); // omit the segment when there is no time
  return parts.join('/');
};
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd client && CI=true npm test -- --watchAll=false src/__tests__/concertSlug.test.js`
Expected: PASS (6 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/utils/helpers.js client/src/__tests__/concertSlug.test.js
git commit -m "feat: encode concertSlug as reversible URL-safe customId path segments"
```

---

## Task 3: Add the `CONCERT_BY_CUSTOM_ID` query document

**Files:**
- Modify: `client/src/utils/queries.js` (append a new export; matches the `GET_CONCERT_BY_ID` style at lines 346-378)

- [ ] **Step 1: Add the query document**

Append to `client/src/utils/queries.js`:

```js
export const CONCERT_BY_CUSTOM_ID = gql`
    query concertByCustomId($headliner: String!, $date: String!, $venue: String!, $times: String) {
        concertByCustomId(headliner: $headliner, date: $date, venue: $venue, times: $times) {
            _id
            customId {
                headliner
                date
                venue
                times
            }
            artists
            artistsLink
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            ticketPrice
            yes { _id }
            no { _id }
            maybe { _id }
        }
    }
`;
```

- [ ] **Step 2: Verify it parses**

Run: `cd client && CI=true npm test -- --watchAll=false src/__tests__/toLocalMidnight.test.js`
Expected: PASS — this unrelated suite imports nothing new, but running any test compiles `queries.js`; a malformed `gql` template throws at import time. (A dedicated assertion lands in Task 5, which imports `CONCERT_BY_CUSTOM_ID`.)

- [ ] **Step 3: Commit**

```bash
git add client/src/utils/queries.js
git commit -m "feat: add CONCERT_BY_CUSTOM_ID query document"
```

---

## Task 4: Update the `/show` routes

**Files:**
- Modify: `client/src/App.js:84` (the `/show/:artists` route)

- [ ] **Step 1: Replace the route**

In `client/src/App.js`, replace the single line:

```jsx
                  <Route path="/show/:artists" element={<Show />} />
```

with two arity-distinct routes (both render `<Show />`):

```jsx
                  <Route path="/show/:headliner/:date/:venue/:times" element={<Show />} />
                  <Route path="/show/:headliner/:date/:venue" element={<Show />} />
```

- [ ] **Step 2: Verify the app compiles**

Run: `cd client && CI=true npm run build`
Expected: build succeeds with no errors. (Behavioral coverage of both routes is in Task 5's tests, which mount these exact paths.)

- [ ] **Step 3: Commit**

```bash
git add client/src/App.js
git commit -m "feat: route /show as customId path segments with optional time"
```

---

## Task 5: `Show.jsx` state-first with URL fallback

**Files:**
- Modify: `client/src/pages/Show.jsx:9` (imports), `:20-34` (component head + early returns)
- Modify: `client/src/pages/Show.test.js` (rewrite render helper + tests)

- [ ] **Step 1: Write the failing tests**

Replace the entire contents of `client/src/pages/Show.test.js` with:

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ConcertContext } from '../utils/GlobalState';
import { CONCERT_BY_CUSTOM_ID } from '../utils/queries';

jest.mock('../utils/auth', () => ({
  loggedIn: () => false,
}));

import Show from './Show';

const mockContext = { user: { me: { _id: 'user123' } } };

const concert = {
  _id: 'c1',
  artists: 'Test Artist',
  artistsLink: null,
  venue: 'Test Venue',
  date: '2026-05-17T00:00:00.000Z',
  times: '8:00 PM',
  address: '123 Main St',
  address2: null,
  phone: null,
  email: null,
  website: null,
  ticketLink: null,
  ticketPrice: null,
  customId: { headliner: 'testartist', date: '20260517', venue: 'testvenue', times: '2000' },
  yes: [],
  no: [],
  maybe: [],
};

// 4-segment path matching concert.customId; times="2000"
const PATH = '/show/testartist/20260517/testvenue/2000';

const customIdMock = (result) => ({
  request: {
    query: CONCERT_BY_CUSTOM_ID,
    variables: { headliner: 'testartist', date: '20260517', venue: 'testvenue', times: '2000' },
  },
  result: { data: { concertByCustomId: result } },
});

const renderShow = ({ state = { concert }, mocks = [] } = {}) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ConcertContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: PATH, state }]}>
          <Routes>
            <Route path="/show/:headliner/:date/:venue/:times" element={<Show />} />
            <Route path="/show/:headliner/:date/:venue" element={<Show />} />
          </Routes>
        </MemoryRouter>
      </ConcertContext.Provider>
    </MockedProvider>
  );

test('renders from router state without firing the query', () => {
  renderShow({ state: { concert }, mocks: [] }); // empty mocks: if a query fired, Apollo would warn/error
  expect(screen.getByRole('heading', { level: 1, name: /test artist/i })).toBeInTheDocument();
  expect(screen.getByText('Test Venue')).toBeInTheDocument();
  expect(screen.getByText('123 Main St')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
});

test('shows a loading state when there is no state and the query is in flight', () => {
  renderShow({ state: null, mocks: [customIdMock(concert)] });
  expect(screen.getByText(/loading show/i)).toBeInTheDocument();
});

test('renders from the concertByCustomId query when state is absent', async () => {
  renderShow({ state: null, mocks: [customIdMock(concert)] });
  expect(await screen.findByRole('heading', { level: 1, name: /test artist/i })).toBeInTheDocument();
  expect(screen.getByText('Test Venue')).toBeInTheDocument();
});

test('renders "Show not found" when the query resolves null', async () => {
  renderShow({ state: null, mocks: [customIdMock(null)] });
  expect(await screen.findByText('Show not found.')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `cd client && CI=true npm test -- --watchAll=false src/pages/Show.test.js`
Expected: FAIL — the current `Show.jsx` reads only `location.state` and never queries, so the "renders from the query when state is absent" and "loading" tests fail (it shows "Show not found." immediately).

- [ ] **Step 3: Update the imports**

In `client/src/pages/Show.jsx`, replace the react-router import (line 9):

```jsx
import { useLocation, useNavigate } from 'react-router-dom';
```

with:

```jsx
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { CONCERT_BY_CUSTOM_ID } from '../utils/queries';
```

- [ ] **Step 4: Add the fallback lookup and loading state**

In `client/src/pages/Show.jsx`, replace the component head + the not-found early return (lines 20-34):

```jsx
const Show = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { concert } = location.state || {};
  const loggedIn = Auth.loggedIn();

  if (!concert) {
    return (
      <main className={styles.main}>
        <div className={styles.page}>
          <div className={styles.empty}>Show not found.</div>
        </div>
      </main>
    );
  }
```

with:

```jsx
const Show = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { concert: stateConcert } = location.state || {};
  const loggedIn = Auth.loggedIn();

  const { data, loading } = useQuery(CONCERT_BY_CUSTOM_ID, {
    variables: {
      headliner: params.headliner,
      date: params.date,
      venue: params.venue,
      times: params.times || '',
    },
    skip: !!stateConcert,
  });

  const concert = stateConcert || data?.concertByCustomId;

  if (!concert && loading) {
    return (
      <main className={styles.main}>
        <div className={styles.page}>
          <div className={styles.empty}>Loading show…</div>
        </div>
      </main>
    );
  }

  if (!concert) {
    return (
      <main className={styles.main}>
        <div className={styles.page}>
          <div className={styles.empty}>Show not found.</div>
        </div>
      </main>
    );
  }
```

The rest of the component (the `googleMaps`/`wazeMaps`/date-label logic and JSX from the original line 36 onward) is unchanged — it already reads from the `concert` const.

- [ ] **Step 5: Run the tests to verify they pass**

Run: `cd client && CI=true npm test -- --watchAll=false src/pages/Show.test.js`
Expected: PASS (4 tests).

- [ ] **Step 6: Commit**

```bash
git add client/src/pages/Show.jsx client/src/pages/Show.test.js
git commit -m "feat: resolve /show from URL via concertByCustomId when router state is absent"
```

---

## Task 6: Integration verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full client test suite**

Run: `cd client && CI=true npm test -- --watchAll=false`
Expected: PASS — `concertSlug`, `Show`, and all existing suites green.

- [ ] **Step 2: Manual end-to-end check (server + client running, DB populated)**

1. Start server (`cd server && npm start`) and client (`cd client && npm start`).
2. Navigate to a daily list and click a show → detail page renders instantly (in-app fast path).
3. **Copy the URL and reload the page** → the same show renders (URL fallback resolves it). This is the previously-broken case.
4. Open the URL in a fresh tab / share it → renders correctly.
5. If a venue has two same-day, same-artist shows at different times, confirm each link (different trailing `/HHmm` segment) opens its own show.
6. Visit a timeless show's link (3-segment URL, no trailing time) → renders correctly.
7. Edit the URL to a non-existent show → "Show not found" (no crash).

- [ ] **Step 3: Commit (only if fixes were needed)**

```bash
git add -A
git commit -m "test: verify shareable /show URL resolution end to end"
```

---

## Self-Review notes

- **Spec coverage:** §1 backend query → Task 1; §2 slug rewrite → Task 2; the query document referenced by §4 → Task 3; §3 routes → Task 4; §4 `Show.jsx` fallback → Task 5; testing strategy → Tasks 2/5/6. All spec sections map to a task.
- **No server tests:** the spec's "backend resolver test (if server suite exists)" is satisfied by manual verification (Task 1 Step 3 + Task 6 Step 2), since no server jest harness exists; this plan does not introduce one.
- **Type/name consistency:** the query field `concertByCustomId`, its four args (`headliner, date, venue, times`), the `CONCERT_BY_CUSTOM_ID` document, the `concertSlug` output shape, and the route param names (`:headliner/:date/:venue/:times`) are identical across Tasks 1–5. `params.times || ''` (client) and `times || ''` (resolver) both coerce the absent time to `''`.
- **Fast path preserved:** `skip: !!stateConcert` guarantees no network call on in-app navigation (asserted by Task 5's first test using empty mocks).
