
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  publishProduct,
  unpublishProduct,
} from "../services/product.service";

// Create Product
export const createProductController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const product = await createProduct(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create product";

    const statusCode =
      message === "Invalid user ID"
        ? 400
        : message === "Store not found" ||
          message === "Category not found or inactive"
        ? 404
        : message === "Your store is suspended"
        ? 403
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Get Seller's Own Products
export const getMyProductsController = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid pagination values",
      });
      return;
    }

    const result = await getMyProducts(userId, page, limit);

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch products";

    const statusCode =
      message === "Invalid user ID"
        ? 400
        : message === "Store not found"
        ? 404
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Get Product by ID
export const getProductByIdController = async (
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

    const product = await getProductById(userId, productId);

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch product";

    const statusCode =
      message === "Invalid user ID" || message === "Invalid product ID"
        ? 400
        : message === "Store not found" || message === "Product not found"
        ? 404
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Update Product
export const updateProductController = async (
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

    const product = await updateProduct(
      userId,
      productId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update product";

    const statusCode =
      message === "Invalid user ID" || message === "Invalid product ID"
        ? 400
        : message === "Store not found" ||
          message === "Product not found" ||
          message === "Category not found or inactive"
        ? 404
        : message === "Your store is suspended"
        ? 403
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Delete Product
export const deleteProductController = async (
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

    const result = await deleteProduct(userId, productId);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete product";

    const statusCode =
      message === "Invalid user ID" || message === "Invalid product ID"
        ? 400
        : message === "Store not found" || message === "Product not found"
        ? 404
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Publish Product
export const publishProductController = async (
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

    const product = await publishProduct(userId, productId);

    res.status(200).json({
      success: true,
      message: "Product published successfully",
      data: product,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to publish product";

    const statusCode =
      message === "Invalid user ID" || message === "Invalid product ID"
        ? 400
        : message === "Store not found" ||
          message === "Product not found" ||
          message === "Product category is inactive"
        ? 404
        : message === "Your store is suspended"
        ? 403
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Unpublish Product
export const unpublishProductController = async (
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

    const product = await unpublishProduct(userId, productId);

    res.status(200).json({
      success: true,
      message: "Product moved to draft successfully",
      data: product,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to unpublish product";

    const statusCode =
      message === "Invalid user ID" || message === "Invalid product ID"
        ? 400
        : message === "Store not found" || message === "Product not found"
        ? 404
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};
