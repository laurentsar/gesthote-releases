# Camping La Périgourdine — Gestion

Application de gestion pour un camping à la ferme, inspirée de GestHôte : réservations,
emplacements, clients, activités fermières, bar du camping, tarifs saisonniers et
facturation.

## Fonctionnalités

- **Tableau de bord** — taux d'occupation, arrivées/départs du jour, revenu du mois
- **Réservations** — création avec détection de conflit de dates, calcul automatique du
  prix (hébergement selon la saison + activités/services), acompte
- **Emplacements** — tentes, caravanes, camping-cars, cabanes, mobil-homes avec
  équipements (électricité, eau, ombrage, animaux acceptés)
- **Clients** — carnet d'adresses avec historique des séjours
- **Activités & services** — visites de la ferme, produits fermiers, location de vélos…
- **Bar du camping** — carte des boissons (fraîches, chaudes, bières, vins, cocktails),
  entièrement modifiable
- **Tarifs** — grille de prix par nuit, par type d'emplacement et par saison
- **Facturation** — génération de factures à partir des réservations, suivi des paiements

Les données sont stockées dans le navigateur (`localStorage`), aucun serveur n'est requis.

## Démarrer

```bash
npm install
npm run dev
```

## Build de production

```bash
npm run build
npm run preview
```
