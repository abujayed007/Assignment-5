import { z } from "zod";
import { Role, Status } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters")
    .nonempty("Name is required"),

  phone: z
    .string()
    .min(1, "Minimum 11 number")
    .length(11, "Must be exactly 11 digits")
    .trim()
    .regex(/^(\+88)?01[3-9]\d{8}$/, {
      message:
        "Must be a valid Bangladeshi number (01XXXXXXXXX or +8801XXXXXXXXX)",
    }),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .nonempty("Password is required"),

  role: z
    .enum([Role.ADMIN, Role.AGENT, Role.USER], {
      message: "Role must be one of ADMIN, AGENT, USER",
    })
    .refine((val) => val !== undefined, { message: "Role is required" }),
});

export const updateStatus = z.object({
  status: z.enum(Object.values([Status.APPROVED, Status.SUSPENDED])),
});
