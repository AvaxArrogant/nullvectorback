import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "PulseShield scan backend",
    checks: {
      scanApi: "/api/scan",
      pulsechainRpcConfigured: Boolean(process.env.PULSECHAIN_RPC_URL) || true,
      explorerOverride: process.env.PULSECHAIN_EXPLORER_API || "default",
    },
    generatedAt: new Date().toISOString(),
  });
}
