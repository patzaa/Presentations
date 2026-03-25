export async function GET() {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "YOUR_GEMINI_API_KEY_HERE") {
    return Response.json(
      { error: "GEMINI_API_KEY not configured in .env.local" },
      { status: 500 }
    );
  }
  return Response.json({ key });
}
