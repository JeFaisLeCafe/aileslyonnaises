# Guide éditeur Sanity

## Accès éditeur

Studio en ligne : https://ailes-lyonnaises.sanity.studio/

1. Ouvrir le Studio et se connecter avec un compte Sanity individuel.
2. Modifier une entrée, vérifier **Visible** et la **date de publication**, puis publier.
3. Pour inviter un membre du bureau : [manage.sanity.io](https://manage.sanity.io) → projet `v6vpuuua` → Members → Invite (rôle Editor).

En local : `npm run studio` (http://127.0.0.1:3333).

## Contenus administrables

- **Avions** : modèle, immatriculation, usage, description, photographie et ordre.
- **Actualités** : informations datées, distinctes de la page Vie du club.
- **Personnes** : nom, titre affiché, rôles, portrait, biographie courte et ordre.
  Les vues **Équipe pédagogique**, **Bureau** et **Conseil d’administration** filtrent le même document selon les rôles.
- **Tarifs** : groupes, lignes, montants, unité et date d’effet.
- **Récits** : titre, résumé, photographie, contenu, y compris la série « Les Elles Lyonnaises ».
- **Formations** : titre, résumé, présentation, minimum d’heures, prérequis,
  disponibilité et ordre.
- **Coordonnées du site** : nom, accroche, adresse, téléphone, courriel et lieu
  affichés dans l’en-tête, le pied de page, les pages de contact et les
  métadonnées.

La navigation, la composition des pages et les explications réglementaires
détaillées restent dans le code afin d’éviter qu’une modification éditoriale
casse la mise en page. Les données de formation publiées dans Sanity restent
prioritaires pour les titres, résumés, minima, prérequis et disponibilités.

## Publication

1. Ouvrir l’entrée à modifier.
2. Vérifier les champs obligatoires et le texte alternatif de chaque image.
3. Enregistrer le brouillon.
4. Relire les montants, immatriculations et liens.
5. Publier.

La publication déclenche une reconstruction du site une fois le webhook configuré.
Une entrée désactivée ou incomplète n’est pas affichée.

## Responsabilités

Le forfait Sanity Free donne aux éditeurs actifs des droits administrateur. Les
comptes doivent être individuels, protégés par authentification forte et limités
aux deux ou trois mainteneurs désignés. Ne partagez jamais un compte.

Les tarifs et informations réglementaires doivent conserver leur date d’effet et
leur source. Toute nouvelle offre non opérationnelle reste non publiée.
