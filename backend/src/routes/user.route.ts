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
} from "../controllers/users.js";
import { verifyJWT } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  registerSchema,
  loginSchema,
  verifyOTPSchema,
  resendOTPSchema,
} from "../utils/zodSchema.js";

const userRouter = Router();

userRouter.route("/register").post(validate(registerSchema), registerUser);
userRouter.route("/verify-otp").post(validate(verifyOTPSchema), verifyOTP);
userRouter.route("/resend-otp").post(validate(resendOTPSchema), resendOTP);
userRouter.route("/login").post(validate(loginSchema), loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/profile/:username").get(verifyJWT, getUserProfile);

// secured routes
userRouter.route("/logout").post(verifyJWT, logoutUser);
userRouter.route("/me").get(verifyJWT, getCurrentUser);
userRouter.route("/update-bio").patch(verifyJWT, updateBio);

export default userRouter;
