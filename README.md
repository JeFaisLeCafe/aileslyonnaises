# Les Ailes Lyonnaises

Public website for the Les Ailes Lyonnaises flying club and flight school at
Lyon-Bron.

The site is built with Astro, uses Sanity for managed content, and is hosted on
Cloudflare Pages. It includes the public website, the training enquiry form,
privacy-friendly analytics, and the Sanity Studio configuration.

## Requirements

- Node.js 22
- npm

## Run the website locally

```sh
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:4321`.

The website remains usable without a Sanity connection because a verified
content snapshot is committed in `src/data/cms-fallbacks.json`. Configure the
Sanity variables in `.env` when you need live CMS content.

## Common commands

- `npm run dev` — start the local Astro server
- `npm run build` — type-check and build the production site
- `npm run preview` — preview the production build
- `npm run check` — run Astro checks and ESLint
- `npm test` — run unit tests
- `npm run test:e2e` — run Playwright tests
- `npm run format` — format the repository
- `npm run studio` — start the Sanity Studio locally
- `npm run studio:deploy` — deploy the Sanity Studio
- `npm run cms:dump-fallbacks` — refresh the committed CMS snapshot

## Content

Sanity manages:

- aircraft;
- people and their club roles;
- prices;
- training programmes;
- club stories and Les Elles Lyonnaises;
- news;
- shared club information.

Page structure, presentation, forms, and legal pages remain versioned in this
repository.

The public Studio is available at
[ailes-lyonnaises.sanity.studio](https://ailes-lyonnaises.sanity.studio/).
See the [editor guide](docs/editor-guide.md) for publishing instructions.

## Deployment

Pushing `main` triggers the Cloudflare Pages production build. GitHub Actions
validates the code; Cloudflare performs the deployment.

- Preview site: [v2.aileslyonnaises.com](https://v2.aileslyonnaises.com)
- Production remains on the existing `www` site until launch approval.
- OVH continues to manage the domain and club email.

See [deployment and infrastructure](docs/deployment.md) for the stable project
configuration. Current launch tasks are intentionally kept in the ignored local
file `.scratch/launch/spec.md`.

## Project layout

- `src/pages/` — public routes
- `src/components/` — shared Astro components
- `src/lib/cms/` — Sanity queries, mapping, and repository layer
- `src/data/cms-fallbacks.json` — offline CMS snapshot
- `functions/api/` — Cloudflare Pages Functions
- `studio/` — Sanity Studio schemas and structure
- `tests/e2e/` — Playwright coverage
- `docs/` — maintained project documentation
