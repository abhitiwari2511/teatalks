"use client";

import {
  register,
  login,
  verifyOTP,
  logout,
  me,
  resendOTP,
  getUserProfile,
  updateBio,
} from "@/lib/api/auth";
import {
  AuthContextType,
  LoginUser,
  RegisterUser,
  ResendOTP,
  User,
  UserProfileData,
  VerifyOTP,
} from "@/types/types";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tempCredentials, setTempCredentials] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const registerUser = async (data: RegisterUser) => {
    setLoading(true);
    setError(null);

    try {
      const response = await register(data);
      if (!response.data) {
        setError("Registration failed. Please try again.");
        setLoading(false);
        return;
      }
      setTempCredentials({ email: data.email, password: data.password });
    } catch (error: unknown) {
      const errorMessage =
        "Failed to register user: " + (error as Error)?.message ||
        "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (data: LoginUser) => {
    setLoading(true);
    setError(null);
    try {
      const response = await login(data);
      if (!response.data) {
        setError("Login failed. Please try again.");
        setLoading(false);
        return;
      }
      const loginData = response.data as { user: User };
      setUser(loginData.user);
    } catch (error: unknown) {
      const errorMessage = "Invalid Credentials";
      setError(errorMessage);
      console.log("error" + error);
    } finally {
      setLoading(false);
    }
  };

  const verifyUserOTP = async (data: VerifyOTP) => {
    setLoading(true);
    setError(null);
    try {
      const response = await verifyOTP(data);
      if (!response.data) {
        setError("OTP verification failed. Please try again.");
        setLoading(false);
        return;
      }

      if (tempCredentials) {
        await loginUser(tempCredentials);
        setTempCredentials(null);
      }
    } catch (error: unknown) {
      const errorMessage =
        "Failed to verify OTP: " + (error as Error)?.message || "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  const getCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await me();
      if (response.data) {
        const userData = response.data as { data: User };
        setUser(userData.data);
      } else {
        setUser(null);
      }
    } catch (error: unknown) {
      console.log("failed to fetch user" + error);
    } finally {
      setLoading(false);
    }
  };

  const resendUserOTP = async (data: ResendOTP) => {
    setLoading(true);
    setError(null);
    try {
      const response = await resendOTP(data);
      if (!response.data) {
        setError("Resend OTP failed. Please try again.");
      }
    } catch (error: unknown) {
      const errorMessage =
        "Failed to resend OTP: " + (error as Error)?.message || "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const userProfile = async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUserProfile(username);
      return response.data as UserProfileData | undefined;
    } catch (error) {
      const errorMessage =
        "Failed to fetch user profile: " + (error as Error)?.message ||
        "Unknown error";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserBio = async (bio: string) => {
    setLoading(true);

    try {
      const response = await updateBio(bio);
      if (response.data) {
        getCurrentUser();
      }
    } catch (error: unknown) {
      const errorMessage =
        "Failed to update bio: " + (error as Error)?.message || "Unknown error";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    tempCredentials,
    register: registerUser,
    login: loginUser,
    verifyOTP: verifyUserOTP,
    resendOTP: resendUserOTP,
    getCurrentUser,
    logout: logoutUser,
    getUserProfile: userProfile,
    updateBio: updateUserBio,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
