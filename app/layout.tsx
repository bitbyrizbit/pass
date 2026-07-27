import type { Metadata } from "next";
import { Instrument_Serif, Instrument_Sans, Inter } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-plex-mono", // Keeping variable name so Tailwind config works
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Pass",
  description:
    "An order management system built around the one thing every kitchen already trusts - the ticket rail.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${instrumentSans.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
