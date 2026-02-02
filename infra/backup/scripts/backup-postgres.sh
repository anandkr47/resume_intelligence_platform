#!/bin/bash
# PostgreSQL backup script

set -e

BACKUP_DIR="${BACKUP_DIR:-/backups/postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/postgres_backup_$TIMESTAMP.dump"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Database connection details
PGHOST="${POSTGRES_HOST:-postgres}"
PGPORT="${POSTGRES_PORT:-5432}"
PGUSER="${POSTGRES_USER:-postgres}"
PGDATABASE="${POSTGRES_DB:-resume_platform}"

echo "Starting PostgreSQL backup..."
echo "Database: $PGDATABASE"
echo "Backup file: $BACKUP_FILE"

# Create backup
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
  -h "$PGHOST" \
  -p "$PGPORT" \
  -U "$PGUSER" \
  -d "$PGDATABASE" \
  -F c \
  -f "$BACKUP_FILE"

# Compress backup
if command -v gzip &> /dev/null; then
  echo "Compressing backup..."
  gzip "$BACKUP_FILE"
  BACKUP_FILE="${BACKUP_FILE}.gz"
fi

echo "Backup completed: $BACKUP_FILE"

# Cleanup old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "postgres_backup_*.dump*" -mtime +$RETENTION_DAYS -delete

echo "Backup process completed successfully"
