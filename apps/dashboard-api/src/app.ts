import express from "express";
import bodyParser from "body-parser";
import { authRoutes } from "./features/auth/authRoutes";
import { authMiddleware } from "./shared/middleware/authMiddleware";

const app = express();
app.use(bodyParser.json());

app.use("/auth", authRoutes());

app.get("/protected", authMiddleware(), (req, res) => {
  res.json({ message: "You made it!" });
});

export default app;
