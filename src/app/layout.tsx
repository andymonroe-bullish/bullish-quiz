import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-cursive",
  style: ["italic"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Find Your Event Model | Bullish Events",
  description:
    "Take the 2-minute quiz to discover which IRL event model fits your business and could unlock your next phase of growth.",
  openGraph: {
    title: "Find Your Event Model | Bullish Events",
    description:
      "Take the 2-minute quiz to discover which IRL event model fits your business.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
