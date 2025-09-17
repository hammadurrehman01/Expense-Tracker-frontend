"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";
import { CheckCircle, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { ThemeToggle } from "../components/theme-toggle";
import { useCookies } from "next-client-cookies";

export default function EmailVerification() {
  const user = useSelector((state: any) => state?.auth?.user);
  const searchParams = useSearchParams().get("token");
  const router = useRouter();
  const cookies = useCookies();

  const [isResending, setIsResending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const response = await api.post("/auth/resend-email", {
        user: user.user,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Resend email error:", error);
    } finally {
      setIsResending(false);
    }
  };

  const checkEmailVerification = () => {
    if (searchParams === user.user.confirmation_token) {
      router.push("/user/dashboard");
      cookies.set("email_verification_status", "true");
    }
  };

  useEffect(() => {
    checkEmailVerification();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Theme Toggle Button */}
      <ThemeToggle />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4">
            <Mail className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-balance">
            Check Your Inbox, Please !
          </h1>
        </div>

        <Card className="border-0 shadow-xl backdrop-blur-sm bg-card/95 mt-0">
          <CardContent className="space-y-6">
            {/* Main Message */}
            <div className="space-y-2 ">
              <p className="text-md text-muted-foreground leading-relaxed text-center">
                Hey{" "}
                <span className="font-semibold text-foreground">
                  {user.user.name},{" "}
                </span>
                to start using{" "}
                <span className="font-semibold text-primary">
                  Expense Tracker
                </span>{" "}
                we need to verify your email. We've already sent out the
                verification link.
              </p>
              <p className="text-sm text-muted-foreground text-center text-md">
                Please check it and confirm it's verify you.
              </p>
            </div>

            {/* Resend Email Section */}
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground text-md">
                Didn't get e-mail?
              </p>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 text-sm font-medium bg-transparent"
                onClick={handleResendEmail}
                disabled={isResending || emailSent}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : emailSent ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                    Email Sent!
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send it again
                  </>
                )}
              </Button>
            </div>

            {/* Footer Links */}
            <div className="text-center space-y-2 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                <Link
                  href="/signin"
                  className="text-primary hover:underline font-medium"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
