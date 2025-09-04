import z from "zod";

export const createWalletValidation = z.object({
  user: z.string().optional(),
  balance: z.string().optional(),
  isBlocked: z.boolean().optional(),
});

export const depositSchema = z.object({
  balance: z.number().positive("Balance must have more than 0"),
});
