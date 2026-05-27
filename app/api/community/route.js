import { getCommunitySnapshot } from "../../lib/communityStore";

export const runtime = "nodejs";

export async function GET(request) {
  const url = new URL(request.url);
  const target = url.searchParams.get("target") || "";
  const address = url.searchParams.get("address") || "";
  const snapshot = await getCommunitySnapshot(target, address);
  return Response.json(snapshot);
}
