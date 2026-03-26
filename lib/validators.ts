import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  currency: z.string().trim().toUpperCase().min(3).max(3).default("USD")
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const expenseSchema = z.object({
  amount: z.coerce.number().positive(),
  category: z.string().min(2).max(40),
  note: z.string().max(160).optional().default(""),
  paymentMethod: z.string().min(2).max(30),
  spentAt: z.string().datetime().or(z.string().date())
});
