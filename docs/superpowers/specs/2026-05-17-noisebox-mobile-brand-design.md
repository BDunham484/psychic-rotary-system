# Spec: Mobile brand title

**Date:** 2026-05-17
**Branch:** feat/noisebox-home
**Source:** `.claude/handoffs/HANDOFF-noisebox-mobile-brand.md`

## Goal

Show the full NOISEBOX wordmark on every viewport. Remove the NBX abbreviation that currently appears on screens narrower than 720px.

## Files changed

### `client/src/components/Header/index.js`

Remove the `<span className={styles.brandNameMobile}>NBX</span>` element. The `.brandName` span stays and is now visible at all widths.

### `client/src/components/Header/Header.module.css`

1. Remove the `.brandNameMobile { display: none; }` rule (class is no longer referenced in JSX).

2. Replace the existing `@media (max-width: 720px)` block — which hides `.brandName` and shows `.brandNameMobile` — with font-size scaling only:

```css
@media (max-width: 720px) {
  .header { padding: 0 1.6rem; }
  .brandName { font-size: 2rem; letter-spacing: 0.08em; }
}
@media (max-width: 380px) {
  .brandName { font-size: 1.8rem; letter-spacing: 0.06em; }
}
```

The Pirata One wordmark fits comfortably at 390px and above at 3rem; scaling kicks in only below 380px as a guard against crowding on narrow Androids.

## Scope

- No other files change.
- `NBX` appears only in `Header/index.js` — no meta tags, no server files, no other copy.
- Brand cube and glow-pulse animation are unchanged.
