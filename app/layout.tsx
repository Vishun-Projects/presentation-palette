import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/src/components/QueryProvider";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "NVISION - Premium Presentation Palette",
  description: "NVision specializes in creating high-impact pitch decks and corporate presentations that win investors and close deals.",
  authors: [{ name: "NVISION" }],
  openGraph: {
    title: "NVISION - Premium Presentation Palette",
    description: "NVision specializes in creating high-impact pitch decks and corporate presentations that win investors and close deals.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NVISION - Premium Presentation Palette",
    description: "NVision specializes in creating high-impact pitch decks and corporate presentations that win investors and close deals.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-black text-white antialiased">
        <QueryProvider>
          {children}
          <Toaster position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
