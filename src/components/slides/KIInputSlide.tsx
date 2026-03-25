"use client";

import { useState } from "react";
import AgentGenericDiagram from "@/components/diagrams/AgentGenericDiagram";
import AgentHeizungDiagram from "@/components/diagrams/AgentHeizungDiagram";

export default function KIInputSlide() {
  const [tab, setTab] = useState<"generic" | "specific">("generic");

  return (
    <div className="animate-fade-in flex flex-col items-center min-h-[80vh] px-8 pt-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-accent-teal tracking-widest uppercase mb-2">
            Phase II
          </p>
          <h2 className="text-3xl font-bold text-text-primary">
            Was ist heute mit Agenten möglich?
          </h2>
          <p className="text-text-secondary mt-2">
            KI-Agenten: Autonome digitale Mitarbeiter
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          <button
            onClick={() => setTab("generic")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === "generic"
                ? "bg-text-primary text-white shadow-md"
                : "bg-bg-secondary text-text-secondary hover:bg-border"
            }`}
          >
            Wie KI-Agenten funktionieren
          </button>
          <button
            onClick={() => setTab("specific")}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              tab === "specific"
                ? "bg-text-primary text-white shadow-md"
                : "bg-bg-secondary text-text-secondary hover:bg-border"
            }`}
          >
            Beispiel: Heizungsausfall bei SZ
          </button>
        </div>

        {/* Diagram */}
        <div className="bg-bg-card rounded-2xl border border-border p-6 shadow-sm">
          {tab === "generic" ? (
            <AgentGenericDiagram />
          ) : (
            <AgentHeizungDiagram />
          )}
        </div>
      </div>
    </div>
  );
}
