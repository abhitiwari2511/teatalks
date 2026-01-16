import { COLLEGE_EMAIL_DOMAIN } from "../config/constants.js";

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;
export const OTP_MAX_ATTEMPTS = 5;

// Validation for college email
export const isCollegeEmail = (email: string): boolean => {
  const domain = email.split("@")[1];
  return domain === COLLEGE_EMAIL_DOMAIN;
};

// otp generate
export const generateOTP = (): string => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < OTP_LENGTH; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// expiry otp
export const getOTPExpiry = (): Date => {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
};
