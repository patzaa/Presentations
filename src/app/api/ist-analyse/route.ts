import pool from "@/lib/db";

const SESSION_ID = "default";

// Load all answers
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT question_index, question, answer FROM ist_analyse WHERE session_id = $1 ORDER BY question_index",
      [SESSION_ID]
    );
    return Response.json({ answers: result.rows });
  } catch (e) {
    console.error("DB read error:", e);
    return Response.json({ answers: [] });
  }
}

// Save/update a single answer
export async function POST(request: Request) {
  try {
    const { questionIndex, question, answer } = await request.json();
    await pool.query(
      `INSERT INTO ist_analyse (session_id, question_index, question, answer, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (session_id, question_index)
       DO UPDATE SET answer = $4, updated_at = NOW()`,
      [SESSION_ID, questionIndex, question, answer]
    );
    return Response.json({ ok: true });
  } catch (e) {
    console.error("DB write error:", e);
    return Response.json({ error: "DB write failed" }, { status: 500 });
  }
}
