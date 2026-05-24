/**
 * Lesson route loading state — per design constitution §16.1.
 * Renders against Deep Night surface with a gently-pulsing mandala mark.
 */

import Image from "next/image";

export default function LessonLoading() {
  return (
    <div
      className="gl-surface-night min-h-screen flex items-center justify-center px-6"
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <Image
          src="/assets/learning/mandala-lesson-complete.svg"
          alt=""
          aria-hidden="true"
          width={64}
          height={64}
          style={{
            margin: "0 auto 24px",
            opacity: 0.5,
            animation: "gl-mandala-pulse 1800ms cubic-bezier(0.32, 0.72, 0.24, 1) infinite",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "20px",
            color: "var(--gl-gold-accent)",
            opacity: 0.7,
            lineHeight: 1.4,
          }}
        >
          Loading the sidereal sky…
        </p>
      </div>
      <style>{`
        @keyframes gl-mandala-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 0.75; transform: scale(1.04); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="gl-mandala-pulse"] {
            animation: none !important;
            opacity: 0.6 !important;
          }
        }
      `}</style>
    </div>
  );
}
