import { LoginUser, RegisterUser, ResendOTP, VerifyOTP } from "@/types/types";
import client from "./client";

export const register = ({fullName, userName, email, password}: RegisterUser) => client.post("/users/register", {
    fullName,
    userName,
    email,
    password
});

export const verifyOTP = ({email, otp}: VerifyOTP) => client.post("/users/verify-otp", {
    email,
    otp
});

export const resendOTP = ({email}: ResendOTP) => client.post("/users/resend-otp", {
    email
});

export const login = ({email, password}: LoginUser) => client.post("/users/login", {
    email,
    password
});

export const getUserProfile = (username: string) => client.get(`/users/profile/${username}`);

export const logout = () => client.post("/users/logout");
export const me = () => client.get("/users/me");
export const refreshToken = () => client.post("/users/refresh-token");
