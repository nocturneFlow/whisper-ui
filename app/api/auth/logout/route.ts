import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // First, call the backend logout endpoint if we have a session
    const sessionCookie = request.cookies.get("audio_transcription_session");

    if (sessionCookie) {
      try {
        const AUTH_API_URL =
          process.env.AUTH_API_URL || "http://localhost:8000";
        await fetch(`${AUTH_API_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `audio_transcription_session=${sessionCookie.value}`,
          },
        });
      } catch (error) {
        console.warn("Failed to call backend logout:", error);
      }
    } // Clear the session cookie
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the backend session cookie
    response.cookies.set("audio_transcription_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error("Error in logout API:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
