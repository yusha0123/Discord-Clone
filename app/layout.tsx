import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/themeProvider";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ModalProvider } from "@/components/providers/ModalProvider";
import QueryWrapper from "@/components/providers/QueryWrapper";

const font = Open_Sans({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "A Discord Clone Build by Yusha Tahlil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <QueryWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              storageKey="app-theme"
            >
              <ModalProvider />
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
