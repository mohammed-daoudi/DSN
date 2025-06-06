import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Master DSN - Plateforme collaborative",
  description:
    "Plateforme de valorisation et de partage des travaux académiques du Master Droit et Sécurité Numériques",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" className="dark">
        <body
          className={`${geist.variable} ${geistMono.variable} antialiased bg-slate-900 text-white`}
        >
          <Navigation />
          <main className="pt-16">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
