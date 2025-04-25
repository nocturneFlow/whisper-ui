"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { SuccessConfetti } from "@/components/ui/success-confetti";

// Types and utilities
import type { SignUpData } from "@/lib/auth-types";
import { calculatePasswordStrength } from "@/lib/auth-types";

export default function SignUp() {
  // State management
  const [formData, setFormData] = useState<SignUpData>({
    name: "",
    username: "",
    email: "",
    password: "",
    agreedToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();
  const haptics = useHapticFeedback();

  // Form input handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreedToTerms: checked }));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    haptics.trigger("click");

    try {
      // Simulate API call - replace with actual registration API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success animation
      setIsLoading(false);
      setShowSuccess(true);
      haptics.trigger("success");

      // Redirect after showing success animation
      setTimeout(() => {
        router.push(
          `/verification-sent?email=${encodeURIComponent(formData.email)}`
        );
      }, 1800);
    } catch (error) {
      setIsLoading(false);
      haptics.trigger("error");
      console.error("Registration failed:", error);
    }
  };

  // Password strength calculation
  const passwordStrengthInfo = calculatePasswordStrength(formData.password);

  return (
    <>
      {showSuccess && <SuccessConfetti show={showSuccess} />}

      <AuthPanel
        icon={Sparkles}
        title="Начните свое путешествие"
        description="Создайте аккаунт, чтобы получить доступ к эксклюзивным функциям и возможностям."
      >
        <Card className="shadow-xl border-t-4 border-sidebar-primary rounded-xl w-full overflow-hidden bg-card hover:shadow-2xl transition-shadow duration-300">
          <CardHeader className="pb-4 pt-8 px-8">
            <CardTitle className="text-3xl font-semibold text-center text-card-foreground">
              Создать Аккаунт
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground mt-2">
              Заполните информацию ниже для регистрации.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Полное Имя
                </Label>
                <motion.div whileTap={{ scale: 0.99 }}>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="например, Михаил Петров"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-11 px-4 border-input rounded-lg focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all bg-muted/50 focus:bg-background"
                    autoComplete="name"
                  />
                </motion.div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-foreground"
                >
                  Имя Пользователя
                </Label>
                <motion.div whileTap={{ scale: 0.99 }}>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="например, mikhailp"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="h-11 px-4 border-input rounded-lg focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all bg-muted/50 focus:bg-background"
                    autoComplete="username"
                  />
                </motion.div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Электронная Почта
                </Label>
                <motion.div whileTap={{ scale: 0.99 }}>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="вы@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-11 px-4 border-input rounded-lg focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all bg-muted/50 focus:bg-background"
                    autoComplete="email"
                  />
                </motion.div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Пароль
                </Label>
                <motion.div whileTap={{ scale: 0.99 }} className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Выберите надежный пароль"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11 px-4 border-input rounded-lg focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all bg-muted/50 focus:bg-background pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={
                      showPassword ? "Скрыть пароль" : "Показать пароль"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </motion.div>

                {formData.password && (
                  <div className="mt-2.5">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`h-1.5 rounded-full flex-1 ${
                            i < passwordStrengthInfo.score
                              ? passwordStrengthInfo.score < 3
                                ? "bg-chart-4" // Weak or fair
                                : "bg-chart-3" // Good or strong
                              : "bg-muted"
                          }`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: i * 0.05,
                            ease: "easeOut",
                          }}
                          style={{ transformOrigin: "left" }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {passwordStrengthInfo.score === 0
                        ? "Надежность пароля"
                        : {
                            0: "Очень слабый",
                            1: "Слабый",
                            2: "Средний",
                            3: "Хороший",
                            4: "Надежный",
                          }[passwordStrengthInfo.score] ||
                          passwordStrengthInfo.label}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-2.5 pt-2">
                <Checkbox
                  id="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={handleCheckboxChange}
                  className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <label
                  htmlFor="agreedToTerms"
                  className="text-sm text-muted-foreground leading-snug"
                >
                  Я согласен с{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:underline font-medium"
                  >
                    Условиями использования
                  </Link>{" "}
                  и{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline font-medium"
                  >
                    Политикой конфиденциальности
                  </Link>
                </label>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
                onTap={() =>
                  !isLoading &&
                  formData.agreedToTerms &&
                  haptics.trigger("click")
                }
              >
                <Button
                  type="submit"
                  className="w-full h-11 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground font-semibold rounded-lg text-base transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sidebar-primary/50 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
                  disabled={isLoading || !formData.agreedToTerms}
                  aria-live="polite"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Создание аккаунта...
                    </>
                  ) : (
                    "Создать Аккаунт"
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>

          <CardFooter className="pb-8 pt-4 px-8">
            <p className="text-center w-full text-sm text-muted-foreground">
              Уже есть аккаунт?{" "}
              <Link
                href="/sign-in"
                className="text-primary hover:underline font-medium"
              >
                Войти
              </Link>
            </p>
          </CardFooter>
        </Card>
      </AuthPanel>
    </>
  );
}
