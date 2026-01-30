#!/bin/bash
# Seed jobs script
# Seeds the database with mock job data via the API

echo "🌱 Seeding jobs into database..."

# Try API Gateway first (port 3000)
ENDPOINT="http://localhost:3000/api/jobs/seed"

echo "Attempting to seed via API Gateway: $ENDPOINT"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{}' \
  --max-time 10)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  echo "✅ Jobs seeded successfully via API Gateway!"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  exit 0
fi

# Try direct Analytics API (port 3002)
ENDPOINT="http://localhost:3002/api/jobs/seed"
echo ""
echo "Trying direct Analytics API: $ENDPOINT"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{}' \
  --max-time 10)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  echo "✅ Jobs seeded successfully via Analytics API!"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  exit 0
fi

echo ""
echo "❌ Failed to seed jobs (HTTP $HTTP_CODE)"
echo ""
echo "Please ensure:"
echo "  1. Analytics API is running (port 3002)"
echo "  2. API Gateway is running (port 3000)"
echo "  3. Database is accessible"
echo ""
echo "You can check service status with:"
echo "  pnpm docker:ps"
echo "  docker-compose -f deployments/docker-compose/docker-compose.microservices.yml ps"
exit 1
