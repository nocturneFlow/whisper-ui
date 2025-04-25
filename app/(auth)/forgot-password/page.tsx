"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

// UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Custom hooks and components
import { useHapticFeedback } from "@/components/ui/haptics";
import { AuthPanel } from "@/components/auth/auth-panel";

// Types
import type { ResetPasswordData } from "@/lib/auth-types";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const haptics = useHapticFeedback();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    haptics.trigger("click");

    try {
      // Simulate API call - replace with actual reset request
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      haptics.trigger("success");
    } catch (error) {
      console.error("Password reset request failed:", error);
      haptics.trigger("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPanel
      icon={Mail}
      title="Забыли Пароль?"
      description="Не беспокойтесь, мы поможем вам сбросить пароль и вернуться к вашему аккаунту."
    >
      <Card className="shadow-xl border-t-4 border-sidebar-primary rounded-xl w-full overflow-hidden bg-card hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="pb-4 pt-8 px-8">
          <CardTitle className="text-3xl font-semibold text-center text-card-foreground">
            Сброс Пароля
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground mt-2">
            Введите ваш email для получения ссылки на сброс пароля.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email Адрес
                </Label>
                <motion.div whileTap={{ scale: 0.99 }} className="group">
                  <Input
                    id="email"
                    type="email"
                    placeholder="natasha@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 px-4 border-input rounded-lg focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all bg-muted/50 focus:bg-background"
                    autoComplete="email"
                  />
                </motion.div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-3"
                onTap={() => !isLoading && haptics.trigger("click")}
              >
                <Button
                  type="submit"
                  className="w-full h-11 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground font-semibold rounded-lg text-base transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sidebar-primary/50 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
                  disabled={isLoading}
                  aria-live="polite"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      <span>Обработка...</span>
                    </div>
                  ) : (
                    "Отправить Ссылку для Сброса"
                  )}
                </Button>
              </motion.div>
            </form>
          ) : (
            <motion.div
              className="text-center py-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <motion.div
                className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                  type: "spring",
                }}
              >
                <CheckCircle className="w-8 h-8 text-primary" />
              </motion.div>

              <motion.h3
                className="text-xl font-medium text-card-foreground mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                Проверьте вашу почту
              </motion.h3>

              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                Мы отправили ссылку для сброса пароля на{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Нажмите на ссылку, чтобы сбросить пароль.
              </motion.p>

              {/* Email sent animation */}
              <motion.div
                className="flex justify-center items-center h-16 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  className="w-10 h-6 bg-primary/10 rounded flex items-center justify-center text-primary"
                  initial={{ x: 0 }}
                  animate={{
                    x: [0, 80, 80],
                    y: [0, -20, 0],
                    scale: [1, 0.8, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: 0.8,
                    times: [0, 0.5, 1],
                  }}
                >
                  <Mail className="w-4 h-4" />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-5 pt-4 pb-8 px-8">
          <Link
            href="/sign-in"
            className="text-center text-sm text-primary hover:underline font-medium flex items-center justify-center group"
            onClick={() => haptics.trigger("click")}
          >
            <motion.span
              className="inline-block mr-1"
              animate={{ x: [0, -3, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                repeatDelay: 2,
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </motion.span>
            <span className="group-hover:underline">Вернуться к Входу</span>
          </Link>
        </CardFooter>
      </Card>
    </AuthPanel>
  );
}
