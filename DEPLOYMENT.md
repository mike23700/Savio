# Deploying on IONOS shared hosting

This guide targets a standard IONOS **Web Hosting** contract (no Docker, no
VPS): two subdomains, each connected to a folder in the webspace.

```
Webspace root (FTP/SFTP)
├── savio-frontend/            ← document root of https://savio.example.com
│   ├── index.html
│   ├── .htaccess              (SPA fallback + cache headers)
│   ├── assets/
│   └── robots.txt
│
└── savio-backend/             ← Laravel application (NOT served directly)
    ├── .env                   ← secrets, outside the document root
    ├── app/ config/ database/ routes/ storage/ vendor/ …
    ├── deploy/ionos/setup.sh
    └── public/                ← document root of https://api.savio.example.com
        ├── index.php
        ├── .htaccess
        ├── storage/           (optional symlink to ../storage/app/public)
        └── …
```

The two public URLs used below are placeholders — replace them everywhere:

| Purpose | Placeholder | Must point to |
| --- | --- | --- |
| Frontend | `https://savio.example.com` | `savio-frontend/` |
| API | `https://api.savio.example.com` | **`savio-backend/public/`** |

> **Critical:** the API subdomain must point to `savio-backend/public`, never to
> `savio-backend` itself. Otherwise `.env`, `vendor/` and the database
> credentials would be downloadable. A safety `.htaccess` is included in
> `savio-backend/` for the case where IONOS only lets you select the whole
> folder, but the `public/` destination is strongly preferred.

---

## 1. Test the production build locally first

Use a local MySQL database (XAMPP or any MySQL/MariaDB) and two terminals.

### 1.1 Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Create the database first, then:
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8001
```

`.env.example` already allows `http://localhost:8443` through CORS. If you use
another port for the frontend, add its exact origin to `FRONTEND_URL`.

### 1.2 Frontend, with the production bundle

```bash
# The API URL must be absolute and end with /api:
VITE_API_URL=http://127.0.0.1:8001/api npm run build:prod
npm run preview -- --host 127.0.0.1 --port 8443
```

`build:prod` runs the TypeScript check and refuses to build without a valid
`VITE_API_URL`. `npm run preview` serves the real `dist/` output; it does not
use the dev proxy when an absolute API URL was baked in.

Open <http://localhost:8443> and <http://localhost:8443/admin>. Check that:

- the home page loads content from the API (settings, next mass, etc.);
- the admin login works (`admin@savio.com` / `12345678` after a fresh seed —
  change it immediately);
- a deep link such as `/admin/actualites` works after a page reload;
- uploading an image in the admin works and the preview is loaded from
  `http://127.0.0.1:8001/storage/...`.

If the browser console shows a CORS error, the origin in `FRONTEND_URL` does
not match exactly (scheme, host and port must match; no trailing slash).

### 1.3 Automated checks

```bash
npm run typecheck          # TypeScript
npm run build              # Vite build (no API URL required)
cd backend && composer test
```

The backend test suite uses SQLite in memory. If your PHP has no
`pdo_sqlite`, either enable it or point the `phpunit.xml` `<env>` values to a
throwaway MySQL database.

---

## 2. Prepare IONOS

### 2.1 PHP version

In **IONOS → Websites → your API subdomain → PHP settings** (wording varies),
select **PHP 8.2 or newer**. Laravel 12 requires PHP ≥ 8.2.

Required extensions (normally enabled by IONOS): `pdo_mysql`, `mbstring`,
`openssl`, `tokenizer`, `dom`, `fileinfo`, `curl`, `zip`, `gd`. Check with a
temporary `phpinfo()` page or `php -m` over SSH.

Recommended PHP limits for uploads (admin images ≤ 5 MB, audio/PDF ≤ 20 MB):

| Setting | Value |
| --- | --- |
| `upload_max_filesize` | `24M` |
| `post_max_size` | `28M` |
| `memory_limit` | `256M` |
| `max_execution_time` | `120` |

### 2.2 Database

In **IONOS → Databases**, create a MySQL database and a database user, then
note the connection data. The host is usually something like
`db-xxxxxxxx.hosting-data.io` — **not** `127.0.0.1`. Grant the user full
privileges on the database.

### 2.3 SSL

Enable SSL for both subdomains in IONOS and wait until the certificates are
active. The API and frontend must both use `https://`; otherwise mixed-content
blocking will hide API responses.

### 2.4 Folders and subdomains

1. In the IONOS File Manager or over SFTP, create two folders at the webspace
   root:
   - `savio-frontend`
   - `savio-backend`
2. In **IONOS → Domains & SSL**, create `savio.example.com` and
   `api.savio.example.com`.
3. For each subdomain, choose **Use domain → Connect to webspace** and set the
   destination folder:
   - `savio-frontend` → `savio-frontend`
   - `api.savio.example.com` → **`savio-backend/public`**
4. Wait for DNS/SSL to be active.

If the destination picker only allows the top-level `savio-backend` folder,
select it: the included `savio-backend/.htaccess` rewrites requests into
`public/` and blocks `.env`. Test carefully that
`https://api.savio.example.com/.env` returns 403/404.

---

## 3. Build the release locally

Node and Composer are not required on the IONOS server: the release script
installs the production PHP dependencies locally and includes `vendor/`.

```bash
# From the repository root:
VITE_API_URL=https://api.savio.example.com/api bash scripts/package-ionos.sh
```

Output:

| Path | Purpose |
| --- | --- |
| `release/frontend/` | ready to upload to `savio-frontend` |
| `release/frontend.zip` | same, for the File Manager |
| `release/backend/` | ready to upload to `savio-backend` |
| `release/backend.zip` | same, for the File Manager |
| `release/env/backend.env` | upload **once** as `savio-backend/.env` (APP_KEY already generated) |
| `release/storage-seed/team/` | copy **once** into `savio-backend/storage/app/public/team/` |
| `release/savio-init.sql` | import **once** in phpMyAdmin |
| `release/START-HERE.txt` | no-SSH checklist for this exact package |

The backend archive contains `vendor/` (production only), `deploy/ionos/setup.sh`,
`.env.ionos.example` and `database/init/savio-init.sql`. It deliberately contains
**no** `.env`, no uploaded files and no tests. The `.env` and seed uploads are
kept outside `backend.zip` so that a later code update cannot overwrite them.

The database dump is generated by `scripts/export-ionos-db.sh` from
`php artisan migrate:fresh --seed`; it contains every migration and all
`DatabaseSeeder` content, including the initial admin account.

> This repository tracks images with **Git LFS**. Run
> `git lfs install && git lfs pull` before packaging. If the script warns that
> files under `src/imports/` are Git LFS pointers, the logo and the seeded team
> portraits would be broken on the live site — fetch them and rebuild.

The frontend reads its API URL from `config.js` at runtime
(`window.__SAVIO_CONFIG__.apiUrl`). The packaging script writes the
`VITE_API_URL` value into it, but you can change the API domain later by
editing `savio-frontend/config.js` on the server — **no rebuild needed**. Keep
the `/api` suffix and do not cache that file (the included `.htaccess` sets
`no-cache` for it).

If you prefer a completely baked build, leave `config.js` empty and rebuild
with the new `VITE_API_URL`.

---

## 4. Upload

Use **Webfiles / File Manager** (extract the ZIPs) or SFTP. With SFTP/SSH,
`rsync` is convenient:

```bash
rsync -av --delete release/frontend/ user@host:/path/to/savio-frontend/
rsync -av --delete \
  --exclude=.env \
  --exclude=storage/app/public/ \
  --exclude=public/storage \
  release/backend/ user@host:/path/to/savio-backend/
```

> On updates, never delete `savio-backend/.env` or
> `savio-backend/storage/app/public/` (uploaded images, audio and PDFs).
> `release/backend` does not contain them, but a blind `--delete` would.

Make sure the hidden `.htaccess` files were uploaded. File Manager sometimes
hides dotfiles; enable "show hidden files" or upload them explicitly.

On the **first** deployment, also upload:

- `release/env/backend.env` as `savio-backend/.env` (then edit the DB/URL
  values in it);
- the contents of `release/storage-seed/team/` into
  `savio-backend/storage/app/public/team/`.

They are outside the ZIPs on purpose: future backend updates must not overwrite
the live `.env` or the live uploads.

---

## 5. Configure the backend

### 5.1 Create `.env`

**Fast path (no SSH):** upload `release/env/backend.env` as
`savio-backend/.env`. It already contains a generated `APP_KEY`; edit only the
values below (via the IONOS File Manager editor or by preparing the file
locally). Do not regenerate the key later.

**From the template:** with SSH/File Manager:

```bash
cd /path/to/savio-backend
cp .env.ionos.example .env
```

Edit at least these values:

| Variable | Example / note |
| --- | --- |
| `APP_URL` | `https://api.savio.example.com` (no trailing slash) |
| `APP_KEY` | already generated in `release/env/backend.env`; with `.env.ionos.example`, leave empty and `setup.sh` (SSH) generates it, or use `php artisan key:generate --show` locally |
| `FORCE_HTTPS` | `true` |
| `FRONTEND_URL` | `https://savio.example.com,https://www.savio.example.com` (exact origins, comma-separated) |
| `SANCTUM_STATEFUL_DOMAINS` | `savio.example.com,www.savio.example.com,api.savio.example.com` |
| `DB_HOST` | the IONOS database host (`db-xxxx.hosting-data.io`) |
| `DB_DATABASE` / `DB_USERNAME` / `DB_PASSWORD` | from IONOS |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | only used by the seeders; the imported SQL already contains the admin |
| `PEEX_*` | leave empty to keep manual payments; set production credentials only when ready |

`LOG_STACK=daily` and `LOG_LEVEL=warning` are already set. Laravel writes to
`storage/logs/`.

### 5.2 Permissions

The PHP user must be able to write to:

```text
storage/
storage/app/public/
storage/framework/cache/
storage/framework/sessions/
storage/framework/views/
storage/logs/
bootstrap/cache/
```

Over SSH:

```bash
chmod -R ug+rwX storage bootstrap/cache
```

Without SSH, use the IONOS File Manager: right-click `storage` and
`bootstrap/cache` → **Permissions** → `775` (or `755` if the host runs PHP as
the same user). Do the same for their subfolders if needed.

The setup script also creates these folders and applies the permissions.

---

## 6. Create the database (no script required)

The release ships a ready-to-import database dump:
`release/savio-init.sql` (also at `release/backend/database/init/savio-init.sql`).
It contains **every migration and all starter content** from
`php artisan migrate:fresh --seed`: settings, mass schedule, sacraments,
catechesis, prayers, homilies, movements, projects, news, team members, media,
presentation pages, events, products, rental spaces, journal and accounting
data, plus the initial admin account.

### 6.1 Import via phpMyAdmin (the no-SSH path)

1. Open **IONOS → Databases → phpMyAdmin** for the database created in §2.2.
2. Select the database, open **Import**, choose `savio-init.sql`, keep
   `utf8mb4`, and import.
3. Upload `release/env/backend.env` as `savio-backend/.env` (first deployment
   only), then edit `APP_URL`, `FRONTEND_URL` and `DB_*`. The `APP_KEY` is
   already generated: do **not** replace it later, or encrypted data and
   sessions will break.
4. Copy `release/storage-seed/team/*` into
   `savio-backend/storage/app/public/team/`.
5. Log in at `https://savio.example.com/admin` with
   `admin@savio.com` / `12345678`, then **change the password immediately**.

No SSH, cron job, Composer, `php artisan migrate`, `db:seed`,
`key:generate`, `config:cache` or `storage:link` is required. Laravel runs
without the optional caches, and uploaded files are served by the
`/storage/{path}` fallback route when `public/storage` is not a symlink.

> ⚠ `savio-init.sql` starts with `DROP TABLE IF EXISTS` statements. Import it
> **only once**, into an empty database. Importing it again replaces all live
> content.

To avoid the default admin password, replace the bcrypt hash in the
`INSERT INTO \`users\`` statement before importing — instructions and a
one-liner are in `backend/database/init/README.md`.

### 6.2 With SSH or cron (optional)

If your subscription provides SSH or cron, you can instead let Laravel create
the database:

```bash
cd /path/to/savio-backend
bash deploy/ionos/setup.sh --seed     # first deployment, empty database
bash deploy/ionos/setup.sh            # later deployments (no seed)
```

The script creates the runtime folders, generates `APP_KEY` if needed, clears
stale caches, runs `php artisan migrate --force`, optionally seeds, creates
`public/storage` when symlinks are allowed, and rebuilds the config/route/view
caches. With cron, prefix the PHP binary if needed:
`PHP_BIN=/usr/bin/php8.2 bash deploy/ionos/setup.sh --seed`.

Do **not** run `--seed` after importing `savio-init.sql`: the seeders are meant
for an empty database. Future schema changes still need `php artisan migrate
--force`, so SSH or cron remains useful for long-term maintenance.

---

## 7. Verify the deployment

| Check | Expected |
| --- | --- |
| `https://api.savio.example.com/up` | HTTP 200 |
| `https://api.savio.example.com/` | JSON `{"name":…,"status":"ok"}` |
| `https://api.savio.example.com/api/settings` | JSON settings object |
| `https://api.savio.example.com/.env` | 403 or 404 (never the file) |
| `https://savio.example.com/` | parish home page |
| `https://savio.example.com/config.js` | `window.__SAVIO_CONFIG__.apiUrl` = the API `/api` URL |
| `https://savio.example.com/admin` | admin login form |
| Login + edit “Baptême” | change is visible on the public sacraments page |
| Upload an image in the admin | image URL starts with `https://api.savio.example.com/storage/` |
| Reload `/admin/actualites` directly | page loads (SPA fallback works) |

In the browser console, the API requests must show
`Access-Control-Allow-Origin: https://savio.example.com`. If they do not,
correct `FRONTEND_URL` in `backend/.env`, then run:

```bash
php artisan config:clear && php artisan config:cache
```

---

## 8. Update workflow

### Frontend only

```bash
VITE_API_URL=https://api.savio.example.com/api bash scripts/package-ionos.sh
```

Upload/extract `release/frontend.zip` into `savio-frontend`. Because assets are
hashed and `index.html` is not cached, the new version is picked up
immediately.

### Backend

1. Upload the changed files (or the new `release/backend` contents) without
   overwriting `.env` and `storage/app/public/`.
2. With SSH/cron: run `bash deploy/ionos/setup.sh` (no `--seed`). Without
   SSH: upload the changed code only, and apply any new migration SQL in
   phpMyAdmin (ask for a prepared SQL diff when a release adds migrations).
3. If `.env` changed, the script’s `config:clear` + `config:cache` steps pick
   up the new values (or, without a config cache, Laravel reads `.env` on the
   next request).

Never run `migrate:fresh` or `db:seed` on production after the first deploy:
`migrate:fresh` drops everything, and the seeders are meant for starter
content. The admin seeder is safe to re-run (it preserves an existing
password), but other seeders may duplicate content.

---

## 9. Security checklist

- [ ] API subdomain points to `backend/public/` (test `/.env` returns 403/404).
- [ ] `APP_ENV=production`, `APP_DEBUG=false`.
- [ ] `APP_KEY` set and backed up (changing it invalidates encrypted data).
- [ ] `FRONTEND_URL` lists only real frontend origins.
- [ ] Admin password changed after the first login; default `12345678` removed.
- [ ] `savio-init.sql` was imported only once, into an empty database.
- [ ] `ADMIN_PASSWORD` in `.env` is not the example value (if seeders are used).
- [ ] SSL active on both subdomains; `FORCE_HTTPS=true`.
- [ ] `storage/` and `bootstrap/cache/` writable, other folders not world-writable.
- [ ] IONOS backups enabled.
- [ ] `PEEX_*` production keys only if mobile money is live; webhook URL is
      `https://api.savio.example.com/api/payments/peex/callback`.
- [ ] Delete unused `release/` archives from your computer after upload (they
      contain production `vendor/` code but no secrets).

---

## 10. Troubleshooting

| Symptom | Likely cause / fix |
| --- | --- |
| HTTP 500 on every API route | Check `storage/logs/laravel.log`. Often `APP_KEY` missing, wrong PHP version, missing `pdo_mysql`, or unwritable `storage/`/`bootstrap/cache/`. |
| Frontend shows “contenu momentanément indisponible” | API unreachable or CORS blocked. Check `VITE_API_URL` baked in the bundle and `FRONTEND_URL`; rebuild/re-cache after changes. |
| CORS error in console | Origin must match exactly (`https://`, host, optional port; no trailing slash). Include both `www` and non-`www` if both are used. |
| API returns HTML instead of JSON | `config.js` has an empty or wrong `apiUrl`, so the SPA calls the frontend host. Edit `savio-frontend/config.js` (`https://api…/api`) — no rebuild needed — or rebuild with the correct `VITE_API_URL`. |
| 404 on `/admin` after reload | Frontend `.htaccess` missing/ignored or `mod_rewrite` disabled. Re-upload `dist/.htaccess`; ask IONOS to enable `AllowOverride`. |
| Uploaded images 404 | `public/storage` symlink absent and the fallback route not reached. Run `php artisan storage:link`; check `APP_URL`; verify `/storage/<file>` hits Laravel. |
| Upload fails (500 / permission denied) | `storage/` or `bootstrap/cache/` is not writable by the PHP user. Run `chmod -R ug+rwX storage bootstrap/cache`; if IONOS runs PHP under another user, use 775/664 or contact IONOS support. |
| Logo or team portraits are broken | Images were still Git LFS pointers at build time. Run `git lfs install && git lfs pull`, then re-run `scripts/package-ionos.sh`. |
| Database connection refused | IONOS uses a remote DB host, not `127.0.0.1`. Copy the host/port from the IONOS database page; check user privileges. |
| 419/CSRF errors | This API uses Bearer tokens, not CSRF cookies. A 419 usually means an old frontend bundle or a proxy rewriting requests. |
| `route:cache` fails | A closure route was added. Use a controller (as this project does) and run `php artisan route:clear`. |
| Admin login works locally, 401 in production | Token is per environment (localStorage). Log in again on the production domain. |
| Admin login fails after importing the SQL | The `users` table was not imported or the hash was modified. Use `admin@savio.com` / `12345678`, or replace the hash as described in `backend/database/init/README.md`. |
| All public content is empty after import | `.env` still points to the placeholder `DB_HOST`/database, or the SQL was imported into another database. Correct `backend/.env`; no cache clear is needed if `config:cache` was never run. |
| `composer install` platform error on IONOS | The server PHP is too old or missing an extension. Select PHP 8.2+ and enable `pdo_mysql`, `dom`, `mbstring`, `fileinfo`. |

---

## 11. Rollback

Keep the previous `release/frontend.zip` and `release/backend` archive. To roll
back:

1. Re-upload the previous frontend `dist` and backend files (keep the current
   `.env` and `storage/app/public/`).
2. Run `bash deploy/ionos/setup.sh` if the previous backend version expected a
   different cache/schema state.
3. Do **not** restore an old database dump unless you accept losing data
   created since that dump; prefer a forward migration fix.
