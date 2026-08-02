# Déploiement

## Cible provisoire : Cloudflare Pages

Cloudflare Pages héberge le site **statique** et les **fonctions** du formulaire
(`/api/training-enquiry`, analytics). OVH reste le registrar et le fournisseur
email. On ne bascule pas `www` tant que `v2` n’est pas validé.

### Pourquoi Cloudflare (et pas seulement OVH) ?

Le site a besoin d’un runtime pour :

- recevoir le formulaire de formation ;
- vérifier Turnstile ;
- envoyer l’email via Resend ;
- journaliser des événements sans cookies.

Un hébergement mutualisé OVH classique ne couvre pas ces fonctions aussi simplement.
DNS et boîtes mail restent chez OVH ; seul le trafic web pointe vers Pages.

### CI/CD : GitHub lié à Cloudflare Pages

Le projet Pages `aileslyonnaises` est **connecté au repo GitHub**. Chaque push
sur `main` déclenche un build Cloudflare. GitHub Actions (`.github/workflows/ci.yml`)
ne fait que `check` / tests / `build` de validation — pas le déploiement.

#### Réglages build (Pages → Settings → Builds)

| Champ | Valeur |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (vide) |
| Node version | `22` (via `.node-version` ou variable `NODE_VERSION=22`) |

Sans **Build command**, Cloudflare saute `npm install` / le build Astro, puis
échoue en compilant `functions/` (erreurs `zod` / `resend`).

#### Variables d’environnement (Pages → Settings → Environment variables)

Production **et** Preview :

- `PUBLIC_SANITY_PROJECT_ID=v6vpuuua`
- `PUBLIC_SANITY_DATASET=production`
- `SANITY_PREVIEW_DRAFTS=false`

Plus tard (formulaire) : `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`,
`RESEND_API_KEY`, `TRAINING_RECIPIENT_EMAIL`, `TRAINING_SENDER_EMAIL`.

Analytics Engine n’est **pas** requis pour publier le site. Le binding
`ANALYTICS` est volontairement absent de `wrangler.jsonc` tant que le produit
n’est pas activé sur le compte. Pour le réactiver plus tard :
[Analytics Engine](https://dash.cloudflare.com/?to=/:account/workers/analytics-engine).

Variables GitHub (optionnel, pour le workflow CI) :

- `PUBLIC_SANITY_PROJECT_ID=v6vpuuua`
- `PUBLIC_SANITY_DATASET=production`

### Webhook Sanity → rebuild

Pour qu’une publication Studio redéploie le site :

1. Cloudflare Pages → projet → Settings → Builds → Deploy hooks → Create.
2. Sanity → projet `v6vpuuua` → API → Webhooks → Create.
3. URL = le Deploy Hook Cloudflare.
4. Trigger : Create / Update / Delete sur le dataset `production`.

### Sous-domaine de préproduction

Sur OVH DNS, **remplacer** l’enregistrement `v2` (aujourd’hui `A → 213.186.33.4`)
par un `CNAME` vers `aileslyonnaises.pages.dev` (ou la cible indiquée par
Pages → Custom domains), sans toucher à `www`, à l’apex ni aux MX.

## Ce dont on a besoin concrètement

### 1. « Snapshot » DNS OVH (pas un bouton magique)

Il n’y a pas d’export nommé « snapshot » : on veut juste la **liste actuelle**
des enregistrements pour `aileslyonnaises.com`, afin de ne pas casser l’email
ni le site en ligne.

Chemin dans l’espace client OVH :

1. Se connecter : [https://www.ovh.com/manager/](https://www.ovh.com/manager/)
2. `Web Cloud` → `Noms de domaine` → `aileslyonnaises.com`
3. Onglet `Zone DNS`

Guide officiel : [Éditer une zone DNS OVHcloud](https://docs.ovhcloud.com/fr/guides/web-cloud/domains/dns-zone-edit).

À envoyer (screenshot ou copier-coller du tableau) :

- lignes `A` / `AAAA` / `CNAME` pour `@` et `www`
- toutes les lignes `MX`
- lignes `TXT` contenant `SPF`, `DKIM`, `DMARC` (ou équivalent)

Ne rien modifier pour l’instant.

**État relevé (2026-08-02)** : `v2` existe déjà en `A → 213.186.33.4`
(même IP qu’OVH pour `www`). Pour la préprod Pages, on **remplacera** cet
`A` par un `CNAME` vers `<projet>.pages.dev` — sans toucher aux `MX` /
`SPF` / `DKIM` / `www` / `@`.

Astuce : au-dessus du tableau, `Actions sur ma zone` → `Modifier en mode textuel`
affiche toute la zone en texte (pratique à coller ici).

### 2. Cloudflare Pages (déjà créé via GitHub)

Projet : [`aileslyonnaises`](https://dash.cloudflare.com/a65e979c4b1932a343772154116fbfdd/pages/view/aileslyonnaises).

À faire dans le dashboard si le premier build a échoué :

1. **Settings → Builds** : Build command = `npm run build`, output = `dist`.
2. **Settings → Environment variables** : ajouter les variables Sanity
   (voir tableau plus haut).
3. **Deployments → Retry deployment** (ou push un commit).

Le domaine peut rester chez OVH ; Cloudflare n’héberge que Pages. Pas besoin
de token GitHub Actions pour déployer tant que le lien Git Pages est actif.

### 3. Turnstile + Resend (plus tard, pour le formulaire)

- **Turnstile** = captcha Cloudflare (case « je ne suis pas un robot », sans
  Google). Donne une *site key* (publique) et une *secret key*.
  Dashboard : [https://dash.cloudflare.com/?to=/:account/turnstile](https://dash.cloudflare.com/?to=/:account/turnstile)
- **Resend** = service d’envoi d’emails transactionnels (API). Le formulaire
  n’écrit pas en base : il envoie un mail à `TRAINING_RECIPIENT_EMAIL`.
  Compte : [https://resend.com](https://resend.com)

À configurer ensuite sur Cloudflare Pages (variables d’environnement du projet)
et/ou en local dans `.env` : `PUBLIC_TURNSTILE_SITE_KEY`,
`TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, `TRAINING_RECIPIENT_EMAIL`,
`TRAINING_SENDER_EMAIL`.

## Formulaire (Turnstile + Resend)

Le formulaire de formation n’enregistre rien en base : il valide les champs,
vérifie le captcha Cloudflare Turnstile, puis **Resend** envoie un email à
`TRAINING_RECIPIENT_EMAIL`.

À configurer :

- Créer un widget Turnstile pour le domaine (`v2` puis `www`).
- Créer un compte Resend, vérifier le domaine expéditeur (ou un sous-domaine).
- Définir `RESEND_API_KEY`, `PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`,
  `TRAINING_RECIPIENT_EMAIL`, `TRAINING_SENDER_EMAIL`.
- Ne pas mettre de donnée personnelle dans les journaux ou l’Analytics Engine.

## Sanity

- Créer le projet et le dataset `production`.
- Déployer ou héberger le Studio.
- Ajouter l’origine de préproduction puis le domaine final aux origines CORS.
- Configurer un webhook de publication vers le hook de déploiement Pages.
- Pour une prévisualisation privée, définir `SANITY_PREVIEW_DRAFTS=true` et un
  `SANITY_API_READ_TOKEN` en lecture seule uniquement sur le déploiement preview.
  Le build de production conserve `SANITY_PREVIEW_DRAFTS=false`.

## Audit OVH avant lancement

Relever le nom du forfait, le prix de renouvellement, les capacités de déploiement
statique, les redirections, les sauvegardes, les journaux et les services email.
Conserver OVH comme cible web uniquement si cette solution est plus simple et
aussi sûre que Pages pour l’équipe qui maintiendra le site.

## Checklist de mise en production

- coordonnées, destinataires et liens Aérogest validés ;
- mentions légales complètes ;
- comptes Sanity nominatifs et protégés ;
- tests unitaires, E2E et accessibilité réussis ;
- redirections historiques vérifiées ;
- formulaire testé de bout en bout sans conservation en base ;
- sauvegarde du site existant et plan de retour arrière ;
- suivi des erreurs et alertes de quota activés.
