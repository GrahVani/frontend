"use client";

import { useCallback, useEffect, useState } from "react";
import type { DayType } from "../data";

const STORAGE_KEY = "grahvani-m2c4l1-interactive";

interface PersistedState {
  explored: DayType["key"][];
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
  explored: Set<DayType["key"]>;
  challengeScore: number;
  challengeTotal: number;
  flashcardCompleted: Set<string>;
  achievements: Set<string>;
  xp: number;
  guidedStep: number;
  guidedCompleted: boolean;
}

export interface ProgressActions {
  explore: (key: DayType["key"]) => void;
  recordChallenge: (correct: boolean) => void;
  completeFlashcard: (id: string) => void;
  advanceGuided: () => void;
  completeGuided: () => void;
  reset: () => void;
}

function defaultState(): ProgressState {
  return {
    explored: new Set(),
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
    explored: new Set(p.explored),
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
    explored: Array.from(s.explored),
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

  // Persist on change
  useEffect(() => {
    savePersisted(dehydrate(state));
  }, [state]);

  const checkAchievements = useCallback(
    (next: ProgressState): Set<string> => {
      const nextAch = new Set(next.achievements);
      const addIf = (id: string, condition: boolean) => {
        if (condition && !nextAch.has(id)) {
          nextAch.add(id);
          setNewAchievement(id);
          window.setTimeout(() => setNewAchievement(null), 4000);
        }
      };

      addIf("eye-of-time", next.explored.size >= 4);
      addIf("context-sage", next.challengeScore >= 10 && next.challengeTotal >= 10);
      addIf("sanskrit-scholar", next.flashcardCompleted.size >= 8);
      addIf("surya-siddhanta", next.guidedCompleted);
      addIf(
        "master-of-days",
        next.explored.size >= 4 &&
          next.challengeScore >= 10 &&
          next.flashcardCompleted.size >= 8 &&
          next.guidedCompleted
      );

      return nextAch;
    },
    []
  );

  const explore = useCallback((key: DayType["key"]) => {
    setState((prev) => {
      if (prev.explored.has(key)) return prev;
      const explored = new Set(prev.explored);
      explored.add(key);
      const xp = prev.xp + 10;
      const next = { ...prev, explored, xp };
      return { ...next, achievements: checkAchievements(next) };
    });
  }, [checkAchievements]);

  const recordChallenge = useCallback((correct: boolean) => {
    setState((prev) => {
      const challengeScore = prev.challengeScore + (correct ? 1 : 0);
      const challengeTotal = prev.challengeTotal + 1;
      const xp = prev.xp + (correct ? 20 : 5);
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
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return [state, { explore, recordChallenge, completeFlashcard, advanceGuided, completeGuided, reset }, newAchievement];
}
