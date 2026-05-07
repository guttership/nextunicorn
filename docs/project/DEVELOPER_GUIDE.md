NextUnicorn - Guide du développeur

Travailler sur NextUnicorn

Avant de commencer

Vous devez avoir:
- Node.js 18+
- PostgreSQL
- VS Code (recommandé)
- .env.local configuré

Structure des fichiers clés

app/
├── page.tsx                    - Page d'accueil (vote)
├── leaderboard/page.tsx        - Page classement
├── layout.tsx                  - Layout racine
├── globals.css                 - Styles globaux
├── api/
│   ├── duel/route.ts          - GET nouvelle duel
│   ├── vote/route.ts          - POST vote
│   ├── ranking/route.ts       - GET classement
│   └── seed/route.ts          - GET initialiser idées
├── components/
│   ├── ui/                     - shadcn/ui components
│   ├── duel-page.tsx          - Page vote (client)
│   └── leaderboard-page.tsx   - Page classement (client)
└── lib/
    ├── actions/               - Server Actions
    ├── ai/                     - Intégration Gemini
    ├── db/                     - Client Prisma
    └── utils.ts               - Utilitaires

prisma/
├── schema.prisma              - Schéma DB (IMPORTANT!)
└── .prisma/client/            - Client généré

Workflows courants

Ajouter une nouvelle route API

1. Créer: app/api/ma-route/route.ts
2. Importer dynamiquement les actions:
   const { maAction } = await import("@/app/lib/actions/...");
3. Implémenter GET/POST
4. Tester: curl http://localhost:3000/api/ma-route

Ajouter une nouvelle Server Action

1. Créer dans: app/lib/actions/mon-action.ts
2. "use server" au début
3. Importer prisma: import { prisma } from "@/app/lib/db/prisma";
4. Implémenter la logique
5. Tester depuis une page client

Modifier le schéma Prisma

1. Éditer: prisma/schema.prisma
2. Exécuter: npx prisma migrate dev --name description
3. Vérifier: npx prisma generate
4. Tester les imports Prisma

Ajouter un composant UI

1. Installer depuis shadcn: npx shadcn-ui@latest add nom-composant
2. Utiliser dans vos pages
3. Importer: import { Composant } from "@/app/components/ui/composant";

Debugging

Logs du serveur
- Console du terminal: npm run dev
- Vérifiez les erreurs côté serveur

Logs client
- Browser DevTools (F12)
- Console du navigateur

DB Inspection
- Prisma Studio: npx prisma studio
- Supabase Console (si utilisé)

Performance

Profiler le build
npm run build -- --debug

Vérifier les types
npx tsc --noEmit

Linter
npm run lint

Tests

Actuellement pas de tests configurés. À implémenter:
- Unit tests: Jest
- Integration tests: Playwright
- E2E tests: Cypress

Commits et Git

Format des commits:
- feat: Nouvelle fonctionnalité
- fix: Correction de bug
- refactor: Restructuration
- docs: Documentation
- chore: Maintenance

Exemple:
git commit -m "feat: add new voting endpoint"

Déployer les changements

Local → Production
1. Push vers main
2. Vercel redéploie automatiquement
3. Vérifier les logs Vercel

Rollback
1. Aller à Vercel Dashboard
2. Cliquer sur le déploiement précédent
3. "Promote to Production"

Bonnes pratiques

TypeScript
- Évitez `any`, utilisez des types génériques
- Lisez les erreurs TypeScript complètement
- npx tsc --noEmit avant de commit

Naming
- Dossiers: kebab-case (api-duel, my-component)
- Fichiers: kebab-case (seed.ts, duel-page.tsx)
- Variables/Fonctions: camelCase (myFunction, userData)
- Classes/Types: PascalCase (UserData, DuelPage)

Code organisation
- 1 fichier = 1 responsabilité
- Imports au début, export à la fin
- Commentes les cas complexes
- Refactorise les fonctions > 50 lignes

Performance
- Utilisez les images Next.js
- Compressez les assets
- Lazy-load les composants lourds
- Vérifiez les N+1 queries

Sécurité
- Ne mettez JAMAIS de secrets en dur
- Utilisez .env.local (git-ignored)
- Validez les inputs utilisateur
- Échappez les données du DB en affichage

Extensibilité

Pour ajouter une nouvelle feature:

1. Modèle DB
   - Ajouter dans prisma/schema.prisma
   - npx prisma migrate dev --name nom
   - npx prisma generate

2. Server Action
   - Créer dans app/lib/actions/
   - Importer prisma et logique

3. API Route
   - Créer dans app/api/
   - Importer la Server Action
   - Tester avec curl

4. Component UI
   - Créer dans app/components/
   - Utiliser les Server Actions
   - Importer composants shadcn/ui

5. Page
   - Créer dans app/ ou sous-dossier
   - Importer le component
   - Tester dans le navigateur

Ressources

Documentation
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- shadcn/ui: https://ui.shadcn.com
- Tailwind: https://tailwindcss.com/docs
- Gemini: https://ai.google.dev/docs

Communauté
- Next.js Discord: https://discord.gg/nextjs
- Prisma Slack: https://pris.ly/slack
- Questions: Consultez la doc d'abord!

Avoir besoin d'aide?

1. Vérifiez la documentation (README, SETUP, etc.)
2. Inspectez les logs (terminal, DevTools)
3. Consultez ARCHITECTURE.md
4. Lisez le code existant (il y a des commentaires!)

Questions fréquentes

"Comment ajouter un nouvel import?"
→ npm install nomdupackage; yarn.lock auto-update

"Comment faire un rollback DB?"
→ npx prisma migrate resolve --rolled-back
→ Puis npx prisma migrate deploy

"Comment tester localement avant de déployer?"
→ npm run build; npm start

"Puis-je modifier les modèles Prisma?"
→ Oui, mais faites une migration après!

"Comment déboguer une requête Prisma?"
→ Activez logging dans prisma/schema.prisma
→ Ou utilisez: npx prisma studio

Bon développement!
