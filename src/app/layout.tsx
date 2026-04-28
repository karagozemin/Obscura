import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { ColorBendsBackground } from "@/components/backgrounds/ColorBendsBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Obscura Finance — Confidential RWA Deal Rooms",
  description: "Private credit funding with sealed bids, confidential token transfers, and permissioned audit disclosure.",
  icons: {
    icon: "/obscura-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>
          <div className="relative min-h-screen bg-bg">
            {/* Ambient background */}
            <div className="pointer-events-none fixed inset-0 bg-hero-gradient" />
            <div className="pointer-events-none fixed inset-0 bg-dot-pattern opacity-40" />
            <ColorBendsBackground />
            <div className="relative z-10 flex min-h-screen flex-col">
              <Nav />
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
                {children}
              </main>
              <footer className="border-t border-border py-6 text-center text-xs text-text-2">
                <span className="text-purple-gradient font-medium">Obscura Finance</span>
                <span className="mx-2 text-text-3">·</span>
                Confidential RWA Protocol on Arbitrum Sepolia
              </footer>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
