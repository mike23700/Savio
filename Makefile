SHELL := /bin/bash
.DEFAULT_GOAL := help

COMPOSE := docker compose

FILE ?=
ARGS ?=
PULL ?= 1
RESET ?= 0
YES ?= 0
SKIP_MIGRATE ?= 0

# `make db-import FILE=x.sql` and `make db-import x.sql` both work.
DB_IMPORT_FILE := $(if $(strip $(FILE)),$(FILE),$(word 2,$(MAKECMDGOALS)))
DB_IMPORT_RESET := $(if $(filter 1,$(RESET)),--reset,)

.PHONY: help env deploy frontend up down restart ps logs shell artisan \
	db-shell db-import db-dump uploads-import migrate cache smoke cleanup

# Only swallow the extra goal for db-import. Other targets keep make's normal
# "no rule to make target" error, so a typo never passes silently.
ifneq ($(filter db-import,$(firstword $(MAKECMDGOALS))),)
ifneq ($(strip $(word 2,$(MAKECMDGOALS))),)
$(word 2,$(MAKECMDGOALS)): ;
endif
endif

help:
	@echo "Savio VPS deployment"
	@echo ""
	@echo "  make env                 Create .env from .env.docker.example (once)"
	@echo "  make deploy              git pull, build frontend, start db + api"
	@echo "  make frontend            Build ./dist only (one-shot container)"
	@echo "  make up                  Build and start db + api"
	@echo "  make down                Stop and remove containers (keeps volumes)"
	@echo "  make restart             Restart the api container"
	@echo "  make ps                  Show service status"
	@echo "  make logs                Follow container logs (Ctrl+C to quit)"
	@echo "  make shell               Open a shell in the api container"
	@echo "  make artisan ARGS='...'  Run an artisan command"
	@echo "  make db-shell            Open the MySQL client as root"
	@echo "  make db-import FILE=...  Import a .sql/.sql.gz dump"
	@echo "  make db-dump             Write backups/savio-<timestamp>.sql.gz"
	@echo "  make uploads-import FILE=...  Import old storage/app/public archive"
	@echo "  make migrate             Run pending migrations"
	@echo "  make cache               Clear and rebuild Laravel caches"
	@echo "  make smoke               Curl the public API and website"
	@echo "  make cleanup             Prune unused Docker images only"
	@echo ""
	@echo "  db-import also accepts a positional file: make db-import ~/dump.sql"
	@echo "  Destructive reset: make db-import FILE=... RESET=1 [YES=1]"
	@echo "  Skip the pull: make deploy PULL=0"

env:
	@bash scripts/init-env.sh

deploy:
	@if [ "$(PULL)" = "1" ]; then \
		echo "==> git pull --ff-only"; \
		git pull --ff-only; \
	else \
		echo "==> skipping git pull (PULL=$(PULL))"; \
	fi
	@$(MAKE) frontend
	@$(MAKE) up
	@$(COMPOSE) ps
	@FRONTEND_URL=$$(grep -m1 -E '^FRONTEND_URL=' .env | cut -d= -f2-); \
		echo "Website: $${FRONTEND_URL:-see FRONTEND_URL in .env}"
	@API_URL=$$(grep -m1 -E '^API_URL=' .env | cut -d= -f2-); \
		echo "API:     $${API_URL:-see API_URL in .env}"

frontend:
	@mkdir -p dist
	@$(COMPOSE) --profile build build frontend
	@$(COMPOSE) --profile build run --rm frontend

up:
	@$(COMPOSE) up -d --build db api

down:
	@$(COMPOSE) down
	@echo "Containers removed. Named volumes savio_db_data and savio_storage_data were kept."

restart:
	@$(COMPOSE) restart api

ps:
	@$(COMPOSE) ps

logs:
	@$(COMPOSE) logs -f --tail=200

shell:
	@$(COMPOSE) exec api sh

artisan:
	@$(COMPOSE) exec api php artisan $(ARGS)

db-shell:
	@$(COMPOSE) exec db sh -c 'MYSQL_PWD="$$MYSQL_ROOT_PASSWORD" mysql -u root "$$MYSQL_DATABASE"'

db-import:
	@if [ -z "$(strip $(DB_IMPORT_FILE))" ]; then \
		echo "Usage: make db-import FILE=path.sql [RESET=1] [YES=1]" >&2; \
		echo "   or: make db-import path.sql" >&2; \
		exit 2; \
	fi
	@set -e; \
		file='$(DB_IMPORT_FILE)'; \
		case "$$file" in "~/"*) file="$$HOME/$${file#\~/}";; esac; \
		RESET=$(RESET) YES=$(YES) SKIP_MIGRATE=$(SKIP_MIGRATE) \
		bash scripts/db-import.sh "$$file" $(DB_IMPORT_RESET)

db-dump:
	@bash scripts/db-dump.sh

uploads-import:
	@if [ -z "$(strip $(FILE))" ]; then \
		echo "Usage: make uploads-import FILE=uploads.tar.gz" >&2; \
		exit 2; \
	fi
	@bash scripts/uploads-import.sh '$(FILE)'

migrate:
	@$(COMPOSE) exec -T api php artisan migrate --force

cache:
	@$(COMPOSE) exec -T api php artisan optimize:clear
	@$(COMPOSE) exec -T api php artisan config:cache
	@$(COMPOSE) exec -T api php artisan route:cache
	@$(COMPOSE) exec -T api php artisan view:cache

smoke:
	@bash scripts/smoke.sh

# Image cache only. Never prunes volumes: they contain the database and uploads.
cleanup:
	@docker image prune -f
