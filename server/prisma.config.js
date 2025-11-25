require("dotenv").config();

module.exports = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node dist/scripts/seed.js",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
