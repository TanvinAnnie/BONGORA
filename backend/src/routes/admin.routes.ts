import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import {
  approveSeller,
  getSellerApplicationsList,
   rejectSeller,
    getAllStoresList,
     suspendStoreController,
  reactivateStoreController,
} from "../controllers/admin.controller";

import {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/category.controller";

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

// Get All Stores
router.get(
  "/stores",
  authenticate,
  authorizeRoles("admin"),
  getAllStoresList
);

// Suspend Store
router.patch(
  "/stores/:storeId/suspend",
  authenticate,
  authorizeRoles("admin"),
  suspendStoreController
);

// Reactivate Store
router.patch(
  "/stores/:storeId/reactivate",
  authenticate,
  authorizeRoles("admin"),
  reactivateStoreController
);
// Category Management

// Create Category
router.post(
  "/categories",
  authenticate,
  authorizeRoles("admin"),
  createCategoryController
);

// Get All Categories
router.get(
  "/categories",
  authenticate,
  authorizeRoles("admin"),
  getAllCategoriesController
);

// Update Category
router.patch(
  "/categories/:categoryId",
  authenticate,
  authorizeRoles("admin"),
  updateCategoryController
);

// Delete Category
router.delete(
  "/categories/:categoryId",
  authenticate,
  authorizeRoles("admin"),
  deleteCategoryController
);

export default router;