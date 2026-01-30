#!/bin/bash
# Push all microservices to registry
# Usage: ./scripts/push-all-services.sh [tag]

set -e

TAG=${1:-latest}
REGISTRY=${DOCKER_REGISTRY:-""}

if [ -z "$REGISTRY" ]; then
    echo "Error: DOCKER_REGISTRY environment variable is required"
    echo "Usage: DOCKER_REGISTRY=your-registry.com ./scripts/push-all-services.sh [tag]"
    exit 1
fi

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

echo "Pushing all microservices to ${REGISTRY} with tag: ${TAG}"

for service in "${SERVICES[@]}"; do
    IMAGE_NAME="${REGISTRY}/${service}"
    echo ""
    echo "Pushing ${IMAGE_NAME}:${TAG}..."
    docker push "${IMAGE_NAME}:${TAG}"
done

echo ""
echo "========================================="
echo "All services pushed successfully!"
echo "========================================="
