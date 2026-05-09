"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";

export interface ForwardReference {
  topic: string;
  detailInModule?: number;
  detailInLesson?: string;
  message: string;
}

interface ForwardReferenceBannerProps {
  reference: ForwardReference;
  className?: string;
}

export default function ForwardReferenceBanner({
  reference,
  className = "",
}: ForwardReferenceBannerProps) {
  const moduleLabel = reference.detailInModule
    ? `Module ${reference.detailInModule}`
    : reference.detailInLesson
    ? `Lesson ${reference.detailInLesson}`
    : "a later chapter";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`rounded-xl border border-gray-200/60 border-l-4 border-l-sky-400 bg-white shadow-sm p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 text-sky-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-sky-700 mb-1">
            Coming Up Later
          </p>
          <p className="text-sm text-sky-900 leading-relaxed">
            {reference.message}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 bg-white/60 px-2.5 py-1 rounded-full border border-sky-100">
            <span>{reference.topic}</span>
            <ArrowRight className="w-3 h-3" />
            <span>{moduleLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
