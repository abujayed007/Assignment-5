import { z } from "zod";
import { Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters")
    .nonempty("Name is required"),

  email: z.email("Invalid email address").nonempty("Email is required"),

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
