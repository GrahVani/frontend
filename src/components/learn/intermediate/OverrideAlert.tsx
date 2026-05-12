"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Zap,
} from "lucide-react";

export interface OverridePhase {
  label: string;
  description: string;
  status: "pending" | "active" | "completed";
}

export interface OverrideAlertProps {
  triggerCondition: string;
  phases: OverridePhase[];
  finalOutput: {
    title: string;
    message: string;
    type: "success" | "warning" | "info";
  };
  title?: string;
}

export default function OverrideAlert({
  triggerCondition,
  phases,
  finalOutput,
  title = "Exception Handler",
}: OverrideAlertProps) {
  const [expanded, setExpanded] = useState(true);

  const statusColors = {
    pending: "bg-slate-100 text-slate-500 border-slate-200",
    active: "bg-amber-100 text-amber-700 border-amber-300",
    completed: "bg-emerald-100 text-emerald-700 border-emerald-300",
  };

  const statusIcons = {
    pending: <div className="w-4 h-4 rounded-full border-2 border-slate-300" />,
    active: (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Zap className="w-4 h-4 text-amber-600" />
      </motion.div>
    ),
    completed: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          <div className="text-left">
            <h3 className="font-bold text-red-900">{title}</h3>
            <p className="text-xs text-red-600 mt-0.5">
              Trigger: {triggerCondition}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-red-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-red-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-5">
              {/* Alert Banner */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200 mb-5"
              >
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                    Critical Condition Detected
                  </span>
                  <p className="text-sm text-red-900 mt-1">{triggerCondition}</p>
                </div>
              </motion.div>

              {/* Phases */}
              <div className="space-y-3 mb-5">
                {phases.map((phase, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${statusColors[phase.status]}`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {statusIcons[phase.status]}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Phase {idx + 1}: {phase.label}
                      </span>
                      <p className="text-sm mt-1 opacity-90">
                        {phase.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Animated Transition */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: phases.length * 0.15 + 0.3 }}
                className="flex items-center justify-center py-2"
              >
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6 text-slate-300 rotate-90" />
                </motion.div>
              </motion.div>

              {/* Final Output */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: phases.length * 0.15 + 0.5 }}
                className={`p-4 rounded-xl border-2 ${
                  finalOutput.type === "success"
                    ? "bg-emerald-50 border-emerald-300"
                    : finalOutput.type === "warning"
                    ? "bg-amber-50 border-amber-300"
                    : "bg-blue-50 border-blue-300"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2
                    className={`w-5 h-5 ${
                      finalOutput.type === "success"
                        ? "text-emerald-600"
                        : finalOutput.type === "warning"
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`}
                  />
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      finalOutput.type === "success"
                        ? "text-emerald-700"
                        : finalOutput.type === "warning"
                        ? "text-amber-700"
                        : "text-blue-700"
                    }`}
                  >
                    {finalOutput.title}
                  </span>
                </div>
                <p
                  className={`text-sm font-semibold leading-relaxed ${
                    finalOutput.type === "success"
                      ? "text-emerald-900"
                      : finalOutput.type === "warning"
                      ? "text-amber-900"
                      : "text-blue-900"
                  }`}
                >
                  {finalOutput.message}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper icon component
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
