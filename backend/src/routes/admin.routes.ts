import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { approveSeller } from "../controllers/admin.controller";

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

// Approve Seller Application
router.patch(
  "/seller-applications/:applicationId/approve",
  authenticate,
  authorizeRoles("admin"),
  approveSeller
);

export default router;