import { makeAutoObservable, runInAction } from "mobx";
import {
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpReponse,
  SignInUpResponseError,
} from "@/types/authentication";
import { RootStore } from "./index";
import { z } from "zod";

// Enhanced Zod validation schemas
export const SignInSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignUpSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export interface User {
  id: number;
  username: string;
  email: string;
  created_at?: Date;
}

export class AuthStore {
  rootStore: RootStore;

  // State
  user: User | null = null;
  isAuthenticated = false;
  isLoading = false;
  error: string | null = null;

  // Session management
  sessionToken: string | null = null;
  sessionExpiry: Date | null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.initializeAuth();
  }

  // Initialize authentication from localStorage
  private initializeAuth() {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("sessionToken");
      const storedExpiry = localStorage.getItem("sessionExpiry");

      if (storedUser && storedToken && storedExpiry) {
        const user = JSON.parse(storedUser);
        const expiry = new Date(storedExpiry);

        if (expiry > new Date()) {
          runInAction(() => {
            this.user = user;
            this.sessionToken = storedToken;
            this.sessionExpiry = expiry;
            this.isAuthenticated = true;
          });
        } else {
          this.logout();
        }
      }
    }
  }

  // Sign up method
  async signUp(data: z.infer<typeof SignUpSchema>) {
    this.setLoading(true);
    this.clearError();

    try {
      const validatedData = SignUpSchema.parse(data);

      const response = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: validatedData.username,
          email: validatedData.email,
          password: validatedData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          (result as SignInUpResponseError).detail || "Sign up failed"
        );
      }

      const userData = result as SignUpReponse;

      runInAction(() => {
        this.user = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          created_at: userData.created_at,
        };
        this.isAuthenticated = true;
        this.createSession();
      });

      this.persistAuth();
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Sign up failed";
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  // Sign in method
  async signIn(data: z.infer<typeof SignInSchema>) {
    this.setLoading(true);
    this.clearError();

    try {
      const validatedData = SignInSchema.parse(data);

      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          (result as SignInUpResponseError).detail || "Sign in failed"
        );
      }

      const userData = result as SignInResponse;

      runInAction(() => {
        this.user = userData;
        this.isAuthenticated = true;
        this.createSession();
      });

      this.persistAuth();
      return true;
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : "Sign in failed";
      });
      return false;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
  // Logout method
  async logout() {
    try {
      // Call logout API to clear server-side cookies
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error calling logout API:", error);
      // Continue with client-side logout even if API call fails
    }

    runInAction(() => {
      this.user = null;
      this.isAuthenticated = false;
      this.sessionToken = null;
      this.sessionExpiry = null;
      this.error = null;
    });

    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("sessionExpiry");
    }
  }

  // Create session with expiry
  private createSession() {
    const token = this.generateSessionToken();
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24); // 24 hour session

    runInAction(() => {
      this.sessionToken = token;
      this.sessionExpiry = expiry;
    });
  }

  // Generate session token
  private generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Persist authentication state
  private persistAuth() {
    if (
      typeof window !== "undefined" &&
      this.user &&
      this.sessionToken &&
      this.sessionExpiry
    ) {
      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("sessionToken", this.sessionToken);
      localStorage.setItem("sessionExpiry", this.sessionExpiry.toISOString());
    }
  }

  // Check if session is valid
  isSessionValid(): boolean {
    return this.sessionExpiry ? this.sessionExpiry > new Date() : false;
  }

  // Utility methods
  private setLoading(loading: boolean) {
    this.isLoading = loading;
  }

  private clearError() {
    this.error = null;
  }

  setError(error: string) {
    this.error = error;
  }
}
