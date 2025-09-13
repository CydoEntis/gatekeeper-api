import { Router } from "express";
import { auth } from "../../shared/infrastructure/auth";

export const authRoutes = () => {
  const router = Router();

  router.post("/register", async (req, res) => {
    const { email, password, name } = req.body;
    const response = await auth.api.signUpEmail({
      body: { email, password, name },
      asResponse: true,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  });

  router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const response = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  });

  router.post("/oauth/:provider", async (req, res) => {
    const { provider } = req.params;
    const response = await auth.api.signInSocial({
      body: { provider, callbackURL: "/" },
      asResponse: true,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  });

  return router;
};
