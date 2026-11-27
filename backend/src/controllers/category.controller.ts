
import { Request, Response } from "express";
import {
  createCategory,
  getAllCategories,
  getActiveCategories,
  updateCategory,
  deleteCategory,
} from "../services/category.service";

// Create Category
export const createCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, description, image } = req.body;

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      name.trim().length > 60
    ) {
      res.status(400).json({
        success: false,
        message: "Category name must be between 2 and 60 characters",
      });
      return;
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || description.length > 500)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid category description",
      });
      return;
    }

    if (
      image !== undefined &&
      (typeof image !== "string" || image.trim().length === 0)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid category image",
      });
      return;
    }

    const category = await createCategory({
      name: name.trim(),
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create category";

    res.status(message === "Category already exists" ? 409 : 500).json({
      success: false,
      message,
    });
  }
};

// Get All Categories for Admin
export const getAllCategoriesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const activeQuery = req.query.isActive;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    let isActive: boolean | undefined;

    if (activeQuery !== undefined) {
      if (activeQuery === "true") {
        isActive = true;
      } else if (activeQuery === "false") {
        isActive = false;
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid isActive value",
        });
        return;
      }
    }

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

    const result = await getAllCategories(isActive, page, limit);

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: result,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// Get Active Categories for Public
export const getActiveCategoriesController = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await getActiveCategories();

    res.status(200).json({
      success: true,
      message: "Active categories fetched successfully",
      data: categories,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active categories",
    });
  }
};

// Update Category
export const updateCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId;

    if (typeof categoryId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const { name, description, image, isActive } = req.body;

    if (
      name !== undefined &&
      (typeof name !== "string" ||
        name.trim().length < 2 ||
        name.trim().length > 60)
    ) {
      res.status(400).json({
        success: false,
        message: "Category name must be between 2 and 60 characters",
      });
      return;
    }

    if (
      description !== undefined &&
      (typeof description !== "string" || description.length > 500)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid category description",
      });
      return;
    }

    if (
      image !== undefined &&
      (typeof image !== "string" || image.trim().length === 0)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid category image",
      });
      return;
    }

    if (
      isActive !== undefined &&
      typeof isActive !== "boolean"
    ) {
      res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
      return;
    }

    const category = await updateCategory(categoryId, {
      name: name?.trim(),
      description,
      image,
      isActive,
    });

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update category";

    const statusCode =
      message === "Invalid category ID"
        ? 400
        : message === "Category not found"
        ? 404
        : message === "Category already exists"
        ? 409
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};

// Delete Category
export const deleteCategoryController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categoryId = req.params.categoryId;

    if (typeof categoryId !== "string") {
      res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
      return;
    }

    const result = await deleteCategory(categoryId);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete category";

    const statusCode =
      message === "Invalid category ID"
        ? 400
        : message === "Category not found"
        ? 404
        : 500;

    res.status(statusCode).json({
      success: false,
      message,
    });
  }
};
