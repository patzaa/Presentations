import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  const client = new Anthropic();
  const { problems } = await request.json();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Du bist ein erfahrener Use-Case Consultant für KI-Automatisierung in der Hausverwaltung.

Dir wurden die folgenden Probleme/Pain Points einer Hausverwaltung genannt:

${problems}

Erstelle daraus 5-6 konkrete Use-Cases für KI-Automatisierung. Das Unternehmen nutzt idwell als Property Management Software.

Antworte AUSSCHLIESSLICH mit einem JSON-Objekt in diesem Format (keine Erklärungen, kein Markdown):
{
  "useCases": [
    {
      "title": "Kurzer Titel (max 5 Wörter)",
      "shortCode": "2-3 Buchstaben Kürzel (z.B. EM, TK, RE)",
      "description": "2-3 Sätze Beschreibung was der Use-Case macht",
      "impact": 7,
      "effort": 3
    }
  ]
}

Impact und Effort sind Werte von 1-10. Denke an Use-Cases wie: automatische E-Mail-Triage, Ticket-Erstellung, Mieteranfragen-Bot, Dokumenten-Verarbeitung, Wartungsplanung, Reporting etc.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return Response.json({ error: "Failed to parse response" }, { status: 500 });
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return Response.json(parsed);
}
