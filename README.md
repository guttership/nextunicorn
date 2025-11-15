NextUnicorn - SaaS Idea Battle Platform

Une plateforme where utilisateurs votent pour leurs idées SaaS préférées lors de duels aléatoires quotidiens.

Caractéristiques principales
- Duels d'idées SaaS générés aléatoirement
- Système de vote avec gamification
- Classement communautaire en temps réel
- Génération automatique d'idées via Gemini AI
- Minimum 10 nouvelles idées par jour

Stack Technique
- Next.js 16 (App Router)
- Prisma ORM
- PostgreSQL (Supabase compatible)
- Google Generative AI (Gemini 1.5 Flash)
- shadcn/ui
- Tailwind CSS
- TypeScript

Mise en place

1. Prérequis
- Node.js 18+ et npm
- PostgreSQL (local ou Supabase)
- Clé API Google Generative AI

2. Installation des dépendances

npm install

3. Configuration de l'environnement

Créez un fichier .env.local:

DATABASE_URL="postgresql://user:password@localhost:5432/nextunicorn"
GEMINI_API_KEY="votre-clé-gemini"

Obtenez votre clé Gemini: https://ai.google.dev/

4. Configuration de la base de données

Initialisez Prisma avec votre base de données:

npx prisma migrate dev --name init

5. Lancement du serveur

npm run dev

6. Initialisation des idées

Visitez http://localhost:3000/api/seed pour générer les 10 premières idées du jour.


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
