export interface IstAnalyseEntry {
  question: string;
  answer: string;
}

export interface UseCase {
  id: string;
  title: string;
  shortCode: string;
  description: string;
  impact: number;
  effort: number;
  matrixX: number;
  matrixY: number;
  color: string;
  selectedForPoc: boolean;
  roiParams: {
    anfragen: number;
    minuten: number;
    stunde: number;
    auto: number;
    setup: number;
    monat: number;
  };
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  timeline: string;
  useCases: string[];
  description: string;
}

export interface ROIEstimate {
  useCase: string;
  currentTimePerWeek: string;
  savedTimePerWeek: string;
  automationLevel: string;
}

export interface SessionData {
  companyName: string;
  ceoName: string;
  currentSlide: number;
  istAnalyse: IstAnalyseEntry[];
  useCases: UseCase[];
  roadmap: RoadmapPhase[];
  roi: ROIEstimate[];
  nextSteps: string[];
  summary: string;
}
