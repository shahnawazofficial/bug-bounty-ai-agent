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

echo "Creating database schema directly via psql..."
psql "$DATABASE_URL" <<'ENDSQL'
-- Create enums (idempotent)
DO $$ BEGIN
  CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE "Severity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  "id"          SERIAL PRIMARY KEY,
  "githubId"    TEXT UNIQUE NOT NULL,
  "username"    TEXT NOT NULL,
  "email"       TEXT,
  "avatarUrl"   TEXT,
  "accessToken" TEXT,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Repository table
CREATE TABLE IF NOT EXISTS "Repository" (
  "id"              SERIAL PRIMARY KEY,
  "userId"          INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "repositoryName"  TEXT NOT NULL,
  "repositoryUrl"   TEXT NOT NULL,
  "fullName"        TEXT NOT NULL,
  "securityScore"   INTEGER NOT NULL DEFAULT 100,
  "lastScanDate"    TIMESTAMP(3),
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Scan table
CREATE TABLE IF NOT EXISTS "Scan" (
  "id"            SERIAL PRIMARY KEY,
  "repositoryId"  INTEGER NOT NULL REFERENCES "Repository"("id") ON DELETE CASCADE,
  "scanDate"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "status"        "ScanStatus" NOT NULL DEFAULT 'PENDING'
);

-- Create Vulnerability table
CREATE TABLE IF NOT EXISTS "Vulnerability" (
  "id"            SERIAL PRIMARY KEY,
  "scanId"        INTEGER NOT NULL REFERENCES "Scan"("id") ON DELETE CASCADE,
  "title"         TEXT NOT NULL,
  "severity"      "Severity" NOT NULL,
  "description"   TEXT NOT NULL,
  "filePath"      TEXT,
  "lineNumber"    INTEGER,
  "scannerSource" TEXT NOT NULL,
  "remediation"   TEXT,
  "ruleId"        TEXT,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

SELECT 'Schema ready!' as status;
ENDSQL

if [ $? -eq 0 ]; then
  echo "Database schema created/verified successfully!"
else
  echo "psql schema creation failed - server will start but DB may not work"
fi

echo "Starting server..."
node src/server.js
