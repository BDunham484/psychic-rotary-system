# Show Page Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the Show detail page and its two RSVP components to match the new design — back bar, hero, details grid, actions row, and three-card RSVP block.

**Architecture:** Three independent rewrites — `DisabledConcertRSVP`, `ConcertRSVP`, then `Show.jsx` — each with a co-located CSS module. `ConcertRSVP` reads `userId` from `GlobalState` and handles RSVP toggle (add + cancel mutations) in a single self-contained component.

**Tech Stack:** React 18, Apollo Client 3, React Router v6, `@styled-icons/feather`, CSS Modules, Jest + React Testing Library (CRA)

---

## File Map

| Action | Path |
|---|---|
| Rewrite | `client/src/components/DisabledConcertRSVP/index.js` |
| Create | `client/src/components/DisabledConcertRSVP/DisabledConcertRSVP.module.css` |
| Create | `client/src/components/DisabledConcertRSVP/DisabledConcertRSVP.test.js` |
| Rewrite | `client/src/components/shared/ConcertRSVP/index.js` |
| Create | `client/src/components/shared/ConcertRSVP/ConcertRSVP.module.css` |
| Create | `client/src/components/shared/ConcertRSVP/ConcertRSVP.test.js` |
| Rewrite | `client/src/pages/Show.jsx` |
| Create | `client/src/pages/Show.module.css` |
| Create | `client/src/pages/Show.test.js` |

---

## Task 1: DisabledConcertRSVP

**Files:**
- Rewrite: `client/src/components/DisabledConcertRSVP/index.js`
- Create: `client/src/components/DisabledConcertRSVP/DisabledConcertRSVP.module.css`
- Create: `client/src/components/DisabledConcertRSVP/DisabledConcertRSVP.test.js`

- [ ] **Step 1: Write the failing tests**

Create `client/src/components/DisabledConcertRSVP/DisabledConcertRSVP.test.js`:

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { GET_CONCERT_BY_ID } from '../../utils/queries';
import DisabledConcertRSVP from './index';

const mocks = [
  {
    request: { query: GET_CONCERT_BY_ID, variables: { concertId: 'c1' } },
    result: {
      data: {
        concert: {
          _id: 'c1',
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
          yes:   [{ _id: 'u1' }, { _id: 'u2' }],
          no:    [{ _id: 'u3' }],
          maybe: [],
        },
      },
    },
  },
];

const renderComponent = () =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <DisabledConcertRSVP concertId="c1" />
      </MemoryRouter>
    </MockedProvider>
  );

test('renders yes/no/maybe count labels', async () => {
  renderComponent();
  expect(await screen.findByText('Yes')).toBeInTheDocument();
  expect(screen.getByText('No')).toBeInTheDocument();
  expect(screen.getByText('Maybe')).toBeInTheDocument();
});

test('renders yes count from query', async () => {
  renderComponent();
  expect(await screen.findByText('2')).toBeInTheDocument();
});

test('renders login CTA link', async () => {
  renderComponent();
  const link = await screen.findByRole('link', { name: /log in to rsvp/i });
  expect(link).toHaveAttribute('href', '/login');
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="DisabledConcertRSVP"
```

Expected: FAIL — component has wrong structure (no labels, no counts, no login CTA).

- [ ] **Step 3: Write the CSS module**

Create `client/src/components/DisabledConcertRSVP/DisabledConcertRSVP.module.css`:

```css
.wrap {
  text-align: center;
  padding: 3.2rem 2rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 1.2rem;
}
.counts {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}
.count {
  display: flex; flex-direction: column; align-items: center; gap: 0.4rem;
}
.countVal {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}
.countLabel {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.cta {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1.1rem 2rem;
  background: var(--accent);
  border: none;
  border-radius: 0.8rem;
  color: var(--bg-void);
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.15s;
}
.cta:hover { background: var(--accent-hi); }
```

- [ ] **Step 4: Rewrite the component**

Replace all contents of `client/src/components/DisabledConcertRSVP/index.js`:

```jsx
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CONCERT_BY_ID } from '../../utils/queries';
import styles from './DisabledConcertRSVP.module.css';

const DisabledConcertRSVP = ({ concertId }) => {
  const { data } = useQuery(GET_CONCERT_BY_ID, { variables: { concertId } });
  const yesCount   = data?.concert?.yes?.length   || 0;
  const noCount    = data?.concert?.no?.length    || 0;
  const maybeCount = data?.concert?.maybe?.length || 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.counts}>
        <Count val={yesCount}   label="Yes" />
        <Count val={maybeCount} label="Maybe" />
        <Count val={noCount}    label="No" />
      </div>
      <Link to="/login" className={styles.cta}>Log in to RSVP</Link>
    </div>
  );
};

const Count = ({ val, label }) => (
  <div className={styles.count}>
    <div className={styles.countVal}>{val}</div>
    <div className={styles.countLabel}>{label}</div>
  </div>
);

export default DisabledConcertRSVP;
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="DisabledConcertRSVP"
```

Expected: PASS — all 3 tests green.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/DisabledConcertRSVP/
git commit -m "feat: rewrite DisabledConcertRSVP with counts and login CTA"
```

---

## Task 2: ConcertRSVP

**Files:**
- Rewrite: `client/src/components/shared/ConcertRSVP/index.js`
- Create: `client/src/components/shared/ConcertRSVP/ConcertRSVP.module.css`
- Create: `client/src/components/shared/ConcertRSVP/ConcertRSVP.test.js`

- [ ] **Step 1: Write the failing tests**

Create `client/src/components/shared/ConcertRSVP/ConcertRSVP.test.js`:

```js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { ConcertContext } from '../../../utils/GlobalState';
import { GET_CONCERT_BY_ID } from '../../../utils/queries';
import {
  RSVP_YES, CANCEL_RSVP_YES,
  RSVP_NO,
  RSVP_MAYBE,
} from '../../../utils/mutations';
import ConcertRSVP from './index';

const USER_ID = 'user123';
const CONCERT_ID = 'c1';

const mockContext = { user: { me: { _id: USER_ID } } };

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
};

const makeQueryMock = (yes = [], no = [], maybe = []) => ({
  request: { query: GET_CONCERT_BY_ID, variables: { concertId: CONCERT_ID } },
  result: { data: { concert: { ...concertBase, yes, no, maybe } } },
});

const makeRsvpMutationMock = (mutation, variables, returnKey, returnVal) => ({
  request: { query: mutation, variables },
  result: { data: { [returnKey]: { _id: CONCERT_ID, artists: 'Test Artist', [returnKey.replace('rsvp', '').replace('cancel', '').toLowerCase()]: returnVal } } },
});

const renderComponent = (mocks) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <ConcertContext.Provider value={mockContext}>
        <ConcertRSVP concertId={CONCERT_ID} />
      </ConcertContext.Provider>
    </MockedProvider>
  );

test('renders Yes, Maybe, No option cards', async () => {
  renderComponent([makeQueryMock()]);
  expect(await screen.findByText('Yes')).toBeInTheDocument();
  expect(screen.getByText('Maybe')).toBeInTheDocument();
  expect(screen.getByText('No')).toBeInTheDocument();
});

test('shows count for each option', async () => {
  renderComponent([makeQueryMock(
    [{ _id: 'u1' }, { _id: 'u2' }],
    [{ _id: 'u3' }],
    []
  )]);
  expect(await screen.findByText('2 people')).toBeInTheDocument();
  expect(screen.getByText('1 person')).toBeInTheDocument();
  expect(screen.getByText('0 people')).toBeInTheDocument();
});

test('calls RSVP_YES mutation when Yes card clicked and not already RSVPd', async () => {
  let mutationCalled = false;
  const mocks = [
    makeQueryMock(),
    {
      request: { query: RSVP_YES, variables: { concertId: CONCERT_ID, userId: USER_ID } },
      result: () => { mutationCalled = true; return { data: { rsvpYes: { _id: CONCERT_ID, artists: 'Test Artist', yes: [{ _id: USER_ID }] } } }; },
    },
  ];
  renderComponent(mocks);
  fireEvent.click(await screen.findByText('Yes'));
  await waitFor(() => expect(mutationCalled).toBe(true));
});

test('calls CANCEL_RSVP_YES when Yes card clicked and already RSVPd Yes', async () => {
  let mutationCalled = false;
  const mocks = [
    makeQueryMock([{ _id: USER_ID }], [], []),
    {
      request: { query: CANCEL_RSVP_YES, variables: { concertId: CONCERT_ID, userId: USER_ID } },
      result: () => { mutationCalled = true; return { data: { cancelRsvpYes: { _id: CONCERT_ID, artists: 'Test Artist', yes: [] } } }; },
    },
  ];
  renderComponent(mocks);
  fireEvent.click(await screen.findByText('Yes'));
  await waitFor(() => expect(mutationCalled).toBe(true));
});

test('calls RSVP_NO when switching from Yes to No', async () => {
  let mutationCalled = false;
  const mocks = [
    makeQueryMock([{ _id: USER_ID }], [], []),
    {
      request: { query: RSVP_NO, variables: { concertId: CONCERT_ID, userId: USER_ID } },
      result: () => { mutationCalled = true; return { data: { rsvpNo: { _id: CONCERT_ID, artists: 'Test Artist', no: [{ _id: USER_ID }] } } }; },
    },
  ];
  renderComponent(mocks);
  fireEvent.click(await screen.findByText('No'));
  await waitFor(() => expect(mutationCalled).toBe(true));
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="ConcertRSVP.test"
```

Expected: FAIL — current component has wrong structure and no toggle logic.

- [ ] **Step 3: Write the CSS module**

Create `client/src/components/shared/ConcertRSVP/ConcertRSVP.module.css`:

```css
.row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.4rem;
  margin-bottom: 2.4rem;
}

.option {
  display: flex; flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1.4rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: 1.2rem;
  cursor: pointer;
  transition: all 0.15s;
  font-family: inherit;
}
.option:hover {
  border-color: var(--border-hi);
  transform: translateY(-1px);
}

.optionIcon {
  width: 5.6rem; height: 5.6rem;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--bg-raised);
  border: 1px solid var(--border-mid);
  color: var(--text-secondary);
  transition: all 0.15s;
}
.optionIcon svg { width: 2.6rem; height: 2.6rem; stroke-width: 2.4; }

.optionBody {
  display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
}
.optionLabel {
  font-family: var(--font-display);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-secondary);
  transition: color 0.15s;
}
.optionCount {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}

/* Active states */
.active_yes {
  background: var(--rsvp-yes-dim);
  border-color: var(--rsvp-yes);
}
.active_yes .optionIcon {
  background: var(--rsvp-yes-dim);
  border-color: var(--rsvp-yes);
  color: var(--rsvp-yes);
}
.active_yes .optionLabel { color: var(--rsvp-yes); }

.active_no {
  background: var(--rsvp-no-dim);
  border-color: var(--rsvp-no);
}
.active_no .optionIcon {
  background: var(--rsvp-no-dim);
  border-color: var(--rsvp-no);
  color: var(--rsvp-no);
}
.active_no .optionLabel { color: var(--rsvp-no); }

.active_maybe {
  background: var(--rsvp-maybe-dim);
  border-color: var(--rsvp-maybe);
}
.active_maybe .optionIcon {
  background: var(--rsvp-maybe-dim);
  border-color: var(--rsvp-maybe);
  color: var(--rsvp-maybe);
}
.active_maybe .optionLabel { color: var(--rsvp-maybe); }

@media (max-width: 720px) {
  .row { grid-template-columns: 1fr; }
  .option { flex-direction: row; padding: 1.4rem; }
  .optionIcon { width: 4.4rem; height: 4.4rem; }
  .optionIcon svg { width: 2rem; height: 2rem; }
  .optionBody { align-items: flex-start; flex: 1; }
}
```

- [ ] **Step 4: Rewrite the component**

Replace all contents of `client/src/components/shared/ConcertRSVP/index.js`:

```jsx
import { useContext } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Check } from '@styled-icons/feather/Check';
import { X } from '@styled-icons/feather/X';
import { HelpCircle } from '@styled-icons/feather/HelpCircle';
import { ConcertContext } from '../../../utils/GlobalState';
import { GET_CONCERT_BY_ID } from '../../../utils/queries';
import {
  RSVP_YES, CANCEL_RSVP_YES,
  RSVP_NO,  CANCEL_RSVP_NO,
  RSVP_MAYBE, CANCEL_RSVP_MAYBE,
} from '../../../utils/mutations';
import styles from './ConcertRSVP.module.css';

const ConcertRSVP = ({ concertId }) => {
  const { user } = useContext(ConcertContext);
  const userId = user?.me?._id;

  const { data, refetch } = useQuery(GET_CONCERT_BY_ID, { variables: { concertId } });

  const opts = { onCompleted: refetch };
  const [rsvpYes]         = useMutation(RSVP_YES,         opts);
  const [cancelRsvpYes]   = useMutation(CANCEL_RSVP_YES,  opts);
  const [rsvpNo]          = useMutation(RSVP_NO,          opts);
  const [cancelRsvpNo]    = useMutation(CANCEL_RSVP_NO,   opts);
  const [rsvpMaybe]       = useMutation(RSVP_MAYBE,       opts);
  const [cancelRsvpMaybe] = useMutation(CANCEL_RSVP_MAYBE, opts);

  const yes   = data?.concert?.yes   || [];
  const no    = data?.concert?.no    || [];
  const maybe = data?.concert?.maybe || [];

  const myRSVP = yes.some(u => u._id === userId)   ? 'yes'
               : no.some(u => u._id === userId)    ? 'no'
               : maybe.some(u => u._id === userId) ? 'maybe'
               : null;

  const handleClick = (type) => {
    const vars = { variables: { concertId, userId } };
    if (type === myRSVP) {
      if (type === 'yes')   cancelRsvpYes(vars);
      if (type === 'no')    cancelRsvpNo(vars);
      if (type === 'maybe') cancelRsvpMaybe(vars);
    } else {
      if (type === 'yes')   rsvpYes(vars);
      if (type === 'no')    rsvpNo(vars);
      if (type === 'maybe') rsvpMaybe(vars);
    }
  };

  return (
    <div className={styles.row}>
      <RSVPOption
        type="yes"
        icon={<Check />}
        label="Yes"
        count={yes.length}
        active={myRSVP === 'yes'}
        onClick={() => handleClick('yes')}
      />
      <RSVPOption
        type="maybe"
        icon={<HelpCircle />}
        label="Maybe"
        count={maybe.length}
        active={myRSVP === 'maybe'}
        onClick={() => handleClick('maybe')}
      />
      <RSVPOption
        type="no"
        icon={<X />}
        label="No"
        count={no.length}
        active={myRSVP === 'no'}
        onClick={() => handleClick('no')}
      />
    </div>
  );
};

const RSVPOption = ({ type, icon, label, count, active, onClick }) => (
  <button
    className={`${styles.option} ${active ? styles[`active_${type}`] : ''}`}
    onClick={onClick}
  >
    <div className={styles.optionIcon}>{icon}</div>
    <div className={styles.optionBody}>
      <div className={styles.optionLabel}>{label}</div>
      <div className={styles.optionCount}>{count} {count === 1 ? 'person' : 'people'}</div>
    </div>
  </button>
);

export default ConcertRSVP;
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="ConcertRSVP.test"
```

Expected: PASS — all 5 tests green.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/shared/ConcertRSVP/
git commit -m "feat: rewrite ConcertRSVP with three-card layout and toggle logic"
```

---

## Task 3: Show Page

**Files:**
- Rewrite: `client/src/pages/Show.jsx`
- Create: `client/src/pages/Show.module.css`
- Create: `client/src/pages/Show.test.js`

- [ ] **Step 1: Write the failing tests**

Create `client/src/pages/Show.test.js`:

```js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ConcertContext } from '../utils/GlobalState';

jest.mock('../utils/auth', () => ({
  loggedIn: () => false,
}));

import Show from './Show';

const mockContext = { user: { me: { _id: 'user123' } } };

const concert = {
  _id: 'c1',
  artists: 'Test Artist',
  venue: 'Test Venue',
  date: '2026-05-17T00:00:00.000Z',
  times: '8pm',
  address: '123 Main St',
  address2: null,
  phone: null,
  email: null,
  website: null,
  ticketLink: null,
};

const renderShow = (state = { concert }) =>
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <ConcertContext.Provider value={mockContext}>
        <MemoryRouter initialEntries={[{ pathname: '/show/test', state }]}>
          <Routes>
            <Route path="/show/:artists" element={<Show />} />
          </Routes>
        </MemoryRouter>
      </ConcertContext.Provider>
    </MockedProvider>
  );

test('renders "Show not found" when no concert in state', () => {
  renderShow(null);
  expect(screen.getByText('Show not found.')).toBeInTheDocument();
});

test('renders artist name in hero', () => {
  renderShow();
  expect(screen.getByRole('heading', { level: 1, name: /test artist/i })).toBeInTheDocument();
});

test('renders venue name', () => {
  renderShow();
  expect(screen.getByText('Test Venue')).toBeInTheDocument();
});

test('renders Back button', () => {
  renderShow();
  expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
});

test('renders address in details', () => {
  renderShow();
  expect(screen.getByText('123 Main St')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="Show.test"
```

Expected: FAIL — current Show.jsx crashes without concert state guard and has different structure.

- [ ] **Step 3: Write the CSS module**

Create `client/src/pages/Show.module.css`:

```css
.main {
  position: relative;
  z-index: 1;
  padding-top: var(--header-height);
  min-height: 100vh;
}
.page {
  max-width: var(--max-content);
  margin: 0 auto;
  padding: 3.2rem 4rem 8rem;
}

/* Back bar */
.backBar {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 0.8rem 0 2.4rem;
}
.backBtn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: 0.6rem;
  padding: 0.7rem 1.2rem 0.7rem 0.9rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: 0.8rem;
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: all 0.15s;
  cursor: pointer;
}
.backBtn:hover {
  color: var(--text-primary);
  border-color: var(--border-hi);
  transform: translateX(-2px);
}
.backBtn svg { width: 1.5rem; height: 1.5rem; }

.datePill {
  display: inline-flex; align-items: center; gap: 0.6rem;
  background: var(--accent-dim);
  border: 1px solid var(--accent-mid);
  color: var(--accent-hi);
  border-radius: 0.6rem;
  padding: 0.4rem 1rem;
  font-family: var(--font-mono);
  font-size: 1.05rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.dateDot {
  width: 0.55rem; height: 0.55rem; border-radius: 50%;
  background: var(--accent);
}

/* Hero */
.hero {
  padding: 2rem 0 4rem;
  border-bottom: 1px solid var(--border-dim);
}
.heroDate {
  font-family: var(--font-mono);
  font-size: 1.15rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 1.6rem;
}
.heroDate strong { color: var(--accent-hi); font-weight: 700; }

.heroArtists {
  font-family: var(--font-display);
  font-size: clamp(4rem, 8vw, 7.2rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1;
  color: var(--text-primary);
  margin-bottom: 2.4rem;
}

.heroVenue {
  display: inline-flex;
  align-items: baseline;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 1.3rem;
  color: var(--text-secondary);
}
.heroVenueAt {
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 1.05rem;
}
.heroVenueName {
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-decoration: none;
  transition: color 0.15s;
}
.heroVenueName:hover { color: var(--accent-hi); }
.heroVenueExt {
  width: 1.3rem; height: 1.3rem;
  display: inline-block;
  vertical-align: -0.15rem;
  margin-left: 0.4rem;
  opacity: 0.6;
}

/* Details grid */
.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4.8rem;
  padding: 4rem 0;
  border-bottom: 1px solid var(--border-dim);
}
.detailCol { display: flex; flex-direction: column; gap: 2rem; }

.sectionLabel {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.4rem;
}

.detailRow {
  display: flex; align-items: flex-start; gap: 1.2rem;
  padding: 0.6rem 0;
}
.detailRowIcon {
  flex-shrink: 0;
  width: 2.4rem; height: 2.4rem;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 0.6rem;
  margin-top: 0.2rem;
}
.detailRowIcon svg { width: 1.4rem; height: 1.4rem; }
.detailRowBody { flex: 1; min-width: 0; }
.detailRowLabel {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-bottom: 0.2rem;
}
.detailRowValue {
  font-family: var(--font-body);
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.4;
}
.detailRowValue a {
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-mid);
  transition: color 0.15s, border-color 0.15s;
  text-decoration: none;
}
.detailRowValue a:hover {
  color: var(--accent-hi);
  border-color: var(--accent);
}
.detailRowSub {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-top: 0.2rem;
}

/* Actions */
.actions {
  padding: 4rem 0;
  border-bottom: 1px solid var(--border-dim);
}
.actionsRow {
  display: flex; flex-wrap: wrap; gap: 1rem;
}
.action {
  display: inline-flex; align-items: center; gap: 0.8rem;
  padding: 1rem 1.6rem;
  border-radius: 0.8rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-decoration: none;
  transition: all 0.15s;
}
.action:hover {
  border-color: var(--border-hi);
  background: var(--bg-raised);
  transform: translateY(-1px);
}
.action svg { width: 1.6rem; height: 1.6rem; }

.actionPrimary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--bg-void);
  font-weight: 700;
}
.actionPrimary:hover {
  background: var(--accent-hi);
  border-color: var(--accent-hi);
  color: var(--bg-void);
}

/* RSVP block */
.rsvpBlock { padding: 4rem 0 0; }
.rsvpHeading {
  font-family: var(--font-display);
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-bottom: 0.6rem;
}
.rsvpSub {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 2.4rem;
}

.empty {
  padding: 8rem 2rem;
  text-align: center;
  font-family: var(--font-mono);
  color: var(--text-muted);
}

@media (max-width: 720px) {
  .page { padding: 2rem 1.6rem 6rem; }
  .heroArtists { font-size: clamp(3.2rem, 9vw, 5rem); }
  .heroVenueName { font-size: 1.7rem; }
  .details { grid-template-columns: 1fr; gap: 2.8rem; padding: 2.8rem 0; }
  .actions { padding: 2.8rem 0; }
}
```

- [ ] **Step 4: Rewrite Show.jsx**

Replace all contents of `client/src/pages/Show.jsx`:

```jsx
import { useLocation, useNavigate } from 'react-router-dom';
import Auth from '../utils/auth';
import { formatConcertDate } from '../utils/helpers';
import { ArrowLeft } from '@styled-icons/feather/ArrowLeft';
import { ExternalLink } from '@styled-icons/feather/ExternalLink';
import { Clock } from '@styled-icons/feather/Clock';
import { MapPin } from '@styled-icons/feather/MapPin';
import { Phone } from '@styled-icons/feather/Phone';
import { Mail } from '@styled-icons/feather/Mail';
import { Tag as TicketIcon } from '@styled-icons/feather/Tag';
import { Navigation as NavIcon } from '@styled-icons/feather/Navigation';
import ConcertRSVP from '../components/shared/ConcertRSVP';
import DisabledConcertRSVP from '../components/DisabledConcertRSVP';
import styles from './Show.module.css';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

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

  const googleMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(concert.venue + ' ' + (concert.address || ''))}`;
  const wazeMaps   = `https://waze.com/ul?q=${encodeURIComponent(concert.venue)}&navigate=yes`;

  const d = new Date(concert.date);
  const today = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();
  const dayLabel = sameDay(d, today) ? 'Today'
                 : sameDay(d, tomorrow) ? 'Tomorrow'
                 : DAYS[d.getDay()];

  return (
    <main className={styles.main}>
      <div className={`${styles.page} fade-up`}>

        <div className={styles.backBar}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft /> Back
          </button>
          <span className={styles.datePill}>
            <span className={styles.dateDot} />
            {dayLabel}
          </span>
        </div>

        <section className={styles.hero}>
          <div className={styles.heroDate}>
            <strong>{dayLabel}</strong> · {formatConcertDate(concert.date)}
          </div>
          <h1 className={styles.heroArtists}>{concert.artists}</h1>
          {concert.venue && (
            <div className={styles.heroVenue}>
              <span className={styles.heroVenueAt}>at</span>
              {concert.website ? (
                <a
                  href={concert.website}
                  className={styles.heroVenueName}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {concert.venue}
                  <ExternalLink className={styles.heroVenueExt} />
                </a>
              ) : (
                <span className={styles.heroVenueName}>{concert.venue}</span>
              )}
            </div>
          )}
        </section>

        <section className={styles.details}>
          <div className={styles.detailCol}>
            {concert.times && (
              <>
                <div className={styles.sectionLabel}>When</div>
                <DetailRow icon={<Clock />} label="Showtime">{concert.times}</DetailRow>
              </>
            )}
            {concert.address && (
              <>
                <div className={styles.sectionLabel} style={{ marginTop: '1.2rem' }}>Where</div>
                <DetailRow icon={<MapPin />} label="Address" sub={concert.address2}>
                  {concert.address}
                </DetailRow>
              </>
            )}
          </div>
          <div className={styles.detailCol}>
            {(concert.phone || concert.email) && (
              <div className={styles.sectionLabel}>Contact</div>
            )}
            {concert.phone && (
              <DetailRow icon={<Phone />} label="Phone">
                <a href={`tel:${concert.phone}`}>{concert.phone}</a>
              </DetailRow>
            )}
            {concert.email && (
              <DetailRow icon={<Mail />} label="Email">
                <a href={`mailto:${concert.email}`}>{concert.email}</a>
              </DetailRow>
            )}
          </div>
        </section>

        <section className={styles.actions}>
          <div className={styles.sectionLabel} style={{ marginBottom: '1.4rem' }}>Get there</div>
          <div className={styles.actionsRow}>
            {concert.ticketLink && (
              <a href={concert.ticketLink} className={`${styles.action} ${styles.actionPrimary}`} target="_blank" rel="noopener noreferrer">
                <TicketIcon /> Get Tickets
              </a>
            )}
            {concert.venue && (
              <>
                <a href={googleMaps} className={styles.action} target="_blank" rel="noopener noreferrer">
                  <MapPin /> Google Maps
                </a>
                <a href={wazeMaps} className={styles.action} target="_blank" rel="noopener noreferrer">
                  <NavIcon /> Waze
                </a>
              </>
            )}
            {concert.phone && (
              <a href={`tel:${concert.phone}`} className={styles.action}>
                <Phone /> Call venue
              </a>
            )}
          </div>
        </section>

        <section className={styles.rsvpBlock}>
          <h2 className={styles.rsvpHeading}>
            {loggedIn ? 'Are you going?' : "Who's going"}
          </h2>
          <div className={styles.rsvpSub}>
            {loggedIn ? 'Your friends will see your response' : 'Log in to RSVP and see your friends'}
          </div>
          {loggedIn ? (
            <ConcertRSVP concertId={concert._id} />
          ) : (
            <DisabledConcertRSVP concertId={concert._id} />
          )}
        </section>

      </div>
    </main>
  );
};

const DetailRow = ({ icon, label, children, sub }) => (
  <div className={styles.detailRow}>
    <div className={styles.detailRowIcon}>{icon}</div>
    <div className={styles.detailRowBody}>
      <div className={styles.detailRowLabel}>{label}</div>
      <div className={styles.detailRowValue}>{children}</div>
      {sub && <div className={styles.detailRowSub}>{sub}</div>}
    </div>
  </div>
);

export default Show;
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="Show.test"
```

Expected: PASS — all 5 tests green.

- [ ] **Step 6: Run the full test suite**

```bash
cd client && npm test -- --watchAll=false
```

Expected: all tests pass, no regressions.

- [ ] **Step 7: Commit**

```bash
git add client/src/pages/Show.jsx client/src/pages/Show.module.css client/src/pages/Show.test.js
git commit -m "feat: rewrite Show page with new layout and RSVP block"
```
