# Whisper API Documentation for Next.js Implementation

## Project Overview

This is a comprehensive FastAPI-based audio transcription service that provides Kazakh language support with advanced features including speaker diarization, emotion detection, and AI-powered text polishing. The API is designed for real-time audio transcription with chat-based session management.

## Technology Stack

- **Backend Framework**: FastAPI (Python)
- **Database**: SQLAlchemy ORM with PostgreSQL/SQLite support
- **AI Models**:
  - Whisper (custom Kazakh model: `nocturneFlow/whisper-kk-diploma`)
  - Pyannote Speaker Diarization 3.1
  - SpeechBrain Emotion Recognition (wav2vec2-IEMOCAP)
  - OpenAI GPT-4o for text enhancement
- **Storage**: S3-compatible object storage (MinIO/AWS S3)
- **Authentication**: Session-based authentication
- **Additional Features**: FAISS vector search for text polishing with RAG

## API Base Configuration

- **Base URL**: `http://localhost:8000` (development)
- **API Version**: `v1`
- **API Prefix**: `/api/v1`
- **Content-Type**: `application/json` (for JSON endpoints), `multipart/form-data` (for file uploads)
- **Authentication**: Session-based with cookies

## Authentication Endpoints

### 1. User Registration

- **Endpoint**: `POST /sign-up`
- **Purpose**: Register a new user account
- **Request Body**:
  ```typescript
  interface UserRegistration {
    username: string;
    email: string;
    password: string;
  }
  ```
- **Response**:
  ```typescript
  interface UserResponse {
    id: number;
    username: string;
    email: string;
    created_at: string;
  }
  ```
- **Error Cases**:
  - 400: Username or email already exists
  - 422: Validation error

### 2. User Login

- **Endpoint**: `POST /sign-in`
- **Purpose**: Authenticate user and create session
- **Request Body**:
  ```typescript
  interface UserLogin {
    username: string;
    password: string;
  }
  ```
- **Response**:
  ```typescript
  interface UserResponse {
    id: number;
    username: string;
    email: string;
  }
  ```
- **Side Effects**: Sets session cookie (`audio_transcription_session`)
- **Error Cases**:
  - 401: Invalid credentials

### 3. User Logout

- **Endpoint**: `POST /logout`
- **Purpose**: End user session
- **Authentication**: Required
- **Response**:
  ```typescript
  interface LogoutResponse {
    message: string; // "Выход выполнен успешно"
  }
  ```

## Transcription Endpoints

### 1. Audio Transcription (Authenticated)

- **Endpoint**: `POST /api/v1/transcribe`
- **Purpose**: Transcribe audio file with full features (saved to database)
- **Authentication**: Required
- **Content-Type**: `multipart/form-data`
- **Request Parameters**:
  ```typescript
  interface TranscriptionRequest {
    file: File; // Audio file (.mp3, .wav, .m4a, .ogg, .flac)
    language?: string; // Default: "kk" (Kazakh)
    task?: string; // "transcribe" | "translate", Default: "transcribe"
    enable_diarization?: boolean; // Default: true
  }
  ```
- **Response**:

  ```typescript
  interface TranscriptionResponse {
    id: number;
    text: string; // Raw transcription
    audio_url: string; // S3 URL of uploaded file
    language: string;
    duration: number;
    filename: string;
    segments: SegmentOut[]; // Speaker-separated segments (if diarization enabled)
    formatted_text: string; // Speaker-formatted text
    speakers: string[]; // List of detected speakers
    overall_emotion: string; // Detected emotion (if no diarization)
    polished_text: string; // AI-enhanced transcription
  }

  interface SegmentOut {
    start: number; // Start time in seconds
    end: number; // End time in seconds
    speaker: string; // Speaker identifier
    text: string; // Transcribed text for this segment
    emotion: string; // Detected emotion
    polished_text: string; // AI-enhanced text
  }
  ```

### 2. Audio Transcription Demo (No Authentication)

- **Endpoint**: `POST /api/v1/transcribe-demo`
- **Purpose**: Demo transcription without saving to database
- **Authentication**: Not required
- **Request/Response**: Same as authenticated transcription endpoint
- **Note**: Returns `id: 0` and doesn't save to database

## Chat Session Management Endpoints

### 1. Create Chat Session

- **Endpoint**: `POST /api/v1/chat/create-sessions`
- **Purpose**: Create a new chat session for organizing transcriptions
- **Authentication**: Required
- **Request Body**:
  ```typescript
  interface CreateChatRequest {
    title?: string; // Default: "Новый чат"
  }
  ```
- **Response**:
  ```typescript
  interface ChatSessionResponse {
    id: number;
    title: string;
    created_at: string; // ISO datetime
    updated_at: string; // ISO datetime
  }
  ```

### 2. Get Chat Sessions

- **Endpoint**: `GET /api/v1/chat/get-sessions`
- **Purpose**: Retrieve user's chat sessions
- **Authentication**: Required
- **Query Parameters**:
  ```typescript
  interface GetSessionsQuery {
    skip?: number; // Default: 0
    limit?: number; // Default: 100
  }
  ```
- **Response**:
  ```typescript
  interface ChatSessionResponse[] // Array of chat sessions
  ```

### 3. Get Chat Session History

- **Endpoint**: `GET /api/v1/chat/sessions/{session_id}`
- **Purpose**: Get full chat history for a specific session
- **Authentication**: Required
- **Path Parameters**: `session_id: number`
- **Response**:

  ```typescript
  interface ChatHistoryResponse {
    chat_id: number;
    title: string;
    messages: ChatMessageResponse[];
  }

  interface ChatMessageResponse {
    id: number;
    message: string; // Transcription text
    is_system: number; // 0 = user message, 1 = system message
    created_at: string; // ISO datetime
    audio_url?: string; // S3 URL if audio file attached
  }
  ```

### 4. Transcribe Audio in Chat Session

- **Endpoint**: `POST /api/v1/chat/sessions/{session_id}/transcribe`
- **Purpose**: Upload and transcribe audio within a specific chat session
- **Authentication**: Required
- **Path Parameters**: `session_id: number`
- **Content-Type**: `multipart/form-data`
- **Request**: Same as regular transcription endpoint
- **Response**: Same as `TranscriptionResponse`
- **Side Effects**:
  - Creates transcription record
  - Adds message to chat session
  - Updates session's `updated_at` timestamp

## Data Models

### User Model

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  hashed_password: string; // Not exposed in API
  created_at: string;
}
```

### Audio Transcription Model

```typescript
interface AudioTranscription {
  id: number;
  original_filename: string;
  s3_filename: string; // UUID-based filename in S3
  s3_url: string;
  file_size: number; // Bytes
  duration?: number; // Seconds
  language: string;
  transcription: string; // Raw text
  diarization_data?: SegmentOut[]; // JSON array of segments
  created_at: string;
  formatted_transcription?: string; // Speaker-formatted text
  speakers?: string[]; // JSON array of speaker IDs
  overall_emotion?: string;
  polished_text?: string; // AI-enhanced text
}
```

### Chat Session Model

```typescript
interface ChatSession {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatTranscription {
  id: number;
  chat_session_id: number;
  audio_transcription_id?: number;
  message: string;
  is_system: number; // 0 or 1
  created_at: string;
}
```

## Core Features Implementation Details

### 1. Speaker Diarization

- **Model**: Pyannote Speaker Diarization 3.1
- **Features**:
  - Automatic speaker detection
  - Speaker labeling (SPEAKER_00, SPEAKER_01, etc.)
  - Minimum segment length: 0.5 seconds
  - Segment merging gap: 0.2 seconds
- **Output**: Timestamped segments with speaker identification

### 2. Emotion Detection

- **Model**: SpeechBrain wav2vec2-IEMOCAP
- **Supported Emotions**: Based on IEMOCAP dataset (neutral, happy, sad, angry, etc.)
- **Application**: Applied per segment (with diarization) or overall audio (without diarization)

### 3. AI Text Polishing

- **Model**: OpenAI GPT-4o
- **Methods**:
  - **Simple Polishing**: Direct text improvement
  - **RAG-Enhanced Polishing**: Uses FAISS vector search with Kazakh language corpus
- **Features**: Grammar correction, formatting, style improvement

### 4. File Storage

- **Storage**: S3-compatible (configurable endpoint)
- **File Handling**:
  - Automatic UUID generation for filenames
  - Content-type detection
  - Size tracking
- **Supported Formats**: .mp3, .wav, .m4a, .ogg, .flac

## Environment Variables Required

```bash
# Database
DATABASE_URL=sqlite:///./whisper.db  # or PostgreSQL URL

# S3 Storage
S3_ACCESS_KEY=your_access_key
S3_SECRET_KEY=your_secret_key
S3_ENDPOINT_URL=https://your-s3-endpoint.com
S3_BUCKET_NAME=your-bucket-name

# AI Models
HF_TOKEN=your_huggingface_token
OPENAI_API_KEY=your_openai_api_key
GPT_MODEL=gpt-4o

# Model Paths
WHISPER_MODEL_PATH=nocturneFlow/whisper-kk-diploma
WHISPER_DEVICE=cuda  # or cpu
DEVICE=0  # GPU device ID

# FAISS (for RAG polishing)
FAISS_INDEX_PATH=./data/kk_faiss.index
SENTENCES_PATH=./data/kk_sentences.txt
```

## Error Handling

### Common HTTP Status Codes

- **200**: Success
- **400**: Bad Request (invalid file format, validation errors)
- **401**: Unauthorized (invalid session, authentication required)
- **404**: Not Found (chat session not found)
- **422**: Unprocessable Entity (validation errors)
- **500**: Internal Server Error

### Error Response Format

```typescript
interface ErrorResponse {
  detail: string; // Error description
}
```

## Next.js Implementation Guidelines

### 1. File Upload Handling

- Use `FormData` for multipart uploads
- Handle large files with progress tracking
- Implement proper error boundaries

### 2. Session Management

- Store session cookies securely
- Implement automatic logout on session expiry
- Handle CSRF protection if needed

### 3. Real-time Features

- Consider WebSocket implementation for transcription progress
- Implement optimistic UI updates for chat messages
- Cache chat sessions for better UX

### 4. Audio Player Integration

- Integrate audio player with segment timestamps
- Implement playback controls for segments
- Show speaker information alongside audio

### 5. Performance Considerations

- Implement pagination for chat sessions and messages
- Use loading states for transcription processing
- Consider chunked uploads for large audio files

### Example Next.js API Route Structure

```typescript
// pages/api/transcribe.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const formData = new FormData();
  // ... handle file upload and forward to FastAPI

  const response = await fetch("http://localhost:8000/api/v1/transcribe", {
    method: "POST",
    body: formData,
    headers: {
      Cookie: req.headers.cookie || "",
    },
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
```

## Security Considerations

1. **Authentication**: Session-based authentication with secure cookies
2. **File Validation**: Strict file type and size validation
3. **Rate Limiting**: Implement rate limiting for transcription endpoints
4. **CORS**: Configured for cross-origin requests
5. **Input Sanitization**: Validate all user inputs

## Performance Metrics

- **File Size Limit**: 25MB (configurable)
- **Processing Time**: Varies based on audio length and features enabled
- **Supported Languages**: Primarily Kazakh ("kk"), with translation capability
- **Concurrent Users**: Depends on hardware resources (GPU memory for AI models)

This documentation provides a comprehensive overview for implementing Next.js API routes that interface with the Whisper API backend. The endpoints support both authenticated and demo usage, making it suitable for various application architectures.
