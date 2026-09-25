# Journal des modifications (CHANGELOG)

Toutes les évolutions notables du site sont documentées dans ce fichier.

---

## 25 septembre 2026

### ✏️ Éditeur de paires pour les repères bio et les repères diocésains (complément)

Deux contenus stockés en JSON n'avaient pas d'éditeur dédié dans « Pages de présentation » : les **repères biographiques** de la page Savio (`extra.bio` : « Né le / 2 avril 1842 »…) et les **repères** de la page Archidiocèse (`extra.facts` : « Doyenné / Wouri I »…). Un nouveau type de champ **« paires label/valeur »** les rend maintenant modifiables (ajout, édition, suppression de lignes, réordonnancement naturel en éditant les libellés).

- `src/pages/admin/Pages.tsx` : composant `PairsEditor` (champ `type: "pairs"` dans la config des pages Savio et Archidiocèse)
- Testé bout en bout : `PUT /api/admin/pages/archidiocese` accepte le format paires et le site public affiche les lignes modifiées

### 📄 Pages de présentation éditables depuis l'admin (nouveau)

Six pages étaient encore **entièrement statiques** (contenu codé en dur dans les fichiers TSX) : Genèse, Histoire, Saint Dominique Savio, Organisation, Archidiocèse et Caritas. Elles sont désormais alimentées par l'API et modifiables depuis une nouvelle page admin **« Pages de présentation »** (`/admin/pages`).

**Fonctionnement**
- Une page = un en-tête (titre, sous-titre, image du bandeau uploadable), un texte d'intro (paragraphes séparés par une ligne vide, **gras** et *italique* acceptés), des titres/textes de sections spécifiques, et des **blocs** répétables : étapes de chronologie, curés successifs (avec photo et encadré « curé actuel »), cartes, lignes, chiffres clés
- Les blocs se créent, se modifient, se suppriment et se **réordonnent** (↑ ↓) directement dans l'admin ; le tri est conservé côté base
- Chaque page publique garde son rendu visuel d'origine — seuls les contenus changent ; en cas d'indisponibilité de l'API, la page dégrade proprement

**Backend**
- Nouvelles tables `page_contents` (hero + intro + `extra` JSON par page) et `page_blocks` (blocs triables par `page_key`)
- Modèles `PageContent` / `PageBlock`, contrôleur `PageContentController` (lecture publique, liste + `PUT` admin avec remplacement des blocs)
- Routes : `GET /api/pages`, `GET /api/pages/{key}` (public) ; `GET /api/admin/pages`, `PUT /api/admin/pages/{key}` (admin)
- `PageContentSeeder` : remplit les 6 pages avec le contenu exact des anciennes pages statiques → après `php artisan db:seed --class=PageContentSeeder`, le site affiche la même chose qu'avant, mais éditable
- Upload d'images accepté dans le nouveau dossier `pages` (`UploadController`, `ImageUpload`)

**Tests**
- `backend/tests/Feature/PageContentTest.php` (7 tests) : liste publique, clé inconnue 404, accès refusé sans token / non-admin, mise à jour admin avec blocs (dont `is_highlight`), remplacement des blocs supprimés, non-touchement des blocs des autres pages
- `npx tsc --noEmit` : 0 erreur ; `npm run build` : OK

> Sur une base existante : `php artisan migrate` puis `php artisan db:seed --class=PageContentSeeder`.

---

## 24 septembre 2026

### 💳 Paiement Mobile Money via Peex (nouveau)

Jusqu'ici, les dons et les commandes de la boutique affichaient seulement des instructions (« Envoyez X FCFA au numéro… ») et un admin devait marquer le paiement comme reçu à la main. Les paiements **Orange Money** et **MTN MoMo** passent désormais par l'API **Collect** de [Peex](https://peex-api-docs.peexit.com/) : le payeur reçoit une demande de paiement sur son téléphone et la valide avec son code secret.

**Fonctionnement**
- Le site envoie la demande à Peex (`POST /collection/request_payment`) avec une référence unique par tentative (ex. `CMD-260924-AB12C-X7QZ`, `DON-3-K9P2`), stockée dans `payment_reference`
- La page de confirmation interroge le statut toutes les 5 s pendant 3 min (`GET /api/payments/{reference}`, qui lui-même interroge Peex) et affiche « Paiement confirmé » ou « Le paiement n'a pas abouti »
- En cas d'échec (numéro invalide, refus, opérateur indisponible), bouton **« Réessayer le paiement »**, avec possibilité de saisir un autre numéro — sans recréer la commande ou le don
- **Webhook** `POST /api/payments/peex/callback` : Peex prévient le site dès qu'une transaction est finalisée, même si le payeur a fermé la page. Protégé par Basic Auth (`PEEX_CALLBACK_USERNAME` / `PEEX_CALLBACK_PASSWORD`)
- Un paiement déjà **payé**, ou **annulé** par un admin, n'est jamais modifié par une notification ultérieure
- Une commande payée passe automatiquement de « En attente » à « Confirmée »
- Les numéros sont convertis au format international exigé par Peex (`655 52 99 99` → `+237655529999`)
- **Espèces** : inchangé (instructions + confirmation admin)
- **Sans clé Peex configurée** : repli automatique sur les instructions manuelles, le site fonctionne comme avant

**Backend**
- `app/Payments/PeexPaymentProvider.php` (nouveau) : client de l'API Collect, correspondance des statuts Peex → site (`paid` → `paye` ; `failed` / `canceled` / `rejected` → `echoue` ; `new` / `pending` → `en_attente`)
- `app/Payments/PaymentService.php` : réécrit — choix du fournisseur, démarrage/relance d'une tentative, mise à jour du statut, normalisation des numéros
- `app/Payments/PaymentRequest.php` (nouveau), `PaymentProviderInterface.php` et `ManualPaymentProvider.php` adaptés (le message manuel inclut maintenant la référence)
- `app/Http/Controllers/Api/PaymentController.php` (nouveau) : suivi du statut, relance, webhook Peex
- Routes publiques : `GET /api/payments/{reference}` (30 req/min), `POST /api/payments/{reference}/retry` (5 req/min), `POST /api/payments/peex/callback`
- Nouveau statut de paiement **`echoue`** (en plus de `en_attente`, `paye`, `annule`) sur les commandes et les dons
- Nouvelles colonnes sur `orders` et `donations` : `payment_provider`, `payment_provider_status`, `payment_details` ; `telephone` sur `donations`
- Le formulaire de don exige un numéro Mobile Money (pré-rempli avec celui du compte)
- Configuration dans `config/services.php` (clé `peex`) et `.env.example`

**Frontend**
- `src/components/PaymentStatus.tsx` (nouveau) : affichage des instructions, attente de validation, succès, échec + relance
- `src/pages/Don.tsx` et `src/pages/Boutique.tsx` utilisent ce composant ; le numéro Orange Money codé en dur sur la page Don est remplacé par un champ « Numéro à débiter »
- Admin **Dons** et **Commandes** : statut `echoue` en rouge, statut Peex et référence affichés sous le paiement

**Configuration** (`backend/.env`)
```
PEEX_BASE_URL=https://sandbox.peexit.com/api/v1/
PEEX_SECRET_KEY=            # clé fournie par Peex ; vide = paiement manuel
PEEX_CALLBACK_USERNAME=     # identifiants Basic Auth du webhook
PEEX_CALLBACK_PASSWORD=
```
En production : `PEEX_BASE_URL=https://server.peexit.com/api/v1/` et la clé de production.

> ⚠️ **À faire** : obtenir la clé sandbox auprès de Peex (la clé d'exemple de la documentation est refusée), puis communiquer l'URL de callback `https://<domaine>/api/payments/peex/callback` une fois le site en ligne. En local, le suivi par interrogation suffit. En sandbox, Peex prélève toujours 10 FCFA quel que soit le montant.

### 🏗️ Dons affectés aux projets paroissiaux (nouveau)

Le bouton « Soutenir ce projet » menait au formulaire de don générique, sans lien avec le projet, et le montant « Collecté » devait être saisi à la main.

- Un don peut désormais être affecté à un projet (nouvelle colonne `donations.projet_id`)
- Quand le don passe à **payé** (Peex, webhook, ou admin), le montant est **ajouté automatiquement** à `projets.collecte` → la barre de progression de `/vie-paroissiale/projets` avance. S'il est annulé ensuite, le montant est retiré. Une notification reçue deux fois n'est comptée qu'une fois (logique centralisée dans `Donation::booted()`)
- Le champ « Collecté » reste modifiable dans l'admin pour les dons reçus hors ligne
- Impossible de donner à un projet terminé ou désactivé (« Ce projet n'accepte plus de dons. »)
- Libellé Peex du paiement : « Don projet : <titre> »

**Frontend**
- Page projet : « Soutenir ce projet » ouvre `/don?projet=<id>` avec le projet présélectionné ; bouton masqué si le projet est terminé
- Page Don : nouveau choix **« Destination du don »** (paroisse ou projet en cours) avec la barre de progression du projet ; le message de remerciement mentionne le projet
- Espace paroissien : après connexion ou inscription, le visiteur revient à la page qu'il voulait ouvrir (ex. le formulaire de don du projet) ; « Mes donations » affiche le projet
- Admin **Dons** : colonne « Projet / intention »

### 🇫🇷 Messages d'erreur en français (correction)

Le site est configuré en français (`APP_LOCALE=fr`) mais aucune traduction n'existait : les formulaires affichaient des clés brutes comme `validation.required`.

- Nouveau fichier `backend/lang/fr/validation.php` : tous les messages de validation en français, noms de champs lisibles (« Le champ prénom est obligatoire. »), et messages dédiés (« Veuillez choisir ou saisir un montant. », « Veuillez indiquer le numéro Mobile Money à débiter. », « Votre panier est vide. »)
- Page Don : vérification du montant avant envoi

### 🔢 Montants correctement formatés (correction)

- MySQL renvoyait les montants sous forme de texte (`"9200000"`), d'où un affichage sans séparateurs. Les modèles `Projet` (`objectif`, `collecte`), `Donation` (`montant`) et `Order` (`total`) les convertissent maintenant en nombres → `9 200 000 FCFA`
- Plus de « NaN % » sur un projet dont l'objectif est 0

### 🧪 Tests

- `backend/tests/Feature/PeexPaymentTest.php` (nouveau, 10 tests, Peex simulé avec `Http::fake()`) : envoi de la demande, espèces, repli sans clé, échec + relance, suivi du statut, sécurité du webhook, non-rétrogradation d'un paiement payé, numéro obligatoire, remplissage de la barre d'un projet, refus d'un projet terminé
- Suite complète : 12 tests OK

### 🗄️ Nouvelles migrations

| Fichier | Rôle |
|---|---|
| `2026_09_24_100000_add_payment_provider_fields.php` | Statut `echoue`, colonnes fournisseur de paiement, téléphone des dons |
| `2026_09_24_110000_add_projet_id_to_donations.php` | Rattachement d'un don à un projet |

> Sur une base existante : `php artisan migrate` (avec le PHP 8.2 de XAMPP : `/opt/lampp/bin/php artisan migrate`).

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
