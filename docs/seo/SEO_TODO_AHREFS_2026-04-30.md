# TODO SEO Ahrefs 2026-04-30

## Maillage interne faible (20+ pages a faible profondeur)

Contrainte respectee: aucun changement visuel n'a ete applique automatiquement pour traiter ce point.

Constat local:
- Le script [scripts/seo/seo-check.mjs](../../scripts/seo/seo-check.mjs) detecte de nombreuses URLs avec 0 ou 1 lien interne dofollow entrant.
- Le probleme touche surtout des pages d'idees profondes et certaines pages editoriales.

Pourquoi non corrige automatiquement:
- Pour augmenter significativement le maillage, il faut en pratique ajouter des liens contextuels dans des zones visibles (hub, footer, modules "related", blocs editoriaux), ce qui peut modifier l'apparence ou le contenu visible.
- La contrainte projet impose de ne pas modifier le front visuel sans validation explicite.

Actions proposees (a valider avant implementation):
1. Ajouter des liens textuels vers /about, /contact, /cgu, /confidentialite, /mentions, /terms dans une zone de navigation deja existante (sans creer de nouveau bloc).
2. Augmenter le nombre de liens "related ideas" dofollow vers des pages d'idees a faible profondeur dans les composants existants de hub.
3. Ajouter des liens croises entre articles de blog existants dans des zones deja presentes (pas de nouveau composant visuel).
4. Definir un seuil cible de maillage: minimum 2 liens dofollow entrants pour chaque URL publique critique.

Commande de suivi:
- npm run seo:check

Le warning "Low internal dofollow incoming links" servira de base de priorisation pour le lot suivant.
