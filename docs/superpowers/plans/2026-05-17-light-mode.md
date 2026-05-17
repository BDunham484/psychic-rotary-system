# Light Mode + Theme Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persisted light theme with an OS-preference default and a toggle in the hamburger drawer.

**Architecture:** A React context (`ThemeContext`) owns theme state, reads `localStorage` on init (falling back to `prefers-color-scheme`), and writes `data-theme` to `<html>` on every change. An inline script in `index.html` applies the correct attribute before React boots to prevent flash. All components already use CSS custom properties — only the token file, four CSS files with exact hardcoded literals, and two new component files need to change.

**Tech Stack:** React 18 context + hooks, CSS Custom Properties (`data-theme` attribute switching), `@styled-icons/feather` (Sun, Moon), `localStorage`, `window.matchMedia`

---

### Task 1: Update tokens.css — dark alias + helper tokens + light block

**Files:**
- Modify: `client/src/tokens.css`

- [ ] **Step 1: Replace the full contents of tokens.css**

```css
:root, [data-theme="dark"] {
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
  --font-display:   'Space Grotesk', sans-serif;
  --font-mono:      'Space Mono', monospace;
  --font-body:      'DM Sans', sans-serif;
  --font-wordmark:  'Pirata One', cursive;

  /* Layout */
  --header-height: 7rem;
  --max-content:   84rem;

  /* Dot grid + glow + cube helpers */
  --grid-dot:    rgba(160,150,255,0.025);
  --glow-color:  oklch(62% 0.16 275 / 0.10);
  --cube-bg:     oklch(62% 0.16 275 / 0.12);
  --cube-border: oklch(62% 0.16 275 / 0.5);
}

[data-theme="light"] {
  --bg-void:    #f4f1ea;
  --bg-base:    #ece8df;
  --bg-surface: #ffffff;
  --bg-raised:  #f9f6ee;
  --bg-overlay: #e6e2d6;

  --border-dim: rgba(40,30,90,0.07);
  --border-mid: rgba(40,30,90,0.14);
  --border-hi:  rgba(40,30,90,0.22);

  --text-primary:   #18141e;
  --text-secondary: #5a5470;
  --text-muted:     #94909c;

  --accent:       oklch(48% 0.18 275);
  --accent-hi:    oklch(40% 0.20 275);
  --accent-dim:   oklch(48% 0.18 275 / 0.10);
  --accent-mid:   oklch(48% 0.18 275 / 0.20);

  --rsvp-yes:        oklch(48% 0.18 145);
  --rsvp-yes-dim:    oklch(48% 0.18 145 / 0.10);
  --rsvp-no:         oklch(50% 0.18 22);
  --rsvp-no-dim:     oklch(50% 0.18 22 / 0.10);
  --rsvp-maybe:      oklch(60% 0.16 80);
  --rsvp-maybe-dim:  oklch(60% 0.16 80 / 0.14);

  --grid-dot:    rgba(40,30,90,0.04);
  --glow-color:  oklch(48% 0.18 275 / 0.08);
  --cube-bg:     oklch(48% 0.18 275 / 0.10);
  --cube-border: oklch(48% 0.18 275 / 0.45);
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/tokens.css
git commit -m "feat: add light theme tokens and dark selector alias"
```

---

### Task 2: Create ThemeContext — TDD

**Files:**
- Create: `client/src/__tests__/ThemeContext.test.js`
- Create: `client/src/utils/ThemeContext.jsx`

- [ ] **Step 1: Write the failing tests**

Create `client/src/__tests__/ThemeContext.test.js`:

```javascript
import { renderHook, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../utils/ThemeContext';

const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
});

test('defaults to dark when no localStorage and no system preference', () => {
  const { result } = renderHook(() => useTheme(), { wrapper });
  expect(result.current.theme).toBe('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});

test('defaults to light when system prefers light and no localStorage', () => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: query === '(prefers-color-scheme: light)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
  const { result } = renderHook(() => useTheme(), { wrapper });
  expect(result.current.theme).toBe('light');
});

test('uses localStorage value when present, ignoring matchMedia', () => {
  localStorage.setItem('noisebox-theme', 'light');
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
  const { result } = renderHook(() => useTheme(), { wrapper });
  expect(result.current.theme).toBe('light');
});

test('toggleTheme switches dark to light and persists to localStorage', () => {
  const { result } = renderHook(() => useTheme(), { wrapper });
  act(() => { result.current.toggleTheme(); });
  expect(result.current.theme).toBe('light');
  expect(localStorage.getItem('noisebox-theme')).toBe('light');
});

test('toggleTheme switches light to dark', () => {
  localStorage.setItem('noisebox-theme', 'light');
  const { result } = renderHook(() => useTheme(), { wrapper });
  act(() => { result.current.toggleTheme(); });
  expect(result.current.theme).toBe('dark');
});

test('sets data-theme on html element when theme changes', () => {
  const { result } = renderHook(() => useTheme(), { wrapper });
  act(() => { result.current.toggleTheme(); });
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="ThemeContext"
```
Expected: FAIL — `Cannot find module '../utils/ThemeContext'`

- [ ] **Step 3: Create ThemeContext.jsx**

Create `client/src/utils/ThemeContext.jsx`:

```jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('noisebox-theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('noisebox-theme', theme); } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd client && npm test -- --watchAll=false --testPathPattern="ThemeContext"
```
Expected: 6 tests PASS

- [ ] **Step 5: Commit**

```bash
git add client/src/__tests__/ThemeContext.test.js client/src/utils/ThemeContext.jsx
git commit -m "feat: add ThemeContext with localStorage and prefers-color-scheme support"
```

---

### Task 3: Add pre-paint script to index.html

**Files:**
- Modify: `client/public/index.html`

- [ ] **Step 1: Add inline script before `</head>`**

Insert this block immediately before the `</head>` closing tag in `client/public/index.html`:

```html
  <script>
    (function() {
      try {
        var saved = localStorage.getItem('noisebox-theme');
        if (saved) { document.documentElement.setAttribute('data-theme', saved); return; }
        var preferLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        document.documentElement.setAttribute('data-theme', preferLight ? 'light' : 'dark');
      } catch (e) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    })();
  </script>
```

- [ ] **Step 2: Commit**

```bash
git add client/public/index.html
git commit -m "feat: add pre-paint theme script to prevent flash of wrong theme"
```

---

### Task 4: Wrap App.js in ThemeProvider

**Files:**
- Modify: `client/src/App.js`

- [ ] **Step 1: Add import and wrap JSX**

Add the import at the top of `client/src/App.js` alongside the other utils imports:

```javascript
import { ThemeProvider } from './utils/ThemeContext';
```

Update the `return` statement so `<ThemeProvider>` wraps `<ConcertProvider>` (inside `<ApolloProvider>`):

```jsx
  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <ConcertProvider>
          <Router>
            <div>
              <div>
                <Header />
                <main>
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
                </main>
              </div>
              <Footer />
            </div>
          </Router>
        </ConcertProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
```

- [ ] **Step 2: Run full test suite**

```bash
cd client && npm test -- --watchAll=false
```
Expected: all existing tests pass — `ThemeProvider` is a transparent context wrapper that introduces no DOM changes in tests

- [ ] **Step 3: Commit**

```bash
git add client/src/App.js
git commit -m "feat: wrap app in ThemeProvider"
```

---

### Task 5: Create ThemeToggle component

**Files:**
- Create: `client/src/components/Header/ThemeToggle.jsx`

The CSS classes referenced here (`.themeRow`, `.themeToggle`, etc.) are added in Task 6.

- [ ] **Step 1: Create ThemeToggle.jsx**

Create `client/src/components/Header/ThemeToggle.jsx`:

```jsx
import { useTheme } from '../../utils/ThemeContext';
import { Sun } from '@styled-icons/feather/Sun';
import { Moon } from '@styled-icons/feather/Moon';
import styles from './Header.module.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={styles.themeRow}>
      <div className={styles.themeLabel}>
        <div className={styles.themeTitle}>Theme</div>
        <div className={styles.themeSub}>{isLight ? 'Light mode' : 'Dark mode'}</div>
      </div>
      <button
        className={styles.themeToggle}
        role="switch"
        aria-checked={isLight}
        aria-label="Toggle theme"
        onClick={toggleTheme}
      >
        <span className={styles.themeKnob}>
          {isLight ? <Sun /> : <Moon />}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Header/ThemeToggle.jsx
git commit -m "feat: add ThemeToggle component"
```

---

### Task 6: Update Header.module.css — brandCube token + toggle styles

**Files:**
- Modify: `client/src/components/Header/Header.module.css`

- [ ] **Step 1: Swap brandCube hardcoded color to token**

On line 28 of `client/src/components/Header/Header.module.css`, change:

```css
  color: oklch(72% 0.16 275);
```

to:

```css
  color: var(--accent-hi);
```

- [ ] **Step 2: Append toggle styles to end of file**

```css

/* ── Theme toggle ── */
.themeRow {
  margin: 0.4rem 1.6rem 1.2rem;
  padding: 1.2rem 1.4rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  border-radius: 0.8rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.themeLabel { display: flex; flex-direction: column; gap: 0.2rem; }

.themeTitle {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-primary);
}

.themeSub {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--text-muted);
  letter-spacing: 0.04em;
}

.themeToggle {
  width: 5.6rem;
  height: 3rem;
  border-radius: 10rem;
  background: var(--bg-overlay);
  border: 1px solid var(--border-mid);
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.themeKnob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: var(--bg-surface);
  border: 1px solid var(--border-mid);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  transition:
    transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1),
    background 0.3s ease,
    color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
}
.themeKnob svg { width: 1.4rem; height: 1.4rem; }

[data-theme="dark"]  .themeKnob { transform: translateX(0); }
[data-theme="light"] .themeKnob {
  transform: translateX(2.6rem);
  background: var(--accent);
  color: var(--bg-surface);
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/Header/Header.module.css
git commit -m "feat: add theme toggle styles and swap brandCube color to token"
```

---

### Task 7: Insert ThemeToggle into the drawer

**Files:**
- Modify: `client/src/components/Header/index.js`

- [ ] **Step 1: Add import**

At the top of `client/src/components/Header/index.js`, add alongside the other imports:

```javascript
import ThemeToggle from './ThemeToggle';
```

- [ ] **Step 2: Replace the single drawerSep with toggle + separators**

Find the existing `<div className={styles.drawerSep} />` inside `<nav className={styles.drawerInner}>`. Replace that one line with:

```jsx
          <div className={styles.drawerSep} />
          <ThemeToggle />
          <div className={styles.drawerSep} />
```

The full nav block after the change:

```jsx
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

        <Link
          to="/venues"
          onClick={closeMenu}
          className={`${styles.drawerItem} ${location.pathname === '/venues' ? styles.drawerItemActive : ''}`}
        >
          Venue search
        </Link>

        <div className={styles.drawerSep} />
        <ThemeToggle />
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
```

- [ ] **Step 3: Run the full test suite**

```bash
cd client && npm test -- --watchAll=false
```
Expected: all tests pass

- [ ] **Step 4: Commit**

```bash
git add client/src/components/Header/index.js
git commit -m "feat: add ThemeToggle to nav drawer"
```

---

### Task 8: Update index.css — dot grid token, body background, transition

**Files:**
- Modify: `client/src/index.css`

- [ ] **Step 1: Update the `html, body` rule — remove background-color**

Find this block (lines 24–31):

```css
html,
body {
  min-height: 100%;
  overflow-x: hidden;
  background-color: var(--bg-base);
}
```

Change it to:

```css
html,
body {
  min-height: 100%;
  overflow-x: hidden;
}
```

- [ ] **Step 2: Update the `body` rule — add background and transition**

Find this block (lines 32–37):

```css
body {
  font-family: var(--font-body), sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
}
```

Change it to:

```css
body {
  font-family: var(--font-body), sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-primary);
  background-color: var(--bg-void);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

- [ ] **Step 3: Update dot grid in `body::before`**

Find these two lines inside the `body::before` block (lines 43–46):

```css
    linear-gradient(rgba(160,150,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(160,150,255,0.025) 1px, transparent 1px);
```

Change to:

```css
    linear-gradient(var(--grid-dot) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-dot) 1px, transparent 1px);
```

- [ ] **Step 4: Commit**

```bash
git add client/src/index.css
git commit -m "feat: swap dot grid to token, update body bg to bg-void, add theme transition"
```

---

### Task 9: CSS audit — focus ring token swaps

**Files:**
- Modify: `client/src/components/VenueSearch/VenueSearch.module.css`
- Modify: `client/src/components/Friends/FriendsTab.module.css`

- [ ] **Step 1: Update VenueSearch.module.css**

On line 60, change:

```css
  box-shadow: 0 0 0 4px oklch(62% 0.16 275 / 0.12);
```

to:

```css
  box-shadow: 0 0 0 4px var(--accent-dim);
```

- [ ] **Step 2: Update FriendsTab.module.css**

On line 20, change:

```css
  box-shadow: 0 0 0 3px oklch(62% 0.16 275 / 0.12);
```

to:

```css
  box-shadow: 0 0 0 3px var(--accent-dim);
```

- [ ] **Step 3: Commit**

```bash
git add client/src/components/VenueSearch/VenueSearch.module.css client/src/components/Friends/FriendsTab.module.css
git commit -m "feat: swap focus ring hardcoded indigo to accent-dim token"
```

---

### Task 10: Manual smoke test

- [ ] **Step 1: Start the dev server**

```bash
npm run develop
```

Open `http://localhost:3002` in a browser.

- [ ] **Step 2: Verify dark mode (default on first visit with no system preference)**
  - Page loads dark (near-black background, light text)
  - No flash on hard refresh
  - Open hamburger — ThemeToggle visible in drawer, Moon icon, knob on the left, sub-label "Dark mode"

- [ ] **Step 3: Toggle to light mode**
  - Click the toggle — page transitions smoothly to warm off-white
  - Knob slides right and turns indigo accent color
  - Sub-label reads "Light mode"
  - Brand cube still visible in header (near-black on light bg via `--text-primary`)

- [ ] **Step 4: Verify persistence**
  - Hard-refresh the page — still in light mode, no flash
  - In DevTools → Application → Local Storage → `noisebox-theme: "light"`

- [ ] **Step 5: Toggle back to dark**
  - Click toggle — smooth transition to dark, knob slides left, Moon icon

- [ ] **Step 6: Run full test suite**

```bash
cd client && npm test -- --watchAll=false
```
Expected: 61 tests across 12 suites pass
