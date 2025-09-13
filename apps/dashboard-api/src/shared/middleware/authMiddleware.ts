// apps/dashboard-api/src/shared/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { auth } from "../infrastructure/auth";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const authMiddleware = () => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: new Headers(req.headers as any),
        asResponse: false,
      });

      if (!session?.user) {
        return res.status(401).json({ error: "Authentication required" });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name || undefined,
      };

      next();
    } catch (err) {
      console.error("Auth middleware error:", err);
      return res.status(401).json({ error: "Invalid session" });
    }
  };
};
