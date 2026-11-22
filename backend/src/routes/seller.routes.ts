
import { Router } from "express";
import {
  applyAsSeller,
  getMyApplications,
} from "../controllers/seller.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/apply", authenticate, applyAsSeller);

router.get("/my-applications", authenticate, getMyApplications);

export default router;
