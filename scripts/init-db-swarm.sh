#!/usr/bin/env bash
# Run Postgres init SQL against the Swarm stack DB (idempotent).
# Use after deploy if analytics APIs return 500 (e.g. "relation does not exist").
# Usage: ./scripts/init-db-swarm.sh
# Run from repo root so infra/postgres/init.sql is found.

set -e

STACK_NAME="${STACK_NAME:-resume-platform}"
INIT_SQL="${INIT_SQL:-infra/postgres/init.sql}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-resume_platform}"

if [ ! -f "$INIT_SQL" ]; then
  echo "Error: $INIT_SQL not found. Run from repo root or set INIT_SQL."
  exit 1
fi

echo "Looking for Postgres container (stack $STACK_NAME)..."
CONTAINER=""
for wait in 1 2 3 4 5 6 7 8 9 10; do
  CONTAINER=$(docker ps -q --filter "label=com.docker.swarm.service.name=postgres" --filter "status=running" 2>/dev/null | head -1)
  [ -z "$CONTAINER" ] && CONTAINER=$(docker ps -q --filter "name=${STACK_NAME}_postgres" --filter "status=running" 2>/dev/null | head -1)
  [ -z "$CONTAINER" ] && CONTAINER=$(docker ps -q --filter "name=postgres" --filter "status=running" 2>/dev/null | head -1)
  [ -z "$CONTAINER" ] && CONTAINER=$(docker ps -q --filter "ancestor=postgres:15-alpine" --filter "status=running" 2>/dev/null | head -1)
  if [ -n "$CONTAINER" ]; then
    if docker exec "$CONTAINER" pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" -q 2>/dev/null; then
      break
    fi
    CONTAINER=""
  fi
  [ $wait -lt 10 ] && echo "  Waiting for Postgres... ($wait/10)" && sleep 6
done

if [ -z "$CONTAINER" ]; then
  echo "Error: No running Postgres container found for stack $STACK_NAME."
  echo ""
  echo "Diagnostics:"
  docker stack services "$STACK_NAME" 2>/dev/null | head -20 || true
  echo ""
  echo "Running containers (postgres in name or image):"
  docker ps -a --filter "name=postgres" --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Image}}" 2>/dev/null || true
  docker ps -a --filter "ancestor=postgres:15-alpine" --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Image}}" 2>/dev/null || true
  echo ""
  echo "  If the stack just deployed, wait 30–60s and run: pnpm run swarm:init-db"
  echo "  Check postgres service: docker service ps ${STACK_NAME}_postgres"
  exit 1
fi

echo "Applying init SQL to Postgres (container=$CONTAINER, db=$POSTGRES_DB)..."
docker exec -i "$CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < "$INIT_SQL"

echo "Done. Analytics APIs should work now."
