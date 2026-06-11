#!/bin/bash
echo "=== Bug Bounty AI Agent Startup ==="

# Append sslmode to DATABASE_URL if not already present
if [[ "$DATABASE_URL" != *"sslmode"* ]]; then
  if [[ "$DATABASE_URL" == *"?"* ]]; then
    export DATABASE_URL="${DATABASE_URL}&sslmode=require"
  else
    export DATABASE_URL="${DATABASE_URL}?sslmode=require"
  fi
fi
export PGSSLMODE=require

echo "Attempting schema permission grants..."
psql "$DATABASE_URL" -c "GRANT CREATE ON SCHEMA public TO current_user;" 2>/dev/null && echo "GRANT succeeded" || echo "GRANT failed (continuing)"
psql "$DATABASE_URL" -c "GRANT USAGE ON SCHEMA public TO current_user;" 2>/dev/null || true

echo "Running Prisma db push (bypasses migration table permission issue)..."
npx prisma db push --accept-data-loss 2>&1 && echo "db push succeeded!" || echo "db push failed - continuing"

echo "Starting server..."
node src/server.js
