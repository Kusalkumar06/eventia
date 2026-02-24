import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import {
  fontHeading,
  fontSubheading,
  fontParagraphStack,
} from "@/utilities/fonts";
import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Eventia",
  description: "The next generation event management platform for immersive experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontHeading.variable} ${fontSubheading.variable} antialiased`}
        style={
          { "--font-paragraph": fontParagraphStack } as React.CSSProperties
        }
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>{children}</Providers>
          <Toaster position="bottom-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
