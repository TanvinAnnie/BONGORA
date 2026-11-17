
import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  phone: z
    .string()
    .trim()
    .regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
