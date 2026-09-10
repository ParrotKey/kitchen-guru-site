# Kitchen Guru Public Site

Static public website for Kitchen Guru under ParrotKey ownership.

This repository contains the launch landing page plus required public support,
privacy, terms, community, and account-deletion pages.

## Hosting

- Current path: GitHub Pages under `ParrotKey/kitchen-guru-site`.
- Live URL: https://kitchenguruapp.com/
- Clickable app demo: https://kitchenguruapp.com/demo/
- Vercel is intentionally not connected from this session because the available
  Vercel account/team scope is `ibg`, and Kitchen Guru must not be deployed
  under Iconic Brand Group infrastructure.

## Files

- `index.html` - public landing page.
- `privacy.html` - Privacy Policy.
- `terms.html` - Terms of Service.
- `support.html` - Support page.
- `community.html` - Community Guidelines.
- `deletion.html` - Account deletion instructions.
- `invite.html` - mutual-consent friend-invite bridge from a clickable HTTPS link into
  the installed Kitchen Guru app.
- `demo/` - clickable app mockup for partner/product review.
- `assets/` - logo, legal CSS, and local Three.js module.

## Local validation and city generation

Run `node --test tests/*.test.mjs` for the invite, public-copy, screenshot
provenance, and deterministic generation contracts. These tests do not publish.

The existing `node tools/generate-city-pages.mjs` command reads
`data/cities.json` and writes the 31 city pages, city hub, sitemap, and robots.txt.
It uses no network, current timestamp, or randomness. Before the September 10
copy update, an in-memory run matched all 34 checked-in outputs (ignoring only
CRLF/LF). After generation, review the diff; only approved copy should change.
`node tools/generate-city-pages.mjs --check` checks generated claims without
writing files. The test suite also compares two in-memory runs and checks the
checked-in outputs, without overwriting anything.

## Release blockers and parent handoff

- Screenshots have NOT been replaced. They are archived in place with no public
  HTML references. `data/screenshot-provenance.json` records unchanged hashes
  and the remaining native app-store capture blocker. This no longer blocks
  the separate text/privacy website deployment; parent still owns deployment.
- Replace these later with captures of actual authenticated app routes using
  authorized test accounts. Record app commit, route and parameters, viewport,
  test-state description, capture procedure, and output hash. Verify loaded
  content, navigation, and relevant interactions; do not use the development
  fixture-only `/capture` route as production-route evidence.
- The profile image still contains the old blanket identity promise; the chat
  image still contains old Guru+ branding and benefit claims. Review every
  retained image before reuse, including the file named `map-real`.
- Parent owns deployment and app-doc alignment. Keep the existing public email
  deletion target of 30 days; update app `docs/legal/deletion.md` separately.
- Preserve existing Parrot Key LLC / Florida claims. The app legal-source
  discrepancy needs owner/legal reconciliation, not an inferred entity change.
- Legal revision dates are September 10, 2026 as approved. This is still an
  unpublished draft; parent owns final publication.
- Five retained files with `.png` names actually contain JPEG data. The
  provenance test records their current signatures and hashes without renaming
  or converting them. Correct format/extension agreement during replacement.

For desktop/mobile browser geometry verification, set `KITCHEN_GURU_PLAYWRIGHT`
to an installed Playwright module path and run
`node tools/verify-homepage-layout.mjs`. It opens local HTML in headless Edge,
checks 1440px, 390px, and 320px widths, and stores verification screenshots in
the system temporary directory, never in the public asset archive.
