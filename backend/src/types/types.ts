import type { Types } from "mongoose";

export interface userModelType {
  _id: Types.ObjectId;
  fullName: string;
  userName: string;
  email: string;
  password: string;
  refreshToken: string;
  bio?: string;
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

export interface postModelType {
  title: string;
  content: string;
  authorId: Types.ObjectId;
  commentCount: number;
  reactionCount: {
    like: number;
    love: number;
    funny: number;
    angry: number;
  };
}

export interface commentType {
  content: string,
  authorId: Types.ObjectId,
  postId: Types.ObjectId,
  reactionCount: {
    like: number,
    love: number
  }
}

export interface reactionType {
  userId: Types.ObjectId;
  targetId: Types.ObjectId;
  targetType: string,
  reactionType: string
}