# Héloïse Lloris · Brand, palette & style

The site's look in one line: **Noir & 24K**. Warm near-black, real-gold foil, ivory for the atelier, and a lot of air. It should feel like opening the presentation case, not like reading a web page.

## Brand assets (retained from the Maison)

| Asset | Where | Notes |
|---|---|---|
| Crest (shield + laurel scrolls + "H" monogram) | `assets/img/crest.svg` (gold gradient), `assets/img/crest-symbol.svg` (`<symbol id="crest">`, fill from CSS) | Traced to vector from the official Instagram avatar. The source was only 150px, so fine interior detail (the small "H") is softened. **Ask the Maison for the original vector logo** and drop it in at the same paths. |
| Wordmark | Live text: `HÉLOÏSE LLORIS` over spaced `CHAMPAGNE` | Set in Cinzel, matching the Trajan-style capitals debossed on the presentation box. Always keep the diaeresis and acute: **Héloïse**. |
| Favicon / app icons | `favicon.svg`, `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-512.png` | Gold crest inside a gold ring on black, echoing the Instagram avatar. |
| Tagline | "Where every glass tells a story of Love, Victory & Honour" | From the original site. Short form in the footer: *Love · Victory · Honour*. |

## Colour palette

All colours are CSS custom properties on `:root` in `assets/css/site.css`.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0b0a08` | Page background, warm black (never pure #000) |
| `--ink-2` | `#13110d` | Alternate dark sections, marquee |
| `--ink-3` | `#1c1913` | Raised panels, image placeholders |
| `--text` | `#efe7d6` | Body text on dark, a champagne white |
| `--muted` | `color-mix(--text 66%, --ink)` | Secondary copy on dark |
| `--gold-0` | `#fff3cf` | Specular highlight |
| `--gold-1` | `#f1d891` | Light gold: links, emphasis, italic accents |
| `--gold-2` | `#d4ad57` | Core gold: eyebrows, rules, borders |
| `--gold-3` | `#b0843a` | Deep gold: numerals, ornaments |
| `--gold-4` | `#7a5822` | Shadow gold: glows, underlines |
| `--gold-ink` | `#6c4d1b` | Gold *text* on ivory (passes WCAG AA) |
| `--ivory` | `#f6f0e4` | The Collection "atelier" section |
| rose tone | `#f6ebe5` | Atelier background when 18K Rose Gold is selected |
| palladium tone | `#eef0f1` | Atelier background when Palladium is selected |
| `--line` | `--gold-2` at 28% | Hairlines and borders |

**Foil** (`--foil`) is the signature: a 100° multi-stop gold gradient (`#8c6526 → #d4ad57 → #fff0c4 → #d9b55d → #9a6f2a → #e9cd7d → #fff3cf → #b08038`) used with `background-clip: text` and animated slowly sideways (9s) so headlines catch the light. Use it for hero words, key numerals and primary buttons only. If everything is foil, nothing is.

Metal swatches (Collection selector) are radial gradients: gold `#fff6d6 → #e2bf68 → #a87a2c → #6e4d1a`, rose `#fff0ea → #ecb6a1 → #b87561 → #7d4a3c`, palladium `#ffffff → #d7dadc → #9ea3a8 → #5f6469`.

## Typography

Both families are self-hosted, subset to Latin (with accents) and static or narrowed weights to keep them tiny (12–26 KB each).

| Role | Family | Settings |
|---|---|---|
| Wordmark, eyebrows, labels, numerals, buttons | **Cinzel** 400 | Uppercase, tracking `.2em–.4em`. Small sizes only get the widest tracking. |
| Display and body | **Cormorant Garamond** 300–500 | Light (300) for big statements, 400 for body. |
| Accents | **Cormorant Garamond Italic** 400 | One or two words per heading in italic gold (*first*, *perfect gift*, *New Year*). |

Fluid type scale (`clamp()`): `--step--1` .82–.92rem, `--step-0` 1.12–1.32rem (body), `--step-1` 1.4–1.9rem, `--step-2` 1.9–3.1rem, `--step-3` 2.5–5rem, `--step-4` 3–8.5rem.

Fallback faces (`Cinzel Fallback`, `Cormorant Fallback`) are metric-adjusted local fonts so the swap does not shift the layout.

## Voice

Short, assured, unhurried. British spelling. Capitalise **24K Gold**, **18K Rose Gold**, **Palladium**, **Premier Cru**, **the Maison**. Avoid exclamation marks and discount language. The age gate speaks in the brand's metaphor ("Every great Champagne has its vintage", "The finest vintages are worth the wait").

## Imagery

* Product shots on white live only in the ivory atelier, blended with `mix-blend-mode: multiply` so the white studio background disappears into the page.
* The hero bottle is a transparent cut-out (`bottle-gold-*.webp`) floating on black with a gold halo, pedestal glow, and a light sweep masked to the bottle's own shape.
* Black-and-white craft and Instagram images are allowed to stay monochrome; the Instagram mosaic warms to a sepia-gold once it has assembled.
* Images never just appear: they unveil (clip from the bottom, de-blur, scale from 1.28 to 1, then a single gold gleam passes over them).

## Motion

* Easing: `--ease` `cubic-bezier(.2,.7,.1,1)` for most things, `--ease-lux` `cubic-bezier(.77,0,.175,1)` for curtains, doors and underlines.
* Durations are slow and deliberate (0.8–2.2s). Nothing bounces.
* Everything respects `prefers-reduced-motion`.

## Layout

* Max content width 1320px, gutter `clamp(1.1rem, 4vw, 3.5rem)`.
* Sections alternate dark / ivory / dark to give rhythm, with hairline gold rules rather than boxes.
* Arches (the "Finished in 24K Gold" window, the atelier frame, the tasting-note label) echo the bottle's shield.
