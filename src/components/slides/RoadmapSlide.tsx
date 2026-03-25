"use client";

import { useStore } from "@/lib/store";
import ROICalculator from "@/components/ROICalculator";

export default function RoadmapSlide() {
  const { data, toggleUseCasePoc } = useStore();

  return (
    <div className="animate-fade-in flex flex-col items-center min-h-[80vh] px-8 pt-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-accent-coral tracking-widest uppercase mb-2">
            Phase IV
          </p>
          <h2 className="text-3xl font-bold text-text-primary">
            ROI-Kalkulator
          </h2>
          <p className="text-text-secondary mt-2">
            Berechnen Sie die Amortisation für Ihre Use-Cases live
          </p>
        </div>

        {(() => {
          const quickWins = data.useCases.filter(
            (uc) => uc.matrixX < 0.5 && uc.matrixY >= 0.5
          );
          return quickWins.length === 0 ? (
            <div className="text-center py-20 text-text-secondary">
              <p className="text-lg mb-2">Keine Quick Wins vorhanden</p>
              <p className="text-sm">Verschieben Sie Use-Cases in den Quick-Win-Quadranten (hoher Impact, niedriger Aufwand).</p>
            </div>
          ) : (
            <div className="space-y-6">
              {quickWins.map((uc) => (
                <ROICalculator key={uc.id} id={uc.id} title={uc.title} selectedForPoc={uc.selectedForPoc} onTogglePoc={toggleUseCasePoc} />
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
