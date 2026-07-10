"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "grahvani-m2c4l2-interactive";

interface PersistedState {
  exploredPresets: string[];
  computations: number;
  edgeCases: string[];
  challengeScore: number;
  challengeTotal: number;
  flashcardCompleted: string[];
  achievements: string[];
  xp: number;
  guidedStep: number;
  guidedCompleted: boolean;
}

function loadPersisted(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function savePersisted(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export interface ProgressState {
  exploredPresets: Set<string>;
  computations: number;
  edgeCases: Set<string>;
  challengeScore: number;
  challengeTotal: number;
  flashcardCompleted: Set<string>;
  achievements: Set<string>;
  xp: number;
  guidedStep: number;
  guidedCompleted: boolean;
}

export interface ProgressActions {
  explorePreset: (id: string) => void;
  recordComputation: () => void;
  discoverEdgeCase: (type: string) => void;
  recordChallenge: (correct: boolean) => void;
  completeFlashcard: (id: string) => void;
  advanceGuided: () => void;
  completeGuided: () => void;
  reset: () => void;
}

function defaultState(): ProgressState {
  return {
    exploredPresets: new Set(),
    computations: 0,
    edgeCases: new Set(),
    challengeScore: 0,
    challengeTotal: 0,
    flashcardCompleted: new Set(),
    achievements: new Set(),
    xp: 0,
    guidedStep: 0,
    guidedCompleted: false,
  };
}

function hydrate(p: PersistedState): ProgressState {
  return {
    exploredPresets: new Set(p.exploredPresets),
    computations: p.computations,
    edgeCases: new Set(p.edgeCases),
    challengeScore: p.challengeScore,
    challengeTotal: p.challengeTotal,
    flashcardCompleted: new Set(p.flashcardCompleted),
    achievements: new Set(p.achievements),
    xp: p.xp,
    guidedStep: p.guidedStep,
    guidedCompleted: p.guidedCompleted,
  };
}

function dehydrate(s: ProgressState): PersistedState {
  return {
    exploredPresets: Array.from(s.exploredPresets),
    computations: s.computations,
    edgeCases: Array.from(s.edgeCases),
    challengeScore: s.challengeScore,
    challengeTotal: s.challengeTotal,
    flashcardCompleted: Array.from(s.flashcardCompleted),
    achievements: Array.from(s.achievements),
    xp: s.xp,
    guidedStep: s.guidedStep,
    guidedCompleted: s.guidedCompleted,
  };
}

export function useLessonProgress(): [ProgressState, ProgressActions, string | null] {
  const [state, setState] = useState<ProgressState>(() => {
    const persisted = loadPersisted();
    return persisted ? hydrate(persisted) : defaultState();
  });
  const [newAchievement, setNewAchievement] = useState<string | null>(null);

  useEffect(() => {
    savePersisted(dehydrate(state));
  }, [state]);

  const checkAchievements = useCallback((next: ProgressState): Set<string> => {
    const nextAch = new Set(next.achievements);
    const addIf = (id: string, condition: boolean) => {
      if (condition && !nextAch.has(id)) {
        nextAch.add(id);
        setNewAchievement(id);
        window.setTimeout(() => setNewAchievement(null), 4000);
      }
    };

    addIf("eye-of-dawn", next.exploredPresets.size >= 5);
    addIf("formula-weaver", next.guidedCompleted);
    addIf("edge-walker", next.edgeCases.size >= 3);
    addIf("surya-siddhanta", next.computations >= 3);
    addIf(
      "master-of-sunrise",
      next.exploredPresets.size >= 5 &&
        next.computations >= 3 &&
        next.edgeCases.size >= 3 &&
        next.flashcardCompleted.size >= 9 &&
        next.guidedCompleted
    );

    return nextAch;
  }, []);

  const explorePreset = useCallback((id: string) => {
    setState((prev) => {
      if (prev.exploredPresets.has(id)) return prev;
      const exploredPresets = new Set(prev.exploredPresets);
      exploredPresets.add(id);
      const xp = prev.xp + 15;
      const next = { ...prev, exploredPresets, xp };
      return { ...next, achievements: checkAchievements(next) };
    });
  }, [checkAchievements]);

  const recordComputation = useCallback(() => {
    setState((prev) => {
      const computations = prev.computations + 1;
      const xp = prev.xp + 20;
      const next = { ...prev, computations, xp };
      return { ...next, achievements: checkAchievements(next) };
    });
  }, [checkAchievements]);

  const discoverEdgeCase = useCallback((type: string) => {
    setState((prev) => {
      if (prev.edgeCases.has(type)) return prev;
      const edgeCases = new Set(prev.edgeCases);
      edgeCases.add(type);
      const xp = prev.xp + 10;
      const next = { ...prev, edgeCases, xp };
      return { ...next, achievements: checkAchievements(next) };
    });
  }, [checkAchievements]);

  const recordChallenge = useCallback((correct: boolean) => {
    setState((prev) => {
      const challengeScore = prev.challengeScore + (correct ? 1 : 0);
      const challengeTotal = prev.challengeTotal + 1;
      const xp = prev.xp + (correct ? 25 : 5);
      const next = { ...prev, challengeScore, challengeTotal, xp };
      return { ...next, achievements: checkAchievements(next) };
    });
  }, [checkAchievements]);

  const completeFlashcard = useCallback((id: string) => {
    setState((prev) => {
      if (prev.flashcardCompleted.has(id)) return prev;
      const flashcardCompleted = new Set(prev.flashcardCompleted);
      flashcardCompleted.add(id);
      const xp = prev.xp + 5;
      const next = { ...prev, flashcardCompleted, xp };
      return { ...next, achievements: checkAchievements(next) };
    });
  }, [checkAchievements]);

  const advanceGuided = useCallback(() => {
    setState((prev) => ({ ...prev, guidedStep: prev.guidedStep + 1 }));
  }, []);

  const completeGuided = useCallback(() => {
    setState((prev) => {
      const xp = prev.xp + 50;
      const next = { ...prev, guidedCompleted: true, xp };
      return { ...next, achievements: checkAchievements(next) };
    });
  }, [checkAchievements]);

  const reset = useCallback(() => {
    setState(defaultState());
    setNewAchievement(null);
    if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return [state, { explorePreset, recordComputation, discoverEdgeCase, recordChallenge, completeFlashcard, advanceGuided, completeGuided, reset }, newAchievement];
}
