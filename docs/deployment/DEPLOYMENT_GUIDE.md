# 🚀 GUIDE DEPLOYMENT - GitHub + Vercel

## 📋 PRÉ-REQUIS

### **Vérifications avant deploy**
- [ ] Le site fonctionne en local (`npm run dev`)
- [ ] Pas d'erreurs TypeScript (`npm run build` passe)
- [ ] Base de données SQLite fonctionne
- [ ] Variables d'environnement identifiées

---

## 🔐 ÉTAPE 1 : PRÉPARER LES FICHIERS

### **1.1 - Créer .gitignore** (si pas déjà fait)

Vérifie que tu as un `.gitignore` à la racine avec :

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
dist/
build/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# Database
*.db
*.db-journal
nextunicorn.db
prisma/*.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
```

### **1.2 - Créer .env.example**

Créer un fichier `.env.example` pour documenter les variables nécessaires :

```env
# OpenAI API Key (required for idea generation)
OPENAI_API_KEY=<openai-api-key>

# Stripe (required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe-publishable-key>
STRIPE_SECRET_KEY=<stripe-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-webhook-secret>

# Database (Vercel Postgres when deployed)
DATABASE_URL=postgresql://...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **1.3 - Créer .env.local**

Copier `.env.example` → `.env.local` et remplir avec tes vraies clés :

```env
OPENAI_API_KEY=<openai-api-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<stripe-test-publishable-key>
STRIPE_SECRET_KEY=<stripe-test-secret-key>
STRIPE_WEBHOOK_SECRET=<stripe-test-webhook-secret>
DATABASE_URL=file:./nextunicorn.db
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**⚠️ CRITIQUE** : `.env.local` NE DOIT JAMAIS être commit (vérifie .gitignore)

---

## 🗄️ ÉTAPE 2 : MIGRATION VERS POSTGRES (Pour Vercel)

### **Problème** : 
SQLite ne marche PAS sur Vercel (filesystem read-only)

### **Solution** : 
Utiliser **Vercel Postgres** (gratuit jusqu'à 256MB)

### **2.1 - Modifier schema.prisma**

Ouvre `prisma/schema.prisma` et change :

```prisma
datasource db {
  provider = "postgresql"  // au lieu de "sqlite"
  url      = env("DATABASE_URL")
}
```

### **2.2 - Installer Postgres localement (Optionnel)**

Si tu veux tester en local avec Postgres :

**Option A - Docker (recommandé)** :
```powershell
docker run --name nextunicorn-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nextunicorn -p 5432:5432 -d postgres:15
```

Puis dans `.env.local` :
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nextunicorn"
```

**Option B - Garder SQLite en local** :
Utiliser deux datasources (dev = SQLite, prod = Postgres)

### **2.3 - Regénérer Prisma Client**

```powershell
npx prisma generate
npx prisma migrate dev --name init_postgres
```

---

## 🐙 ÉTAPE 3 : PUSH SUR GITHUB

### **3.1 - Initialiser Git** (si pas déjà fait)

```powershell
cd g:\SITES\nextunicorn
git init
git add .
git commit -m "Initial commit - NextUnicorn v1.0"
```

### **3.2 - Créer le repo GitHub**

1. Va sur https://github.com/new
2. Nom du repo : `nextunicorn`
3. Description : "Battle arena for SaaS ideas - Vote on AI-generated startups"
4. **Public** (pour SEO) ou **Private** (si tu préfères)
5. **NE PAS** cocher "Add README" (tu en as déjà un)
6. Click "Create repository"

### **3.3 - Push le code**

Copie les commandes affichées par GitHub et exécute :

```powershell
git remote add origin https://github.com/TON-USERNAME/nextunicorn.git
git branch -M main
git push -u origin main
```

**Si erreur d'authentification** :
- Utilise un Personal Access Token (PAT)
- Créer sur : https://github.com/settings/tokens
- Permissions : `repo` (full control)

---

## ☁️ ÉTAPE 4 : DEPLOYER SUR VERCEL

### **4.1 - Créer compte Vercel**

1. Va sur https://vercel.com/signup
2. Sign up avec GitHub (plus simple)
3. Autorise Vercel à accéder à tes repos

### **4.2 - Import le projet**

1. Dashboard Vercel → "Add New" → "Project"
2. Sélectionne ton repo `nextunicorn`
3. Framework Preset : **Next.js** (détecté auto)
4. Root Directory : `./` (racine)
5. **NE PAS** cliquer Deploy encore !

### **4.3 - Configurer les Variables d'Environnement**

Dans "Environment Variables" section, ajoute :

```
OPENAI_API_KEY = <openai-api-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = <stripe-live-publishable-key>
STRIPE_SECRET_KEY = <stripe-live-secret-key>
STRIPE_WEBHOOK_SECRET = <stripe-live-webhook-secret>
DATABASE_URL = (on va le générer après)
NEXT_PUBLIC_APP_URL = https://nextunicorn.vercel.app
```

**⚠️ IMPORTANT** : 
- Utilise les clés LIVE Stripe (pas test) pour la prod
- On ajoutera DATABASE_URL après avoir créé la DB

### **4.4 - Créer Vercel Postgres Database**

1. Depuis le dashboard projet → "Storage" tab
2. "Create Database" → "Postgres"
3. Database name : `nextunicorn`
4. Region : Choisis le plus proche (eu-central-1 pour Europe)
5. Click "Create"

### **4.5 - Connecter la DB au projet**

1. Database créée → "Connect Project"
2. Sélectionne ton projet `nextunicorn`
3. Environment : **Production, Preview, Development** (tous)
4. Click "Connect"

Vercel va automatiquement ajouter `DATABASE_URL` dans tes env vars ! ✅

### **4.6 - Deploy**

Click **"Deploy"** 🚀

Le build va prendre 2-3 minutes.

---

## 🗃️ ÉTAPE 5 : INITIALISER LA BASE DE DONNÉES

### **5.1 - Après le premier deploy**

1. Va dans "Deployments" → Click sur le dernier deployment
2. Vérifie que le status est "Ready"
3. Note l'URL : `https://nextunicorn-xxx.vercel.app`

### **5.2 - Run les migrations Prisma**

**Option A - Via Vercel CLI** (recommandé) :

Installer Vercel CLI :
```powershell
npm i -g vercel
vercel login
```

Pull les env vars :
```powershell
vercel env pull .env.production
```

Run migrations :
```powershell
npx prisma migrate deploy
```

**Option B - Via Dashboard** :

Créer un script dans `package.json` :
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

Puis redeploy :
```powershell
git add .
git commit -m "Add Prisma migrations to build"
git push
```

### **5.3 - Seed initial data** (optionnel)

Créer `prisma/seed.ts` :
```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Créer quelques idées de test
  console.log('Seeding database...')
  
  // Ton code de seed ici
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Puis dans `package.json` :
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Run :
```powershell
npx prisma db seed
```

---

## 🔧 ÉTAPE 6 : CONFIGURATION POST-DEPLOY

### **6.1 - Configurer le domaine custom** (optionnel)

1. Vercel Dashboard → Ton projet → "Settings" → "Domains"
2. Add domain : `nextunicorn.app`
3. Configure DNS chez ton registrar :
   - Type : `CNAME`
   - Name : `@` ou `www`
   - Value : `cname.vercel-dns.com`

### **6.2 - Update les URLs dans le code**

Dans `.env.production` (Vercel) :
```env
NEXT_PUBLIC_APP_URL=https://nextunicorn.app
```

Dans `app/layout.tsx` :
```typescript
metadataBase: new URL('https://nextunicorn.app'),
```

### **6.3 - Configurer Stripe Webhooks**

1. Dashboard Stripe → "Developers" → "Webhooks"
2. "Add endpoint"
3. URL : `https://nextunicorn.app/api/stripe/webhook`
4. Events : `checkout.session.completed`
5. Copie le "Signing secret" (`whsec_...`)
6. Ajoute dans Vercel env vars : `STRIPE_WEBHOOK_SECRET`

### **6.4 - Tester en production**

1. Va sur ton site : `https://nextunicorn.vercel.app`
2. Teste le duel de votes
3. Teste la génération d'idées
4. Teste le paiement Stripe (mode test d'abord)

---

## 📊 ÉTAPE 7 : MONITORING & ANALYTICS

### **7.1 - Vercel Analytics** (gratuit)

Déjà activé par défaut ! Check dans "Analytics" tab.

### **7.2 - Google Analytics**

Déjà configuré dans le code avec `@next/third-parties`.

Vérifie juste que `GA_ID` est bien dans les env vars Vercel.

### **7.3 - Error Tracking** (optionnel mais recommandé)

**Sentry** (gratuit jusqu'à 5k events/mois) :

```powershell
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

Suivre les instructions du wizard.

---

## 🐛 TROUBLESHOOTING

### **Erreur : "Module not found"**
```powershell
# Nettoyer et rebuild
rm -rf .next
rm -rf node_modules
npm install
npm run build
```

### **Erreur : "Prisma Client not generated"**
Ajouter dans `package.json` :
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### **Erreur : "Database connection failed"**
- Vérifie `DATABASE_URL` dans Vercel env vars
- Vérifie que la DB Vercel Postgres est bien connectée au projet
- Test la connexion avec `npx prisma studio`

### **Erreur : "Stripe webhook failed"**
- Vérifie `STRIPE_WEBHOOK_SECRET` dans env vars
- Vérifie l'URL du webhook dans Stripe Dashboard
- Test avec Stripe CLI : `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### **Site lent / timeouts**
- Vérifie les cold starts (Vercel free tier)
- Optimise les requêtes Prisma (use `select` instead of full models)
- Ajoute du caching (Redis si budget)

---

## 🔄 WORKFLOW DE DÉVELOPPEMENT

### **Développement local**
```powershell
# Pull latest
git pull origin main

# Install deps
npm install

# Run dev
npm run dev

# Open http://localhost:3000
```

### **Tester avant de push**
```powershell
# Build pour vérifier erreurs
npm run build

# Linter
npm run lint

# Types
npx tsc --noEmit
```

### **Deploy sur Vercel**
```powershell
# Commit changes
git add .
git commit -m "Feature: Add X functionality"

# Push to main
git push origin main

# Vercel auto-deploy in 2-3 minutes ✅
```

### **Rollback si problème**
1. Vercel Dashboard → "Deployments"
2. Click sur le deployment précédent (qui marchait)
3. "..." menu → "Promote to Production"

---

## ✅ CHECKLIST FINALE

### **Avant de rendre public**
- [ ] Site fonctionne sur Vercel URL
- [ ] Base de données connectée et migrée
- [ ] Au moins 10 idées générées
- [ ] Système de vote fonctinel
- [ ] Paiement Stripe teste (carte test)
- [ ] Google Analytics installé et tracking
- [ ] OG image affichée (test avec Twitter Card Validator)
- [ ] Mobile responsive (test sur phone)
- [ ] Pas d'erreurs console
- [ ] Lighthouse score >80

### **URLs à tester**
- [ ] Homepage : `/`
- [ ] Leaderboard : `/leaderboard`
- [ ] Advertise : `/advertise`
- [ ] API ideas : `/api/ideas/generate`
- [ ] API ads : `/api/ads/active`

### **Domaine custom** (si applicable)
- [ ] DNS configuré
- [ ] HTTPS actif (auto par Vercel)
- [ ] Redirections www → non-www (ou inverse)

---

## 🚀 COMMANDES ESSENTIELLES

```powershell
# Deploy manuel (si besoin)
vercel

# Deploy en production
vercel --prod

# Voir les logs en temps réel
vercel logs

# Pull env vars depuis Vercel
vercel env pull

# Run Prisma Studio (DB viewer)
npx prisma studio

# Migrations
npx prisma migrate dev
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Check build localement
npm run build
npm run start
```

---

## 📞 SUPPORT

### **Problème GitHub**
- Docs : https://docs.github.com
- Auth issues : Use Personal Access Token

### **Problème Vercel**
- Docs : https://vercel.com/docs
- Discord : https://vercel.com/discord
- Support : help@vercel.com (si payant)

### **Problème Prisma**
- Docs : https://www.prisma.io/docs
- Discord : https://pris.ly/discord

### **Problème Stripe**
- Docs : https://stripe.com/docs
- Support : Dashboard → Help

---

## 🎯 NEXT STEPS APRÈS DEPLOY

1. ✅ **Vérifier que tout marche en prod**
2. ✅ **Générer 50+ idées avec le script**
3. ✅ **Tester le flow complet utilisateur**
4. ✅ **Configurer Google Search Console**
5. ✅ **Préparer Product Hunt launch**

**Tu es prêt pour le lancement !** 🦄🚀
