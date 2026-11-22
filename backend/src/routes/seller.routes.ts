
import { Router } from "express";
import {
  applyAsSeller,
  getMyApplications,
} from "../controllers/seller.controller";
import {
  getStoreProfile,
  updateStoreProfile,
} from "../controllers/store.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";

const router = Router();

// Seller Application
router.post("/apply", authenticate, applyAsSeller);
router.get("/my-applications", authenticate, getMyApplications);

// Seller Store Profile
router.get(
  "/store",
  authenticate,
  authorizeRoles("seller"),
  getStoreProfile
);

router.patch(
  "/store",
  authenticate,
  authorizeRoles("seller"),
  updateStoreProfile
);

export default router;
