"use client";

import dynamic from "next/dynamic";

const ColorBends = dynamic(() => import("./ColorBends"), { ssr: false });

export function ColorBendsBackground() {
  return (
    <div className="pointer-events-none fixed inset-0">
      <ColorBends
        colors={["#6f8cff", "#7b6bff", "#2de2c6"]}
        rotation={90}
        speed={0.18}
        scale={1}
        frequency={1}
        warpStrength={0.9}
        mouseInfluence={0.8}
        noise={0.12}
        parallax={0.4}
        iterations={1}
        intensity={1.2}
        bandWidth={6}
        transparent
      />
    </div>
  );
}
