#!/bin/bash
set -e

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

echo "Granting schema permissions..."
# Grant CREATE on public schema to the current DB user
psql "$DATABASE_URL" <<'SQL' 2>/dev/null || echo "psql grant skipped"
DO $$
BEGIN
  EXECUTE 'GRANT ALL ON SCHEMA public TO ' || current_user;
  EXECUTE 'ALTER SCHEMA public OWNER TO ' || current_user;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Could not grant schema permissions: %', SQLERRM;
END $$;
SQL

echo "Running Prisma migrations..."
if npx prisma migrate deploy 2>&1; then
  echo "Migrations completed successfully."
else
  echo "migrate deploy failed. Trying db push..."
  npx prisma db push --skip-generate 2>&1 || echo "db push also failed - tables may already exist"
fi

echo "Starting server..."
node src/server.js
