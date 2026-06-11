#!/bin/bash
set -e

echo "=== Bug Bounty AI Agent Startup ==="

# Ensure SSL for DigitalOcean managed PostgreSQL
export PGSSLMODE=require

# Append sslmode to DATABASE_URL if missing (for prisma migrate deploy)
if [[ "$DATABASE_URL" != *"sslmode"* ]]; then
  if [[ "$DATABASE_URL" == *"?"* ]]; then
    export DATABASE_URL="${DATABASE_URL}&sslmode=require"
  else
    export DATABASE_URL="${DATABASE_URL}?sslmode=require"
  fi
fi

echo "Running Prisma migrations..."
if npx prisma migrate deploy 2>&1; then
  echo "Migrations completed successfully."
else
  echo "migrate deploy failed (likely permissions). Trying db push..."
  npx prisma db push --accept-data-loss 2>&1 || echo "db push also failed - continuing anyway"
fi

echo "Starting server..."
node src/server.js
