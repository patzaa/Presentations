"use client";

import { useRef, useCallback, useEffect } from "react";
import { useStore } from "@/lib/store";

function fmt(n: number) {
  return Math.round(n).toLocaleString("de-DE");
}

interface Props {
  id: string;
  title: string;
  selectedForPoc?: boolean;
  onTogglePoc?: (id: string) => void;
  showPocToggle?: boolean;
}

export default function ROICalculator({ id, title, selectedForPoc = false, onTogglePoc, showPocToggle = true }: Props) {
  const { data, updateUseCaseRoi } = useStore();
  const uc = data.useCases.find((u) => u.id === id);
  const params = uc?.roiParams ?? { anfragen: 100, minuten: 15, stunde: 55, auto: 65, setup: 2500, monat: 80 };

  const { anfragen, minuten, stunde, auto, setup, monat } = params;

  const update = (key: string, value: number) => {
    updateUseCaseRoi(id, { ...params, [key]: value });
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartRef = useRef<any>(null);

  const hProWoche = (anfragen * minuten) / 60 * (auto / 100);
  const sparProWoche = hProWoche * stunde;
  const sparProMonat = sparProWoche * 4.33;
  const sparProJahr = sparProMonat * 12;
  const kostenJahr1 = setup + monat * 12;
  const paybackMonths = sparProMonat > monat ? setup / (sparProMonat - monat) : 99;

  const drawChart = useCallback(async () => {
    if (!canvasRef.current) return;
    const { Chart, registerables } = await import("chart.js");
    Chart.register(...registerables);

    if (chartRef.current) {
      (chartRef.current as { destroy: () => void }).destroy();
    }

    const labels = [];
    const cumSpar = [];
    const cumKost = [];
    for (let i = 0; i <= 12; i++) {
      labels.push("M" + i);
      cumKost.push(setup + monat * i);
      cumSpar.push(sparProMonat * i);
    }

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Kumul. Ersparnis", data: cumSpar, borderColor: "#5DCAA5", backgroundColor: "rgba(93,202,165,0.1)", fill: true, tension: 0.3, pointRadius: 0, borderWidth: 2 },
          { label: "Kumul. Kosten", data: cumKost, borderColor: "#F09595", backgroundColor: "rgba(240,149,149,0.1)", fill: true, tension: 0, pointRadius: 0, borderWidth: 2 },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index" as const, intersect: false },
        plugins: { legend: { display: true, position: "bottom" as const, labels: { boxWidth: 10, font: { size: 11 }, padding: 8 } } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 } } },
          y: { grid: { color: "rgba(0,0,0,0.06)" }, ticks: { font: { size: 11 }, callback: (v) => fmt(v as number) + " €" } },
        },
      },
    });
    chartRef.current = chart;
  }, [setup, monat, sparProMonat]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  const total = Math.max(kostenJahr1, sparProJahr, 1);
  const costPct = Math.min((kostenJahr1 / total) * 100, 100);
  const savePct = Math.min((sparProJahr / total) * 100, 100);

  const pbDisplay = paybackMonths > 12 ? ">12" : paybackMonths.toFixed(1).replace(".", ",");
  const wH = Math.round(hProWoche);
  const pbR = paybackMonths > 12 ? "über 12 Monate" : Math.ceil(paybackMonths) + " Monate";

  return (
    <div data-roi-calculator className="bg-bg-card rounded-xl border border-border p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-text-primary text-base">{title}</h4>
        {showPocToggle && onTogglePoc && (
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-xs text-text-secondary">PoC Workflow</span>
            <input
              type="checkbox"
              checked={selectedForPoc}
              onChange={() => onTogglePoc(id)}
              className="w-4 h-4 rounded border-border accent-accent-purple cursor-pointer"
            />
          </label>
        )}
      </div>

      <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">Ihre Zahlen eingeben</p>

      <div className="space-y-3 mb-4">
        {[
          { key: "anfragen", label: "Anfragen / Woche", value: anfragen, min: 20, max: 300, step: 5, display: `${anfragen}` },
          { key: "minuten", label: "Minuten / Anfrage", value: minuten, min: 5, max: 30, step: 1, display: `${minuten}` },
          { key: "stunde", label: "Stundensatz (voll belastet)", value: stunde, min: 30, max: 90, step: 5, display: `${stunde} €` },
          { key: "auto", label: "KI-Automatisierungsgrad", value: auto, min: 30, max: 90, step: 5, display: `${auto}%` },
        ].map((r) => (
          <div key={r.key} className="flex items-center gap-3">
            <label className="text-sm text-text-secondary min-w-[160px]">{r.label}</label>
            <input type="range" min={r.min} max={r.max} step={r.step} value={r.value}
              onChange={(e) => update(r.key, +e.target.value)}
              className="flex-1 accent-accent-purple" />
            <span className="text-sm font-medium text-text-primary min-w-[56px] text-right font-mono">{r.display}</span>
          </div>
        ))}
      </div>

      <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">Pilotkosten</p>

      <div className="space-y-3 mb-4">
        {[
          { key: "setup", label: "Setup + Integration", value: setup, min: 2000, max: 20000, step: 500, display: `${fmt(setup)} €` },
          { key: "monat", label: "Laufende Kosten / Monat", value: monat, min: 100, max: 1500, step: 50, display: `${fmt(monat)} €` },
        ].map((r) => (
          <div key={r.key} className="flex items-center gap-3">
            <label className="text-sm text-text-secondary min-w-[160px]">{r.label}</label>
            <input type="range" min={r.min} max={r.max} step={r.step} value={r.value}
              onChange={(e) => update(r.key, +e.target.value)}
              className="flex-1 accent-accent-purple" />
            <span className="text-sm font-medium text-text-primary min-w-[56px] text-right font-mono">{r.display}</span>
          </div>
        ))}
      </div>

      <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-3">Ergebnis</p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-bg-secondary rounded-lg p-3 text-center">
          <div className="text-xs text-text-secondary mb-1">Zeitersparnis / Woche</div>
          <div className="text-2xl font-medium text-accent-teal font-mono">{wH}</div>
          <div className="text-xs text-text-secondary">Stunden</div>
        </div>
        <div className="bg-bg-secondary rounded-lg p-3 text-center">
          <div className="text-xs text-text-secondary mb-1">Ersparnis / Jahr</div>
          <div className="text-2xl font-medium text-accent-teal font-mono">{fmt(sparProJahr)}</div>
          <div className="text-xs text-text-secondary">Euro</div>
        </div>
        <div className="bg-bg-secondary rounded-lg p-3 text-center">
          <div className="text-xs text-text-secondary mb-1">Payback</div>
          <div className="text-2xl font-medium text-accent-purple font-mono">{pbDisplay}</div>
          <div className="text-xs text-text-secondary">Monate</div>
        </div>
      </div>

      <div className="flex gap-4 text-xs text-text-secondary mb-1">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#F09595] inline-block" /> Kosten (Jahr 1)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#9FE1CB] inline-block" /> Ersparnis (Jahr 1)</span>
      </div>
      <div className="relative h-8 bg-bg-secondary rounded-lg overflow-hidden mb-4">
        <div className="absolute left-0 top-0 h-full bg-[#F09595] rounded-l-lg transition-all duration-400" style={{ width: `${costPct}%` }} />
        <div className="absolute top-0 h-full bg-[#9FE1CB] transition-all duration-400" style={{ left: `${costPct}%`, width: `${Math.max(savePct - costPct, 0)}%` }} />
      </div>

      <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Payback-Verlauf (12 Monate)</p>
      <div className="h-[120px] mb-4">
        <canvas ref={canvasRef} />
      </div>

      <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Phasenmodell</p>
      <div className="flex rounded-lg overflow-hidden h-12 mb-4">
        <div className="flex-1 flex flex-col items-center justify-center bg-[#E1F5EE] text-[#085041]">
          <span className="text-xs font-medium">Pilot</span>
          <span className="text-[11px] opacity-70">1–2 Wochen</span>
        </div>
        <div className="flex-[2] flex flex-col items-center justify-center bg-[#E6F1FB] text-[#0C447C]">
          <span className="text-xs font-medium">Aufbau</span>
          <span className="text-[11px] opacity-70">4–8 Wochen</span>
        </div>
        <div className="flex-[3] flex flex-col items-center justify-center bg-[#EEEDFE] text-[#3C3489]">
          <span className="text-xs font-medium">Vollbetrieb</span>
          <span className="text-[11px] opacity-70">ab Woche 8</span>
        </div>
      </div>

      <div className="text-sm text-text-primary italic p-3 border-l-[3px] border-accent-purple/40 leading-relaxed">
        &ldquo;Der Pilot kostet Sie <strong className="not-italic text-accent-purple">{fmt(setup)} €</strong> einmalig
        plus <strong className="not-italic text-accent-purple">{fmt(monat)} €/Monat</strong>.
        Ab Woche 2 sparen Sie <strong className="not-italic text-accent-purple">{wH} Stunden pro Woche</strong> —
        das sind <strong className="not-italic text-accent-purple">{fmt(Math.round(sparProMonat))} €/Monat</strong>.
        Nach <strong className="not-italic text-accent-purple">{pbR}</strong> hat sich das amortisiert.&rdquo;
      </div>
    </div>
  );
}
