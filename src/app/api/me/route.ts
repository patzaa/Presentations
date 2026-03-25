import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) {
    return Response.json({ user: null }, { status: 401 });
  }
  return Response.json({ user: session.value });
}
