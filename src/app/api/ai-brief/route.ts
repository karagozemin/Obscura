import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.CHAINGPT_API_KEY;
  if (!apiKey) {
    return new Response("ChainGPT API key not configured", { status: 503 });
  }

  const { title, category, description, maturityDate, documentHash } = await req.json();

  const maturityStr = maturityDate
    ? new Date(Number(maturityDate) * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "unspecified";

  const question = `You are an institutional analyst specializing in Web3 RWA (real-world asset) private credit on confidential blockchain infrastructure.

Analyze this deal and provide a concise due diligence brief:

Deal: ${title}
Category: ${category}
Maturity: ${maturityStr}
Description: ${description}
Onchain Document Hash: ${documentHash || "not provided"}

Structure your response exactly as:
**Overview** (2 sentences summarizing the deal)
**Risk Factors** (3 bullet points specific to this category)
**Compliance** (ERC-3643 KYC gate and regulatory considerations)
**Verdict** (1 sentence recommendation for institutional investors)

Be concise, institutional in tone, and focus on Web3 RWA-specific risks.`;

  const cgRes = await fetch("https://api.chaingpt.org/chat/stream", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      model: "general_assistant",
      chatHistory: "off",
    }),
  });

  if (!cgRes.ok || !cgRes.body) {
    return new Response("ChainGPT request failed", { status: 502 });
  }

  return new Response(cgRes.body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
