import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./shared/infrastructure/auth/auth";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("combined"));

// Mount Better Auth handler BEFORE express.json()
app.use("/api/auth", toNodeHandler(auth));

// Then add express.json() for other routes
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "tenant-api",
    timestamp: new Date().toISOString(),
  });
});

// API info endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Tenant API - User Management Service",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      auth: "POST|GET /api/auth/*",
      register: "POST /api/auth/sign-up/email",
      login: "POST /api/auth/sign-in/email",
      session: "GET /api/auth/session",
    },
    usage: {
      note: "All endpoints require X-API-Key header (except Better Auth endpoints)",
      example: "curl -H 'X-API-Key: your-api-key' http://localhost:3002/health",
    },
  });
});



// 404 handler
app.use("/{*any}", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  });
});

export default app;
