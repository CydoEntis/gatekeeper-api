import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../../shared/middleware/authMiddleware";

// Import the type from middleware
interface AuthenticatedRequest {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
  body: any;
  headers: any;
}

const router = Router();
const prisma = new PrismaClient();

// Create a new tenant
router.post("/", authMiddleware(), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email } = req.body;
    const ownerId = req.user!.id; // From Better Auth session

    // Create tenant in dashboard database
    const tenant = await prisma.tenant.create({
      data: {
        name,
        email,
        ownerId,
      },
    });

    // TODO: Create API key in tenant API
    // For now, just return the tenant
    res.status(201).json({
      message: "Tenant created successfully",
      tenant,
    });
  } catch (error) {
    console.error("Error creating tenant:", error);
    res.status(500).json({ error: "Failed to create tenant" });
  }
});

// Get all tenants for the authenticated user
router.get("/", authMiddleware(), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ownerId = req.user!.id;

    const tenants = await prisma.tenant.findMany({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ tenants });
  } catch (error) {
    console.error("Error fetching tenants:", error);
    res.status(500).json({ error: "Failed to fetch tenants" });
  }
});

export default router;
