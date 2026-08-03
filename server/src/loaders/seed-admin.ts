import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import config from "../config/env.config.js";
import { prisma, logger } from "../lib/index.js";

export async function seedAdmin() {
  try {
    const adminEmail = config.adminEmail.toLowerCase();
    const hashedPassword = await bcrypt.hash(config.adminPassword, 10);

    const admin = await prisma.user.findUnique({
      where: { email: adminEmail },
      include: {
        accounts: {
          where: { providerId: "credential" },
          take: 1,
        },
      },
    });

    if (admin) {
      await prisma.user.update({
        where: { id: admin.id },
        data: {
          role: "admin",
          emailVerified: true,
        },
      });

      if (!admin.accounts[0]) {
        await prisma.account.create({
          data: {
            id: randomUUID(),
            accountId: adminEmail,
            providerId: "credential",
            userId: admin.id,
            password: hashedPassword,
          },
        });
      }

      logger.info("Admin user already exists, verified Better Auth credentials");
      return;
    }

    await prisma.user.create({
      data: {
        email: adminEmail,
        name: config.adminName,
        role: "admin",
        emailVerified: true,
        accounts: {
          create: {
            id: randomUUID(),
            accountId: adminEmail,
            providerId: "credential",
            password: hashedPassword,
          },
        },
      },
    });

    logger.info("Admin user seeded");
  } catch (error) {
    logger.error("Failed to seed admin user", error);
    throw error;
  }
}
