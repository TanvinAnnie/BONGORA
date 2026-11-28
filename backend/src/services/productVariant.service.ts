
import mongoose from "mongoose";
import Product from "../models/Product";
import ProductVariant from "../models/ProductVariant";
import Store from "../models/Store";
import {
  CreateProductVariantInput,
  UpdateProductVariantInput,
} from "../validations/productVariant.validation";

// Create Product Variant
export const createProductVariant = async (
  userId: string,
  productId: string,
  data: CreateProductVariantInput
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

  const variant = await ProductVariant.create({
    product: product._id,
    size: data.size,
    color: data.color,
    sku: data.sku,
    stock: data.stock,
  });

  return variant;
};

// Get Product Variants
export const getProductVariants = async (
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

  const variants = await ProductVariant.find({
    product: product._id,
  }).sort({ createdAt: -1 });

  return variants;
};

// Update Product Variant
export const updateProductVariant = async (
  userId: string,
  variantId: string,
  data: UpdateProductVariantInput
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(variantId)) {
    throw new Error("Invalid variant ID");
  }

  const store = await Store.findOne({
    owner: userId,
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const variant = await ProductVariant.findById(variantId);

  if (!variant) {
    throw new Error("Product variant not found");
  }

  const product = await Product.findOne({
    _id: variant.product,
    store: store._id,
  });

  if (!product) {
    throw new Error("Product variant not found");
  }

  if (data.size !== undefined) {
    variant.size = data.size;
  }

  if (data.color !== undefined) {
    variant.color = data.color;
  }

  if (data.sku !== undefined) {
    variant.sku = data.sku;
  }

  if (data.stock !== undefined) {
    variant.stock = data.stock;
  }

  await variant.save();

  return variant;
};

// Delete Product Variant
export const deleteProductVariant = async (
  userId: string,
  variantId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  if (!mongoose.Types.ObjectId.isValid(variantId)) {
    throw new Error("Invalid variant ID");
  }

  const store = await Store.findOne({
    owner: userId,
  });

  if (!store) {
    throw new Error("Store not found");
  }

  const variant = await ProductVariant.findById(variantId);

  if (!variant) {
    throw new Error("Product variant not found");
  }

  const product = await Product.findOne({
    _id: variant.product,
    store: store._id,
  });

  if (!product) {
    throw new Error("Product variant not found");
  }

  await variant.deleteOne();

  return {
    variantId: variant._id,
    message: "Product variant deleted successfully",
  };
};
