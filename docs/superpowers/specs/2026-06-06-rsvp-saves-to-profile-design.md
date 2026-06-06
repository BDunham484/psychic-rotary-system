# RSVP unifies with saved concerts

Date: 2026-06-06
Branch: `feat/rsvp-saves-to-profile`

## Goal

Make any RSVP interaction add the concert to the user's saved Concerts list, and
make the +/- buttons consistent with that rule. A user "has" a concert in their
profile exactly when they have an active RSVP (yes/maybe/no) on it.

## Behavior

- **PlusButton** (`+` in ConcertList & ShowsByVenue): `addConcertToUser` + `rsvpYes`.
- **MinusButton** (`-`): `deleteConcertFromUser` + `clearRsvp`. Clears whatever the
  current RSVP status is (yes, no, or maybe) — the button is shown whenever the
  concert is saved, regardless of which status the user holds.
- **ConcertRSVP** (Show page Yes/Maybe/No):
  - Selecting a non-active option: `rsvp{Yes|No|Maybe}` + `addConcertToUser`.
  - Cancelling the active option (clicking it again): `clearRsvp` + `deleteConcertFromUser`
    — removes the RSVP **and** removes the show from the user's list.

## Efficiency decision

To clear "whatever the current status is" in one click, add a single server
mutation `clearRsvp(concertId, userId)` that pulls the user from all three arrays
in one update:

```js
Concert.findByIdAndUpdate(
  concertId,
  { $pull: { yes: userId, no: userId, maybe: userId } },
  { new: true }
);
```

One round-trip / one DB write regardless of status. Preferred over firing all
three existing cancel mutations (3 round-trips) or querying status first (extra
round-trip).

## Changes

1. **server/schemas/typeDefs.js** — add `clearRsvp(concertId: ID!, userId: ID!): Concert`.
2. **server/schemas/resolvers.js** — add `clearRsvp` resolver (multi-field `$pull`).
3. **client/src/utils/mutations.js** — add `CLEAR_RSVP`.
4. **client/src/components/shared/PlusButton/PlusButton.jsx** — `rsvpMaybe` -> `rsvpYes`.
5. **client/src/components/shared/MinusButton/MinusButton.jsx** — drop `rsvpNo`; use `clearRsvp`.
6. **client/src/components/shared/ConcertRSVP/index.js** — select adds to user; cancel uses `clearRsvp` + `deleteConcertFromUser`.
7. **client/src/components/shared/ConcertRSVP/ConcertRSVP.test.js** — update cancel test to expect `CLEAR_RSVP` + `DELETE_CONCERT_FROM_USER`; add `ADD_CONCERT_TO_USER` mocks to select tests.

## Sync notes

- `ConcertRSVP` keeps its `refetch` of `GET_CONCERT_BY_ID` for immediate on-page
  counts/active-state updates.
- The profile list and the home/venue `PlusMinus` toggle read the user's
  `concerts` from the polling `QUERY_ME` in `GlobalState`, so they reflect
  add/remove on the next poll.

## Out of scope (next step)

- How concerts are *displayed* in the profile (e.g. a per-row Yes/Maybe/No status badge).
