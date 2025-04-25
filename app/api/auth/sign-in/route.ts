import { NextRequest, NextResponse } from "next/server";
import {
  SignInRequest,
  SignInResponse,
  SignInUpResponseError,
} from "@/types/authentication";

// Auth API URL - replace with your actual API endpoint
const AUTH_API_URL = process.env.AUTH_API_URL || "https://api.example.com/auth";

export async function POST(
  request: NextRequest
): Promise<NextResponse<SignInResponse | SignInUpResponseError>> {
  try {
    const body: SignInRequest = await request.json();

    // Validation
    if (!body.username || !body.password) {
      return NextResponse.json(
        { detail: "Username and password are required" },
        { status: 400 }
      );
    }

    // Forward the request to the authentication API
    const response = await fetch(`${AUTH_API_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Authentication failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data as SignInResponse);
  } catch (error) {
    console.error("Error in sign-in API:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
