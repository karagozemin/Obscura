"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { WalletButton } from "@/components/wallet-button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/",        label: "Overview" },
  { href: "/issuer",  label: "Issuer"   },
  { href: "/investor",label: "Investor" },
  { href: "/auditor", label: "Auditor"  },
  { href: "/demo",    label: "Demo"     },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-11 w-11 overflow-hidden rounded-xl border border-purple/30 bg-purple-subtle flex items-center justify-center group-hover:border-purple/30 transition-colors">
            <Image
              src="/obscura-logo.png"
              alt="Obscura Finance"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
              priority
            />
          </div>
          <span className="text-sm font-semibold tracking-tight text-text-1">
            Obscura<span className="text-gold">.</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-1.5 text-sm rounded-md transition-colors",
                  active
                    ? "text-gold"
                    : "text-text-2 hover:text-text-1"
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-px h-px bg-gold rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        <WalletButton />
      </div>
    </nav>
  );
}
