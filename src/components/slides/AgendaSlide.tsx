"use client";

import { useStore } from "@/lib/store";

const PHASES = [
  {
    num: "I",
    title: "Tagesziel definieren",
    desc: "Was wollen wir heute gemeinsam erreichen?",
    slide: 1,
  },
  {
    num: "II",
    title: "Systemarchitektur",
    desc: "Überblick über die Komponenten der KI-Lösung",
    slide: 2,
  },
  {
    num: "III",
    title: "Funktionsweise KI-Agent",
    desc: "Wie arbeitet der Agent im Hintergrund?",
    slide: 3,
  },
  {
    num: "IV",
    title: "Datenschutz",
    desc: "DSGVO, Datenhaltung und Vertraulichkeit",
    slide: 4,
  },
  {
    num: "V",
    title: "Ist-Analyse",
    desc: "Tagesablauf, Pain Points und Prozesse verstehen",
    slide: 5,
  },
  {
    num: "VI",
    title: "Pilot Use-Cases",
    desc: "Konkrete Anwendungsfälle für den Einstieg",
    slide: 6,
  },
  {
    num: "VII",
    title: "Roadmap & ROI",
    desc: "Umsetzungsplan und Return on Investment",
    slide: 7,
  },
  {
    num: "VIII",
    title: "Abschluss",
    desc: "Zusammenfassung und nächste Schritte",
    slide: 8,
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
            onClick={() => setSlide(phase.slide)}
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
