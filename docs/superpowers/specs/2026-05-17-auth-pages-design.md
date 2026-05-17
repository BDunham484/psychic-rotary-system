# Auth Pages Design — Login + Signup

**Date:** 2026-05-17
**Handoff source:** `.claude/handoffs/HANDOFF-noisebx-auth.md`
**Approach:** Follow handoff exactly (Option A)

---

## Overview

Two public-facing auth pages sharing a card shell with dot-grid + radial-glow backdrop. Login handles email + password; Signup adds username and a password strength meter. Both sit on separate routes (`/login`, `/signup`) and swap via footer `<Link>`.

---

## Architecture

### New files
| Path | Purpose |
|---|---|
| `client/src/pages/LoginSignup/AuthShell.jsx` | Shared backdrop + card chrome (dot grid, glow, `::before` accent line) |
| `client/src/pages/LoginSignup/Auth.module.css` | All auth styles — card, fields, inputs, strength bar, error banner, footer |

### Modified files
| Path | Change |
|---|---|
| `client/src/pages/LoginSignup/Login.jsx` | Full rewrite — `touched` state, `validateEmail` guard, `serverError` banner, disabled submit, `<Link>` footer, uses `AuthShell` |
| `client/src/pages/LoginSignup/Signup.jsx` | Full rewrite — adds username field, password strength meter, same validation pattern |
| `client/src/index.css` | Remove the one active `.form-card` rule (lines 360–364); leave commented-out rules as-is |

### Deleted files
| Path | Notes |
|---|---|
| `client/src/pages/LoginSignup/LoginSignup.module.css` | Replaced by `Auth.module.css` |
| `client/src/components/shared/FormCard/FormCard.jsx` | Replaced by `AuthShell`; only referenced by Login + Signup |

---

## Components

### AuthShell
Stateless wrapper. Renders the `.page` container, `.grid` overlay, `.glow` radial, and the `.card` div (which carries the `::before` indigo accent bar). Accepts `children` — the form content drops in directly.

### Login
- State: `form { email, password }`, `touched {}`, `serverError`
- Validation: `validateEmail()` from `utils/helpers.js` (already exists); submit disabled until email valid + password non-empty + not loading
- Error UX: inline field error after blur; full-width `errorBanner` for server errors
- On success: `Auth.login(data.login.token)` — unchanged from current implementation
- Footer: `<Link to="/signup">` — React Router, no reload

### Signup
- State: `form { username, email, password }`, `touched {}`, `serverError`
- Validation: username ≥ 3 chars, valid email, password ≥ 8 chars (keeping handoff's 8 — stricter than server's 5 minlength)
- Password strength meter: pure-UI, 3-segment bar (weak/medium/strong) via `passwordStrength()` helper; no backend dependency
- On success: `Auth.login(data.addUser.token)` — unchanged
- Footer: `<Link to="/login">` — React Router, no reload

---

## Data flow

No GraphQL changes. `LOGIN_USER` and `ADD_USER` mutations already exist in `utils/mutations.js` with variable signatures that match exactly (`email + password`; `username + email + password`).

---

## Cleanup

- `FormCard` is only imported by `Login.jsx` and `Signup.jsx` — safe to delete with no other consumers.
- The `.form-card` block in `index.css` (line 360) is the only active rule; the rest are already commented out. Remove only the active block.
- No App.js route changes needed — `/login` and `/signup` routes already exist.

---

## Error handling

- **Login:** Generic "Email or password is incorrect." on any mutation error.
- **Signup:** `err.message` if available, else "Sign up failed. Try again."
- **Field errors:** Only shown after a field has been touched (blurred), so no eager validation while typing.

---

## Testing

Existing test suite (`client/src/__tests__/`) uses `MockedProvider` + `MemoryRouter`. After implementation, smoke-test:
1. Login happy path — valid email + password → `Auth.login()` called
2. Login error path — server error → banner appears
3. Signup happy path — all fields valid → `Auth.login()` called
4. Strength meter — weak / medium / strong states reflect correct segment fills
5. Disabled submit — button stays disabled until all fields meet criteria
6. Footer links — clicking "Create an account" navigates to `/signup` and vice versa
