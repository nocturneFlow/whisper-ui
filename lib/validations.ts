import { z } from "zod";

// Audio file validation
export const AudioFileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= 100 * 1024 * 1024,
    "File size must be less than 100MB"
  )
  .refine(
    (file) =>
      [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/flac",
        "audio/m4a",
        "audio/aac",
        "audio/ogg",
        "audio/webm",
      ].includes(file.type),
    "File must be a valid audio format (MP3, WAV, FLAC, M4A, AAC, OGG, WebM)"
  );

// Language validation
export const LanguageSchema = z
  .enum(["kk", "ru", "en"], {
    errorMap: () => ({
      message: "Language must be Kazakh (kk), Russian (ru), or English (en)",
    }),
  })
  .nullable()
  .optional(); // Make language optional and allow null values

// Task validation
export const TaskSchema = z.enum(["transcribe", "translate"], {
  errorMap: () => ({ message: "Task must be either transcribe or translate" }),
});

// Authentication schemas
export const SignInSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, hyphens, and underscores"
    ),
  email: z.string().email("Invalid email format").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

export const SignUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, hyphens, and underscores"
      ),
    email: z
      .string()
      .email("Invalid email format")
      .max(100, "Email must be less than 100 characters"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must be less than 100 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Transcription schemas
export const TranscriptionSettingsSchema = z.object({
  enableDiarization: z.boolean().default(true),
  enableEmotionDetection: z.boolean().default(true),
  enableTextPolishing: z.boolean().default(true),
  autoSave: z.boolean().default(true),
  maxFileSize: z
    .number()
    .positive()
    .default(100 * 1024 * 1024), // 100MB
  quality: z.enum(["standard", "medium", "high"]).default("medium"),
});

export const TranscriptionRequestSchema = z.object({
  file: AudioFileSchema,
  language: LanguageSchema, // Now optional from the updated LanguageSchema
  task: TaskSchema,
  enable_diarization: z.boolean().default(true),
  settings: TranscriptionSettingsSchema.optional(),
  sessionId: z.string().optional(),
});

// Chat session schemas
export const ChatSessionSettingsSchema = z.object({
  enableDiarization: z.boolean().default(true),
  enableEmotionDetection: z.boolean().default(true),
  enableTextPolishing: z.boolean().default(true),
  autoSave: z.boolean().default(true),
  realTimeTranscription: z.boolean().default(false),
  saveAudioFiles: z.boolean().default(true),
});

export const ChatSessionSchema = z.object({
  name: z
    .string()
    .min(1, "Session name is required")
    .max(100, "Session name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  language: LanguageSchema,
  settings: ChatSessionSettingsSchema.default({}),
});

export const UpdateChatSessionSchema = ChatSessionSchema.partial();

// Message schemas
export const ChatMessageSchema = z.object({
  type: z.enum(["audio", "text", "system"]),
  content: z.string().min(1, "Message content is required"),
  audioUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

// API Response schemas
export const APIErrorSchema = z.object({
  detail: z.string(),
  code: z.string().optional(),
  field: z.string().optional(),
});

export const TranscriptionSegmentSchema = z.object({
  start: z.number().nonnegative(),
  end: z.number().nonnegative(),
  speaker: z.enum(["SPEAKER_00", "SPEAKER_01", "SPEAKER_02", "SPEAKER_03"]),
  text: z.string(),
  emotion: z.enum(["hap", "sad", "angry", "neutral"]),
  polished_text: z.string(),
  confidence: z.number().min(0).max(1).optional(),
});

export const TranscriptionResponseSchema = z.object({
  id: z.number(),
  text: z.string(),
  audio_url: z.string().url(),
  language: z.string(),
  duration: z.number().positive(),
  filename: z.string(),
  segments: z.array(TranscriptionSegmentSchema),
  formatted_text: z.string(),
  speakers: z.array(
    z.enum(["SPEAKER_00", "SPEAKER_01", "SPEAKER_02", "SPEAKER_03"])
  ),
  overall_emotion: z.string(),
  polished_text: z.string(),
  metadata: z
    .object({
      processing_time: z.number().optional(),
      model_version: z.string().optional(),
      confidence_score: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

// Form validation helpers
export const createFormSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  return schema.refine((data) => {
    // Additional cross-field validation can be added here
    return true;
  });
};

// Validation error formatter
export const formatValidationErrors = (error: z.ZodError) => {
  return error.errors.reduce((acc, curr) => {
    const field = curr.path.join(".");
    acc[field] = curr.message;
    return acc;
  }, {} as Record<string, string>);
};

// Type exports
export type SignInFormData = z.infer<typeof SignInSchema>;
export type SignUpFormData = z.infer<typeof SignUpSchema>;
export type TranscriptionRequest = z.infer<typeof TranscriptionRequestSchema>;
export type ChatSessionData = z.infer<typeof ChatSessionSchema>;
export type ChatMessageData = z.infer<typeof ChatMessageSchema>;
export type TranscriptionResponse = z.infer<typeof TranscriptionResponseSchema>;
export type TranscriptionSegment = z.infer<typeof TranscriptionSegmentSchema>;
export type APIError = z.infer<typeof APIErrorSchema>;
