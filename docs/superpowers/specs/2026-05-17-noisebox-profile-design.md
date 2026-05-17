# NoiseBX Profile Page — Design Spec

**Date:** 2026-05-17
**Handoff source:** `.claude/handoffs/HANDOFF-noisebx-profile.md`
**Branch:** `feat/noisebox-home`

---

## Overview

Full redesign of the Profile page. Two distinct surfaces:

- **Own profile** (`/profile`) — hero + tabs for Concerts and Friends
- **Other profile** (`/profile/:username`) — hero + concerts only, with friendship action buttons in the hero

Replaces the existing tab-in-tab friends structure and the `RequestBlock/` component family with a single `FriendsTab` component using a two-column layout with a sticky side panel.

---

## Architecture

### New files

| Path | Purpose |
|---|---|
| `src/components/Profile/ProfileHero.jsx` + `.module.css` | Avatar tile, username, stats, friendship action buttons |
| `src/components/Profile/ConcertsList.jsx` + `.module.css` | Date-stack concert rows with remove (replaces `ProfileConcerts.jsx`) |
| `src/components/Friends/FriendsTab.jsx` + `.module.css` | Search + friends list + Received/Sent/Blocked side panel |

### Modified files

| Path | Change |
|---|---|
| `src/components/Profile/Profile.jsx` | Full rewrite — new sub-components, inline tab state, parallel `QUERY_ME` for friendship derivation |
| `src/components/Profile/Profile.module.css` | Full restyle |
| `src/utils/queries.js` | Add `customId` to concerts; add `concertCount` to friends subfield in `QUERY_ME` and `QUERY_USER` |
| `src/utils/mutations.js` | Add `ADD_FRIEND_BY_USERNAME` mutation |

### Deprecated (delete after migration)

- `src/components/Profile/ProfileConcerts.jsx`
- `src/components/Profile/SkeletonShowCard.jsx`
- `src/components/Friends/Friends.jsx`
- `src/components/Friends/FriendList.jsx`
- `src/components/Friends/FriendSearch.jsx`
- `src/components/Friends/FriendListOptions.jsx`
- `src/components/Friends/ProfileFriends.jsx`
- `src/components/Friends/SkeletonFriendListItem.jsx`
- `src/components/RequestBlock/` (entire directory — 10 files)
- `react-switch` npm dependency

---

## Data Layer

### Query changes (`queries.js`)

Add `customId` to the `concerts {}` subfield and `concertCount` to the `friends {}` subfield in both `QUERY_ME` and `QUERY_USER`:

```graphql
friends {
  _id
  username
  concertCount
}
concerts {
  _id
  customId
  artists
  date
  times
  venue
  ...
}
```

### New mutation (`mutations.js`)

```js
export const ADD_FRIEND_BY_USERNAME = gql`
  mutation addFriendByUsername($username: String!) {
    addFriendByUsername(username: $username) {
      _id
      username
      friendCount
      friends { _id username }
    }
  }
`;
```

Server already has `addFriendByUsername(username: String!): User` — no backend changes needed.

### Friendship state derivation (`Profile.jsx`)

When `userParam` is set, run `QUERY_ME` in parallel with `QUERY_USER`. Derive `friendship` before passing to `ProfileHero`:

```js
const friendship = useMemo(() => {
  if (!me || !user._id) return 'none';
  if (me.blockedUsers?.some(u => u._id === user._id)) return 'blocked';
  if (me.friends?.some(u => u._id === user._id))      return 'friend';
  if (me.sentRequests?.some(u => u._id === user._id)) return 'requested';
  return 'none';
}, [me, user._id]);
```

### Mutation variable mapping

The handoff uses simplified `id` variables. Actual mutations require:

| Action | Mutation | Variables |
|---|---|---|
| Send friend request (search) | `ADD_FRIEND_BY_USERNAME` | `username` |
| Remove friend | `REMOVE_FRIEND` | `friendId` |
| Block user | `BLOCK_USER` | `blockedId` |
| Unblock user | `UNBLOCK_USER` | `blockedId` |
| Accept request | `ACCEPT_FRIEND_REQUEST` | `senderId` + `senderName` |
| Decline request | `DECLINE_FRIEND_REQUEST` | `senderId` + `senderName` |
| Cancel sent request | `CANCEL_FRIEND_REQUEST` | `friendId` + `friendName` |

### Field name correction

Schema uses `blockedUsers` (not `blocked`). All components read `user.blockedUsers`.

---

## Component Details

### `Profile.jsx`

- Removes `Tabs` shared component; manages tab state with `useState('concerts')`
- When `userParam` is set: runs `QUERY_ME` in parallel, derives `friendship`, passes to `ProfileHero`
- Own profile: renders `ProfileHero` + tabs (Concerts / Friends)
- Other profile: renders `ProfileHero` + `ConcertsList` only
- Polling: 1000ms on the profile query; `QUERY_ME` parallels the same interval

### `ProfileHero`

Props: `user`, `isSelf`, `friendship` (`'none' | 'requested' | 'friend' | 'blocked'`)

- Avatar: 2-char initials in a gradient rounded tile (swap for `<img>` when avatar URLs are added)
- Stats: concerts count + friends count, displayed inline
- Actions (when `!isSelf`):
  - `none` → "Add Friend" button (calls `ADD_FRIEND` with `user._id` — this is the direct add, not used from search; ProfileHero sends a request via `SEND_FRIEND_REQUEST` with `user._id` + `user.username`)
  - `requested` → "Request Sent" (disabled appearance)
  - `friend` → "Remove" button (calls `REMOVE_FRIEND` with `friendId: user._id`)
  - Always visible: "Block" / "Unblock" button (calls `BLOCK_USER` / `UNBLOCK_USER` with `blockedId: user._id`)

> Note: "Add Friend" from ProfileHero should use `SEND_FRIEND_REQUEST({ friendId: user._id, friendName: user.username })` — not `ADD_FRIEND_BY_USERNAME` (which is for the search-by-username flow in FriendsTab).

### `ConcertsList`

Props: `user`, `isSelf`

- Renders date-stack rows: day abbreviation / date number / month abbreviation, separated by a right border
- Each row links to `/show/${concert.customId}` (requires `customId` in query — see data layer)
- Remove button (Trash2 icon): hover-revealed on desktop; always visible on mobile (`≤720px`)
- Calls `DELETE_CONCERT_FROM_USER({ concertId: c._id })`
- Empty state text varies by `isSelf`

### `FriendsTab`

Props: `user`

**Layout:** Two-column grid (`1fr 36rem`), collapses to single column at `≤880px`.

**Main column:**
- Search input with `ADD_FRIEND_BY_USERNAME` on submit (fires when query doesn't match any existing friend)
- Live filter of existing friends list as the user types
- Friends list: avatar tile (initials) + username + concert count; hover reveals ExternalLink / UserMinus / UserX icon buttons

**Side panel (sticky):**
- Three `SideCard` components: Received / Sent / Blocked
- Each card shows count badge; empty state if count is 0
- **Received:** Accept (Check icon) + Decline (X icon) per item — calls `ACCEPT_FRIEND_REQUEST({ senderId, senderName })` / `DECLINE_FRIEND_REQUEST({ senderId, senderName })`
- **Sent:** Cancel (X icon) per item — calls `CANCEL_FRIEND_REQUEST({ friendId, friendName })`
- **Blocked:** "Unblock" text button per item — calls `UNBLOCK_USER({ blockedId })`
- Reads `user.blockedUsers` (not `user.blocked`)

---

## Deviations from Handoff

1. **Friendship state computation:** Handoff stubs `friendship` prop with a default of `'none'`. Implementation derives it from a parallel `QUERY_ME` call.
2. **Search submit mutation:** Handoff stubs with a comment. Uses `ADD_FRIEND_BY_USERNAME` (server already has this).
3. **ProfileHero "Add Friend":** Uses `SEND_FRIEND_REQUEST` (needs `friendId` + `friendName`), not the simplified `addFriend({ id })` shown in handoff.
4. **`blockedUsers` field name:** Handoff uses `user.blocked`; schema uses `user.blockedUsers`.
5. **Mutation variable names:** All adapted to actual schema signatures (see mapping table above).
6. **`concertCount` on friends:** Requires query update to be available in `FriendItem`.

---

## Out of Scope

- Avatar photo upload (initials only for now)
- RSVPCluster on home cards (separate deferred feature)
- "View other profile" dev toggle from prototype (not shipped)
