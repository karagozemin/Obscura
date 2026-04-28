import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Obscura Finance",
  description: "Confidential RWA Deal Rooms for sealed private credit funding."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-b from-surface via-surface to-black">
            <Nav />
            <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
