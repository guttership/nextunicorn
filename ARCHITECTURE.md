NextUnicorn - Architecture et Structure du Projet

Structure des fichiers

app/
├── api/
│   ├── duel/route.ts        - API pour récupérer un duel
│   ├── vote/route.ts        - API pour voter
│   ├── ranking/route.ts     - API pour le classement
│   └── seed/route.ts        - API pour initialiser les idées
├── components/
│   ├── ui/
│   │   ├── button.tsx       - Composant Button shadcn/ui
│   │   ├── card.tsx         - Composant Card shadcn/ui
│   │   └── table.tsx        - Composant Table shadcn/ui
│   ├── duel-page.tsx        - Page du duel (client)
│   ├── leaderboard-page.tsx - Page du classement (client)
│   └── seed-initializer.tsx - Composant pour initialiser les idées
├── lib/
│   ├── ai/
│   │   └── gemini.ts        - Intégration Google Generative AI
│   ├── actions/
│   │   ├── duel.ts          - Server Actions pour les duels
│   │   └── seed.ts          - Server Action pour seeder les idées
│   ├── db/
│   │   └── prisma.ts        - Client Prisma singleton
│   └── utils.ts             - Utilitaires (cn())
├── leaderboard/
│   └── page.tsx             - Route /leaderboard
├── layout.tsx               - Root layout
├── page.tsx                 - Route / (page d'accueil)
└── globals.css              - Styles globaux

prisma/
├── schema.prisma            - Définition des modèles
└── migrations/              - Historique des migrations

Flux de données

1. Page initiale (/)
   ├─> getDailyDuel()
   ├─> Affiche deux cartes (Idea A et B)
   ├─> Utilisateur vote → handleVote()
   ├─> Incrémente le score du gagnant
   └─> Recharge le duel

2. Page classement (/leaderboard)
   └─> getIdeaRanking()
       └─> Affiche table des 10 meilleures idées

3. Initialisation (/api/seed)
   └─> seedDailyIdeas()
       ├─> Appelle generateDailySaaSIdeas()
       ├─> Reçoit 10 idées de Gemini
       └─> Crée les enregistrements en DB

État de l'utilisateur

- voterId: UUID généré localement (localStorage)
- Persiste entre les sessions
- Utilisé pour vérifier les doublons de vote
- Pas d'authentification requise (accès public)

Logique de vote

Duel unique par jour:
- duelId = "YYYY-MM-DD-MIN(id1,id2)-MAX(id1,id2)"
- Exemple: "2025-01-14-2-5"
- Un utilisateur = 1 vote par duelId

Scoring:
- Chaque victoire = +1 point
- Score non décrémenté en cas de défaite
- Classement basé sur le score total

Sélection du duel suivant:
- Deux idées aléatoires différentes
- Pas d'auto-match (ideaA !== ideaB)
- Évite les re-duels du même jour

Génération d'idées (Gemini)

Modèle: gemini-1.5-flash
Fréquence: Une fois par jour (via /api/seed)
Nombre: 10 idées minimum

Critères de qualité:
- Originales (pas de clichés)
- Viables (problème réel)
- Bien nommées

Format retourné:
{
  "title": "ProductName",
  "slogan": "Value proposition",
  "description": "Problem + Solution"
}

Authentification

Pas d'authentification NextAuth car:
- Public et ouvert
- voterId = UUID aléatoire
- Un vote par duel suffit
- Pas de données sensibles

À implémenter ultérieurement:
- Comptes utilisateur (NextAuth)
- Identité persistante
- Historique personnel

Performance

Optimisations:
- Requêtes Prisma indexées
- Indexes sur score, createdAt, voterId, duelId
- Client Prisma singleton
- Cache? (Vercel KV)

Limites actuelles:
- Base de données non optimisée pour >100k votes
- Pas de pagination (limite 10 au leaderboard)
- Pas de rate limiting sur les votes

Sécurité

Points actuels:
- Pas d'injection SQL (Prisma ORM)
- CORS: Ouvert à tous (intentionnel)
- Pas de données sensibles

À améliorer:
- Rate limiting sur /api/vote
- Validation stricte des inputs
- HTTPS obligatoire en production

Extensibilité

Fonctionnalités futures possibles:
1. Catégories d'idées
2. Tags/Labels
3. Système de commentaires
4. Filtrage par score minimum
5. Export des résultats
6. API publique pour partenaires
7. Webhooks pour notifications
8. Admin dashboard
9. Analytics avancées

Maintenance

Nettoyage quotidien:
- Supprimer les idées de plus de 30 jours?
- Archiver les votes?
- Recalculer les statistiques?

Monitoring:
- Nombre d'idées en DB
- Nombre de votes
- Temps de réponse des API
- Erreurs Gemini API

Aide et questions

Comment ça marche?
- Deux idées aléatoires s'affrontent
- Vous votez pour votre préférée
- Les scores s'accumulent
- Classement en temps réel

Pourquoi pas d'authentification?
- Prototype public
- Simple à utiliser
- Accessible à tous

Comment sont générées les idées?
- Google Generative AI (Gemini)
- Prompt curé pour qualité
- 10 par jour minimum
- JSON structuré

Puis-je générer mes propres idées?
- Oui, admin panel à créer
- Ou via le formulaire (à implémenter)

Comment supprimer une mauvaise idée?
- Admin panel (à créer)
- Ou contact admin@nextunicorn.app (futur)
