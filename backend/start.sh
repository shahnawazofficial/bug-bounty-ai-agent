#!/bin/bash
# Grant schema permissions for DigitalOcean managed PostgreSQL
# This runs before the app starts to ensure proper permissions

echo "Setting up database permissions..."

# Extract connection details from DATABASE_URL
DB_URL="${DATABASE_URL}"

# Ensure SSL mode for DigitalOcean managed PostgreSQL
export PGSSLMODE=require

# Run permission grants using psql if available, otherwise skip
if command -v psql &> /dev/null; then
  psql "$DB_URL" -c "GRANT ALL ON SCHEMA public TO current_user;" 2>/dev/null || true
  psql "$DB_URL" -c "GRANT CREATE ON SCHEMA public TO current_user;" 2>/dev/null || true
fi

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Starting server..."
node src/server.js
