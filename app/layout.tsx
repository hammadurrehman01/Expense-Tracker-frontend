import type { Metadata } from "next";
import type React from "react";
// import { GeistSans } from "geist/font/sans"
import { Geist } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider";
import ReduxProvider from "@/providers/ReduxProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { FinanceBackground } from "./components/finance-background";
import "./globals.css";


export const metadata: Metadata = {
  title: "Expense Tracker",
};

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geist.className} antialiased`}
      suppressHydrationWarning
    >
      <body>
         <GoogleOAuthProvider clientId="620727407796-ubctgh75hsd28q4lgkmepmmjvubjqfqf.apps.googleusercontent.com">
        <ReduxProvider>
          <Suspense fallback={null}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <FinanceBackground />
              <Toaster position="top-right" reverseOrder={false} />

              {children}
            </ThemeProvider>
          </Suspense>
        </ReduxProvider>
        </GoogleOAuthProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
