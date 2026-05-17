# Show Page Redesign — Spec

**Date:** 2026-05-17  
**Handoff:** `.claude/handoffs/HANDOFF-noisebx-show.md`  
**Branch:** `feat/noisebox-home`

---

## Overview

Full redesign of the Show detail page and its RSVP components. The new layout replaces the old `ShowCard` + icon-heavy header with a structured back bar, large hero section, two-column details grid, action buttons row, and a dedicated RSVP block at the bottom.

---

## Files Changed

### New files
| Path | Purpose |
|---|---|
| `client/src/pages/Show.module.css` | Show page layout styles |
| `client/src/components/shared/ConcertRSVP/ConcertRSVP.module.css` | Three-card RSVP option styles |
| `client/src/components/DisabledConcertRSVP/DisabledConcertRSVP.module.css` | Logged-out counts + CTA styles |

### Rewritten files
| Path | Change |
|---|---|
| `client/src/pages/Show.jsx` | Full rewrite — new layout, drops PlusMinus/BackButton/ShowCard |
| `client/src/components/shared/ConcertRSVP/index.js` | Full rewrite — single self-contained component |
| `client/src/components/DisabledConcertRSVP/index.js` | Full rewrite — counts + login CTA |

### Untouched (deprecated on Show page only)
`RsvpYes`, `RsvpNo`, `RsvpMaybe`, `CheckedYes`, `UncheckedYes`, `CheckedNo`, `UncheckedNo`, `CheckedMaybe`, `UncheckedMaybe`, `RsvpCount` — left in place, no longer called from Show.

---

## Show.jsx

Full rewrite. Key structure:

```
<main>
  <div.page fade-up>
    Back bar           — ArrowLeft button + date pill (Today / Tomorrow / weekday)
    Hero section       — date line, giant artist name, venue link with ExternalLink icon
    Details grid       — two columns: When+Where (left), Contact (right); each row uses DetailRow subcomponent
    Actions section    — Get Tickets (primary), Google Maps, Waze, Call venue
    RSVP block         — heading + subtext + ConcertRSVP (logged in) or DisabledConcertRSVP (logged out)
  </div>
</main>
```

- `DetailRow` is a file-local subcomponent (icon box + label + value + optional sub-line)
- Guards against missing `location.state` with a "Show not found" fallback
- Day label: "Today" / "Tomorrow" / weekday name, computed from `concert.date`
- Google Maps and Waze URLs use `encodeURIComponent` on venue + address
- No `PlusMinus`, no `BackButton` component, no `ShowCard`
- All icons from `@styled-icons/feather`

---

## ConcertRSVP (logged-in state)

Single self-contained component. Approach A chosen over keeping child components or extracting a hook.

**Data:**
- `userId` from `GlobalState` via `useContext(ConcertContext)` → `user?.me?._id`
- `GET_CONCERT_BY_ID` query for live yes/no/maybe arrays

**Active state detection:**
```js
yes.some(u => u._id === userId)   // not .includes() — arrays contain {_id} objects
```

**Toggle logic in `handleClick(type)`:**
- If `type === myRSVP` → call `CANCEL_RSVP_*` mutation (deselect)
- Otherwise → call `RSVP_*` mutation (select)
- All mutations pass `{ concertId, userId }` — required by server schema

**UI:** Three cards in a 1fr 1fr 1fr grid. Each card shows a circular icon, label (Yes / Maybe / No), and count ("N people"). Active card uses `--rsvp-yes/no/maybe` token for border, background, icon, and label color. Mobile: stacks to 1 column with row layout per card.

---

## DisabledConcertRSVP (logged-out state)

- Same `GET_CONCERT_BY_ID` query for live counts
- Three plain number+label pairs (Yes / Maybe / No) in a flex row
- `<Link to="/login">` styled as a full-width primary button below the counts
- No mutation logic, no auth dependency

---

## Adaptations from Handoff

| Handoff code | Actual implementation |
|---|---|
| `yes.includes(currentUserId)` | `yes.some(u => u._id === userId)` — arrays contain objects |
| `currentUserId` prop on ConcertRSVP | Sourced from GlobalState inside the component |
| `handleClick` calls add mutation only | Toggle: cancel if already selected, add otherwise |
| Mutations called with `{ concertId }` | Called with `{ concertId, userId }` — server requires both |

---

## Out of Scope

- Friends going avatar stack (handoff section 6) — deferred, requires query extension
- "View logged out" prototype toggle — not shipped, production uses `Auth.loggedIn()`
