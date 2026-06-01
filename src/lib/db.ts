import { PrismaClient } from "@/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || connectionString.includes("username:password")) {
    // Return standard Prisma Client if DATABASE_URL is placeholder or empty (e.g., during build phase)
    // to avoid breaking the build steps.
    console.warn("DATABASE_URL is not set or is using placeholder credentials. Falling back to default client.");
    return new PrismaClient();
  }

  // Set up WebSocket constructor for Node.js environments
  neonConfig.webSocketConstructor = ws;

  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;
