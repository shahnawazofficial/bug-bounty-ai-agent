require('dotenv').config();
const { defineConfig } = require('prisma/config');

// DigitalOcean managed PostgreSQL requires SSL.
// Append ?sslmode=require if not already present so the Prisma
// schema-engine (used by migrate deploy) connects over TLS.
const rawUrl = process.env['DATABASE_URL'] || '';
const dbUrl = rawUrl.includes('sslmode') ? rawUrl : `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}sslmode=require`;

module.exports = defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: dbUrl,
  },
});
