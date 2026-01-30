#!/bin/bash
# Stop Docker Swarm stack and optionally leave swarm

set -e

STACK_NAME="${1:-resume-platform}"

echo "========================================="
echo "Stopping Docker Swarm"
echo "========================================="
echo ""

# Remove the stack (stops all services and removes containers)
echo "Removing stack: $STACK_NAME"
docker stack rm "$STACK_NAME" 2>/dev/null || true

# Wait for services to shut down
echo "Waiting for services to stop (this may take 30-60 seconds)..."
sleep 5

# Poll until stack is removed
for i in {1..24}; do
  if ! docker stack services "$STACK_NAME" 2>/dev/null | grep -q .; then
    echo "Stack $STACK_NAME removed."
    break
  fi
  echo "  Still removing... ($i)"
  sleep 5
done

# Leave swarm (only if you want to completely disable swarm on this node)
LEAVE_SWARM="${LEAVE_SWARM:-no}"
if [ "$LEAVE_SWARM" = "yes" ] || [ "$LEAVE_SWARM" = "1" ]; then
  echo ""
  echo "Leaving Docker Swarm (LEAVE_SWARM=yes)..."
  docker swarm leave --force 2>/dev/null || true
  echo "Swarm left. You can use 'docker swarm init' to re-enable later."
else
  echo ""
  echo "Stack removed. Swarm is still active."
  echo "To also leave the swarm and stop all swarm activity, run:"
  echo "  LEAVE_SWARM=yes ./scripts/stop-swarm.sh"
  echo "  or: docker swarm leave --force"
fi

echo ""
echo "========================================="
echo "Done. Use docker-compose for local dev:"
echo "  pnpm docker:microservices"
echo "========================================="
