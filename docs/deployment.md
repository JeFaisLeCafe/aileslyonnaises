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

### CI/CD GitHub → Cloudflare

Le workflow `.github/workflows/deploy.yml` :

1. installe les dépendances ;
2. lance `check`, tests unitaires et `build` ;
3. déploie `dist/` sur le projet Pages `ailes-lyonnaises`.

Secrets GitHub à créer :

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Variables GitHub :

- `PUBLIC_SANITY_PROJECT_ID=v6vpuuua`
- `PUBLIC_SANITY_DATASET=production`

### Webhook Sanity → rebuild

Pour qu’une publication Studio redéploie le site :

1. Cloudflare Pages → projet → Settings → Builds → Deploy hooks → Create.
2. Sanity → projet `v6vpuuua` → API → Webhooks → Create.
3. URL = le Deploy Hook Cloudflare.
4. Trigger : Create / Update / Delete sur le dataset `production`.

### Sous-domaine de préproduction

Sur OVH DNS, ajouter par exemple `v2.aileslyonnaises.com` (CNAME vers Pages)
sans toucher à `www`, à l’apex ni aux MX.

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
