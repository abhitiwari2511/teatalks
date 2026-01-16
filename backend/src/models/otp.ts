import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import type { otpSchemaModel } from "../types/types.js";

const pendingUserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const otpSchema = new Schema<otpSchemaModel>(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    pendingUser: {
      type: pendingUserSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// hashing of otp
otpSchema.pre("save", async function () {
  if (!this.isModified("otp")) return;
  this.otp = await bcrypt.hash(this.otp, 10);
});

otpSchema.methods.verifyOTP = async function (
  enteredOTP: string
): Promise<boolean> {
  return await bcrypt.compare(enteredOTP, this.otp);
};

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = model<otpSchemaModel>("OTP", otpSchema);
