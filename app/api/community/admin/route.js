import { adminUpdate, getAdminDashboard } from "../../../lib/communityStore";

export const runtime = "nodejs";

export async function GET(request) {
  const url = new URL(request.url);
  const actorAddress = url.searchParams.get("actorAddress") || "";
  const adminKey = url.searchParams.get("adminKey") || "";

  try {
    const dashboard = await getAdminDashboard({ actorAddress, adminKey });
    return Response.json(dashboard);
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 403 });
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid admin payload." }, { status: 400 });
  }

  try {
    const result = await adminUpdate(body);
    const dashboard = await getAdminDashboard({ actorAddress: body.actorAddress, adminKey: body.adminKey }).catch(() => null);
    return Response.json({ ...result, dashboard });
  } catch (error) {
    const status = error.message.includes("access denied") ? 403 : 400;
    return Response.json({ ok: false, error: error.message }, { status });
  }
}
