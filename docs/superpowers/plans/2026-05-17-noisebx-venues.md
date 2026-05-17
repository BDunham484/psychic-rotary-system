# NoiseBX Venues Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Venues handoff — a live-filter All Venues page at `/venues` and a restyled Venue Detail page at `/venue/:venueName`.

**Architecture:** Replace VenueSearch's three-component structure (VenueSearch + VenueSearchInput + VenueList) with a single self-contained component; replace ShowsByVenue's thin delegating wrapper with a full hero + concert-list component. Both pull from existing GraphQL queries. Wire the Header drawer item to navigate to `/venues` instead of toggling home-page state.

**Tech Stack:** React 18, Apollo Client, React Router v6, CSS Modules, @styled-icons/feather

---

## Pre-work: Schema Verification

Before any code, run the handoff adaptation checklist from memory.

- [ ] **Step 1: Confirm `GET_ALL_VENUES` returns `allVenues` (string array)**

  Open `client/src/utils/queries.js` around line 320. Expect:
  ```graphql
  query Query {
    allVenues
  }
  ```
  `allVenues` is a `[String]`. No object fields needed — just names.

- [ ] **Step 2: Confirm `GET_CONCERTS_BY_VENUE` has all fields the new ShowsByVenue reads**

  The new component reads: `_id`, `customId`, `artists`, `date`, `times`. Verify all five are in the query. (`customId` is the `/show/` route param, `times` is optional display.)

  Open `client/src/utils/queries.js` around line 326 and confirm.

- [ ] **Step 3: Confirm `@styled-icons/feather` is installed**

  ```bash
  grep "feather" client/package.json
  ```
  Expected: `"@styled-icons/feather": "..."` in dependencies. The handoff uses `Search`, `X`, `ArrowRight`, `ArrowLeft` from feather.

---

## File Map

| Status | Path | Action |
|--------|------|--------|
| Rewrite | `client/src/components/VenueSearch/VenueSearch.jsx` | Full rewrite — self-contained, live filter |
| Rewrite | `client/src/components/VenueSearch/VenueSearch.module.css` | Full restyle — hero + grid + cards |
| Rewrite | `client/src/components/ShowsByVenue/ShowsByVenue.jsx` | Full rewrite — hero + concert list |
| Create | `client/src/components/ShowsByVenue/ShowsByVenue.module.css` | New file |
| Modify | `client/src/App.js` | Add `/venues` route |
| Modify | `client/src/components/Header/index.js` | Link "Venue search" item to `/venues` |
| Create | `client/src/__tests__/VenueSearch.test.jsx` | New test file |
| Create | `client/src/__tests__/ShowsByVenue.test.jsx` | New test file |
| Delete | `client/src/components/VenueSearch/VenueSearchInput.jsx` | Folded into VenueSearch.jsx |
| Delete | `client/src/components/VenueSearch/VenueList.jsx` | Folded into VenueSearch.jsx |
| Delete | `client/src/components/VenueShowList/VenueShowList.jsx` | Folded into ShowsByVenue.jsx |

---

## Task 1: Write Failing VenueSearch Tests

**Files:**
- Create: `client/src/__tests__/VenueSearch.test.jsx`

- [ ] **Step 1: Create the test file**

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import VenueSearch from '../components/VenueSearch/VenueSearch';
import { GET_ALL_VENUES } from '../utils/queries';

const VENUES_MOCK = {
  request: { query: GET_ALL_VENUES },
  result: { data: { allVenues: ['Emo\'s', 'Parish', 'The Paramount', 'ACL Live'] } },
};

const LOADING_MOCK = {
  request: { query: GET_ALL_VENUES },
  delay: Infinity,
};

const renderVenueSearch = (mocks = [VENUES_MOCK]) =>
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <MemoryRouter>
        <VenueSearch />
      </MemoryRouter>
    </MockedProvider>
  );

describe('VenueSearch', () => {
  it('shows spinner while loading', () => {
    renderVenueSearch([LOADING_MOCK]);
    expect(document.querySelector('.spinnerWrap') || screen.getByRole('status', { hidden: true })).toBeTruthy();
  });

  it('renders venue cards after data loads', async () => {
    renderVenueSearch();
    expect(await screen.findByText("Emo's")).toBeInTheDocument();
    expect(screen.getByText('Parish')).toBeInTheDocument();
  });

  it('shows total venue count', async () => {
    renderVenueSearch();
    await screen.findByText("Emo's");
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('filters venues as user types', async () => {
    renderVenueSearch();
    await screen.findByText("Emo's");
    fireEvent.change(screen.getByPlaceholderText(/search by venue name/i), {
      target: { value: 'par' },
    });
    expect(screen.getByText('Parish')).toBeInTheDocument();
    expect(screen.queryByText("Emo's")).not.toBeInTheDocument();
  });

  it('shows empty state when query has no matches', async () => {
    renderVenueSearch();
    await screen.findByText("Emo's");
    fireEvent.change(screen.getByPlaceholderText(/search by venue name/i), {
      target: { value: 'zzz' },
    });
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });

  it('clears search when X button clicked', async () => {
    renderVenueSearch();
    await screen.findByText("Emo's");
    const input = screen.getByPlaceholderText(/search by venue name/i);
    fireEvent.change(input, { target: { value: 'par' } });
    fireEvent.click(screen.getByLabelText('Clear search'));
    expect(screen.getByText("Emo's")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="VenueSearch.test"
```

Expected: All tests fail (VenueSearch hasn't been rewritten yet).

---

## Task 2: Write Failing ShowsByVenue Tests

**Files:**
- Create: `client/src/__tests__/ShowsByVenue.test.jsx`

- [ ] **Step 1: Create the test file**

```jsx
import { render, screen } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ShowsByVenue from '../components/ShowsByVenue/ShowsByVenue';
import { GET_CONCERTS_BY_VENUE } from '../utils/queries';

const MOCK_CONCERTS = [
  {
    _id: '1',
    customId: 'emosshow1',
    artists: 'The Strokes',
    date: '2026-06-15T00:00:00.000Z',
    times: '8:00 PM',
    venue: "Emo's",
  },
  {
    _id: '2',
    customId: 'emosshow2',
    artists: 'Spoon',
    date: '2026-07-04T00:00:00.000Z',
    times: '9:00 PM',
    venue: "Emo's",
  },
];

const makeVenueMock = (venue, concerts) => ({
  request: { query: GET_CONCERTS_BY_VENUE, variables: { venue } },
  result: { data: { concertsByVenue: concerts } },
});

const renderShowsByVenue = (venueName = "Emo's", mocks) =>
  render(
    <MockedProvider mocks={mocks || [makeVenueMock(venueName, MOCK_CONCERTS)]} addTypename={false}>
      <MemoryRouter initialEntries={[{ pathname: `/venue/${encodeURIComponent(venueName)}`, state: { venueName } }]}>
        <Routes>
          <Route path="/venue/:venueName" element={<ShowsByVenue />} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>
  );

describe('ShowsByVenue', () => {
  it('renders venue name in hero', async () => {
    renderShowsByVenue();
    expect(await screen.findByRole('heading', { name: /Emo's/i })).toBeInTheDocument();
  });

  it('renders concert artist names', async () => {
    renderShowsByVenue();
    expect(await screen.findByText('The Strokes')).toBeInTheDocument();
    expect(screen.getByText('Spoon')).toBeInTheDocument();
  });

  it('shows upcoming show count in hero', async () => {
    renderShowsByVenue();
    await screen.findByText('The Strokes');
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows empty state when no concerts', async () => {
    renderShowsByVenue("Emo's", [makeVenueMock("Emo's", [])]);
    expect(await screen.findByText('No upcoming shows')).toBeInTheDocument();
  });

  it('falls back to URL param when no location state', async () => {
    const venue = "Emo's";
    render(
      <MockedProvider mocks={[makeVenueMock(venue, MOCK_CONCERTS)]} addTypename={false}>
        <MemoryRouter initialEntries={[`/venue/${encodeURIComponent(venue)}`]}>
          <Routes>
            <Route path="/venue/:venueName" element={<ShowsByVenue />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );
    expect(await screen.findByText('The Strokes')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="ShowsByVenue.test"
```

Expected: All tests fail (ShowsByVenue hasn't been rewritten yet).

---

## Task 3: Rewrite VenueSearch Component

**Files:**
- Modify: `client/src/components/VenueSearch/VenueSearch.jsx` (full rewrite)
- Modify: `client/src/components/VenueSearch/VenueSearch.module.css` (full restyle)

- [ ] **Step 1: Rewrite `VenueSearch.jsx`**

Replace the entire contents of `client/src/components/VenueSearch/VenueSearch.jsx` with:

```jsx
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ALL_VENUES } from '../../utils/queries';
import { Search } from '@styled-icons/feather/Search';
import { X } from '@styled-icons/feather/X';
import { ArrowRight } from '@styled-icons/feather/ArrowRight';
import Spinner from '../shared/Spinner';
import ScrollButton from '../shared/ScrollButton';
import styles from './VenueSearch.module.css';

function venueInitials(name) {
  const words = name.replace(/^(The|A)\s+/i, '').split(/[\s&\/]+/).filter(Boolean);
  const letters = words.map(w => w.replace(/[^A-Za-z0-9]/g, '').charAt(0)).filter(Boolean);
  if (!letters.length) return '?';
  if (letters.length === 1) return letters[0].toUpperCase();
  return (letters[0] + letters[1]).toUpperCase();
}

const HighlightedName = ({ name, query }) => {
  if (!query) return name;
  const idx = name.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <span className={styles.match}>{name.slice(idx, idx + query.length)}</span>
      {name.slice(idx + query.length)}
    </>
  );
};

const VenueSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const { loading, data } = useQuery(GET_ALL_VENUES);

  const venues = useMemo(() => {
    const raw = (data?.allVenues || []).filter(Boolean);
    return [...raw].sort((a, b) =>
      a.replace(/^The\s+/i, '').localeCompare(b.replace(/^The\s+/i, ''))
    );
  }, [data]);

  const filtered = useMemo(() => {
    if (!query.trim()) return venues;
    return venues.filter(v => v.toLowerCase().includes(query.toLowerCase()));
  }, [venues, query]);

  if (loading) return <div className={styles.spinnerWrap}><Spinner /></div>;

  return (
    <main className={styles.main}>
      <div className={`${styles.page} fade-up`}>

        <div className={styles.hero}>
          <div className={styles.eyebrow}>All venues</div>
          <h1 className={styles.title}>Venues in Austin</h1>
          <p className={styles.sub}>
            Browse every venue we track. Tap a venue to see upcoming shows.
          </p>
        </div>

        <div className={styles.searchRow}>
          <form className={styles.searchForm} onSubmit={e => e.preventDefault()}>
            <Search className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Search by venue name…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => setQuery('')}
                aria-label="Clear search"
              ><X /></button>
            )}
          </form>
        </div>

        <div className={styles.count}>
          <strong>{filtered.length}</strong> {filtered.length === 1 ? 'venue' : 'venues'}
          {query && <> matching "{query}"</>}
        </div>

        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>∅</div>
            <div className={styles.emptyTitle}>No matches</div>
            <div className={styles.emptySub}>Try a different search term.</div>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(name => (
              <a
                key={name}
                className={styles.card}
                href={`/venue/${encodeURIComponent(name)}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/venue/${encodeURIComponent(name)}`, { state: { venueName: name } });
                }}
              >
                <div className={styles.cardGlyph}>{venueInitials(name)}</div>
                <div className={styles.cardName}>
                  <HighlightedName name={name} query={query} />
                </div>
                <div className={styles.cardArrow}><ArrowRight /></div>
              </a>
            ))}
          </div>
        )}
      </div>

      <ScrollButton />
    </main>
  );
};

export default VenueSearch;
```

- [ ] **Step 2: Restyle `VenueSearch.module.css`**

Replace the entire contents of `client/src/components/VenueSearch/VenueSearch.module.css` with:

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

.spinnerWrap {
  min-height: 60vh;
  display: flex; align-items: center; justify-content: center;
}

/* Hero */
.hero {
  padding: 1.6rem 0 3.2rem;
  border-bottom: 1px solid var(--border-dim);
}
.eyebrow {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1.2rem;
}
.title {
  font-family: var(--font-display);
  font-size: clamp(3.6rem, 6vw, 5.6rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 1.4rem;
}
.sub {
  font-family: var(--font-body);
  font-size: 1.5rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 56rem;
}

/* Search */
.searchRow { padding: 2.8rem 0 2rem; }
.searchForm {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.4rem 0.4rem 0.4rem 1.8rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: 1rem;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.searchForm:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px oklch(62% 0.16 275 / 0.12);
}
.searchIcon { color: var(--text-muted); width: 1.8rem; height: 1.8rem; }
.searchInput {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 1.6rem;
  padding: 1.1rem 0;
  line-height: 1.2;
}
.searchInput::placeholder { color: var(--text-muted); }
.searchClear {
  background: none;
  border: none;
  color: var(--text-muted);
  width: 3.4rem; height: 3.4rem;
  display: flex; align-items: center; justify-content: center;
  border-radius: 0.6rem;
  cursor: pointer;
  transition: all 0.15s;
}
.searchClear:hover { color: var(--text-primary); background: var(--bg-raised); }
.searchClear svg { width: 1.6rem; height: 1.6rem; }

/* Result count */
.count {
  font-family: var(--font-mono);
  font-size: 1.15rem;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  margin-bottom: 1.6rem;
}
.count strong {
  color: var(--accent-hi);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/* Grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28rem, 1fr));
  gap: 1.2rem;
}
.card {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding: 1.4rem 1.6rem;
  border-radius: 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  cursor: pointer;
  transition: all 0.15s;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
}
.card:hover {
  background: var(--bg-raised);
  border-color: var(--border-hi);
  transform: translateY(-1px);
}
.card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--accent);
  opacity: 0;
  transition: opacity 0.15s;
}
.card:hover::before { opacity: 1; }

.cardGlyph {
  width: 4.4rem; height: 4.4rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, oklch(62% 0.16 275 / 0.18), oklch(72% 0.16 320 / 0.18));
  border: 1px solid var(--accent-mid);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-hi);
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}
.cardName {
  flex: 1; min-width: 0;
  font-family: var(--font-display);
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  line-height: 1.2;
  transition: color 0.15s;
}
.card:hover .cardName { color: var(--accent-hi); }

.cardArrow {
  width: 2.4rem; height: 2.4rem;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  transition: transform 0.15s, color 0.15s;
}
.card:hover .cardArrow { color: var(--accent-hi); transform: translateX(3px); }
.cardArrow svg { width: 1.6rem; height: 1.6rem; }

.match { color: var(--accent-hi); }

/* Empty state */
.empty {
  padding: 6rem 2rem;
  text-align: center;
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
  .page { padding: 2rem 1.6rem 6rem; }
  .title { font-size: clamp(2.8rem, 8vw, 3.6rem); }
  .grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Run VenueSearch tests — they should now pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="VenueSearch.test"
```

Expected: All 5 tests pass.

---

## Task 4: Rewrite ShowsByVenue Component

**Files:**
- Modify: `client/src/components/ShowsByVenue/ShowsByVenue.jsx` (full rewrite)
- Create: `client/src/components/ShowsByVenue/ShowsByVenue.module.css`

- [ ] **Step 1: Rewrite `ShowsByVenue.jsx`**

Replace the entire contents of `client/src/components/ShowsByVenue/ShowsByVenue.jsx` with:

```jsx
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CONCERTS_BY_VENUE } from '../../utils/queries';
import { ArrowLeft } from '@styled-icons/feather/ArrowLeft';
import { ArrowRight } from '@styled-icons/feather/ArrowRight';
import Spinner from '../shared/Spinner';
import ScrollButton from '../shared/ScrollButton';
import styles from './ShowsByVenue.module.css';

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_SHORT   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function venueInitials(name) {
  const words = (name || '').replace(/^(The|A)\s+/i, '').split(/[\s&\/]+/).filter(Boolean);
  const letters = words.map(w => w.replace(/[^A-Za-z0-9]/g, '').charAt(0)).filter(Boolean);
  if (!letters.length) return '?';
  if (letters.length === 1) return letters[0].toUpperCase();
  return (letters[0] + letters[1]).toUpperCase();
}

const ShowsByVenue = () => {
  const { state } = useLocation();
  const { venueName: paramName } = useParams();
  const navigate = useNavigate();

  const venueName = state?.venueName || decodeURIComponent(paramName || '');

  const { loading, data } = useQuery(GET_CONCERTS_BY_VENUE, {
    variables: { venue: venueName },
  });

  const concerts = data?.concertsByVenue || [];

  return (
    <main className={styles.main}>
      <div className={`${styles.page} fade-up`}>
        <div className={styles.backBar}>
          <button className={styles.backBtn} onClick={() => navigate('/venues')}>
            <ArrowLeft /> All venues
          </button>
        </div>

        <div className={styles.hero}>
          <div className={styles.glyph}>{venueInitials(venueName)}</div>
          <div className={styles.info}>
            <div className={styles.eyebrow}>Venue · Austin, TX</div>
            <h1 className={styles.name}>{venueName}</h1>
            <div className={styles.stats}>
              <div>
                <span className={styles.statVal}>{concerts.length}</span>
                <span className={styles.statLabel}>Upcoming shows</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sectionBar}>
          <span className={styles.sectionTitle}>Upcoming at {venueName}</span>
        </div>

        {loading ? (
          <div className={styles.spinnerWrap}><Spinner /></div>
        ) : concerts.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>♪</div>
            <div className={styles.emptyTitle}>No upcoming shows</div>
            <div className={styles.emptySub}>Check back soon.</div>
          </div>
        ) : (
          <div className={styles.list}>
            {concerts.map(c => {
              const d = new Date(c.date);
              return (
                <a
                  key={c._id}
                  className={styles.row}
                  href={`/show/${c.customId}`}
                  onClick={(e) => { e.preventDefault(); navigate(`/show/${c.customId}`, { state: { concert: c } }); }}
                >
                  <div className={styles.date}>
                    <div className={styles.dateDay}>{DAYS_SHORT[d.getDay()]}</div>
                    <div className={styles.dateNum}>{d.getDate()}</div>
                    <div className={styles.dateMonth}>{MONTHS_SHORT[d.getMonth()]}</div>
                  </div>
                  <div className={styles.content}>
                    <div className={styles.artists}>{c.artists}</div>
                    {c.times && <div className={styles.meta}>{c.times}</div>}
                  </div>
                  <div className={styles.arrow}><ArrowRight /></div>
                </a>
              );
            })}
          </div>
        )}
      </div>
      <ScrollButton />
    </main>
  );
};

export default ShowsByVenue;
```

- [ ] **Step 2: Create `ShowsByVenue.module.css`**

Create `client/src/components/ShowsByVenue/ShowsByVenue.module.css` with:

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

.backBar { display: flex; align-items: center; padding: 0.8rem 0 2.4rem; }
.backBtn {
  display: inline-flex; align-items: center; gap: 0.6rem;
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
  cursor: pointer;
  transition: all 0.15s;
}
.backBtn:hover {
  color: var(--text-primary);
  border-color: var(--border-hi);
  transform: translateX(-2px);
}
.backBtn svg { width: 1.5rem; height: 1.5rem; }

/* Hero */
.hero {
  display: flex;
  align-items: center;
  gap: 2.4rem;
  padding: 1.6rem 0 3.2rem;
  border-bottom: 1px solid var(--border-dim);
}
.glyph {
  width: 9rem; height: 9rem;
  border-radius: 1.8rem;
  background: linear-gradient(135deg, oklch(62% 0.16 275 / 0.22), oklch(72% 0.16 320 / 0.22));
  border: 1px solid var(--accent-mid);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--accent-hi);
  flex-shrink: 0;
  box-shadow:
    0 0 32px oklch(62% 0.16 275 / 0.18),
    inset 0 1px 0 oklch(72% 0.16 275 / 0.2);
}
.info { flex: 1; min-width: 0; }
.eyebrow {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.8rem;
}
.name {
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 5vw, 4.8rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1;
  margin-bottom: 1.2rem;
  word-break: break-word;
}
.stats {
  display: flex; gap: 2.4rem; align-items: baseline;
  font-family: var(--font-mono);
  font-size: 1.2rem;
}
.statVal {
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--accent-hi);
  font-variant-numeric: tabular-nums;
  margin-right: 0.4rem;
}
.statLabel {
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text-muted);
  font-size: 1.05rem;
}

.sectionBar {
  display: flex; align-items: center; justify-content: space-between;
  margin: 3.2rem 0 1.6rem;
}
.sectionTitle {
  font-family: var(--font-mono);
  font-size: 1.15rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* Concert rows */
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
  cursor: pointer;
}
.row:hover { background: var(--bg-surface); border-color: var(--border-dim); }
.list .row:not(:hover):not(:first-child)::before {
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
  font-family: var(--font-mono);
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-top: 0.4rem;
  letter-spacing: 0.02em;
}
.arrow {
  width: 2.4rem; height: 2.4rem;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  opacity: 0;
  transition: opacity 0.15s, color 0.15s, transform 0.15s;
}
.row:hover .arrow { opacity: 1; color: var(--accent-hi); transform: translateX(3px); }
.arrow svg { width: 1.5rem; height: 1.5rem; }

.spinnerWrap {
  padding: 6rem 0;
  display: flex; align-items: center; justify-content: center;
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
.emptyTitle {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
}
.emptySub { font-size: 1.5rem; color: var(--text-muted); }

@media (max-width: 720px) {
  .page { padding: 2rem 1.6rem 6rem; }
  .hero { flex-direction: column; align-items: flex-start; gap: 1.6rem; }
  .glyph { width: 7rem; height: 7rem; font-size: 2.2rem; }
  .row { grid-template-columns: 6.4rem 1fr; gap: 1.2rem; padding: 1.2rem; }
  .dateNum { font-size: 2.4rem; }
  .arrow { opacity: 1; grid-column: 2; justify-self: flex-end; }
}
```

- [ ] **Step 3: Run ShowsByVenue tests — they should now pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="ShowsByVenue.test"
```

Expected: All 5 tests pass.

---

## Task 5: Wire App.js Routing and Header Link

**Files:**
- Modify: `client/src/App.js`
- Modify: `client/src/components/Header/index.js`

- [ ] **Step 1: Add `/venues` route in App.js**

In `client/src/App.js`, add the import after the existing `ShowsByVenue` import:

```js
import VenueSearch from './components/VenueSearch/VenueSearch';
```

Then add a route inside `<Routes>`, before the catch-all `*`:

```jsx
<Route path="/venues" element={<VenueSearch />} />
```

The routes section should look like:
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/profile">
    <Route path=":username" element={<Profile />} />
    <Route path="" element={<Profile />} />
  </Route>
  <Route path="/show/:artists" element={<Show />} />
  <Route path="/venue/:venueName" element={<ShowsByVenue />} />
  <Route path="/venues" element={<VenueSearch />} />
  <Route path="*" element={<NoMatch />} />
</Routes>
```

- [ ] **Step 2: Update Header "Venue search" item to link to `/venues`**

In `client/src/components/Header/index.js`, replace the "Venue search" button:

```jsx
// BEFORE:
<button
  className={styles.drawerItem}
  onClick={() => { setSortOrSearch('search'); closeMenu(); }}
>
  Venue search
</button>

// AFTER:
<Link
  to="/venues"
  onClick={closeMenu}
  className={`${styles.drawerItem} ${location.pathname === '/venues' ? styles.drawerItemActive : ''}`}
>
  Venue search
</Link>
```

Note: `setSortOrSearch` is no longer called here since `/venues` is its own page. The `Link` import is already at the top of the file.

- [ ] **Step 3: Run full test suite to confirm nothing regressed**

```bash
cd client && npm test -- --watchAll=false
```

Expected: All tests pass (55 pre-existing + 10 new = 65 total).

---

## Task 6: Delete Deprecated Files

**Files:**
- Delete: `client/src/components/VenueSearch/VenueSearchInput.jsx`
- Delete: `client/src/components/VenueSearch/VenueList.jsx`
- Delete: `client/src/components/VenueShowList/VenueShowList.jsx`

- [ ] **Step 1: Delete the three deprecated files**

```bash
rm client/src/components/VenueSearch/VenueSearchInput.jsx
rm client/src/components/VenueSearch/VenueList.jsx
rm client/src/components/VenueShowList/VenueShowList.jsx
```

- [ ] **Step 2: Confirm no remaining imports**

```bash
grep -r "VenueSearchInput\|VenueList\|VenueShowList" client/src/
```

Expected: no output (no remaining references).

- [ ] **Step 3: Run tests once more to confirm nothing broke**

```bash
cd client && npm test -- --watchAll=false
```

Expected: All tests still pass.

---

## Task 7: Commit

- [ ] **Step 1: Stage and commit**

```bash
git add \
  client/src/components/VenueSearch/VenueSearch.jsx \
  client/src/components/VenueSearch/VenueSearch.module.css \
  client/src/components/ShowsByVenue/ShowsByVenue.jsx \
  client/src/components/ShowsByVenue/ShowsByVenue.module.css \
  client/src/App.js \
  client/src/components/Header/index.js \
  client/src/__tests__/VenueSearch.test.jsx \
  client/src/__tests__/ShowsByVenue.test.jsx
git rm \
  client/src/components/VenueSearch/VenueSearchInput.jsx \
  client/src/components/VenueSearch/VenueList.jsx \
  client/src/components/VenueShowList/VenueShowList.jsx
git commit -m "feat: implement venues handoff — live-filter all-venues page and restyled venue detail"
```

---

## Self-Review Against Spec

**Spec coverage:**

| Requirement | Task |
|---|---|
| All Venues page at `/venues` with live filter | Task 3 + Task 5 |
| Hero with eyebrow, title, subtitle | Task 3 |
| Indigo-gradient glyph cards | Task 3 |
| Matched substring highlighting | Task 3 |
| Venue count display | Task 3 |
| Empty / no-match state | Task 3 |
| ShowsByVenue hero with glyph, name, show count | Task 4 |
| Concert list with date-stack rows | Task 4 |
| Back button → `/venues` | Task 4 |
| URL param fallback for direct navigation | Task 4 |
| `/venues` route in App.js | Task 5 |
| Header drawer links to `/venues` | Task 5 |
| Delete VenueSearchInput, VenueList, VenueShowList | Task 6 |
| Tests for both components | Tasks 1–2 |

**Gaps:** None.

**Placeholder scan:** No TBDs, TODOs, or vague "handle X" instructions found. All steps include full code.

**Type consistency:** `venueInitials()` used consistently in both Task 3 and Task 4 (both components define it locally — no shared import needed since each is self-contained per handoff). `styles.spinnerWrap`, `styles.card`, `styles.row`, etc. all match their CSS module definitions.
