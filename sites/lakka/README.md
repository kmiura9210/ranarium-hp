# Lakka Akasaka — bilingual website draft

Static Japanese and English website. Booking buttons currently open an accessible native dialog that explicitly says reservations are not accepted in this preview. No form submission or external API is used.

## Open

Open `dist/ja/index.html` or `dist/en/index.html` directly in a browser. Keep the `assets` folder alongside the language folders. For local HTTP preview, run `python -m http.server 8000 --directory dist` from this directory.

## Edit and build

- Page copy and booking URLs: `build.py`.
- Shared layout: `dist/assets/style.css`.
- Booking interaction: `dist/assets/app.js`.
- Original decorative illustration, not a photograph of the salon: `dist/assets/calm.svg`.
- Run `python build.py` after editing copy or booking URLs. No package installation is required.

## Publication status

Not deployed. No Site was registered and no DNS records were changed. The source is prepared for the `codex/lakka-website` branch in `kmiura9210/ranarium-hp`, under `sites/lakka`. See `DEPLOYMENT.md` for the independent Cloudflare Worker configuration. Proposed hostname: `lakka.rana-rium.com` (not yet confirmed or connected). The directory `dist` can be deployed as a static site, including on Cloudflare Pages.

This draft sets `noindex,nofollow` and disallows crawling in `robots.txt`. Before public launch, confirm salon copy and prices, replace the placeholder booking URLs in `BOOKING`, update the booking-coming-soon labels/dialog as appropriate, remove draft indexing restrictions, and add canonical/hreflang URLs for the actual published hostname. Keep each language's treatment names aligned with its booking menu.

Google Fonts are optional external styles; system serif and sans-serif fallbacks work offline. The hero is an original SVG illustration, explicitly captioned as such. No salon photos were downloaded.

## Sources and assumptions

- Salon address, station directions, hours, payment cards, private room, male guests, and representative first-visit prices: https://beauty.hotpepper.jp/kr/slnH000614849/ (consulted 2026-10-12).
- Translation-tool communication: user instruction.
- Proposed consultation and stop-signal wording should be reviewed with the operator before launch.
- Booking provider planned by the user: KANZASHI. No booking URL has been supplied. English booking UI, overseas phone-number support, and email language remain unverified.
- Selected first-visit prices: dry head spa 50 min ¥5,980; ear care 50 min ¥5,980; head spa + ear cleaning 75 min ¥10,980. Tax included, first-time guests only; verify current prices before publishing.

## Checks

Passed: Python build, JavaScript syntax, both language attributes, all local resource links, fragment anchors and draft indexing checks.

Not verified: desktop/mobile rendering and browser interaction. Installed Chromium could not start because the environment denied its socket operation. Sites publishing helpers were unavailable in this environment, so hosted publication could not be completed.
