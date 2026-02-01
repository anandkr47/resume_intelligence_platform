#!/bin/bash

set -e

echo "Deploying Resume Intelligence Platform to Docker Swarm..."

# Check if swarm is initialized
if ! docker info | grep -q "Swarm: active"; then
    echo "Docker Swarm is not initialized. Initializing..."
    docker swarm init
fi

# Build and push images (in production, push to registry)
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

echo "Deployment complete!"
echo "Check status with: docker stack services resume-platform"
echo "Scale upload pool after load test: ./scripts/scale-upload.sh <replicas>"
