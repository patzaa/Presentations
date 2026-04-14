import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  const client = new Anthropic();
  const { companyName, ceoName, istAnalyse, useCases, roadmap, roi } = await request.json();

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `Du bist ein erfahrener KI-Berater und erstellst eine Workshop-Zusammenfassung.

Unternehmen: ${companyName} (Hausverwaltung)
Ansprechpartner: ${ceoName}

Ist-Analyse:
${istAnalyse.map((q: { question: string; answer: string }) => `- ${q.question}: ${q.answer}`).join("\n")}

Erarbeitete Use-Cases:
${useCases.map((uc: { title: string; description: string; impact: number; effort: number }) => `- ${uc.title} (Impact: ${uc.impact}/10, Aufwand: ${uc.effort}/10): ${uc.description}`).join("\n")}

Roadmap:
${roadmap.map((p: { phase: number; title: string; timeline: string; description: string }) => `Phase ${p.phase} (${p.timeline}): ${p.title} - ${p.description}`).join("\n")}

ROI:
${roi.map((r: { useCase: string; currentTimePerWeek: string; savedTimePerWeek: string }) => `- ${r.useCase}: ${r.currentTimePerWeek} aktuell, ${r.savedTimePerWeek} Ersparnis`).join("\n")}

Antworte AUSSCHLIESSLICH mit einem JSON-Objekt:
{
  "summary": "3-5 Absätze Zusammenfassung des Workshops. Was wurde besprochen, welche Kernerkenntnisse, welcher Mehrwert.",
  "nextSteps": [
    "Detailkonzept für den ausgewählten PoC-Workflow erstellen",
    "Konkrete Beispiele und Referenzen für ähnliche Automatisierungen zusenden",
    "Funktionierenden Test-Workflow innerhalb von 1-2 Wochen präsentieren"
  ]
}

Die Zusammenfassung soll professionell, aber verständlich sein. Die nächsten Schritte sind IMMER genau diese drei — nicht ändern, nicht erweitern. Wichtig: Der Ansprechpartner arbeitet alleine (kein Team), formuliere die Zusammenfassung entsprechend für eine Einzelperson.`,
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
