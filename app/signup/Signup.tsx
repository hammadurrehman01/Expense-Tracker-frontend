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
import axios, { AxiosError } from "axios";
import { DollarSign, Eye, EyeOff, Lock, Shield } from "lucide-react";
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { ThemeToggle } from "../components/theme-toggle";
import { signupSchema } from "@/schemas/signup";
import { GoogleLogin } from "@react-oauth/google";
  import { useGoogleLogin } from "@react-oauth/google";


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




const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    const res = await axios.post("http://localhost:8000/api/auth/google/signup", {
      token: tokenResponse.access_token,
    });

    console.log(res.data);
  },
  onError: () => console.log("Login Failed"),
});

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
  onClick={() => googleLogin()}
>
  {/* SVG here */}
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
