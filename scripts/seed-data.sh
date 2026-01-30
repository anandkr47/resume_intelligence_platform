#!/bin/bash

set -e

echo "Seeding database with sample data..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

PGHOST=${POSTGRES_HOST:-localhost}
PGPORT=${POSTGRES_PORT:-5432}
PGUSER=${POSTGRES_USER:-resume_user}
PGPASSWORD=${POSTGRES_PASSWORD:-resume_password}
PGDATABASE=${POSTGRES_DB:-resume_db}

# Seed job roles (already in init.sql, but can add more here)
echo "Job roles are seeded in init.sql"
echo "Seed complete!"
