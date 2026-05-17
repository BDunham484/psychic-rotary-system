# Noisebox Home Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing noisebox home page with a dark, editorial design: frosted-glass hamburger-drawer header, large date hero, always-visible sort bar, and editorial concert rows with aggregate RSVP attendance dots.

**Architecture:** Token-first approach — `tokens.css` defines all CSS custom properties and is imported globally. Each new component owns its styles via CSS Modules. Home.jsx is rewritten to compose DateNav + ControlBar + ConcertList directly, eliminating the optionsOpen toggle and the ConcertsVenueAZ/ConcertsArtistsAZ wrapper components.

**Tech Stack:** React 18, Apollo Client, CSS Modules, react-datepicker, date-fns, @styled-icons/boxicons-regular, @styled-icons/fluentui-system-filled, @styled-icons/bootstrap

**Spec:** `docs/superpowers/specs/2026-05-17-noisebox-home-design.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `client/src/tokens.css` | All CSS custom properties for the redesign |
| Modify | `client/src/index.css` | Import tokens; add dot-grid + fade-up; strip old globals |
| Modify | `client/public/index.html` | Replace Google Fonts with Space Grotesk + Space Mono + DM Sans |
| Rewrite | `client/src/components/Header/index.js` | Hamburger drawer header |
| Create | `client/src/components/Header/Header.module.css` | Header + drawer styles |
| Create | `client/src/components/DateNav/DateNav.jsx` | Date hero with prev/next + calendar |
| Create | `client/src/components/DateNav/DateNav.module.css` | DateNav styles |
| Create | `client/src/components/ControlBar/ControlBar.jsx` | Always-visible sort/search bar |
| Create | `client/src/components/ControlBar/ControlBar.module.css` | ControlBar styles |
| Modify | `client/src/utils/queries.js` | Add yes/maybe fields to all four sorted queries |
| Rewrite | `client/src/components/ConcertList/ConcertList.jsx` | Editorial rows + PlusMinus + attendance dots |
| Rewrite | `client/src/components/ConcertList/ConcertList.module.css` | Row styles |
| Rewrite | `client/src/pages/Home.jsx` | Compose DateNav + ControlBar + ConcertList |
| Create | `client/src/pages/Home.module.css` | Page wrapper styles |
| Rewrite | `client/src/components/shared/ScrollButton/index.js` | Restyle + useEffect listener fix |
| Create | `client/src/components/shared/ScrollButton/ScrollButton.module.css` | ScrollButton styles |

---

## Task 1: Feature branch

**Files:** none

- [ ] **Create the feature branch**

```bash
git checkout -b feat/noisebox-home
```

- [ ] **Verify you are on the branch**

```bash
git branch
```

Expected: `* feat/noisebox-home` is highlighted.

- [ ] **Add .superpowers to .gitignore if not already present**

Open `C:\Users\Bdunh\Repos\noisebx\psychic-rotary-system\.gitignore` and add `.superpowers/` if it is not already there.

- [ ] **Commit**

```bash
git add .gitignore
git commit -m "chore: start noisebox home redesign branch"
```

---

## Task 2: Design tokens

**Files:**
- Create: `client/src/tokens.css`
- Modify: `client/src/index.css` (first 35 lines — `:root` block and imports)

- [ ] **Create `client/src/tokens.css`**

```css
:root {
  /* Surfaces */
  --bg-void:    #0a0a0e;
  --bg-base:    #11111a;
  --bg-surface: #181822;
  --bg-raised:  #20202c;
  --bg-overlay: #2a2a38;

  /* Borders */
  --border-dim: rgba(160,150,255,0.07);
  --border-mid: rgba(160,150,255,0.13);
  --border-hi:  rgba(160,150,255,0.22);

  /* Text */
  --text-primary:   #eeebf7;
  --text-secondary: #9c97b8;
  --text-muted:     #5c5670;

  /* Accent */
  --accent:       oklch(62% 0.16 275);
  --accent-hi:    oklch(72% 0.16 275);
  --accent-dim:   oklch(62% 0.16 275 / 0.12);
  --accent-mid:   oklch(62% 0.16 275 / 0.28);

  /* RSVP semantic tokens */
  --rsvp-yes:        oklch(62% 0.14 145);
  --rsvp-yes-dim:    oklch(62% 0.14 145 / 0.12);
  --rsvp-no:         oklch(58% 0.14 22);
  --rsvp-no-dim:     oklch(58% 0.14 22 / 0.12);
  --rsvp-maybe:      oklch(75% 0.10 85);
  --rsvp-maybe-dim:  oklch(75% 0.10 85 / 0.14);

  /* Typography */
  --font-display: 'Space Grotesk', sans-serif;
  --font-mono:    'Space Mono', monospace;
  --font-body:    'DM Sans', sans-serif;

  /* Layout */
  --header-height: 7rem;
  --max-content:   84rem;
}
```

- [ ] **Add import + dot-grid + fade-up to `client/src/index.css`**

At the very top of `index.css` (before the `/* Table of Contents */` comment), add:

```css
@import './tokens.css';
```

Then find the `html, body` block and add these rules directly after it:

```css
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(160,150,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(160,150,255,0.025) 1px, transparent 1px);
  background-size: 4rem 4rem;
  pointer-events: none;
  z-index: 0;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.fade-up { animation: fade-up 0.3s ease both; }
```

- [ ] **Start the dev server and verify no CSS errors in the browser console**

```bash
npm run develop
```

Open `http://localhost:3002`. The page should load — existing styles still apply, tokens not yet in use.

- [ ] **Commit**

```bash
git add client/src/tokens.css client/src/index.css
git commit -m "feat: add design tokens and global animations"
```

---

## Task 3: Google Fonts

**Files:**
- Modify: `client/public/index.html`

- [ ] **Replace the existing Google Fonts `<link>` in `client/public/index.html`**

Find the existing fonts link (Kodchasan, Bungee Hairline, Montserrat) and replace it with:

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

- [ ] **Commit**

```bash
git add client/public/index.html
git commit -m "feat: update Google Fonts to Space Grotesk, Space Mono, DM Sans"
```

---

## Task 4: Header rewrite

**Files:**
- Rewrite: `client/src/components/Header/index.js`
- Create: `client/src/components/Header/Header.module.css`

The header replaces the flat nav with a hamburger button. All links live in a slide-in drawer. "Venue search" is a button (not a Link) that sets `sortOrSearch` to `'search'` inline.

- [ ] **Write `client/src/components/Header/Header.module.css`**

```css
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--header-height);
  background: rgba(10,10,14,0.82);
  backdrop-filter: blur(16px) saturate(140%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4rem;
  z-index: 100;
}
.header::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent 0%, oklch(62% 0.16 275 / 0.5) 25%, oklch(62% 0.16 275 / 0.5) 75%, transparent 100%);
}

.brand {
  display: flex; align-items: center; gap: 1.4rem;
  color: var(--text-primary);
  text-decoration: none;
}
.brandCube {
  width: 3.2rem; height: 3.2rem;
  border: 1px solid oklch(62% 0.16 275 / 0.5);
  border-radius: 0.6rem;
  background: oklch(62% 0.16 275 / 0.12);
  box-shadow: 0 0 18px 4px oklch(62% 0.16 275 / 0.22), inset 0 1px 0 oklch(62% 0.16 275 / 0.3);
  display: flex; align-items: center; justify-content: center;
  color: oklch(72% 0.16 275);
}
.brandCube svg { width: 1.8rem; height: 1.8rem; }
.brandName {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 0.28em;
}
.brandNameMobile { display: none; }

.hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  width: 4rem; height: 4rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: 0.8rem;
  cursor: pointer;
  padding: 0;
  transition: border-color 0.15s, background 0.15s;
}
.hamburger:hover { border-color: var(--border-hi); background: var(--bg-raised); }
.hamburger span {
  display: block;
  width: 1.7rem; height: 1.5px;
  background: var(--text-secondary);
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s, background 0.15s;
  transform-origin: center;
}
.hamburger.open span:nth-child(1) { transform: translateY(0.65rem) rotate(45deg); background: var(--accent-hi); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-0.65rem) rotate(-45deg); background: var(--accent-hi); }

.drawer {
  position: fixed;
  top: var(--header-height);
  right: 0;
  width: 30rem;
  max-width: 90vw;
  background: rgba(15,15,22,0.96);
  backdrop-filter: blur(20px) saturate(140%);
  border-left: 1px solid var(--border-mid);
  border-bottom: 1px solid var(--border-mid);
  border-bottom-left-radius: 1.4rem;
  z-index: 101;
  transform: translateY(-12px);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.22s ease, opacity 0.22s ease;
  overflow: hidden;
}
.drawerOpen { transform: translateY(0); opacity: 1; pointer-events: all; }

.drawerInner { padding: 1.2rem 0; display: flex; flex-direction: column; }

.drawerItem {
  display: block;
  padding: 1.4rem 2.4rem;
  font-family: var(--font-display);
  font-size: 1.5rem; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--text-secondary);
  cursor: pointer; text-decoration: none;
  transition: color 0.15s, background 0.15s;
  border-left: 2px solid transparent;
  background: none; border-top: none; border-right: none; border-bottom: none;
  width: 100%; text-align: left;
}
.drawerItem:hover { color: var(--text-primary); background: rgba(160,150,255,0.04); }
.drawerItemActive {
  color: var(--accent-hi);
  border-left-color: var(--accent);
  background: oklch(62% 0.16 275 / 0.06);
}

.drawerSep { height: 1px; background: var(--border-dim); margin: 0.8rem 0; }

.drawerBtn {
  display: block;
  margin: 0.4rem 2rem;
  padding: 1rem 1.6rem;
  background: none;
  border: 1px solid var(--border-mid);
  border-radius: 0.8rem;
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: 1.25rem; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  text-align: left; cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  width: calc(100% - 4rem);
  text-decoration: none;
}
.drawerBtn:hover { color: var(--text-primary); border-color: var(--border-hi); }
.drawerBtnPrimary {
  background: var(--accent); color: var(--bg-void);
  border-color: var(--accent); text-align: center;
  margin-bottom: 1.2rem;
}
.drawerBtnPrimary:hover { background: var(--accent-hi); border-color: var(--accent-hi); color: var(--bg-void); }

.backdrop {
  position: fixed; inset: 0;
  z-index: 99; background: transparent;
}

@media (max-width: 720px) {
  .header { padding: 0 1.6rem; }
  .brandName { display: none; }
  .brandNameMobile {
    display: block; font-size: 1.8rem;
    font-family: var(--font-display); font-weight: 700; letter-spacing: 0.2em;
  }
}
```

- [ ] **Rewrite `client/src/components/Header/index.js`**

```jsx
import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Auth from '../../utils/auth';
import { CubeAlt } from '@styled-icons/boxicons-regular';
import { ConcertContext } from '../../utils/GlobalState';
import styles from './Header.module.css';

const Header = () => {
  const { today, setDate, setSortOrSearch } = useContext(ConcertContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const loggedIn = Auth.loggedIn();

  const goHome = () => {
    setDate(today);
    setSortOrSearch('venue');
  };

  const closeMenu = () => setMenuOpen(false);

  const logout = (e) => {
    e.preventDefault();
    Auth.logout();
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={styles.header}>
        <Link to="/" onClick={() => { goHome(); closeMenu(); }} className={styles.brand}>
          <div className={styles.brandCube}><CubeAlt /></div>
          <span className={styles.brandName}>NOISEBX</span>
          <span className={styles.brandNameMobile}>NBX</span>
        </Link>

        <button
          className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>
      </header>

      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <nav className={styles.drawerInner}>
          <Link
            to="/"
            onClick={() => { goHome(); closeMenu(); }}
            className={`${styles.drawerItem} ${isActive('/') ? styles.drawerItemActive : ''}`}
          >
            Shows
          </Link>

          {loggedIn && (
            <Link
              to="/profile"
              onClick={closeMenu}
              className={`${styles.drawerItem} ${location.pathname.startsWith('/profile') ? styles.drawerItemActive : ''}`}
            >
              Profile
            </Link>
          )}

          <button
            className={styles.drawerItem}
            onClick={() => { setSortOrSearch('search'); closeMenu(); }}
          >
            Venue search
          </button>

          <div className={styles.drawerSep} />

          {loggedIn ? (
            <button className={styles.drawerBtn} onClick={logout}>Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className={styles.drawerBtn}>Login</Link>
              <Link to="/signup" onClick={closeMenu} className={`${styles.drawerBtn} ${styles.drawerBtnPrimary}`}>Sign up</Link>
            </>
          )}
        </nav>
      </div>

      {menuOpen && <div className={styles.backdrop} onClick={closeMenu} />}
    </>
  );
};

export default Header;
```

- [ ] **Verify in browser**

The header should now show NOISEBX wordmark + cube on the left, hamburger button on the right. Clicking hamburger opens the drawer. Clicking backdrop closes it. Nav links in the old header are gone.

- [ ] **Commit**

```bash
git add client/src/components/Header/index.js client/src/components/Header/Header.module.css
git commit -m "feat: rewrite header with hamburger drawer"
```

---

## Task 5: DateNav component

**Files:**
- Create: `client/src/components/DateNav/DateNav.jsx`
- Create: `client/src/components/DateNav/DateNav.module.css`

- [ ] **Create `client/src/components/DateNav/DateNav.module.css`**

```css
.dateNav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.4rem 0 3.2rem;
}

.arrow {
  width: 5rem; height: 5rem;
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 1.2rem;
  color: var(--text-secondary);
  transition: all 0.2s;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}
.arrow svg { width: 2.2rem; height: 2.2rem; }
.arrow:hover:not(.disabled) {
  color: var(--accent-hi);
  border-color: var(--border-hi);
  transform: translateY(-1px);
}
.disabled { opacity: 0.3; pointer-events: none; }

.display {
  flex: 1;
  text-align: center;
  cursor: pointer;
  user-select: none;
}
.dayLabel {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.6rem;
}
.fullDate {
  font-family: var(--font-display);
  font-size: 4.6rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1;
  color: var(--text-primary);
  transition: color 0.2s;
}
.display:hover .fullDate { color: var(--accent-hi); }
.meta {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-top: 0.8rem;
  letter-spacing: 0.04em;
}

.hiddenPicker {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  height: 0; width: 0;
}

@media (max-width: 720px) {
  .fullDate { font-size: 3.2rem; }
  .dateNav { gap: 1rem; }
  .arrow { width: 4.2rem; height: 4.2rem; }
}
```

- [ ] **Create `client/src/components/DateNav/DateNav.jsx`**

```jsx
import { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import addMonths from 'date-fns/addMonths';
import { LeftArrow, RightArrow } from '@styled-icons/boxicons-regular';
import styles from './DateNav.module.css';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const DateNav = ({ date, setDate, total }) => {
  const pickerRef = useRef(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const today     = new Date(); today.setHours(0,0,0,0);
  const tomorrow  = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const min       = yesterday;
  const max       = new Date(today); max.setDate(today.getDate() + 89);

  const current = new Date(date);
  const sameDay = (a, b) => a.toDateString() === b.toDateString();

  const dayLabel = sameDay(current, today)     ? 'TODAY'
                 : sameDay(current, tomorrow)  ? 'TOMORROW'
                 : sameDay(current, yesterday) ? 'YESTERDAY'
                 : current.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();

  const fullDate = `${MONTHS[current.getMonth()]} ${current.getDate()}, ${current.getFullYear()}`;

  const setDateFromDate = (d) => {
    d.setHours(0, 0, 0, 0);
    setDate(d.toISOString());
  };

  const canPrev = current > min;
  const canNext = current < max;

  const prevDay = () => {
    if (!canPrev) return;
    const d = new Date(current); d.setDate(d.getDate() - 1); setDateFromDate(d);
  };
  const nextDay = () => {
    if (!canNext) return;
    const d = new Date(current); d.setDate(d.getDate() + 1); setDateFromDate(d);
  };

  return (
    <div className={styles.dateNav}>
      <button
        className={`${styles.arrow} ${!canPrev ? styles.disabled : ''}`}
        onClick={prevDay}
        aria-label="Previous day"
      >
        <LeftArrow />
      </button>

      <div className={styles.display} onClick={() => pickerRef.current?.setOpen(true)}>
        <div className={styles.dayLabel}>{dayLabel}</div>
        <div className={styles.fullDate}>{fullDate}</div>
        <div className={styles.meta}>{total} {total === 1 ? 'show' : 'shows'} · click to open calendar</div>
      </div>

      <button
        className={`${styles.arrow} ${!canNext ? styles.disabled : ''}`}
        onClick={nextDay}
        aria-label="Next day"
      >
        <RightArrow />
      </button>

      <div className={styles.hiddenPicker}>
        <DatePicker
          ref={pickerRef}
          selected={current}
          onChange={(d) => setDateFromDate(d)}
          minDate={today}
          maxDate={addMonths(new Date(), 3)}
          calendarClassName="calendar"
          showDisabledMonthNavigation
        />
      </div>
    </div>
  );
};

export default DateNav;
```

- [ ] **Write a smoke test for DateNav**

Create `client/src/components/DateNav/DateNav.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import DateNav from './DateNav';

const today = new Date();
today.setHours(0, 0, 0, 0);

test('shows TODAY label for current date', () => {
  render(<DateNav date={today.toISOString()} setDate={() => {}} total={5} />);
  expect(screen.getByText('TODAY')).toBeInTheDocument();
});

test('shows show count', () => {
  render(<DateNav date={today.toISOString()} setDate={() => {}} total={12} />);
  expect(screen.getByText(/12 shows/)).toBeInTheDocument();
});

test('shows TOMORROW label for next day', () => {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  render(<DateNav date={tomorrow.toISOString()} setDate={() => {}} total={0} />);
  expect(screen.getByText('TOMORROW')).toBeInTheDocument();
});
```

- [ ] **Run the tests**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=DateNav
```

Expected: 3 tests pass.

- [ ] **Commit**

```bash
git add client/src/components/DateNav/
git commit -m "feat: add DateNav date hero component"
```

---

## Task 6: ControlBar component

**Files:**
- Create: `client/src/components/ControlBar/ControlBar.jsx`
- Create: `client/src/components/ControlBar/ControlBar.module.css`

- [ ] **Create `client/src/components/ControlBar/ControlBar.module.css`**

```css
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.6rem;
  padding: 1.2rem 0;
  margin-bottom: 2rem;
  border-top: 1px solid var(--border-dim);
  border-bottom: 1px solid var(--border-dim);
}

.group { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; }

.label {
  font-family: var(--font-mono);
  font-size: 1rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-right: 0.6rem;
}

.sortBtn {
  display: inline-flex; align-items: center; gap: 0.6rem;
  background: transparent;
  border: 1px solid transparent;
  padding: 0.7rem 1.2rem;
  border-radius: 0.6rem;
  color: var(--text-secondary);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
  cursor: pointer;
}
.sortBtn:hover { color: var(--text-primary); background: rgba(160,150,255,0.04); }
.sortBtn.active {
  color: var(--accent-hi);
  background: var(--accent-dim);
  border-color: var(--accent-mid);
}
.sortIcon { width: 1.4rem; height: 1.4rem; }

.count {
  font-family: var(--font-mono);
  font-size: 1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.count strong {
  color: var(--accent-hi);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 720px) {
  .bar { flex-direction: column; align-items: stretch; gap: 1rem; }
  .group { justify-content: center; }
}
```

- [ ] **Create `client/src/components/ControlBar/ControlBar.jsx`**

```jsx
import { TextSortAscending } from '@styled-icons/fluentui-system-filled/TextSortAscending';
import { TextSortDescending } from '@styled-icons/fluentui-system-filled/TextSortDescending';
import { Search } from '@styled-icons/bootstrap/Search';
import styles from './ControlBar.module.css';

const ControlBar = ({ mode, isAsc, onSort, count }) => {
  const sortBtn = (key, label) => (
    <button
      className={`${styles.sortBtn} ${mode === key ? styles.active : ''}`}
      onClick={() => onSort(key)}
    >
      {label}
      {mode === key && (
        isAsc
          ? <TextSortAscending className={styles.sortIcon} />
          : <TextSortDescending className={styles.sortIcon} />
      )}
    </button>
  );

  return (
    <div className={styles.bar}>
      <div className={styles.group}>
        <span className={styles.label}>Sort</span>
        {sortBtn('venue', 'Venue')}
        {sortBtn('artist', 'Artist')}
        <button
          className={`${styles.sortBtn} ${mode === 'search' ? styles.active : ''}`}
          onClick={() => onSort('search')}
        >
          <Search className={styles.sortIcon} /> Search
        </button>
      </div>
      <div className={styles.count}>
        <strong>{count}</strong> {count === 1 ? 'result' : 'results'}
      </div>
    </div>
  );
};

export default ControlBar;
```

- [ ] **Write a smoke test for ControlBar**

Create `client/src/components/ControlBar/ControlBar.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ControlBar from './ControlBar';

test('renders sort buttons', () => {
  render(<ControlBar mode="venue" isAsc={true} onSort={() => {}} count={10} />);
  expect(screen.getByText('Venue')).toBeInTheDocument();
  expect(screen.getByText('Artist')).toBeInTheDocument();
  expect(screen.getByText('Search')).toBeInTheDocument();
});

test('calls onSort with correct key', () => {
  const onSort = jest.fn();
  render(<ControlBar mode="venue" isAsc={true} onSort={onSort} count={10} />);
  fireEvent.click(screen.getByText('Artist'));
  expect(onSort).toHaveBeenCalledWith('artist');
});

test('shows result count', () => {
  render(<ControlBar mode="venue" isAsc={true} onSort={() => {}} count={7} />);
  expect(screen.getByText('7')).toBeInTheDocument();
  expect(screen.getByText('results')).toBeInTheDocument();
});
```

- [ ] **Run the tests**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=ControlBar
```

Expected: 3 tests pass.

- [ ] **Commit**

```bash
git add client/src/components/ControlBar/
git commit -m "feat: add ControlBar sort/search component"
```

---

## Task 7: Update GraphQL queries

**Files:**
- Modify: `client/src/utils/queries.js` (lines 38–109 — the four sorted queries)

Add `yes { _id }` and `maybe { _id }` to all four sorted concert queries so `ConcertRow` can derive attendance counts.

- [ ] **Update `GET_CONCERTS_SORTED_BY_VENUE_ASC` (around line 38)**

```js
export const GET_CONCERTS_SORTED_BY_VENUE_ASC = gql`
    query concertsSortByVenueAsc($date: String!) {
        concertsSortByVenueAsc(date: $date) {
            _id
            artists
            customId
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            yes { _id }
            maybe { _id }
        }
    }
`;
```

- [ ] **Update `GET_CONCERTS_SORTED_BY_VENUE_DESC` (around line 56)**

```js
export const GET_CONCERTS_SORTED_BY_VENUE_DESC = gql`
    query concertsSortByVenueDesc($date: String!) {
        concertsSortByVenueDesc(date: $date) {
            _id
            artists
            customId
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            yes { _id }
            maybe { _id }
        }
    }
`;
```

- [ ] **Update `GET_CONCERTS_SORTED_BY_ARTISTS_ASC` (around line 74)**

```js
export const GET_CONCERTS_SORTED_BY_ARTISTS_ASC = gql`
    query concertsSortByArtistsAsc($date: String!) {
        concertsSortByArtistsAsc(date: $date) {
            _id
            artists
            customId
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            yes { _id }
            maybe { _id }
        }
    }
`;
```

- [ ] **Update `GET_CONCERTS_SORTED_BY_ARTISTS_DESC` (around line 92)**

```js
export const GET_CONCERTS_SORTED_BY_ARTISTS_DESC = gql`
    query concertsSortByArtistsDesc($date: String!) {
        concertsSortByArtistsDesc(date: $date) {
            _id
            artists
            customId
            date
            times
            venue
            address
            address2
            phone
            website
            email
            ticketLink
            yes { _id }
            maybe { _id }
        }
    }
`;
```

- [ ] **Commit**

```bash
git add client/src/utils/queries.js
git commit -m "feat: add yes/maybe fields to sorted concert queries"
```

---

## Task 8: ConcertList rewrite

**Files:**
- Rewrite: `client/src/components/ConcertList/ConcertList.jsx`
- Rewrite: `client/src/components/ConcertList/ConcertList.module.css`

`ConcertRow` is defined in the same file. Uses `PlusMinus` (existing logic, new style) and renders attendance dots from `yes`/`maybe` array lengths.

- [ ] **Rewrite `client/src/components/ConcertList/ConcertList.module.css`**

```css
.list { display: flex; flex-direction: column; gap: 0.4rem; }

.row {
  display: grid;
  grid-template-columns: 4.4rem 1fr auto;
  align-items: center;
  gap: 1.8rem;
  padding: 1.8rem 1.6rem;
  border-radius: 1rem;
  background: transparent;
  border: 1px solid transparent;
  transition: background 0.18s, border-color 0.18s;
  position: relative;
}
.row:hover {
  background: var(--bg-surface);
  border-color: var(--border-dim);
}
.row:not(:hover):not(:first-child)::before {
  content: '';
  position: absolute;
  top: -1px; left: 1.6rem; right: 1.6rem;
  height: 1px;
  background: var(--border-dim);
  pointer-events: none;
}

.rsvp { display: flex; justify-content: center; }

.plusBtn {
  width: 4.4rem; height: 4.4rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: 1rem;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  padding: 0;
}
.plusBtn:hover:not(.savedBtn) {
  border-color: var(--accent-mid);
  color: var(--accent-hi);
  transform: translateY(-1px);
}
.plusBtn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.plusBtn svg { width: 2rem; height: 2rem; }

.savedBtn {
  background: var(--rsvp-yes-dim);
  border-color: var(--rsvp-yes);
  color: var(--rsvp-yes);
}

.content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.artists {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.15;
  color: var(--text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.15s;
  text-decoration: none;
}
.row:hover .artists { color: var(--accent-hi); }

.meta {
  display: flex; align-items: center; gap: 0.8rem; flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: 1.15rem;
  color: var(--text-secondary);
  letter-spacing: 0.02em;
}
.at {
  color: var(--text-muted);
  text-transform: uppercase;
  font-size: 0.95rem;
  letter-spacing: 0.18em;
}
.venue {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.15s;
}
.venue:hover { color: var(--accent-hi); }
.time {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: var(--bg-raised);
  border: 1px solid var(--border-dim);
  padding: 0.25rem 0.7rem;
  border-radius: 0.5rem;
  color: var(--text-secondary);
  font-size: 1.05rem;
  letter-spacing: 0.04em;
}

.attendance {
  display: flex; align-items: center; gap: 1rem;
  font-family: var(--font-mono);
  font-size: 1.05rem;
}
.pill { display: inline-flex; align-items: center; gap: 0.4rem; }
.dot { width: 0.7rem; height: 0.7rem; border-radius: 50%; }
.dotYes { background: var(--rsvp-yes); }
.dotMaybe { background: var(--rsvp-maybe); }
.attCount { color: var(--text-secondary); font-weight: 700; font-variant-numeric: tabular-nums; }

.emptyState {
  padding: 8rem 2rem;
  text-align: center;
}
.emptyIcon {
  width: 5rem; height: 5rem;
  margin: 0 auto 1.6rem;
  border-radius: 50%;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-muted);
  font-size: 2rem;
}
.emptyTitle {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.6rem;
}
.emptySub {
  font-family: var(--font-body);
  font-size: 1.4rem;
  color: var(--text-muted);
}

@media (max-width: 720px) {
  .row { grid-template-columns: 4rem 1fr; gap: 1.2rem; padding: 1.4rem 1rem; }
  .attendance { grid-column: 2; }
  .artists { font-size: 1.7rem; }
}
```

- [ ] **Rewrite `client/src/components/ConcertList/ConcertList.jsx`**

```jsx
import { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConcertContext } from '../../utils/GlobalState';
import Auth from '../../utils/auth';
import AdminDelete from '../AdminUtil/AdminDelete';
import PlusMinus from '../shared/PlusMinus/PlusMinus';
import { SquaredPlus } from '@styled-icons/entypo/SquaredPlus';
import styles from './ConcertList.module.css';

const ConcertList = ({ concerts }) => {
  const { user } = useContext(ConcertContext);
  const [concertList, setConcertList] = useState(concerts);
  const isAdmin = useMemo(() => user?.me?.isAdmin === true, [user?.me?.isAdmin]);
  const loggedIn = Auth.loggedIn();

  useEffect(() => { setConcertList(concerts); }, [concerts]);

  const filterList = (concertId) => {
    setConcertList(list => list.filter(c => c._id !== concertId));
  };

  if (!concertList?.length) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>∅</div>
        <div className={styles.emptyTitle}>No shows for this day</div>
        <div className={styles.emptySub}>Try a different date or search for a venue.</div>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {concertList.map(concert => (
        <ConcertRow
          key={concert._id}
          concert={concert}
          loggedIn={loggedIn}
          isAdmin={isAdmin}
          onDelete={() => filterList(concert._id)}
        />
      ))}
    </div>
  );
};

const ConcertRow = ({ concert, loggedIn, isAdmin, onDelete }) => {
  const yesCount   = concert.yes?.length   ?? null;
  const maybeCount = concert.maybe?.length ?? null;
  const hasAttendance = yesCount !== null || maybeCount !== null;

  return (
    <div className={`${styles.row} fade-up`}>
      <div className={styles.rsvp}>
        {loggedIn
          ? <PlusMinus concertId={concert._id} />
          : <SquaredPlus className={`${styles.plusBtn} ${styles.plusBtn}:disabled`} style={{ opacity: 0.4, width: '4.4rem', height: '4.4rem' }} />
        }
      </div>

      <div className={styles.content}>
        <Link
          to={`/show/${concert.customId}`}
          state={{ concert }}
          className={styles.artists}
        >
          {concert.artists}
        </Link>
        <div className={styles.meta}>
          {concert.venue && (
            <>
              <span className={styles.at}>at</span>
              <Link to={`/venue/${encodeURIComponent(concert.venue)}`} className={styles.venue}>
                {concert.venue}
              </Link>
            </>
          )}
          {concert.times && <span className={styles.time}>{concert.times}</span>}
        </div>
      </div>

      {hasAttendance && (
        <div className={styles.attendance}>
          {yesCount !== null && (
            <span className={styles.pill}>
              <span className={`${styles.dot} ${styles.dotYes}`} />
              <span className={styles.attCount}>{yesCount}</span>
            </span>
          )}
          {maybeCount !== null && (
            <span className={styles.pill}>
              <span className={`${styles.dot} ${styles.dotMaybe}`} />
              <span className={styles.attCount}>{maybeCount}</span>
            </span>
          )}
        </div>
      )}

      {isAdmin && <AdminDelete concertId={concert._id} filterList={onDelete} />}
    </div>
  );
};

export default ConcertList;
```

- [ ] **Write smoke tests for ConcertList**

Create `client/src/components/ConcertList/ConcertList.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import ConcertList from './ConcertList';
import { ConcertContext } from '../../utils/GlobalState';

const mockUser = { me: { _id: '1', username: 'test', isAdmin: false, concerts: [] } };
const mockContext = { user: mockUser };

const wrap = (ui) => (
  <MockedProvider>
    <ConcertContext.Provider value={mockContext}>
      <MemoryRouter>{ui}</MemoryRouter>
    </ConcertContext.Provider>
  </MockedProvider>
);

test('shows empty state when no concerts', () => {
  render(wrap(<ConcertList concerts={[]} />));
  expect(screen.getByText('No shows for this day')).toBeInTheDocument();
});

test('renders artist name', () => {
  const concerts = [{
    _id: '1', artists: 'Black Pumas', customId: 'bp-123',
    venue: 'ACL Live', times: '8:00 PM', yes: [], maybe: []
  }];
  render(wrap(<ConcertList concerts={concerts} />));
  expect(screen.getByText('Black Pumas')).toBeInTheDocument();
});

test('renders venue name', () => {
  const concerts = [{
    _id: '1', artists: 'Wild Child', customId: 'wc-123',
    venue: 'The Parish', times: '7:30 PM', yes: [], maybe: []
  }];
  render(wrap(<ConcertList concerts={concerts} />));
  expect(screen.getByText('The Parish')).toBeInTheDocument();
});
```

- [ ] **Run the tests**

```bash
cd client && npm test -- --watchAll=false --testPathPattern=ConcertList
```

Expected: 3 tests pass.

- [ ] **Commit**

```bash
git add client/src/components/ConcertList/
git commit -m "feat: rewrite ConcertList with editorial rows and attendance dots"
```

---

## Task 9: Home page rewrite

**Files:**
- Rewrite: `client/src/pages/Home.jsx`
- Create: `client/src/pages/Home.module.css`

- [ ] **Create `client/src/pages/Home.module.css`**

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
  padding: 4rem 4rem 8rem;
}
@media (max-width: 720px) {
  .page { padding: 2rem 1.6rem 6rem; }
}
```

- [ ] **Rewrite `client/src/pages/Home.jsx`**

```jsx
import { useContext, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { ConcertContext } from '../utils/GlobalState';
import {
  GET_CONCERTS_SORTED_BY_VENUE_ASC,
  GET_CONCERTS_SORTED_BY_VENUE_DESC,
  GET_CONCERTS_SORTED_BY_ARTISTS_ASC,
  GET_CONCERTS_SORTED_BY_ARTISTS_DESC,
} from '../utils/queries';
import DateNav from '../components/DateNav/DateNav';
import ControlBar from '../components/ControlBar/ControlBar';
import ConcertList from '../components/ConcertList/ConcertList';
import VenueSearch from '../components/VenueSearch/VenueSearch';
import Spinner from '../components/shared/Spinner';
import ScrollButton from '../components/shared/ScrollButton';
import styles from './Home.module.css';

const queryMap = {
  'venue-asc':   GET_CONCERTS_SORTED_BY_VENUE_ASC,
  'venue-desc':  GET_CONCERTS_SORTED_BY_VENUE_DESC,
  'artist-asc':  GET_CONCERTS_SORTED_BY_ARTISTS_ASC,
  'artist-desc': GET_CONCERTS_SORTED_BY_ARTISTS_DESC,
};

const Home = () => {
  const { date, setDate, sortOrSearch, setSortOrSearch } = useContext(ConcertContext);
  const [isAsc, setIsAsc] = useState(true);

  const isSearchMode = sortOrSearch === 'search';
  const key = `${sortOrSearch}-${isAsc ? 'asc' : 'desc'}`;
  const activeQuery = queryMap[key] || GET_CONCERTS_SORTED_BY_VENUE_ASC;

  const { loading, data } = useQuery(activeQuery, {
    variables: { date },
    skip: isSearchMode,
  });

  const concerts = useMemo(() => {
    if (!data) return [];
    return data.concertsSortByVenueAsc
        || data.concertsSortByVenueDesc
        || data.concertsSortByArtistsAsc
        || data.concertsSortByArtistsDesc
        || [];
  }, [data]);

  const handleSort = (mode) => {
    if (mode === sortOrSearch) {
      setIsAsc(prev => !prev);
    } else {
      setSortOrSearch(mode);
      setIsAsc(true);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.page}>
        <DateNav date={date} setDate={setDate} total={isSearchMode ? 0 : concerts.length} />
        <ControlBar
          mode={sortOrSearch}
          isAsc={isAsc}
          onSort={handleSort}
          count={isSearchMode ? 0 : concerts.length}
        />
        {isSearchMode
          ? <VenueSearch />
          : loading
            ? <Spinner />
            : <ConcertList concerts={concerts} />
        }
        <ScrollButton />
      </div>
    </main>
  );
};

export default Home;
```

- [ ] **Verify in browser**

The home page should now show:
- Large date hero with prev/next arrows
- Sort/Search control bar always visible (no toggle)
- Concert rows in editorial format
- Clicking Search replaces the list with VenueSearch inline

- [ ] **Commit**

```bash
git add client/src/pages/Home.jsx client/src/pages/Home.module.css
git commit -m "feat: rewrite Home page with DateNav + ControlBar + ConcertList"
```

---

## Task 10: ScrollButton restyle

**Files:**
- Rewrite: `client/src/components/shared/ScrollButton/index.js`
- Create: `client/src/components/shared/ScrollButton/ScrollButton.module.css`

- [ ] **Create `client/src/components/shared/ScrollButton/ScrollButton.module.css`**

```css
.scrollTop {
  position: fixed;
  bottom: 3.2rem;
  right: 3.2rem;
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  background: var(--accent);
  border: 1px solid var(--accent-hi);
  color: var(--bg-void);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 90;
  padding: 0;
  box-shadow:
    0 8px 32px oklch(62% 0.16 275 / 0.35),
    inset 0 1px 0 oklch(82% 0.16 275 / 0.3);
  opacity: 0;
  transform: translateY(12px) scale(0.9);
  pointer-events: none;
  transition:
    opacity 0.22s ease,
    transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.2s,
    background 0.15s;
}
.scrollTop.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: all;
}
.scrollTop:hover {
  background: var(--accent-hi);
  box-shadow:
    0 12px 40px oklch(62% 0.16 275 / 0.5),
    0 0 0 6px oklch(62% 0.16 275 / 0.15),
    inset 0 1px 0 oklch(82% 0.16 275 / 0.4);
  transform: translateY(-2px) scale(1.04);
}
.scrollTop:active { transform: translateY(0) scale(0.95); }
.scrollTop svg { width: 2rem; height: 2rem; }

@media (max-width: 720px) {
  .scrollTop { bottom: 1.6rem; right: 1.6rem; width: 4.4rem; height: 4.4rem; }
  .scrollTop svg { width: 1.8rem; height: 1.8rem; }
}
```

- [ ] **Rewrite `client/src/components/shared/ScrollButton/index.js`**

```jsx
import { useEffect, useState } from 'react';
import { ArrowUpCircleFill } from '@styled-icons/bootstrap/ArrowUpCircleFill';
import styles from './ScrollButton.module.css';

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      className={`${styles.scrollTop} ${visible ? styles.visible : ''}`}
      onClick={scrollTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <ArrowUpCircleFill />
    </button>
  );
};

export default ScrollButton;
```

- [ ] **Commit**

```bash
git add client/src/components/shared/ScrollButton/
git commit -m "feat: restyle ScrollButton with accent glow and fix scroll listener"
```

---

## Task 11: Strip obsolete CSS from index.css

**Files:**
- Modify: `client/src/index.css`

Remove global styles that are now owned by CSS Modules or no longer used. The following class/id selectors can be removed from `index.css` (search for each and delete the full rule block):

`.wrapper`, `.wrapperOptions`, `.home-page-wrapper`, `#home-wrapper`, `.utility-bar`, `.sortFilterContainer`, `.sort-buttons`, `.sortIcon`, `.show-card`, `#show-card-contents`, `#show-card-left-contents`, `#show-card-data`, `.top-o-page`, `.top-o-page:hover`, `header` (the full block — now in Header.module.css), `.title-wrapper`, `#cube-icon`, `header nav ul`, `header nav ul li a`, `#title-mobile` (the desktop hide), `.options`, `.options:hover`, `.arrows`, `.arrows:hover`, `.disabled-arrows`, `#date`, `.date-wrapper`.

Also remove the old `:root` variable block (the one with `--background`, `--dark`, `--darker`, etc.) — it is replaced by `tokens.css`. Keep any rules that are still referenced by components not yet redesigned (profile, friends, venue pages, etc.).

- [ ] **Remove the old `:root` block**

Find and delete the block starting with `:root {` that contains `--background: #000;` through `--secondary-font: 'Bungee Hairline', cursive;`. The new tokens are in `tokens.css`.

- [ ] **Remove home/header/utility globals listed above**

Search each selector listed and delete it along with its rule block.

- [ ] **Keep these rules** (still used by non-redesigned pages):

`.profile-page-wrapper`, `.concert-friend-wrapper`, `.profile-concerts-card`, `.rsvp-container`, `.rsvp-wrapper`, `.rsvp-yes/no/maybe`, `.friend-list-container`, `.friend-list`, `.venue-show-list-wrapper`, `.venue-heading`, `.page-wrapper`, `.container`, `.form-card`, `.spinner-wrapper`, `.back-button*`, `.show-wrapper*`, `.show-links`, `.sent-received`, `.cancel`, `.approve`, `.deny`, `.chevron`, `.calendar` (datepicker overrides), media queries for profile/friends.

- [ ] **Verify in browser — check all routes**

Open and spot-check: `/`, `/login`, `/signup`, `/profile`. Removing global rules should not break these pages.

- [ ] **Commit**

```bash
git add client/src/index.css
git commit -m "chore: remove obsolete global CSS replaced by CSS Modules"
```

---

## Task 12: Final cleanup and run all tests

- [ ] **Run the full test suite**

```bash
cd client && npm test -- --watchAll=false
```

Expected: all tests pass.

- [ ] **Verify the app in the browser across key flows**

1. Home loads with date hero, control bar, concert rows
2. Prev/next arrows change the date and reload concerts
3. Clicking the date display opens the calendar picker
4. Sort by Venue (asc/desc toggle), Sort by Artist (asc/desc toggle)
5. Search button shows VenueSearch inline
6. Hamburger opens drawer; backdrop closes it
7. "Venue search" in drawer also shows VenueSearch inline
8. Show page (`/show/:id`), Venue page (`/venue/:name`), Profile still work
9. Logged-in: PlusMinus button visible; logged-out: greyed icon
10. Attendance dots appear on concerts with yes/maybe data
11. ScrollButton appears on scroll, smooth-scrolls to top

- [ ] **Final commit**

```bash
git add -A
git commit -m "feat: complete noisebox home page redesign"
```
