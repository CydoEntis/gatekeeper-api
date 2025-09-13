import { Router } from "express";
import { auth } from "./auth";
import { apiKeyAuth } from "../../middleware/apiKeyAuth";
import { RequestWithTenant } from "../../types/RequestWithTenant";

const router = Router();

// Register a new user for this tenant
router.post("/register", apiKeyAuth(), async (req: RequestWithTenant, res) => {
  const { email, password, name } = req.body;
  const tenantId = req.tenantId!;

  try {
    const response = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        tenantId,
      },
      asResponse: true,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login user for this tenant
router.post("/login", apiKeyAuth(), async (req: RequestWithTenant, res) => {
  const { email, password } = req.body;
  const tenantId = req.tenantId!;

  try {
    // First check if user belongs to this tenant
    // (We'll need to modify this to validate tenant ownership)

    const response = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    const data = await response.json();

    // TODO: Verify the user belongs to the requesting tenant
    // For now, just return the response
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get current session
router.get("/session", apiKeyAuth(), async (req: RequestWithTenant, res) => {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(req.headers as any),
      asResponse: false,
    });

    if (!session?.user) {
      return res.status(401).json({ error: "No active session" });
    }

    // TODO: Verify user belongs to the requesting tenant
    res.json({ session });
  } catch (error) {
    console.error("Session error:", error);
    res.status(401).json({ error: "Invalid session" });
  }
});

// Logout
router.post("/logout", apiKeyAuth(), async (req: RequestWithTenant, res) => {
  try {
    const response = await auth.api.signOut({
      headers: new Headers(req.headers as any),
      asResponse: true,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

export default router;
