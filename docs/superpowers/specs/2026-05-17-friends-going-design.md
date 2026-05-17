# Friends Going — Spec

**Date:** 2026-05-17  
**Feature:** Friends Going avatar section on Show page  
**Branch:** `feat/noisebox-home`

---

## Overview

Show a "Friends Going" strip below the RSVP cards on the Show detail page. Displays initials avatars for friends who RSVPd Yes, with an overflow pill and a static count line. Logged-in only. No server changes required.

---

## Files Changed

### New files
| Path | Purpose |
|---|---|
| `client/src/components/shared/FriendsGoing/index.js` | Friends Going component |
| `client/src/components/shared/FriendsGoing/FriendsGoing.module.css` | Styles |
| `client/src/components/shared/FriendsGoing/FriendsGoing.test.js` | Tests |

### Modified files
| Path | Change |
|---|---|
| `client/src/utils/queries.js` | Add `username` to `yes` fields in `GET_CONCERT_BY_ID` |
| `client/src/pages/Show.jsx` | Add `<FriendsGoing concertId={concert._id} />` below `<ConcertRSVP />` in logged-in branch |

---

## Data Layer

`GET_CONCERT_BY_ID` in `queries.js` gains `username` on the `yes` selection:

```graphql
yes { _id username }
```

No server changes — the schema already resolves `yes` as `[User]` with `username` available. `ConcertRSVP` and `FriendsGoing` use the same query document so Apollo serves `FriendsGoing` from cache with no extra network request.

---

## FriendsGoing Component

**Props:** `concertId: string`

**Data sources:**
- `useQuery(GET_CONCERT_BY_ID, { variables: { concertId } })` → `data.concert.yes` (array of `{ _id, username }`)
- `useContext(ConcertContext)` → `user.me.friends` (array of `{ _id, username }`)

**Logic:**
```js
const friendsGoing = yes.filter(u => friends.some(f => f._id === u._id));
```

Renders nothing (`null`) when `friendsGoing.length === 0`.

**Initials:** first letter of each space-separated word in `username`, uppercased, max 2 characters. Single-word username → first 2 letters.

**Avatar display:** up to 4 avatars shown. If `friendsGoing.length > 4`, show first 4 + a `+N` overflow chip.

**"Click to see all":** plain non-interactive `<span>` — no onClick, no routing. Wired up in a future iteration.

---

## Visual Design

**Container:**
- `background: var(--bg-surface)`
- `border: 1px solid var(--border-dim)`
- `border-radius: 1.2rem`
- `padding: 1.6rem 2rem`
- `margin-top: 1.6rem`

**Header row** (flex, space-between):
- Left: "FRIENDS GOING" — `var(--font-mono)`, `0.85rem`, `letter-spacing: 0.16em`, `text-transform: uppercase`, `color: var(--text-muted)`
- Right: "**N** of your friends · click to see all" — `var(--font-mono)`, `1rem`, number in `var(--accent-hi)`, rest in `var(--text-muted)`

**Avatar row** (flex, gap `0.6rem`, margin-top `1.2rem`):
- Each chip: `3.2rem` circle, `background: var(--bg-raised)`, `border: 1px solid var(--border-mid)`, initials in `var(--font-mono)` `1rem` `var(--text-secondary)`
- Overflow chip (`+N`): same size, `background: var(--accent-dim)`, `border-color: var(--accent-mid)`, text `var(--accent-hi)`

---

## Show.jsx Integration

Inside the logged-in RSVP block, after `<ConcertRSVP concertId={concert._id} />`:

```jsx
import FriendsGoing from '../components/shared/FriendsGoing';
// ...
{loggedIn ? (
  <>
    <ConcertRSVP concertId={concert._id} />
    <FriendsGoing concertId={concert._id} />
  </>
) : (
  <DisabledConcertRSVP concertId={concert._id} />
)}
```

---

## Out of Scope

- "Click to see all" interaction (modal, routing) — deferred
- Friends who RSVPd Maybe or No — only Yes is shown
- Avatar photos — initials only
