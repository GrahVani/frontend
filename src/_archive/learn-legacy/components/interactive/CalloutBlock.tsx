"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Zap, Lightbulb, AlertTriangle, Sparkles, BookOpen,
  type LucideIcon,
} from "lucide-react";

type CalloutVariant = "important" | "wisdom" | "mistake" | "tip" | "sanskrit";

interface CalloutBlockProps {
  variant: CalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_CONFIG: Record<
  CalloutVariant,
  {
    icon: LucideIcon;
    defaultTitle: string;
    containerClass: string;
    iconClass: string;
    titleClass: string;
    borderAccent: string;
  }
> = {
  important: {
    icon: Zap,
    defaultTitle: "Important Note",
    containerClass: "bg-white border-gray-200/60",
    iconClass: "text-amber-700 bg-amber-100",
    titleClass: "text-amber-800",
    borderAccent: "border-l-amber-500",
  },
  wisdom: {
    icon: Sparkles,
    defaultTitle: "Guru's Wisdom",
    containerClass: "bg-white border-gray-200/60",
    iconClass: "text-indigo-700 bg-indigo-100",
    titleClass: "text-indigo-800",
    borderAccent: "border-l-indigo-500",
  },
  mistake: {
    icon: AlertTriangle,
    defaultTitle: "Common Mistake",
    containerClass: "bg-white border-gray-200/60",
    iconClass: "text-red-600 bg-red-100",
    titleClass: "text-red-800",
    borderAccent: "border-l-red-500",
  },
  tip: {
    icon: Lightbulb,
    defaultTitle: "Pro Tip",
    containerClass: "bg-white border-gray-200/60",
    iconClass: "text-emerald-700 bg-emerald-100",
    titleClass: "text-emerald-800",
    borderAccent: "border-l-emerald-500",
  },
  sanskrit: {
    icon: BookOpen,
    defaultTitle: "Sanskrit Root",
    containerClass: "bg-white border-gray-200/60",
    iconClass: "text-violet-700 bg-violet-100",
    titleClass: "text-violet-800",
    borderAccent: "border-l-violet-500",
  },
};

export default function CalloutBlock({
  variant,
  title,
  children,
  className = "",
}: CalloutBlockProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`
        rounded-xl border shadow-sm ${config.containerClass}
        border-l-4 ${config.borderAccent}
        p-4 sm:p-5 ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.iconClass}`}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${config.titleClass}`}
          >
            {title || config.defaultTitle}
          </p>
          <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
