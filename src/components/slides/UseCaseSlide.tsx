"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useStore } from "@/lib/store";
import UseCaseMatrix from "@/components/UseCaseMatrix";
import { UseCase } from "@/lib/types";

const COLORS = ["#534AB7", "#D85A30", "#0F6E56", "#B8860B", "#8B4513", "#6A0DAD"];

export default function UseCaseSlide() {
  const { data, setUseCases } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const problems = data.istAnalyse
    .filter((q) => q.answer.trim())
    .map((q) => `${q.question}\nAntwort: ${q.answer}`)
    .join("\n\n");

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-usecases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problems }),
      });
      if (!res.ok) throw new Error("API Fehler");
      const result = await res.json();
      const cases: UseCase[] = result.useCases.map(
        (uc: { title: string; shortCode: string; description: string; impact: number; effort: number }, i: number) => ({
          id: `uc-${i}`,
          title: uc.title,
          shortCode: uc.shortCode,
          description: uc.description,
          impact: 0,
          effort: 0,
          matrixX: 0.06 + (i % 3) * 0.1,
          matrixY: 0.06 + Math.floor(i / 3) * 0.1,
          color: COLORS[i % COLORS.length],
          selectedForPoc: false,
          roiParams: { anfragen: 100, minuten: 15, stunde: 55, auto: 65, setup: 2500, monat: 80 },
        })
      );
      setUseCases(cases);
    } catch {
      setError("Fehler bei der Generierung. Bitte nochmal versuchen.");
    } finally {
      setLoading(false);
    }
  }, [problems, setUseCases]);

  // Auto-generate use cases when slide mounts and none exist yet
  const autoTriggered = useRef(false);
  useEffect(() => {
    if (!autoTriggered.current && data.useCases.length === 0 && problems) {
      autoTriggered.current = true;
      handleGenerate();
    }
  }, [data.useCases.length, problems, handleGenerate]);

  return (
    <div className="animate-fade-in flex flex-col items-center min-h-[80vh] px-8 pt-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-accent-amber tracking-widest uppercase mb-2">
            Phase III
          </p>
          <h2 className="text-3xl font-bold text-text-primary">
            Use-Cases erarbeiten
          </h2>
          <p className="text-text-secondary mt-2">
            Aus Ihren Pain Points werden konkrete KI-Anwendungsfälle
          </p>
        </div>

        {data.useCases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            {problems ? (
              <>
                <div className="bg-bg-card rounded-xl border border-border p-6 max-w-lg w-full mb-6">
                  <h4 className="font-medium text-sm text-text-secondary mb-3 uppercase tracking-wider">
                    Erfasste Probleme aus der Ist-Analyse
                  </h4>
                  <div className="space-y-2">
                    {data.istAnalyse
                      .filter((q) => q.answer.trim())
                      .map((q, i) => (
                        <div key={i} className="text-sm text-text-primary bg-bg-secondary rounded-lg p-3">
                          <span className="text-accent-purple font-medium">{i + 1}.</span>{" "}
                          {q.answer}
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-8 py-3.5 rounded-xl bg-accent-amber text-white font-medium text-base
                    hover:opacity-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed
                    shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Use-Cases werden destilliert...
                    </span>
                  ) : (
                    "Use-Cases generieren"
                  )}
                </button>
                {error && (
                  <p className="mt-3 text-sm text-accent-coral">{error}</p>
                )}
              </>
            ) : (
              <div className="text-center text-text-secondary">
                <p className="text-lg mb-2">Noch keine Probleme erfasst</p>
                <p className="text-sm">
                  Bitte füllen Sie zuerst die Ist-Analyse aus.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <UseCaseMatrix useCases={data.useCases} />
          </div>
        )}
      </div>
    </div>
  );
}
