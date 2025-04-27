import { PrismaClient } from "../prisma/client/index.js";
const dbClient = new PrismaClient();

export default dbClient;
