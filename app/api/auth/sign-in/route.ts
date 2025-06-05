import { NextRequest, NextResponse } from "next/server";
import {
  SignInRequest,
  SignInResponse,
  SignInUpResponseError,
} from "@/types/authentication";
import { SignInSchema, formatValidationErrors } from "@/lib/validations";
import { z } from "zod";

// Auth API URL - replace with your actual API endpoint
const AUTH_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:8000/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<SignInResponse | SignInUpResponseError>> {
  try {
    const body: SignInRequest = await request.json();

    // Enhanced validation with Zod
    try {
      const validatedData = SignInSchema.parse(body);

      // Forward the request to the authentication API
      const response = await fetch(`${AUTH_API_URL}/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "WhisperUI/1.0",
        },
        body: JSON.stringify(validatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { detail: data.detail || "Authentication failed" },
          { status: response.status }
        );
      }

      // Based on API documentation, backend sets session cookie automatically
      // We need to forward the session cookie from the backend response
      // Include user data and token in the response for localStorage storage
      const responseWithCookie = NextResponse.json({
        ...data,
        user: data.user || {
          id: data.id,
          username: data.username,
          email: data.email,
        },
        token: data.token || data.access_token,
      } as SignInResponse);

      // Forward the session cookie from backend
      const backendCookies = response.headers.get("set-cookie");
      if (backendCookies) {
        responseWithCookie.headers.set("set-cookie", backendCookies);
      }

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
    console.error("Error in sign-in API:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
