import { User } from "../models/user.js";
import { OTP } from "../models/otp.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  generateOTP,
  getOTPExpiry,
  OTP_MAX_ATTEMPTS,
} from "../utils/otpHandler.js";
import { sendOTPEmail } from "../utils/email.js";
import { Post } from "../models/posts.js";
import { Comment } from "../models/comments.js";

const generateTokens = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Something went wrong while creating user");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password, fullName } = req.body;

  const existedUser = await User.findOne({
    $or: [{ userName: userName.toLowerCase() }, { email: email.toLowerCase() }],
  });

  if (existedUser) {
    return res.status(409).json({
      success: false,
      message:
        existedUser.email === email.toLowerCase()
          ? "Email already registered"
          : "Username already taken",
    });
  }

  const existingOTP = await OTP.findOne({
    $or: [
      { email: email.toLowerCase() },
      { "pendingUser.userName": userName.toLowerCase() },
    ],
  });

  if (existingOTP) {
    if (
      existingOTP.pendingUser?.userName === userName.toLowerCase() &&
      existingOTP.email !== email.toLowerCase()
    ) {
      return res.status(409).json({
        success: false,
        message: "Username already taken by a pending registration",
      });
    }

    await OTP.deleteOne({ email: email.toLowerCase() });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();

  await OTP.create({
    email: email.toLowerCase(),
    otp,
    expiresAt: getOTPExpiry(),
    pendingUser: {
      fullName,
      userName: userName.toLowerCase(),
      password: hashedPassword,
    },
  });

  const emailResult = await sendOTPEmail(email, otp);

  if (!emailResult.success) {
    await OTP.deleteOne({ email: email.toLowerCase() });
    return res.status(500).json({
      success: false,
      message: "Failed to send verification email. Please try again.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "OTP sent to your email. Please verify to complete registration.",
    email: email.toLowerCase(),
  });
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const otpRecord = await OTP.findOne({ email: email.toLowerCase() });

  if (!otpRecord) {
    return res.status(400).json({
      success: false,
      message: "No pending registration found. Please register first.",
    });
  }

  // otp expiry
  if (otpRecord.expiresAt < new Date()) {
    await OTP.deleteOne({ email: email.toLowerCase() });
    return res.status(400).json({
      success: false,
      message: "OTP expired. Please register again.",
    });
  }

  // otp attempts
  if (otpRecord.attempts >= OTP_MAX_ATTEMPTS) {
    await OTP.deleteOne({ email: email.toLowerCase() });
    return res.status(400).json({
      success: false,
      message: "Too many failed attempts. Please register again.",
    });
  }

  const isValid = await otpRecord.verifyOTP(otp);

  if (!isValid) {
    otpRecord.attempts += 1;
    await otpRecord.save();

    return res.status(400).json({
      success: false,
      message: `Invalid OTP. ${
        OTP_MAX_ATTEMPTS - otpRecord.attempts
      } attempts remaining.`,
    });
  }

  if (!otpRecord.pendingUser) {
    return res.status(400).json({
      success: false,
      message: "Invalid registration data. Please register again.",
    });
  }

  const { fullName, userName, password } = otpRecord.pendingUser;

  await User.collection.insertOne({
    email: email.toLowerCase(),
    fullName,
    userName,
    password,
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await OTP.deleteOne({ email: email.toLowerCase() });

  const createdUser = await User.findOne({ email: email.toLowerCase() }).select(
    "-password -refreshToken",
  );

  return res.status(201).json({
    success: true,
    message: "Email verified successfully! Account created.",
    user: createdUser,
  });
});

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const otpRecord = await OTP.findOne({ email: email.toLowerCase() });

  if (!otpRecord || !otpRecord.pendingUser) {
    return res.status(400).json({
      success: false,
      message: "No pending registration found. Please register first.",
    });
  }
  const otp = generateOTP();

  // update otp
  otpRecord.otp = otp;
  otpRecord.expiresAt = getOTPExpiry();
  otpRecord.attempts = 0;
  await otpRecord.save();

  const emailResult = await sendOTPEmail(email, otp);

  if (!emailResult.success) {
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again.",
    });
  }

  return res.status(200).json({
    success: true,
    message: "New OTP sent to your email.",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  const user = await User.findOne({
    $or: [
      { userName: userName?.toLowerCase() },
      { email: email?.toLowerCase() },
    ],
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const validPassword = await user.isPasswordMatched(password);
  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const { accessToken, refreshToken } = await generateTokens(
    user._id.toString(),
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      success: true,
      user: loggedInUser,
      accessToken,
      refreshToken,
      message: "Login successful",
    });
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token required",
    });
  }

  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, secret) as {
      _id: string;
    };

    const user = await User.findById(decodedToken._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Check if refresh token matches
    if (incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired or used",
      });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
    };

    const { accessToken, refreshToken } = await generateTokens(
      user._id.toString(),
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json({
        success: true,
        accessToken,
        refreshToken,
        message: "Token refreshed successfully",
      });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }

  const user = await User.findOne({ userName: username }).select(
    "-password -refreshToken",
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const post = await Post.find({ authorId: user._id })
    .sort({ createdAt: -1 })
    .populate("authorId", "userName fullName");

  const commentCount = await Comment.countDocuments({ authorId: user._id });

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyPostsCount = await Post.countDocuments({
    authorId: user._id,
    createdAt: { $gte: oneWeekAgo },
  });

  const weeklyCommentsCount = await Comment.countDocuments({
    authorId: user._id,
    createdAt: { $gte: oneWeekAgo },
  });

  return res.status(200).json({
    success: true,
    user: user,
    posts: post,
    postCount: post.length,
    commentCount: commentCount,
    weeklyActivity: {
      postsCreated: weeklyPostsCount,
      commentsMade: weeklyCommentsCount,
    },
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
    message: "User fetched successfully",
  });
});

const updateBio = asyncHandler(async (req, res) => {
  const { bio } = req.body;

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { bio },
    { new: true, runValidators: true },
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    user,
    message: "Bio updated successfully",
  });
});

const getPlatformStats = asyncHandler(async (req, res) => {
  try {
    const [userCount, postCount, commentCount] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments(),
    ]);

    // Calculate posts from last 24 hours for "daily posts"
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const dailyPostCount = await Post.countDocuments({
      createdAt: { $gte: oneDayAgo },
    });

    return res.status(200).json({
      success: true,
      data: {
        userCount,
        postCount,
        commentCount,
        dailyPostCount,
      },
      message: "Platform stats fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch platform stats",
    });
  }
});

export {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  getUserProfile,
  updateBio,
  getPlatformStats,
};
