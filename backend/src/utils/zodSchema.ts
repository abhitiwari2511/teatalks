import { z } from "zod";
import { COLLEGE_EMAIL_DOMAIN } from "../config/constants.js";

const emailSchema = z
  .string()
  .email("Invalid email format")

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(100, "Password too long");

const userNameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

const fullNameSchema = z
  .string()
  .min(1, "Full name is required")
  .max(100, "Full name too long");

const otpSchema = z
  .string()
  .length(6, "OTP must be 6 digits")
  .regex(/^\d+$/, "OTP must contain only numbers");


export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userName: userNameSchema,
  fullName: fullNameSchema,
});

export const verifyOTPSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const resendOTPSchema = z.object({
  email: emailSchema,
});

export const loginSchema = z
  .object({
    email: emailSchema.optional(),
    userName: userNameSchema.optional(),
    password: passwordSchema,
  })
  .refine((data) => data.email || data.userName, {
    message: "Either email or username is required",
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type ResendOTPInput = z.infer<typeof resendOTPSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
