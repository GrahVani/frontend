"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProgressStore } from "@/lib/learning-runtime/progress-store";

interface LessonGuardProps {
  prerequisites: string[];
}

export function LessonGuard({ prerequisites }: LessonGuardProps) {
  const router = useRouter();
  const isLessonLocked = useProgressStore((state) => state.isLessonLocked);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (isLessonLocked(prerequisites)) {
      setLocked(true);
      // In a real implementation we would find the specific prerequisite that is missing
      // and route them there. For now, route back to the dashboard if locked.
      const timer = setTimeout(() => {
        router.push("/learn/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [prerequisites, isLessonLocked, router]);

  if (!locked) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-red-900 p-8 rounded-lg max-w-md text-center shadow-2xl">
        <div className="text-red-500 mb-4 flex justify-center">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-serif text-amber-500 mb-2">Lesson Locked</h2>
        <p className="text-slate-300 mb-6">
          You must master the prerequisite lessons (Score &gt;= 80%) before accessing this content.
        </p>
        <p className="text-slate-500 text-sm">
          Redirecting to dashboard...
        </p>
      </div>
    </div>
  );
}
