import { adminUpdate } from "../../../lib/communityStore";

export const runtime = "nodejs";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid admin payload." }, { status: 400 });
  }

  try {
    const result = await adminUpdate(body);
    return Response.json(result);
  } catch (error) {
    const status = error.message === "Invalid admin key." ? 401 : 400;
    return Response.json({ ok: false, error: error.message }, { status });
  }
}
