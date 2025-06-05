"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn, AlertCircle } from "lucide-react";
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
import { useRootStore } from "@/providers/StoreProvider";

// Validation
import { SignInSchema, type SignInFormData } from "@/lib/validations";

const SignIn = observer(() => {
  // Store access
  const { authStore } = useRootStore();

  // Local state
  const [credentials, setCredentials] = useState<SignInFormData>({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const router = useRouter();
  const haptics = useHapticFeedback();

  // Form input handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));

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
    setRememberMe(checked);
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    haptics.trigger("click");

    // Clear previous validation errors
    setValidationErrors({});

    // Validate form data
    try {
      SignInSchema.parse(credentials);
    } catch (error) {
      if (error instanceof Error) {
        haptics.trigger("error");
        const zodError = JSON.parse(error.message);
        const errors: Record<string, string> = {};
        zodError.forEach((err: any) => {
          errors[err.path[0]] = err.message;
        });
        setValidationErrors(errors);
        return;
      }
    }

    try {
      const success = await authStore.signIn(credentials);

      if (success) {
        haptics.trigger("success");
        // Redirect to dashboard or intended destination
        router.push("/tools");
      } else {
        haptics.trigger("error");
      }
    } catch (error) {
      haptics.trigger("error");
      console.error("Authentication failed:", error);
    }
  };

  return (
    <AuthPanel
      icon={LogIn}
      title="Добро пожаловать"
      description="Войдите, чтобы получить доступ к панели управления и управлять своим аккаунтом."
    >
      <Card className="shadow-xl border-t-4 border-sidebar-primary rounded-xl w-full overflow-hidden bg-card hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="pb-4 pt-8 px-8">
          <CardTitle className="text-3xl font-semibold text-center text-card-foreground">
            Вход
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground mt-2">
            Введите ваши данные для входа.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {" "}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-sm font-medium text-foreground"
              >
                Имя пользователя
              </Label>
              <motion.div whileTap={{ scale: 0.99 }} className="group">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="например, ivanivanov"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  className="h-11 px-4 border-input rounded-lg focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all bg-muted/50 focus:bg-background"
                  autoComplete="username"
                />
                {validationErrors.username && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.username}
                  </p>
                )}
              </motion.div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Пароль
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline transition font-medium"
                >
                  Забыли пароль?
                </Link>
              </div>
              <motion.div whileTap={{ scale: 0.99 }} className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите ваш пароль"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="h-11 px-4 border-input rounded-lg focus:border-primary focus:ring focus:ring-primary/20 focus:ring-opacity-50 transition-all bg-muted/50 focus:bg-background pr-10"
                  autoComplete="current-password"
                />
                {validationErrors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {validationErrors.password}
                  </p>
                )}
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
            </div>{" "}
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-muted-foreground select-none"
              >
                Запомнить меня на 30 дней
              </label>
            </div>
            {/* Display auth error */}
            {authStore.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{authStore.error}</AlertDescription>
              </Alert>
            )}{" "}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="pt-3"
              onTap={() => !authStore.isLoading && haptics.trigger("click")}
            >
              <Button
                type="submit"
                className="w-full h-11 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground font-semibold rounded-lg text-base transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sidebar-primary/50 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
                disabled={authStore.isLoading}
                aria-live="polite"
              >
                {authStore.isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Вход...
                  </>
                ) : (
                  "Войти"
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pt-4 pb-8 px-8">
          <p className="text-center text-sm text-muted-foreground">
            Нет аккаунта?{" "}
            <Link
              href="/sign-up"
              className="text-primary hover:underline font-medium"
            >
              Зарегистрироваться
            </Link>
          </p>{" "}
        </CardFooter>
      </Card>
    </AuthPanel>
  );
});

export default SignIn;
