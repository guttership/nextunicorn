# NextUnicorn - Configuration du Cron Quotidien

⚠️ **IMPORTANT** : Le plan Vercel gratuit limite à 2 cron jobs. Actuellement désactivé dans `vercel.json`.

## Route créée
`/api/cron/daily-update` - Tâche quotidienne qui :
1. Désigne le champion d'hier comme champion du jour
2. Génère 10 nouvelles idées SaaS avec traductions
3. Note: Les annonces ne sont PAS expirées automatiquement (gestion manuelle, 3 mois minimum)

## Configuration Vercel (DÉSACTIVÉE)

### Option 1: Activer le cron (nécessite upgrade Vercel ou supprimer un autre cron)
Ajouter dans `vercel.json` :
```json
"crons": [
  {
    "path": "/api/cron/daily-update",
    "schedule": "0 2 * * *"
  }
]
```

### Option 2: Utiliser un service externe (gratuit)
Utiliser **cron-job.org** ou **EasyCron** pour appeler l'endpoint quotidiennement :
- URL: `https://nextunicorn.vercel.app/api/cron/daily-update`
- Méthode: GET
- Header: `Authorization: Bearer <long-random-cron-secret>`
- Horaire: Tous les jours à 2h00 UTC

### 2. Variables d'environnement à ajouter sur Vercel
Aller sur **Vercel Dashboard** → **Settings** → **Environment Variables** et ajouter :

```
CRON_SECRET=<long-random-cron-secret>
```

### 3. Déploiement
Le cron sera automatiquement activé après le prochain déploiement.

## Test manuel
Pour tester le cron localement :
```bash
curl -H "Authorization: Bearer <long-random-cron-secret>" http://localhost:3000/api/cron/daily-update
```

Pour tester en production (après déploiement) :
```bash
curl -H "Authorization: Bearer <long-random-cron-secret>" https://nextunicorn.vercel.app/api/cron/daily-update
```

## Logs
Les logs seront visibles dans **Vercel Dashboard** → **Functions** → Sélectionner le cron.

## Fonctionnement
- ✅ Champion d'hier devient champion du jour
- ✅ 10 nouvelles idées générées avec OpenAI
- ✅ Traductions FR/DE/ES automatiques
- ✅ Annonces expirées désactivées
- ✅ Timeout : 5 minutes max
