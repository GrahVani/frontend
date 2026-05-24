"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
  /** Color gradient for the progress bar */
  gradient?: string;
}

/**
 * Fixed top bar showing scroll progress through the lesson.
 * Uses Framer Motion's useScroll + useSpring for smooth animation.
 */
export default function ScrollProgress({
  gradient = "from-amber-400 via-orange-500 to-amber-600",
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1">
      <motion.div
        className={`h-full bg-gradient-to-r ${gradient} origin-left`}
        style={{ scaleX }}
      />
    </div>
  );
}
