import { type Express } from "express";
import expressLoader from "./express.js";
import { seedAdmin } from "./seed-admin.js";
import { prisma } from "../lib/index.js";
import { collectDefaultMetrics } from "prom-client";

const loader = async (app: Express) => {
  await prisma.$connect();
  await seedAdmin();
  expressLoader(app);
  collectDefaultMetrics();
};

export default loader;
