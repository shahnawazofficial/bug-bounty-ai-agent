require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// DigitalOcean managed PostgreSQL uses a self-signed certificate chain.
// We must strip the sslmode param from the URL (which triggers strict cert
// verification in pg) and instead pass ssl config explicitly so that
// rejectUnauthorized: false is respected by the Node TLS layer.
const rawUrl = process.env.DATABASE_URL || '';
const cleanUrl = rawUrl.replace(/[?&]sslmode=[^&]*/g, '').replace(/[?&]$/, '');

const pool = new Pool({
  connectionString: cleanUrl,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

module.exports = prisma;
