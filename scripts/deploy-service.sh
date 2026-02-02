#!/bin/bash
# Deploy script for individual microservices
# Usage: ./scripts/deploy-service.sh <service-name> [environment]

set -e

SERVICE_NAME=$1
ENVIRONMENT=${2:-production}
TAG=${DOCKER_TAG:-latest}
REGISTRY=${DOCKER_REGISTRY:-""}

if [ -z "$SERVICE_NAME" ]; then
    echo "Error: Service name is required"
    echo "Usage: ./scripts/deploy-service.sh <service-name> [environment]"
    exit 1
fi

IMAGE_NAME="${SERVICE_NAME}"
if [ -n "$REGISTRY" ]; then
    IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}"
fi

echo "Deploying ${SERVICE_NAME}..."
echo "Environment: ${ENVIRONMENT}"
echo "Image: ${IMAGE_NAME}:${TAG}"

# Build the service
./scripts/build-service.sh "${SERVICE_NAME}" "${TAG}"

# Push to registry if specified
if [ -n "$REGISTRY" ]; then
    echo "Pushing ${IMAGE_NAME}:${TAG} to registry..."
    docker push "${IMAGE_NAME}:${TAG}"
fi

# Deploy based on environment
case $ENVIRONMENT in
    docker-compose)
        echo "Updating docker-compose service..."
        docker-compose -f infra/docker-compose/docker-compose.yml up -d "${SERVICE_NAME}"
        ;;
    swarm)
        echo "Updating Docker Swarm service..."
        docker service update --image "${IMAGE_NAME}:${TAG}" "resume-platform_${SERVICE_NAME}"
        ;;
    *)
        echo "Unknown environment: ${ENVIRONMENT}"
        echo "Supported: docker-compose, swarm"
        exit 1
        ;;
esac

echo "Successfully deployed ${SERVICE_NAME}"
