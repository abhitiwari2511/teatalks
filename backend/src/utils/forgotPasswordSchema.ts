import { z } from "zod";
import { emailSchema, passwordSchema } from "./zodSchema.js";

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
    email: emailSchema,
    otp: z.string().length(6, "OTP must be 6 characters long"),
    newPassword: passwordSchema
});