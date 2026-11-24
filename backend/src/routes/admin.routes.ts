import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  approveSeller,
  getSellerApplicationsList,
   rejectSeller,
} from "../controllers/admin.controller";

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

// Get Seller Applications
router.get(
  "/seller-applications",
  authenticate,
  authorizeRoles("admin"),
  getSellerApplicationsList
);
// Reject Seller Application
router.patch(
  "/seller-applications/:applicationId/reject",
  authenticate,
  authorizeRoles("admin"),
  rejectSeller
);
export default router;