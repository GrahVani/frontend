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
    containerClass: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
    iconClass: "text-amber-600 bg-amber-100",
    titleClass: "text-amber-800",
    borderAccent: "border-l-amber-500",
  },
  wisdom: {
    icon: Sparkles,
    defaultTitle: "Guru's Wisdom",
    containerClass: "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200",
    iconClass: "text-indigo-600 bg-indigo-100",
    titleClass: "text-indigo-800",
    borderAccent: "border-l-indigo-500",
  },
  mistake: {
    icon: AlertTriangle,
    defaultTitle: "Common Mistake",
    containerClass: "bg-gradient-to-r from-red-50 to-orange-50 border-red-200",
    iconClass: "text-red-500 bg-red-100",
    titleClass: "text-red-800",
    borderAccent: "border-l-red-500",
  },
  tip: {
    icon: Lightbulb,
    defaultTitle: "Pro Tip",
    containerClass: "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200",
    iconClass: "text-emerald-600 bg-emerald-100",
    titleClass: "text-emerald-800",
    borderAccent: "border-l-emerald-500",
  },
  sanskrit: {
    icon: BookOpen,
    defaultTitle: "Sanskrit Root",
    containerClass: "bg-gradient-to-r from-violet-50 to-fuchsia-50 border-violet-200",
    iconClass: "text-violet-600 bg-violet-100",
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
        rounded-xl border ${config.containerClass}
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
