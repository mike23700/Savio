# Paroisse Saint Dominique Savio — Site web

Site de la **Paroisse Saint Dominique Savio** (Archidiocèse de Douala, Doyenné Wouri I, Cameroun) : présentation de la paroisse, vie communautaire, célébrations, actualités, agenda, médiathèque, boutique, dons et un **panel d'administration** permettant de gérer la quasi-totalité du contenu depuis le navigateur.

Le frontend est issu d'un export **Figma Make**, adapté pour npm, et connecté à un backend Laravel/MySQL construit spécifiquement pour ce projet.

> 📝 L'historique des évolutions du site (formulaire de contact, bans, upload audio/PDF des homélies…) est documenté dans le [CHANGELOG.md](CHANGELOG.md).

## Technologies utilisées

**Frontend**
- **[React 19](https://react.dev/)** — bibliothèque UI, en TypeScript
- **[React Router 8](https://reactrouter.com/)** — routage côté client (`createBrowserRouter`)
- **[Vite 8](https://vitejs.dev/)** — outil de build et serveur de développement
- **[Tailwind CSS 4](https://tailwindcss.com/)** — styles utilitaires (configuration via `@theme` dans `src/index.css`)
- **TypeScript 5** — typage statique

**Backend** (dossier `backend/`)
- **[Laravel](https://laravel.com/)** (PHP 8.2) — API REST pure (JSON), aucune vue Blade
- **[Laravel Sanctum](https://laravel.com/docs/sanctum)** — authentification par token (membres + admin, via une colonne `role`)
- **MySQL** (via XAMPP) — base `savio_paroisse`
- Une interface `PaymentProviderInterface` isole le paiement (boutique/dons) derrière un fournisseur "manuel" (instructions Orange Money/MTN MoMo/Espèces + confirmation admin), remplaçable plus tard par une vraie intégration API sans toucher au reste du code

## Structure du projet

```
src/
├── main.tsx                    # Point d'entrée de l'application
├── App.tsx                     # Composant racine (AuthProvider + SettingsProvider + RouterProvider)
├── routes.tsx                  # Déclaration de toutes les routes (public + /admin)
├── index.css                   # Styles globaux et thème Tailwind
├── lib/
│   ├── api.ts                  # Client HTTP vers l'API Laravel (gestion du token)
│   ├── auth.tsx                # AuthProvider, useAuth(), RequireAuth, RequireAdmin
│   └── settings.tsx            # Paramètres globaux de la paroisse (WhatsApp, réseaux sociaux...) via l'API
├── components/
│   └── Layout.tsx               # En-tête, navigation, pied de page communs (public)
├── data/
│   └── content.ts                # Données encore statiques (contact de la paroisse)
├── imports/                       # Images, logos et documents (PDF) du site
└── pages/
    ├── Home.tsx, Contact.tsx, Agenda.tsx, Actualites.tsx, Homelies.tsx,
    │   Mediatheque.tsx, Don.tsx, Boutique.tsx, BoutiqueDetail.tsx, EspaceMembre.tsx, ...
    ├── paroisse/                   # Histoire, Genèse, Saint Dominique Savio, Équipe, Organisation, Archidiocèse...
    ├── vie-paroissiale/            # Mouvements & groupes (+ détail), Caritas, Projets (+ détail), Registre
    ├── celebrer/                   # Horaires des messes, Sacrements (+ détail), Intention de messe, Bans
    ├── se-nourrir/                 # Catéchèse, Prière, Journal
    └── admin/                      # Panel d'administration (voir plus bas)

backend/
├── app/
│   ├── Http/Controllers/Api/       # Contrôleurs REST (public + Admin)
│   ├── Models/                     # Modèles Eloquent
│   ├── Payments/                   # Abstraction de paiement (PaymentProviderInterface, ManualPaymentProvider)
│   └── Services/NextMassCalculator.php  # Calcul de la prochaine messe / du programme du jour
├── database/
│   ├── migrations/                 # Schéma de la base MySQL
│   └── seeders/                    # Données de départ (reprises du contenu original du site)
└── routes/api.php                  # Toutes les routes API
```

### Sections principales du site

- **La Paroisse** — histoire, genèse, présentation de Saint Dominique Savio, équipe pastorale, organisation, rattachement à l'Archidiocèse, médiathèque
- **Vie paroissiale** — mouvements & groupes (avec page détail), Caritas, projets (avec galerie photo), registre paroissial
- **Célébrer** — horaires des messes (dynamiques), sacrements (avec page détail éditable), intentions de messe, publication des bans
- **Se nourrir** — catéchèse éditable, prière & méditation éditable, journal paroissial (abonnement)
- **Actualités & Agenda** — actualités de la paroisse et événements à venir (gérés depuis l'admin)
- **Homélies & Médiathèque** — homélies avec favoris (connecté), photos, lien vers la chaîne YouTube
- **Contact, Don (connexion requise), Boutique (commande + paiement guidé), Espace paroissien** — services connectés

### Panel d'administration (`/admin`)

Accessible à `http://localhost:8443/admin`, protégé par connexion (compte avec le rôle `admin`). Permet de gérer : paramètres de la paroisse, horaires de messe, sacrements, catéchèse, prière, intentions de messe, homélies, mouvements & groupes, projets (+ photos), registre paroissial (saisie manuelle), produits boutique, commandes, dons, abonnements/numéros/tarifs du journal.

## Prérequis

- [Node.js](https://nodejs.org/) 22 (voir `.mise.toml`)
- npm
- PHP 8.2+ et Composer 2 (le dossier `backend/` fournit `composer.phar` à la racine du repo si besoin)
- MySQL (via XAMPP ou autre) — base par défaut : `savio_paroisse` sur `127.0.0.1:3306`, utilisateur `root` sans mot de passe

## Installation et démarrage

> Les images sont stockées avec **Git LFS**. Après un clone, lance
> `git lfs install && git lfs pull` ; sinon le logo et les portraits sont des
> pointeurs texte (images cassées). Voir [DEPLOYMENT.md](DEPLOYMENT.md) pour le
> packaging de production.

### Frontend

```bash
npm install
npm run dev         # démarre Vite sur http://localhost:8443, proxie /api vers le backend
npm run typecheck   # vérifie les types TypeScript
npm run build       # build local
npm run build:prod  # build de déploiement (exige VITE_API_URL)
npm run preview     # prévisualiser le build
```

### Backend

```bash
cd backend
composer install               # ou: php ../composer.phar install
cp .env.example .env            # si besoin, puis configurer DB_* pour pointer vers MySQL
php artisan migrate:fresh --seed   # crée les tables et les données de départ
php artisan serve --host=127.0.0.1 --port=8001
```

Le compte admin par défaut est créé par `AdminUserSeeder` (voir la sortie de la commande de seed pour les identifiants — à changer immédiatement après la première connexion).

Le proxy Vite (`vite.config.ts`) route `/api` vers `http://127.0.0.1:8001` par défaut ; ajustez `VITE_API_PROXY_TARGET` si le backend tourne sur un autre port.

## Déploiement (IONOS shared hosting)

Le guide complet est dans **[DEPLOYMENT.md](DEPLOYMENT.md)** : test local en mode production, création des deux sous-domaines, génération de l'archive (`scripts/package-ionos.sh`), configuration du `.env` serveur, migrations et vérifications.

En résumé :

```bash
# Construire les deux archives (frontend + backend avec vendor/)
VITE_API_URL=https://api.savio.example.com/api bash scripts/package-ionos.sh
```

- `release/frontend/` → dossier du sous-domaine frontend (l'URL d'API est modifiable dans `config.js` sans rebuild)
- `release/backend/` → dossier Laravel, avec le sous-domaine API pointé vers **`backend/public/`**
- `release/env/backend.env` → à uploader **une fois** comme `savio-backend/.env` (clé `APP_KEY` déjà générée)
- `release/storage-seed/team/` → à copier **une fois** dans `savio-backend/storage/app/public/team/`
- `release/savio-init.sql` → base de départ complète (toutes les migrations + tout le seed), à importer dans phpMyAdmin
- `release/START-HERE.txt` → checklist complète **sans SSH, sans cron, sans script sur le serveur**

La base `savio-init.sql` contient tout le contenu de départ et le compte admin initial ; aucune commande `artisan` n'est nécessaire sur IONOS.

## Alias d'import

Le chemin `@/` pointe vers le dossier `src/` (configuré dans `tsconfig.json` et `vite.config.ts`), par exemple :

```ts
import { apiGet } from "@/lib/api";
import { useAuth } from "@/lib/auth";
```
