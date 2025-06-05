import { NextRequest, NextResponse } from "next/server";

// Backend API URL
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("Creating session with data:", body);

    // Forward to backend API
    const response = await fetch(`${BACKEND_URL}/create-sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "WhisperUI/1.0",
        Cookie: request.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend session creation error:", {
        status: response.status,
        statusText: response.statusText,
        data,
      });
      return NextResponse.json(
        { detail: data.detail || "Failed to create chat session" },
        { status: response.status }
      );
    }

    console.log("Session created successfully:", data);

    // Ensure we return the session data with proper ID field
    const sessionData = {
      ...data,
      chat_id: data.chat_id || data.id,
      id: data.id || data.chat_id,
    };

    console.log("Returning session data:", sessionData);
    return NextResponse.json(sessionData);
  } catch (error) {
    console.error("Error creating chat session:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
