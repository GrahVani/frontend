"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Crown, User, ArrowRight } from "lucide-react";

export interface ChainNode {
  id: string;
  label: string;
  subtitle?: string;
  strength: "strong" | "medium" | "weak" | "broken";
  isCEO?: boolean;
  icon?: string;
}

export interface ChainTracerProps {
  nodes: ChainNode[];
  title?: string;
  subtitle?: string;
  animated?: boolean;
}

export default function ChainTracer({
  nodes,
  title = "Chain of Command",
  subtitle = "Trace the dispositor hierarchy",
  animated = true,
}: ChainTracerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDots, setShowDots] = useState(false);

  useEffect(() => {
    if (!animated) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % nodes.length);
      setShowDots(true);
      setTimeout(() => setShowDots(false), 1500);
    }, 2500);
    return () => clearInterval(interval);
  }, [nodes.length, animated]);

  const strengthColors = {
    strong: "bg-emerald-100 border-emerald-400 text-emerald-900",
    medium: "bg-blue-100 border-blue-400 text-blue-900",
    weak: "bg-amber-100 border-amber-400 text-amber-900",
    broken: "bg-red-100 border-red-400 text-red-900",
  };

  const strengthDotColors = {
    strong: "bg-emerald-500",
    medium: "bg-blue-500",
    weak: "bg-amber-500",
    broken: "bg-red-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-indigo-200/60 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-indigo-50 border-b border-indigo-100">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-indigo-900">{title}</h3>
            <p className="text-xs text-indigo-600">{subtitle}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Chain */}
        <div className="flex flex-col md:flex-row items-stretch gap-0">
          {nodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              {/* Node */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15 }}
                className={`relative flex-1 min-w-[140px] p-4 rounded-xl border-2 ${
                  strengthColors[node.strength]
                } ${idx === activeIndex && animated ? "ring-2 ring-indigo-400 ring-offset-2" : ""}`}
              >
                {/* Active Pulse */}
                {idx === activeIndex && animated && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-indigo-400/10"
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}

                <div className="relative">
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${strengthDotColors[node.strength]}`}
                      />
                      {node.isCEO ? (
                        <Crown className="w-4 h-4 text-amber-600" />
                      ) : (
                        <User className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    {node.isCEO && (
                      <span className="text-[9px] font-bold bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded-full uppercase">
                        CEO
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <h4 className="font-bold text-sm">{node.label}</h4>
                  {node.subtitle && (
                    <p className="text-xs opacity-80 mt-0.5">{node.subtitle}</p>
                  )}

                  {/* Strength Badge */}
                  <span
                    className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      node.strength === "strong"
                        ? "bg-emerald-200 text-emerald-800"
                        : node.strength === "medium"
                        ? "bg-blue-200 text-blue-800"
                        : node.strength === "weak"
                        ? "bg-amber-200 text-amber-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {node.strength}
                  </span>
                </div>
              </motion.div>

              {/* Connector */}
              {idx < nodes.length - 1 && (
                <div className="flex md:flex-col items-center justify-center py-2 md:py-0 md:px-2 relative">
                  <ArrowRight className="w-5 h-5 text-slate-300 md:hidden" />
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-slate-300" />
                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-90" />
                    <div className="w-0.5 h-4 bg-slate-300" />
                  </div>

                  {/* Animated Resource Dot */}
                  <AnimatePresence>
                    {showDots && idx === activeIndex && (
                      <motion.div
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute"
                      >
                        <motion.div
                          animate={{
                            x: [0, 40],
                            y: [0, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                          }}
                          className="w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-5 flex flex-wrap items-center gap-4 text-[10px] text-slate-500">
          <span className="font-bold uppercase tracking-wider">Strength:</span>
          {(["strong", "medium", "weak", "broken"] as const).map((s) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${strengthDotColors[s]}`} />
              <span className="capitalize">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
