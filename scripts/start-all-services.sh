#!/bin/bash
# Start all microservices using Docker Compose
# Usage: ./scripts/start-all-services.sh [--build] [--infra]

set -e

BUILD=false
INFRA=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --build)
            BUILD=true
            shift
            ;;
        --infra)
            INFRA=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--build] [--infra]"
            exit 1
            ;;
    esac
done

COMPOSE_FILE="deployments/docker-compose/docker-compose.microservices.yml"

echo "========================================="
echo "Starting Resume Intelligence Platform"
echo "========================================="
echo ""

# Start infrastructure services if requested
if [ "$INFRA" = true ]; then
    echo "Starting infrastructure services (monitoring, logging)..."
    docker-compose -f infra/docker/docker-compose.infra.yml up -d
    echo "✓ Infrastructure services started"
    echo ""
fi

# Build images if requested
if [ "$BUILD" = true ]; then
    echo "Building Docker images..."
    docker-compose -f "$COMPOSE_FILE" build
    echo "✓ Images built"
    echo ""
fi

# Start all services
echo "Starting all microservices..."
docker-compose -f "$COMPOSE_FILE" up -d

echo ""
echo "========================================="
echo "Services Starting..."
echo "========================================="
echo ""

# Wait a moment for services to initialize
sleep 5

# Show status
echo "Service Status:"
docker-compose -f "$COMPOSE_FILE" ps

echo ""
echo "========================================="
echo "Access Points:"
echo "========================================="
echo "  Frontend:      http://localhost:80"
echo "  API Gateway:   http://localhost:3000"
echo "  Upload API:    http://localhost:3001"
echo "  Analytics API: http://localhost:3002"
echo "  PostgreSQL:    localhost:5432"
echo "  Redis:         localhost:6379"
echo ""

if [ "$INFRA" = true ]; then
    echo "  Prometheus:    http://localhost:9090"
    echo "  Grafana:       http://localhost:3001 (admin/admin)"
    echo ""
fi

echo "View logs: docker-compose -f $COMPOSE_FILE logs -f"
echo "Stop all:  docker-compose -f $COMPOSE_FILE down"
echo ""
echo "========================================="
echo "✓ All services started successfully!"
echo "========================================="
