"use client";

import { useState } from "react";

const STEPS: { label: string; desc: string; tx: number; ty: number; anchor: "start" | "middle" | "end" }[] = [
  {
    label: "Input",
    desc: 'Der Nutzer gibt dem Agenten eine Aufgabe — z.B.: „Ordne diese Mieteranfrage dem richtigen Objekt zu und erstelle ein Ticket."',
    // tooltip position relative to SVG viewBox
    tx: 175, ty: 80, anchor: "start" as const,
  },
  {
    label: "Reason",
    desc: "Das LLM — das Gehirn des Agenten — analysiert den Input, zerlegt die Aufgabe in Schritte und entscheidet, was als Nächstes zu tun ist.",
    tx: 465, ty: 45, anchor: "start" as const,
  },
  {
    label: "Decide",
    desc: "Basierend auf seinem Reasoning wählt der Agent eine konkrete nächste Aktion. Soll er Daten suchen? Eine API aufrufen? Eine Nachricht senden?",
    tx: 425, ty: 160, anchor: "start" as const,
  },
  {
    label: "Tools",
    desc: "Der Agent führt das gewählte Tool aus — API abfragen, Dokument lesen, E-Mail senden oder Berechnung ausführen.",
    tx: 20, ty: 325, anchor: "start" as const,
  },
  {
    label: "Observe",
    desc: "Der Agent beobachtet, was vom Tool zurückkam. Hat die API das richtige Objekt gefunden? Das Ergebnis fließt zurück ins Reasoning.",
    tx: 450, ty: 375, anchor: "start" as const,
  },
  {
    label: "Loop",
    desc: "Wenn die Aufgabe noch nicht erledigt ist, geht der Agent zurück ins Reasoning mit neuem Kontext.",
    tx: 20, ty: 280, anchor: "start" as const,
  },
  {
    label: "Answer",
    desc: "Sobald der Agent feststellt, dass die Aufgabe vollständig erledigt ist, verlässt er die Schleife und liefert eine finale Antwort.",
    tx: 450, ty: 340, anchor: "start" as const,
  },
];

export default function AgentGenericDiagram() {
  const [step, setStep] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const opacity = (i: number) =>
    showAll ? 1 : step !== null && i <= step ? 1 : 0.15;

  const click = (i: number) => {
    if (step === i) {
      setStep(null);
      setShowAll(true);
    } else {
      setStep(i);
      setShowAll(false);
    }
  };

  return (
    <div>
      <svg width="100%" viewBox="0 0 700 500" className="mb-4">
        <defs>
          <marker id="ag-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
          <filter id="tooltip-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Step 0: User input */}
        <g opacity={opacity(0)} onClick={() => click(0)} className="cursor-pointer">
          <text x="40" y="32" fontSize="11" fill="#6B6965">User input</text>
          <rect x="40" y="42" width="130" height="36" rx="8" fill="#F1EFE8" stroke={step === 0 ? "#2D2B28" : "#5F5E5A"} strokeWidth={step === 0 ? "1.5" : "0.5"} />
          <text x="105" y="60" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">Task / prompt</text>
          <line x1="170" y1="60" x2="208" y2="60" stroke="#5F5E5A" strokeWidth="1.5" markerEnd="url(#ag-arrow)" />
        </g>

        {/* Step 1: LLM reasoning */}
        <g opacity={opacity(1)} onClick={() => click(1)} className="cursor-pointer">
          <rect x="220" y="20" width="240" height="80" rx="16" fill="#EEEDFE" stroke={step === 1 ? "#2D2B28" : "#534AB7"} strokeWidth={step === 1 ? "1.5" : "0.5"} />
          <text x="340" y="48" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">LLM reasoning</text>
          <text x="340" y="68" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">Analyse, plan, decide</text>
          <circle cx="244" cy="40" r="4" fill="#7F77DD" className="animate-pulse-dot" />
          <circle cx="260" cy="56" r="3" fill="#AFA9EC" className="animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
          <circle cx="430" cy="44" r="3.5" fill="#7F77DD" className="animate-pulse-dot" style={{ animationDelay: "0.8s" }} />
        </g>

        {/* Step 2: Pick action */}
        <g opacity={opacity(2)} onClick={() => click(2)} className="cursor-pointer">
          <path d="M340 100 L340 140" fill="none" stroke="#534AB7" strokeWidth="1.5" markerEnd="url(#ag-arrow)" />
          <rect x="270" y="148" width="140" height="44" rx="8" fill="#E1F5EE" stroke={step === 2 ? "#2D2B28" : "#0F6E56"} strokeWidth={step === 2 ? "1.5" : "0.5"} />
          <text x="340" y="170" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">Pick action</text>
        </g>

        {/* Step 3: Tools */}
        <g opacity={opacity(3)} onClick={() => click(3)} className="cursor-pointer">
          <path d="M340 192 L340 230" fill="none" stroke="#0F6E56" strokeWidth="1.5" markerEnd="url(#ag-arrow)" />
          <rect x="30" y="226" width="620" height="78" rx="12" fill="none" stroke={step === 3 ? "#2D2B28" : "#5F5E5A"} strokeWidth={step === 3 ? "1.5" : "0.5"} strokeDasharray="4 3" opacity={step === 3 ? "1" : "0.3"} />
          <text x="640" y="220" textAnchor="end" fontSize="11" fill="#6B6965">Tools / Skills</text>
          {[
            { x: 40, label: "Search / API", sub: "Fetch live data" },
            { x: 190, label: "Read / write", sub: "CRM, database" },
            { x: 340, label: "Send message", sub: "E-mail, chat" },
            { x: 490, label: "Code / calculate", sub: "Run scripts" },
          ].map((t, i) => (
            <g key={i}>
              <rect x={t.x} y="238" width={i === 3 ? 150 : 130} height="56" rx="8" fill="#F1EFE8" stroke="#5F5E5A" strokeWidth="0.5" />
              <text x={t.x + (i === 3 ? 75 : 65)} y="256" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">{t.label}</text>
              <text x={t.x + (i === 3 ? 75 : 65)} y="274" textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#6B6965">{t.sub}</text>
            </g>
          ))}
        </g>

        {/* Step 4: Observe */}
        <g opacity={opacity(4)} onClick={() => click(4)} className="cursor-pointer">
          <path d="M340 316 L340 356" fill="none" stroke="#0F6E56" strokeWidth="1.5" markerEnd="url(#ag-arrow)" />
          <rect x="245" y="362" width="190" height="44" rx="8" fill="#FAECE7" stroke={step === 4 ? "#2D2B28" : "#993C1D"} strokeWidth={step === 4 ? "1.5" : "0.5"} />
          <text x="340" y="384" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">Observe result</text>
        </g>

        {/* Step 5: Loop */}
        <g opacity={opacity(5)} onClick={() => click(5)} className="cursor-pointer">
          <path d="M245 384 Q 180 384 180 340 Q 180 130 220 60" fill="none" stroke="#D85A30" strokeWidth={step === 5 ? "2.5" : "1.5"} strokeDasharray="6 4" markerEnd="url(#ag-arrow)" />
          <text x="160" y="210" textAnchor="end" fontSize="11" fill="#6B6965">Loop until done</text>
        </g>

        {/* Step 6: Final answer */}
        <g opacity={opacity(6)} onClick={() => click(6)} className="cursor-pointer">
          <path d="M435 384 L530 384" fill="none" stroke="#0F6E56" strokeWidth="1.5" markerEnd="url(#ag-arrow)" />
          <text x="488" y="374" textAnchor="middle" fontSize="11" fill="#6B6965">Done?</text>
          <rect x="538" y="362" width="120" height="44" rx="8" fill="#E1F5EE" stroke={step === 6 ? "#2D2B28" : "#0F6E56"} strokeWidth={step === 6 ? "1.5" : "0.5"} />
          <text x="598" y="384" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="500" fill="#2D2B28">Final answer</text>
        </g>

        {/* Tooltip bubble */}
        {step !== null && !showAll && (() => {
          const idx = step as number;
          const s = STEPS[idx];
          const bw = 220;
          const lines: string[] = [];
          const words = s.desc.split(" ");
          let line = "";
          for (const w of words) {
            const test = line ? line + " " + w : w;
            if (test.length > 35) {
              lines.push(line);
              line = w;
            } else {
              line = test;
            }
          }
          if (line) lines.push(line);
          const bh = 16 + lines.length * 18;
          let bx = s.anchor === "start" ? s.tx : s.anchor === "middle" ? s.tx - bw / 2 : s.tx - bw;
          bx = Math.max(5, Math.min(bx, 700 - bw - 5));
          const by = s.ty;
          return (
            <g>
              <rect x={bx} y={by} width={bw} height={bh} rx="8" fill="#FFFFFF" stroke="#E0DDD6" strokeWidth="1" filter="url(#tooltip-shadow)" />
              {lines.map((l, i) => (
                <text key={i} x={bx + 12} y={by + 18 + i * 18} fontSize="12" fill="#4A4845">{l}</text>
              ))}
            </g>
          );
        })()}

      </svg>
    </div>
  );
}
