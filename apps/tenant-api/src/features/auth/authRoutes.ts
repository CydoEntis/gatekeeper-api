import app from "../../app";
import authRoutes from "../../shared/infrastructure/auth/authRoutes";

app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Tenant API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/v1/auth/*",
      users: "/api/v1/users/*",
      roles: "/api/v1/roles/*",
    },
  });
});
