# Light Mode + Theme Toggle — Design Spec

**Date:** 2026-05-17
**Branch:** feat/noisebox-home
**Reference:** `.claude/handoffs/HANDOFF-noisebox-light-mode.md`

---

## Overview

Adds a light theme alongside the existing dark theme, plus a toggle in the hamburger drawer. Theme state is persisted in `localStorage` and defaults to the user's OS color-scheme preference on first visit. Every component already uses CSS custom properties — flipping the theme is a single `data-theme` attribute change on `<html>`.

---

## 1. Tokens layer (`client/src/tokens.css`)

- Rename `:root` to `:root, [data-theme="dark"]` — no existing values change.
- Add four helper tokens to the dark block: `--grid-dot`, `--glow-color`, `--cube-bg`, `--cube-border`.
- Add a `[data-theme="light"]` block with the warm-bg palette (creamy off-white surfaces, darker indigo accent at `oklch(48% 0.18 275)` for AA contrast on light bg, same helper tokens with light values).
- Update `index.css` body background from `var(--bg-base)` → `var(--bg-void)` to match the token hierarchy.

### Dark helper tokens (added to existing block)
```css
--grid-dot:    rgba(160,150,255,0.025);
--glow-color:  oklch(62% 0.16 275 / 0.10);
--cube-bg:     oklch(62% 0.16 275 / 0.12);
--cube-border: oklch(62% 0.16 275 / 0.5);
```

### Light token block
```css
[data-theme="light"] {
  --bg-void:    #f4f1ea;
  --bg-base:    #ece8df;
  --bg-surface: #ffffff;
  --bg-raised:  #f9f6ee;
  --bg-overlay: #e6e2d6;

  --border-dim: rgba(40,30,90,0.07);
  --border-mid: rgba(40,30,90,0.14);
  --border-hi:  rgba(40,30,90,0.22);

  --text-primary:   #18141e;
  --text-secondary: #5a5470;
  --text-muted:     #94909c;

  --accent:       oklch(48% 0.18 275);
  --accent-hi:    oklch(40% 0.20 275);
  --accent-dim:   oklch(48% 0.18 275 / 0.10);
  --accent-mid:   oklch(48% 0.18 275 / 0.20);

  --rsvp-yes:      oklch(48% 0.18 145);
  --rsvp-yes-dim:  oklch(48% 0.18 145 / 0.10);
  --rsvp-no:       oklch(50% 0.18 22);
  --rsvp-no-dim:   oklch(50% 0.18 22 / 0.10);
  --rsvp-maybe:    oklch(60% 0.16 80);
  --rsvp-maybe-dim:oklch(60% 0.16 80 / 0.14);

  --grid-dot:    rgba(40,30,90,0.04);
  --glow-color:  oklch(48% 0.18 275 / 0.08);
  --cube-bg:     oklch(48% 0.18 275 / 0.10);
  --cube-border: oklch(48% 0.18 275 / 0.45);
}
```

---

## 2. Theme context (`client/src/utils/ThemeContext.jsx`) — new file

- `useState` initializes from `localStorage.getItem('noisebox-theme')`, falling back to `window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'` on first visit.
- `useEffect` writes `data-theme` to `document.documentElement` and persists to `localStorage` on every theme change.
- Exports `ThemeProvider` and `useTheme` hook.

---

## 3. Pre-paint flash prevention (`client/public/index.html`)

Inline `<script>` in `<head>` before React boots: reads `localStorage`, falls back to `matchMedia`, then `'dark'`. Sets `data-theme` on `<html>` synchronously so the page never renders with the wrong theme colors.

```html
<script>
  (function() {
    try {
      var saved = localStorage.getItem('noisebox-theme');
      if (saved) { document.documentElement.setAttribute('data-theme', saved); return; }
      var preferLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      document.documentElement.setAttribute('data-theme', preferLight ? 'light' : 'dark');
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
</script>
```

---

## 4. App.js

Wrap `<ThemeProvider>` just inside `<ApolloProvider>`, around `<ConcertProvider>`:

```jsx
<ApolloProvider client={client}>
  <ThemeProvider>
    <ConcertProvider>
      <Router>…</Router>
    </ConcertProvider>
  </ThemeProvider>
</ApolloProvider>
```

---

## 5. Toggle component (`client/src/components/Header/ThemeToggle.jsx`) — new file

- Reads `{ theme, toggleTheme }` from `useTheme()`.
- Renders a pill-shaped `<button role="switch">` with a sliding knob.
- Knob shows Moon icon (dark mode) or Sun icon (light mode) from `@styled-icons/feather`.
- In light mode the knob slides right and turns accent-colored via `[data-theme="light"] .themeKnob` CSS rule.
- Placed in the drawer between the nav links and the separator above Logout. A new `<div className={styles.drawerSep} />` is added above it; the existing separator below the nav links is retained.

---

## 6. Toggle styles (added to `Header.module.css`)

New classes: `.themeRow`, `.themeLabel`, `.themeTitle`, `.themeSub`, `.themeToggle`, `.themeKnob`. Knob transition uses `cubic-bezier(0.34, 1.4, 0.64, 1)` for a springy feel. Knob position controlled by attribute selector on `<html>`:

```css
[data-theme="dark"]  .themeKnob { transform: translateX(0); }
[data-theme="light"] .themeKnob { transform: translateX(2.6rem); background: var(--accent); color: var(--bg-surface); }
```

---

## 7. Body + element transitions (`index.css`)

```css
body {
  background: var(--bg-void);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
.header, .card, .drawer, .input, .button {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}
```

---

## 8. CSS audit — replace hardcoded indigo with tokens

Swap only the exact values listed in the handoff. Everything else (glows, hero gradients, near-invisible hover backgrounds) is flagged by the handoff as intentionally similar in both modes and stays hardcoded.

| File | Value | Replace with |
|---|---|---|
| `index.css` | `rgba(160,150,255,0.025)` × 2 (dot grid) | `var(--grid-dot)` |
| `Header.module.css` | `oklch(72% 0.16 275)` (brandCube color) | `var(--accent-hi)` |
| `VenueSearch.module.css` | `oklch(62% 0.16 275 / 0.12)` (focus ring shadow) | `var(--accent-dim)` |
| `FriendsTab.module.css` | `oklch(62% 0.16 275 / 0.12)` (focus ring shadow) | `var(--accent-dim)` |

Values left hardcoded (per handoff "can stay if purely decorative"):
- `Header.module.css` — cube-pulse keyframe glows, header bottom border gradient, drawerItem hover/active backgrounds (sub-0.1 opacity, nearly invisible on light bg)
- `VenueSearch`, `FriendsTab` hero gradients (opacity values not in handoff's exact-match list)
- `ControlBar.module.css`, `ShowsByVenue.module.css`, `ProfileHero.module.css` — all values are decorative glows/gradients or sub-0.1 opacity

---

## Files checklist

### New files
| Path | Purpose |
|---|---|
| `client/src/utils/ThemeContext.jsx` | Theme state, provider, `useTheme` hook |
| `client/src/components/Header/ThemeToggle.jsx` | Drawer toggle UI |

### Modified files
| Path | Change |
|---|---|
| `client/src/tokens.css` | Dark selector alias + helper tokens + light block |
| `client/src/index.css` | Dot grid → token, body bg → `--bg-void`, body transition |
| `client/src/App.js` | Wrap in `<ThemeProvider>` |
| `client/public/index.html` | Pre-paint inline script |
| `client/src/components/Header/index.js` | Render `<ThemeToggle />` in drawer |
| `client/src/components/Header/Header.module.css` | brandCube token swap + toggle styles |
| `client/src/components/VenueSearch/VenueSearch.module.css` | Focus ring token swap |
| `client/src/components/Friends/FriendsTab.module.css` | Focus ring token swap |
