import { NextRequest, NextResponse } from "next/server";
import {
  SignUpRequest,
  SignUpReponse,
  SignInUpResponseError,
} from "@/types/authentication";
import { SignUpSchema, formatValidationErrors } from "@/lib/validations";
import { z } from "zod";

// Auth API URL - replace with your actual API endpoint
const AUTH_API_URL = process.env.AUTH_API_URL || "https://api.example.com/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<SignUpReponse | SignInUpResponseError>> {
  try {
    const body = await request.json();

    // Enhanced validation with Zod
    try {
      const validatedData = SignUpSchema.parse(body);

      // Prepare request body (exclude confirmPassword)
      const { confirmPassword, ...signUpData } = validatedData;

      // Forward the request to the authentication API
      const response = await fetch(`${AUTH_API_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "WhisperUI/1.0",
        },
        body: JSON.stringify(signUpData),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { detail: data.detail || "Registration failed" },
          { status: response.status }
        );
      }

      // Remove hashed_password if it exists in the response
      if (data.hashed_password) {
        delete data.hashed_password;
      }

      // Set secure session cookie
      const responseWithCookie = NextResponse.json(data as SignUpReponse);
      responseWithCookie.cookies.set("auth-session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return responseWithCookie;
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errors = formatValidationErrors(validationError);
        return NextResponse.json(
          { detail: `Validation failed: ${Object.values(errors).join(", ")}` },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error("Error in sign-up API:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
