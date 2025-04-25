import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Authentication - Whisper UI",
  description: "Sign in, sign up, or recover your account for Whisper UI",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
