/**
 * Core authentication type definitions for the Whisper UI application
 */

export interface AuthFormProps {
  onSubmit: (
    data: SignInCredentials | SignUpData | ResetPasswordData
  ) => Promise<void>;
}

export interface AuthState {
  isLoading: boolean;
  error?: string | null;
}

export interface SignInCredentials {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  name: string;
  username: string;
  email: string;
  password: string;
  agreedToTerms: boolean;
}

export interface ResetPasswordData {
  email: string;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: "Weak" | "Fair" | "Good" | "Strong" | "";
}

/**
 * Calculates password strength based on common rules
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "" };

  let score = 0;
  if (password.length > 6) score += 1;
  if (password.match(/[A-Z]/)) score += 1;
  if (password.match(/[0-9]/)) score += 1;
  if (password.match(/[^A-Za-z0-9]/)) score += 1;

  const label =
    score === 0
      ? ""
      : score === 1
      ? "Weak"
      : score === 2
      ? "Fair"
      : score === 3
      ? "Good"
      : "Strong";

  return { score, label };
}
