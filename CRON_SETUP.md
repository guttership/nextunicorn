# NextUnicorn - Configuration du Cron Quotidien

## Route créée
`/api/cron/daily-update` - Tâche quotidienne qui :
1. Désigne le champion d'hier comme champion du jour
2. Génère 10 nouvelles idées SaaS avec traductions
3. Expire les annonces périmées

## Configuration Vercel

### 1. Horaire
Le cron s'exécute tous les jours à **2h00 UTC** (3h00 Paris en hiver, 4h00 en été)
```json
"schedule": "0 2 * * *"
```

### 2. Variables d'environnement à ajouter sur Vercel
Aller sur **Vercel Dashboard** → **Settings** → **Environment Variables** et ajouter :

```
CRON_SECRET=nextunicorn_cron_secret_2025
```

### 3. Déploiement
Le cron sera automatiquement activé après le prochain déploiement.

## Test manuel
Pour tester le cron localement :
```bash
curl -H "Authorization: Bearer nextunicorn_cron_secret_2025" http://localhost:3000/api/cron/daily-update
```

Pour tester en production (après déploiement) :
```bash
curl -H "Authorization: Bearer nextunicorn_cron_secret_2025" https://nextunicorn.vercel.app/api/cron/daily-update
```

## Logs
Les logs seront visibles dans **Vercel Dashboard** → **Functions** → Sélectionner le cron.

## Fonctionnement
- ✅ Champion d'hier devient champion du jour
- ✅ 10 nouvelles idées générées avec OpenAI
- ✅ Traductions FR/DE/ES automatiques
- ✅ Annonces expirées désactivées
- ✅ Timeout : 5 minutes max
