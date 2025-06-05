import { NextRequest, NextResponse } from "next/server";

// Backend API URL
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skip = searchParams.get("skip") || "0";
    const limit = searchParams.get("limit") || "100"; // Forward to backend API - according to API docs: /api/v1/chat/get-sessions
    const response = await fetch(
      `${BACKEND_URL}/get-sessions?skip=${skip}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "User-Agent": "WhisperUI/1.0",
          // Forward all cookies for session-based authentication
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to get chat sessions" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error getting chat sessions:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
