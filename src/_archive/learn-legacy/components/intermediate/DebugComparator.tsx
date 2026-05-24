"use client";

import React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";

export interface DebugComparatorProps {
  scenario: string;
  amateurOutput: {
    title: string;
    prediction: string;
    riskLevel: "low" | "medium" | "high";
  };
  professionalOutput: {
    title: string;
    prediction: string;
    overrideReason?: string;
  };
  whyItMatters: string;
  className?: string;
}

export default function DebugComparator({
  scenario,
  amateurOutput,
  professionalOutput,
  whyItMatters,
  className = "",
}: DebugComparatorProps) {
  const riskColors = {
    low: "bg-yellow-50 border-yellow-200 text-yellow-800",
    medium: "bg-orange-50 border-orange-200 text-orange-800",
    high: "bg-red-50 border-red-200 text-red-800",
  };

  const riskIcons = {
    low: <AlertTriangle className="w-4 h-4 text-yellow-600" />,
    medium: <AlertTriangle className="w-4 h-4 text-orange-600" />,
    high: <XCircle className="w-4 h-4 text-red-600" />,
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-gray-900">Debug Comparator</h3>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{scenario}</p>
      </div>

      {/* Split Screen */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
        {/* Amateur Side */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                Amateur App
              </span>
              <h4 className="font-bold text-red-900 text-sm">
                {amateurOutput.title}
              </h4>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border ${riskColors[amateurOutput.riskLevel]} mb-3`}
          >
            <div className="flex items-center gap-2 mb-2">
              {riskIcons[amateurOutput.riskLevel]}
              <span className="text-xs font-bold uppercase tracking-wider">
                Risk Level: {amateurOutput.riskLevel}
              </span>
            </div>
            <p className="text-sm font-medium leading-relaxed">
              {amateurOutput.prediction}
            </p>
          </div>
        </motion.div>

        {/* Professional Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Grahvani
              </span>
              <h4 className="font-bold text-emerald-900 text-sm">
                {professionalOutput.title}
              </h4>
            </div>
          </div>

          <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 mb-3">
            <p className="text-sm font-medium text-emerald-900 leading-relaxed">
              {professionalOutput.prediction}
            </p>
            {professionalOutput.overrideReason && (
              <div className="mt-3 pt-3 border-t border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                  Override Reason
                </span>
                <p className="text-xs text-emerald-800 mt-1">
                  {professionalOutput.overrideReason}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Why It Matters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-violet-50 border-t border-indigo-100"
      >
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              Why This Matters
            </span>
            <p className="text-sm text-indigo-900 mt-1 leading-relaxed">
              {whyItMatters}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
