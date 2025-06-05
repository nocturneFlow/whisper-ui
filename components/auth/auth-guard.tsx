"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { observer } from "mobx-react-lite";
import { useAuthStore } from "@/providers/StoreProvider";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard = observer(({ children, fallback }: AuthGuardProps) => {
  const router = useRouter();
  const authStore = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (!authStore.isAuthenticated || !authStore.isSessionValid()) {
          // Try to validate session with the server
          const response = await fetch("/api/auth/validate", {
            method: "GET",
            credentials: "include",
          });

          if (!response.ok) {
            // Session invalid, redirect to sign-in
            authStore.logout();
            router.push(
              "/sign-in?redirect=" +
                encodeURIComponent(window.location.pathname)
            );
            return;
          }

          const userData = await response.json();

          // Update auth store with validated user data
          authStore.user = userData;
          authStore.isAuthenticated = true;
        }
      } catch (error) {
        console.error("Auth validation error:", error);
        authStore.logout();
        router.push(
          "/sign-in?redirect=" + encodeURIComponent(window.location.pathname)
        );
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [authStore, router]);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Проверка аутентификации...
            </p>
          </div>
        </div>
      )
    );
  }

  // Show children only if authenticated
  if (authStore.isAuthenticated && authStore.isSessionValid()) {
    return <>{children}</>;
  }

  // If not authenticated, the useEffect will handle redirect
  return null;
});

export default AuthGuard;
