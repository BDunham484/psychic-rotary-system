# Noisebox Home Page Redesign — Design Spec

**Date:** 2026-05-17
**Handoff source:** `.claude/handoffs/HANDOFF-noisebx-home (1).md`
**Branch:** `feat/noisebox-home` (create before touching any code)

---

## Overview

Full visual redesign of the noisebox home page. Replaces the existing flat-nav header, compact datepicker utility bar, toggle-gated sort bar, and ShowCard list with a frosted-glass header + hamburger drawer, large date hero, always-visible control bar, and editorial concert rows.

---

## Decisions & Deviations from Handoff

### 1. tokens.css
The handoff treats `tokens.css` as a pre-existing file. It does not exist yet. **Create it as a new standalone file** at `client/src/tokens.css`, imported at the top of `client/src/index.css`. Contains the full token set from handoff section 1 (surfaces, borders, text, accent, RSVP semantics, typography, layout variables).

### 2. Venue search — stays inline
The handoff mentions a dedicated `/venues` route. No such route exists. The Search button in ControlBar and the "Venue search" drawer link both keep the **existing inline behavior**: selecting `mode === 'search'` renders the existing `VenueSearch` component in place of the concert list. No new route needed.

### 3. PlusMinus — restyled, logic unchanged
The handoff's `RSVPCluster` (tri-state cycle: + → ✓ → ? → ✕) is **deferred** to a follow-up. For this handoff, the existing `PlusMinus` component keeps its current add/remove logic and mutations (`ADD_CONCERT_TO_USER` / `DELETE_CONCERT_FROM_USER`). The button is restyled to match the new square shape and dimensions from the handoff CSS.

### 4. Attendance dots — aggregate counts
The right-side yes/maybe dots on each concert row show **aggregate counts** (how many total users RSVPed yes/maybe to that concert). This requires adding `yes { _id }` and `maybe { _id }` to the four sorted concert queries. Counts are derived from array lengths. The `no` count is omitted from the row display.

### 5. Artist sort query names
The handoff references `GET_CONCERTS_SORTED_BY_ARTIST_ASC/DESC`. The actual query names in `queries.js` are `GET_CONCERTS_SORTED_BY_ARTISTS_ASC/DESC` (note: "ARTISTS" not "ARTIST"). Use the existing names.

---

## Architecture

### New files
| Path | Purpose |
|---|---|
| `client/src/tokens.css` | Design token definitions (CSS custom properties) |
| `client/src/components/Header/Header.module.css` | Header + drawer styles |
| `client/src/components/DateNav/DateNav.jsx` | Date hero with prev/next + calendar picker |
| `client/src/components/DateNav/DateNav.module.css` | |
| `client/src/components/ControlBar/ControlBar.jsx` | Always-visible sort/search bar |
| `client/src/components/ControlBar/ControlBar.module.css` | |
| `client/src/components/shared/ScrollButton/ScrollButton.module.css` | Restyled scroll-to-top |
| `client/src/pages/Home.module.css` | Home page wrapper styles |

### Modified files
| Path | Change |
|---|---|
| `client/src/index.css` | Import `tokens.css`; add dot-grid body background + fade-up keyframe; remove old header/utility-bar/sort-filter/show-card/top-o-page global styles |
| `client/public/index.html` | Update Google Fonts: Space Grotesk + Space Mono + DM Sans (replaces Kodchasan/Bungee/Montserrat) |
| `client/src/components/Header/index.js` | Full rewrite — wordmark + cube + hamburger drawer |
| `client/src/components/ConcertList/ConcertList.jsx` | Full rewrite — editorial `ConcertRow` layout with restyled PlusMinus + attendance dots |
| `client/src/components/ConcertList/ConcertList.module.css` | Full restyle for editorial rows |
| `client/src/components/shared/ScrollButton/index.js` | Restyle + fix scroll listener (useEffect + cleanup) |
| `client/src/pages/Home.jsx` | Full rewrite — imports DateNav + ControlBar + ConcertList; removes optionsOpen toggle |
| `client/src/utils/queries.js` | Add `yes { _id }` and `maybe { _id }` to all four sorted concert queries |

### Deprecated (stop importing, can delete after)
| Path | Notes |
|---|---|
| `client/src/components/UtilityBar/UtilityBar.jsx` | Replaced by `DateNav` |
| `client/src/components/SortFilterBar/SortFilterBar.jsx` | Replaced by `ControlBar` |
| `client/src/components/ShowCard/ShowCard.jsx` | Replaced by `ConcertRow` inside `ConcertList` |

---

## Component Details

### tokens.css
Exact values from handoff section 1. Covers: surface backgrounds (`--bg-void` through `--bg-overlay`), borders (`--border-dim/mid/hi`), text (`--text-primary/secondary/muted`), accent (`oklch` values), RSVP semantic colors (`--rsvp-yes/no/maybe` + dim variants), font families (`--font-display/mono/body`), layout (`--header-height: 7rem`, `--max-content: 84rem`).

### Header
Fixed, frosted-glass header with gradient accent underline. Brand = cube icon + NOISEBX wordmark (NBX on mobile). Single hamburger button opens a slide-in drawer from top-right. Drawer contains: Shows, Profile (logged-in only), Venue search (inline, same as ControlBar search), separator, Login/Logout/Signup buttons. Backdrop div closes drawer on click outside.

### DateNav
Replaces UtilityBar. Large date hero: monospace "TODAY/TOMORROW/etc." label, large display date, show count + calendar hint. Prev/next arrow buttons (disabled at boundaries: yesterday min, today+89 days max). Clicking the date display opens the existing `react-datepicker` via `ref.current.setOpen(true)`. Hidden picker div positioned off-screen.

### ControlBar
Always visible — no toggle. Three buttons: Venue, Artist, Search. Active button shows sort direction icon (TextSortAscending/Descending from fluentui-system-filled). Search button shows Bootstrap Search icon. Result count on right. Clicking an already-active sort button toggles direction (asc ↔ desc). Clicking Search sets `sortOrSearch = 'search'` which renders VenueSearch inline in Home.

### ConcertList + ConcertRow
Three-column grid row: `[38px RSVP button] [1fr content] [auto attendance]`. Artist name prominent (2rem, bold), venue + time below in monospace. Hover: row background lifts + artist name turns accent color. Row dividers via `::before` pseudo (hidden on hover). Empty state: ∅ icon + "No shows for this day" message.

**PlusMinus button:** restyled to 38×38px square, bg-surface fill, border-mid border, 9px radius. Saved state: rsvp-yes color + border + rsvp-yes-dim background. Icon: Plus/Minus from bootstrap icons (existing). Logic and mutations unchanged.

**Attendance dots:** shown only when `yes` or `maybe` arrays exist on the concert. Green dot + yes count, amber dot + maybe count. Arrays added to sorted queries.

### ScrollButton
Moved from `top: 90vh; right: 5vh` to `bottom: 3.2rem; right: 3.2rem`. Solid accent fill. Entrance: slides up + scales in. Hover: glow halo expands. z-index 90 (below header:100, drawer:101). Scroll listener bound in `useEffect` with cleanup on unmount.

---

## Data Changes

All four sorted concert queries (`concertsSortByVenueAsc`, `concertsSortByVenueDesc`, `concertsSortByArtistsAsc`, `concertsSortByArtistsDesc`) gain two new fields:
```graphql
yes { _id }
maybe { _id }
```
Used to derive `yesCount = yes.length` and `maybeCount = maybe.length` in ConcertRow.

---

## Out of Scope (follow-up)

- **RSVPCluster** tri-state cycle button (+ → ✓ → ? → ✕) — deferred, all backend mutations exist when ready
- Any changes to Profile, Show, Venue, Login/Signup pages
