"use client";

import React, { Component, ComponentType, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    console.error("Component error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="destructive" className="m-4 max-w-md mx-auto">
          <AlertTitle>Ошибка компонента</AlertTitle>
          <AlertDescription>
            <div className="space-y-3">
              <p>
                {this.state.error?.message ||
                  "Произошла ошибка при рендеринге компонента"}
              </p>
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="flex items-center gap-2 text-sm"
              >
                <RefreshCcw className="h-4 w-4" />
                Попробовать снова
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Higher-order component to wrap components with an ErrorBoundary
export function withErrorBoundary<T extends object>(
  WrappedComponent: ComponentType<T>,
  errorFallback?: ReactNode
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  function WithErrorBoundary(props: T) {
    const handleReset = () => {
      console.log(`Resetting ${displayName} after error`);
      // Could add additional reset logic here
    };

    return (
      <ErrorBoundary fallback={errorFallback} onReset={handleReset}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  return WithErrorBoundary;
}
