"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { UseCase } from "@/lib/types";
import { useStore } from "@/lib/store";

const COLORS = [
  "#534AB7", // purple
  "#D85A30", // coral
  "#0F6E56", // teal
  "#B8860B", // amber
  "#8B4513", // brown
  "#6A0DAD", // violet
];

interface Props {
  useCases: UseCase[];
}

export default function UseCaseMatrix({ useCases }: Props) {
  const { updateUseCasePosition } = useStore();
  const matrixRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [showLabels, setShowLabels] = useState(false);

  const handleMouseDown = useCallback((id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(id);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !matrixRef.current) return;
      const rect = matrixRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
      updateUseCasePosition(dragging, x, y);
    },
    [dragging, updateUseCasePosition]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  const selectedUC = useCases.find((uc) => uc.id === selected);

  return (
    <div className="flex gap-6">
      {/* Matrix */}
      <div className="flex-1">
        <div
          ref={matrixRef}
          className="relative bg-bg-card border border-border rounded-2xl overflow-hidden"
          style={{ aspectRatio: "1 / 0.8" }}
        >
          {/* Toggle labels button */}
          <button
            onClick={() => setShowLabels(!showLabels)}
            className="absolute top-2 right-2 z-30 opacity-20 hover:opacity-60 transition-opacity text-lg"
            title="Quadranten anzeigen"
          >👁️</button>

          {/* Quadrant labels */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${showLabels ? "opacity-100" : "opacity-0"}`}>
            {/* Quadrant backgrounds */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-accent-teal/5" />
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent-amber/5" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-text-secondary/3" />
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent-coral/5" />

            {/* Labels */}
            <span className="absolute top-[15%] left-[25%] -translate-x-1/2 -translate-y-1/2 text-sm font-bold text-accent-teal/70 text-center leading-tight">
              Quick Win<br /><span className="text-xs font-normal">hier starten</span>
            </span>
            <span className="absolute top-[15%] right-[25%] translate-x-1/2 -translate-y-1/2 text-sm font-medium text-accent-amber/60 text-center leading-tight">
              Großes Projekt<br /><span className="text-xs font-normal">braucht Planung</span>
            </span>
            <span className="absolute bottom-[15%] left-[25%] -translate-x-1/2 translate-y-1/2 text-sm font-medium text-text-secondary/40 text-center leading-tight">
              Nice to have<br /><span className="text-xs font-normal">kann man mitnehmen</span>
            </span>
            <span className="absolute bottom-[15%] right-[25%] translate-x-1/2 translate-y-1/2 text-sm font-medium text-accent-coral/60 text-center leading-tight">
              Vermeiden<br /><span className="text-xs font-normal">Finger weg</span>
            </span>
          </div>

          {/* Divider lines */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
          </div>

          {/* Axis labels */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-text-secondary/60">
            Aufwand →
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-text-secondary/60 whitespace-nowrap">
            Impact →
          </div>

          {/* Use case bubbles */}
          {useCases.map((uc, i) => (
            <div
              key={uc.id}
              onMouseDown={(e) => handleMouseDown(uc.id, e)}
              onClick={() => setSelected(uc.id === selected ? null : uc.id)}
              className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-grab active:cursor-grabbing transition-shadow select-none ${
                uc.id === selected ? "ring-3 ring-offset-2 ring-text-primary shadow-lg scale-110" : "hover:shadow-md hover:scale-105"
              } ${dragging === uc.id ? "z-20 scale-110" : "z-10"}`}
              style={{
                backgroundColor: uc.color || COLORS[i % COLORS.length],
                left: `calc(${uc.matrixX * 100}% - 24px)`,
                bottom: `calc(${uc.matrixY * 100}% - 24px)`,
              }}
              title={uc.title}
            >
              {uc.shortCode}
            </div>
          ))}
        </div>
        <p className="text-xs text-text-secondary/60 text-center mt-2">
          Use-Cases per Drag & Drop in der Matrix positionieren
        </p>
      </div>

      {/* Detail panel */}
      <div className="w-72 shrink-0">
        {selectedUC ? (
          <div className="bg-bg-card rounded-xl border border-border p-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: selectedUC.color }}
              >
                {selectedUC.shortCode}
              </div>
              <h4 className="font-semibold text-text-primary text-sm">{selectedUC.title}</h4>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              {selectedUC.description}
            </p>
            <div className="flex gap-4 text-xs">
              <div className="flex-1 bg-bg-secondary rounded-lg p-2 text-center">
                <div className="text-text-secondary">Impact</div>
                <div className="font-bold text-accent-teal text-lg">{selectedUC.impact}/10</div>
              </div>
              <div className="flex-1 bg-bg-secondary rounded-lg p-2 text-center">
                <div className="text-text-secondary">Aufwand</div>
                <div className="font-bold text-accent-coral text-lg">{selectedUC.effort}/10</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-bg-secondary rounded-xl p-4 text-center">
            <p className="text-sm text-text-secondary">
              Klicke auf einen Use-Case um Details zu sehen
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 space-y-2">
          {useCases.map((uc, i) => (
            <button
              key={uc.id}
              onClick={() => setSelected(uc.id === selected ? null : uc.id)}
              className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all text-sm ${
                uc.id === selected ? "bg-bg-card border border-border" : "hover:bg-bg-card/50"
              }`}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                style={{ backgroundColor: uc.color || COLORS[i % COLORS.length] }}
              >
                {uc.shortCode}
              </div>
              <span className="text-text-primary truncate">{uc.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
