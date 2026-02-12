"use client";

import {
  register,
  login,
  verifyOTP,
  logout,
  me,
  resendOTP,
} from "@/lib/api/auth";
import {
  AuthContextType,
  LoginUser,
  RegisterUser,
  ResendOTP,
  User,
  VerifyOTP,
} from "@/types/types";
import { createContext, useEffect, useState } from "react";
import { AxiosError } from "axios";

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
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        "Registration failed";
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
      setUser(response.data.user);
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        "Login failed";
      setError(errorMessage);
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
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        "OTP verification failed";
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
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        "Failed to fetch user data";
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
        (error as AxiosError<{ message: string }>).response?.data?.message ||
        "Resend OTP failed";
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
