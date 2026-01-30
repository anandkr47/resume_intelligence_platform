#!/bin/bash
# Redis backup script

set -e

BACKUP_DIR="${BACKUP_DIR:-/backups/redis}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/redis_backup_$TIMESTAMP.rdb"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Redis connection details
REDIS_HOST="${REDIS_HOST:-redis}"
REDIS_PORT="${REDIS_PORT:-6379}"

echo "Starting Redis backup..."
echo "Redis: $REDIS_HOST:$REDIS_PORT"
echo "Backup file: $BACKUP_FILE"

# Trigger Redis BGSAVE and wait for completion
redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" BGSAVE

# Wait for BGSAVE to complete
while [ "$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" LASTSAVE)" = "$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" LASTSAVE)" ]; do
  sleep 1
done

# Copy RDB file
REDIS_DATA_DIR=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" CONFIG GET dir | tail -1)
cp "$REDIS_DATA_DIR/dump.rdb" "$BACKUP_FILE"

# Compress backup
if command -v gzip &> /dev/null; then
  echo "Compressing backup..."
  gzip "$BACKUP_FILE"
  BACKUP_FILE="${BACKUP_FILE}.gz"
fi

echo "Backup completed: $BACKUP_FILE"

# Cleanup old backups
echo "Cleaning up backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "redis_backup_*.rdb*" -mtime +$RETENTION_DAYS -delete

echo "Backup process completed successfully"
