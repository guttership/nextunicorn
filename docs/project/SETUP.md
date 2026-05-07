NextUnicorn - SaaS Idea Battle Platform

Un projet Next.js où les utilisateurs votent pour leurs idées de SaaS préférées parmi des duels aléatoires.

Stack Technique
- Next.js 16 (App Router)
- Prisma ORM
- PostgreSQL
- Google Generative AI (Gemini)
- shadcn/ui components
- Tailwind CSS

Configuration

1. Installation des dépendances

npm install

2. Configuration de l'environnement

Créez un fichier .env.local à la racine du projet:

DATABASE_URL="postgresql://user:password@localhost:5432/nextunicorn"
GEMINI_API_KEY="votre-clé-api-gemini"

Obtenez votre clé Gemini API: https://ai.google.dev/

3. Configuration de la base de données

npx prisma migrate dev --name init

4. Initialisation des idées (seed)

Accédez à http://localhost:3000/api/seed pour générer les 10 premières idées.

5. Lancement du serveur

npm run dev

Le serveur sera accessible à http://localhost:3000

Architecture

Models Prisma
- Idea: Stocke les idées de SaaS avec titre, slogan, description, score
- Vote: Enregistre chaque vote avec voterId, winnerIdeaId, loserIdeaId, duelId

Server Actions
- getDailyDuel(): Sélectionne deux idées aléatoirement pour un duel
- handleVote(): Enregistre un vote et incrémente le score du gagnant
- getIdeaRanking(): Retourne le classement des 10 meilleures idées

API Routes
- GET /api/seed: Initialise les idées du jour
- GET /api/duel: Récupère un duel
- POST /api/vote: Enregistre un vote
- GET /api/ranking: Retourne le classement

Pages
- /: Page du duel (vote entre deux idées)
- /leaderboard: Classement des meilleures idées

Gamification

Chaque utilisateur (identifié par voterId) vote pour l'idée qu'il préfère entre deux options.
- L'idée gagnante reste en compétition jusqu'à être détrônée
- Le score augmente avec chaque victoire
- Les utilisateurs ne peuvent voter qu'une fois par duel unique
- Le classement est mis à jour en temps réel

Notes

- Minimum 10 nouvelles idées générées par jour via Gemini
- Les idées sont originales, viables et bien formulées
- Style minimaliste avec contraste élevé entre les deux cartes
- Pas d'emojis dans l'interface (icônes Lucide React)
