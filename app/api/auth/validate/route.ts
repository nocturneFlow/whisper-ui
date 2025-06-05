import { NextRequest, NextResponse } from "next/server";

const AUTH_API_URL =
  process.env.AUTH_API_URL || "http://localhost:8000/api/v1/auth";

export async function GET(request: NextRequest) {
  try {
    // Get session cookie from request - this is the only auth token we need
    const sessionCookie = request.cookies.get("audio_transcription_session");

    if (!sessionCookie) {
      return NextResponse.json(
        { detail: "No authentication session found" },
        { status: 401 }
      );
    }

    // Forward the session cookie to backend for validation
    const response = await fetch(`${AUTH_API_URL}/validate`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "WhisperUI/1.0",
        Cookie: `audio_transcription_session=${sessionCookie.value}`,
      },
    });

    if (!response.ok) {
      // Clear invalid session cookie
      const res = NextResponse.json(
        { detail: "Invalid or expired session" },
        { status: 401 }
      );

      res.cookies.delete("audio_transcription_session");
      return res;
    }

    const userData = await response.json();

    // Return user data if valid
    return NextResponse.json({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      created_at: userData.created_at,
    });
  } catch (error) {
    console.error("Auth validation error:", error);
    return NextResponse.json(
      { detail: "Authentication validation failed" },
      { status: 500 }
    );
  }
}
