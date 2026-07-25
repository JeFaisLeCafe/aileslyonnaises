# Site des Ailes Lyonnaises

Site public de l’Aéroclub Les Ailes Lyonnaises, construit avec Astro et Sanity.

## Démarrage

```sh
npm install
cp .env.example .env
npm run dev
```

Le site fonctionne sans Sanity grâce à des contenus de repli vérifiés. Renseignez
les variables Sanity pour charger les contenus administrés.

## Commandes

- `npm run dev` : serveur local
- `npm run build` : vérification TypeScript et build de production
- `npm run check` : vérifications Astro et ESLint
- `npm test` : tests unitaires
- `npm run test:e2e` : tests Playwright
- `npm run studio` : studio Sanity local

## Déploiement

La cible provisoire est Cloudflare Pages, avec `dist/` comme sortie et les
fonctions dans `functions/`. Le domaine et les emails restent gérés chez OVH.
Consultez [la procédure de déploiement](docs/deployment.md).

## Contenus

Les avions, personnes, tarifs et récits sont administrables dans Sanity. Les pages
de formation et la mise en page restent versionnées dans le dépôt. Consultez
[le guide éditeur](docs/editor-guide.md).
