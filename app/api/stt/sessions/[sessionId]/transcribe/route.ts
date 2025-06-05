import { NextRequest, NextResponse } from "next/server";
import { AudioFileSchema } from "@/lib/validations";
import { z } from "zod";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Schema for transcription options - simplified to match backend expectations
const TranscriptionSchema = z.object({
  language: z.string().optional().default("kk"),
  enable_diarization: z.boolean().optional().default(false),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const formData = await request.formData();
    const { sessionId } = await params;

    console.log(`[API] Transcribe endpoint called for session: ${sessionId}`);

    // Validate sessionId is not undefined
    if (!sessionId || sessionId === "undefined") {
      console.error("Invalid session ID received:", sessionId);
      return NextResponse.json(
        { detail: "Invalid session ID provided" },
        { status: 400 }
      );
    }

    // Extract form data
    const audioFile = formData.get("audio") as File;
    const language = (formData.get("language") as string) || "kk";
    const enableDiarization = formData.get("enable_diarization") === "true";

    console.log("Request data:", {
      sessionId,
      audioFileName: audioFile?.name,
      language,
      enableDiarization,
    });

    // Validate that session exists first
    console.log(`Checking if session ${sessionId} exists...`);
    const sessionCheckResponse = await fetch(
      `${BACKEND_URL}/sessions/${sessionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "WhisperUI/1.0",
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!sessionCheckResponse.ok) {
      console.error(`Session check failed: ${sessionCheckResponse.status}`);
      const sessionError = await sessionCheckResponse.json().catch(() => ({}));
      return NextResponse.json(
        {
          detail: `Session ${sessionId} not found. Please create the session first. Error: ${
            sessionError.detail || "Unknown"
          }`,
        },
        { status: 404 }
      );
    }

    console.log(
      `Session ${sessionId} exists, proceeding with transcription...`
    );

    // Validate audio file
    if (!audioFile) {
      return NextResponse.json(
        { detail: "Audio file is required" },
        { status: 400 }
      );
    }

    try {
      AudioFileSchema.parse(audioFile);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          {
            detail: `Invalid audio file: ${validationError.errors
              .map((e) => e.message)
              .join(", ")}`,
          },
          { status: 400 }
        );
      }
      throw validationError;
    }

    // Validate options
    const options = TranscriptionSchema.parse({
      language: language,
      enable_diarization: enableDiarization,
    });

    // Prepare form data for backend
    const backendFormData = new FormData();
    backendFormData.append("file", audioFile);
    backendFormData.append("language", options.language);
    backendFormData.append("task", "transcribe");
    backendFormData.append(
      "enable_diarization",
      options.enable_diarization.toString()
    );

    console.log("Sending to backend:", {
      file: audioFile.name,
      language: options.language,
      task: "transcribe",
      enable_diarization: options.enable_diarization.toString(),
      sessionId,
    });

    // Call backend transcription endpoint
    const response = await fetch(
      `${BACKEND_URL}/sessions/${sessionId}/transcribe`,
      {
        method: "POST",
        body: backendFormData,
        headers: {
          "User-Agent": "WhisperUI/1.0",
          Cookie: request.headers.get("cookie") || "",
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend transcription error:", data);
      return NextResponse.json(
        { detail: data.detail || "Failed to transcribe audio" },
        { status: response.status }
      );
    }

    console.log("Transcription successful!");
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error processing transcription:", error);

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
