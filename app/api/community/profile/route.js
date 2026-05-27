import { getCommunitySnapshot, upsertProfile } from "../../../lib/communityStore";

export const runtime = "nodejs";

export async function GET(request) {
  const url = new URL(request.url);
  const address = url.searchParams.get("address") || "";
  const target = url.searchParams.get("target") || "";
  const snapshot = await getCommunitySnapshot(target, address);
  return Response.json({ ok: true, profile: snapshot.profile });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid profile payload." }, { status: 400 });
  }

  try {
    const result = await upsertProfile(body);
    return Response.json(result);
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 400 });
  }
}
