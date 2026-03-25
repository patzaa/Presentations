import { cookies } from "next/headers";

const USERS: Record<string, string> = {
  daniel: "daniel",
  michael: "michael",
};

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const user = username?.toLowerCase();

  if (!user || !USERS[user] || USERS[user] !== password) {
    return Response.json({ error: "Ungültige Anmeldedaten" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("session", user, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return Response.json({ ok: true, user });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return Response.json({ ok: true });
}
