import z from "zod";

export const createWalletValidation = z.object({
  user: z.string().optional(),
  balance: z.string().optional(),
  isBlocked: z.boolean().optional(),
});

export const addMoneySchema = z.object({
  userPhone: z.string("User phone number is required"),
  balance: z.number().positive("Balance Must be a positive number"),
});

export const sendMoneySchema = z.object({
  receiverPhone: z.string("User phone number is required"),
  balance: z.number().positive("Balance Must be a positive number"),
});

export const isBlockedSchema = z.object({
  isBlocked: z.boolean(),
});

export const withdrawSchema = z.object({
  agentPhone: z.string({ message: "Phone is required" }),
  balance: z
    .number("Balance is required")
    .positive("Balance Must be a positive number"),
});
