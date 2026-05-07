NextUnicorn - Guide de Déploiement

Prérequis avant le déploiement
1. Avoir une base de données PostgreSQL (Supabase recommandé)
2. Avoir une clé API Google Generative AI
3. Avoir un compte Vercel (ou autre hôte compatible)

Étapes de déploiement local pour test

1. Configuration de PostgreSQL
   a. Installer PostgreSQL localement (si ce n'est pas fait)
   b. Créer une base de données:
      psql -U postgres -c "CREATE DATABASE nextunicorn;"
   
2. Configuration des variables d'environnement
   Créer .env.local avec:
   DATABASE_URL="postgresql://postgres:password@localhost:5432/nextunicorn"
   GEMINI_API_KEY="votre-clé-api-gemini"

3. Initialiser la base de données
   npx prisma migrate dev --name init

4. Lancer le serveur de développement
   npm run dev

5. Initialiser les idées
   curl http://localhost:3000/api/seed

Déploiement sur Vercel

1. Connecter le repository GitHub
   - Aller sur https://vercel.com
   - Cliquer "New Project"
   - Sélectionner le repository nextunicorn

2. Configurer les variables d'environnement
   - DATABASE_URL: URL Supabase
   - GEMINI_API_KEY: Votre clé API

3. Déployer
   - Cliquer "Deploy"
   - Attendre la fin du déploiement

4. Initialiser les idées en production
   - Appeler: https://votre-projet.vercel.app/api/seed

Déploiement avec Supabase

1. Créer un projet Supabase
   - Aller sur https://supabase.com
   - Cliquer "New Project"
   - Configurer la région et le mot de passe

2. Récupérer la connection string
   - Dans Settings > Database > Connection string
   - Copier la URL PostgreSQL

3. Configurer dans Vercel
   - DATABASE_URL = URL Supabase
   - GEMINI_API_KEY = Votre clé

4. Exécuter les migrations
   - Via le dashboard: npx prisma migrate deploy
   - Ou via Supabase Console directement

Génération des idées en production

Ajouter une cron job pour générer les idées quotidiennement:

Avec Vercel Cron:
1. Créer app/api/cron/seed/route.ts:

import { seedDailyIdeas } from "@/app/lib/actions/seed";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const ideas = await seedDailyIdeas();
    return Response.json({ success: true, count: ideas.length });
  } catch (error) {
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}

2. Ajouter dans vercel.json:
{
  "crons": [{
    "path": "/api/cron/seed",
    "schedule": "0 0 * * *"
  }]
}

3. Configurer CRON_SECRET dans les variables d'environnement

Sauvegarde de la base de données

Avec Supabase:
- Sauvegardes automatiques incluses
- Aller dans Backups pour les gérer manuellement
- Export possible en CSV/JSON

Monitoring

Vérifier les logs:
- Vercel: Dashboard > Function Logs
- Supabase: Dashboard > Query Performance

Mise à jour du code

1. Push sur GitHub
2. Vercel se redéploie automatiquement
3. Attendre la fin du déploiement

Rollback en cas d'erreur

1. Aller sur Vercel Dashboard
2. Cliquer sur le déploiement précédent
3. Cliquer "Promote to Production"

Support et Dépannage

Erreurs courantes:
- "DATABASE_URL not set" = Variable manquante dans Vercel
- "GEMINI_API_KEY invalid" = Clé API incorrecte ou expirée
- "No ideas found" = Appeler /api/seed manuellement
