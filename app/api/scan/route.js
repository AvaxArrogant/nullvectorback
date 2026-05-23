import { NextResponse } from "next/server";
import { scanContract } from "../../lib/scanner";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Request body must be valid JSON." }, { status: 400 });
  }

  try {
    const report = await scanContract(body);
    return NextResponse.json(report, { status: report.status || (report.ok ? 200 : 400) });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: "Scan failed before a report could be produced.",
      detail: error.message,
    }, { status: 500 });
  }
}
