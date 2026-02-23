import { Router } from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  verifyOTP,
  resendOTP,
  getUserProfile,
  updateBio,
  getPlatformStats,
  forgotPassword,
  resetPassword,
} from "../controllers/users.js";
import { verifyJWT } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  resendOTPSchema,
} from "../utils/zodSchema.js";
import { forgotPasswordSchema, resetPasswordSchema } from "../utils/forgotPasswordSchema.js";

const userRouter = Router();

userRouter.route("/register").post(validate(registerSchema), registerUser);
userRouter.route("/verify-otp").post(validate(verifyOTPSchema), verifyOTP);
userRouter.route("/resend-otp").post(validate(resendOTPSchema), resendOTP);
userRouter.route("/login").post(validate(loginSchema), loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/profile/:username").get(verifyJWT, getUserProfile);
userRouter.route("/platform-stats").get(getPlatformStats);
userRouter.route("/forgot-password").post(validate(forgotPasswordSchema), forgotPassword);
userRouter.route("/reset-password").post(validate(resetPasswordSchema), resetPassword);

// secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/me").get(verifyJWT, getCurrentUser);
userRouter.route("/update-bio").patch(verifyJWT, updateBio);

export default userRouter;
