
import { Router } from "express";
import {
  applyAsSeller,
  getMyApplications,
} from "../controllers/seller.controller";
import {
  getStoreProfile,
  updateStoreProfile,
} from "../controllers/store.controller";
import {
  createProductController,
  getMyProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  publishProductController,
  unpublishProductController,
} from "../controllers/product.controller";
import {
  createProductVariantController,
  getProductVariantsController,
  updateProductVariantController,
  deleteProductVariantController,
} from "../controllers/productVariant.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/role.middleware";
import { validate } from "../middlewares/validation.middleware";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation";
import {
  createProductVariantSchema,
  updateProductVariantSchema,
} from "../validations/productVariant.validation";

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

// Seller Product Management
router.post(
  "/products",
  authenticate,
  authorizeRoles("seller"),
  validate(createProductSchema),
  createProductController
);

router.get(
  "/products",
  authenticate,
  authorizeRoles("seller"),
  getMyProductsController
);

router.get(
  "/products/:productId",
  authenticate,
  authorizeRoles("seller"),
  getProductByIdController
);

router.patch(
  "/products/:productId",
  authenticate,
  authorizeRoles("seller"),
  validate(updateProductSchema),
  updateProductController
);

router.delete(
  "/products/:productId",
  authenticate,
  authorizeRoles("seller"),
  deleteProductController
);

router.patch(
  "/products/:productId/publish",
  authenticate,
  authorizeRoles("seller"),
  publishProductController
);

router.patch(
  "/products/:productId/unpublish",
  authenticate,
  authorizeRoles("seller"),
  unpublishProductController
);

// Seller Product Variant Management
router.post(
  "/products/:productId/variants",
  authenticate,
  authorizeRoles("seller"),
  validate(createProductVariantSchema),
  createProductVariantController
);

router.get(
  "/products/:productId/variants",
  authenticate,
  authorizeRoles("seller"),
  getProductVariantsController
);

router.patch(
  "/product-variants/:variantId",
  authenticate,
  authorizeRoles("seller"),
  validate(updateProductVariantSchema),
  updateProductVariantController
);

router.delete(
  "/product-variants/:variantId",
  authenticate,
  authorizeRoles("seller"),
  deleteProductVariantController
);

export default router;
