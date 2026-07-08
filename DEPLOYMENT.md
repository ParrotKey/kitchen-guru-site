# Kitchen Guru Public Site Deployment

## Current Live URL

- GitHub Pages: https://parrotkey.github.io/kitchen-guru-site/
- Repository: https://github.com/ParrotKey/kitchen-guru-site

## Deployment Record

- 2026-07-08: Created public ParrotKey repository
  `ParrotKey/kitchen-guru-site`.
- 2026-07-08: Enabled GitHub Pages from `main` at `/`.
- 2026-07-08: Pages build `1085050649` completed with status `built`.
- Initial launch commit: `119a82c9ec91f0819f7ec8d5f9ff98f8c4a5ec8e`.

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

Browser smoke:

- Title: `Kitchen Guru - Find your next pickleball game`.
- H1: `Kitchen Guru`.
- Saved-court alert copy present.
- Kitchen Guru+ copy present.
- Hero canvas rendered.
- Horizontal overflow: false.
- Console errors/warnings: none.

## Vercel Status

Vercel was not used for this launch because the authenticated Vercel connector
and CLI only exposed the `ibg` team scope. Eli explicitly said Kitchen Guru is
not an Iconic Brand Group project. This repository includes `vercel.json` so it
can be imported later into a ParrotKey-owned Vercel account/team when available.
