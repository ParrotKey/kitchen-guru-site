# Kitchen Guru Public Site Deployment

## Current Live URL

- GitHub Pages: https://parrotkey.github.io/kitchen-guru-site/
- Clickable app demo: https://parrotkey.github.io/kitchen-guru-site/demo/
- Repository: https://github.com/ParrotKey/kitchen-guru-site

## Deployment Record

- 2026-07-08: Created public ParrotKey repository
  `ParrotKey/kitchen-guru-site`.
- 2026-07-08: Enabled GitHub Pages from `main` at `/`.
- 2026-07-08: Pages build `1085050649` completed with status `built`.
- Initial launch commit: `119a82c9ec91f0819f7ec8d5f9ff98f8c4a5ec8e`.
- 2026-07-08: Deployment documentation commit:
  `5a7d3e6c33f29c8010e0da43c71e60683d9fec81`.
- 2026-07-08: Added clickable app demo at `/demo/` in commit
  `c11e76d04bba1a7783358efe5ee0cbee15f83c7c`.
- 2026-07-08: Emailed demo package to `cds.smith86@gmail.com` and CC'd
  `intake@pkestimates.com`; Gmail message `19f429277ebb43cc`.

## Verification

Public URL checks:

- `/` returned `200`.
- `/privacy.html` returned `200`.
- `/terms.html` returned `200`.
- `/support.html` returned `200`.
- `/community.html` returned `200`.
- `/deletion.html` returned `200`.
- `/assets/logo.svg` returned `200`.
- `/assets/three.module.js` returned `200`.
- `/demo/` returned `200`.

Browser smoke:

- Title: `Kitchen Guru - Find your next pickleball game`.
- H1: `Kitchen Guru`.
- Saved-court alert copy present.
- Kitchen Guru+ copy present.
- Hero canvas rendered.
- Horizontal overflow: false.
- Console errors/warnings: none.

Mobile demo smoke:

- URL: `https://parrotkey.github.io/kitchen-guru-site/demo/`.
- Viewport: 390 x 844.
- Rendered client width: 375.
- Phone mockup fit inside viewport: `332 x 690`, left `21.5`, right `353.5`.
- Previous/next controls visible.
- Next click changed the active screen and URL hash.
- Horizontal overflow: false.
- Console errors/warnings: none.

## Vercel Status

Vercel was not used for this launch because the authenticated Vercel connector
and CLI only exposed the `ibg` team scope. Eli explicitly said Kitchen Guru is
not an Iconic Brand Group project. This repository includes `vercel.json` so it
can be imported later into a ParrotKey-owned Vercel account/team when available.
