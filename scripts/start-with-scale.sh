#!/usr/bin/env bash
# Start the stack with scaled upload-service and api-gateway for high load (100 VUs).
# Usage: ./scripts/start-with-scale.sh [--build]
# Then run: pnpm run load-test

set -e

BUILD=false
[[ "${1:-}" == "--build" ]] && BUILD=true

COMPOSE_DIR="deployments/docker-compose"
COMPOSE_FILES="-f $COMPOSE_DIR/docker-compose.microservices.yml -f $COMPOSE_DIR/docker-compose.scale.yml"
UPLOAD_REPLICAS="${UPLOAD_REPLICAS:-3}"
GATEWAY_REPLICAS="${GATEWAY_REPLICAS:-1}"

echo "========================================="
echo "Starting with scale (upload=$UPLOAD_REPLICAS, gateway=$GATEWAY_REPLICAS)"
echo "========================================="
echo ""

if [[ "$BUILD" == true ]]; then
  echo "Building images..."
  docker-compose $COMPOSE_FILES build
  echo "✓ Images built"
  echo ""
fi

echo "Starting all services (scaled)..."
docker-compose $COMPOSE_FILES up -d \
  --scale upload-service="$UPLOAD_REPLICAS" \
  --scale api-gateway="$GATEWAY_REPLICAS"

echo ""
echo "✓ Stack running with $UPLOAD_REPLICAS upload-service + $GATEWAY_REPLICAS api-gateway"
echo "  Run load test: pnpm run load-test"
echo "  Logs: docker-compose $COMPOSE_FILES logs -f"
echo ""
