import { NextResponse } from "next/server";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "PulseShield scan backend",
    checks: {
      scanApi: "/api/scan",
      marketApi: "/api/market",
      communityApi: "/api/community",
      feedbackApi: "/api/feedback",
      pulsechainRpcConfigured: Boolean(process.env.PULSECHAIN_RPC_URL) || true,
      explorerOverride: process.env.PULSECHAIN_EXPLORER_API || "default",
      communityStore: process.env.PULSESHIELD_DATA_DIR || ".data",
      adminConfigured: Boolean(process.env.PULSESHIELD_ADMIN_KEY),
    },
    generatedAt: new Date().toISOString(),
  });
}
