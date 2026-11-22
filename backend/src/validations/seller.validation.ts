
import { z } from "zod";

export const sellerApplicationSchema = z.object({
  storeName: z
    .string()
    .trim()
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name cannot exceed 100 characters"),

  storeDescription: z
    .string()
    .trim()
    .min(10, "Store description must be at least 10 characters")
    .max(1000, "Store description cannot exceed 1000 characters"),

  contactPhone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),

  businessAddress: z
    .string()
    .trim()
    .min(5, "Business address must be at least 5 characters")
    .max(500, "Business address cannot exceed 500 characters"),
});

export type SellerApplicationInput = z.infer<
  typeof sellerApplicationSchema
>;
