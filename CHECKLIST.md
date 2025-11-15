Checklist de vérification - NextUnicorn

Avant de lancer le projet

Environnement
- [ ] Node.js 18+ installé
- [ ] npm/yarn installé
- [ ] PostgreSQL installé (local) ou compte Supabase créé
- [ ] Clé API Google Generative AI générée

Configuration
- [ ] .env.local créé avec DATABASE_URL
- [ ] .env.local créé avec GEMINI_API_KEY
- [ ] npm install exécuté
- [ ] Pas d'erreurs dans npm install

Base de données
- [ ] PostgreSQL en cours d'exécution
- [ ] Base de données nextunicorn créée (ou Supabase)
- [ ] npx prisma migrate dev --name init exécuté
- [ ] Tables Idea et Vote créées

Build
- [ ] npm run build réussit sans erreurs
- [ ] Pas d'erreurs TypeScript (npx tsc --noEmit)
- [ ] Pas d'erreurs ESLint

Tests locaux
- [ ] npm run dev lance sans erreurs
- [ ] http://localhost:3000 accessible
- [ ] Page chargée complètement
- [ ] Pas d'erreurs en console
- [ ] http://localhost:3000/api/seed repeut retourner 200
- [ ] Les 10 idées sont créées
- [ ] http://localhost:3000/leaderboard affiche le classement
- [ ] Vote fonctionne (change le duel)

Avant de déployer

Code
- [ ] Code commité sur Git
- [ ] Branche main/master à jour
- [ ] Pas de secrets en dur dans le code

Configuration Vercel
- [ ] Projet créé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] DATABASE_URL pointant vers Supabase/PostgreSQL
- [ ] GEMINI_API_KEY configurée
- [ ] Build command: npm run build
- [ ] Dev command: npm run dev

Supabase (si utilisé)
- [ ] Projet créé sur Supabase
- [ ] Connection string générée
- [ ] Migrations appliquées
- [ ] Tables créées correctement

Après le déploiement

Tests en production
- [ ] Site accessible à l'URL Vercel
- [ ] https certificat SSL valide
- [ ] Page d'accueil charge
- [ ] Appeler /api/seed pour initialiser
- [ ] Vote fonctionne
- [ ] Classement fonctionne
- [ ] Pas d'erreurs en production

Monitoring
- [ ] Logs Vercel accessibles
- [ ] Aucune erreur 500
- [ ] Gemini API fonctionne (idées générées)
- [ ] Database connections stables

Corrections possibles

Si erreur "DATABASE_URL not set"
- [ ] Vérifier variable dans .env.local (dev) ou Vercel (prod)
- [ ] Redémarrer serveur/deployment

Si erreur "GEMINI_API_KEY invalid"
- [ ] Vérifier clé API sur https://ai.google.dev
- [ ] Tester avec curl: curl https://generativelanguage.googleapis.com/

Si page /api/seed retourne 500
- [ ] Vérifier logs Vercel
- [ ] Vérifier Gemini API status
- [ ] Vérifier connection string database

Si vote ne fonctionne pas
- [ ] Vérifier localStorage (voterId généré)
- [ ] Vérifier duelId unique (date + IDs)
- [ ] Checker erreur dans logs

Notes finales
- Pas d'emojis utilisés (icônes Lucide React)
- Design minimaliste (blanc + gris)
- Destiné aux codeurs/entrepreneurs
- Accessible sans authentification
- Scalable pour >1000 utilisateurs (avec cache)
