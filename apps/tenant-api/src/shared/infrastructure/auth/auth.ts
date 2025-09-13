// apps/tenant-api/auth.ts
import { betterAuth } from "better-auth";
import { PrismaClient } from "@prisma/client";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { apiKey } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      tenantId: {
        type: "string",
        required: true,
      }
    }
  },
  plugins: [
    apiKey({
      // API keys will be validated automatically
      apiKeyHeaders: ["x-api-key"],
      // Default permissions for API keys
      permissions: {
        defaultPermissions: {
          auth: ["read", "write"], // Can use auth endpoints
          users: ["read", "write"], // Can manage users
        }
      },
      // Enable metadata to store tenant info
      enableMetadata: true,
      // Require names for API keys
      requireName: true,
    })
  ],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3002",
  secret: process.env.BETTER_AUTH_SECRET!,
});