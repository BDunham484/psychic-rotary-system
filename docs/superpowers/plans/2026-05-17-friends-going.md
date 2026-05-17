# Friends Going Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Friends Going" avatar strip below the RSVP cards on the Show page, showing initials of friends who RSVPd Yes.

**Architecture:** Extend `GET_CONCERT_BY_ID` to include `username` in the `yes` field (no server changes needed — schema already supports it). A new `FriendsGoing` component cross-references the yes array with the current user's friends list from GlobalState, renders up to 4 initials avatars and an overflow pill, and returns null when no friends are going. Show.jsx wraps `ConcertRSVP` and `FriendsGoing` in a fragment inside the logged-in branch.

**Tech Stack:** React 18, Apollo Client 3 (cache de-dups with ConcertRSVP's query), CSS Modules, Jest + React Testing Library

---

## Task 1: Extend GET_CONCERT_BY_ID and verify no regressions

**Files:**
- Modify: `client/src/utils/queries.js`

- [ ] **Step 1: Update the query**

In `client/src/utils/queries.js`, find `GET_CONCERT_BY_ID` and change the `yes` field from `yes { _id }` to `yes { _id username }`. The full updated query:

```js
export const GET_CONCERT_BY_ID = gql`
    query concert($concertId: ID!) {
        concert(concertId: $concertId) {
            _id
            customId
            artists
            artistsLink
            date
            times
            venue
            address
            phone
            website
            email
            ticketLink
            yes {
                _id
                username
            }
            no {
                _id
            }
            maybe {
                _id
            }
        }
    }
`;
```

- [ ] **Step 2: Run existing tests to verify no regressions**

```bash
cd client && npm test -- --watchAll=false
```

Expected: all 22 tests pass. The existing ConcertRSVP and DisabledConcertRSVP tests use MockedProvider with `GET_CONCERT_BY_ID` — since both the component and the test mock import the same updated query document, they still match. Apollo does not validate response fields so the mocks don't need updating.

- [ ] **Step 3: Commit**

```bash
git add client/src/utils/queries.js
git commit -m "feat: add username to GET_CONCERT_BY_ID yes field"
```

---

## Task 2: FriendsGoing component

**Files:**
- Create: `client/src/components/shared/FriendsGoing/FriendsGoing.test.js`
- Create: `client/src/components/shared/FriendsGoing/FriendsGoing.module.css`
- Create: `client/src/components/shared/FriendsGoing/index.js`

- [ ] **Step 1: Write the failing tests**

Create `client/src/components/shared/FriendsGoing/FriendsGoing.test.js`:

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ConcertContext } from '../../../utils/GlobalState';
import { GET_CONCERT_BY_ID } from '../../../utils/queries';
import FriendsGoing from './index';

const CONCERT_ID = 'c1';

const concertBase = {
  _id: CONCERT_ID,
  customId: 'x',
  artists: 'Test Artist',
  artistsLink: '',
  date: '2026-05-17T00:00:00.000Z',
  times: '8pm',
  venue: 'Test Venue',
  address: '123 Main St',
  phone: '',
  website: '',
  email: '',
  ticketLink: '',
  no: [],
  maybe: [],
};

const makeQueryMock = (yes = []) => ({
  request: { query: GET_CONCERT_BY_ID, variables: { concertId: CONCERT_ID } },
  result: { data: { concert: { ...concertBase, yes } } },
});

const makeContext = (friends = []) => ({
  user: { me: { _id: 'user123', friends } },
});

const renderComponent = (mocks, context) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ConcertContext.Provider value={context}>
        <FriendsGoing concertId={CONCERT_ID} />
      </ConcertContext.Provider>
    </MockedProvider>
  );

test('renders nothing when no friends are going', async () => {
  renderComponent(
    [makeQueryMock([{ _id: 'u1', username: 'alice' }])],
    makeContext([]) // current user has no friends
  );
  await new Promise(r => setTimeout(r, 200));
  expect(screen.queryByText(/friends going/i)).not.toBeInTheDocument();
});

test('renders nothing when friends exist but none RSVPd yes', async () => {
  renderComponent(
    [makeQueryMock([])], // yes array is empty
    makeContext([{ _id: 'friend1', username: 'alice' }])
  );
  await new Promise(r => setTimeout(r, 200));
  expect(screen.queryByText(/friends going/i)).not.toBeInTheDocument();
});

test('renders FRIENDS GOING label when a friend has RSVPd yes', async () => {
  renderComponent(
    [makeQueryMock([{ _id: 'friend1', username: 'alice rock' }])],
    makeContext([{ _id: 'friend1', username: 'alice rock' }])
  );
  expect(await screen.findByText(/friends going/i)).toBeInTheDocument();
});

test('shows correct initials for multi-word username', async () => {
  renderComponent(
    [makeQueryMock([{ _id: 'friend1', username: 'alice rock' }])],
    makeContext([{ _id: 'friend1', username: 'alice rock' }])
  );
  expect(await screen.findByText('AR')).toBeInTheDocument();
});

test('shows correct initials for single-word username', async () => {
  renderComponent(
    [makeQueryMock([{ _id: 'friend1', username: 'jo' }])],
    makeContext([{ _id: 'friend1', username: 'jo' }])
  );
  expect(await screen.findByText('JO')).toBeInTheDocument();
});

test('shows friend count in header', async () => {
  renderComponent(
    [makeQueryMock([{ _id: 'friend1', username: 'alice' }])],
    makeContext([{ _id: 'friend1', username: 'alice' }])
  );
  expect(await screen.findByText('1')).toBeInTheDocument();
  expect(await screen.findByText(/of your friends/i)).toBeInTheDocument();
});

test('shows overflow pill when more than 4 friends going', async () => {
  const friends = [
    { _id: 'f1', username: 'alice' },
    { _id: 'f2', username: 'bob' },
    { _id: 'f3', username: 'carol' },
    { _id: 'f4', username: 'dave' },
    { _id: 'f5', username: 'eve' },
  ];
  renderComponent([makeQueryMock(friends)], makeContext(friends));
  expect(await screen.findByText('+1')).toBeInTheDocument();
});

test('does not show non-friend RSVPs in avatars', async () => {
  renderComponent(
    [makeQueryMock([
      { _id: 'friend1', username: 'alice' },
      { _id: 'stranger1', username: 'bob' },
    ])],
    makeContext([{ _id: 'friend1', username: 'alice' }])
  );
  expect(await screen.findByText('AL')).toBeInTheDocument();
  expect(screen.queryByText('BO')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="FriendsGoing"
```

Expected: FAIL — module not found.

- [ ] **Step 3: Write the CSS module**

Create `client/src/components/shared/FriendsGoing/FriendsGoing.module.css`:

```css
.wrap {
  margin-top: 1.6rem;
  padding: 1.6rem 2rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 1.2rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.label {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.countLine {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--text-muted);
}

.countNum {
  color: var(--accent-hi);
  font-weight: 700;
}

.avatarRow {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.2rem;
}

.avatar {
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  flex-shrink: 0;
}

.overflow {
  background: var(--accent-dim);
  border-color: var(--accent-mid);
  color: var(--accent-hi);
}
```

- [ ] **Step 4: Write the component**

Create `client/src/components/shared/FriendsGoing/index.js`:

```jsx
import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { ConcertContext } from '../../../utils/GlobalState';
import { GET_CONCERT_BY_ID } from '../../../utils/queries';
import styles from './FriendsGoing.module.css';

const MAX_AVATARS = 4;

const getInitials = (username) => {
  const words = username.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return username.slice(0, 2).toUpperCase();
};

const FriendsGoing = ({ concertId }) => {
  const { user } = useContext(ConcertContext);
  const friends = user?.me?.friends || [];

  const { data } = useQuery(GET_CONCERT_BY_ID, { variables: { concertId } });
  const yes = data?.concert?.yes || [];

  const friendsGoing = yes.filter(u => friends.some(f => f._id === u._id));

  if (friendsGoing.length === 0) return null;

  const shown = friendsGoing.slice(0, MAX_AVATARS);
  const overflow = friendsGoing.length - MAX_AVATARS;

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.label}>Friends Going</span>
        <span className={styles.countLine}>
          <span className={styles.countNum}>{friendsGoing.length}</span>
          {' '}of your friends · click to see all
        </span>
      </div>
      <div className={styles.avatarRow}>
        {shown.map(u => (
          <div key={u._id} className={styles.avatar}>
            {getInitials(u.username)}
          </div>
        ))}
        {overflow > 0 && (
          <div className={`${styles.avatar} ${styles.overflow}`}>
            +{overflow}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsGoing;
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="FriendsGoing"
```

Expected: all 8 tests pass.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/shared/FriendsGoing/
git commit -m "feat: add FriendsGoing component with avatar strip"
```

---

## Task 3: Show.jsx integration

**Files:**
- Modify: `client/src/pages/Show.jsx`

- [ ] **Step 1: Add the import**

In `client/src/pages/Show.jsx`, add the import after the `ConcertRSVP` import:

```jsx
import FriendsGoing from '../components/shared/FriendsGoing';
```

- [ ] **Step 2: Wrap the logged-in RSVP block in a fragment**

Find the existing logged-in conditional in `Show.jsx`:

```jsx
{loggedIn ? (
  <ConcertRSVP concertId={concert._id} />
) : (
  <DisabledConcertRSVP concertId={concert._id} />
)}
```

Replace with:

```jsx
{loggedIn ? (
  <>
    <ConcertRSVP concertId={concert._id} />
    <FriendsGoing concertId={concert._id} />
  </>
) : (
  <DisabledConcertRSVP concertId={concert._id} />
)}
```

- [ ] **Step 3: Run the full test suite**

```bash
cd client && npm test -- --watchAll=false
```

Expected: all 30 tests pass (22 existing + 8 new FriendsGoing tests). Show.test.js mocks `Auth.loggedIn()` as `false`, so the logged-in branch never renders in those tests — no changes to Show.test.js needed.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/Show.jsx
git commit -m "feat: integrate FriendsGoing into Show page RSVP block"
```
