import { NextRequest, NextResponse } from "next/server";
import {
  TranscribeDemoRequest,
  TranscribeDemoResponse,
  TranscribeDemoErrorResponse,
} from "@/types/transcribe";

// Backend API URL - replace with your actual API endpoint
const TRANSCRIPTION_API_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/transcribe-demo`
  : "http://localhost:8000/api/v1/transcribe-demo";

export async function POST(
  request: NextRequest
): Promise<NextResponse<TranscribeDemoResponse | TranscribeDemoErrorResponse>> {
  try {
    const formData = await request.formData();

    // Forward the request to the backend API
    const response = await fetch(TRANSCRIPTION_API_URL, {
      method: "POST",
      body: formData,
      headers: {
        // Forward authorization if present
        ...(request.headers.get("Authorization")
          ? { Authorization: request.headers.get("Authorization")! }
          : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { detail: data.detail || "Transcription failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data as TranscribeDemoResponse);
  } catch (error) {
    console.error("Error in transcription API:", error);
    return NextResponse.json(
      { detail: "Internal server error" },
      { status: 500 }
    );
  }
}
