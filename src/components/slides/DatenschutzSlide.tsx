"use client";

import { useState } from "react";

type Implementation = {
  provider: "Hetzner" | "Google Cloud";
  detail: string;
  documentUrl?: string;
  documentLabel?: string;
};

type Pillar = {
  title: string;
  article: string;
  quote: string;
  note: string;
  implementations: Implementation[];
};

const ADDITIONAL = [
  {
    title: "Art. 32 DSGVO — Sicherheit der Verarbeitung",
    desc: "TOMs: Verschlüsselung (TLS/At-Rest), Row-Level-Security, Zugriffskontrolle, Audit-Logs.",
  },
  {
    title: "Art. 25 DSGVO — Privacy by Design & by Default",
    desc: "Datenminimierung als Grundeinstellung — Agenten sehen nur das, was für ihre Aufgabe nötig ist.",
  },
  {
    title: "Art. 22 DSGVO — Automatisierte Einzelentscheidungen",
    desc: "Agenten treffen keine rechtlich bindenden Entscheidungen autonom — Human-in-the-Loop bei Kündigungen, Mahnungen, Verträgen.",
  },
  {
    title: "Art. 35 DSGVO — Datenschutz-Folgenabschätzung",
    desc: "DSFA für den KI-Einsatz bei Mieterdaten wird einmalig dokumentiert und mit Ihnen abgestimmt.",
  },
];

const PILLARS: Pillar[] = [
  {
    title: "Auftragsverarbeitungsvertrag (AVV)",
    article: "Art. 28 Abs. 3 DSGVO",
    quote:
      "Die Verarbeitung durch einen Auftragsverarbeiter erfolgt auf der Grundlage eines Vertrags […], der den Auftragsverarbeiter in Bezug auf den Verantwortlichen bindet und in dem Gegenstand und Dauer der Verarbeitung, Art und Zweck der Verarbeitung, die Art der personenbezogenen Daten, die Kategorien betroffener Personen und die Pflichten und Rechte des Verantwortlichen festgelegt sind.",
    note: "Jeder eingesetzte Dienstleister ist per AVV gebunden.",
    implementations: [
      {
        provider: "Hetzner",
        detail: "",
        documentUrl: "/legal/hetzner-dpa.pdf",
        documentLabel: "Unterzeichneten AVV ansehen (PDF)",
      },
      {
        provider: "Google Cloud",
        detail: "",
        documentUrl: "https://cloud.google.com/terms/data-processing-addendum",
        documentLabel: "Google Cloud DPA ansehen",
      },
    ],
  },
  {
    title: "Strikte EU-Datenverarbeitung",
    article: "Art. 44 DSGVO",
    quote:
      "Jedwede Übermittlung personenbezogener Daten […] an ein Drittland oder eine internationale Organisation ist nur zulässig, wenn der Verantwortliche und der Auftragsverarbeiter die in diesem Kapitel niedergelegten Bedingungen einhalten […].",
    note: "Hosting und LLM-Inference ausschließlich in der EU.",
    implementations: [
      {
        provider: "Hetzner",
        detail:
          "Server (VPS) läuft in Nürnberg. Daten verlassen die EU zu keinem Zeitpunkt.",
      },
      {
        provider: "Google Cloud",
        detail:
          "Vertex AI mit fest konfigurierter Region europe-west4 (Niederlande). Gemini-Inference läuft zwingend in der gewählten EU-Region — ohne Fallback in andere Regionen.",
      },
    ],
  },
  {
    title: "Keine Speicherung, kein Modelltraining",
    article: "Art. 5 Abs. 1 lit. b DSGVO — Zweckbindung",
    quote:
      "Personenbezogene Daten müssen für festgelegte, eindeutige und legitime Zwecke erhoben werden und dürfen nicht in einer mit diesen Zwecken nicht zu vereinbarenden Weise weiterverarbeitet werden.",
    note: "Zero-Retention: Prompts werden weder gespeichert noch zum Training verwendet.",
    implementations: [
      {
        provider: "Google Cloud",
        detail:
          "Vertex AI Enterprise Terms: Prompts und Antworten werden nicht zum Training der Foundation Models verwendet (vertraglich zugesichert). Caching deaktiviert, Zero-Data-Retention-Option aktiviert.",
      },
    ],
  },
];

export default function DatenschutzSlide() {
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);

  const toggle = (i: number) => {
    setFlipped((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <div className="animate-fade-in flex flex-col items-center min-h-[80vh] px-8 pt-4 pb-8">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-text-primary">Datenschutz</h2>
          <p className="text-xs text-text-secondary mt-2">
            Karten anklicken, um die konkrete Umsetzung zu sehen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {PILLARS.map((pillar, i) => (
            <div
              key={i}
              className="relative animate-fade-in"
              style={{
                animationDelay: `${i * 100}ms`,
                perspective: "1200px",
                height: "420px",
              }}
            >
              <div
                onClick={() => toggle(i)}
                className="relative w-full h-full cursor-pointer transition-transform duration-500"
                style={{
                  transformStyle: "preserve-3d",
                  transform: flipped[i] ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* FRONT */}
                <div
                  className="absolute inset-0 bg-bg-card border border-border rounded-2xl p-6 flex flex-col"
                  style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                >
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-accent-teal text-lg leading-none">✓</span>
                    <h3 className="text-base font-semibold text-text-primary leading-snug">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs font-medium text-accent-teal tracking-wide mb-2">
                    {pillar.article}
                  </p>
                  <blockquote className="text-xs text-text-secondary italic border-l-2 border-border pl-3 mb-3 leading-relaxed">
                    „{pillar.quote}"
                  </blockquote>
                  <p className="text-xs text-text-primary/80">{pillar.note}</p>
                  <p className="text-[10px] text-text-secondary/60 mt-auto pt-3 text-right">
                    Klicken für Umsetzung →
                  </p>
                </div>

                {/* BACK */}
                <div
                  className="absolute inset-0 bg-bg-card border border-accent-teal/40 rounded-2xl p-6 flex flex-col"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <div className="flex items-start gap-2 mb-4">
                    <h3 className="text-base font-semibold text-text-primary leading-snug">
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-xs font-medium text-accent-teal tracking-widest uppercase mb-3">
                    So setzen wir das um
                  </p>
                  <div className="space-y-4 flex-1">
                    {pillar.implementations.map((impl, j) => (
                      <div key={j}>
                        <p className="text-sm font-semibold text-text-primary mb-1">
                          {impl.provider}
                        </p>
                        {impl.detail && (
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {impl.detail}
                          </p>
                        )}
                        {impl.documentUrl && (
                          <a
                            href={impl.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs font-medium text-accent-teal hover:underline mt-1.5"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {impl.documentLabel ?? "Dokument ansehen"}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-secondary/60 mt-3 text-right">
                    ← Klicken zum Zurückdrehen
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="text-sm font-semibold text-text-secondary tracking-widest uppercase mb-4 text-center">
            Zusätzlich relevant
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADDITIONAL.map((item, i) => (
              <div
                key={i}
                className="flex items-baseline gap-3 animate-fade-in"
                style={{ animationDelay: `${(i + 3) * 100}ms` }}
              >
                <span className="text-accent-teal text-sm shrink-0">›</span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-secondary mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
