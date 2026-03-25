"use client";

import { useStore } from "@/lib/store";
import SlideNavigation from "./SlideNavigation";
import AgendaSlide from "./slides/AgendaSlide";
import IstAnalyseSlide from "./slides/IstAnalyseSlide";
import KIInputSlide from "./slides/KIInputSlide";
import UseCaseSlide from "./slides/UseCaseSlide";
import RoadmapSlide from "./slides/RoadmapSlide";
import AbschlussSlide from "./slides/AbschlussSlide";
import { useEffect } from "react";

const SLIDES = [
  AgendaSlide,
  IstAnalyseSlide,
  KIInputSlide,
  UseCaseSlide,
  RoadmapSlide,
  AbschlussSlide,
];

export default function Presentation() {
  const { data, user, setSlide } = useStore();

  const isParticipant = user === "michael";
  const currentSlideIndex = isParticipant ? 3 : data.currentSlide;
  const CurrentSlide = SLIDES[currentSlideIndex] || AgendaSlide;

  // Keyboard navigation (disabled for participant)
  useEffect(() => {
    if (isParticipant) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setSlide(Math.min(SLIDES.length - 1, data.currentSlide + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSlide(Math.max(0, data.currentSlide - 1));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [data.currentSlide, setSlide, isParticipant]);

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    window.location.href = "/login";
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2">
        {isParticipant && (
          <img src="/avatar-michael.png" alt="Michael" className="w-10 h-10 rounded-full object-cover border-2 border-border shadow-sm" />
        )}
        <button
          onClick={logout}
          className="p-2 rounded-lg text-text-secondary/40 hover:text-text-secondary transition-opacity"
          title="Abmelden"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </button>
      </div>
      <main className={`flex-1 ${isParticipant ? "" : "pb-20"} overflow-y-auto`}>
        <CurrentSlide />
      </main>
      {!isParticipant && <SlideNavigation />}
    </div>
  );
}
