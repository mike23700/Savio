# Initial database (`savio-init.sql`)

This file contains the **complete initial database** for the site:

- all Laravel migrations and framework tables (52 tables in this version, including `migrations`, `sessions`, `cache`, `jobs`);
- all starter content produced by `DatabaseSeeder`: settings, mass schedule, sacraments,
  catechesis levels, prayers, homilies, movements, projects, news, team members, media,
  presentation pages, events, products, rental spaces, journal data and accounting
  categories;
- one admin account.

It was generated from a fresh `php artisan migrate:fresh --seed` and is meant to be
imported **once**, into an empty IONOS database, through phpMyAdmin.

> ⚠ The file contains `DROP TABLE IF EXISTS` statements. Importing it into a database
> that already has content **replaces that content**. Back up first if needed.

## Already have a live database?

Do **not** import `savio-init.sql` over it. Import the migration update instead:

```text
update-2026-11-04.sql
```

It adds the four migrations introduced by the remote update (multi-day events,
movement members, sacrament requests, product categories/extra product images)
and marks them as applied. Run it once in phpMyAdmin. If a statement fails
because the column/table already exists, skip that statement and continue.

## Import on IONOS (no SSH required)

1. Create the database and database user in the IONOS control panel.
2. Open **phpMyAdmin** for that database.
3. Select the database, then **Import**.
4. Choose `savio-init.sql`, keep UTF-8 / utf8mb4, and import.
5. The site's `.env` must point to that database (`DB_HOST`, `DB_DATABASE`,
   `DB_USERNAME`, `DB_PASSWORD`).
6. Log in at `https://<frontend-domain>/admin` with:
   - **Email:** `admin@savio.com`
   - **Password:** `12345678`
7. **Change this password immediately** in the admin (or use the method below
   before importing).

If you use the packaged release, the same file is also copied to the release root
as `savio-init.sql` for convenience.

## Use a different admin password before importing

Generate a bcrypt hash locally (PHP 8.2+):

```bash
php -r 'echo password_hash("YourStrongPassword", PASSWORD_BCRYPT, ["cost" => 12]), PHP_EOL;'
```

In `savio-init.sql`, find the `INSERT INTO \`users\`` statement and replace the
existing hash (the `$2y$12$...` value) with the generated one. Then import the file.
Alternatively, import as-is, log in, and change the password from the admin UI.

## Uploaded seed images (team portraits)

The SQL references five team portraits under `storage/app/public/team/`. They are
bundled in the release under `storage-seed/team/` (and in
`database/seeders/assets/`). Copy them once to:

```text
savio-backend/storage/app/public/team/
```

The filenames must be kept: `fankam-ngandjui.jpg`, `kamga.png`, `pandeu-tatsi.jpg`,
`gwodog-tang.jpg`, `mbekou.jpg`.

If you use `php artisan db:seed --class=TeamMemberSeeder`, the seeder copies them
automatically and this manual step is not needed.

## Regenerate this file

From the repository root, with a local MySQL database configured in `backend/.env`:

```bash
CONFIRM_FRESH=yes bash scripts/export-ionos-db.sh --fresh
```

`--fresh` runs `php artisan migrate:fresh --seed` first (it **drops** the local
database tables) and then dumps the result. Without `--fresh`, the script dumps the
current local database as-is.
