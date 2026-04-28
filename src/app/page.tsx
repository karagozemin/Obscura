import Link from "next/link";
import dynamic from "next/dynamic";
import { buttonStyles } from "@/components/ui/button";

const ColorBends = dynamic(() => import("@/components/effects/ColorBends"), { ssr: false });

const features = [
  {
    icon: "◈",
    title: "Sealed Bid Funding",
    body: "Investors encrypt bid amounts with iExec Nox before submission. No counterparty can observe allocation sizes onchain.",
  },
  {
    icon: "⬡",
    title: "Confidential Transfers",
    body: "ERC-7984 confidential tokens move between wallets without exposing amounts. Settlement is provably correct without revealing figures.",
  },
  {
    icon: "◎",
    title: "Permissioned Disclosure",
    body: "Issuers grant auditors ACL access to specific bid handles. Regulators see what they need — nothing more.",
  },
];

const stats = [
  { label: "Privacy Model",  value: "FHE" },
  { label: "Network",        value: "Arbitrum" },
  { label: "Token Standard", value: "ERC-7984" },
  { label: "Settlement",     value: "Onchain" },
];

const steps = [
  { n: "01", title: "Create",  body: "Issuer publishes a private credit deal with terms and document hash." },
  { n: "02", title: "Bid",     body: "Investors wrap tokens into cUSDC and submit sealed encrypted bids." },
  { n: "03", title: "Fund",    body: "Issuer closes the round and marks the deal funded onchain." },
  { n: "04", title: "Repay",   body: "Issuer repays with an encrypted confidential token transfer." },
  { n: "05", title: "Claim",   body: "Investors claim repayment. Auditors verify with permissioned access." },
];

export default function LandingPage() {
  return (
    <div className="space-y-32 py-4">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl text-center">
        {/* WebGL background layer */}
        <div className="absolute inset-0 pointer-events-none">
          <ColorBends
            colors={["#1a0a3d", "#3b0764", "#6d28d9", "#7c3aed", "#4c1d95", "#1e1b4b"]}
            speed={0.12}
            rotation={110}
            autoRotate={0.8}
            scale={1.1}
            frequency={0.9}
            warpStrength={0.7}
            mouseInfluence={0.4}
            parallax={0.3}
            noise={0.08}
            iterations={2}
            intensity={1.4}
            bandWidth={5}
          />
          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg/60 via-bg/20 to-bg/85" />
        </div>

        {/* Content sits above background */}
        <div className="relative z-10 space-y-8 rounded-3xl bg-bg/75 px-6 pb-16 pt-20 backdrop-blur-md">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple/25 bg-purple-subtle/80 px-4 py-1.5 text-xs font-medium text-purple-bright backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple" />
            Confidential RWA Protocol · Arbitrum Sepolia
          </div>

          <h1 className="text-5xl font-semibold leading-[1.12] tracking-tight text-text-1 md:text-6xl lg:text-7xl">
            Private credit,
            <br />
            <span className="text-purple-gradient">sealed onchain.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-text-1/90">
            Obscura Finance is a confidential deal room where investors submit sealed bids,
            allocations stay hidden, repayments settle onchain, and auditors verify details
            through permissioned disclosure.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/demo" className={buttonStyles({ variant: "gold", size: "lg" })}>
              Start Demo
            </Link>
            <Link href="/issuer" className={buttonStyles({ variant: "outline", size: "lg" })}>
              Issuer Dashboard
            </Link>
            <Link href="/investor" className={buttonStyles({ variant: "ghost", size: "lg" })}>
              Investor Dashboard
            </Link>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-2 flex max-w-xl flex-wrap justify-center gap-px overflow-hidden rounded-2xl border border-border bg-border backdrop-blur-sm">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-1 min-w-[90px] flex-col items-center gap-1 bg-card/80 px-4 py-4 backdrop-blur-sm">
                <span className="text-lg font-semibold text-purple-bright">{s.value}</span>
                <span className="text-xs text-text-2 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem / Solution ───────────────────────────────────── */}
      <section className="grid gap-5 md:grid-cols-2">
        {[
          {
            tag: "Problem",
            title: "Public settlement exposes private credit",
            body: "Traditional RWA funding cannot move fully onchain when every bid size, allocation, and repayment exposure is visible to the market. Investors lose edge. Issuers lose counterparties.",
          },
          {
            tag: "Solution",
            title: "FHE-powered confidential deal rooms",
            body: "Obscura Finance uses iExec Nox fully homomorphic encryption to keep all financial amounts encrypted onchain. Correctness is provable. Amounts remain private.",
          },
        ].map((item) => (
          <div key={item.tag} className="card-shine rounded-2xl border border-border bg-card p-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-purple">{item.tag}</span>
            <h3 className="mt-3 text-xl font-semibold text-text-1">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-2">{item.body}</p>
          </div>
        ))}
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple">Core Capabilities</span>
          <h2 className="mt-3 text-3xl font-semibold text-text-1">Built for institutional privacy</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-shine group rounded-2xl border border-border bg-card p-7 transition-all duration-200 hover:border-purple/20 hover:shadow-purple">
              <div className="mb-4 text-2xl text-purple opacity-70 group-hover:opacity-100 transition-opacity">{f.icon}</div>
              <h3 className="font-semibold text-text-1">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-2">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-purple">Protocol Flow</span>
          <h2 className="mt-3 text-3xl font-semibold text-text-1">End-to-end in five steps</h2>
        </div>
        <div className="relative space-y-3">
          <div className="absolute left-[2.25rem] top-8 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-purple/40 via-border to-transparent md:block" />
          {steps.map((step) => (
            <div key={step.n} className="relative flex items-start gap-5 rounded-2xl border border-border bg-card p-5 pl-6 transition-colors hover:border-border-2">
              <div className="z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-purple/30 bg-purple-subtle text-xs font-bold text-purple">
                {step.n}
              </div>
              <div>
                <p className="font-semibold text-text-1">{step.title}</p>
                <p className="mt-1 text-sm text-text-2">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-purple/15 shadow-purple-glow text-center">
        {/* WebGL background */}
        <div className="absolute inset-0 pointer-events-none">
          <ColorBends
            colors={["#2e1065", "#4c1d95", "#6d28d9", "#1a0a3d", "#3b0764"]}
            speed={0.08}
            rotation={45}
            autoRotate={1}
            scale={1.5}
            frequency={0.7}
            warpStrength={0.5}
            noise={0.05}
            iterations={1}
            intensity={1.0}
            bandWidth={4}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-card/70 via-card/30 to-card/70" />
        </div>
        <div className="relative z-10 p-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple">Ready?</p>
          <h2 className="mt-3 text-3xl font-semibold text-text-1">Run the full confidential funding flow</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-1/85">
            Demo mode walks you through every onchain action in under four minutes. Deal state, bids, and repayments are pulled live from the contract.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/demo" className={buttonStyles({ variant: "gold", size: "lg" })}>
              Open Demo
            </Link>
            <Link href="/issuer" className={buttonStyles({ variant: "outline", size: "lg" })}>
              Issuer Dashboard
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
