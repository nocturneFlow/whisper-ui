"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useHapticFeedback } from "@/components/ui/haptics";
import { AuthPanel } from "@/components/auth/auth-panel";

interface CountdownTimerProps {
  seconds: number;
  onComplete?: () => void;
}

/**
 * Formatted countdown timer component with progress bar
 */
function CountdownTimer({ seconds, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  // Format time as mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs
      .toString()
      .padStart(2, "0")}`;
  };

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  return (
    <motion.div
      className="bg-accent/20 rounded-lg overflow-hidden"
      animate={{
        height: timeLeft > 0 ? "auto" : 0,
        opacity: timeLeft > 0 ? 1 : 0,
        marginBottom: timeLeft > 0 ? 16 : 0,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 text-accent-foreground text-sm relative">
        <p>Срок действия ссылки истекает через:</p>
        <div className="mt-2 font-mono text-lg font-semibold flex items-center justify-center">
          <motion.div
            key={timeLeft}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 bg-accent/10 rounded"
          >
            {formatTime(timeLeft)}
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-accent/20 mt-3 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: "100%" }}
            animate={{ width: `${(timeLeft / seconds) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function VerificationSent() {
  // Get email from URL query params
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "anastasia@example.com";

  // State management
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(3600); // 1 hour in seconds

  const haptics = useHapticFeedback();

  const handleResend = async () => {
    setIsResending(true);
    haptics.trigger("click");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Reset timer and states
    setResendTimer(3600);
    setIsTimerComplete(false);
    setIsResending(false);
    haptics.trigger("success");
  };

  return (
    <AuthPanel
      icon={CheckCircle2}
      title="Проверьте Вашу Почту"
      description="Мы отправили ссылку для верификации на ваш адрес электронной почты. Пожалуйста, подтвердите свой аккаунт, чтобы продолжить."
    >
      <Card className="shadow-xl border-t-4 border-primary rounded-xl w-full overflow-hidden bg-card hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="pb-4 pt-8 px-8">
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-semibold text-center text-card-foreground">
            Письмо для Подтверждения Отправлено
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground mt-4">
            Мы отправили ссылку для верификации на{" "}
            <span className="font-semibold text-foreground">{email}</span>.
            Пожалуйста, проверьте вашу почту и нажмите на ссылку для
            подтверждения аккаунта.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 text-center">
          <CountdownTimer
            seconds={resendTimer}
            onComplete={() => setIsTimerComplete(true)}
          />

          {isTimerComplete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive mb-4"
            >
              <p>
                Срок действия вашей ссылки для подтверждения истек. Пожалуйста,
                запросите новую.
              </p>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4 pb-8 px-8">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 h-11 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
            onClick={handleResend}
            disabled={isResending || (!isTimerComplete && resendTimer > 3540)} // Disable for first 20 seconds unless expired
          >
            {isResending ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Отправка...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" /> Отправить Письмо Снова
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Вернуться к{" "}
            <Link
              href="/sign-in"
              className="text-primary hover:underline font-medium"
            >
              Входу
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthPanel>
  );
}
