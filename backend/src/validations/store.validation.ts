
import { z } from "zod";

export const updateStoreSchema = z
  .object({
    storeName: z
      .string()
      .trim()
      .min(2, "Store name must be at least 2 characters")
      .max(100, "Store name cannot exceed 100 characters")
      .optional(),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description cannot exceed 1000 characters")
      .optional(),

    contactPhone: z
      .string()
      .trim()
      .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number")
      .optional(),

    businessAddress: z
      .string()
      .trim()
      .min(5, "Address must be at least 5 characters")
      .max(500, "Address cannot exceed 500 characters")
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "At least one field must be provided",
    }
  );

export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
