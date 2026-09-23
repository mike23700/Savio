# Journal des modifications (CHANGELOG)

Toutes les évolutions notables du site sont documentées dans ce fichier.

---

## 23 septembre 2026

### ✉️ Formulaires Contact et Bans connectés à l'API (nouveau)

Jusqu'ici, les formulaires de contact et de publication des bans affichaient « Message envoyé ! » sans rien envoyer au serveur : les messages étaient perdus.

**Backend**
- Nouvelle table `contact_messages` (nom, email, téléphone, sujet, message, statut `nouveau` / `traite` / `archive`)
- Nouvelle table `bans` (noms des futurs époux, date prévue, contact, statut `nouveau` / `en_cours` / `publie`)
- Modèles `ContactMessage` et `Ban`
- Contrôleurs `ContactMessageController` (dépôt public + gestion admin) et `BanController`
- Routes publiques : `POST /api/contact` et `POST /api/bans`
- Routes admin : liste, filtre par statut, changement de statut, suppression

**Frontend public**
- `src/pages/Contact.tsx` : envoie réellement le message à l'API, avec états « envoi en cours » et gestion des erreurs de validation
- `src/pages/celebrer/Bans.tsx` : envoie la demande de ban, affiche les erreurs de validation champ par champ

**Panel admin**
- Nouvelle page **Messages reçus** (`/admin/messages`) : voir tous les messages, filtrer (Nouveaux / Traités / Archivés), marquer traité, archiver, supprimer
- Nouvelle page **Bans de mariage** (`/admin/bans`) : suivi du dossier (Nouveau → En cours → Publié), suppression
- Les 2 pages sont ajoutées à la navigation de l'admin (`AdminLayout.tsx`) et au routage (`src/routes.tsx`)

### 📊 Compteurs sur le tableau de bord admin (nouveau)

- Le tableau de bord (`/admin`) affiche désormais **6 cartes** au lieu de 4 :
  - 🛒 Commandes en attente
  - 🙏 Intentions en attente
  - ✉️ **Messages non traités** (nouveau) → clic vers `/admin/messages`
  - 💍 **Bans non traités** (nouveau) → clic vers `/admin/bans`
  - 📖 Inscriptions catéchèse
  - 📋 Inscriptions registre (7 derniers jours)
- `DashboardController.php` compte `messages_non_traites` et `bans_non_traites` (statut `nouveau`)

### 🌍 Fuseau horaire du visiteur pour les messes (correction)

La « prochaine messe » et le « programme du jour » étaient calculés avec l'heure du **serveur**. Désormais, le calcul utilise l'heure **du navigateur du visiteur** :

- `MassScheduleController.php` : les endpoints `/api/mass-schedule/next` et `/api/mass-schedule/today` acceptent un paramètre `?tz=...` (ex. `Africa/Douala`). Repli silencieux sur l'heure serveur si le paramètre est absent ou invalide.
- `src/pages/Home.tsx` : envoie automatiquement le fuseau du navigateur à l'API
- Correction au passage d'un bug sur l'accueil : la comparaison de date utilisait la date **UTC** (`toISOString()`) au lieu de la date locale — un visiteur au Cameroun entre 0h et 1h du matin voyait un décalage
- Factorisation : fonction `tzQuery()` dans `src/lib/api.ts`, réutilisée partout

### ⛪ Page Messes branchée sur l'API (correction)

- Le bloc « Aujourd'hui » de la page `/celebrer/messes` était **entièrement statique en dur** (date du 15 septembre, fête figée, horaire inventé). Il affiche maintenant le **vrai programme du jour** : date réelle en français, célébrations du jour avec horaires, types et notes, venant de la base, calculées avec le fuseau du visiteur. Message de repli si aucune célébration n'est programmée aujourd'hui.

### 📖 Lectures du jour dynamiques depuis les homélies (nouveau)

- Le bloc « Lectures du jour » de la page Messes était en dur (3 lectures inventées). Il affiche maintenant les lectures de la **dernière homélie publiée** (`/api/homelies/latest`), exactement comme l'accueil : références bibliques réelles, nom de la fête, lien « Écouter l'homélie → », repli propre si aucune homélie n'est publiée.
- Bénéfice : quand le prêtre ajoute une homélie depuis l'admin, les lectures se mettent à jour automatiquement sur **l'accueil**, la **page Messes** et la **page Homélies**.

### 📖 Lectures structurées en 4 champs (nouveau)

Le champ unique « Lectures » des homélies est remplacé par 4 champs distincts :

| Champ | Exemple |
|---|---|
| 1ère lecture | `Nb 21,4b-9` |
| Psaume | `Ps 51` |
| 2ème lecture | `Ph 2,6-11` |
| Évangile | `Jn 3,13-17` |

- Migration : 4 nouvelles colonnes sur `homelies` (`reading_1`, `psalm`, `reading_2`, `gospel`) ; l'ancienne colonne `readings` est conservée
- Le contrôleur **reconstruit automatiquement** la chaîne `readings` à partir des 4 champs (séparateur ` · `) → l'accueil continue de fonctionner sans modification
- Formulaire admin (`/admin/homelies`) : 4 champs identifiés à la place du champ unique
- Page Messes : affichage avec labels (1ère lecture / Psaume / 2ème lecture / Évangile)
- **Compatibilité** : les anciennes homélies (champs structurés vides) continuent d'afficher leur chaîne `readings` d'origine en repli

### 🎙️ Upload de fichiers audio et PDF pour les homélies (nouveau)

Plus besoin de coller des URL : le secrétariat choisit directement les fichiers sur son ordinateur.

- Contrôleur `HomelieController` : upload audio (MP3, max 20 Mo) et PDF (max 20 Mo), stockage dans `storage/app/public/audio/` et `.../pdf/` avec noms aléatoires, **suppression automatique de l'ancien fichier** lors d'un remplacement
- `php artisan storage:link` + proxy Vite `/storage` (`vite.config.ts`) → les fichiers sont servis directement depuis l'URL du site
- Formulaire admin : 2 champs de fichier, envoi en `FormData` via le nouveau helper `apiFormData()` (`src/lib/api.ts`)
- ⚠️ Point technique : PHP ne peut pas parser un `PUT` multipart. Pour la modification, le formulaire envoie un `POST` avec le champ `_method=PUT` (method spoofing Laravel) — géré automatiquement
- Page publique des homélies : la modale affiche un **vrai lecteur audio intégré** (play/pause/progression) et le bouton PDF devient un **vrai lien de téléchargement** (« PDF indisponible » grisé sinon). Les URL externes éventuelles restent supportées (compatibilité).

### ✅ Vérifications effectuées

- `npx tsc --noEmit` : compile sans erreur après chaque chantier
- `php -l` sur tous les fichiers PHP modifiés : aucune erreur de syntaxe
- `php artisan migrate` : les 3 nouvelles migrations appliquées
- Tests bout en bout via l'API : POST Contact/Bans avec données réelles (201) + POST vide refusé par la validation (422) + nettoyage des données de test
- Test upload : MP3 valide accepté et servi via `/storage`, faux MP3 refusé par la validation, remplacement de fichier vérifié (ancien supprimé du disque)

### 🔧 Migrations ajoutées

| Fichier | Rôle |
|---|---|
| `2026_09_23_080000_create_contact_messages_table.php` | Messages du formulaire de contact |
| `2026_09_23_080100_create_bans_table.php` | Demandes de publication des bans |
| `2026_09_23_090000_add_structured_readings_to_homelies_table.php` | 4 colonnes de lectures structurées sur `homelies` |

> Si tu installes le projet depuis zéro, ces migrations sont incluses dans `php artisan migrate:fresh --seed`. Sur une base existante, un simple `php artisan migrate` suffit.

---
