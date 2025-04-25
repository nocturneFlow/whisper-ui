import { NextRequest, NextResponse } from "next/server";
import {
  SignUpRequest,
  SignUpReponse,
  SignInUpResponseError,
} from "@/types/authentication";

// Auth API URL - replace with your actual API endpoint
const AUTH_API_URL = process.env.AUTH_API_URL || "https://api.example.com/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<SignUpReponse | SignInUpResponseError>> {
  try {
    const body: SignUpRequest = await request.json();

    // Validation
    if (!body.username || !body.email || !body.password) {
      return NextResponse.json(
        { detail: "Username, email and password are required" },
        { status: 400 }
      );
    }

    // Forward the request to the authentication API
    const response = await fetch(`${AUTH_API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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

    return NextResponse.json(data as SignUpReponse);
  } catch (error) {
    console.error("Error in sign-up API:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
