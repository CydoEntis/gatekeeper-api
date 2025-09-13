import { Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { RequestWithTenant } from "../types/RequestWithTenant";

const prisma = new PrismaClient();

export const apiKeyAuth = () => {
  return async (req: RequestWithTenant, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"] as string;
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: "API key required",
        message: "Please provide your API key in the X-API-Key header" 
      });
    }

    try {
      // TODO: Look up tenant by API key in database
      // For now, using placeholder data
      const tenant = await prisma.tenant.findUnique({
        where: { apiKey }
      });

      if (!tenant) {
        return res.status(401).json({ 
          error: "Invalid API key",
          message: "The provided API key is not valid" 
        });
      }

      // Attach tenant info to request
      req.apiKey = apiKey;
      req.tenantId = tenant.id;
      req.tenant = tenant;
      
      next();
    } catch (error) {
      console.error("API key validation error:", error);
      return res.status(500).json({ 
        error: "Internal server error",
        message: "Failed to validate API key" 
      });
    }
  };
};