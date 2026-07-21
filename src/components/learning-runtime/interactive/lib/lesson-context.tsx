"use client";

import { createContext, useContext, type ReactNode } from "react";

export const LessonContext = createContext<{ slug: string }>({ slug: "" });

export function LessonProvider({ children, value }: { children: ReactNode; value: { slug: string } }) {
  return <LessonContext.Provider value={value}>{children}</LessonContext.Provider>;
}

export function useLessonSlug() {
  return useContext(LessonContext).slug;
}
