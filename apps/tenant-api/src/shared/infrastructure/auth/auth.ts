// apps/tenant-api/src/shared/infrastructure/auth.ts
import { betterAuth } from "better-auth";
import { PrismaClient } from "@prisma/client";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  // We'll customize user creation to include tenantId
  user: {
    additionalFields: {
      tenantId: {
        type: "string",
        required: true,
      }
    }
  },
  // Disable social providers for tenant users (or configure separately)
  socialProviders: {
    // You could add tenant-specific OAuth if needed
  },
});