import type { Types } from "mongoose";

export interface userModelType {
  _id: Types.ObjectId;
  fullName: string;
  userName: string;
  email: string;
  password: string;
  refreshToken: string;
}

export interface userMethods {
  isPasswordMatched: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

export interface PendingUserData {
  fullName: string;
  userName: string;
  password: string; 
}

export interface otpSchemaModel {
  email?: string;
  otp: string;
  expiresAt: Date;
  attempts: number;
  pendingUser?: PendingUserData; 
  verifyOTP: (enteredOTP: string) => Promise<boolean>;
}
