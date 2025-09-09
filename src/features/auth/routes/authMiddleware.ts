import { Request, Response, NextFunction } from "express";
import { auth } from "../infrastructure/auth";

export const authMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
      const session = await auth.api.getSession({
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
        asResponse: false,
      });
      if (!session?.user) return res.status(401).json({ error: "Invalid token" });
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};
