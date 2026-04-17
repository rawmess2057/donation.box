import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MobileNav from "@/components/MobileNav";
import SolanaWalletProvider from "@/components/solana/SolanaWalletProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Donation.Box",
  description: "A decentralized crowdfunding platform on Solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SolanaWalletProvider>
          <MobileNav />
          {children}
        </SolanaWalletProvider>
      </body>
    </html>
  );
}
