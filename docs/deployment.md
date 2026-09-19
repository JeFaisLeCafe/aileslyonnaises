# Deployment and infrastructure

This document describes the project's stable deployment architecture. Current
launch tasks and one-off operational notes belong in the local, ignored
`.scratch/launch/spec.md` file.

## Architecture

- **Application:** Astro static site with Cloudflare Pages Functions.
- **Hosting:** Cloudflare Pages project `aileslyonnaises`.
- **Preview domain:** `https://v2.aileslyonnaises.com`.
- **Content:** Sanity project `v6vpuuua`, dataset `production`.
- **CMS Studio:** `https://ailes-lyonnaises.sanity.studio/`.
- **Registrar and email:** OVH remains authoritative for the domain and club
  mailboxes.
- **Transactional email:** Resend sends form submissions to the club.
- **Bot protection:** Cloudflare Turnstile protects the training enquiry form.
- **Analytics:** Cloudflare Web Analytics tracks traffic; Analytics Engine
  records non-personal conversion events.

The site does not require running the Wrangler CLI for normal deployments.
GitHub pushes trigger Cloudflare Pages builds. The `wrangler.jsonc` file remains
the Cloudflare project configuration: Pages reads the output directory and
Analytics Engine binding from it.

## Deployment flow

The Cloudflare Pages project is connected to the GitHub repository. A push to
`main` starts a production build. Pull requests and non-production branches can
produce preview deployments.

GitHub Actions runs validation only:

- Astro and TypeScript checks;
- ESLint;
- unit tests;
- production build;
- Playwright end-to-end and accessibility tests.

Cloudflare Pages performs the actual deployment.

## Cloudflare Pages build settings

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: repository root
- Node.js: 22

The Pages Functions under `functions/` are deployed with the static output.

## Environment variables

Configure variables in the Cloudflare Pages project for both Production and
Preview where appropriate.

Public build-time variables:

- `PUBLIC_SANITY_PROJECT_ID=v6vpuuua`
- `PUBLIC_SANITY_DATASET=production`
- `PUBLIC_TURNSTILE_SITE_KEY`

Server-side variables:

- `SANITY_PREVIEW_DRAFTS=false`
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `TRAINING_RECIPIENT_EMAIL=info2@aileslyonnaises.com`
- `TRAINING_SENDER_EMAIL=site@send.aileslyonnaises.com`

`PUBLIC_*` values are embedded during the Astro build, so changing one requires
a new deployment. Keep Turnstile and Resend secret values out of Git.

## Content publishing

Sanity is the source of truth for public content. The repository contains
`src/data/cms-fallbacks.json` so the site remains buildable if Sanity is
temporarily unavailable.

The established publishing flow is:

1. An editor publishes content in Sanity.
2. A Sanity webhook calls the Cloudflare Pages deploy hook.
3. Pages rebuilds the static site from the latest published content.

Do not recreate this integration if it is already working. Diagnose it only when
a published change fails to trigger a deployment.

After substantial CMS changes, refresh the committed fallback snapshot:

```sh
npm run cms:dump-fallbacks
```

Production uses published documents only. Preview deployments may enable draft
content with a read-only Sanity token.

## Training enquiry form

`functions/api/training-enquiry.ts`:

1. validates the request;
2. verifies the Turnstile response;
3. sends an email through Resend;
4. does not persist the submission in a database.

Turnstile is only relevant to this form. If the form is already working on the
preview domain, no Turnstile setup work is required.

Use a dedicated sending subdomain such as `send.aileslyonnaises.com` so Resend
configuration does not replace the club's OVH mail records.

## Analytics

`src/components/Analytics.astro` injects the Cloudflare Web Analytics beacon
immediately before the closing `body` tag. The public site token is stored
directly in that component; it is an identifier, not a secret.

### Cloudflare project configuration

Despite its name, `wrangler.jsonc` is not evidence of a manual CLI deployment.
It is the configuration format shared by Cloudflare Pages and Wrangler. This
project uses it to declare:

- the Pages project name;
- the static output directory (`dist`);
- the compatibility date;
- the Analytics Engine binding.

The Analytics Engine binding is:

- binding: `ANALYTICS`
- dataset: `ailes_lyonnaises_events`

The conversion endpoint stores event name and page path only. It must not receive
form contents or other personal data.

The Wrangler package is useful for validating this configuration and for
occasional local diagnostics. Nobody needs to run it for the normal
GitHub-to-Pages workflow.

## Domains and DNS

Until the final launch:

- `v2.aileslyonnaises.com` serves the Pages preview;
- the existing `www` site remains unchanged;
- OVH continues to manage DNS and email;
- MX, SPF, DKIM, and DMARC records must not be altered.

The final `www` cutover is an explicit operational action. Its live checklist,
rollback record, and current status are kept in `.scratch/launch/spec.md`, not
in this architecture document.

## Useful links

- [Cloudflare Pages project](https://dash.cloudflare.com/a65e979c4b1932a343772154116fbfdd/pages/view/aileslyonnaises)
- [Cloudflare Pages environment variables](https://dash.cloudflare.com/a65e979c4b1932a343772154116fbfdd/pages/view/aileslyonnaises/settings/environment-variables)
- [Cloudflare Web Analytics](https://dash.cloudflare.com/a65e979c4b1932a343772154116fbfdd/web-analytics)
- [Sanity project settings](https://www.sanity.io/manage/project/v6vpuuua)
- [Sanity Studio](https://ailes-lyonnaises.sanity.studio/)
- [OVH Manager](https://www.ovh.com/manager/)
