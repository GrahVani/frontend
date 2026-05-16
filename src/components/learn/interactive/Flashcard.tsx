"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

interface FlashcardData {
  id: string | number;
  front: string;
  back: string;
  category?: string;
}

interface FlashcardProps {
  cards: FlashcardData[];
  className?: string;
}

function SingleFlashcard({ card }: { card: FlashcardData }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Parse list answers (e.g., "A · B · C") into visual items
  const backItems = card.back.includes("·")
    ? card.back.split("·").map((s) => s.trim()).filter(Boolean)
    : null;

  const isListAnswer = backItems && backItems.length > 1;

  return (
    <div
      className="relative w-full cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      aria-label={`Flashcard: ${card.front}. Click to ${isFlipped ? "see question" : "reveal answer"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      }}
    >
      <motion.div
        className="relative w-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="relative rounded-2xl border-2 border-amber-200 bg-white px-5 py-5 flex flex-col items-center justify-center text-center shadow-sm min-h-[180px]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {card.category && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
              {card.category}
            </span>
          )}
          <p className="text-base font-bold text-gray-900 leading-snug">{card.front}</p>
          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
            <RotateCcw className="w-3 h-3" />
            Tap to reveal
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-emerald-200 bg-white px-3 py-3 flex flex-col items-center justify-center shadow-sm overflow-y-auto"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-2 px-2.5 py-0.5 bg-emerald-50 rounded-full border border-emerald-100 shrink-0">
            Answer
          </span>

          {isListAnswer ? (
            <div className="w-full grid grid-cols-2 gap-2">
              {backItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[11px] font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-xs font-semibold text-gray-800 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm font-semibold text-gray-900 leading-relaxed text-center px-1">
              {card.back}
            </p>
          )}

          <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1 shrink-0">
            <RotateCcw className="w-3 h-3" />
            Tap to flip back
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Flashcard grid — all cards visible, each flips independently.
 */
export default function Flashcard({ cards, className = "" }: FlashcardProps) {
  if (cards.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className={`${className}`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <SingleFlashcard key={card.id} card={card} />
        ))}
      </div>
    </motion.div>
  );
}
