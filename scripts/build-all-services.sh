#!/bin/bash
# Build all microservices
# Usage: ./scripts/build-all-services.sh [tag]

set -e

TAG=${1:-latest}
REGISTRY=${DOCKER_REGISTRY:-""}

SERVICES=(
    "api-gateway-node"
    "analytics-api-node"
    "upload-service-node"
    "export-worker-node"
    "matcher-worker-node"
    "frontend-dashboard"
    "ocr-worker-python"
    "parser-worker-python"
    "insights-worker-python"
)

echo "Building all microservices with tag: ${TAG}"
echo "Registry: ${REGISTRY:-'local'}"

for service in "${SERVICES[@]}"; do
    echo ""
    echo "========================================="
    echo "Building ${service}..."
    echo "========================================="
    ./scripts/build-service.sh "${service}" "${TAG}"
done

echo ""
echo "========================================="
echo "All services built successfully!"
echo "========================================="
