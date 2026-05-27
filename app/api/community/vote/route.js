import { castCommunityVote } from "../../../lib/communityStore";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid vote payload." }, { status: 400 });
  }

  try {
    const result = await castCommunityVote(body);
    return Response.json(result);
  } catch (error) {
    return Response.json({ ok: false, error: error.message }, { status: 400 });
  }
}
