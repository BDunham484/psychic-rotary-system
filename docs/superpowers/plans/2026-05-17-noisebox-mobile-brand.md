# Mobile Brand Title Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the NBX mobile abbreviation and show the full NOISEBOX wordmark at every viewport width, with font-size scaling at narrow breakpoints.

**Architecture:** Two surgical file edits — remove one JSX element and update one CSS media query block. No new components or data dependencies.

**Tech Stack:** React 18, CSS Modules, Jest + React Testing Library

---

## Files

- Modify: `client/src/components/Header/index.js`
- Modify: `client/src/components/Header/Header.module.css`
- Create: `client/src/__tests__/Header.test.jsx`

---

### Task 1: Write failing test for Header brand rendering

**Files:**
- Create: `client/src/__tests__/Header.test.jsx`

- [ ] **Step 1: Create the test file**

```jsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ConcertContext } from '../utils/GlobalState';
import { ThemeProvider } from '../utils/ThemeContext';
import Header from '../components/Header';

jest.mock('../utils/auth', () => ({ loggedIn: () => false }));

beforeEach(() => {
  window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  }));
});

const ctx = {
  today: '2024-01-01T00:00:00.000Z',
  setDate: jest.fn(),
  setSortOrSearch: jest.fn(),
};

const renderHeader = () =>
  render(
    <ThemeProvider>
      <ConcertContext.Provider value={ctx}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </ConcertContext.Provider>
    </ThemeProvider>
  );

test('renders NOISEBOX wordmark', () => {
  renderHeader();
  expect(screen.getByText('NOISEBOX')).toBeInTheDocument();
});

test('does not render NBX abbreviation', () => {
  renderHeader();
  expect(screen.queryByText('NBX')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```
cd client && npm test -- --watchAll=false --testPathPattern=Header
```

Expected output: `FAIL` — `does not render NBX abbreviation` fails because `<span>NBX</span>` is currently in the DOM.

---

### Task 2: Remove NBX element from JSX

**Files:**
- Modify: `client/src/components/Header/index.js`

- [ ] **Step 1: Remove the brandNameMobile span**

In `client/src/components/Header/index.js`, find the brand link block (around line 33–37):

```jsx
<Link to="/" onClick={() => { goHome(); closeMenu(); }} className={styles.brand}>
  <div className={styles.brandCube}><CubeAlt /></div>
  <span className={styles.brandName}>NOISEBOX</span>
  <span className={styles.brandNameMobile}>NBX</span>
</Link>
```

Replace with:

```jsx
<Link to="/" onClick={() => { goHome(); closeMenu(); }} className={styles.brand}>
  <div className={styles.brandCube}><CubeAlt /></div>
  <span className={styles.brandName}>NOISEBOX</span>
</Link>
```

- [ ] **Step 2: Run tests to confirm both pass**

```
cd client && npm test -- --watchAll=false --testPathPattern=Header
```

Expected output: `PASS` — both `renders NOISEBOX wordmark` and `does not render NBX abbreviation` pass.

---

### Task 3: Update CSS — remove mobile rules, add scaling

**Files:**
- Modify: `client/src/components/Header/Header.module.css`

- [ ] **Step 1: Remove the dead brandNameMobile rule**

Find and delete this line (around line 47, just after `.brandName { ... }`):

```css
.brandNameMobile { display: none; }
```

- [ ] **Step 2: Replace the mobile media query block**

Find the existing `@media (max-width: 720px)` block (around lines 149–160):

```css
@media (max-width: 720px) {
  .header { padding: 0 1.6rem; }
  .brandName { display: none; }
  .brandNameMobile {
    display: block;
    font-family: var(--font-wordmark);
    font-weight: 400;
    font-size: 1.9rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
}
```

Replace with:

```css
@media (max-width: 720px) {
  .header { padding: 0 1.6rem; }
  .brandName { font-size: 2rem; letter-spacing: 0.08em; }
}
@media (max-width: 380px) {
  .brandName { font-size: 1.8rem; letter-spacing: 0.06em; }
}
```

- [ ] **Step 3: Run full test suite to confirm no regressions**

```
cd client && npm test -- --watchAll=false
```

Expected output: all existing tests still pass.

---

### Task 4: Commit

- [ ] **Step 1: Commit all changes**

```bash
git add client/src/__tests__/Header.test.jsx \
        client/src/components/Header/index.js \
        client/src/components/Header/Header.module.css
git commit -m "feat: show full NOISEBOX wordmark on all viewports"
```
