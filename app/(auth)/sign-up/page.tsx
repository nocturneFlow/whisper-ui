"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { observer } from "mobx-react-lite";

// UI components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useRootStore } from "@/providers/StoreProvider";

// Validation
import { SignUpSchema, type SignUpFormData } from "@/lib/validations";
import { z } from "zod";

// Password strength calculation
const calculatePasswordStrength = (
  password: string
): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score <= 4) return { score, label: "Good", color: "bg-blue-500" };
  return { score, label: "Strong", color: "bg-green-500" };
};

const SignUp = observer(() => {
  // Store access
  const { authStore } = useRootStore();
  // Local state
  const [formData, setFormData] = useState<SignUpFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const router = useRouter();
  const haptics = useHapticFeedback();

  // Form input handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setAgreedToTerms(checked);
  };
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    haptics.trigger("click");

    // Clear previous validation errors
    setValidationErrors({});

    // Check terms agreement
    if (!agreedToTerms) {
      setValidationErrors({
        terms: "You must agree to the terms and conditions",
      });
      haptics.trigger("error");
      return;
    }

    // Validate form data
    try {
      SignUpSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        haptics.trigger("error");
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0]] = err.message;
          }
        });
        setValidationErrors(errors);
        return;
      }
    }

    try {
      const success = await authStore.signUp(formData);

      if (success) {
        // Show success animation
        setShowSuccess(true);
        haptics.trigger("success");

        // Redirect after showing success animation
        setTimeout(() => {
          router.push(
            `/verification-sent?email=${encodeURIComponent(formData.email)}`
          );
        }, 1800);
      } else {
        haptics.trigger("error");
      }
    } catch (error) {
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
          </CardHeader>{" "}
          <CardContent className="px-8">
            {/* Show validation errors if any */}
            {Object.keys(validationErrors).length > 0 && (
              <Alert className="mb-4 border-destructive/50">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <div key={field} className="text-sm">
                      {error}
                    </div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            {/* Show auth store error if any */}
            {authStore.error && (
              <Alert className="mb-4 border-destructive/50">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">
                  {authStore.error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    className={`h-11 px-4 border-input rounded-lg focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all bg-muted/50 focus:bg-background ${
                      validationErrors.username ? "border-destructive" : ""
                    }`}
                    autoComplete="username"
                  />
                </motion.div>
                {validationErrors.username && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.username}
                  </p>
                )}
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
                    className={`h-11 px-4 border-input rounded-lg focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all bg-muted/50 focus:bg-background ${
                      validationErrors.email ? "border-destructive" : ""
                    }`}
                    autoComplete="email"
                  />
                </motion.div>
                {validationErrors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.email}
                  </p>
                )}
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
                    className={`h-11 px-4 border-input rounded-lg focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all bg-muted/50 focus:bg-background pr-10 ${
                      validationErrors.password ? "border-destructive" : ""
                    }`}
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
                {validationErrors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.password}
                  </p>
                )}

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

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-foreground"
                >
                  Подтвердите Пароль
                </Label>
                <motion.div whileTap={{ scale: 0.99 }} className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Повторите пароль"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`h-11 px-4 border-input rounded-lg focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all bg-muted/50 focus:bg-background pr-10 ${
                      validationErrors.confirmPassword
                        ? "border-destructive"
                        : ""
                    }`}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    aria-label={
                      showConfirmPassword ? "Скрыть пароль" : "Показать пароль"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </motion.div>
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-2.5 pt-2">
                <Checkbox
                  id="agreedToTerms"
                  checked={agreedToTerms}
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
              {validationErrors.terms && (
                <p className="text-sm text-destructive mt-1">
                  {validationErrors.terms}
                </p>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-4"
                onTap={() =>
                  !authStore.isLoading &&
                  agreedToTerms &&
                  haptics.trigger("click")
                }
              >
                <Button
                  type="submit"
                  className="w-full h-11 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground font-semibold rounded-lg text-base transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sidebar-primary/50 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
                  disabled={authStore.isLoading || !agreedToTerms}
                  aria-live="polite"
                >
                  {authStore.isLoading ? (
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
      </AuthPanel>{" "}
    </>
  );
});

export default SignUp;
