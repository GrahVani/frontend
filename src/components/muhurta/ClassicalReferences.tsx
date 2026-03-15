"use client";

import React from "react";
import { BookOpen, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassicalReferencesProps {
  references: string[];
  notes?: string[];
  className?: string;
}

export default function ClassicalReferences({
  references,
  notes,
  className,
}: ClassicalReferencesProps) {
  const hasReferences = references.length > 0;
  const hasNotes = notes && notes.length > 0;

  if (!hasReferences && !hasNotes) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {/* References Section */}
      {hasReferences && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dark">
              Classical References
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
          </div>
          <div className="space-y-1.5">
            {references.map((ref, i) => (
              <div key={i} className="flex items-start gap-2">
                <BookOpen className="w-3.5 h-3.5 text-gold-dark mt-0.5 shrink-0" />
                <span className="text-[12px] text-ink/60 leading-relaxed italic font-serif">
                  {ref}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section */}
      {hasNotes && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-dark">
              Tradition Notes
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-gold-primary/20 to-transparent" />
          </div>
          <div className="space-y-1.5">
            {notes!.map((note, i) => (
              <div
                key={i}
                className="flex items-start gap-2 bg-parchment/50 rounded-lg px-3 py-2 border border-gold-primary/10"
              >
                <Info className="w-3.5 h-3.5 text-gold-dark mt-0.5 shrink-0" />
                <span className="text-[12px] text-ink/65 leading-relaxed">{note}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
