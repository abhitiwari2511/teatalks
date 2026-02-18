import { Resend } from "resend";
import { OTP_EXPIRY_MINUTES } from "./otpHandler.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (
  to: string,
  otp: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "TeaTalks <onboarding@resend.dev>",
      to,
      subject: "🔐 Verify your TeaTalks account",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
            .container { max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; color: #333; }
            .otp-box { background: #f0f7ff; border: 2px dashed #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
            .otp { font-size: 32px; font-weight: bold; color: #3b82f6; letter-spacing: 8px; }
            .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
            .warning { color: #e74c3c; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="header">☕ Welcome to TeaTalks!</h2>
            <p>Hey there! You're one step away from joining your college community.</p>
            <p>Use this OTP to verify your email:</p>
            <div class="otp-box">
              <span class="otp">${otp}</span>
            </div>
            <p class="warning">⏰ This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <div class="footer">
              <p>© TeaTalks - Your College Community</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: "Failed to send email" };
  }
};
