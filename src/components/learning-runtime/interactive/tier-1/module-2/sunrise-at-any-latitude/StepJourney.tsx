"use client";

import { motion } from "framer-motion";

interface StepJourneyProps {
  currentStep: number; // 0-based, -1 means not started
  steps: string[];
}

export function StepJourney({ currentStep, steps }: StepJourneyProps) {
  const stepColors = ["#C28220", "#C28220", "#4A6FA5", "#4A6FA5", "#2F8C5A", "#2F8C5A", "#A23A1E"];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Connector line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5" style={{ backgroundColor: "var(--gl-ink-muted)", opacity: 0.15 }} />
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5"
          style={{ backgroundColor: "#C28220" }}
          animate={{ width: `${Math.max(0, Math.min(100, (currentStep / (steps.length - 1)) * 100))}%` }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0.24, 1] }}
        />

        {steps.map((label, i) => {
          const isActive = i === currentStep;
          const isCompleted = i < currentStep;
          return (
            <div key={i} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / steps.length}%` }}>
              <motion.div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: isCompleted || isActive ? stepColors[i] : "var(--gl-surface-2)",
                  color: isCompleted || isActive ? "#fff" : "var(--gl-ink-muted)",
                  border: isActive ? `2px solid ${stepColors[i]}` : "2px solid transparent",
                }}
                animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.6, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
              >
                {isCompleted ? "✓" : i + 1}
              </motion.div>
              <span
                className="text-[9px] mt-1 text-center leading-tight hidden sm:block"
                style={{
                  color: isActive || isCompleted ? stepColors[i] : "var(--gl-ink-muted)",
                  fontWeight: isActive ? 600 : 400,
                  opacity: isActive || isCompleted ? 1 : 0.6,
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
