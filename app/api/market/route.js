import { NextResponse } from "next/server";
import { getDexMarket } from "../../lib/dexscreener";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Request body must be valid JSON." }, { status: 400 });
  }

  const report = await getDexMarket(body);
  return NextResponse.json(report, { status: report.status || (report.ok ? 200 : 400) });
}
