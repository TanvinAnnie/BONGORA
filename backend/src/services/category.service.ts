
import mongoose from "mongoose";
import Category from "../models/Category";
import Product from "../models/Product";

// Generate Category Slug
const generateCategorySlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

// Create Category
export const createCategory = async (data: {
  name: string;
  description?: string;
  image?: string;
}) => {
  const slug = generateCategorySlug(data.name);

  const existingCategory = await Category.findOne({
    slug,
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name: data.name,
    slug,
    description: data.description,
    image: data.image,
  });

  return category;
};

// Get All Categories for Admin
export const getAllCategories = async (
  isActive?: boolean,
  page: number = 1,
  limit: number = 10
) => {
  const filter: {
    isActive?: boolean;
  } = {};

  if (isActive !== undefined) {
    filter.isActive = isActive;
  }

  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Category.countDocuments(filter),
  ]);

  return {
    categories,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Active Categories for Public
export const getActiveCategories = async () => {
  return Category.find({
    isActive: true,
  })
    .sort({ name: 1 })
    .lean();
};

// Update Category
export const updateCategory = async (
  categoryId: string,
  data: {
    name?: string;
    description?: string;
    image?: string;
    isActive?: boolean;
  }
) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error("Invalid category ID");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  if (data.name !== undefined) {
    const newSlug = generateCategorySlug(data.name);

    const existingCategory = await Category.findOne({
      slug: newSlug,
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      throw new Error("Category already exists");
    }

    category.name = data.name;
    category.slug = newSlug;
  }

  if (data.description !== undefined) {
    category.description = data.description;
  }

  if (data.image !== undefined) {
    category.image = data.image;
  }

  if (data.isActive !== undefined) {
    category.isActive = data.isActive;
  }

  await category.save();

  return category;
};

// Delete Category
export const deleteCategory = async (categoryId: string) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new Error("Invalid category ID");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  // Prevent deletion if products are using this category
  const productExists = await Product.exists({
    category: category._id,
  });

  if (productExists) {
    throw new Error("Category is being used by products");
  }

  await Category.deleteOne({
    _id: categoryId,
  });

  return {
    id: category._id,
    name: category.name,
    deleted: true,
  };
};
