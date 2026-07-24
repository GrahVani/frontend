"use client";

import { useEffect, useState } from "react";
import { useProgressStore } from "@/lib/learning-runtime/progress-store";
import { Lock, ArrowLeft, LayoutDashboard, ShieldAlert } from "lucide-react";
import Link from "next/link";

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

  useEffect(() => {
    if (isLessonLocked(prerequisites)) {
      setLocked(true);
    }
  }, [prerequisites, isLessonLocked]);

  if (!locked) return null;

  const firstPrereqUrl = prerequisites && prerequisites.length > 0 ? toCanonicalUrl(prerequisites[0]) : null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0C0A09] backdrop-blur-xl p-6">
      <div className="max-w-xl w-full mx-auto bg-gradient-to-b from-[#1E1A16] to-[#16120E] p-8 md:p-10 rounded-2xl border border-[#B27F44]/30 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D97706] via-[#FBBF24] to-[#D97706] opacity-80" />

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#78350F]/20 flex items-center justify-center mb-6 border border-[#B27F44]/30 shadow-[0_0_30px_rgba(217,119,6,0.15)]">
            <Lock className="w-10 h-10 text-[#F59E0B]" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-serif text-[#FEF3C7] mb-4 tracking-wide">
            Lesson Locked
          </h2>
          
          <p className="text-lg text-stone-300 mb-8 font-serif italic max-w-md leading-relaxed">
            You must achieve <strong className="text-[#FBBF24] font-semibold not-italic">Mastery</strong> in the prerequisite lesson before accessing this content.
          </p>

          <div className="bg-[#12100E] border border-[#B27F44]/20 rounded-xl p-5 mb-8 w-full text-left flex items-start gap-4">
             <ShieldAlert className="w-6 h-6 text-[#F59E0B] shrink-0 mt-0.5" />
             <div className="text-sm text-stone-300 leading-relaxed">
                <span className="block font-semibold text-[#FDE68A] mb-1 text-base">A note on Mastery:</span>
                The <strong className="text-stone-200">80% progress</strong> shown in the sidebar tracks your <em>reading</em>. 
                However, to unlock the next lesson, you must also pass the <strong className="text-[#FDE68A]">Practice Quiz</strong> at the bottom of the previous lesson with a score of <strong className="text-[#FDE68A]">80% or higher</strong>.
             </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            {firstPrereqUrl && (
              <Link
                href={firstPrereqUrl}
                className="flex-1 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] hover:from-[#F59E0B] hover:to-[#D97706] text-amber-950 font-bold tracking-wide flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(217,119,6,0.25)] hover:shadow-[0_4px_25px_rgba(217,119,6,0.4)]"
              >
                <ArrowLeft className="w-5 h-5" />
                Return to Prerequisite
              </Link>
            )}
            
            <Link
              href="/learn/dashboard"
              className="flex-1 w-full py-3.5 px-6 rounded-xl bg-stone-800/60 hover:bg-stone-800 border border-stone-700/80 text-stone-200 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5 opacity-70" />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
