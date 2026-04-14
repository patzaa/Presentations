"use client";

import { useState } from "react";

const STEPS = [
  {
    label: "E-Mail Eingang",
    title: "Eingang der Mieteranfrage",
    body: `Der Mieter schreibt eine E-Mail:

Von: h.mueller@email.de
Betreff: Heizung funktioniert nicht

Sehr geehrte Damen und Herren,
seit gestern Abend funktioniert die Heizung
in meiner Wohnung nicht mehr (Musterstr. 12,
Whg. 3). Bitte um schnelle Hilfe.
Mit freundlichen Grüßen, H. Müller`,
  },
  {
    label: "Reasoning",
    title: "Reasoning: E-Mail analysieren",
    body: "Der Agent liest die E-Mail und erkennt: Kategorie: Heizungsausfall | Priorität: hoch | Absender: h.mueller@email.de | Objekt: Musterstr. 12, Whg. 3. Die Knowledge Base sagt: Heizungsausfälle im Winter immer als Prio hoch einstufen.",
    tags: ["Kategorie: Heizungsausfall", "Priorität: hoch", "Absender identifiziert", "Objekt erkannt"],
  },
  {
    label: "Plan erstellen",
    title: "Plan erstellen: 3 Schritte sequentiell",
    body: `Plan:
  1. Mieter identifizieren  → idwell API aufrufen
  2. Service-Ticket anlegen  → idwell API aufrufen
  3. Antwort-E-Mail senden   → SMTP aufrufen

Abhängigkeiten:
  Schritt 2 braucht Kontakt-ID aus Schritt 1
  Schritt 3 braucht Ticket-Nr aus Schritt 2`,
  },
  {
    label: "Schritt 1: Mieter suchen",
    title: "Schritt 1: Mieter in idwell suchen",
    body: `GET /api/contacts?email=h.mueller@email.de
Authorization: Bearer eyJ...

→ Response: 200 OK
{
  "id": 4821,
  "name": "Hans Müller",
  "property_id": 892,
  "property": "Musterstr. 12",
  "unit": "Whg. 3"
}

Kontakt #4821 gefunden — diese ID braucht der Agent für Schritt 2.`,
  },
  {
    label: "Loop → Reasoning",
    title: "Loop: Ergebnis zurück ins Reasoning",
    body: `Plan-Status:
  1. Mieter identifizieren  → ERLEDIGT (ID: 4821)
  2. Service-Ticket anlegen  → NÄCHSTER SCHRITT
  3. Antwort-E-Mail senden   → OFFEN

Der Agent trägt die Kontakt-ID #4821 als Kontext für Schritt 2 mit.`,
  },
  {
    label: "Schritt 2: Ticket",
    title: "Schritt 2: Ticket in idwell anlegen",
    body: `POST /api/tickets
{
  "contact_id": 4821,        ← aus Schritt 1
  "property_id": 892,        ← aus Schritt 1
  "category": "Heizung",
  "priority": "high",
  "title": "Heizungsausfall Whg. 3",
  "description": "Totalausfall seit gestern Abend"
}

→ Response: 201 Created
→ Ticket #7293 angelegt`,
  },
  {
    label: "Loop → Reasoning",
    title: "Loop: Ergebnis zurück ins Reasoning",
    body: `Plan-Status:
  1. Mieter identifizieren  → ERLEDIGT (ID: 4821)
  2. Service-Ticket anlegen  → ERLEDIGT (Ticket #7293)
  3. Antwort-E-Mail senden   → NÄCHSTER SCHRITT

Noch ein Schritt offen. Der Agent nimmt die Ticket-Nummer #7293 mit in den letzten Schritt.`,
  },
  {
    label: "Schritt 3: E-Mail",
    title: "Schritt 3: Antwort-E-Mail senden",
    body: `An: h.mueller@email.de
Betreff: Re: Heizung funktioniert nicht

Sehr geehrter Herr Müller,

vielen Dank für Ihre Nachricht. Wir haben
Ihren Heizungsausfall erfasst (Ticket #7293)
und bereits unseren Servicepartner informiert.
Sie werden sich kurzfristig mit Ihnen in
Verbindung setzen.

Mit freundlichen Grüßen
Ihre SZ Hausverwaltung

Gesamtdauer: ~8 Sekunden | 3 Tool-Aufrufe | 2 Loops`,
  },
];

export default function AgentHeizungDiagram() {
  const [step, setStep] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const opacity = (i: number) => (showAll ? 1 : i <= step ? 1 : 0.15);

  return (
    <div>
      {/* Step buttons */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {STEPS.map((s, i) => (
          <button
            key={i}
            onClick={() => { setStep(i); setShowAll(false); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              !showAll && step === i
                ? "bg-text-primary text-bg-primary"
                : "bg-bg-secondary text-text-primary hover:bg-border"
            }`}
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={() => setShowAll(true)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showAll
              ? "bg-text-primary text-bg-primary"
              : "bg-bg-secondary text-text-primary hover:bg-border"
          }`}
        >
          Alles zeigen
        </button>
      </div>

      <div className="flex gap-4">
      {/* Context box — left side */}
      <div className="w-64 shrink-0">
        <div className="bg-bg-card rounded-xl border border-border p-4 sticky top-4">
          <h4 className="font-medium text-sm text-text-primary mb-2">
            {showAll ? "Kompletter Ablauf — 3 Schritte, 2 Loops, 8 Sekunden" : STEPS[step].title}
          </h4>
          <div className="text-text-secondary leading-relaxed whitespace-pre-wrap font-mono text-xs bg-bg-secondary rounded-lg p-3">
            {showAll
              ? "Der Agent hat autonom einen 3-Schritte-Plan erstellt und sequentiell abgearbeitet. Nach jedem Schritt ging er zurück ins Reasoning. Jeder Schritt baut auf dem vorherigen auf.\n\n8 Sekunden statt 15–20 Minuten manuell."
              : STEPS[step].body}
          </div>
        </div>
      </div>

      {/* Diagram — right side */}
      <div className="flex-1 min-w-0">
      <svg width="100%" viewBox="0 0 680 700">
        <defs>
          <marker id="ah-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>

        {/* Step 0: Email */}
        <g opacity={opacity(0)}>
          <text x="40" y="28" fontSize="11" fill="#6B6965">Mieter schreibt E-Mail</text>
          <rect x="40" y="38" width="180" height="56" rx="8" fill="#F1EFE8" stroke="#5F5E5A" strokeWidth="0.5" />
          <image href="/sperr-zellner-logo.png" x="48" y="46" width="36" height="36" preserveAspectRatio="xMidYMid meet" />
          <text x="145" y="56" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">Heizung defekt</text>
          <text x="145" y="76" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">Musterstr. 12, Whg. 3</text>
          <line x1="220" y1="66" x2="268" y2="66" stroke="#5F5E5A" strokeWidth="1.5" markerEnd="url(#ah-arrow)" />
        </g>

        {/* Step 1: Reasoning */}
        <g opacity={opacity(1)}>
          <rect x="280" y="26" width="220" height="80" rx="16" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5" />
          <text x="390" y="52" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">LLM Reasoning</text>
          <text x="390" y="72" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">Analysieren + Plan erstellen</text>
          <circle cx="304" cy="46" r="4" fill="#7F77DD" className="animate-pulse-dot" />
          <circle cx="470" cy="50" r="3" fill="#AFA9EC" className="animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
        </g>

        {/* Step 2: Plan */}
        <g opacity={opacity(2)}>
          <path d="M390 106 L390 134" fill="none" stroke="#534AB7" strokeWidth="1.5" markerEnd="url(#ah-arrow)" />
          <text x="390" y="130" textAnchor="middle" fontSize="11" fill="#6B6965">Plan</text>
          <rect x="124" y="142" width="532" height="44" rx="8" fill="none" stroke="#534AB7" strokeWidth="0.5" strokeDasharray="4 3" opacity="0.6" />
          {[
            { x: 132, label: "1. Mieter identifizieren" },
            { x: 316, label: "2. Ticket anlegen" },
            { x: 500, label: "3. E-Mail senden" },
          ].map((p, i) => (
            <g key={i}>
              <rect x={p.x} y="150" width={i === 2 ? 148 : 160} height="28" rx="6" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5" />
              <text x={p.x + (i === 2 ? 74 : 80)} y="164" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">{p.label}</text>
              {i < 2 && (
                <line x1={p.x + (i === 2 ? 148 : 160)} y1="164" x2={p.x + (i === 2 ? 148 : 160) + 18} y2="164" stroke="#534AB7" strokeWidth="1" markerEnd="url(#ah-arrow)" />
              )}
            </g>
          ))}
        </g>

        {/* Step 3: Tool call 1 */}
        <g opacity={opacity(3)}>
          <path d="M212 186 L212 218" fill="none" stroke="#534AB7" strokeWidth="1" markerEnd="url(#ah-arrow)" />
          <text x="124" y="216" fontSize="11" fill="#6B6965">Schritt 1 ausführen</text>
          <rect x="124" y="228" width="240" height="56" rx="8" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5" />
          <text x="244" y="246" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">Tool: idwell API</text>
          <text x="244" y="268" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">GET /contacts?email=h.mueller...</text>
          <line x1="364" y1="256" x2="420" y2="256" stroke="#0F6E56" strokeWidth="1" markerEnd="url(#ah-arrow)" />
          <rect x="428" y="236" width="210" height="40" rx="8" fill="#FAECE7" stroke="#993C1D" strokeWidth="0.5" />
          <text x="533" y="256" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">Kontakt #4821, Objekt #892</text>
        </g>

        {/* Step 4: Loop back 1 */}
        <g opacity={opacity(4)}>
          <path d="M244 284 L244 310 Q 244 320 254 320 L380 320 Q 390 320 390 330 L390 342" fill="none" stroke="#D85A30" strokeWidth="1" strokeDasharray="5 3" markerEnd="url(#ah-arrow)" />
          <text x="324" y="314" textAnchor="middle" fontSize="11" fill="#6B6965">Ergebnis zurück ins Reasoning</text>
          <rect x="300" y="350" width="180" height="44" rx="12" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5" />
          <text x="390" y="364" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">LLM Reasoning</text>
          <text x="390" y="382" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">Schritt 1 erledigt → weiter</text>
        </g>

        {/* Step 5: Tool call 2 */}
        <g opacity={opacity(5)}>
          <path d="M396 394 L396 420" fill="none" stroke="#534AB7" strokeWidth="1" markerEnd="url(#ah-arrow)" />
          <text x="124" y="436" fontSize="11" fill="#6B6965">Schritt 2 ausführen</text>
          <rect x="124" y="446" width="240" height="56" rx="8" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5" />
          <text x="244" y="464" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">Tool: idwell API</text>
          <text x="244" y="484" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">{"POST /tickets {heizung, prio:hoch}"}</text>
          <line x1="364" y1="474" x2="420" y2="474" stroke="#0F6E56" strokeWidth="1" markerEnd="url(#ah-arrow)" />
          <rect x="428" y="454" width="210" height="40" rx="8" fill="#FAECE7" stroke="#993C1D" strokeWidth="0.5" />
          <text x="533" y="474" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">Ticket #7293 angelegt</text>
        </g>

        {/* Step 6: Loop back 2 */}
        <g opacity={opacity(6)}>
          <path d="M244 502 L244 524 Q 244 534 254 534 L380 534 Q 390 534 390 544 L390 552" fill="none" stroke="#D85A30" strokeWidth="1" strokeDasharray="5 3" markerEnd="url(#ah-arrow)" />
          <text x="324" y="530" textAnchor="middle" fontSize="11" fill="#6B6965">Ergebnis zurück</text>
          <rect x="300" y="560" width="180" height="44" rx="12" fill="#EEEDFE" stroke="#534AB7" strokeWidth="0.5" />
          <text x="390" y="574" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">LLM Reasoning</text>
          <text x="390" y="592" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">Schritt 2 erledigt → weiter</text>
        </g>

        {/* Step 7: Tool call 3 + done */}
        <g opacity={opacity(7)}>
          <path d="M396 604 L396 628" fill="none" stroke="#534AB7" strokeWidth="1" markerEnd="url(#ah-arrow)" />
          <text x="124" y="646" fontSize="11" fill="#6B6965">Schritt 3 ausführen</text>
          <rect x="124" y="656" width="240" height="40" rx="8" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5" />
          <text x="244" y="676" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">Tool: E-Mail senden</text>
          <line x1="364" y1="676" x2="420" y2="676" stroke="#0F6E56" strokeWidth="1" markerEnd="url(#ah-arrow)" />
          <rect x="428" y="660" width="120" height="32" rx="8" fill="#E1F5EE" stroke="#0F6E56" strokeWidth="0.5" />
          <text x="488" y="676" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">Gesendet</text>
          <line x1="548" y1="676" x2="576" y2="676" stroke="#0F6E56" strokeWidth="1" markerEnd="url(#ah-arrow)" />
          <rect x="582" y="660" width="78" height="32" rx="8" fill="#F1EFE8" stroke="#5F5E5A" strokeWidth="0.5" />
          <text x="621" y="676" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">Fertig</text>
        </g>
      </svg>
      </div>
      </div>
    </div>
  );
}
