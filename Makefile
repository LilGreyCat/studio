up:
	docker compose up --build db api web

up-web:
	docker compose up --build web	

down:
	docker compose down

# migrate-up:
# 	docker compose exec api sh -lc \
# 	'migrate -path /app/migrations -database "$DATABASE_URL" up'

logs:
	docker compose logs -f

logs-api:
	docker compose logs -f api

logs-web:
	docker compose logs -f web		

logs-db:
	docker compose logs -f db

enter-api:
	docker compose exec api sh

enter-web:
	docker compose exec web sh

enter-db:
	docker compose exec db sh

restart-web:
	docker compose restart web

prod-up:
	docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

prod-down:
	docker compose --env-file .env.production -f docker-compose.prod.yml down

prod-logs:
	docker compose --env-file .env.production -f docker-compose.prod.yml logs -f

prod-create-admin:
	docker compose --env-file .env.production -f docker-compose.prod.yml --profile tools run --rm admin-create

prod-clean-uploads:
	docker compose --env-file .env.production -f docker-compose.prod.yml --profile tools run --rm upload-cleanup

prod-backup:
	bash deploy/backup.sh

# Usage: make prod-restore BACKUP=/absolute/path/to/backup.tar.gz
prod-restore:
	bash deploy/restore.sh --yes "$(BACKUP)"
