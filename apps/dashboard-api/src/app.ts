import express from "express";
import bodyParser from "body-parser";
import { authMiddleware } from "./shared/middleware/authMiddleware";
import tenantRoutes from "./features/tenants/tenantRoutes";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./shared/infrastructure/auth";

const app = express();
app.use(bodyParser.json());

app.use("/api/auth", toNodeHandler(auth));
app.use("/api/tenants", tenantRoutes);


app.get("/protected", authMiddleware(), (req, res) => {
  res.json({ message: "You made it!" });
});

export default app;
