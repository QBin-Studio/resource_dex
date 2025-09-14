import { PrismaClient } from '../prisma/client/client.js';
const dbClient = new PrismaClient();

export default dbClient;
