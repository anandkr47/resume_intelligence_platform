#!/bin/bash
# Comprehensive health check script
# Usage: ./infra/health-checks/health-check.sh

set -e

EXIT_CODE=0

echo "=== Resume Intelligence Platform Health Check ==="
echo ""

# Check PostgreSQL
echo -n "PostgreSQL: "
if pg_isready -h "${POSTGRES_HOST:-localhost}" -p "${POSTGRES_PORT:-5432}" -U "${POSTGRES_USER:-postgres}" > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
    EXIT_CODE=1
fi

# Check Redis
echo -n "Redis: "
if redis-cli -h "${REDIS_HOST:-localhost}" -p "${REDIS_PORT:-6379}" ping > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
    EXIT_CODE=1
fi

# Check API Gateway
echo -n "API Gateway: "
if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
    EXIT_CODE=1
fi

# Check Analytics API
echo -n "Analytics API: "
if curl -sf http://localhost:3002/health > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
    EXIT_CODE=1
fi

# Check Upload Service
echo -n "Upload Service: "
if curl -sf http://localhost:3001/health > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
    EXIT_CODE=1
fi

# Check Frontend
echo -n "Frontend: "
if curl -sf http://localhost:80 > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "✗ Unhealthy"
    EXIT_CODE=1
fi

# Check Prometheus (if running)
echo -n "Prometheus: "
if curl -sf http://localhost:9090/-/healthy > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "○ Not running (optional)"
fi

# Check Grafana (if running)
echo -n "Grafana: "
if curl -sf http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✓ Healthy"
else
    echo "○ Not running (optional)"
fi

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "=== All critical services are healthy ==="
else
    echo "=== Some services are unhealthy ==="
fi

exit $EXIT_CODE
