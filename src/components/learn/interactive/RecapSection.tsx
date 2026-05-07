"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

interface RecapItem {
  id: string | number;
  title: string;
  summary: string;
  icon?: React.ReactNode;
}

interface RecapSectionProps {
  items: RecapItem[];
  title?: string;
  className?: string;
}

/**
 * Animated recap section with staggered entrance.
 * Summarizes key concepts the learner has covered.
 */
export default function RecapSection({
  items,
  title = "What You Learned",
  className = "",
}: RecapSectionProps) {
  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 p-6 sm:p-8 text-white ${className}`}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <Sparkles className="w-5 h-5 text-amber-300" />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.4,
              delay: idx * 0.1,
              ease: "easeOut",
            }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                {item.icon || <CheckCircle2 className="w-4 h-4 text-amber-300" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-amber-200 leading-relaxed">{item.summary}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
