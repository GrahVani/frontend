"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

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
      style={{ perspective: "1200px" }}
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
          className="relative rounded-2xl border-2 border-amber-200 bg-white px-6 py-7 flex flex-col items-center justify-center text-center shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          {card.category && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-3 px-3 py-1 bg-amber-100 rounded-full">
              {card.category}
            </span>
          )}
          <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-3">
            <span className="text-lg">❓</span>
          </div>
          <p className="text-lg font-bold text-gray-900 leading-snug">{card.front}</p>
          <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
            <RotateCcw className="w-3 h-3" />
            Tap to reveal
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-emerald-200 bg-white px-5 py-5 flex flex-col items-center shadow-lg overflow-y-auto"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-2 px-3 py-1 bg-emerald-100 rounded-full shrink-0">
            Answer
          </span>

          {isListAnswer ? (
            <div className="w-full space-y-1.5">
              {backItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-left"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-800 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-base font-medium text-gray-900 leading-relaxed text-center px-2">
              {card.back}
            </p>
          )}

          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5 shrink-0">
            <RotateCcw className="w-3 h-3" />
            Tap to flip back
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Flashcard carousel component with flip animation.
 * Supports multiple cards with navigation.
 */
export default function Flashcard({ cards, className = "" }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (cards.length === 0) return null;

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i + 1) % cards.length);
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((i) => (i - 1 + cards.length) % cards.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className={`${className}`}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <SingleFlashcard card={cards[currentIndex]} />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {cards.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={goPrev}
              className="p-2 rounded-xl bg-white border border-amber-200 hover:bg-amber-50 text-amber-700 transition-colors shadow-sm"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {cards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-amber-500 w-6"
                      : "bg-amber-200 hover:bg-amber-300"
                  }`}
                  aria-label={`Go to card ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="p-2 rounded-xl bg-white border border-amber-200 hover:bg-amber-50 text-amber-700 transition-colors shadow-sm"
              aria-label="Next card"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Counter */}
        <p className="text-center text-xs text-amber-400 mt-2">
          {currentIndex + 1} of {cards.length}
        </p>
      </div>
    </motion.div>
  );
}
