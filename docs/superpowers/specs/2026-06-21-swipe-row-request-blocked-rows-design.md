# Swipe-to-reveal for Received / Sent / Blocked rows

**Date:** 2026-06-21
**Status:** Approved (pending spec review)
**Area:** `psychic-rotary-system` — Profile › Friends tab

## Problem

On mobile, the **friends-list rows** slide left to reveal their actions (Remove / Block) via
`FriendRowMobile` in `client/src/components/Friends/FriendItem.jsx`. The **user rows inside the
Received / Sent / Blocked cards** (rendered by the `CompactItem` component in
`client/src/components/Friends/FriendsTab.jsx`, class `.compactItem`) do **not** — their action
buttons are always shown inline. We want those rows to gain the same slide-to-reveal behavior on
mobile so all four row types are consistent.

"Compact rows" throughout this spec means the `CompactItem` user rows in the Received / Sent /
Blocked side cards:

- **Received** — one row per pending request; actions: **Accept**, **Decline**
- **Sent** — one row per sent request; action: **Cancel**
- **Blocked** — one row per blocked user; action: **Unblock**

## Goals

- Compact rows slide to reveal their actions on mobile (≤720px), matching the friends rows.
- Desktop behavior is **unchanged**: compact rows keep their always-visible inline buttons; friends
  rows keep their hover buttons.
- The swipe mechanics live in **one** place, shared by both the friends rows and the compact rows.
- Action drawers vary in size (Received has 2 actions; Sent and Blocked have 1) and the reveal
  distance adapts automatically.

## Non-Goals

- No change to desktop layout or to the inline-button markup on desktop.
- No change to the underlying mutations or GraphQL.
- No swipe on the search bar, section header, or empty states.

## Decisions (from brainstorming)

1. **Desktop unchanged** — swipe is added only on mobile; desktop keeps inline buttons.
2. **Extract a shared `SwipeRow` component** — both `FriendRowMobile` and the compact rows use it.
   The drawer width is **measured** rather than hardcoded, so 1- or 2-chip drawers both work.

## Architecture

### New: `components/shared/SwipeRow/SwipeRow.jsx` (+ `SwipeRow.module.css`)

A single, generic swipe-to-reveal row. It owns all of the pointer/translate mechanics that
currently live inline in `FriendRowMobile`.

**Props**

| Prop | Type | Purpose |
|------|------|---------|
| `actions` | `Array<{ kind, icon?, label, title?, onClick }>` | Chips rendered in the right-hand drawer. `kind` selects the chip color (see below). `label` is the visible chip text; `title` is the hover/accessible string and **defaults to `label`** when omitted. `icon` is optional (text-only chips like Unblock omit it). |
| `open` | `boolean` | Controlled open state (drawer revealed). |
| `setOpen` | `(open: boolean) => void` | Notifies the parent so it can enforce single-open. |
| `children` | `ReactNode` | The visible row content (avatar + name + meta/sub, or a profile `Link`). |

**Behavior**

- Pointer `down`/`move`/`up`/`cancel` handlers with an x-vs-y intent lock (≥6px), identical to the
  current `FriendRowMobile` logic. Vertical drags let the page scroll; horizontal drags translate
  the card and call `preventDefault` when cancelable.
- A click-guard (`onClickCapture`) suppresses the click that follows a horizontal drag, so a swipe
  never triggers a child click/navigation.
- `translateX` is clamped with `clampSwipe(mx, open, reveal)` and committed with
  `shouldOpen(tx, reveal)` from `utils/swipe.js`. **`reveal` is the measured pixel width of the
  drawer**, read from a ref via `offsetWidth` in a layout effect (and re-measured if `actions`
  change). `utils/swipe.js` already accepts a `reveal` argument, so it is unchanged; the hardcoded
  `REVEAL = 158` export remains for any caller that wants a default but is no longer used by these
  rows.
- Reconciles `translateX` back to 0 when the parent closes the row externally (`open === false`
  while not dragging) — same as today.

**Structure (rendered)**

```
.wrap (position: relative; overflow: hidden)
  .actions (absolute, right; ref measured for reveal)   ← chips, aria-hidden={!open}
  .card   (translateX; pointer handlers; onClickCapture) ← children + .chevron affordance
```

**Chip color by `kind`** (in `SwipeRow.module.css`):

| `kind` | Color token | Used by |
|--------|-------------|---------|
| `success` | `--rsvp-yes` (green) | Accept |
| `danger` | `--rsvp-no` (red) | Decline, Cancel, friends' Remove |
| `warn` | `--rsvp-maybe` (amber) | friends' Block |
| `text` | neutral (`--text-secondary` / `--border-mid`) | Unblock |

Chips keep the visual style of the current friends chips (`.swipeAct`): a fixed-ish width column
with optional icon over a label. Text-only chips (no icon) render just the label.

### Refactor: `FriendItem.jsx`

- `FriendRowMobile` is rewritten to render
  `<SwipeRow actions={[remove, block]}>{profileLink}</SwipeRow>`, where:
  - `remove = { kind: 'danger', icon: <UserMinus/>, label: 'Remove', onClick: onRemove }`
  - `block  = { kind: 'warn',   icon: <UserX/>,     label: 'Block',  onClick: onBlock }`
  - children = the existing `Link` to `/profile/:username` with avatar + name + meta.
- `FriendRowDesktop` is unchanged.
- The current chip `title`s (`Remove friend`, `Block`) are preserved as the chip `label`/`title`
  so existing tests keep matching. (Note: today's mobile Remove chip has `title="Remove friend"`
  while its visible text is "Remove"; to preserve the test that does `getByTitle('Block')` and keep
  labels readable, chips will use `label` for visible text and `title` for the accessible/title
  string. Friends chips pass `label: 'Remove'`/`'Block'` with `title: 'Remove friend'`/`'Block'`.)

### Refactor: `FriendsTab.jsx` — `CompactItem`

Give `CompactItem` the same desktop/mobile split as `FriendItem`:

- **Desktop** (`!isMobile`): the current inline `.iconBtnSm` buttons — unchanged.
- **Mobile** (`isMobile`): `<SwipeRow actions={actions} open={open} setOpen={setOpen}>` wrapping the
  avatar + name + sub. The `actions` array is already passed into `CompactItem` by `SideCard` in the
  exact `{ kind, icon, label, onClick }` shape `SwipeRow` expects, so it feeds straight through.
  - The existing `kind` values are `success` / `danger` / `text`; these already map to the chip
    color table above. (Compact rows do not use `warn`.)
- `CompactItem` gains `open` / `setOpen` props, wired from `FriendsTab`'s existing `openId` state,
  keyed by `entry._id`:
  `open={openId === entry._id}` and `setOpen={(v) => setOpenId(v ? entry._id : null)}`.
  Because every friend / request / blocked entry has a unique `_id`, the single `openId` enforces
  "only one drawer open anywhere in the tab" across both lists.

### Shared hook: `utils/useIsMobile.js`

`useIsMobile` currently lives in and is exported from `FriendItem.jsx`. Move it to
`client/src/utils/useIsMobile.js` (same implementation: `matchMedia('(max-width: 720px)')` with a
change listener). `FriendItem.jsx` and `FriendsTab.jsx` both import it. Update any existing importer
of `useIsMobile` from `FriendItem`.

### CSS

- New `SwipeRow.module.css` holds `.wrap`, `.actions`, `.card`, `.chevron`, `.chip`, and the
  `.chip_success` / `.chip_danger` / `.chip_warn` / `.chip_text` color classes. These are ported
  from the existing mobile swipe rules in `FriendsTab.module.css`
  (`.friendSwipeWrap`, `.friendSwipeActions`, `.swipeAct`, `.friendItemSwipe`, `.friendChevron`,
  etc.), generalized.
- The friends-row-specific swipe rules in `FriendsTab.module.css` are removed once
  `FriendRowMobile` no longer uses them. The wall-to-wall / full-bleed layout rules for `.list`,
  `.empty`, `.sideCard`, `.sideCardBody`, `.sideCardHeader` stay where they are.
- The compact-row card, when wrapped in `SwipeRow` on mobile, must preserve the **1rem
  wall-to-content** padding established for the side cards (matching the Concerts rows). The card's
  inner padding lands at 1rem from the viewport edge as it does now.

## Data flow

```
FriendsTab
  openId / setOpenId  ─────────────┬──────────────────────────────┐
                                   │                              │
  friends.map → FriendItem         │   received/sent/blocked.map → CompactItem
     (mobile) FriendRowMobile      │      (mobile) SwipeRow            (desktop) inline buttons
        → SwipeRow(actions=[Remove,Block])   → actions=[Accept,Decline] | [Cancel] | [Unblock]
            measures drawer width → clampSwipe/shouldOpen (utils/swipe.js)
            chip.onClick → existing mutation handlers (unchanged)
```

The action `onClick`s are the existing mutation calls (`acceptRequest`, `declineRequest`,
`cancelRequest`, `unblockUser`, `removeFriend`, `blockUser`); none change.

## Testing

- **Keep green:** `FriendItem.test.jsx` (desktop View/Remove/Block; mobile profile link; mobile
  Block chip fires `onBlock`) and `FriendsTab.test.jsx` (all current rendering/filtering tests).
- **New — `SwipeRow.test.jsx`:** renders children + an action drawer; a chip's `onClick` fires when
  clicked; chip `title` is present.
- **New — compact mobile swipe (in `FriendsTab.test.jsx` or a focused test):** with mobile matchMedia
  mocked, Accept / Decline / Cancel / Unblock chips fire their respective handlers. (Note: the test
  env already supports `matchMedia` because `FriendsTab.test.jsx` renders `FriendItem`, which uses
  `useIsMobile`, today.)
- Reveal-width measurement: `offsetWidth` is `0` in jsdom, so swipe-distance math isn't unit-tested;
  behavior is verified by the chip-fires-handler tests (which don't depend on a real drag) plus
  manual device verification.

## Manual verification

On a ≤720px viewport: each Received / Sent / Blocked row slides left to reveal its chip(s); the chip
fires the right action; opening one row closes any other open row (including an open friends row);
desktop still shows inline buttons.

## Risks

- Refactoring the working `FriendRowMobile` could regress the friends swipe. Mitigated by preserving
  chip `title`s/labels and the profile link, and by the existing FriendItem tests.
- Single shared `openId` across both lists assumes globally-unique `_id`s (true — they are Mongo
  ObjectIds).
```
