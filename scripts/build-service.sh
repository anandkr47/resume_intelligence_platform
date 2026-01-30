#!/bin/bash
# Build script for individual microservices
# Usage: ./scripts/build-service.sh <service-name> [tag]

set -e

SERVICE_NAME=$1
TAG=${2:-latest}
REGISTRY=${DOCKER_REGISTRY:-""}

if [ -z "$SERVICE_NAME" ]; then
    echo "Error: Service name is required"
    echo "Usage: ./scripts/build-service.sh <service-name> [tag]"
    exit 1
fi

SERVICE_DIR="apps/${SERVICE_NAME}"
DOCKERFILE="${SERVICE_DIR}/Dockerfile"

if [ ! -f "$DOCKERFILE" ]; then
    echo "Error: Dockerfile not found at ${DOCKERFILE}"
    exit 1
fi

# Build context is the monorepo root
IMAGE_NAME="${SERVICE_NAME}"
if [ -n "$REGISTRY" ]; then
    IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}"
fi

echo "Building ${IMAGE_NAME}:${TAG}..."
echo "Service: ${SERVICE_NAME}"
echo "Dockerfile: ${DOCKERFILE}"
echo "Build context: . (monorepo root)"

docker build \
    -f "${DOCKERFILE}" \
    -t "${IMAGE_NAME}:${TAG}" \
    --build-arg SERVICE_NAME="${SERVICE_NAME}" \
    .

echo "Successfully built ${IMAGE_NAME}:${TAG}"
