"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export interface ExceptionPhase {
  id: string;
  label: string;
  description: string;
  status: "pending" | "active" | "completed" | "failed";
}

export interface ExceptionHandlerFlowProps {
  phases: ExceptionPhase[];
}

const statusConfig = {
  pending: { icon: AlertCircle, color: "text-slate-400", bg: "bg-slate-50", border: "border-slate-200", dot: "bg-slate-300" },
  active: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-300", dot: "bg-amber-500 animate-pulse" },
  completed: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-300", dot: "bg-emerald-500" },
  failed: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-300", dot: "bg-red-500" },
};

export default function ExceptionHandlerFlow({ phases }: ExceptionHandlerFlowProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-teal-600" />
        </div>
        <h3 className="font-bold text-gray-900">Neecha Bhanga Exception Flow</h3>
      </div>
      <div className="space-y-3">
        {phases.map((phase, idx) => {
          const config = statusConfig[phase.status];
          const Icon = config.icon;
          const isLast = idx === phases.length - 1;
          return (
            <div key={phase.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${config.bg} ${config.border} border-2 flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                {!isLast && <div className="w-0.5 h-6 bg-slate-200 mt-1" />}
              </div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`flex-1 p-3 rounded-xl border ${config.border} ${config.bg}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className={`font-semibold text-sm ${config.color}`}>{phase.label}</h4>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/60 ${config.color}`}>
                    {phase.status}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{phase.description}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-gray-600">
        <strong className="text-gray-800">Flow Logic:</strong> Each check must pass sequentially. If any check fails, the chain terminates and debilitation stands. Only when ALL checks pass does Neecha Bhanga activate.
      </div>
    </div>
  );
}
