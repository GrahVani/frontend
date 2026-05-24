"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export interface ParadoxRule {
  planet: string;
  house: number;
  houseName: string;
  effect: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface ParadoxArrayCheckerProps {
  rules: ParadoxRule[];
}

const severityConfig = {
  low: { color: "bg-yellow-50 border-yellow-300 text-yellow-900", badge: "bg-yellow-200 text-yellow-800", label: "Low" },
  medium: { color: "bg-orange-50 border-orange-300 text-orange-900", badge: "bg-orange-200 text-orange-800", label: "Medium" },
  high: { color: "bg-red-50 border-red-300 text-red-900", badge: "bg-red-200 text-red-800", label: "High" },
  critical: { color: "bg-red-100 border-red-400 text-red-900", badge: "bg-red-300 text-red-900", label: "Critical" },
};

export default function ParadoxArrayChecker({ rules }: ParadoxArrayCheckerProps) {
  return (
    <div className="bg-white rounded-2xl border border-amber-200/60 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-amber-600" />
        <h3 className="font-bold text-gray-900">Karako Bhava Nashaya Array</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 px-3 text-xs font-bold text-slate-500 uppercase">Planet</th>
              <th className="text-left py-2 px-3 text-xs font-bold text-slate-500 uppercase">House</th>
              <th className="text-left py-2 px-3 text-xs font-bold text-slate-500 uppercase">Topic</th>
              <th className="text-left py-2 px-3 text-xs font-bold text-slate-500 uppercase">Effect</th>
              <th className="text-left py-2 px-3 text-xs font-bold text-slate-500 uppercase">Severity</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, idx) => {
              const config = severityConfig[rule.severity];
              return (
                <motion.tr
                  key={`${rule.planet}-${rule.house}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b border-slate-100 hover:bg-slate-50 transition-colors`}
                >
                  <td className="py-3 px-3 font-bold text-gray-900">{rule.planet}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                      {rule.house}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-600">{rule.houseName}</td>
                  <td className="py-3 px-3 text-gray-700 max-w-[200px]">{rule.effect}</td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.badge}`}>
                      {config.label}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-gray-600">
        <AlertTriangle className="w-4 h-4 text-amber-600 inline mr-1" />
        <strong className="text-amber-800">Rule:</strong> When a planet (Karaka) sits in the house it naturally signifies, it OVERLOADS that house and destroys its results. Exaltation makes this WORSE, not better.
      </div>
    </div>
  );
}
