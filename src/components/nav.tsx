"use client";

import Link from "next/link";
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
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-7 w-7 rounded-lg border border-purple/30 bg-purple-subtle flex items-center justify-center group-hover:border-purple/30 transition-colors">
            <div className="h-3 w-3 rounded-sm bg-gold opacity-80 group-hover:opacity-100 transition-opacity" />
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
