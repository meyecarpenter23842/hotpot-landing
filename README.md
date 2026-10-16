# Sichuan Hotpot Landing

Separate, dependency-free static landing for QR scans from Android/iPhone.

## Commands
- `npm ci`
- `npm run check` (lint, test, build)
- `npm run build`

## Public URLs
- `LANDING_WEB_APP_URL` HTTPS URL; defaults to `https://bepsi.click`.
- `LANDING_PLAY_STORE_URL` HTTPS URL; when blank, Play CTA is disabled. Never invent a store link.

## Production release
Vercel Git auto-deploy is disabled. Pushes go through a PR and green `Landing quality` CI. Only repo owner can comment `/deploy-hotpot-landing` on Issue #1; workflow verifies exact main and CI before releasing. GitHub Actions requires repository secret `VERCEL_TOKEN` with project access. Project/org IDs are public and pinned. This secret is **not** stored in code.

## Project
Vercel `hotpot-landing` (`prj_9JRXxorUcdGLXX48nzIBHaqSuDRu`) under Sichuan Hotpot account.
