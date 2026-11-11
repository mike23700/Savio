# Deploying Savio on a VPS with Docker and host nginx

This guide is for a fresh Ubuntu/Debian VPS where nginx is already installed.
Docker runs MySQL and PHP-FPM. nginx stays on the host and serves both the
static website and the API.

The repository is assumed to live at `/opt/savio`. If yours is elsewhere,
replace `/opt/savio` everywhere, including the `root` line in the frontend
nginx configuration.

## Architecture

```
Internet
   |
   | 443 (TLS terminated by host nginx)
   |
host nginx
   |-- https://savio.cwen-network.org
   |      static files from /opt/savio/dist, SPA fallback to index.html
   |
   |-- https://savio-api.cwen-network.org
          FastCGI to 127.0.0.1:9201
                |
                v
        api container (php:8.2-fpm-alpine)
        Laravel 12, code at /var/www/backend
                |
                | private Docker network "savio"
                v
        db container (mysql:8.0)
        no host port, data in volume savio_db_data

Named volumes:
  savio_db_data       MySQL data
  savio_storage_data  Laravel storage/app/public uploads and logs
```

Only `127.0.0.1:9201` is published to the host. MySQL and PHP-FPM are never
reachable directly from the internet.

## Prerequisites

- Docker Engine with the Compose plugin. Check with `docker compose version`.
- nginx installed and running on the host.
- certbot with the nginx plugin.
- git, curl, openssl, gzip, tar and unzip.

On Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx git curl openssl gzip tar unzip
```

Install Docker from Docker's official repository, then verify:

```bash
docker --version
docker compose version
```

You need two DNS records pointing at the VPS before certbot can work:

```text
savio.cwen-network.org      A  <VPS IPv4>
savio-api.cwen-network.org  A  <VPS IPv4>
```

## 1. Get the repository

```bash
sudo mkdir -p /opt/savio
sudo chown "$USER":"$USER" /opt/savio
git clone <REPOSITORY_URL> /opt/savio
cd /opt/savio
```

If the repository is already there, just `cd /opt/savio`.

## 2. Create the environment file

Run this once. It refuses to overwrite an existing `.env`.

```bash
make env
```

It copies `.env.docker.example`, generates `APP_KEY`, `DB_PASSWORD` and
`DB_ROOT_PASSWORD`, and sets permissions to `600`.

Edit `.env` and check these values:

| Variable | Meaning |
| --- | --- |
| `APP_URL` | Public API origin, no trailing slash, for example `https://savio-api.cwen-network.org` |
| `FRONTEND_URL` | Exact website origin allowed by CORS, no trailing slash |
| `API_URL` | Absolute API root ending in `/api`, baked into the frontend build |
| `SANCTUM_STATEFUL_DOMAINS` | Website host without scheme, for example `savio.cwen-network.org` |
| `API_FCGI_PORT` | Loopback port used by nginx, default `9201` |
| `DB_DATABASE`, `DB_USERNAME` | Database name and application user |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Optional first admin, used only when seeding |
| `PEEX_*` | Optional mobile money credentials |

`FORCE_HTTPS=true` is required: nginx terminates TLS and forwards plain HTTP to
PHP-FPM. `FRONTEND_URL` must not end with a slash, otherwise the exact CORS
match fails.

Never commit `.env`. It is git-ignored and contains the database passwords.

## 3. First deployment

```bash
cd /opt/savio
make deploy
```

`make deploy` does the following:

1. `git pull --ff-only` (skip with `make deploy PULL=0`).
2. Builds the frontend in a one-shot Node container and writes `./dist`.
3. Builds and starts `db` and `api`.
4. Prints the service status and the configured URLs.

The api container waits for MySQL, runs migrations, caches config/routes/views,
then starts PHP-FPM. Watch the first start with:

```bash
make logs
```

## 4. Import the database

Import the initial dump from this repository:

```bash
make db-import FILE=backend/database/init/savio-init.sql
```

Or import a dump from the old host:

```bash
make db-import FILE=/root/old-savio.sql.gz
```

The script:

- accepts `.sql` and `.sql.gz`;
- removes `CREATE DATABASE`, `DROP DATABASE`, `USE`, `SQL_LOG_BIN` and
  `GTID_PURGED` lines so the dump lands in `DB_DATABASE`;
- streams into the db container as root without putting the password on the
  host command line;
- runs `php artisan migrate --force` after the import unless
  `SKIP_MIGRATE=1`.

By default it does not drop the database. If the dump has no `DROP TABLE`
statements and the tables already exist, the import fails. Recreate the
database first:

```bash
make db-import FILE=/root/old-savio.sql.gz RESET=1
```

`RESET=1` permanently deletes every table in `DB_DATABASE` before importing.
The script prints the database name and asks you to type `yes`. Add `YES=1` for
a non-interactive run, but only after you have a backup.

The initial dump contains `DROP TABLE` statements. Importing it over an
existing database replaces that data.

After the first import, the seeded admin account is the one documented in
`backend/database/init/README.md`. Change its password immediately.

## 5. Import old uploads

Uploads live outside the database in the named volume `savio_storage_data`.
Create an archive on the old host with one of these layouts:

```bash
tar -czf uploads.tar.gz -C /var/www/savio/backend/storage app/public
# or
tar -czf uploads.tar.gz -C /var/www/savio/backend/storage/app public
# or archive the contents of app/public directly
tar -czf uploads.tar.gz -C /var/www/savio/backend/storage/app/public .
```

Then import it:

```bash
make uploads-import FILE=/root/uploads.tar.gz
```

The script strips a leading `storage/app/public/` or `app/public/` path and
copies the files into the api container's `storage/app/public`. Existing files
are kept; files with the same name are overwritten.

Test a known file after import:

```bash
curl -I https://savio-api.cwen-network.org/storage/team/kamga.png
```

## 6. Install the nginx sites

Copy the two configuration files and enable them:

```bash
sudo cp /opt/savio/deploy/nginx/savio.cwen-network.org.conf /etc/nginx/sites-available/
sudo cp /opt/savio/deploy/nginx/savio-api.cwen-network.org.conf /etc/nginx/sites-available/

sudo ln -s /etc/nginx/sites-available/savio.cwen-network.org.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/savio-api.cwen-network.org.conf /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx
```

Before reloading, check these two values match your installation:

- `root /opt/savio/dist;` in the frontend file.
- `fastcgi_pass 127.0.0.1:9201;` in the API file. It must match
  `API_FCGI_PORT` in `.env`.

Both files listen on port 80 only. Certbot adds TLS:

```bash
sudo certbot --nginx -d savio.cwen-network.org
sudo certbot --nginx -d savio-api.cwen-network.org
```

Choose the redirect option when certbot asks. Certbot edits the files under
`/etc/nginx/sites-available`. If you later copy the repository versions again,
you will overwrite the TLS configuration, so re-run certbot or merge carefully.

Reload nginx after certbot if it does not do it automatically:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 7. Verify

```bash
curl -fsS https://savio-api.cwen-network.org/up
curl -fsS https://savio-api.cwen-network.org/api/settings
curl -fsS "https://savio-api.cwen-network.org/api/news?limit=1"
curl -I https://savio.cwen-network.org/
```

Expected results:

- `/up` returns a small JSON health response.
- `/api/settings` returns JSON, not an HTML error page.
- `/api/news?limit=1` returns a JSON result.
- The website returns `HTTP/2 200` (or `HTTP/1.1 200`) with
  `content-type: text/html`.

The same checks are wrapped in:

```bash
make smoke
```

## 8. Update flow

```bash
cd /opt/savio
make deploy
```

`make deploy` pulls, rebuilds the frontend and API, and restarts the
containers. Migrations run automatically when the api container starts.

Useful commands:

```bash
make ps                  # service status
make logs                # follow logs
make artisan ARGS="about"
make migrate             # run migrations manually
make cache               # clear and rebuild Laravel caches
make restart             # restart only the api container
make down                # stop containers, keeps volumes
```

After a frontend-only change, `make frontend` is enough, but `make deploy` is
the safe default because it also picks up backend changes.

If the API domain changes, update `API_URL`, `APP_URL`, `FRONTEND_URL` and
`SANCTUM_STATEFUL_DOMAINS` in `.env`, then run `make deploy`. The API URL is
baked into the bundle at build time. `dist/config.js` can also be edited on the
server for a quick runtime override; rebuilding is cleaner.

## 9. Backups

Database:

```bash
make db-dump
```

This writes `backups/savio-YYYYmmdd-HHMMSS.sql.gz` and prints the size. The
`backups/` directory is git-ignored.

Restore a dump:

```bash
make db-import FILE=backups/savio-YYYYmmdd-HHMMSS.sql.gz RESET=1
```

Uploads are not in the database dump. Back up the storage volume separately:

```bash
mkdir -p backups
docker run --rm \
  -v savio_storage_data:/data:ro \
  -v "$PWD/backups":/backup \
  alpine tar -czf /backup/uploads-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
```

Restore that archive with `make uploads-import FILE=backups/uploads-....tar.gz`.

The two named volumes are `savio_db_data` and `savio_storage_data`. Losing them
means losing the database and the uploaded files.

## 10. Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| 502 Bad Gateway | api container stopped, or nginx points at the wrong port | `make ps`, `make logs`, check `docker compose ps`, compare `API_FCGI_PORT` with `fastcgi_pass` |
| 504 Gateway Timeout | Request longer than `fastcgi_read_timeout` or PHP `max_execution_time` | Check api logs, raise `fastcgi_read_timeout` and `max_execution_time` if the work is legitimate |
| CORS error in the browser | `FRONTEND_URL` does not exactly match the website origin | Use scheme and host, no trailing slash, no path; restart api after editing |
| Images or PDFs return 404 | Uploads were not imported, or `APP_URL` is wrong | `make uploads-import FILE=...`, then check `APP_URL/storage/...` |
| 500 on every page | `APP_KEY` empty, bad permissions, or a PHP error | `make logs`, check `.env`, run `make cache` |
| Mixed content warnings | `FORCE_HTTPS` is false or `APP_URL` is http | Set `FORCE_HTTPS=true`, use https in `APP_URL` and `API_URL`, rebuild |
| Import fails on `SQL_LOG_BIN` or `GTID_PURGED` | The dump came from a GTID-enabled server | The script strips those lines; if the dump still fails, retry with `RESET=1` or regenerate with `mysqldump --set-gtid-purged=OFF` |
| `bind: address already in use` on 9201 | Another php-fpm or container uses the port | `ss -ltnp | grep 9201`; change `API_FCGI_PORT` and `fastcgi_pass` together |
| 413 Request Entity Too Large | nginx or PHP upload limit too small | `client_max_body_size 30m` in nginx, `upload_max_filesize` and `post_max_size` in `backend/docker/php.ini`, rebuild api |
| Website works but API calls go to the website host | Frontend was built without `API_URL`, or `dist/config.js` is stale | Check `API_URL` in `.env`, run `make frontend`, hard-refresh |
| `make deploy` fails during the frontend build | `API_URL` is missing, not https, or does not end in `/api` | Run `make frontend` to see the exact check error, fix `.env` |
| Changes do not appear after deploy | Browser or nginx cache, or old container still running | Hard-refresh, `make ps`, `make logs`; `make up` recreates changed containers |

## 11. Hard rules

- Never run `docker compose down -v`, `docker compose down --volumes`,
  `docker volume prune` or `docker system prune`. They delete the database
  volume and the uploads volume.
- `make down` is safe: it removes containers but keeps both named volumes.
- `make cleanup` only prunes unused images. It never touches volumes.
- Never publish MySQL port 3306. The compose file does not, and it must stay
  that way.
- Only `127.0.0.1:${API_FCGI_PORT}` is published. nginx is the only public
  entry point.
- Host nginx configuration is not managed by Docker. Edit it under
  `/etc/nginx`, validate with `nginx -t`, then reload.
- Keep `.env` at mode `600`, never commit it, and never paste its passwords
  into a ticket or a chat.
- Take a database dump before any `RESET=1` import or schema change.
