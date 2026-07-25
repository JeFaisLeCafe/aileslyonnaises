# Audit de préparation

## Sources examinées

- archive `GT refonte 2026-20260725T113033Z-1-001.zip` : 77 fichiers,
  dont 67 photographies ;
- présentations Accueil, Découvrir, Apprendre, BIA, Tarifs, Flotte, Vie du club
  et Contact ;
- document de formation et tableur de contenu ;
- site public historique `aileslyonnaises.com` ;
- maquette Lovable fournie ;
- logo fourni le 25 juillet 2026.

## Corrections appliquées

- **ATO** : le club prend le nom « Les Ailes Lyonnaises » en 1978, mais le site
  historique date la nouvelle approbation ATO du 20 février 2014. Le site affiche
  le numéro `FR.ATO.0078` sans affirmer « ATO depuis 1978 ».
- **PPL et nuit** : la licence est présentée avec ses privilèges VFR de jour. Le
  vol de nuit reste une qualification distincte.
- **VFR de nuit** : le contenu reprend les minima de la règle FCL.810 : 5 heures,
  dont 3 en double commande, une navigation de 50 km et cinq décollages/atterrissages
  solo avec arrêt complet.
- **LAPL** : le texte évite d’affirmer qu’un médecin généraliste peut toujours
  délivrer le certificat ; il renvoie aux exigences médicales applicables.
- **BIA** : la plage « 13 à 25 ans » et le rang de premier club de France ne sont
  pas publiés faute de source confirmée.
- **Coordonnées** : `305 rue Albert Kimmerling, 69680 Chassieu`,
  `06 40 36 92 29` et `info2@aileslyonnaises.com` sont utilisés. Les variantes
  « Chassieux », adresses email avec espaces et numéros fictifs de la maquette
  sont écartées.

Références réglementaires à revalider avant lancement :

- règlement Aircrew, Part-FCL :
  <https://www.easa.europa.eu/en/document-library/easy-access-rules/easy-access-rules-aircrew-regulation-eu-no-11782011>
- présentation officielle du BIA :
  <https://www.education.gouv.fr/le-brevet-d-initiation-aeronautique-bia-6250>

## Inventaire photographique

Les 67 fichiers photo représentent 57 contenus uniques. Dix fichiers sont des
doublons binaires entre les dossiers `DR400 GE` et `DR400 QT` :

- `350A2422`, `350A2423`, `350A2425`, `350A2427`, `350A2429` ;
- `350A2430`, `350A2431`, `350A2433`, `350A2435`, `350A2436`.

Sélection de préproduction, conservée avec sa provenance dans l’archive :

- `Photos paysage/Lyon tete or 2.jpeg` : accueil, BIA et territoire ;
- `Photos paysage/Dombes.jpeg` : découverte et vie du club ;
- `Photos paysage/Aiguille midi.jpeg` : voyages et vie du club ;
- `B23/350A2489.jpeg` : Bristell B23 ;
- `DR400 YO/350A2450.jpeg` : DR401 F-HLYO ;
- `DR400 GE/350A2431.jpeg` : DR400 F-GXGE.

Les copies web sont redimensionnées à 2 200 px maximum et converties en WebP.
Les originaux restent dans l’archive source et ne sont pas dupliqués dans le
dépôt.

## Contenus volontairement masqués

- instructeurs, gouvernance et portraits : affichage conditionné à des fiches
  Sanity complètes ;
- « Les Elles Lyonnaises » : aucun contenu exploitable fourni ;
- liens d’achat et parcours détaillés des vols découverte : attente des URL
  Aérogest et de la validation des parcours ;
- formations ULM, patrouille et offres futures : absentes jusqu’à leur mise en
  service ;
- mentions légales définitives : attente du responsable de publication, des
  identifiants de l’association et du choix final d’hébergement.

## Migration des URL

Le fichier `public/_redirects` couvre les principales entrées historiques :

- `/formations` vers `/apprendre/` ;
- `/baptemes-de-lair-2` vers `/decouvrir/` ;
- `/contact-29` vers `/contact/` ;
- `/11-decouvrir/18-presentation` vers `/vie-du-club/` ;
- les entrées Piloter, Participer et Flotte vers leurs nouvelles rubriques.

La liste doit être complétée à partir d’un export des URL indexées avant la
bascule DNS.
