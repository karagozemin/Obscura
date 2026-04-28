import Link from "next/link";
import { WalletButton } from "@/components/wallet-button";

const navItems = [
  { href: "/", label: "Overview" },
  { href: "/issuer", label: "Issuer" },
  { href: "/investor", label: "Investor" },
  { href: "/auditor", label: "Auditor" },
  { href: "/demo", label: "Judge Demo" }
];

export function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-border bg-surface/80 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-4">
        <Link href="/" className="text-lg font-semibold">
          Obscura Finance
        </Link>
        <div className="hidden items-center gap-4 text-sm text-white/70 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <WalletButton />
    </nav>
  );
}
