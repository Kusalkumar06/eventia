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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "Eventia",
    template: "%s | Eventia",
  },
  description:
    "The next generation event management platform for immersive experiences.",
  keywords: [
    "Eventia",
    "event management platform",
    "live events",
    "ticket booking",
    "immersive experiences",
    "music events",
    "comedy shows",
    "art exhibitions",
    "business conferences",
    "sports events",
    "gaming tournaments",
    "travel events",
    "food festivals",
    "event organizer tools",
    "next generation event platform",
  ],
  verification:{
    google: 'TiPjWg0s02uRKePlyZnAJ4M0WOu8NFrWZMd2aNAGm80',
  },
  openGraph: {
    title: "Eventia",
    description:
      "The next generation event management platform for immersive experiences.",
    url: "/", 
    siteName: "Eventia",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventia",
    description:
      "The next generation event management platform for immersive experiences.",
  },
  icons: {
    icon: "/eventia_theme_logo.png",
  },
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
