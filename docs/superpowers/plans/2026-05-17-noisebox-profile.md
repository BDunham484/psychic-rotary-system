# NoiseBX Profile Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Profile page with a new hero, date-stack concert list, and two-column friends management tab with a sticky side panel for pending/sent/blocked requests.

**Architecture:** New sub-components (`ProfileHero`, `ConcertsList`, `FriendsTab`) replace the existing tab-in-tab structure and the entire `RequestBlock/` component family. `Profile.jsx` is rewritten as a thin shell that runs a parallel `QUERY_ME` when viewing another user's profile to derive friendship state. All deprecated components are deleted after migration.

**Tech Stack:** React 18, Apollo Client 3, React Router v6, CSS Modules, @styled-icons/feather

---

## File Map

**Create:**
- `client/src/components/Profile/ProfileHero.jsx` + `.module.css`
- `client/src/components/Profile/ConcertsList.jsx` + `.module.css`
- `client/src/components/Friends/FriendsTab.jsx` + `.module.css`
- `client/src/__tests__/deriveFriendship.test.js`
- `client/src/__tests__/ProfileHero.test.jsx`
- `client/src/__tests__/ConcertsList.test.jsx`
- `client/src/__tests__/FriendsTab.test.jsx`

**Modify:**
- `client/src/utils/helpers.js` — add `deriveFriendship` pure function
- `client/src/utils/queries.js` — add `customId` to concerts; add `concertCount` to friends subfield in `QUERY_ME` and `QUERY_USER`
- `client/src/utils/mutations.js` — add `ADD_FRIEND_BY_USERNAME`
- `client/src/components/Profile/Profile.jsx` — full rewrite
- `client/src/components/Profile/Profile.module.css` — full restyle

**Delete (Task 8):**
- `client/src/components/Profile/ProfileConcerts.jsx`
- `client/src/components/Profile/SkeletonShowCard.jsx`
- `client/src/components/Friends/Friends.jsx`
- `client/src/components/Friends/FriendList.jsx`
- `client/src/components/Friends/FriendSearch.jsx`
- `client/src/components/Friends/FriendListOptions.jsx`
- `client/src/components/Friends/ProfileFriends.jsx`
- `client/src/components/Friends/SkeletonFriendListItem.jsx`
- `client/src/components/Friends/styles/FriendList.module.css`
- `client/src/components/Friends/styles/Friends.module.css`
- `client/src/components/RequestBlock/` (entire directory — 10 files)

---

### Task 1: Add `deriveFriendship` utility and tests

**Files:**
- Modify: `client/src/utils/helpers.js`
- Create: `client/src/__tests__/deriveFriendship.test.js`

- [ ] **Step 1: Write the failing test**

Create `client/src/__tests__/deriveFriendship.test.js`:

```js
import { deriveFriendship } from '../utils/helpers';

const makeME = (overrides = {}) => ({
  friends: [],
  sentRequests: [],
  blockedUsers: [],
  ...overrides,
});

test('returns none when me is null', () => {
  expect(deriveFriendship(null, 'abc')).toBe('none');
});

test('returns none when targetId is null', () => {
  expect(deriveFriendship(makeME(), null)).toBe('none');
});

test('returns none when no relationship exists', () => {
  expect(deriveFriendship(makeME(), 'abc')).toBe('none');
});

test('returns friend when target is in friends list', () => {
  const me = makeME({ friends: [{ _id: 'abc', username: 'alice' }] });
  expect(deriveFriendship(me, 'abc')).toBe('friend');
});

test('returns requested when target is in sentRequests', () => {
  const me = makeME({ sentRequests: [{ _id: 'abc', username: 'alice' }] });
  expect(deriveFriendship(me, 'abc')).toBe('requested');
});

test('returns blocked when target is in blockedUsers', () => {
  const me = makeME({ blockedUsers: [{ _id: 'abc', username: 'alice' }] });
  expect(deriveFriendship(me, 'abc')).toBe('blocked');
});

test('blocked takes priority over friend', () => {
  const me = makeME({
    friends: [{ _id: 'abc' }],
    blockedUsers: [{ _id: 'abc' }],
  });
  expect(deriveFriendship(me, 'abc')).toBe('blocked');
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=deriveFriendship
```

Expected: FAIL — `deriveFriendship is not a function`

- [ ] **Step 3: Add `deriveFriendship` to `client/src/utils/helpers.js`**

Read the file first, then append at the bottom:

```js
export const deriveFriendship = (me, targetId) => {
  if (!me || !targetId) return 'none';
  if (me.blockedUsers?.some(u => u._id === targetId)) return 'blocked';
  if (me.friends?.some(u => u._id === targetId))      return 'friend';
  if (me.sentRequests?.some(u => u._id === targetId)) return 'requested';
  return 'none';
};
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=deriveFriendship
```

Expected: PASS — 7 tests passing

- [ ] **Step 5: Commit**

```bash
git add client/src/utils/helpers.js client/src/__tests__/deriveFriendship.test.js
git commit -m "feat: add deriveFriendship utility with tests"
```

---

### Task 2: Update queries — add `customId` and friend `concertCount`

**Files:**
- Modify: `client/src/utils/queries.js`

- [ ] **Step 1: Add `customId` and update friends in `QUERY_ME`**

In `QUERY_ME`, update the `concerts {}` block to include `customId` after `_id`, and the `friends {}` block to include `concertCount`:

```graphql
concerts {
    _id
    customId
    artists
    artistsLink
    description
    date
    times
    venue
    address
    phone
    website
    email
    ticketLink
}
```

```graphql
friends {
    _id
    username
    concertCount
}
```

- [ ] **Step 2: Apply the same changes to `QUERY_USER`**

`QUERY_USER` has the same `concerts {}` and `friends {}` subfields. Add `customId` to concerts and `concertCount` to friends identically to Step 1.

- [ ] **Step 3: Verify the app compiles**

```bash
cd client && npm test -- --watchAll=false
```

Expected: All previously passing tests still pass.

- [ ] **Step 4: Commit**

```bash
git add client/src/utils/queries.js
git commit -m "feat: add customId to profile concerts and concertCount to friends in queries"
```

---

### Task 3: Add `ADD_FRIEND_BY_USERNAME` mutation

**Files:**
- Modify: `client/src/utils/mutations.js`

- [ ] **Step 1: Append the mutation to `client/src/utils/mutations.js`**

```js
export const ADD_FRIEND_BY_USERNAME = gql`
    mutation addFriendByUsername($username: String!) {
        addFriendByUsername(username: $username) {
            _id
            username
            friendCount
            friends {
                _id
                username
            }
        }
    }
`;
```

- [ ] **Step 2: Verify the app compiles**

```bash
cd client && npm test -- --watchAll=false
```

Expected: All tests pass.

- [ ] **Step 3: Commit**

```bash
git add client/src/utils/mutations.js
git commit -m "feat: add ADD_FRIEND_BY_USERNAME mutation"
```

---

### Task 4: Create `ProfileHero` component

**Files:**
- Create: `client/src/components/Profile/ProfileHero.jsx`
- Create: `client/src/components/Profile/ProfileHero.module.css`
- Create: `client/src/__tests__/ProfileHero.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `client/src/__tests__/ProfileHero.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import ProfileHero from '../components/Profile/ProfileHero';

const user = { _id: 'u1', username: 'alice', concertCount: 5, friendCount: 3 };

const renderHero = (props) =>
  render(
    <MockedProvider>
      <MemoryRouter>
        <ProfileHero {...props} />
      </MemoryRouter>
    </MockedProvider>
  );

test('renders username', () => {
  renderHero({ user, isSelf: true, friendship: 'none' });
  expect(screen.getByText('alice')).toBeInTheDocument();
});

test('shows no action buttons on own profile', () => {
  renderHero({ user, isSelf: true, friendship: 'none' });
  expect(screen.queryByText('Add Friend')).not.toBeInTheDocument();
});

test('shows Add Friend when friendship is none', () => {
  renderHero({ user, isSelf: false, friendship: 'none' });
  expect(screen.getByText('Add Friend')).toBeInTheDocument();
});

test('shows Request Sent when friendship is requested', () => {
  renderHero({ user, isSelf: false, friendship: 'requested' });
  expect(screen.getByText('Request Sent')).toBeInTheDocument();
});

test('shows Remove when friendship is friend', () => {
  renderHero({ user, isSelf: false, friendship: 'friend' });
  expect(screen.getByText('Remove')).toBeInTheDocument();
});

test('shows Block button when not blocked', () => {
  renderHero({ user, isSelf: false, friendship: 'none' });
  expect(screen.getByText('Block')).toBeInTheDocument();
});

test('shows Unblock button when blocked', () => {
  renderHero({ user, isSelf: false, friendship: 'blocked' });
  expect(screen.getByText('Unblock')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=ProfileHero
```

Expected: FAIL — `Cannot find module '../components/Profile/ProfileHero'`

- [ ] **Step 3: Create `ProfileHero.jsx`**

```jsx
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_FRIEND_REQUEST, REMOVE_FRIEND, BLOCK_USER, UNBLOCK_USER } from '../../utils/mutations';
import styles from './ProfileHero.module.css';

const ProfileHero = ({ user, isSelf, friendship = 'none' }) => {
  const [status, setStatus] = useState(friendship);
  const [sendRequest] = useMutation(SEND_FRIEND_REQUEST);
  const [removeFriend] = useMutation(REMOVE_FRIEND);
  const [blockUser] = useMutation(BLOCK_USER);
  const [unblockUser] = useMutation(UNBLOCK_USER);

  const initials = (user.username || '?').slice(0, 2).toUpperCase();

  const handleAddFriend = async () => {
    try {
      await sendRequest({ variables: { friendId: user._id, friendName: user.username } });
      setStatus('requested');
    } catch (e) { console.error(e); }
  };

  const handleRemove = async () => {
    try {
      await removeFriend({ variables: { friendId: user._id } });
      setStatus('none');
    } catch (e) { console.error(e); }
  };

  const handleBlock = async () => {
    try {
      await blockUser({ variables: { blockedId: user._id } });
      setStatus('blocked');
    } catch (e) { console.error(e); }
  };

  const handleUnblock = async () => {
    try {
      await unblockUser({ variables: { blockedId: user._id } });
      setStatus('none');
    } catch (e) { console.error(e); }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.avatar}>{initials}</div>
      <div className={styles.info}>
        <div className={styles.username}>{user.username}</div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statVal}>{user.concertCount || 0}</span>
            <span className={styles.statLabel}>
              {user.concertCount === 1 ? 'Concert' : 'Concerts'}
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statVal}>{user.friendCount || 0}</span>
            <span className={styles.statLabel}>
              {user.friendCount === 1 ? 'Friend' : 'Friends'}
            </span>
          </div>
        </div>
      </div>

      {!isSelf && (
        <div className={styles.actions}>
          {status === 'none' && (
            <button className={styles.action} onClick={handleAddFriend}>Add Friend</button>
          )}
          {status === 'requested' && (
            <button className={`${styles.action} ${styles.actionPending}`} disabled>Request Sent</button>
          )}
          {status === 'friend' && (
            <button className={`${styles.action} ${styles.actionSecondary}`} onClick={handleRemove}>Remove</button>
          )}
          <button
            className={`${styles.action} ${styles.actionDanger}`}
            onClick={status === 'blocked' ? handleUnblock : handleBlock}
          >
            {status === 'blocked' ? 'Unblock' : 'Block'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileHero;
```

- [ ] **Step 4: Create `ProfileHero.module.css`**

```css
.hero {
  display: flex;
  align-items: center;
  gap: 3.2rem;
  padding: 2rem 0 4rem;
  border-bottom: 1px solid var(--border-dim);
}

.avatar {
  width: 11rem; height: 11rem;
  border-radius: 2.4rem;
  background: linear-gradient(135deg, oklch(62% 0.16 275 / 0.25), oklch(72% 0.16 305 / 0.25));
  border: 1px solid var(--accent-mid);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 4.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--accent-hi);
  flex-shrink: 0;
  box-shadow:
    0 0 32px oklch(62% 0.16 275 / 0.2),
    inset 0 1px 0 oklch(72% 0.16 275 / 0.2);
}

.info { flex: 1; min-width: 0; }

.username {
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 5vw, 4.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 1.4rem;
  word-break: break-word;
}

.stats { display: flex; gap: 2.4rem; align-items: center; }
.stat {
  display: flex; align-items: baseline; gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 1.15rem;
  letter-spacing: 0.04em;
}
.statVal {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-hi);
  font-variant-numeric: tabular-nums;
}
.statLabel {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-muted);
  font-size: 1.1rem;
}

.actions { display: flex; gap: 0.8rem; flex-shrink: 0; }
.action {
  display: inline-flex;
  align-items: center; gap: 0.7rem;
  padding: 0.9rem 1.6rem;
  border-radius: 0.8rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: 1px solid var(--accent);
  background: var(--accent);
  color: var(--bg-void);
  cursor: pointer;
  transition: all 0.15s;
}
.action:hover { background: var(--accent-hi); border-color: var(--accent-hi); }
.actionSecondary {
  background: var(--bg-surface);
  border-color: var(--border-mid);
  color: var(--text-secondary);
}
.actionSecondary:hover {
  background: var(--bg-raised);
  border-color: var(--border-hi);
  color: var(--text-primary);
}
.actionDanger {
  background: var(--bg-surface);
  border-color: var(--border-mid);
  color: var(--rsvp-no);
}
.actionDanger:hover {
  background: var(--rsvp-no-dim);
  border-color: var(--rsvp-no);
}
.actionPending {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent-hi);
}

@media (max-width: 720px) {
  .hero { flex-direction: column; align-items: flex-start; gap: 2rem; }
  .avatar { width: 8rem; height: 8rem; font-size: 3.2rem; }
  .actions { width: 100%; }
  .action { flex: 1; justify-content: center; }
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=ProfileHero
```

Expected: PASS — 7 tests passing

- [ ] **Step 6: Commit**

```bash
git add client/src/components/Profile/ProfileHero.jsx client/src/components/Profile/ProfileHero.module.css client/src/__tests__/ProfileHero.test.jsx
git commit -m "feat: add ProfileHero component with friendship state buttons"
```

---

### Task 5: Create `ConcertsList` component

**Files:**
- Create: `client/src/components/Profile/ConcertsList.jsx`
- Create: `client/src/components/Profile/ConcertsList.module.css`
- Create: `client/src/__tests__/ConcertsList.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `client/src/__tests__/ConcertsList.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import ConcertsList from '../components/Profile/ConcertsList';

const renderList = (user, isSelf = true) =>
  render(
    <MockedProvider>
      <MemoryRouter>
        <ConcertsList user={user} isSelf={isSelf} />
      </MemoryRouter>
    </MockedProvider>
  );

test('shows own empty state when no concerts and isSelf', () => {
  renderList({ username: 'alice', concerts: [] }, true);
  expect(screen.getByText('No saved concerts yet')).toBeInTheDocument();
});

test('shows other empty state when no concerts and not isSelf', () => {
  renderList({ username: 'alice', concerts: [] }, false);
  expect(screen.getByText('alice has no saved concerts')).toBeInTheDocument();
});

test('renders concert artist name', () => {
  const concerts = [
    { _id: 'c1', customId: 'show-1', artists: 'The Midnight', date: '2026-06-01T00:00:00.000Z', venue: "Stubb's" }
  ];
  renderList({ username: 'alice', concerts }, true);
  expect(screen.getByText('The Midnight')).toBeInTheDocument();
});

test('renders venue name', () => {
  const concerts = [
    { _id: 'c1', customId: 'show-1', artists: 'The Midnight', date: '2026-06-01T00:00:00.000Z', venue: "Stubb's" }
  ];
  renderList({ username: 'alice', concerts }, true);
  expect(screen.getByText("Stubb's")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=ConcertsList
```

Expected: FAIL — `Cannot find module '../components/Profile/ConcertsList'`

- [ ] **Step 3: Create `ConcertsList.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { DELETE_CONCERT_FROM_USER } from '../../utils/mutations';
import { Trash2 } from '@styled-icons/feather/Trash2';
import styles from './ConcertsList.module.css';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const ConcertsList = ({ user, isSelf }) => {
  const [deleteConcert] = useMutation(DELETE_CONCERT_FROM_USER);

  const handleRemove = async (id) => {
    try { await deleteConcert({ variables: { concertId: id } }); }
    catch (e) { console.error(e); }
  };

  if (!user.concerts || user.concerts.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>♪</div>
        <div className={styles.emptyTitle}>
          {isSelf ? 'No saved concerts yet' : `${user.username} has no saved concerts`}
        </div>
        <div className={styles.emptySub}>
          {isSelf ? 'Browse shows and tap + to save them here.' : 'Check back later.'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {user.concerts.map(c => (
        <ConcertRow
          key={c._id}
          concert={c}
          isSelf={isSelf}
          onRemove={() => handleRemove(c._id)}
        />
      ))}
    </div>
  );
};

const ConcertRow = ({ concert, isSelf, onRemove }) => {
  const d = new Date(concert.date);
  return (
    <Link
      to={`/show/${concert.customId}`}
      state={{ concert }}
      className={styles.row}
    >
      <div className={styles.date}>
        <div className={styles.dateDay}>{DAYS[d.getDay()]}</div>
        <div className={styles.dateNum}>{d.getDate()}</div>
        <div className={styles.dateMonth}>{MONTHS[d.getMonth()]}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.artists}>{concert.artists}</div>
        {concert.venue && (
          <div className={styles.meta}>
            <span className={styles.at}>at</span>
            <span>{concert.venue}</span>
          </div>
        )}
      </div>
      {isSelf && (
        <button
          className={styles.removeBtn}
          aria-label="Remove from saved"
          title="Remove from saved"
          onClick={(e) => { e.preventDefault(); onRemove(); }}
        >
          <Trash2 />
        </button>
      )}
    </Link>
  );
};

export default ConcertsList;
```

- [ ] **Step 4: Create `ConcertsList.module.css`**

```css
.list { display: flex; flex-direction: column; gap: 0.4rem; }

.row {
  display: grid;
  grid-template-columns: 9rem 1fr auto;
  align-items: center;
  gap: 1.8rem;
  padding: 1.6rem;
  border-radius: 1rem;
  background: transparent;
  border: 1px solid transparent;
  transition: background 0.18s, border-color 0.18s;
  position: relative;
  text-decoration: none;
  color: inherit;
}
.row:hover { background: var(--bg-surface); border-color: var(--border-dim); }
.row:not(:hover):not(:first-child)::before {
  content: '';
  position: absolute;
  top: -1px; left: 1.6rem; right: 1.6rem;
  height: 1px;
  background: var(--border-dim);
}

.date {
  text-align: center;
  border-right: 1px solid var(--border-dim);
  padding-right: 1.8rem;
}
.dateDay {
  font-family: var(--font-mono);
  font-size: 1rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.dateNum {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  margin: 0.4rem 0;
  font-variant-numeric: tabular-nums;
}
.row:hover .dateNum { color: var(--accent-hi); }
.dateMonth {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.content { min-width: 0; }
.artists {
  font-family: var(--font-display);
  font-size: 1.85rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.15;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.15s;
}
.row:hover .artists { color: var(--accent-hi); }
.meta {
  display: flex; align-items: center; gap: 0.8rem;
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-top: 0.4rem;
}
.at {
  color: var(--text-muted);
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 0.18em;
}

.removeBtn {
  background: var(--bg-raised);
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  width: 3.4rem; height: 3.4rem;
  border-radius: 0.8rem;
  display: flex; align-items: center; justify-content: center;
  opacity: 0;
  transition: all 0.15s;
  cursor: pointer;
}
.row:hover .removeBtn { opacity: 1; }
.removeBtn:hover {
  color: var(--rsvp-no);
  border-color: var(--rsvp-no);
  background: var(--rsvp-no-dim);
}
.removeBtn svg { width: 1.4rem; height: 1.4rem; }

.empty {
  padding: 6rem 2rem; text-align: center;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 1.2rem;
}
.emptyIcon {
  width: 5rem; height: 5rem;
  margin: 0 auto 1.6rem;
  border-radius: 50%;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  font-size: 2rem;
}
.emptyTitle {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}
.emptySub { font-size: 1.5rem; color: var(--text-muted); }

@media (max-width: 720px) {
  .row { grid-template-columns: 6.4rem 1fr; gap: 1.2rem; padding: 1.2rem; }
  .removeBtn { grid-column: 2; justify-self: flex-end; opacity: 1; }
  .dateNum { font-size: 2.4rem; }
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=ConcertsList
```

Expected: PASS — 4 tests passing

- [ ] **Step 6: Commit**

```bash
git add client/src/components/Profile/ConcertsList.jsx client/src/components/Profile/ConcertsList.module.css client/src/__tests__/ConcertsList.test.jsx
git commit -m "feat: add ConcertsList component with date-stack rows"
```

---

### Task 6: Create `FriendsTab` component

**Files:**
- Create: `client/src/components/Friends/FriendsTab.jsx`
- Create: `client/src/components/Friends/FriendsTab.module.css`
- Create: `client/src/__tests__/FriendsTab.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `client/src/__tests__/FriendsTab.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import FriendsTab from '../components/Friends/FriendsTab';

const renderTab = (user) =>
  render(
    <MockedProvider>
      <MemoryRouter>
        <FriendsTab user={user} />
      </MemoryRouter>
    </MockedProvider>
  );

const baseUser = {
  friends: [],
  receivedRequests: [],
  sentRequests: [],
  blockedUsers: [],
};

test('shows empty friends state when no friends', () => {
  renderTab(baseUser);
  expect(screen.getByText('No friends yet')).toBeInTheDocument();
});

test('renders friend username', () => {
  const user = { ...baseUser, friends: [{ _id: 'f1', username: 'bob', concertCount: 2 }] };
  renderTab(user);
  expect(screen.getByText('bob')).toBeInTheDocument();
});

test('filters friends by search query', () => {
  const user = {
    ...baseUser,
    friends: [
      { _id: 'f1', username: 'alice', concertCount: 1 },
      { _id: 'f2', username: 'bob', concertCount: 2 },
    ],
  };
  renderTab(user);
  fireEvent.change(screen.getByPlaceholderText(/search friends/i), { target: { value: 'ali' } });
  expect(screen.getByText('alice')).toBeInTheDocument();
  expect(screen.queryByText('bob')).not.toBeInTheDocument();
});

test('shows no-matches state when filter finds nothing', () => {
  const user = { ...baseUser, friends: [{ _id: 'f1', username: 'alice', concertCount: 1 }] };
  renderTab(user);
  fireEvent.change(screen.getByPlaceholderText(/search friends/i), { target: { value: 'zzz' } });
  expect(screen.getByText('No matches')).toBeInTheDocument();
});

test('shows received request username', () => {
  const user = { ...baseUser, receivedRequests: [{ _id: 'r1', username: 'carol' }] };
  renderTab(user);
  expect(screen.getByText('carol')).toBeInTheDocument();
});

test('shows sent request username', () => {
  const user = { ...baseUser, sentRequests: [{ _id: 's1', username: 'dave' }] };
  renderTab(user);
  expect(screen.getByText('dave')).toBeInTheDocument();
});

test('shows blocked user username', () => {
  const user = { ...baseUser, blockedUsers: [{ _id: 'b1', username: 'eve' }] };
  renderTab(user);
  expect(screen.getByText('eve')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=FriendsTab
```

Expected: FAIL — `Cannot find module '../components/Friends/FriendsTab'`

- [ ] **Step 3: Create `FriendsTab.jsx`**

```jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  ADD_FRIEND_BY_USERNAME,
  REMOVE_FRIEND,
  BLOCK_USER,
  UNBLOCK_USER,
  ACCEPT_FRIEND_REQUEST,
  DECLINE_FRIEND_REQUEST,
  CANCEL_FRIEND_REQUEST,
} from '../../utils/mutations';
import { Search }       from '@styled-icons/feather/Search';
import { ExternalLink } from '@styled-icons/feather/ExternalLink';
import { UserMinus }    from '@styled-icons/feather/UserMinus';
import { UserX }        from '@styled-icons/feather/UserX';
import { Check }        from '@styled-icons/feather/Check';
import { X }            from '@styled-icons/feather/X';
import styles from './FriendsTab.module.css';

const FriendsTab = ({ user }) => {
  const [query, setQuery] = useState('');
  const [addFriendByUsername] = useMutation(ADD_FRIEND_BY_USERNAME);
  const [removeFriend]        = useMutation(REMOVE_FRIEND);
  const [blockUser]           = useMutation(BLOCK_USER);
  const [unblockUser]         = useMutation(UNBLOCK_USER);
  const [acceptRequest]       = useMutation(ACCEPT_FRIEND_REQUEST);
  const [declineRequest]      = useMutation(DECLINE_FRIEND_REQUEST);
  const [cancelRequest]       = useMutation(CANCEL_FRIEND_REQUEST);

  const friends  = user.friends          || [];
  const received = user.receivedRequests || [];
  const sent     = user.sentRequests     || [];
  const blocked  = user.blockedUsers     || [];

  const filtered = friends.filter(f =>
    f.username.toLowerCase().includes(query.toLowerCase())
  );

  const isExistingFriend = friends.some(
    f => f.username.toLowerCase() === query.trim().toLowerCase()
  );

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || isExistingFriend) return;
    try {
      await addFriendByUsername({ variables: { username: query.trim() } });
      setQuery('');
    } catch (err) { console.error(err); }
  };

  return (
    <div className={styles.layout}>
      <div>
        <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
          <Search className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search friends or send a friend request…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className={styles.searchSubmit}
            disabled={!query.trim() || isExistingFriend}
          >Add</button>
        </form>

        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>Friends</span>
          <span className={styles.sectionCount}>{filtered.length} of {friends.length}</span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title={query ? 'No matches' : 'No friends yet'}
            sub={query ? 'Try a different username.' : 'Send a friend request to get started.'}
          />
        ) : (
          <div className={styles.list}>
            {filtered.map(f => (
              <FriendItem
                key={f._id}
                friend={f}
                onRemove={() => removeFriend({ variables: { friendId: f._id } })}
                onBlock={() => blockUser({ variables: { blockedId: f._id } })}
              />
            ))}
          </div>
        )}
      </div>

      <aside className={styles.sidePanel}>
        <SideCard title="Received" count={received.length} emptyText="No pending requests">
          {received.map(r => (
            <CompactItem
              key={r._id}
              entry={r}
              sub="wants to be friends"
              actions={[
                { kind: 'success', icon: <Check />, label: 'Accept',  onClick: () => acceptRequest({ variables: { senderId: r._id, senderName: r.username } }) },
                { kind: 'danger',  icon: <X />,     label: 'Decline', onClick: () => declineRequest({ variables: { senderId: r._id, senderName: r.username } }) },
              ]}
            />
          ))}
        </SideCard>

        <SideCard title="Sent" count={sent.length} emptyText="No requests sent">
          {sent.map(r => (
            <CompactItem
              key={r._id}
              entry={r}
              sub="request pending"
              actions={[
                { kind: 'danger', icon: <X />, label: 'Cancel', onClick: () => cancelRequest({ variables: { friendId: r._id, friendName: r.username } }) },
              ]}
            />
          ))}
        </SideCard>

        <SideCard title="Blocked" count={blocked.length} emptyText="No blocked users">
          {blocked.map(b => (
            <CompactItem
              key={b._id}
              entry={b}
              sub="blocked"
              actions={[
                { kind: 'text', label: 'Unblock', onClick: () => unblockUser({ variables: { blockedId: b._id } }) },
              ]}
            />
          ))}
        </SideCard>
      </aside>
    </div>
  );
};

const FriendItem = ({ friend, onRemove, onBlock }) => {
  const initials = (friend.username || '?').slice(0, 2).toUpperCase();
  return (
    <div className={styles.friendItem}>
      <div className={styles.friendAvatar}>{initials}</div>
      <div className={styles.friendInfo}>
        <div className={styles.friendName}>{friend.username}</div>
        <div className={styles.friendMeta}>{friend.concertCount || 0} concerts saved</div>
      </div>
      <div className={styles.friendActions}>
        <Link to={`/profile/${friend.username}`} className={styles.iconBtn} title="View profile">
          <ExternalLink />
        </Link>
        <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} title="Remove friend" onClick={onRemove}>
          <UserMinus />
        </button>
        <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} title="Block" onClick={onBlock}>
          <UserX />
        </button>
      </div>
    </div>
  );
};

const SideCard = ({ title, count, emptyText, children }) => (
  <div className={styles.sideCard}>
    <div className={styles.sideCardHeader}>
      <span className={styles.sideCardTitle}>{title}</span>
      <span className={styles.sideCardCount}>{count}</span>
    </div>
    <div className={styles.sideCardBody}>
      {count === 0 ? <div className={styles.sideEmpty}>{emptyText}</div> : children}
    </div>
  </div>
);

const CompactItem = ({ entry, sub, actions = [] }) => {
  const initials = (entry.username || '?').slice(0, 2).toUpperCase();
  return (
    <div className={styles.compactItem}>
      <div className={styles.compactAvatar}>{initials}</div>
      <div className={styles.compactInfo}>
        <div className={styles.compactName}>{entry.username}</div>
        <div className={styles.compactSub}>{sub}</div>
      </div>
      <div className={styles.compactActions}>
        {actions.map((a, i) => (
          <button
            key={i}
            className={`${styles.iconBtnSm} ${styles[`iconBtn_${a.kind}`] || ''}`}
            title={a.label}
            onClick={a.onClick}
          >
            {a.icon || a.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const EmptyState = ({ title, sub }) => (
  <div className={styles.empty}>
    <div className={styles.emptyIcon}>∅</div>
    <div className={styles.emptyTitle}>{title}</div>
    <div className={styles.emptySub}>{sub}</div>
  </div>
);

export default FriendsTab;
```

- [ ] **Step 4: Create `FriendsTab.module.css`**

```css
.layout {
  display: grid;
  grid-template-columns: 1fr 36rem;
  gap: 3.2rem;
}

.searchForm {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.4rem 0.4rem 0.4rem 1.6rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: 0.8rem;
  margin-bottom: 2rem;
  transition: border-color 0.15s;
}
.searchForm:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px oklch(62% 0.16 275 / 0.12);
}
.searchIcon { color: var(--text-muted); width: 1.6rem; height: 1.6rem; }
.searchInput {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 1.5rem;
  padding: 0;
  line-height: 1.2;
}
.searchInput::placeholder { color: var(--text-muted); }
.searchSubmit {
  padding: 0.85rem 1.4rem;
  background: var(--accent);
  border: none;
  color: var(--bg-void);
  border-radius: 0.6rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
}
.searchSubmit:hover { background: var(--accent-hi); }
.searchSubmit:disabled { background: var(--bg-raised); color: var(--text-muted); cursor: not-allowed; }

.sectionHeader {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 0.8rem;
}
.sectionTitle {
  font-family: var(--font-mono);
  font-size: 1.15rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.sectionCount { font-family: var(--font-mono); font-size: 1.15rem; color: var(--text-muted); }

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 1rem;
  padding: 0.6rem;
}
.friendItem {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1rem 1.2rem;
  border-radius: 0.6rem;
  transition: background 0.15s;
}
.friendItem:hover { background: var(--bg-raised); }

.friendAvatar {
  width: 4rem; height: 4rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, oklch(62% 0.16 275 / 0.2), oklch(72% 0.16 320 / 0.2));
  border: 1px solid var(--accent-mid);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--accent-hi);
  flex-shrink: 0;
}

.friendInfo { flex: 1; min-width: 0; }
.friendName {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  transition: color 0.15s;
}
.friendItem:hover .friendName { color: var(--accent-hi); }
.friendMeta {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  color: var(--text-muted);
  margin-top: 0.3rem;
  letter-spacing: 0.04em;
}

.friendActions {
  display: flex; align-items: center; gap: 0.4rem;
  opacity: 0;
  transition: opacity 0.15s;
}
.friendItem:hover .friendActions { opacity: 1; }

.iconBtn {
  background: none;
  border: 1px solid transparent;
  color: var(--text-muted);
  width: 3.2rem; height: 3.2rem;
  border-radius: 0.6rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
}
.iconBtn:hover { color: var(--text-primary); background: var(--bg-overlay); border-color: var(--border-mid); }
.iconBtnDanger:hover { color: var(--rsvp-no); background: var(--rsvp-no-dim); border-color: var(--rsvp-no); }
.iconBtn svg { width: 1.6rem; height: 1.6rem; }

.sidePanel {
  position: sticky;
  top: calc(var(--header-height) + 2rem);
  align-self: start;
}

.sideCard {
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 1.2rem;
  overflow: hidden;
  margin-bottom: 1.6rem;
}
.sideCardHeader {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.4rem 1.6rem;
  border-bottom: 1px solid var(--border-dim);
}
.sideCardTitle {
  font-family: var(--font-mono);
  font-size: 1.15rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
}
.sideCardCount {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  color: var(--text-muted);
  border-radius: 0.4rem;
  padding: 0.2rem 0.6rem;
  font-variant-numeric: tabular-nums;
}
.sideCardBody { padding: 0.6rem; display: flex; flex-direction: column; gap: 2px; }

.compactItem {
  display: flex; align-items: center; gap: 1rem;
  padding: 0.8rem 1rem;
  border-radius: 0.5rem;
}
.compactItem:hover { background: var(--bg-raised); }
.compactAvatar {
  width: 3.2rem; height: 3.2rem;
  border-radius: 0.7rem;
  background: var(--bg-overlay);
  border: 1px solid var(--border-mid);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-secondary);
  flex-shrink: 0;
}
.compactInfo { flex: 1; min-width: 0; }
.compactName { font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; color: var(--text-primary); }
.compactSub { font-family: var(--font-mono); font-size: 1.15rem; color: var(--text-muted); margin-top: 0.2rem; }
.compactActions { display: flex; gap: 0.4rem; }

.iconBtnSm {
  background: none;
  border: 1px solid transparent;
  color: var(--text-muted);
  width: 2.8rem; height: 2.8rem;
  border-radius: 0.5rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0 0.6rem;
  white-space: nowrap;
}
.iconBtnSm svg { width: 1.4rem; height: 1.4rem; }
.iconBtnSm:hover { background: var(--bg-overlay); border-color: var(--border-mid); color: var(--text-primary); }
.iconBtn_success:hover { color: var(--rsvp-yes); border-color: var(--rsvp-yes); background: var(--rsvp-yes-dim); }
.iconBtn_danger:hover { color: var(--rsvp-no); border-color: var(--rsvp-no); background: var(--rsvp-no-dim); }
.iconBtn_text { width: auto; }

.sideEmpty {
  padding: 2rem 1rem;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 1.2rem;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.empty {
  padding: 6rem 2rem; text-align: center;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 1.2rem;
}
.emptyIcon {
  width: 5rem; height: 5rem;
  margin: 0 auto 1.6rem;
  border-radius: 50%;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  font-size: 2rem;
}
.emptyTitle { font-family: var(--font-display); font-size: 1.8rem; font-weight: 700; margin-bottom: 0.6rem; }
.emptySub { font-size: 1.4rem; color: var(--text-muted); }

@media (max-width: 880px) {
  .layout { grid-template-columns: 1fr; }
  .sidePanel { position: static; }
}
@media (max-width: 720px) {
  .friendActions { opacity: 1; }
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=FriendsTab
```

Expected: PASS — 7 tests passing

- [ ] **Step 6: Commit**

```bash
git add client/src/components/Friends/FriendsTab.jsx client/src/components/Friends/FriendsTab.module.css client/src/__tests__/FriendsTab.test.jsx
git commit -m "feat: add FriendsTab component with two-column layout and sticky side panel"
```

---

### Task 7: Rewrite `Profile.jsx` and `Profile.module.css`

**Files:**
- Modify: `client/src/components/Profile/Profile.jsx`
- Modify: `client/src/components/Profile/Profile.module.css`

- [ ] **Step 1: Rewrite `Profile.jsx`**

Replace the entire file content:

```jsx
import { useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../../utils/queries';
import Auth from '../../utils/auth';
import { deriveFriendship } from '../../utils/helpers';
import BackButton from '../shared/BackButton';
import ProfileHero from './ProfileHero';
import ConcertsList from './ConcertsList';
import FriendsTab from '../Friends/FriendsTab';
import styles from './Profile.module.css';

const Profile = () => {
  const { username: userParam } = useParams();
  const [tab, setTab] = useState('concerts');

  const { loading, data, startPolling, stopPolling } = useQuery(
    userParam ? QUERY_USER : QUERY_ME,
    { variables: { username: userParam } }
  );

  const { data: meData } = useQuery(QUERY_ME, {
    skip: !userParam || !Auth.loggedIn(),
  });

  useEffect(() => {
    startPolling(1000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const user = useMemo(() => data?.me || data?.user || {}, [data]);
  const me   = useMemo(() => meData?.me || null, [meData]);
  const isSelf = !userParam;

  const friendship = useMemo(
    () => deriveFriendship(me, user._id),
    [me, user._id]
  );

  if (Auth.loggedIn() && Auth.getProfile()?.data.username === userParam) {
    return <Navigate to='/profile' />;
  }
  if (loading) return <div>Loading…</div>;
  if (!user?._id) return <h4>You need to be logged in to see this page.</h4>;

  return (
    <main className={styles.main}>
      <div className={`${styles.page} fade-up`}>
        <div className={styles.backBar}>
          <BackButton />
        </div>

        <ProfileHero user={user} isSelf={isSelf} friendship={friendship} />

        {isSelf ? (
          <>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tab === 'concerts' ? styles.tabActive : ''}`}
                onClick={() => setTab('concerts')}
              >
                Concerts <span className={styles.tabCount}>{user.concertCount || 0}</span>
              </button>
              <button
                className={`${styles.tab} ${tab === 'friends' ? styles.tabActive : ''}`}
                onClick={() => setTab('friends')}
              >
                Friends <span className={styles.tabCount}>{user.friendCount || 0}</span>
              </button>
            </div>
            <div className={styles.tabContent}>
              {tab === 'concerts' && <ConcertsList user={user} isSelf={true} />}
              {tab === 'friends'  && <FriendsTab  user={user} />}
            </div>
          </>
        ) : (
          <div className={styles.tabContent}>
            <ConcertsList user={user} isSelf={false} />
          </div>
        )}
      </div>
    </main>
  );
};

export default Profile;
```

- [ ] **Step 2: Rewrite `Profile.module.css`**

Replace the entire file content:

```css
.main {
  position: relative; z-index: 1;
  padding-top: var(--header-height);
  min-height: 100vh;
}
.page {
  max-width: var(--max-content);
  margin: 0 auto;
  padding: 3.2rem 4rem 8rem;
}
.backBar {
  display: flex; align-items: center;
  padding: 0.8rem 0 2.4rem;
}

.tabs {
  display: flex;
  gap: 0.4rem;
  padding: 2.4rem 0 0;
  border-bottom: 1px solid var(--border-dim);
}
.tab {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.6rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--text-secondary);
  cursor: pointer;
  margin-bottom: -1px;
  transition: color 0.15s, border-color 0.15s;
}
.tab:hover { color: var(--text-primary); }
.tabActive {
  color: var(--accent-hi);
  border-bottom-color: var(--accent);
}
.tabCount {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  background: var(--bg-raised);
  border: 1px solid var(--border-dim);
  color: var(--text-muted);
  border-radius: 0.4rem;
  padding: 0.2rem 0.6rem;
  min-width: 2rem;
  font-variant-numeric: tabular-nums;
}
.tabActive .tabCount {
  background: var(--accent-dim);
  border-color: var(--accent-mid);
  color: var(--accent-hi);
}
.tabContent { padding: 3.2rem 0; }

@media (max-width: 720px) {
  .page { padding: 2rem 1.6rem 6rem; }
}
```

- [ ] **Step 3: Run all tests**

```bash
cd client && npm test -- --watchAll=false
```

Expected: All tests pass.

- [ ] **Step 4: Start dev server and verify visually**

```bash
npm run develop
```

Navigate to `http://localhost:3002` and log in. Check:

- `/profile` — hero with initials/stats, Concerts and Friends tabs, date-stack concert rows, two-column friends layout with side panel
- `/profile/:anotherUsername` — hero with Add Friend / Block buttons, concerts list only, no Friends tab

- [ ] **Step 5: Commit**

```bash
git add client/src/components/Profile/Profile.jsx client/src/components/Profile/Profile.module.css
git commit -m "feat: rewrite Profile shell with new sub-components and inline tab state"
```

---

### Task 8: Delete deprecated files and remove `react-switch`

**Files:**
- Delete: deprecated Profile, Friends, and RequestBlock components

- [ ] **Step 1: Delete deprecated Profile components**

```bash
rm client/src/components/Profile/ProfileConcerts.jsx
rm client/src/components/Profile/SkeletonShowCard.jsx
```

- [ ] **Step 2: Delete deprecated Friends components and style directory**

```bash
rm client/src/components/Friends/Friends.jsx
rm client/src/components/Friends/FriendList.jsx
rm client/src/components/Friends/FriendSearch.jsx
rm client/src/components/Friends/FriendListOptions.jsx
rm client/src/components/Friends/ProfileFriends.jsx
rm client/src/components/Friends/SkeletonFriendListItem.jsx
rm -rf client/src/components/Friends/styles/
```

- [ ] **Step 3: Delete the entire RequestBlock directory**

```bash
rm -rf client/src/components/RequestBlock/
```

- [ ] **Step 4: Remove `react-switch` dependency**

```bash
cd client && npm uninstall react-switch
```

- [ ] **Step 5: Run all tests to verify no broken imports**

```bash
cd client && npm test -- --watchAll=false
```

Expected: All tests pass. If any test file imports a deleted component, remove that test file.

- [ ] **Step 6: Start dev server and do a final smoke test**

```bash
npm run develop
```

Verify own profile and another user's profile both work as expected.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: delete deprecated Profile, Friends, and RequestBlock components"
```
