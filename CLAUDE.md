# Héloïse Lloris · site notes

A rebuild of https://heloiselloris.com/ (a GoDaddy builder site) as a fast, static, single-page site for GitHub Pages: https://tarne75.github.io/heloiselloris/

Palette, type, voice and motion rules live in **BRAND.md**. Read it before changing anything visual.

## Ground rules

* Static HTML, hand-written CSS, vanilla JS. **Zero dependencies**: no frameworks, no build tooling in the page, no CDNs, no third-party scripts (that includes reCAPTCHA, analytics and Instagram embeds; any of them costs the 100 PageSpeed score).
* Target: 100 / 100 / 100 / 100 on PageSpeed Insights, mobile and desktop, on both pages.
* Publishing: `git push origin main` deploys to GitHub Pages. Test locally first.
* Commits are authored by Tarne only. No co-author trailers.

## Files

```
index.html                 the page (hand-written, source of truth)
index-age-check.html       GENERATED: index.html + age gate. Never edit by hand.
partials/age-gate.html     age gate markup + the tiny inline script that opens it before first paint
tools/build.py             regenerates index-age-check.html; run after ANY edit to index.html
assets/css/site.css        all site styles (tokens at the top)
assets/css/gate.css        age gate styles (inlined into index-age-check.html by build.py)
assets/js/site.js          reveals, scrollspy, scroll stage, puzzle, counters, countdown, lightbox, form
assets/js/gate.js          the vintage dial and the opening animation
assets/fonts/              Cinzel 400, Cormorant Garamond 300–500 + italic, Latin-subset woff2
assets/img/                WebP images (two widths each for srcset), crest SVGs, og.jpg
favicon.svg/.ico, favicon-32.png, apple-touch-icon.png, icon-512.png, site.webmanifest
.nojekyll                  serve files as-is on GitHub Pages
```

After editing `index.html`, `partials/age-gate.html` or `assets/css/gate.css`:

```bash
python3 tools/build.py
```

## Page structure (single page, anchors drive the nav)

| # | Section | Original source | Notes |
|---|---|---|---|
| `#home` | Hero | Home | Cut-out 24K bottle with halo, light sweep and rising bubbles. Copy left, "N°1" claim right. |
| | Marquee | – | Brand facts ticker. |
| `#manifesto` | The Maison | Home | "First Champagne in the world…" lights up word by word as you scroll. Count-up stats. |
| `#gold` | Finished in 24K Gold | Home (last image) | Sticky scroll stage: an arch-shaped window grows to full screen around the crest close-up. |
| `#collection` | The Gold Collection | Collection + Home | Ivory "atelier". Choose 24K Gold / 18K Rose Gold / Palladium: pure CSS (radio + `:has()`) swaps bottle, notes and background tone. Gift box below. |
| `#craft` | Opulence / Hand crafted | Collection | Olympic-medal process copy, parallax B&W craft photos. |
| `#instagram` | @heloisellorisofficial | Instagram | 3 latest colour posts + the 9-post puzzle grid, which assembles itself as you scroll. |
| `#excellence` | The finest establishments | Excellence | Venue list with hover photos; masonry gallery opening a native `<dialog>` lightbox. |
| `#about` | About | About + brief | Name story (Héloïse + Lloris), three pillars, 1996 tasting-note "label". |
| `#preorder` | New Year pre-order | Home countdown | Live countdown to the next 1 January (visitor's local time). The original's countdown was stuck at 0. |
| `#contact` | Enquiries | About form | Formspree form + contact details. |
| footer | Contact summary | – | Crest, email, address, links, drinkaware, privacy link. |

Section order changed from the original (Home, Excellence, Collection, About) to Home, Collection, Excellence, About, Contact so the product comes before the venues.

## How the effects work (no libraries)

* **Reveals**: `[data-reveal]` elements get `.is-in` from one IntersectionObserver. `data-reveal="img"` unveils with `clip-path` on the `<img>` (not the wrapper: IntersectionObserver ignores a target's own clip, so clipping the wrapper never fires), de-blur, scale, then a gold gleam.
* **Scrollspy**: second IntersectionObserver on `[data-spy]` sections sets `aria-current` on the nav link.
* **Scroll-linked**: one passive, rAF-throttled scroll listener sets `--scroll` (header progress line), `--p` (gold stage), `--a` (Instagram puzzle), lights manifesto words, and `--py` for `[data-parallax]`.
* **Deferred image**: the gold stage photo uses `data-srcset` + `data-defer` and is loaded by IntersectionObserver 1.2 viewports early. This keeps it out of the LCP window on mobile (it was costing the 100).
* **Lightbox**: native `<dialog>` + `showModal()` (free focus trap, Esc, inert page), arrow keys, click-outside to close.
* **Mobile menu**: Popover API (`popover` + `popovertarget`), light-dismiss, with an explicit close button.
* **Collection selector**: radios + `:has()`. Works with JS off.
* Fluid sizes use `clamp()`, colours use `color-mix()`, full-height sections use `svh`/`dvh`.

## Age gate (`index-age-check.html`)

"Your Vintage": the visitor turns a dial of years (1920 to this year, starting on this year) to their birth year, then presses **Uncork**.

* Legal age 18. Exactly 18 by year asks "Has your 18th birthday already passed this year?".
* Under age: "The finest vintages are worth the wait", with how many years to go, and the answer sticks for the session.
* Over age: the two halves of the presentation case, with the crest split down the seam, swing open with a gold seam flash and a burst of bubbles, revealing the page.
* "Remember me" stores an expiry timestamp in `localStorage` (`hl-age-ok`, 30 days). Clear it to see the gate again.
* The gate is a modal `<dialog>` opened by an inline script immediately after its markup, so the page never flashes before the gate. Esc is blocked. Copy waits for web fonts (max 1.2s) so nothing shifts.
* Dial input: drag, swipe, mouse wheel, arrow buttons, ←/→ (1 year), PageUp/PageDown (10 years), Home/End, Enter to uncork.
* Performance on the gated page: `build.py` swaps the hero image preload for a `crest.svg` preload and turns the bottle's `srcset` into `data-gate-srcset`; `gate.js` (or the inline opener, for remembered visitors) restores it. Without this the hidden bottle competed with the doors and cost a point on mobile.

## Contact form

Posts to Formspree `https://formspree.io/f/xwvndkow` (the same form as t4-digital.uk) with `fetch` and `Accept: application/json`, honeypot `_gotcha`, `_subject`, and a legal-age checkbox. Buttons with `data-enquire` pre-select the "Regarding" field.

**Caveats**

* That Formspree form belongs to T4 Digital, so enquiries land in T4's inbox, not the Maison's.
* t4-digital.uk uses reCAPTCHA on that form. This site deliberately doesn't (it would cost the 100 score). If reCAPTCHA is enforced in that form's Formspree settings, submissions from here will be rejected: turn it off for this form, or create a separate form for this site.
* The form was not submitted end to end during the build, to avoid sending a test enquiry to a live inbox.

## Images

Originals came from the GoDaddy CDN (heloiselloris.com) and the 12 most recent public Instagram posts (only ~450–512px wide, which is all Instagram serves logged out). Pipeline: ImageMagick crop/resize → `cwebp -q 72–76 -m 6 -sharp_yuv`. The hero bottle was cut out of its white studio background (flood-fill from the edges + feathered alpha). Product shots stay on white and are blended into the ivory section with `mix-blend-mode: multiply`.

To refresh Instagram images, replace `assets/img/ig-01..12.webp` (01–03 colour row, 04–12 the 3×3 puzzle in grid order, top-left first).

## Testing

Serve the folder and open it (file:// works for most of it, but `fetch`, fonts and the SVG `<use>` sprite need http):

```bash
python3 -m http.server 8000
```

Then http://localhost:8000/ and http://localhost:8000/index-age-check.html. Lighthouse (local, simulated mobile) scored 100 in all four categories on both pages, mobile and desktop.

## Open items

* Replace the traced crest with the official vector logo when the Maison supplies it.
* A Formspree form owned by the Maison (see caveats above).
* The footer "Privacy & Terms" link points at the old site's page; add a privacy page here before the old site goes away.
* The venue list (Bacchanalia, Sexy Fish, Clap, Chinawhite) is from the original site. Confirm it's still current.
