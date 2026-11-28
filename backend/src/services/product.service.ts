
import mongoose from "mongoose";
import Product from "../models/Product";
import ProductVariant from "../models/ProductVariant";
import Store from "../models/Store";
import Category from "../models/Category";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../validations/product.validation";

// Check Whether Product Can Be Published
const validateProductForPublishing = async (
  productId: mongoose.Types.ObjectId,
  categoryId: mongoose.Types.ObjectId
) => {
  const variantCount = await ProductVariant.countDocuments({
    product: productId,
  });

  if (variantCount === 0) {
    throw new Error("Add at least one product variant before publishing");
  }

  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
  });

  if (!category) {
    throw new Error("Product category is inactive");
  }
};

// Create Product
export const createProduct = async (
  userId: string,
  data: CreateProductInput
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const store = await Store.findOne({
    owner: userId,
  });

  if (!store) {
    throw new Error("Store not found");
  }

  if (store.status !== "active") {
    throw new Error("Your store is suspended");
  }

  const category = await Category.findOne({
    _id: data.category,
    isActive: true,
  });

  if (!category) {
    throw new Error("Category not found or inactive");
  }

  // Every new product starts as draft.
  // Seller must add variants before publishing.
  const product = await Product.create({
    store: store._id,
    category: data.category,
    name: data.name,
    description: data.description,
    price: data.price,
    image: data.image,
    status: "draft",
  });

  return product;
};

// Get Seller's Own Products
export const getMyProducts = async (
  userId: string,
  page = 1,
  limit = 10
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const store = await Store.findOne({
    owner: userId,
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find({
      store: store._id,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Product.countDocuments({
      store: store._id,
    }),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Seller's Own Product by ID
export const getProductById = async (
  userId: string,
  productId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const store = await Store.findOne({
    owner: userId,
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const product = await Product.findOne({
    _id: productId,
    store: store._id,
  }).populate("category", "name slug");

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

// Update Seller's Own Product
export const updateProduct = async (
  userId: string,
  productId: string,
  data: UpdateProductInput
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const store = await Store.findOne({
    owner: userId,
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const product = await Product.findOne({
    _id: productId,
    store: store._id,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  let categoryId = product.category;

  if (data.category !== undefined) {
    const category = await Category.findOne({
      _id: data.category,
      isActive: true,
    });

    if (!category) {
      throw new Error("Category not found or inactive");
    }

    categoryId = new mongoose.Types.ObjectId(data.category);
  }

  if (data.status === "published") {
    if (store.status !== "active") {
      throw new Error("Your store is suspended");
    }

    await validateProductForPublishing(
      product._id,
      categoryId
    );
  }

  if (data.name !== undefined) {
    product.name = data.name;
  }

  if (data.description !== undefined) {
    product.description = data.description;
  }

  if (data.price !== undefined) {
    product.price = data.price;
  }

  if (data.image !== undefined) {
    product.image = data.image;
  }

  if (data.category !== undefined) {
    product.category = categoryId;
  }

  if (data.status !== undefined) {
    product.status = data.status;
  }

  await product.save();

  return product;
};

// Delete Seller's Own Product
export const deleteProduct = async (
  userId: string,
  productId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const store = await Store.findOne({
    owner: userId,
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const product = await Product.findOne({
    _id: productId,
    store: store._id,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  await ProductVariant.deleteMany({
    product: product._id,
  });

  await product.deleteOne();

  return {
    productId: product._id,
    message: "Product deleted successfully",
  };
};

// Publish Product
export const publishProduct = async (
  userId: string,
  productId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const store = await Store.findOne({
    owner: userId,
  });

  if (!store) {
    throw new Error("Store not found");
  }

  if (store.status !== "active") {
    throw new Error("Your store is suspended");
  }

  const product = await Product.findOne({
    _id: productId,
    store: store._id,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  await validateProductForPublishing(
    product._id,
    product.category
  );

  product.status = "published";

  await product.save();

  return product;
};

// Unpublish Product
export const unpublishProduct = async (
  userId: string,
  productId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const store = await Store.findOne({
    owner: userId,
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const product = await Product.findOne({
    _id: productId,
    store: store._id,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  product.status = "draft";

  await product.save();

  return product;
};
