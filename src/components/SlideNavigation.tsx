"use client";

import { useStore } from "@/lib/store";

const MENU = [
  { name: "Agenda", slide: 0 },
  { name: "Tagesziel", slide: 1 },
  { name: "Systemarchitektur", slide: 2 },
  { name: "KI-Agent", slide: 3 },
  { name: "Datenschutz", slide: 4 },
  { name: "Ist-Analyse", slide: 5 },
  { name: "Use-Cases", slide: 6 },
  { name: "Roadmap & ROI", slide: 7 },
  { name: "Abschluss", slide: 8 },
];
const TOTAL_SLIDES = 9;

export default function SlideNavigation() {
  const { data, setSlide } = useStore();
  const { currentSlide } = data;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bg-card/90 backdrop-blur-sm border-t border-border z-50">
      <div className="mx-auto px-8 py-4 flex items-center justify-center gap-4">
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
          {MENU.map((item, i) => {
            const isActive = currentSlide === item.slide;
            const isPast = currentSlide > item.slide;
            return (
              <button
                key={i}
                onClick={() => setSlide(item.slide)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? "bg-text-primary text-bg-primary"
                    : isPast
                    ? "bg-accent-teal/10 text-accent-teal"
                    : "bg-bg-secondary text-text-secondary"
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive
                    ? "bg-bg-primary/20"
                    : isPast
                    ? "bg-accent-teal/20"
                    : "bg-text-secondary/10"
                }`}>
                  {isPast ? "✓" : i + 1}
                </span>
                <span className="hidden md:inline whitespace-nowrap">{item.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setSlide(Math.min(TOTAL_SLIDES - 1, currentSlide + 1))}
          disabled={currentSlide === TOTAL_SLIDES - 1}
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
