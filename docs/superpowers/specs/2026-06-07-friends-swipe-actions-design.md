# Swipe-to-reveal friend actions (mobile) — Design

> Implements Section 8 of `.claude/handoffs/HANDOFF-noisebx-profile (1).md`.
> Date: 2026-06-07 · Branch: `feat/friends-swipe-actions`

## Problem

On the Friends tab, the mobile breakpoint (`≤720px`) forces
`.friendActions { opacity: 1 }`, leaving View / Remove / Block as three
always-live icons sitting directly in the thumb-scroll path. A stray tap can
remove or block a friend instantly. Desktop is fine — hover already gates the
actions against stray mouse activation.

## Decision

- **Mobile (`≤720px`): swipe-to-reveal.** A friend row collapses to
  avatar + name + a chevron. Tapping the **avatar or name** navigates to
  `/profile/:username`. A deliberate **left-swipe** reveals **Remove** / **Block**
  chips. A vertical scroll can never reveal them.
- **Desktop (`>720px`): unchanged.** Existing hover-revealed View / Remove / Block
  icons stay exactly as-is.
- **No undo snackbar.** The swipe gesture is the sole accident gate — revealing
  the actions takes an intentional, sustained gesture, so a revealed Remove/Block
  is treated as committed. Mutations fire immediately (no deferral, no
  compensating re-add).
- **No accessibility fallback this pass.** Swipe is pointer-only on mobile;
  recorded as a known follow-up. Desktop actions remain fully keyboard-reachable.

## Approach

**Pointer Events, JS-gated row swap.**

- `useIsMobile()` — `window.matchMedia('(max-width: 720px)')`, subscribes to
  `change`. Picks the row component; mobile and desktop are different DOM
  structures so the choice is JS-gated, not CSS-only.
- `FriendItem` dispatches: `useIsMobile() ? <FriendRowMobile/> : <FriendRowDesktop/>`.
- `FriendRowDesktop` — current markup (hover icons: View link, Remove, Block).
- `FriendRowMobile` — a swipe wrapper:
  - Collapsed layer: avatar + name wrapped in a `<Link to={/profile/:username}>`,
    plus a chevron affordance. `touch-action: pan-y` so vertical scroll stays
    native.
  - Action layer behind it: Remove / Block chips.
  - Unified `onPointerDown/Move/Up` + `setPointerCapture`. **Axis-lock:** the
    first ~6px of travel decides `x` vs `y`; a `y` lock returns early and lets
    the page scroll. An `x` lock calls `preventDefault()` and drives `transform:
    translateX(...)`.
  - Release past half the reveal width commits open (`setOpen(true)`), else snaps
    closed.
- `FriendsTab` owns a single `openId` (`useState(null)`); each row gets
  `open={openId === f._id}` and `setOpen={(v) => setOpenId(v ? f._id : null)}`,
  so only one row is open at a time.

Rejected alternatives: literal prototype dual touch+mouse handlers (two gesture
paths — the handoff's own production note prefers Pointer Events); CSS-only
scroll-snap (can't axis-lock cleanly or coordinate single-open).

## Action chip colors (reuse RSVP token language)

| Action | Tokens |
|---|---|
| **Remove** | `--rsvp-no` border + icon/label, `--rsvp-no-dim` bg |
| **Block**  | `--rsvp-maybe` border + icon/label, `--rsvp-maybe-dim` bg |

(Matches the handoff: red marks Remove, amber marks Block — a token-consistency
call, not a severity ranking.)

## File structure

The swipe logic adds ~120 lines; inlining would push `FriendsTab.jsx` past ~330
lines, so the row is extracted.

- **New `client/src/components/Friends/FriendItem.jsx`** — `FriendItem`
  dispatcher + `FriendRowDesktop` + `FriendRowMobile` + `useIsMobile`. Imports the
  shared `FriendsTab.module.css`.
- **`client/src/components/Friends/FriendsTab.jsx`** — remove the inline
  `FriendItem`; import it. Add `openId` state; pass `open`/`setOpen` to each row.
  Search, side panels, and the `removeFriend`/`blockUser` handlers are unchanged.
- **`client/src/components/Friends/FriendsTab.module.css`** — replace the
  `@media (max-width: 720px) { .friendActions { opacity: 1 } }` rule with
  swipe-wrap / chip / transform styles. Desktop rules untouched.

## Data flow

No GraphQL changes. `onRemove`/`onBlock` keep calling the existing
`REMOVE_FRIEND` (`friendId`) and `BLOCK_USER` (`blockedId`) mutations.
Reconciliation rides the existing 1s poll in `Profile.jsx` + Apollo cache.

## Testing

- Pure helper `clampSwipe(dx, open)` (clamp + slight overscroll math) extracted
  and unit-tested at the boundaries (closed/open base, min/max clamp, overscroll).
- Component tests (`MockedProvider` + `MemoryRouter`, matching existing suites):
  - mobile row renders avatar/name as a `/profile/:username` link;
  - Remove / Block chips invoke their handlers;
  - desktop row still renders the three hover-action controls.
- Raw pointer-drag physics aren't reliably reproducible in jsdom — covered via
  the `clampSwipe` helper test rather than simulated drags.

## Out of scope / follow-ups

- Keyboard / assistive-tech path to reveal Remove/Block on mobile.
- Undo snackbar (explicitly dropped).
