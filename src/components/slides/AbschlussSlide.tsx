"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import IdwellWorkflowDiagram from "@/components/diagrams/IdwellWorkflowDiagram";
import ROICalculator from "@/components/ROICalculator";

export default function AbschlussSlide() {
  const { data, setNextSteps, setSummary } = useStore();
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");

  const hasData = data.summary !== "";

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.companyName,
          ceoName: data.ceoName,
          istAnalyse: data.istAnalyse.filter((q) => q.answer.trim()),
          useCases: data.useCases.map((uc) => ({
            title: uc.title,
            description: uc.description,
            impact: uc.impact,
            effort: uc.effort,
          })),
          roadmap: data.roadmap,
          roi: data.roi,
        }),
      });
      if (!res.ok) throw new Error("API Fehler");
      const result = await res.json();
      setSummary(result.summary);
      setNextSteps(result.nextSteps);
    } catch {
      setError("Fehler bei der Generierung.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasData && data.useCases.length > 0 && !loading) {
      generate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const element = document.getElementById("report-content");
      if (!element) return;

      const html2canvas = (await import("html2canvas")).default;

      // Capture PoC workflow + Ergebnis screenshots
      const pocImages: string[] = [];
      const pocElements = document.querySelectorAll("[data-poc-capture]");
      for (const el of pocElements) {
        try {
          const canvas = await html2canvas(el as HTMLElement, { scale: 2, useCORS: true, backgroundColor: "#F8F6F0" });
          pocImages.push(canvas.toDataURL("image/png"));
        } catch (e) {
          console.error("PoC screenshot failed:", e);
        }
      }

      // Try to capture ROI screenshots
      let roiImages: string[] = [];
      const roiHost = document.getElementById("roi-capture-host");
      if (roiHost) {
        try {
          roiHost.style.cssText = "display:block; position:fixed; top:0; left:0; width:900px; z-index:-1; opacity:0; pointer-events:none;";
          await new Promise((r) => setTimeout(r, 800));
          const roiElements = roiHost.querySelectorAll("[data-roi-calculator]");
          for (const el of roiElements) {
            const canvas = await html2canvas(el as HTMLElement, { scale: 2, useCORS: true, backgroundColor: "#FFFFFF" });
            roiImages.push(canvas.toDataURL("image/png"));
          }
          roiHost.style.cssText = "display:none;";
        } catch (e) {
          console.error("ROI screenshot failed:", e);
          if (roiHost) roiHost.style.cssText = "display:none;";
        }
      }

      // Insert PoC workflow screenshots into PDF
      const pocContainer = document.getElementById("pdf-poc-screenshots");
      if (pocContainer && pocImages.length > 0) {
        pocContainer.innerHTML = "";
        pocImages.forEach((src, i) => {
          if (i > 0) {
            const spacer = document.createElement("div");
            spacer.style.height = "20px";
            pocContainer.appendChild(spacer);
          }
          const img = document.createElement("img");
          img.src = src;
          img.style.width = "100%";
          img.style.borderRadius = "8px";
          pocContainer.appendChild(img);
        });
      }

      // Insert ROI images into PDF content
      const roiContainer = document.getElementById("pdf-roi-screenshots");
      const roiFallback = document.getElementById("pdf-roi-fallback");
      if (roiContainer && roiImages.length > 0) {
        roiContainer.innerHTML = "";
        roiImages.forEach((src, i) => {
          if (i > 0) {
            const spacer = document.createElement("div");
            spacer.style.height = "20px";
            roiContainer.appendChild(spacer);
          }
          const img = document.createElement("img");
          img.src = src;
          img.style.width = "100%";
          img.style.borderRadius = "8px";
          img.style.border = "1px solid #E0DDD6";
          roiContainer.appendChild(img);
        });
        if (roiFallback) roiFallback.style.display = "none";
      } else {
        if (roiContainer) roiContainer.style.display = "none";
      }

      element.style.display = "block";

      await html2pdf()
        .set({
          margin: [15, 15, 15, 15],
          filename: `KI-Beratung_${data.companyName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();

      element.style.display = "none";
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("PDF-Generierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
    } finally {
      setPdfLoading(false);
    }
  };

  const quickWins = data.useCases.filter((uc) => uc.matrixX < 0.5 && uc.matrixY >= 0.5);
  const dateStr = new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="animate-fade-in flex flex-col items-center min-h-[80vh] px-8 pt-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <img src="/sperr-zellner-logo.png" alt="Sperr & Zellner" className="h-24 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-text-primary">
            Abschluss & Nächste Schritte
          </h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-accent-purple mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-text-secondary">Zusammenfassung wird erstellt...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-accent-coral mb-4">{error}</p>
            <button onClick={generate} className="px-6 py-2 rounded-lg bg-text-primary text-white font-medium">
              Nochmal versuchen
            </button>
          </div>
        ) : !hasData ? (
          <div className="text-center py-20 text-text-secondary">
            <p className="text-lg mb-4">Bitte zuerst die vorherigen Schritte durchlaufen</p>
            <button onClick={generate} className="px-6 py-2 rounded-lg bg-text-primary text-white font-medium">
              Zusammenfassung generieren
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* PoC Workflows for selected use-cases */}
            {data.useCases.filter((uc) => uc.selectedForPoc).map((uc) => {
              const p = uc.roiParams;
              const hProWoche = (p.anfragen * p.minuten) / 60 * (p.auto / 100);
              const sparProWoche = hProWoche * p.stunde;
              const sparProMonat = sparProWoche * 4.33;
              const sparProJahr = sparProMonat * 12;
              const paybackMonths = sparProMonat > p.monat ? p.setup / (sparProMonat - p.monat) : 99;
              const wH = Math.round(hProWoche);
              const pbDisplay = paybackMonths > 12 ? ">12" : paybackMonths.toFixed(1).replace(".", ",");

              return (
                <div key={uc.id} className="space-y-4" data-poc-capture>
                  <div className="bg-bg-card rounded-2xl border border-border p-8">
                    <h3 className="text-lg font-semibold text-text-primary mb-1">PoC Workflow</h3>
                    <p className="text-text-secondary mb-6">
                      Automatisierter KI-Workflow via idwell API
                    </p>
                    <IdwellWorkflowDiagram useCaseTitle={uc.title} />
                  </div>

                  {/* ROI Summary */}
                  <div className="bg-bg-card rounded-2xl border border-border p-8">
                    <h3 className="text-lg font-semibold text-text-primary mb-6">Ergebnis</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-bg-secondary rounded-xl p-6 text-center">
                        <div className="text-text-secondary mb-2">Zeitersparnis / Woche</div>
                        <div className="text-4xl font-semibold text-accent-teal font-mono">{wH}</div>
                        <div className="text-text-secondary mt-1">Stunden</div>
                      </div>
                      <div className="bg-bg-secondary rounded-xl p-6 text-center">
                        <div className="text-text-secondary mb-2">Ersparnis / Jahr</div>
                        <div className="text-4xl font-semibold text-accent-teal font-mono">{Math.round(sparProJahr).toLocaleString("de-DE")}</div>
                        <div className="text-text-secondary mt-1">Euro</div>
                      </div>
                      <div className="bg-bg-secondary rounded-xl p-6 text-center">
                        <div className="text-text-secondary mb-2">Payback</div>
                        <div className="text-4xl font-semibold text-accent-purple font-mono">{pbDisplay}</div>
                        <div className="text-text-secondary mt-1">Monate</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Next steps */}
            <div className="bg-bg-card rounded-2xl border border-border p-8">
              <h3 className="text-lg font-semibold text-text-primary mb-6">Nächste Schritte</h3>
              <div className="space-y-3">
                {data.nextSteps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-bg-secondary rounded-xl">
                    <span className="w-7 h-7 rounded-full bg-accent-purple text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-text-primary text-sm pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PDF Download */}
            <div className="flex justify-center pt-4">
              <button
                onClick={downloadPDF}
                disabled={pdfLoading}
                className="px-8 py-3.5 rounded-xl bg-text-primary text-white font-medium text-base
                  hover:opacity-90 transition-all disabled:opacity-60 shadow-md hover:shadow-lg
                  flex items-center gap-2"
              >
                {pdfLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    PDF wird erstellt...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Report als PDF herunterladen
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hidden PDF content — premium design */}
      <div id="report-content" style={{ display: "none" }}>
        <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", color: "#2D2B28", maxWidth: "800px", margin: "0 auto" }}>

          {/* Cover / Header */}
          <div style={{ background: "linear-gradient(135deg, #534AB7 0%, #3C3489 100%)", color: "#FFFFFF", padding: "48px 40px 40px", borderRadius: "0 0 0 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <img src="/sperr-zellner-logo.png" alt="Sperr & Zellner" style={{ height: "64px" }} />
                <div>
                  <h1 style={{ fontSize: "28px", fontWeight: 700, margin: "0 0 6px 0", lineHeight: 1.2 }}>{data.companyName}</h1>
                  <p style={{ fontSize: "14px", opacity: 0.8, margin: 0 }}>Workshop mit {data.ceoName}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", opacity: 0.8 }}>{dateStr}</div>
              </div>
            </div>
            {/* Summary stats bar */}
            <div style={{ display: "flex", gap: "24px", background: "rgba(255,255,255,0.12)", borderRadius: "12px", padding: "16px 20px" }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700 }}>{data.useCases.length}</div>
                <div style={{ fontSize: "11px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px" }}>Use-Cases</div>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.2)" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700 }}>{quickWins.length}</div>
                <div style={{ fontSize: "11px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px" }}>Quick Wins</div>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.2)" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700 }}>{data.useCases.filter(uc => uc.selectedForPoc).length}</div>
                <div style={{ fontSize: "11px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px" }}>PoC Workflows</div>
              </div>
            </div>
          </div>

          {/* Body content */}
          <div style={{ padding: "32px 40px" }}>

            {/* Zusammenfassung */}
            {data.summary && (
              <div style={{ marginBottom: "36px", pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: "4px", height: "24px", borderRadius: "2px", background: "#534AB7" }} />
                  <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Zusammenfassung</h2>
                </div>
                <p style={{ fontSize: "13px", lineHeight: 1.8, color: "#4A4845", whiteSpace: "pre-line", margin: 0 }}>{data.summary}</p>
              </div>
            )}

            {/* Use-Cases */}
            <div style={{ marginBottom: "36px", pageBreakInside: "avoid" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{ width: "4px", height: "24px", borderRadius: "2px", background: "#D85A30" }} />
                <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Use-Cases</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {data.useCases.map((uc, i) => (
                  <div key={i} style={{ padding: "16px", background: "#FFFFFF", borderRadius: "10px", border: "1px solid #E8E6E0", position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: uc.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "10px", fontWeight: 700, flexShrink: 0 }}>
                        {uc.shortCode}
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{uc.title}</span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#6B6965", margin: "0 0 10px 0", lineHeight: 1.5 }}>{uc.description}</p>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <div style={{ flex: 1, background: "#F1F8F5", borderRadius: "6px", padding: "6px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: "10px", color: "#6B6965" }}>Impact</div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#0F6E56" }}>{uc.impact}/10</div>
                      </div>
                      <div style={{ flex: 1, background: "#FDF5F2", borderRadius: "6px", padding: "6px 8px", textAlign: "center" }}>
                        <div style={{ fontSize: "10px", color: "#6B6965" }}>Aufwand</div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#D85A30" }}>{uc.effort}/10</div>
                      </div>
                    </div>
                    {uc.selectedForPoc && (
                      <div style={{ position: "absolute", top: "8px", right: "8px", background: "#534AB7", color: "#fff", fontSize: "9px", fontWeight: 600, padding: "2px 8px", borderRadius: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        PoC
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* PoC Workflow + Ergebnis */}
            {data.useCases.some((uc) => uc.selectedForPoc) && (
              <div style={{ marginBottom: "36px", pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: "4px", height: "24px", borderRadius: "2px", background: "#0F6E56" }} />
                  <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>PoC Workflow & Ergebnis</h2>
                </div>
                <div id="pdf-poc-screenshots" />
              </div>
            )}

            {/* ROI Kalkulation */}
            {quickWins.length > 0 && (
              <div style={{ marginBottom: "36px", pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: "4px", height: "24px", borderRadius: "2px", background: "#534AB7" }} />
                  <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>ROI-Kalkulation — Quick Wins</h2>
                </div>
                <div id="pdf-roi-screenshots" />
                {/* Fallback if screenshots not captured */}
                <div id="pdf-roi-fallback">
                  {quickWins.map((uc, i) => (
                    <div key={i} style={{ marginBottom: "12px", padding: "16px", background: "#F8F7F4", borderRadius: "10px", border: "1px solid #E8E6E0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: uc.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "9px", fontWeight: 700 }}>
                          {uc.shortCode}
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 600 }}>{uc.title}</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "#6B6965", margin: "0 0 8px 0" }}>
                        Dieser Use-Case wurde als Quick Win identifiziert (Impact: {uc.impact}/10, Aufwand: {uc.effort}/10).
                        Die detaillierte ROI-Kalkulation mit individuellen Parametern ist im interaktiven Tool verfügbar.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nächste Schritte */}
            {data.nextSteps.length > 0 && (
              <div style={{ marginBottom: "36px", pageBreakInside: "avoid" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: "4px", height: "24px", borderRadius: "2px", background: "#534AB7" }} />
                  <h2 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>Nächste Schritte</h2>
                </div>
                {data.nextSteps.map((step, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px", padding: "12px 14px", background: i === 0 ? "#EEEDFE" : "#F8F7F4", borderRadius: "10px" }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: i === 0 ? "#534AB7" : "#9994D4", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: "13px", color: "#2D2B28", margin: 0, lineHeight: 1.6, paddingTop: "3px" }}>{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ background: "#F8F7F4", padding: "20px 40px", borderTop: "1px solid #E8E6E0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#534AB7", margin: "0 0 2px 0" }}>{data.companyName}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "11px", color: "#6B6965", margin: 0 }}>{dateStr}</p>
                <p style={{ fontSize: "11px", color: "#9994D4", margin: "2px 0 0 0" }}>Vertraulich — nur für {data.companyName}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Hidden ROI calculators for screenshot capture */}
      <div id="roi-capture-host" style={{ display: "none" }}>
        <div className="space-y-6">
          {quickWins.map((uc) => (
            <ROICalculator key={uc.id} id={uc.id} title={uc.title} showPocToggle={false} />
          ))}
        </div>
      </div>
    </div>
  );
}
