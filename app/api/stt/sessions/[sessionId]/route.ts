import { NextRequest, NextResponse } from "next/server";
import {
  UpdateChatSessionSchema,
  formatValidationErrors,
} from "@/lib/validations";
import { z } from "zod";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const response = await fetch(`${BACKEND_URL}/sessions/${sessionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "WhisperUI/1.0",
        // Forward cookies for session-based authentication
        Cookie: request.headers.get("cookie") || "",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Session not found" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching chat session:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const body = await request.json();
    const { sessionId } = await params; // Validate update data
    try {
      const validatedData = UpdateChatSessionSchema.parse(body);
      const response = await fetch(`${BACKEND_URL}/sessions/${sessionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "WhisperUI/1.0",
          // Forward cookies for session-based authentication
          Cookie: request.headers.get("cookie") || "",
        },
        body: JSON.stringify({
          ...validatedData,
          updated_at: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { detail: data.detail || "Failed to update session" },
          { status: response.status }
        );
      }

      return NextResponse.json(data);
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
    console.error("Error updating chat session:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    const formData = await request.formData(); // Forward to backend API for transcription in chat session
    const response = await fetch(
      `${BACKEND_URL}/sessions/${sessionId}/transcribe`,
      {
        method: "POST",
        headers: {
          "User-Agent": "WhisperUI/1.0",
          // Forward cookies for session-based authentication
          Cookie: request.headers.get("cookie") || "",
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Failed to transcribe audio in chat session" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error transcribing in chat session:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const response = await fetch(`${BACKEND_URL}/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "WhisperUI/1.0",
        // Forward cookies for session-based authentication
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(
        { detail: data.detail || "Failed to delete session" },
        { status: response.status }
      );
    }

    return NextResponse.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat session:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
