# Déploiement Railway — backend Laravel

Configuration du service `savio` sur Railway (à consulter en cas de pépin).

## Réglages du service (Dashboard → Settings)

| Réglage | Valeur |
|---|---|
| Root Directory | `backend` |
| Pre-Deploy Command | `chmod +x ./railway/init-app.sh && sh ./railway/init-app.sh` |
| Domaine public | Généré via Networking → Generate Domain |
| Volume | Monté sur `/app/storage/app` (images uploadées persistantes) |

## Variables d'environnement clés

- `APP_KEY` — clé générée hors repo (jamais committée).
- `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=<domaine Railway>`.
- `FRONTEND_URL` — URL Vercel du site (utilisée par CORS).
- `MYSQLURL=${{MySQL.MYSQLURL}}` + `DB_*=${{MySQL.…}}` — référence la base MySQL du projet.
- `LOG_CHANNEL=stderr` — logs visibles dans le dashboard Railway.
- `PEEX_*` — clés de paiement mobile money (optionnel).

## Commandes utiles (onglet Shell du service)

```bash
php artisan db:seed --force        # données de départ (compte admin, horaires…)
php artisan migrate --force        # migrations
php artisan storage:link           # (déjà fait au pre-deploy)
```

## Piège connu

Railpack détecte l'application d'après le **contexte de build**. Si un
déploiement construit un site Node/Vite à la place de PHP, c'est que le
Root Directory `backend` n'était pas actif lors de CE déploiement :
déclencher un déploiement frais (nouveau push) plutôt qu'un "Redeploy"
d'une ancienne version.
