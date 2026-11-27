
import { Router } from "express";
import {
  getActiveCategoriesController,
} from "../controllers/category.controller";

const router = Router();

// Get Active Categories for Public
router.get("/", getActiveCategoriesController);

export default router;
