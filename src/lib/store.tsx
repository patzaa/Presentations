"use client";

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react";
import { SessionData, UseCase, RoadmapPhase, ROIEstimate } from "./types";

const QUESTIONS = [
  "Was frisst bei euch die meiste Zeit im Tagesgeschäft?",
  "Wie sieht ein typischer Tag im Team aus?",
  "Welche Aufgaben kosten die meiste Zeit?",
  "Wo gibt es Frust oder Engpässe?",
  "Wie nutzen Sie idwell aktuell – was funktioniert gut, was fehlt?",
];

const initialState: SessionData = {
  companyName: "Sperr & Zellner",
  ceoName: "Michael Schmid",
  currentSlide: 0,
  istAnalyse: QUESTIONS.map((q) => ({ question: q, answer: "" })),
  useCases: [],
  roadmap: [],
  roi: [],
  nextSteps: [],
  summary: "",
};

interface StoreContextType {
  data: SessionData;
  user: string | null;
  setSlide: (n: number) => void;
  updateAnswer: (index: number, answer: string) => void;
  setUseCases: (cases: UseCase[]) => void;
  updateUseCasePosition: (id: string, x: number, y: number) => void;
  toggleUseCasePoc: (id: string) => void;
  updateUseCaseRoi: (id: string, params: { anfragen: number; minuten: number; stunde: number; auto: number; setup: number; monat: number }) => void;
  setRoadmap: (phases: RoadmapPhase[]) => void;
  setROI: (estimates: ROIEstimate[]) => void;
  setNextSteps: (steps: string[]) => void;
  setSummary: (s: string) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SessionData>(initialState);
  const [user, setUser] = useState<string | null>(null);
  const syncTimestamp = useRef(0);
  const isDragging = useRef(false);

  // Fetch current user
  useEffect(() => {
    fetch("/api/me").then((r) => r.json()).then((d) => {
      setUser(d.user);
      // Michael lands on Use-Cases slide
      if (d.user === "michael") {
        setData((prev) => ({ ...prev, currentSlide: 3 }));
      }
    }).catch(() => {});
  }, []);

  // Sync: push positions to server after drag
  const pushSync = useCallback(async (useCases: UseCase[]) => {
    try {
      const payload = useCases.map((uc) => ({
        id: uc.id, matrixX: uc.matrixX, matrixY: uc.matrixY,
        impact: uc.impact, effort: uc.effort,
      }));
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCases: payload }),
      });
      const result = await res.json();
      syncTimestamp.current = result.timestamp;
    } catch (e) {
      console.error("Sync push failed:", e);
    }
  }, []);

  // Sync: poll for updates from other users
  useEffect(() => {
    const poll = setInterval(async () => {
      if (isDragging.current) return;
      try {
        const res = await fetch(`/api/sync?since=${syncTimestamp.current}`);
        const result = await res.json();
        if (result.updated && result.useCases) {
          syncTimestamp.current = result.timestamp;
          setData((d) => {
            if (d.useCases.length === 0) return d;
            return {
              ...d,
              useCases: d.useCases.map((uc) => {
                const synced = result.useCases.find((s: { id: string }) => s.id === uc.id);
                if (synced) {
                  return { ...uc, matrixX: synced.matrixX, matrixY: synced.matrixY, impact: synced.impact, effort: synced.effort };
                }
                return uc;
              }),
            };
          });
        }
      } catch {}
    }, 800);
    return () => clearInterval(poll);
  }, []);

  const setSlide = (n: number) =>
    setData((d) => ({ ...d, currentSlide: n }));

  const updateAnswer = (index: number, answer: string) =>
    setData((d) => ({
      ...d,
      istAnalyse: d.istAnalyse.map((e, i) =>
        i === index ? { ...e, answer } : e
      ),
    }));

  const setUseCases = (cases: UseCase[]) => {
    setData((d) => ({ ...d, useCases: cases }));
    // Push initial positions to sync
    pushSync(cases);
  };

  const updateUseCasePosition = (id: string, x: number, y: number) => {
    isDragging.current = true;
    setData((d) => {
      const updated = d.useCases.map((uc) =>
        uc.id === id
          ? { ...uc, matrixX: x, matrixY: y, effort: Math.round(x * 10), impact: Math.round(y * 10) }
          : uc
      );
      // Debounced push
      clearTimeout((window as unknown as Record<string, ReturnType<typeof setTimeout>>).__syncTimeout);
      (window as unknown as Record<string, ReturnType<typeof setTimeout>>).__syncTimeout = setTimeout(() => {
        isDragging.current = false;
        pushSync(updated);
      }, 150);
      return { ...d, useCases: updated };
    });
  };

  const toggleUseCasePoc = (id: string) =>
    setData((d) => ({
      ...d,
      useCases: d.useCases.map((uc) =>
        uc.id === id ? { ...uc, selectedForPoc: !uc.selectedForPoc } : uc
      ),
    }));

  const updateUseCaseRoi = (id: string, params: { anfragen: number; minuten: number; stunde: number; auto: number; setup: number; monat: number }) =>
    setData((d) => ({
      ...d,
      useCases: d.useCases.map((uc) =>
        uc.id === id ? { ...uc, roiParams: params } : uc
      ),
    }));

  const setRoadmap = (phases: RoadmapPhase[]) =>
    setData((d) => ({ ...d, roadmap: phases }));

  const setROI = (estimates: ROIEstimate[]) =>
    setData((d) => ({ ...d, roi: estimates }));

  const setNextSteps = (steps: string[]) =>
    setData((d) => ({ ...d, nextSteps: steps }));

  const setSummary = (s: string) =>
    setData((d) => ({ ...d, summary: s }));

  return (
    <StoreContext.Provider
      value={{
        data,
        user,
        setSlide,
        updateAnswer,
        setUseCases,
        updateUseCasePosition,
        toggleUseCasePoc,
        updateUseCaseRoi,
        setRoadmap,
        setROI,
        setNextSteps,
        setSummary,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
