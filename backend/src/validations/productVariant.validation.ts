
import { z } from "zod";

export const createProductVariantSchema = z.object({
  size: z
    .string()
    .trim()
    .min(1, "Size is required")
    .max(20, "Size cannot exceed 20 characters")
    .transform((value) => value.toUpperCase()),

  color: z
    .string()
    .trim()
    .min(1, "Color is required")
    .max(50, "Color cannot exceed 50 characters"),

  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(50, "SKU cannot exceed 50 characters")
    .transform((value) => value.toUpperCase()),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
});

export const updateProductVariantSchema = z.object({
  size: z
    .string()
    .trim()
    .min(1, "Size is required")
    .max(20, "Size cannot exceed 20 characters")
    .transform((value) => value.toUpperCase())
    .optional(),

  color: z
    .string()
    .trim()
    .min(1, "Color is required")
    .max(50, "Color cannot exceed 50 characters")
    .optional(),

  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(50, "SKU cannot exceed 50 characters")
    .transform((value) => value.toUpperCase())
    .optional(),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .optional(),
});

export type CreateProductVariantInput = z.infer<
  typeof createProductVariantSchema
>;

export type UpdateProductVariantInput = z.infer<
  typeof updateProductVariantSchema
>;
