// seeds the super admin to DB

import "dotenv/config.js";
import bcrypt from "bcrypt";
import config from "../config/config.js";
import prisma from "../lib/prisma.js";
import logger from "../lib/logger.js";

async function seedAdmin() {
  const hashedPassword = await bcrypt.hash(config.adminPassword, 10);

  await prisma.user.upsert({
    where: { email: config.adminEmail },
    update: { role: "super-admin" },
    create: {
      email: config.adminEmail,
      name: config.adminName,
      password: hashedPassword,
      role: "super-admin",
    },
  });

  logger.info("Super-admin user seeded");
}

seedAdmin();
