NextUnicorn - Démarrage rapide

Vous avez NextUnicorn prêt à l'emploi. Voici comment le lancer.

Installation (2 minutes)

1. Installez les dépendances:
   npm install

2. Créez .env.local avec:
   DATABASE_URL="postgresql://user:password@localhost:5432/nextunicorn"
   GEMINI_API_KEY="votre-clé-gemini"

3. Configurez la base de données:
   npx prisma generate
   npx prisma migrate dev --name init

Lancement (30 secondes)

npm run dev

Le site est accessible à: http://localhost:3000

Initialiser les idées du jour

curl http://localhost:3000/api/seed

Ou dans le navigateur:
http://localhost:3000/api/seed

Comment ça marche

1. Page d'accueil (/):
   - Deux idées aléatoires face à face
   - Vous votez pour votre préférée
   - L'idée gagnante reste, une nouvelle arrive
   - Votre vote est enregistré (1 par duel)

2. Classement (/leaderboard):
   - Les 10 meilleures idées
   - Triées par nombre de victoires
   - Lien pour revenir au duel

Tester les API

Duel aléatoire:
curl http://localhost:3000/api/duel

Classement:
curl http://localhost:3000/api/ranking

Voter:
curl -X POST http://localhost:3000/api/vote \
  -H "Content-Type: application/json" \
  -d '{"winnerId":1,"loserId":2,"voterId":"test-uuid"}'

Structure du projet

app/
├── page.tsx              - Page d'accueil
├── leaderboard/          - Page classement
├── api/                  - Routes API
├── components/           - Composants React
├── lib/                  - Logique métier
└── layout.tsx            - Layout racine

prisma/
├── schema.prisma         - Schéma DB
└── migrations/           - Historique DB

Documentation

- README.md: Guide complet
- SETUP.md: Configuration détaillée
- ARCHITECTURE.md: Structure technique
- DEPLOYMENT.md: Mise en production

Dépannage

Erreur "DATABASE_URL not set"
→ Vérifiez .env.local

Erreur "GEMINI_API_KEY invalid"
→ Générez une clé sur https://ai.google.dev

Erreur "Not enough ideas in database"
→ Appelez http://localhost:3000/api/seed

Erreur "Failed to compile"
→ Exécutez: npx prisma generate

Besoin d'aide

Vérifiez:
1. README.md pour les instructions complètes
2. CHECKLIST.md pour valider la configuration
3. Les logs du terminal pour les erreurs
4. ARCHITECTURE.md pour la structure du code

Prêt?

npm run dev

Vous êtes all set!
