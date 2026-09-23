# Guide de démarrage — rejoindre le projet Paroisse Saint Dominique Savio

Ce guide t'amène de zéro à un environnement de développement complet (site public + admin + base de données), identique à celui utilisé pour construire le projet.

⚠️ **Pré-requis côté dépôt** : ce guide suppose que le dossier `backend/` (API Laravel) et `src/pages/admin/` (panel admin) ont bien été poussés sur le dépôt distant. Si `git pull` ne te remonte pas ces dossiers, tu es sur le mauvais commit/branche — demande avant de continuer, le guide ne fonctionnera pas tant qu'ils ne sont pas là.

## 0. Vue d'ensemble rapide

Le projet a deux parties :

- **Un frontend unique** (`src/`) en React + Vite + TypeScript + Tailwind CSS v4 : le site public et l'admin (route `/admin`) font partie du même projet — un seul `npm install`, un seul serveur de dev.
- **Un backend PHP + MySQL** (`backend/`) : une API REST **Laravel** (avec Sanctum pour l'auth par token), qui alimente le site public en données (horaires de messe, sacrements, catéchèse, homélies, boutique, etc.) et permet à l'admin de tout modifier.

Pour le détail de l'architecture, voir `README.md` et `AGENTS.md` à la racine. Pour le contrat de l'API, voir `backend/routes/api.php` (toutes les routes y sont listées, groupées par module).

## 1. Pré-requis à installer

- **Git**
- **Node.js 22** (voir `.mise.toml`) + npm (fourni avec Node)
- **PHP 8.2+** avec les extensions `pdo_mysql`, `mbstring`, `openssl`, `curl`, `fileinfo`, `tokenizer`, et un serveur **MySQL/MariaDB**. Le plus simple : installer **XAMPP** (Linux/Mac/Windows), qui fournit les deux d'un coup.
  - Sur Linux, XAMPP s'installe typiquement dans `/opt/lampp/`. Adapte les chemins `/opt/lampp/bin/php` et `/opt/lampp/bin/mysql` ci-dessous si ton installation est différente (ou si `php`/`mysql` sont déjà dans ton PATH, utilise-les directement).
- **Composer 2** — si `composer --version` affiche autre chose (ou rien), installe-le en local dans le projet, sans droits admin :
  ```bash
  php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
  php composer-setup.php --install-dir=. --filename=composer.phar
  ```
  Remplace alors `composer` par `php composer.phar` dans les commandes ci-dessous.

## 2. Récupérer le projet

```bash
git clone https://github.com/mike23700/Savio.git
cd Savio
```

Si tu as déjà le dépôt cloné :

```bash
git pull
```

## 3. Installer les dépendances du frontend

Depuis la racine du projet (site public et admin sont dans le même `npm install`) :

```bash
npm install
```

## 4. Démarrer MySQL

Avec XAMPP :

```bash
sudo /opt/lampp/lampp startmysql
```

(ou via le manager graphique XAMPP si tu préfères)

## 5. Créer la base de données

```bash
/opt/lampp/bin/mysql -u root -e "CREATE DATABASE IF NOT EXISTS savio_paroisse CHARACTER SET utf8mb4"
```

Rien d'autre à créer manuellement — les tables sont générées à l'étape 7 par les migrations Laravel.

## 6. Configurer le backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Les valeurs par défaut de `.env.example` (host `127.0.0.1:3306`, user `root`, mot de passe vide, base `savio_paroisse`) correspondent à une installation XAMPP standard — normalement rien à changer, sauf si ton MySQL local a un autre utilisateur/mot de passe.

`backend/.env` ne doit jamais être commité (déjà listé dans `.gitignore`) : il contient — ou contiendra en production — des identifiants.

## 7. Créer les tables + peupler le contenu + créer le compte admin

```bash
php artisan migrate:fresh --seed
```

Cette commande crée toutes les tables **et** les remplit avec le contenu de départ (horaires de messe, sacrements, catéchèse, prière, homélies, mouvements & groupes, projets, produits boutique, tarifs/numéros du journal), ainsi qu'un compte administrateur :

```
Email        : admin@savio.com
Mot de passe : 12345678
```

⚠️ **`migrate:fresh` efface tout** (tables + données) avant de recréer — à utiliser uniquement pour repartir de zéro. Pour appliquer de nouvelles migrations sans perdre les données existantes (ex. après un `git pull` qui ajoute une table), utilise plutôt :

```bash
php artisan migrate
```

Le compte admin ci-dessus est partagé par tous les développeurs (seed fixe, pas un script à identifiants personnalisés) — **change le mot de passe dès la première connexion** si tu comptes laisser tourner cette instance au-delà d'un test rapide.

## 8. Lien de stockage (photos uploadées)

Nécessaire pour que les photos de projets uploadées depuis l'admin s'affichent :

```bash
php artisan storage:link
```

## 9. Lancer l'API Laravel

Dans un premier terminal, à garder ouvert :

```bash
php artisan serve --host=127.0.0.1 --port=8001  ou   /opt/lampp/bin/php artisan serve --host=127.0.0.1 --port=8001
```

Pourquoi le port 8001 et pas le classique 8000 ? Parce que 8000 est parfois déjà pris par un autre projet local (c'était le cas en développant ce projet). Si 8000 est libre chez toi, tu peux l'utiliser à la place — adapte alors `VITE_API_PROXY_TARGET` à l'étape suivante en conséquence.

## 10. Lancer le site public + l'admin

Dans un second terminal, depuis la racine du projet (pas `backend/`) :

```bash
npm run dev
```

- Site public : http://localhost:8443/
- Admin : http://localhost:8443/admin — connecte-toi avec les identifiants de l'étape 7.

Le proxy `/api → http://127.0.0.1:8001` est déjà configuré par défaut dans `vite.config.ts`. Si ton backend tourne sur un autre port :

```bash
VITE_API_PROXY_TARGET=http://127.0.0.1:XXXX npm run dev
```

⚠️ Sans ce réglage si tu as changé de port, le site ne peut plus joindre l'API : les pages publiques restent vides (aucune donnée chargée) et l'admin affiche une erreur de connexion.

## 11. Vérifier que tout fonctionne

```bash
npx tsc --noEmit -p tsconfig.json   # aucune erreur attendue
npm run build                        # doit se terminer par "✓ built in ...ms"
```

Ensuite, en navigateur :

1. Va sur http://localhost:8443/admin, connecte-toi.
2. Modifie un champ (ex. la description du sacrement « Baptême »), enregistre.
3. Va sur http://localhost:8443/celebrer/sacrements/bapteme, recharge la page : le changement doit apparaître immédiatement.

## 12. Pièges fréquents

- **Erreur de connexion à la connexion admin** → l'API n'est pas joignable depuis le front. Vérifie que le terminal de l'étape 9 tourne toujours, et que le port utilisé correspond bien (étape 10).
- **Erreur de connexion MySQL au lancement de `artisan serve`** → MySQL n'est pas démarré (retour à l'étape 4).
- **Les images uploadées depuis l'admin (photos de projets) ne s'affichent pas** → as-tu bien lancé `php artisan storage:link` (étape 8) ?
- **401/403 sur les routes `/admin/*` de l'API** → il faut un token valide d'un compte avec `role = admin`. Connecte-toi via `/admin/login`, ou vérifie/répare le compte via `php artisan tinker` :
  ```php
  App\Models\User::where('email', 'admin@savio.com')->first();
  ```
- **`Class "Laravel\Sanctum\..." not found`** → `composer install` n'a pas été lancé ou a échoué, relance-le depuis `backend/`.
- **`git pull` ne ramène pas `backend/`, `src/pages/admin/` ou `src/lib/`** → ce travail n'a pas encore été poussé sur le dépôt distant, voir l'avertissement en haut de ce fichier.
- **Modification en admin qui n'apparaît pas sur le site public** → certaines pages restent volontairement statiques et hors périmètre admin : Actualités, Agenda et l'équipe pastorale (`src/data/content.ts`, exports `NEWS`, `EVENTS`, `TEAM`). Si la page que tu modifies est ailleurs, vérifie que le composant fait bien un appel API (`src/lib/api.ts`) plutôt que d'importer des données statiques.

## 13. Pour aller plus loin

- Architecture générale, structure des dossiers, technologies : `README.md`
- Conventions de développement, workflow backend/frontend : `AGENTS.md`
- Détail de chaque endpoint de l'API (auth, horaires, sacrements, boutique, dons, journal...) : `backend/routes/api.php`
