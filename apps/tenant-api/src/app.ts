import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("combined"));
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
      register: "POST /api/v1/auth/register",
      login: "POST /api/v1/auth/login",
      users: "GET /api/v1/users",
      roles: "GET /api/v1/roles",
    },
    usage: {
      note: "All endpoints require X-API-Key header",
      example: "curl -H 'X-API-Key: your-api-key' http://localhost:3002/health",
    },
  });
});

// TODO: Add routes here later
// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/roles", roleRoutes);

// 404 handler
app.use("*", (req, res) => {
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
