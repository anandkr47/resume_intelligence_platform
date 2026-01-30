#!/bin/bash

set -e

echo "Running database migrations..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

PGHOST=${POSTGRES_HOST:-localhost}
PGPORT=${POSTGRES_PORT:-5432}
PGUSER=${POSTGRES_USER:-resume_user}
PGPASSWORD=${POSTGRES_PASSWORD:-resume_password}
PGDATABASE=${POSTGRES_DB:-resume_db}

# Run migrations
for migration in infra/postgres/migrations/*.sql; do
    if [ -f "$migration" ]; then
        echo "Running migration: $migration"
        PGPASSWORD=$PGPASSWORD psql -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f "$migration"
    fi
done

echo "Migrations complete!"
