"use client";

import { useStore } from "@/lib/store";

const SLIDE_NAMES = [
  "Agenda",
  "Ist-Analyse",
  "KI-Input",
  "Use-Cases",
  "Roadmap & ROI",
  "Abschluss",
];

export default function SlideNavigation() {
  const { data, setSlide } = useStore();
  const { currentSlide } = data;
  const total = SLIDE_NAMES.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bg-card/90 backdrop-blur-sm border-t border-border z-50">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <button
          onClick={() => setSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all
            disabled:opacity-30 disabled:cursor-not-allowed
            bg-bg-secondary text-text-primary hover:bg-border"
        >
          Zurück
        </button>

        <div className="flex items-center gap-2">
          {SLIDE_NAMES.map((name, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                i === currentSlide
                  ? "bg-text-primary text-bg-primary"
                  : i < currentSlide
                  ? "bg-accent-teal/10 text-accent-teal"
                  : "bg-bg-secondary text-text-secondary"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                i === currentSlide
                  ? "bg-bg-primary/20"
                  : i < currentSlide
                  ? "bg-accent-teal/20"
                  : "bg-text-secondary/10"
              }`}>
                {i < currentSlide ? "✓" : i + 1}
              </span>
              <span className="hidden md:inline">{name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setSlide(Math.min(total - 1, currentSlide + 1))}
          disabled={currentSlide === total - 1}
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all
            disabled:opacity-30 disabled:cursor-not-allowed
            bg-text-primary text-bg-primary hover:opacity-90"
        >
          Weiter
        </button>
      </div>
    </div>
  );
}
