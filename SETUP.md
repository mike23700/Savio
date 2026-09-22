# Guide d'installation — Site Paroisse Saint Dominique Savio

Ce guide couvre tout le nécessaire pour cloner, installer et lancer le projet en local : frontend (React/Vite) + backend (Laravel/MySQL) + panel admin.

## 1. Prérequis

- **Node.js 22** (voir `.mise.toml`) + npm
- **PHP 8.2+** avec les extensions `pdo_mysql`, `mbstring`, `openssl`, `curl`, `fileinfo`, `tokenizer`
  - Le plus simple : installer **XAMPP** (fournit PHP 8.2+, MySQL/MariaDB et phpMyAdmin)
- **Composer 2** (si tu n'as que Composer 1 ou pas de Composer du tout, voir §3.1 pour l'installer en local sans droits admin)
- **MySQL/MariaDB** en cours d'exécution (via XAMPP ou une installation locale)
- **Git**

## 2. Cloner le dépôt

```bash
git clone https://github.com/mike23700/Savio.git
cd Savio
```

## 3. Installation du backend (Laravel)

### 3.1. Composer (si besoin)

Si `composer --version` affiche une version < 2.2, installe Composer 2 localement dans le projet (pas besoin de droits admin) :

```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php --install-dir=. --filename=composer.phar
```

Remplace alors `composer` par `php composer.phar` dans les commandes ci-dessous.

Si tu utilises XAMPP et que ton PHP système est différent de celui de XAMPP (souvent le cas sur Linux), utilise le binaire PHP de XAMPP pour toutes les commandes `php`/`artisan` :

```bash
# adapte le chemin selon ton installation XAMPP
/opt/lampp/bin/php ...
```

### 3.2. Dépendances PHP

```bash
cd backend
composer install
# ou : php ../composer.phar install
```

### 3.3. Configuration `.env`

```bash
cp .env.example .env
php artisan key:generate
```

Le `.env.example` est déjà pré-rempli avec les valeurs par défaut du projet :
- `DB_DATABASE=savio_paroisse`, `DB_USERNAME=root`, `DB_PASSWORD=` (vide) sur `127.0.0.1:3306`
- `APP_URL=http://127.0.0.1:8001`
- `FRONTEND_URL=http://localhost:8443`

Ajuste ces valeurs si ta config MySQL diffère (mot de passe root, port différent, etc.).

### 3.4. Créer la base de données

Démarre MySQL (ex. `sudo /opt/lampp/lampp startmysql` avec XAMPP), puis crée la base vide :

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS savio_paroisse CHARACTER SET utf8mb4"
```

### 3.5. Migrations + données de départ (seed)

```bash
php artisan migrate:fresh --seed
```

Cette commande crée toutes les tables **et** les remplit avec le contenu de départ (horaires de messe, sacrements, catéchèse, prière, homélies, mouvements, projets, produits boutique, tarifs/numéros du journal) ainsi qu'un **compte administrateur**.

Identifiants admin créés par le seed (`backend/database/seeders/AdminUserSeeder.php`) :

```
Email    : admin@savio.com
Mot de passe : 12345678
```

⚠️ **À changer dès la première connexion** (depuis le panel admin ou via `php artisan tinker`).

### 3.6. Lien de stockage (photos uploadées)

Nécessaire pour que les photos de projets uploadées depuis l'admin s'affichent :

```bash
php artisan storage:link
```

### 3.7. Démarrer le serveur backend

```bash
php artisan serve --host=127.0.0.1 --port=8001
```

> Le port 8001 est utilisé par défaut dans ce projet (le 8000 par défaut de Laravel est parfois déjà pris par un autre projet). Si tu changes le port, pense à mettre à jour `VITE_API_PROXY_TARGET` côté frontend (voir §4.2) et `APP_URL`/`SANCTUM_STATEFUL_DOMAINS` dans `.env`.

L'API est maintenant accessible sur `http://127.0.0.1:8001/api/...`. Test rapide :

```bash
curl http://127.0.0.1:8001/api/settings
```

## 4. Installation du frontend (React/Vite)

### 4.1. Dépendances

Depuis la racine du projet (pas dans `backend/`) :

```bash
npm install
```

### 4.2. Variables d'environnement (optionnel)

Le frontend fonctionne avec les valeurs par défaut (`/api` proxié vers `http://127.0.0.1:8001`). Si besoin de personnaliser :

```bash
# .env.development à la racine du projet
VITE_API_URL=/api
```

Et si le backend tourne sur un autre port que 8001, exporte avant de lancer `npm run dev` :

```bash
VITE_API_PROXY_TARGET=http://127.0.0.1:XXXX npm run dev
```

### 4.3. Démarrer le frontend

```bash
npm run dev
```

Le site est accessible sur **http://localhost:8443**.

## 5. Accéder au site

- Site public : http://localhost:8443
- Panel admin : http://localhost:8443/admin (redirige vers `/admin/login` si non connecté)
  - Email : `admin@savio.com`
  - Mot de passe : `12345678`
- Espace paroissien (comptes membres) : http://localhost:8443/espace-paroissien — créer un compte directement depuis cette page

## 6. Commandes utiles au quotidien

**Frontend**
```bash
npm run dev        # serveur de dev
npm run build       # build de production
npm run preview     # prévisualiser le build
npx tsc --noEmit    # vérifier les types TypeScript
```

**Backend** (depuis `backend/`)
```bash
php artisan serve --host=127.0.0.1 --port=8001   # démarrer l'API
php artisan migrate:fresh --seed                  # tout réinitialiser (⚠️ efface les données existantes)
php artisan migrate                                # appliquer les nouvelles migrations sans tout effacer
php artisan db:seed --class=NomDuSeeder            # rejouer un seeder précis
php artisan tinker                                  # console interactive (ex: changer un mot de passe admin)
php artisan route:list --path=api                   # lister toutes les routes API
```

## 7. Structure du projet

```
Savio/
├── src/                    # Frontend React (voir README.md pour le détail)
│   ├── lib/                # api.ts, auth.tsx, settings.tsx
│   └── pages/admin/         # Panel d'administration
└── backend/                # API Laravel
    ├── app/Http/Controllers/Api/   # Contrôleurs (public + Admin)
    ├── app/Models/
    ├── app/Payments/                # Abstraction de paiement
    ├── database/migrations/
    ├── database/seeders/            # Données de départ
    └── routes/api.php               # Toutes les routes API
```

Voir `README.md` (racine) et `AGENTS.md` pour plus de détails sur l'architecture.

## 8. Problèmes fréquents

- **`SQLSTATE[HY000] [2002] Connection refused`** → MySQL n'est pas démarré. Lance-le (ex. `sudo /opt/lampp/lampp startmysql`).
- **Port 8000/8001/8443 déjà utilisé** → un autre processus l'occupe déjà (`ss -ltnp | grep <port>` pour vérifier). Change de port comme indiqué en §3.7/§4.2.
- **Les images uploadées depuis l'admin ne s'affichent pas** → as-tu bien lancé `php artisan storage:link` (§3.6) ?
- **401/403 sur les routes `/admin/*` de l'API** → il faut un token valide d'un compte avec `role = admin` (connecte-toi via `/admin/login`, ou vérifie le compte via `php artisan tinker` → `App\Models\User::where('email', 'admin@savio.com')->first()`).
- **`Class "Laravel\Sanctum\..." not found`** → `composer install` n'a pas été lancé ou a échoué, relance-le depuis `backend/`.
