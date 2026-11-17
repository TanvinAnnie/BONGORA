import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Admin Dashboard - Protected Route
router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("admin"),
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome to BONGORA Admin Dashboard!",
      data: {
        role: "admin",
        access: "granted",
      },
    });
  }
);

export default router;