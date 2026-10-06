# Shared styling

Load stylesheets in this order on each page:

1. `theme.css`: color and spacing tokens, local Inter font, resets, icon and focus styles.
2. `components.css`: `.app-shell`, `.card`, `.button`, `.button--primary`, `.button--secondary`, and `.eyebrow`.
3. The page stylesheet (`index.css` or `svg.css`): page-specific layout.
4. `dialogs.css`: the shared result and first-player popup designs.

Change the palette in `theme.css` to update both pages and every popup. X uses
`--color-x`; O uses `--color-o`. Keep new controls on these shared tokens instead
of adding independent palettes.

Use symbols from `assets/icons.svg` for icons. Mark decorative SVGs with
`aria-hidden="true"` and keep a visible text label on controls. Inter is bundled
in `assets/InterVariable.woff2`; its license is included alongside it. Fonts and
icons load locally, including when the game is packaged for offline use.

The game board stays at the viewport center. The header and bottom controls sit
outside its layout; the board scales to leave room for them in portrait and
landscape. Keep SVG coordinates aligned with the existing animation targets.
