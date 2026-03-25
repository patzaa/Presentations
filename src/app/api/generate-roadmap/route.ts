import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  const client = new Anthropic();
  const { problems, useCases } = await request.json();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    messages: [
      {
        role: "user",
        content: `Du bist ein erfahrener KI-Strategieberater für Hausverwaltungen.

Erfasste Probleme:
${problems.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}

Erarbeitete Use-Cases:
${useCases.map((uc: { title: string; description: string; impact: number; effort: number; quadrant: string }) => `- ${uc.title} (Impact: ${uc.impact}/10, Aufwand: ${uc.effort}/10, Matrix: ${uc.quadrant}): ${uc.description}`).join("\n")}

Erstelle eine Umsetzungs-Roadmap und ROI-Schätzung. Antworte AUSSCHLIESSLICH mit einem JSON-Objekt:
{
  "roadmap": [
    {
      "phase": 1,
      "title": "Quick Wins",
      "timeline": "Monat 1-2",
      "useCases": ["Use-Case Name 1", "Use-Case Name 2"],
      "description": "Kurze Beschreibung was in dieser Phase passiert"
    },
    {
      "phase": 2,
      "title": "Mittelfristig",
      "timeline": "Monat 3-6",
      "useCases": ["Use-Case Name 3"],
      "description": "Beschreibung"
    },
    {
      "phase": 3,
      "title": "Langfristig",
      "timeline": "Monat 6-12",
      "useCases": ["Use-Case Name 4"],
      "description": "Beschreibung"
    }
  ],
  "roi": [
    {
      "useCase": "Use-Case Name",
      "currentTimePerWeek": "5 Stunden",
      "savedTimePerWeek": "4 Stunden",
      "automationLevel": "80%"
    }
  ]
}

Verteile die Use-Cases sinnvoll auf die 3 Phasen (Quick Wins zuerst). Schätze realistische Zeitersparnisse.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return Response.json({ error: "Failed to parse response" }, { status: 500 });
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return Response.json(parsed);
}
