# Déploiement

## Cible provisoire : Cloudflare Pages

1. Créer un projet Pages relié au dépôt.
2. Utiliser `npm run build` comme commande et `dist` comme dossier de sortie.
3. Déclarer les variables listées dans `.env.example`.
4. Créer le binding Analytics Engine `ANALYTICS`.
5. Configurer le domaine personnalisé après validation de la préproduction.
6. Conserver le registrar, la zone email et les boîtes aux lettres chez OVH.

Le domaine peut pointer vers Cloudflare Pages sans déplacer l’enregistrement du
nom de domaine. Vérifier les enregistrements MX, SPF, DKIM et DMARC avant tout
changement DNS.

## Formulaire

- Créer un widget Turnstile pour le domaine.
- Vérifier le domaine expéditeur auprès du prestataire email.
- Définir `TRAINING_RECIPIENT_EMAIL` avec l’adresse validée par le club.
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
