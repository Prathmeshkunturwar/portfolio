import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { LenisProvider } from "@/lib/lenis";
import CustomCursor from "@/components/ui/CustomCursor";
import SpringMouseProvider from "@/lib/useMouseSpring";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://prathmeshkunturwar.dev"),
  title: "Prathmesh Kunturwar | AI Engineer",
  description:
    "AI engineer building systems that ship. Agents, automation, production ML.",
  openGraph: {
    title: "Prathmesh Kunturwar | AI Engineer",
    description: "AI engineer building systems that ship.",
    images: ["/assets/og-image.png"],
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="bg-black text-[#E8E8E8] min-h-screen">
        <LenisProvider>{children}</LenisProvider>
        <SpringMouseProvider />
        <CustomCursor />
      </body>
    </html>
  );
}
