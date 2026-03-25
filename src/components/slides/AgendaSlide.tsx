"use client";

import { useStore } from "@/lib/store";

const PHASES = [
  {
    num: "I",
    title: "Ist-Analyse",
    desc: "Tagesablauf, Pain Points und Prozesse verstehen",
  },
  {
    num: "II",
    title: "KI-Input",
    desc: "Was ist heute mit Agenten möglich?",
  },
  {
    num: "III",
    title: "Use-Cases erarbeiten",
    desc: "Gemeinsam konkrete Anwendungsfälle identifizieren",
  },
  {
    num: "IV",
    title: "Roadmap & ROI",
    desc: "Umsetzungsplan und Return on Investment",
  },
  {
    num: "V",
    title: "Abschluss & Nächste Schritte",
    desc: "Zusammenfassung und konkreter Aktionsplan",
  },
];

export default function AgendaSlide() {
  const { data, setSlide } = useStore();

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[85vh] px-8">
      <div className="text-center mb-16">
        <img src="/sperr-zellner-logo.png" alt="Sperr & Zellner" className="h-40 mx-auto mb-6" />
        <p className="text-xl text-text-secondary">
          Workshop mit {data.ceoName}
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-5">
        {PHASES.map((phase, i) => (
          <button
            key={i}
            onClick={() => setSlide(i + 1)}
            className="w-full flex items-baseline gap-6 text-left transition-all hover:opacity-70 animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="text-lg font-semibold text-text-secondary w-8 shrink-0 text-right">
              {phase.num}
            </span>
            <div className="flex-1 border-b border-border pb-4">
              <span className="text-xl font-semibold text-text-primary">
                {phase.title}
              </span>
              <p className="text-base text-text-secondary mt-1">{phase.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
