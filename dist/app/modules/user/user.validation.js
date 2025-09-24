"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must be less than 50 characters")
        .nonempty("Name is required"),
    phone: zod_1.z
        .string()
        .min(1, "Minimum 11 number")
        .length(11, "Must be exactly 11 digits")
        .trim()
        .regex(/^(\+88)?01[3-9]\d{8}$/, {
        message: "Must be a valid Bangladeshi number (01XXXXXXXXX or +8801XXXXXXXXX)",
    }),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .nonempty("Password is required"),
    role: zod_1.z
        .enum([user_interface_1.Role.AGENT, user_interface_1.Role.USER], {
        message: "Role must be one of ADMIN, AGENT, USER",
    })
        .refine((val) => val !== undefined, { message: "Role is required" }),
});
exports.updateStatus = zod_1.z.object({
    status: zod_1.z.enum([user_interface_1.Status.APPROVED, user_interface_1.Status.SUSPENDED]),
});
