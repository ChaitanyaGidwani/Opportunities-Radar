import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Argus — Every Opportunity, Made for You",
  description:
    "Argus aggregates internships, scholarships, competitions, and hackathons into one personalized feed with deadline nudges that actually land.",
  keywords: [
    "internships",
    "scholarships",
    "hackathons",
    "competitions",
    "student opportunities",
    "deadline reminders",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} ${bricolage.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
