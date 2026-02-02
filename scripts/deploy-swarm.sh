#!/bin/bash
# Deploy stack to Docker Swarm (scaled: upload-service=3, api-gateway=2).
# Usage: ./scripts/deploy-swarm.sh [--no-build]
#   --no-build  Skip building images (faster redeploy).

set -e

SKIP_BUILD=0
[[ "${1:-}" == "--no-build" ]] && SKIP_BUILD=1

echo "Deploying Resume Intelligence Platform to Docker Swarm..."

# Check if swarm is initialized
if ! docker info | grep -q "Swarm: active"; then
    echo "Docker Swarm is not initialized. Initializing..."
    docker swarm init
fi

# Build images unless skipped (in production, push to registry)
if [[ "$SKIP_BUILD" -eq 0 ]]; then
    echo "Building images..."
    docker build -t resume-platform/api-gateway:latest -f apps/api-gateway-node/Dockerfile .
    docker build -t resume-platform/upload-service:latest -f apps/upload-service-node/Dockerfile .
    docker build -t resume-platform/analytics-api:latest -f apps/analytics-api-node/Dockerfile .
    docker build -t resume-platform/ocr-worker:latest -f apps/ocr-worker-python/Dockerfile .
    docker build -t resume-platform/parser-worker:latest -f apps/parser-worker-python/Dockerfile .
    docker build -t resume-platform/matcher-worker:latest -f apps/matcher-worker-node/Dockerfile .
    docker build -t resume-platform/insights-worker:latest -f apps/insights-worker-python/Dockerfile .
    docker build -t resume-platform/export-worker:latest -f apps/export-worker-node/Dockerfile .
    docker build -t resume-platform/frontend:latest -f apps/frontend-dashboard/Dockerfile .
else
    echo "Skipping build (--no-build)."
fi

# Load environment variables
if [ -f .env ]; then
    echo "Loading .env..."
    export $(grep -v '^#' .env | xargs)
fi

if [ -f .env.swarm ]; then
    echo "Loading .env.swarm overrides..."
    export $(grep -v '^#' .env.swarm | xargs)
fi

# Deploy stack
echo "Deploying stack..."
docker stack deploy -c deployments/swarm/stack.yml resume-platform

# Ensure DB schema exists (Postgres only runs init on empty data; run init SQL after deploy)
echo "Ensuring DB schema..."
INIT_SQL="${INIT_SQL:-infra/postgres/init.sql}"
if [ -f "$INIT_SQL" ]; then
  echo "Waiting for Postgres (Swarm may take 15–30s to start tasks)..."
  sleep 10
  PG_CONTAINER=""
  for i in $(seq 1 20); do
    PG_CONTAINER=$(docker ps -q --filter "label=com.docker.swarm.service.name=postgres" --filter "status=running" 2>/dev/null | head -1)
    [ -z "$PG_CONTAINER" ] && PG_CONTAINER=$(docker ps -q --filter "name=resume-platform_postgres" --filter "status=running" 2>/dev/null | head -1)
    if [ -n "$PG_CONTAINER" ]; then
      if docker exec "$PG_CONTAINER" pg_isready -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-resume_platform}" >/dev/null 2>&1; then
        echo "Applying init SQL (idempotent)..."
        docker exec -i "$PG_CONTAINER" psql -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-resume_platform}" < "$INIT_SQL" || true
        echo "DB schema ready."
        break
      fi
    fi
    [ "$i" -eq 20 ] && echo "Warning: Postgres not ready in time; run later: pnpm run swarm:init-db"
    sleep 3
  done
else
  echo "Warning: $INIT_SQL not found; skip DB init. Run from repo root or set INIT_SQL."
fi

echo "Deployment complete!"
echo "Check status with: docker stack services resume-platform"
echo "Scale upload pool after load test: ./scripts/scale-upload.sh <replicas>"
