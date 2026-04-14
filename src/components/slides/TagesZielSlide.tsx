"use client";

import { useState } from "react";

const GOALS = [
  {
    title: "Agent Harness",
    desc: "Die Infrastruktur, auf der KI-Agenten sicher laufen",
    hasModal: true,
  },
  {
    title: "System anlernen",
    desc: "Prozesse, Daten und Kontext von Sperr & Zellner einspielen",
    hasModal: false,
  },
  {
    title: "Pilot Use-Case definieren",
    desc: "Den ersten konkreten Anwendungsfall für den Produktiv-Start wählen",
    hasModal: false,
  },
];

export default function TagesZielSlide() {
  const [showHarness, setShowHarness] = useState(false);

  return (
    <div className="animate-fade-in flex flex-col items-center min-h-[80vh] px-8 pt-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary">
            Tagesziel definieren
          </h2>
        </div>

        <div className="space-y-5">
          {GOALS.map((goal, i) => {
            const Wrapper = goal.hasModal ? "button" : "div";
            return (
              <Wrapper
                key={i}
                onClick={goal.hasModal ? () => setShowHarness(true) : undefined}
                className={`w-full flex items-baseline gap-6 text-left animate-fade-in ${
                  goal.hasModal ? "cursor-pointer hover:opacity-70 transition-opacity" : ""
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-lg font-semibold text-text-secondary w-8 shrink-0 text-right">
                  {i + 1}
                </span>
                <div className="flex-1 border-b border-border pb-4">
                  <span className="text-xl font-semibold text-text-primary">
                    {goal.title}
                  </span>
                  <p className="text-base text-text-secondary mt-1">{goal.desc}</p>
                </div>
              </Wrapper>
            );
          })}
        </div>
      </div>

      {showHarness && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 animate-fade-in"
          onClick={() => setShowHarness(false)}
        >
          <div
            className="bg-bg-primary rounded-3xl p-8 md:p-12 max-w-5xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowHarness(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-bg-secondary transition-colors"
              aria-label="Schließen"
            >
              <svg className="w-6 h-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
              <div className="bg-white border border-border rounded-2xl p-8 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-text-primary mb-6">
                  Das Modell ist der Motor
                </h3>
                <img
                  src="/images/harness-engine.png"
                  alt="Engine illustration"
                  className="h-44 object-contain mb-6"
                />
                <p className="text-sm text-text-secondary leading-relaxed">
                  Erzeugt rohe Leistung und Antworten. Probabilistisch und
                  kraftvoll, aber ohne Kontrolle.
                </p>
              </div>

              <div className="hidden md:flex flex-col items-center text-text-secondary">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
                </svg>
              </div>
              <div className="flex md:hidden justify-center text-text-secondary rotate-90">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 12h15" />
                </svg>
              </div>

              <div className="bg-white border border-border rounded-2xl p-8 flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-text-primary mb-6">
                  Das Harness ist das Auto
                </h3>
                <img
                  src="/images/harness-car.png"
                  alt="Car frame illustration"
                  className="h-44 object-contain mb-6"
                />
                <p className="text-sm text-text-secondary leading-relaxed">
                  Bietet Lenkung, Bremsen und Struktur. Verwaltet Freigaben,
                  Dateisystemzugriff, Sub-Agenten und Fehler, um zuverlässig ans
                  Ziel zu kommen.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
