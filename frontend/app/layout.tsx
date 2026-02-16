import type { Metadata } from "next";
import { Bangers } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/next";

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Tea Talks - Your Campus, Your Chaos, Your Community",
  description:
    "Tea Talks is the uncensored social platform for college students. Share your campus stories, vent about your day, and connect with fellow students in a safe and anonymous space. Join the conversation and let your voice be heard!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bangers.variable} antialiased`}>
        <Analytics />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
