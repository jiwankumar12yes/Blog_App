import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
  registerHandler,
} from "../auth/auth.controller";
import { validate } from "../middlewares/validate";
import { authenticate } from "./auth.middleware";
import { loginSchema, registerSchema } from "./auth.schema";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), registerHandler);
router.post("/login", validate(loginSchema), loginHandler);
router.post("/logout", authenticate, logoutHandler);
router.post("/refresh-token", refreshTokenHandler);

// Protected routes
// router.post("/refresh-token", authenticateRefresh, refreshToken);
// router.post("/logout", authenticate, logout);
// router.get("/me", authenticate, requireUser, getProfile);

export default router;
