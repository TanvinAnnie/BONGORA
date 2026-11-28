
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createProductVariant,
  getProductVariants,
  updateProductVariant,
  deleteProductVariant,
} from "../services/productVariant.service";

// Create Product Variant
export const createProductVariantController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const productId = req.params.productId;

    if (typeof productId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const variant = await createProductVariant(
      userId,
      productId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Product variant created successfully",
      data: variant,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create product variant";

    const statusCode =
      message === "Invalid user ID" ||
      message === "Invalid product ID"
        ? 400
        : message === "Store not found" ||
          message === "Product not found"
        ? 404
        : message === "Your store is suspended"
        ? 403
        : message.includes("duplicate key")
        ? 409
        : 500;

    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 409
          ? "SKU or product size and color combination already exists"
          : message,
    });
  }
};

// Get Product Variants
export const getProductVariantsController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const productId = req.params.productId;

    if (typeof productId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
      return;
    }

    const variants = await getProductVariants(userId, productId);

    res.status(200).json({
      success: true,
      message: "Product variants fetched successfully",
      data: variants,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch product variants";

    const statusCode =
      message === "Invalid user ID" ||
      message === "Invalid product ID"
        ? 400
        : message === "Store not found" ||
          message === "Product not found"
        ? 404
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Update Product Variant
export const updateProductVariantController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const variantId = req.params.variantId;

    if (typeof variantId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid variant ID",
      });
      return;
    }

    const variant = await updateProductVariant(
      userId,
      variantId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Product variant updated successfully",
      data: variant,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update product variant";

    const statusCode =
      message === "Invalid user ID" ||
      message === "Invalid variant ID"
        ? 400
        : message === "Store not found" ||
          message === "Product variant not found"
        ? 404
        : message.includes("duplicate key")
        ? 409
        : 500;

    res.status(statusCode).json({
      success: false,
      message:
        statusCode === 409
          ? "SKU or product size and color combination already exists"
          : message,
    });
  }
};

// Delete Product Variant
export const deleteProductVariantController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const variantId = req.params.variantId;

    if (typeof variantId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid variant ID",
      });
      return;
    }

    const result = await deleteProductVariant(userId, variantId);

    res.status(200).json({
      success: true,
      message: "Product variant deleted successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete product variant";

    const statusCode =
      message === "Invalid user ID" ||
      message === "Invalid variant ID"
        ? 400
        : message === "Store not found" ||
          message === "Product variant not found"
        ? 404
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};
