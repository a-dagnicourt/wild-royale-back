const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'dev' ? ['query'] : undefined,
});

module.exports = prisma;
