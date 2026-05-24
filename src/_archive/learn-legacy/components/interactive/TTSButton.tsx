"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";
import { useTTS } from "@/hooks/useTTS";

interface TTSButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "md";
  label?: string;
}

/** Strips markdown bold/italic/list markers for clean TTS narration */
function sanitizeForTTS(raw: string): string {
  return raw
    .replace(/\*\*\*?([^*]+)\*\*\*?/g, "$1")
    .replace(/\*\s+/g, "")
    .replace(/#{1,6}\s+/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export default function TTSButton({
  text,
  className = "",
  size = "sm",
  label = "Listen",
}: TTSButtonProps) {
  const { speaking, paused, supported, speak, stop, pause, resume } = useTTS();
  const cleanText = sanitizeForTTS(text);

  if (!supported) return null;

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const btnClasses =
    size === "sm"
      ? "px-2.5 py-1 text-[11px] gap-1"
      : "px-3 py-1.5 text-xs gap-1.5";

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <AnimatePresence mode="wait">
        {!speaking ? (
          <motion.button
            key="play"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            onClick={() => speak(cleanText, { rate: 0.95, lang: "en-IN" })}
            className={`inline-flex items-center rounded-lg bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 hover:border-amber-300 transition-colors font-medium ${btnClasses}`}
            title="Listen to this section"
          >
            <Volume2 className={iconSize} />
            <span>{label}</span>
          </motion.button>
        ) : (
          <motion.div
            key="controls"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="inline-flex items-center gap-1"
          >
            <button
              onClick={paused ? resume : pause}
              className={`inline-flex items-center rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors font-medium ${btnClasses}`}
              title={paused ? "Resume" : "Pause"}
            >
              {paused ? <Play className={iconSize} /> : <Pause className={iconSize} />}
              <span>{paused ? "Resume" : "Playing"}</span>
            </button>
            <button
              onClick={stop}
              className={`inline-flex items-center rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors font-medium ${btnClasses}`}
              title="Stop"
            >
              <VolumeX className={iconSize} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
