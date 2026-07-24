"use client";

import { useEffect, useState } from "react";
import { useProgressStore } from "@/lib/learning-runtime/progress-store";
import { Lock, ArrowLeft, LayoutDashboard, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LessonGuardProps {
  prerequisites: string[];
}

/** "tier-1/module-1/chapter-1/lesson-02-the-six-vedangas-and-their-relationship"
 *  → "/learn/tier-1/module-1/chapter-1/lesson-2"
 */
function toCanonicalUrl(slug: string): string {
  const parts = slug.split("/");
  const cleaned = parts.map((p) => {
    const m = p.match(/^(tier|module|chapter|lesson)-(\d+)/);
    if (m) {
      return `${m[1]}-${parseInt(m[2], 10)}`;
    }
    return p;
  });
  return `/learn/${cleaned.slice(0, 4).join("/")}`;
}

export function LessonGuard({ prerequisites }: LessonGuardProps) {
  const isLessonLocked = useProgressStore((state) => state.isLessonLocked);
  const [locked, setLocked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLessonLocked(prerequisites)) {
      setLocked(true);
    }
  }, [prerequisites, isLessonLocked]);

  if (!locked) return null;

  const prereqUrl = prerequisites && prerequisites.length > 0 ? toCanonicalUrl(prerequisites[0]) : null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0C0A09]/80 backdrop-blur-md px-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-b from-[#1C1A17] to-[#141210] p-1 shadow-2xl border border-white/5 ring-1 ring-white/10">
        
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-amber-500/10 blur-[80px]"></div>
        
        <div className="relative flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20">
            <Lock className="h-10 w-10 text-red-400" />
          </div>
          
          <h2 className="mb-3 font-serif text-3xl font-medium tracking-tight text-white">
            Lesson Locked
          </h2>
          
          <p className="mb-6 text-sm leading-relaxed text-zinc-400">
            You must demonstrate mastery before proceeding. Please complete the previous lesson and achieve a score of <span className="font-semibold text-amber-400">at least 80%</span> to unlock this content.
          </p>

          <div className="flex w-full flex-col gap-3">
            {prereqUrl ? (
              <button
                onClick={() => router.push(prereqUrl)}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500/10 px-4 py-3.5 text-sm font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20 transition-all hover:bg-amber-500/20 hover:ring-amber-500/30"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Go to Previous Lesson
              </button>
            ) : null}
            
            <button
              onClick={() => router.push("/learn")}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3.5 text-sm font-medium text-white ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10"
            >
              <LayoutDashboard className="h-4 w-4" />
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
