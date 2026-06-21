# Swipe-to-reveal for Received / Sent / Blocked rows — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the Received / Sent / Blocked user rows the same mobile slide-to-reveal action behavior the friends-list rows already have, by extracting one shared `SwipeRow` component.

**Architecture:** Pull the pointer/translate swipe mechanics out of `FriendRowMobile` into a generic `SwipeRow` (drawer width is measured from the DOM, so 1- or 2-chip drawers both work). `FriendRowMobile` and the Received/Sent/Blocked rows (`CompactItem`) both compose `SwipeRow` on mobile; desktop keeps its existing inline buttons. A single `openId` in `FriendsTab` keeps only one drawer open across the whole tab.

**Tech Stack:** React 18, CSS Modules, `@apollo/client` (MockedProvider in tests), `@testing-library/react`, `react-scripts test` (Jest + jsdom), `@styled-icons/feather`.

**Spec:** `docs/superpowers/specs/2026-06-21-swipe-row-request-blocked-rows-design.md`

## Global Constraints

- Mobile breakpoint is `max-width: 720px` (the `useIsMobile` hook).
- Desktop markup/behavior must NOT change (friends rows: hover buttons; compact rows: inline `.iconBtnSm` buttons).
- Swipe math uses `clampSwipe(mx, open, reveal)` and `shouldOpen(tx, reveal)` from `client/src/utils/swipe.js` — do not modify that file; pass a measured `reveal`.
- Chip color by `kind`: `success`→`--rsvp-yes`, `danger`→`--rsvp-no`, `warn`→`--rsvp-maybe`, `text`→neutral (`--text-secondary` / `--border-mid`).
- Commit messages must NOT include a `Co-Authored-By` line (repo rule).
- Run tests with `CI=true npx react-scripts test --watchAll=false` (optionally `--testPathPattern=...`). The repo is on the `main` branch; create a feature branch before the first commit.

---

### Task 1: Extract `useIsMobile` into a shared util

Move the hook out of `FriendItem.jsx` so both row types can import it without a component-to-component import.

**Files:**
- Create: `client/src/utils/useIsMobile.js`
- Modify: `client/src/components/Friends/FriendItem.jsx` (remove the local hook, import it instead)
- Test (reuse existing): `client/src/__tests__/FriendItem.test.jsx`, `client/src/__tests__/FriendsTab.test.jsx`

**Interfaces:**
- Produces: `useIsMobile(): boolean` — default export AND named export from `client/src/utils/useIsMobile.js`. `true` when `window.matchMedia('(max-width: 720px)').matches`.

- [ ] **Step 1: Create the hook file**

Create `client/src/utils/useIsMobile.js`:

```js
import { useEffect, useState } from 'react';

// True when the viewport is at or below the mobile breakpoint (720px).
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

export default useIsMobile;
```

- [ ] **Step 2: Update `FriendItem.jsx` to import the hook**

In `client/src/components/Friends/FriendItem.jsx`, remove the local `useIsMobile` definition (the `export function useIsMobile() { ... }` block, currently lines ~10-21) and add an import near the top, after the existing imports:

```js
import { useIsMobile } from '../../utils/useIsMobile';
```

Also change the `useState`/`useEffect`/`useRef` import line so it no longer needs `useState` solely for the hook — keep `useEffect, useRef, useState` because `FriendRowMobile` still uses them. (No change needed to that import line; just delete the hook body.)

- [ ] **Step 3: Run the affected suites to verify nothing regressed**

Run: `CI=true npx react-scripts test --testPathPattern="FriendItem|FriendsTab" --watchAll=false`
Expected: PASS (all existing FriendItem + FriendsTab tests green — the hook behaves identically, just relocated).

- [ ] **Step 4: Commit**

```bash
git checkout -b feat/swipe-row-request-blocked
git add client/src/utils/useIsMobile.js client/src/components/Friends/FriendItem.jsx
git commit -m "refactor: extract useIsMobile into utils/useIsMobile"
```

---

### Task 2: Create the shared `SwipeRow` component

The generic swipe-to-reveal row: a drawer of action chips on the right, a sliding card on top, measured reveal distance.

**Files:**
- Create: `client/src/components/shared/SwipeRow/SwipeRow.jsx`
- Create: `client/src/components/shared/SwipeRow/SwipeRow.module.css`
- Test: `client/src/__tests__/SwipeRow.test.jsx`

**Interfaces:**
- Consumes: `clampSwipe`, `shouldOpen` from `client/src/utils/swipe.js`.
- Produces: default export `SwipeRow({ actions, open, setOpen, children })` where
  `actions: Array<{ kind: 'success'|'danger'|'warn'|'text', icon?: ReactNode, label: string, title?: string, onClick: () => void }>`,
  `open: boolean`, `setOpen: (open: boolean) => void`, `children: ReactNode`.
  Chip `title` defaults to `label`. The visible card content is `children` followed by a left-chevron affordance.

- [ ] **Step 1: Write the failing test**

Create `client/src/__tests__/SwipeRow.test.jsx`:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import SwipeRow from '../components/shared/SwipeRow/SwipeRow';

test('renders children and the action chips', () => {
  render(
    <SwipeRow
      actions={[{ kind: 'danger', label: 'Remove', title: 'Remove friend', onClick: () => {} }]}
      open={false}
      setOpen={() => {}}
    >
      <div>Bob</div>
    </SwipeRow>
  );
  expect(screen.getByText('Bob')).toBeInTheDocument();
  // title falls back to label when provided explicitly here it is "Remove friend"
  expect(screen.getByTitle('Remove friend')).toBeInTheDocument();
});

test('a chip fires its onClick when clicked', () => {
  const onClick = jest.fn();
  render(
    <SwipeRow
      actions={[{ kind: 'success', label: 'Accept', onClick }]}
      open={false}
      setOpen={() => {}}
    >
      <div>Carol</div>
    </SwipeRow>
  );
  // title defaults to label ("Accept") when title is omitted
  fireEvent.click(screen.getByTitle('Accept'));
  expect(onClick).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `CI=true npx react-scripts test --testPathPattern=SwipeRow --watchAll=false`
Expected: FAIL — `Cannot find module '../components/shared/SwipeRow/SwipeRow'`.

- [ ] **Step 3: Implement `SwipeRow.jsx`**

Create `client/src/components/shared/SwipeRow/SwipeRow.jsx`:

```jsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft } from '@styled-icons/feather/ChevronLeft';
import { clampSwipe, shouldOpen } from '../../../utils/swipe';
import styles from './SwipeRow.module.css';

// Generic swipe-to-reveal row. `actions` render as chips in a right-hand drawer;
// the drawer's measured width is the reveal distance, so 1- or 2-chip drawers
// both work. Controlled open state lets a parent enforce single-open.
export default function SwipeRow({ actions = [], open, setOpen, children }) {
  const [tx, setTx] = useState(0);
  const [reveal, setReveal] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);
  const txRef = useRef(0);
  const dragging = useRef(false);
  const locked = useRef(null);
  const actionsRef = useRef(null);

  // Measure the drawer so the reveal distance matches the actual chip count/width.
  useLayoutEffect(() => {
    if (actionsRef.current) setReveal(actionsRef.current.offsetWidth);
  }, [actions.length]);

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
    const next = clampSwipe(mx, open, reveal);
    txRef.current = next;
    setTx(next);
  };

  const up = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (locked.current !== 'x') return;
    if (shouldOpen(txRef.current, reveal)) { setTx(-reveal); setOpen(true); }
    else { setTx(0); setOpen(false); }
  };

  // Suppress the click that follows a horizontal drag so a swipe never fires a child.
  const guardClick = (e) => {
    if (locked.current === 'x') { e.preventDefault(); e.stopPropagation(); }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.actions} ref={actionsRef} aria-hidden={!open}>
        {actions.map((a, i) => (
          <button
            key={i}
            className={`${styles.chip} ${styles[`chip_${a.kind}`] || ''}`}
            title={a.title || a.label}
            onClick={a.onClick}
          >
            {a.icon}
            <span>{a.label}</span>
          </button>
        ))}
      </div>
      <div
        className={styles.card}
        style={{ transform: `translateX(${tx}px)`, transition: dragging.current ? 'none' : undefined }}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onClickCapture={guardClick}
      >
        {children}
        <ChevronLeft className={styles.chevron} aria-hidden="true" />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Implement `SwipeRow.module.css`**

Create `client/src/components/shared/SwipeRow/SwipeRow.module.css` (ported and generalized from the existing mobile swipe rules in `FriendsTab.module.css`):

```css
.wrap {
  position: relative;
  border-radius: 0;
  overflow: hidden;
}

.actions {
  position: absolute;
  inset: 0 0 0 auto;
  display: flex;
  align-items: stretch;
  gap: 0.5rem;
  padding: 0.4rem 0.4rem 0.4rem 0;
}

.chip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-width: 7.2rem;
  padding: 0 1rem;
  border-radius: 0.9rem;
  border: 1px solid transparent;
  background: none;
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}
.chip svg { width: 1.8rem; height: 1.8rem; }

.chip_success { background: var(--rsvp-yes-dim);   border-color: var(--rsvp-yes);   color: var(--rsvp-yes); }
.chip_danger  { background: var(--rsvp-no-dim);    border-color: var(--rsvp-no);    color: var(--rsvp-no); }
.chip_warn    { background: var(--rsvp-maybe-dim); border-color: var(--rsvp-maybe); color: var(--rsvp-maybe); }
.chip_text    { background: var(--bg-overlay);     border-color: var(--border-mid); color: var(--text-secondary); }

.card {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.3rem 1rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-dim);
  border-radius: 0;
  transition: transform 0.26s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
  touch-action: pan-y;
}

.chevron {
  width: 1.8rem;
  height: 1.8rem;
  color: var(--text-muted);
  flex-shrink: 0;
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `CI=true npx react-scripts test --testPathPattern=SwipeRow --watchAll=false`
Expected: PASS (both tests).

- [ ] **Step 6: Commit**

```bash
git add client/src/components/shared/SwipeRow/ client/src/__tests__/SwipeRow.test.jsx
git commit -m "feat: add shared SwipeRow swipe-to-reveal component"
```

---

### Task 3: Refactor `FriendRowMobile` onto `SwipeRow`

Replace the inline swipe mechanics in the friends mobile row with `SwipeRow`, and delete the now-dead friends-specific swipe CSS.

**Files:**
- Modify: `client/src/components/Friends/FriendItem.jsx` (`FriendRowMobile`)
- Modify: `client/src/components/Friends/FriendsTab.module.css` (remove dead swipe rules; keep `.friendSwipeLink`)
- Test (reuse existing): `client/src/__tests__/FriendItem.test.jsx`

**Interfaces:**
- Consumes: `SwipeRow` (Task 2), `useIsMobile` (Task 1).
- Produces: no new exports. `FriendRowMobile` renders a `SwipeRow` whose children are the existing profile `Link` (`.friendSwipeLink`) with avatar + name + meta, and whose actions are Remove (`danger`) and Block (`warn`).

- [ ] **Step 1: Confirm the existing FriendItem tests describe the behavior to preserve**

These already exist and must stay green (no edit): mobile "name/avatar link points at the friend profile" (link `href=/profile/bob`) and mobile "Block chip fires onBlock" (`getByTitle('Block')`). Re-read `client/src/__tests__/FriendItem.test.jsx` to confirm the titles/labels you must keep: chip titles `Block` and `Remove friend`.

- [ ] **Step 2: Rewrite `FriendRowMobile`**

In `client/src/components/Friends/FriendItem.jsx`, add the import (top, with the other imports):

```js
import SwipeRow from '../shared/SwipeRow/SwipeRow';
```

Replace the entire `FriendRowMobile` function (currently the block from `function FriendRowMobile(` through its closing `}` before `export default function FriendItem`) with:

```jsx
function FriendRowMobile({ friend, open, setOpen, onRemove, onBlock }) {
  const actions = [
    { kind: 'danger', icon: <UserMinus />, label: 'Remove', title: 'Remove friend', onClick: onRemove },
    { kind: 'warn',   icon: <UserX />,     label: 'Block',  title: 'Block',         onClick: onBlock },
  ];
  return (
    <SwipeRow actions={actions} open={open} setOpen={setOpen}>
      <Link to={`/profile/${friend.username}`} className={styles.friendSwipeLink}>
        <div className={styles.friendAvatar}>{initialsOf(friend.username)}</div>
        <div className={styles.friendInfo}>
          <div className={styles.friendName}>{friend.username}</div>
          <div className={styles.friendMeta}>{friend.concertCount || 0} concerts saved</div>
        </div>
      </Link>
    </SwipeRow>
  );
}
```

Then remove the now-unused imports in this file: `clampSwipe, shouldOpen, REVEAL` (the `import { clampSwipe, shouldOpen, REVEAL } from '../../utils/swipe';` line) and `ChevronLeft` (`import { ChevronLeft } from '@styled-icons/feather/ChevronLeft';`). Keep `UserMinus`, `UserX`, `ExternalLink`, `Link`, `useEffect`, `useRef`, `useState` (still used by `FriendRowDesktop` / `FriendItem`). Note: `useEffect`/`useRef`/`useState` are no longer used after this refactor — verify and remove any that are now unused to avoid lint noise. (After this change `FriendRowDesktop` uses none of them and `FriendRowMobile` uses none; remove `useEffect, useRef, useState` from the React import if nothing else references them.)

- [ ] **Step 3: Remove dead swipe CSS from `FriendsTab.module.css`**

In `client/src/components/Friends/FriendsTab.module.css`, inside the `@media (max-width: 720px)` block, delete the rules that `SwipeRow.module.css` now owns: `.friendSwipeWrap`, `.friendSwipeActions`, `.swipeAct`, `.swipeAct svg`, `.swipeRemove`, `.swipeBlock`, `.friendItemSwipe`, and `.friendChevron`. **Keep `.friendSwipeLink`** (the profile link still uses it). Keep all the full-bleed layout rules (`.list`, `.empty`, `.sideCard`, `.sideCardBody`, `.sideCardHeader`).

- [ ] **Step 4: Run the FriendItem + FriendsTab suites**

Run: `CI=true npx react-scripts test --testPathPattern="FriendItem|FriendsTab" --watchAll=false`
Expected: PASS (friends desktop + mobile behavior unchanged; mobile Block chip still `getByTitle('Block')`, profile link still `/profile/bob`).

- [ ] **Step 5: Commit**

```bash
git add client/src/components/Friends/FriendItem.jsx client/src/components/Friends/FriendsTab.module.css
git commit -m "refactor: drive FriendRowMobile through shared SwipeRow"
```

---

### Task 4: Add swipe to the Received / Sent / Blocked rows (`CompactItem`)

Give `CompactItem` a desktop/mobile split; on mobile it renders `SwipeRow` using the `actions` array it already receives. Thread the single-open `openId` from `FriendsTab`.

**Files:**
- Modify: `client/src/components/Friends/FriendsTab.jsx` (`CompactItem` + the three `CompactItem` usages)
- Test: `client/src/__tests__/FriendsTab.test.jsx` (add mobile swipe tests)

**Interfaces:**
- Consumes: `SwipeRow` (Task 2), `useIsMobile` (Task 1), `FriendsTab`'s existing `openId`/`setOpenId` state, and the existing `acceptRequest`/`declineRequest`/`cancelRequest`/`unblockUser` mutation handlers.
- Produces: `CompactItem({ entry, sub, actions, open, setOpen })`. On mobile renders `SwipeRow`; on desktop renders the current `.compactItem` inline-button markup unchanged.

- [ ] **Step 1: Write the failing test**

In `client/src/__tests__/FriendsTab.test.jsx`, add these imports at the top (next to the existing ones):

```jsx
import { ACCEPT_FRIEND_REQUEST, UNBLOCK_USER } from '../utils/mutations';
```

Then append this describe block at the end of the file:

```jsx
describe('mobile swipe rows (Received / Sent / Blocked)', () => {
  const realMatchMedia = window.matchMedia;
  beforeEach(() => {
    window.matchMedia = (query) => ({
      matches: true, media: query, onchange: null,
      addListener: jest.fn(), removeListener: jest.fn(),
      addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn(),
    });
  });
  afterEach(() => { window.matchMedia = realMatchMedia; });

  test('Accept chip on a received request fires acceptRequest', async () => {
    let accepted = false;
    const mocks = [{
      request: { query: ACCEPT_FRIEND_REQUEST, variables: { senderId: 'r1', senderName: 'carol' } },
      result: () => { accepted = true; return { data: { acceptRequest: 'friends forever' } }; },
    }];
    const user = { ...baseUser, receivedRequests: [{ _id: 'r1', username: 'carol' }] };
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <FriendsTab user={user} />
        </MemoryRouter>
      </MockedProvider>
    );
    fireEvent.click(screen.getByTitle('Accept'));
    await waitFor(() => expect(accepted).toBe(true));
  });

  test('Unblock chip on a blocked user fires unblockUser', async () => {
    let unblocked = false;
    const mocks = [{
      request: { query: UNBLOCK_USER, variables: { blockedId: 'b1' } },
      result: () => { unblocked = true; return { data: { unblockUser: { username: 'me', blockedUsers: [] } } }; },
    }];
    const user = { ...baseUser, blockedUsers: [{ _id: 'b1', username: 'eve' }] };
    render(
      <MockedProvider mocks={mocks}>
        <MemoryRouter>
          <FriendsTab user={user} />
        </MemoryRouter>
      </MockedProvider>
    );
    fireEvent.click(screen.getByTitle('Unblock'));
    await waitFor(() => expect(unblocked).toBe(true));
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `CI=true npx react-scripts test --testPathPattern=FriendsTab --watchAll=false`
Expected: FAIL — on mobile the current `CompactItem` still renders inline `.iconBtnSm` buttons whose title for Unblock is the label `Unblock` (this one may pass), but the Accept chip title path and single-open wiring aren't there yet. At minimum the new tests fail to find the mobile `SwipeRow` chips as specified. (If a test happens to pass against the inline buttons, that's fine — the goal is the mobile branch renders `SwipeRow`; Step 3 makes both pass via `SwipeRow`.)

- [ ] **Step 3: Add the desktop/mobile split to `CompactItem`**

In `client/src/components/Friends/FriendsTab.jsx`, add imports (top, with existing imports):

```js
import { useIsMobile } from '../../utils/useIsMobile';
import SwipeRow from '../shared/SwipeRow/SwipeRow';
```

Replace the entire `CompactItem` component with:

```jsx
const CompactItem = ({ entry, sub, actions = [], open, setOpen }) => {
  const isMobile = useIsMobile();
  const initials = (entry.username || '?').slice(0, 2).toUpperCase();

  const body = (
    <>
      <div className={styles.compactAvatar}>{initials}</div>
      <div className={styles.compactInfo}>
        <div className={styles.compactName}>{entry.username}</div>
        <div className={styles.compactSub}>{sub}</div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <SwipeRow actions={actions} open={open} setOpen={setOpen}>
        {body}
      </SwipeRow>
    );
  }

  return (
    <div className={styles.compactItem}>
      {body}
      <div className={styles.compactActions}>
        {actions.map((a, i) => (
          <button
            key={i}
            className={`${styles.iconBtnSm} ${styles[`iconBtn_${a.kind}`] || ''}`}
            title={a.title || a.label}
            onClick={a.onClick}
          >
            {a.icon || a.label}
          </button>
        ))}
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Thread `open`/`setOpen` into the three `CompactItem` usages**

In the `<aside className={styles.sidePanel}>` block, add `open`/`setOpen` props to each `CompactItem` (Received, Sent, Blocked). For the Received card:

```jsx
{received.map(r => (
  <CompactItem
    key={r._id}
    entry={r}
    sub="wants to be friends"
    open={openId === r._id}
    setOpen={(v) => setOpenId(v ? r._id : null)}
    actions={[
      { kind: 'success', icon: <Check />, label: 'Accept',  onClick: () => acceptRequest({ variables: { senderId: r._id, senderName: r.username } }) },
      { kind: 'danger',  icon: <X />,     label: 'Decline', onClick: () => declineRequest({ variables: { senderId: r._id, senderName: r.username } }) },
    ]}
  />
))}
```

For the Sent card, add the same two props keyed by `r._id`:

```jsx
    open={openId === r._id}
    setOpen={(v) => setOpenId(v ? r._id : null)}
```

For the Blocked card, add them keyed by `b._id`:

```jsx
    open={openId === b._id}
    setOpen={(v) => setOpenId(v ? b._id : null)}
```

(`openId` / `setOpenId` already exist in `FriendsTab` — they are the same state the friends list uses, so opening a request row also closes any open friend row.)

- [ ] **Step 5: Run the FriendsTab suite**

Run: `CI=true npx react-scripts test --testPathPattern=FriendsTab --watchAll=false`
Expected: PASS (the two new mobile-swipe tests plus all existing FriendsTab tests — the existing rendering tests run on the default desktop `matchMedia`, so they hit the inline-button branch unchanged).

- [ ] **Step 6: Run the full suite**

Run: `CI=true npx react-scripts test --watchAll=false`
Expected: PASS — all suites green (no regressions across the app).

- [ ] **Step 7: Commit**

```bash
git add client/src/components/Friends/FriendsTab.jsx client/src/__tests__/FriendsTab.test.jsx
git commit -m "feat: swipe-to-reveal actions on Received/Sent/Blocked rows"
```

---

## Manual Verification (after Task 4)

On a ≤720px viewport (browser devtools device mode):
- Each Received / Sent / Blocked row slides left to reveal its chip(s): Received → Accept + Decline; Sent → Cancel; Blocked → Unblock.
- Tapping a chip performs the action (request disappears / unblocks).
- Opening one row closes any other open row — including an open friends-list row.
- Desktop (>720px) still shows inline buttons on all rows; friends rows still reveal on hover.
- Rows remain full-bleed (wall-to-wall) with content ~1rem from the viewport edge, matching the Concerts rows.

## Self-Review Notes (coverage)

- Spec "new SwipeRow (measured reveal)" → Task 2. "Refactor FriendRowMobile" → Task 3. "CompactItem desktop/mobile split + single openId" → Task 4. "useIsMobile to utils" → Task 1. "Chip color mapping" → Task 2 CSS. "Keep FriendItem/FriendsTab tests green; add SwipeRow + compact mobile tests" → Tasks 2–4. "Remove dead friends swipe CSS, keep full-bleed rules" → Task 3 Step 3.
- Decline / Cancel chips are exercised transitively by the same mobile branch as Accept/Unblock; Accept (2-chip Received) and Unblock (1-chip Blocked, `text` kind) together cover both drawer sizes and an icon-less chip.
