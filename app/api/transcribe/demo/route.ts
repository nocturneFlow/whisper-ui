import { NextRequest, NextResponse } from "next/server";
import {
  TranscribeDemoResponse,
  TranscribeDemoErrorResponse,
} from "@/types/transcribe";
import { AudioFileSchema, LanguageSchema, TaskSchema } from "@/lib/validations";
import { z } from "zod";

// Backend API URL - replace with your actual API endpoint
const TRANSCRIPTION_API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/transcribe-demo`
  : "http://localhost:8000/api/v1/transcribe-demo";

export async function POST(
  request: NextRequest
): Promise<NextResponse<TranscribeDemoResponse | TranscribeDemoErrorResponse>> {
  try {
    const formData = await request.formData();

    // Extract and validate form data
    const file = formData.get("file") as File;
    const language = formData.get("language") as string | null;
    const task = formData.get("task") as string;
    const enableDiarization = formData.get("enable_diarization") === "true";
    const sessionId = formData.get("session_id") as string | null;

    // Validate inputs
    try {
      AudioFileSchema.parse(file);
      if (language) {
        LanguageSchema.parse(language); // Only validate language if it's provided
      }
      TaskSchema.parse(task);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          {
            detail: `Validation failed: ${validationError.errors
              .map((e) => e.message)
              .join(", ")}`,
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Check file size and type
    if (!file) {
      return NextResponse.json(
        { detail: "Audio file is required" },
        { status: 400 }
      );
    }

    // Create new FormData for backend
    const backendFormData = new FormData();
    backendFormData.append("file", file);
    if (language) {
      backendFormData.append("language", language); // Only append language if it's provided
    }
    backendFormData.append("task", task);
    backendFormData.append("enable_diarization", enableDiarization.toString());

    if (sessionId) {
      backendFormData.append("session_id", sessionId);
    }

    // Add metadata
    backendFormData.append(
      "metadata",
      JSON.stringify({
        original_filename: file.name,
        file_size: file.size,
        content_type: file.type,
        uploaded_at: new Date().toISOString(),
        user_agent: request.headers.get("user-agent") || "unknown",
      })
    );

    // Forward the request to the backend API
    const response = await fetch(TRANSCRIPTION_API_URL, {
      method: "POST",
      body: backendFormData,
      headers: {
        // Forward authorization if present
        ...(request.headers.get("Authorization")
          ? { Authorization: request.headers.get("Authorization")! }
          : {}),
        "User-Agent": "WhisperUI/1.0",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend transcription error:", data);
      return NextResponse.json(
        { detail: data.detail || "Transcription failed" },
        { status: response.status }
      );
    }

    // Validate response structure strictly
    try {
      // Check all required fields and types
      if (
        typeof data.id !== "number" ||
        typeof data.text !== "string" ||
        typeof data.audio_url !== "string" ||
        typeof data.language !== "string" ||
        typeof data.duration !== "number" ||
        typeof data.filename !== "string" ||
        !Array.isArray(data.segments) ||
        typeof data.formatted_text !== "string" ||
        !Array.isArray(data.speakers) ||
        typeof data.overall_emotion !== "string" ||
        typeof data.polished_text !== "string" ||
        // Validate segments array structure
        !data.segments.every(
          (seg: any) =>
            typeof seg.start === "number" &&
            typeof seg.end === "number" &&
            typeof seg.speaker === "string" &&
            typeof seg.text === "string" &&
            typeof seg.emotion === "string" &&
            typeof seg.polished_text === "string"
        )
      ) {
        throw new Error("Invalid response structure from backend");
      }

      // Add processing metadata
      const enrichedResponse = {
        ...data,
        processed_at: new Date().toISOString(),
        processing_metadata: {
          api_version: "1.0",
          processing_time: response.headers.get("x-processing-time"),
          model_version: response.headers.get("x-model-version"),
        },
      };

      return NextResponse.json(enrichedResponse as TranscribeDemoResponse);
    } catch (error) {
      console.error("Response validation error:", error);
      return NextResponse.json(
        { detail: "Invalid response from transcription service" },
        { status: 502 }
      );
    }
  } catch (error) {
    console.error("Error in transcription API:", error);

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        return NextResponse.json(
          { detail: "Unable to connect to transcription service" },
          { status: 503 }
        );
      } else if (error.message.includes("timeout")) {
        return NextResponse.json(
          { detail: "Transcription service timeout" },
          { status: 504 }
        );
      }
    }

    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
