export interface InteractiveContext {
  componentId: string;
  componentType: string;
  componentTitle: string;
}

export interface InteractionState {
  currentStep?: number;
  selectedOption?: string | number;
  selectedPlanet?: string;
  selectedHouse?: string | number;
  selectedChart?: string;
  simulationProgress?: number; // 0 to 100
  quizState?: {
    totalQuestions: number;
    completedQuestions: number;
    score?: number;
    answers?: Record<string | number, any>;
  };
  userSelections?: Record<string, any>;
  visualizationState?: Record<string, any>;
  completionPercentage?: number;
}
