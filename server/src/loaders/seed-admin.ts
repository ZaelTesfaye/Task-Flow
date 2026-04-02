import bcrypt from "bcrypt";
import config from "../config/env.config.js";
import { prisma, logger } from "../lib/index.js";

export async function seedAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: config.adminEmail },
    });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(config.adminPassword, 10);

      await prisma.user.create({
        data: {
          email: config.adminEmail,
          name: config.adminName,
          password: hashedPassword,
          role: "admin",
        },
      });

      logger.info("Admin user seeded");
    }
  } catch (error) {
    logger.error("Failed to seed admin user", error);
    throw error;
  }
}
