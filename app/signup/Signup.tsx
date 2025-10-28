"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import api from "@/lib/axios";
import { setUser } from "@/slices/authSlice";
import { AxiosError } from "axios";
import { DollarSign, Eye, EyeOff, Lock, Shield } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { ThemeToggle } from "../components/theme-toggle";
import { signupSchema } from "@/schemas/signup";

interface signUp {
  name: string;
  email: string;
  password: string;
}

export default function Signup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cookies = useCookies();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: signUp) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/signup", values);
      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/verify-email");

        const data = {
          user: response.data.user,
          access_token: response.data.access_token,
        };

        dispatch(setUser(data));
        cookies.set("customer_loggedin", "true");
        cookies.set("email_verification_status", "false");
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Something went wrong");
      console.error("Signup error:", err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth signup
    console.log("Google signup clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Theme Toggle Button */}
      <ThemeToggle />

      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-balance">
            Create Your Account
          </h1>
          <p className="text-muted-foreground text-pretty">
            Start tracking your expenses and take control of your finances
          </p>
        </div>

        <Card className="border-0 shadow-xl backdrop-blur-sm bg-card/95">
          <CardContent className="space-y-4">
            {/* Google Signup Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-sm font-medium bg-transparent"
              onClick={handleGoogleSignup}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Signup Form */}
            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              validationSchema={signupSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={
                        `border border-green-700 ${errors.name && touched.name ? "border-destructive" : ""}`
                      }
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-sm text-destructive"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={
                        errors.email && touched.email
                          ? "border-destructive"
                          : ""
                      }
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-sm text-destructive"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className={`pr-10 ${
                          errors.password && touched.password
                            ? "border-destructive"
                            : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-sm text-destructive"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 text-sm font-medium"
                    disabled={isSubmitting || isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Trust Signals */}
            <div className="flex items-center justify-center space-x-4 pt-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Encrypted</span>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
