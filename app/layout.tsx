import type React from "react";
import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans"
import { Geist } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import { FinanceBackground } from "./components/finance-background";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
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
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
