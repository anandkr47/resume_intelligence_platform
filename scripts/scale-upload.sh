#!/usr/bin/env bash
# Scale upload-service replicas in Docker Swarm.
# Use load-test results to pick replica count (e.g. target_RPS / RPS_per_replica).
# Usage: ./scripts/scale-upload.sh [replicas]
# Example: ./scripts/scale-upload.sh 5

set -e

STACK_NAME="${STACK_NAME:-resume-platform}"
SERVICE_NAME="${STACK_NAME}_upload-service-node"
REPLICAS="${1:-3}"

if ! [[ "$REPLICAS" =~ ^[0-9]+$ ]] || [[ "$REPLICAS" -lt 1 ]]; then
  echo "Usage: $0 <replicas>"
  echo "  replicas: number of upload-service replicas (default: 3)"
  exit 1
fi

echo "Scaling $SERVICE_NAME to $REPLICAS replicas..."
docker service scale "$SERVICE_NAME=$REPLICAS"
echo "Done. Check: docker service ps $SERVICE_NAME"
