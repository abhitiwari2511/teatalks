import { User } from "../models/user.js";
import asyncHandler from "../utils/asyncHandler.js";

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

  if (!userName || !email || !password || !fullName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  const newUser = await User.create({
    userName: userName.toLowerCase(),
    email,
    password,
    fullName,
  });

  const createdUser = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    return res.status(500).json({ message: "User creation failed" });
  }

  return res.status(201).json(createdUser);
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName && !email) {
    return res.status(400).json({ message: "Username or email is required" });
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const validPassword = await user.isPasswordMatched(password);
  if (!validPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const { accessToken, refreshToken } = await generateTokens(
    user._id.toString()
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      user: loggedInUser,
      accessToken,
      refreshToken,
      message: "Login successful",
    });
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    (req as any).user._id,
    {
      $unset: {
        refreshToken: 1, //ye field se remove kr dega
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      message: "User logged out successfully",
    });
});

export { registerUser, loginUser, logoutUser };
