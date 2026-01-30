#!/bin/bash

set -e

BACKUP_DIR="infra/postgres/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/resume_db_$TIMESTAMP.sql"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

PGHOST=${POSTGRES_HOST:-localhost}
PGPORT=${POSTGRES_PORT:-5432}
PGUSER=${POSTGRES_USER:-resume_user}
PGPASSWORD=${POSTGRES_PASSWORD:-resume_password}
PGDATABASE=${POSTGRES_DB:-resume_db}

mkdir -p $BACKUP_DIR

echo "Creating backup: $BACKUP_FILE"
PGPASSWORD=$PGPASSWORD pg_dump -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

echo "Backup complete: ${BACKUP_FILE}.gz"

# Keep only last 7 backups
ls -t $BACKUP_DIR/*.gz | tail -n +8 | xargs -r rm

echo "Old backups cleaned up"
