import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/QueryProvider";

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
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased">
        <QueryProvider>
          {children}
          <Toaster position="top-center" />
        </QueryProvider>
      </body>
    </html>
  );
}
