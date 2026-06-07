# Mobile Swipe-to-Reveal Friend Actions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** On the Friends tab, replace the always-visible mobile Remove/Block icons (a stray-tap hazard) with a deliberate left-swipe-to-reveal gesture; desktop hover actions stay unchanged.

**Architecture:** Extract the friend row into `FriendItem.jsx`. A `useIsMobile()` hook (matchMedia `720px`) picks `FriendRowMobile` (swipe drawer) vs `FriendRowDesktop` (existing hover icons). Pointer-event handlers with an axis-lock drive a `translateX` transform; pure clamp/threshold math lives in `utils/swipe.js`. `FriendsTab` holds a single `openId` so one row opens at a time. No undo, no a11y fallback this pass.

**Tech Stack:** React 18, CSS Modules, Apollo Client, Jest + Testing Library.

---

### Task 1: Global `matchMedia` test mock

`useIsMobile()` calls `window.matchMedia`, which jsdom does not implement. Without a default mock, every test that renders `FriendsTab` (which will render `FriendItem`) throws. Add a desktop-default mock to the shared setup so existing suites stay green; per-test overrides handle mobile.

**Files:**
- Modify: `client/src/setupTests.js`

- [ ] **Step 1: Add the default mock**

Replace the entire contents of `client/src/setupTests.js` with:

```js
// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// jsdom doesn't implement matchMedia. Provide a default (desktop: matches=false)
// mock so components using it (e.g. useIsMobile) render. Individual tests can
// override window.matchMedia to simulate the mobile breakpoint.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
}
```

- [ ] **Step 2: Confirm the existing suite still passes**

Run: `cd client && npm test -- --watchAll=false`
Expected: PASS — all existing suites green (the mock is additive; `Header`/`ThemeContext` already set their own `window.matchMedia`, which this `if (!window.matchMedia)` guard won't clobber within a test, and is reset between files).

- [ ] **Step 3: Commit**

```bash
git add client/src/setupTests.js
git commit -m "test: add default matchMedia mock for matchMedia-based components"
```

---

### Task 2: Swipe math helper (`utils/swipe.js`)

Pure functions for the drag clamp and the open/close threshold, so the gesture physics are unit-testable without simulating pointer drags in jsdom.

**Files:**
- Create: `client/src/utils/swipe.js`
- Test: `client/src/__tests__/swipe.test.js`

- [ ] **Step 1: Write the failing test**

Create `client/src/__tests__/swipe.test.js`:

```js
import { clampSwipe, shouldOpen, REVEAL } from '../utils/swipe';

describe('clampSwipe', () => {
  test('closed row: no movement at zero delta', () => {
    expect(clampSwipe(0, false)).toBe(0);
  });
  test('closed row: follows a left drag', () => {
    expect(clampSwipe(-50, false)).toBe(-50);
  });
  test('closed row: cannot drag right past closed', () => {
    expect(clampSwipe(50, false)).toBe(0);
  });
  test('closed row: clamps to reveal width plus overscroll', () => {
    expect(clampSwipe(-1000, false)).toBe(-(REVEAL + 28));
  });
  test('open row: base offset is the reveal width', () => {
    expect(clampSwipe(0, true)).toBe(-REVEAL);
  });
  test('open row: a right drag moves toward closed', () => {
    expect(clampSwipe(50, true)).toBe(-REVEAL + 50);
  });
});

describe('shouldOpen', () => {
  test('commits open past half the reveal width', () => {
    expect(shouldOpen(-(REVEAL / 2) - 1)).toBe(true);
  });
  test('snaps closed at or before half', () => {
    expect(shouldOpen(-(REVEAL / 2))).toBe(false);
    expect(shouldOpen(-10)).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd client && npm test -- --watchAll=false swipe`
Expected: FAIL — cannot find module `../utils/swipe`.

- [ ] **Step 3: Write the implementation**

Create `client/src/utils/swipe.js`:

```js
// Pixel width of the revealed action drawer (2 chips @ 7.2rem + gaps + padding).
export const REVEAL = 158;

// Slight overscroll allowed past the drawer for a natural rubber-band feel.
const OVERSCROLL = 28;

// Clamp a horizontal drag delta to the allowed translateX range, given whether
// the row started this drag already open. Result is always <= 0 (drawer is on
// the right) and never past -(REVEAL + OVERSCROLL).
export function clampSwipe(mx, open, reveal = REVEAL) {
  const base = open ? -reveal : 0;
  return Math.max(-reveal - OVERSCROLL, Math.min(0, base + mx));
}

// Whether releasing at translateX `tx` should commit the row open (dragged past
// half the reveal width).
export function shouldOpen(tx, reveal = REVEAL) {
  return tx < -reveal / 2;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd client && npm test -- --watchAll=false swipe`
Expected: PASS — all `swipe` tests green.

- [ ] **Step 5: Commit**

```bash
git add client/src/utils/swipe.js client/src/__tests__/swipe.test.js
git commit -m "feat: add swipe clamp/threshold helpers"
```

---

### Task 3: `FriendItem` component (desktop + mobile rows)

The dispatcher plus both row variants and the `useIsMobile` hook. Desktop markup is lifted verbatim from the current inline `FriendItem` in `FriendsTab.jsx`.

**Files:**
- Create: `client/src/components/Friends/FriendItem.jsx`
- Test: `client/src/__tests__/FriendItem.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `client/src/__tests__/FriendItem.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FriendItem from '../components/Friends/FriendItem';

const friend = { _id: 'f1', username: 'bob', concertCount: 3 };

const setMatch = (matches) => {
  window.matchMedia = (query) => ({
    matches,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
};

const renderItem = (props = {}) =>
  render(
    <MemoryRouter>
      <FriendItem
        friend={friend}
        open={false}
        setOpen={() => {}}
        onRemove={props.onRemove || (() => {})}
        onBlock={props.onBlock || (() => {})}
      />
    </MemoryRouter>
  );

describe('FriendItem (desktop)', () => {
  beforeEach(() => setMatch(false));

  test('renders View / Remove / Block controls', () => {
    renderItem();
    expect(screen.getByTitle('View profile')).toBeInTheDocument();
    expect(screen.getByTitle('Remove friend')).toBeInTheDocument();
    expect(screen.getByTitle('Block')).toBeInTheDocument();
  });

  test('Remove fires onRemove', () => {
    const onRemove = jest.fn();
    renderItem({ onRemove });
    fireEvent.click(screen.getByTitle('Remove friend'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

describe('FriendItem (mobile)', () => {
  beforeEach(() => setMatch(true));

  test('name/avatar link points at the friend profile', () => {
    renderItem();
    expect(screen.getByRole('link', { name: /bob/ })).toHaveAttribute('href', '/profile/bob');
  });

  test('Block chip fires onBlock', () => {
    const onBlock = jest.fn();
    renderItem({ onBlock });
    fireEvent.click(screen.getByTitle('Block'));
    expect(onBlock).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd client && npm test -- --watchAll=false FriendItem`
Expected: FAIL — cannot find module `../components/Friends/FriendItem`.

- [ ] **Step 3: Write the implementation**

Create `client/src/components/Friends/FriendItem.jsx`:

```jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from '@styled-icons/feather/ExternalLink';
import { UserMinus }    from '@styled-icons/feather/UserMinus';
import { UserX }        from '@styled-icons/feather/UserX';
import { ChevronLeft }  from '@styled-icons/feather/ChevronLeft';
import { clampSwipe, shouldOpen, REVEAL } from '../../utils/swipe';
import styles from './FriendsTab.module.css';

export function useIsMobile() {
  const [m, setM] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 720px)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 720px)');
    const fn = (e) => setM(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return m;
}

const initialsOf = (name) => (name || '?').slice(0, 2).toUpperCase();

function FriendRowDesktop({ friend, onRemove, onBlock }) {
  return (
    <div className={styles.friendItem}>
      <div className={styles.friendAvatar}>{initialsOf(friend.username)}</div>
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
}

function FriendRowMobile({ friend, open, setOpen, onRemove, onBlock }) {
  const [tx, setTx] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const txRef = useRef(0);
  const dragging = useRef(false);
  const locked = useRef(null);

  // Reconcile transform when the parent closes this row externally.
  useEffect(() => { if (!open && !dragging.current) setTx(0); }, [open]);

  const down = (e) => {
    startX.current = e.clientX;
    startY.current = e.clientY;
    dragging.current = true;
    locked.current = null;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const move = (e) => {
    if (!dragging.current) return;
    const mx = e.clientX - startX.current;
    const my = e.clientY - startY.current;
    if (locked.current === null && (Math.abs(mx) > 6 || Math.abs(my) > 6)) {
      locked.current = Math.abs(mx) > Math.abs(my) ? 'x' : 'y';
    }
    if (locked.current !== 'x') return;   // vertical drag → let the page scroll
    if (e.cancelable) e.preventDefault();
    const next = clampSwipe(mx, open, REVEAL);
    txRef.current = next;
    setTx(next);
  };

  const up = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (locked.current !== 'x') return;
    if (shouldOpen(txRef.current, REVEAL)) { setTx(-REVEAL); setOpen(true); }
    else { setTx(0); setOpen(false); }
  };

  // Suppress the click that follows a horizontal drag so a swipe never navigates.
  const guardClick = (e) => {
    if (locked.current === 'x') { e.preventDefault(); e.stopPropagation(); }
  };

  return (
    <div className={styles.friendSwipeWrap}>
      <div className={styles.friendSwipeActions} aria-hidden={!open}>
        <button className={`${styles.swipeAct} ${styles.swipeRemove}`} title="Remove friend" onClick={onRemove}>
          <UserMinus /><span>Remove</span>
        </button>
        <button className={`${styles.swipeAct} ${styles.swipeBlock}`} title="Block" onClick={onBlock}>
          <UserX /><span>Block</span>
        </button>
      </div>
      <div
        className={styles.friendItemSwipe}
        style={{ transform: `translateX(${tx}px)`, transition: dragging.current ? 'none' : undefined }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onClickCapture={guardClick}
      >
        <Link to={`/profile/${friend.username}`} className={styles.friendSwipeLink}>
          <div className={styles.friendAvatar}>{initialsOf(friend.username)}</div>
          <div className={styles.friendInfo}>
            <div className={styles.friendName}>{friend.username}</div>
            <div className={styles.friendMeta}>{friend.concertCount || 0} concerts saved</div>
          </div>
        </Link>
        <ChevronLeft className={styles.friendChevron} aria-hidden="true" />
      </div>
    </div>
  );
}

export default function FriendItem(props) {
  return useIsMobile() ? <FriendRowMobile {...props} /> : <FriendRowDesktop {...props} />;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd client && npm test -- --watchAll=false FriendItem`
Expected: PASS — all four `FriendItem` tests green.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/Friends/FriendItem.jsx client/src/__tests__/FriendItem.test.jsx
git commit -m "feat: add swipe-to-reveal FriendItem with desktop/mobile rows"
```

---

### Task 4: Wire `FriendItem` into `FriendsTab`

Remove the inline `FriendItem`, import the new one, add the single-open `openId` state, and clean up now-unused imports.

**Files:**
- Modify: `client/src/components/Friends/FriendsTab.jsx`

- [ ] **Step 1: Replace the imports block**

In `client/src/components/Friends/FriendsTab.jsx`, replace lines 1–19 (the imports) with:

```jsx
import { useState } from 'react';
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
import { Search } from '@styled-icons/feather/Search';
import { Check }  from '@styled-icons/feather/Check';
import { X }      from '@styled-icons/feather/X';
import FriendItem from './FriendItem';
import styles from './FriendsTab.module.css';
```

(Removed: `Link`, `ExternalLink`, `UserMinus`, `UserX` — now owned by `FriendItem`.)

- [ ] **Step 2: Add `openId` state**

Immediately after `const [query, setQuery] = useState('');` add:

```jsx
  const [openId, setOpenId] = useState(null);
```

- [ ] **Step 3: Pass open/setOpen into the mapped rows**

Replace the `filtered.map(...)` block (the `<FriendItem ... />` inside `styles.list`) with:

```jsx
            {filtered.map(f => (
              <FriendItem
                key={f._id}
                friend={f}
                open={openId === f._id}
                setOpen={(v) => setOpenId(v ? f._id : null)}
                onRemove={() => removeFriend({ variables: { friendId: f._id } })}
                onBlock={() => blockUser({ variables: { blockedId: f._id } })}
              />
            ))}
```

- [ ] **Step 4: Delete the inline `FriendItem` definition**

Remove the entire `const FriendItem = ({ friend, onRemove, onBlock }) => { ... };` block (the old lines 141–163). Leave `SideCard`, `CompactItem`, and `EmptyState` intact.

- [ ] **Step 5: Run the FriendsTab + FriendItem suites**

Run: `cd client && npm test -- --watchAll=false FriendsTab FriendItem`
Expected: PASS — existing `FriendsTab` tests still green (they render the desktop row by default), `FriendItem` tests green.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/Friends/FriendsTab.jsx
git commit -m "refactor: use extracted FriendItem and track single open row"
```

---

### Task 5: Swipe CSS (replace the mobile opacity rule)

Swap the stray-tap-prone `@media (max-width: 720px) { .friendActions { opacity: 1 } }` rule for the swipe drawer styles. Desktop rules are untouched.

**Files:**
- Modify: `client/src/components/Friends/FriendsTab.module.css`

- [ ] **Step 1: Replace the mobile media block**

Find this block (near the end of the file):

```css
@media (max-width: 720px) {
  .friendActions { opacity: 1; }
}
```

Replace it with:

```css
/* ── Mobile (≤720px): swipe-to-reveal friend actions ── */
@media (max-width: 720px) {
  .friendSwipeWrap {
    position: relative;
    border-radius: 0.6rem;
    overflow: hidden;
  }
  .friendSwipeActions {
    position: absolute;
    inset: 0 0 0 auto;
    display: flex;
    align-items: stretch;
    gap: 0.5rem;
    padding: 0.4rem 0.4rem 0.4rem 0;
  }
  .swipeAct {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    width: 7.2rem;
    border-radius: 0.9rem;
    border: 1px solid transparent;
    background: none;
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
  }
  .swipeAct svg { width: 1.8rem; height: 1.8rem; }
  .swipeRemove { background: var(--rsvp-no-dim);    border-color: var(--rsvp-no);    color: var(--rsvp-no); }
  .swipeBlock  { background: var(--rsvp-maybe-dim); border-color: var(--rsvp-maybe); color: var(--rsvp-maybe); }

  .friendItemSwipe {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    padding: 1rem 1.2rem;
    background: var(--bg-surface);
    border-radius: 0.6rem;
    transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform;
    touch-action: pan-y;
  }
  .friendSwipeLink {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 1.2rem;
    text-decoration: none;
    color: inherit;
  }
  .friendChevron {
    width: 1.8rem;
    height: 1.8rem;
    color: var(--text-muted);
    flex-shrink: 0;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/components/Friends/FriendsTab.module.css
git commit -m "style: swipe-to-reveal friend action chips on mobile"
```

---

### Task 6: Full verification

- [ ] **Step 1: Run the entire client test suite**

Run: `cd client && npm test -- --watchAll=false`
Expected: PASS — all suites green, including the new `swipe` and `FriendItem` suites (target: prior 55 tests + the new ones).

- [ ] **Step 2: Manual check in the browser**

Run: `npm run develop` (from repo root), open the app at `http://localhost:3002`, log in, go to your own `/profile`, open the **Friends** tab, and narrow the window to ≤720px (or use device emulation). Verify:
- A friend row shows avatar + name + a left chevron; tapping the name/avatar navigates to that friend's profile.
- A left-swipe reveals the **Remove** (red) and **Block** (amber) chips; a vertical scroll does not reveal them and scrolls the page.
- Opening a second row closes the first.
- At >720px, the desktop row still shows View/Remove/Block on hover.

- [ ] **Step 3: Final confirmation**

No code change — confirm the working tree is clean (`git status`) and all commits from Tasks 1–5 are present (`git log --oneline -6`).

---

## Notes

- **Out of scope (deferred):** keyboard/assistive-tech path to reveal Remove/Block on mobile; undo snackbar (explicitly dropped — swipe is the sole accident gate).
- **No GraphQL changes:** `onRemove`/`onBlock` keep calling `REMOVE_FRIEND` (`friendId`) / `BLOCK_USER` (`blockedId`); reconciliation rides the existing 1s poll in `Profile.jsx`.
