import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Literata } from "next/font/google";
import MobileNav from "@/components/MobileNav";
import SolanaWalletProvider from "@/components/solana/SolanaWalletProvider";
import { ThemeProvider } from "@/lib/design-system/theme";
import SkipLink from "@/components/ui/SkipLink";
import ToastProviderClient from "@/components/ui/ToastProviderClient";
import GlassFilterDefs from "@/components/layout/GlassFilterDefs";
import GlassBackground from "@/components/layout/GlassBackground";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const headingFont = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Literata({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Donation.Box",
    default: "Donation.Box",
  },
  description:
    "A decentralized crowdfunding platform on Solana — transparent, global, and community-powered.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <GlassBackground />
        <SkipLink />
        <ThemeProvider>
          <SolanaWalletProvider>
            <ToastProviderClient>
              <MobileNav />
              <main id="main-content" className="flex-1 relative z-[1]">
                {children}
              </main>
              <Footer />
              <GlassFilterDefs />
            </ToastProviderClient>
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
