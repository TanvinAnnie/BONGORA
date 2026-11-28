
import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(150, "Product name cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(1, "Product description is required")
    .max(3000, "Product description cannot exceed 3000 characters"),

  price: z
    .number()
    .min(0, "Price cannot be negative"),

  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),

  image: z
    .string()
    .trim()
    .url("Invalid product image URL"),

  status: z
    .enum(["draft", "published"])
    .optional(),
});

export const updateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Product name must be at least 2 characters")
    .max(150, "Product name cannot exceed 150 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .min(1, "Product description is required")
    .max(3000, "Product description cannot exceed 3000 characters")
    .optional(),

  price: z
    .number()
    .min(0, "Price cannot be negative")
    .optional(),

  category: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID")
    .optional(),

  image: z
    .string()
    .trim()
    .url("Invalid product image URL")
    .optional(),

  status: z
    .enum(["draft", "published"])
    .optional(),
});

export type CreateProductInput = z.infer<
  typeof createProductSchema
>;

export type UpdateProductInput = z.infer<
  typeof updateProductSchema
>;
