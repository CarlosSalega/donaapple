/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                          PRISMA CLIENT                                        ║
 * ║                  Instancia global del cliente de Prisma                     ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Usar esta instancia en lugar de crear nuevas conexiones.
 * Previene múltiples conexiones en desarrollo (hot reload).
 */

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
