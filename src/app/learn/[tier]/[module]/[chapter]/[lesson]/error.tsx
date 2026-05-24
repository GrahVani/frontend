/**
 * Lesson route error state — per design constitution §16.
 * Renders when an unhandled error escapes the page render.
 */

"use client";

import Link from "next/link";

export default function LessonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="gl-surface-night min-h-screen flex items-center justify-center px-6 py-12">
      <div
        className="gl-surface-twilight-glass p-8 space-y-4"
        style={{ maxWidth: "560px", borderColor: "rgba(200, 65, 46, 0.40)" }}
      >
        <h1
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "32px",
            fontWeight: 500,
            color: "var(--gl-vermilion-accent)",
            lineHeight: 1.2,
          }}
        >
          Something interrupted this lesson.
        </h1>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "18px",
            color: "var(--gl-ink-primary)",
            lineHeight: 1.55,
          }}
        >
          The runtime encountered an error while rendering the lesson. Your progress is safe — it lives in your browser&apos;s storage, not in the page.
        </p>
        <pre
          className="text-xs whitespace-pre-wrap p-3 rounded"
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
            color: "var(--gl-ink-muted)",
            background: "rgba(0, 0, 0, 0.25)",
            borderRadius: "6px",
            maxHeight: "160px",
            overflow: "auto",
          }}
        >
          {error.message}
          {error.digest && (
            <>
              {"\n\nDigest: "}
              {error.digest}
            </>
          )}
        </pre>
        <div className="flex gap-3 flex-wrap pt-2">
          <button
            onClick={reset}
            style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, var(--gl-dawn-from) 0%, var(--gl-dawn-to) 100%)",
              color: "var(--gl-ink-on-dawn-primary)",
              border: "none",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 600,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
          <Link
            href="/learn/design-sanity"
            style={{
              padding: "10px 24px",
              border: "1px solid var(--gl-gold-hairline)",
              borderRadius: "8px",
              fontSize: "15px",
              color: "var(--gl-ink-secondary)",
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Return to the design sanity check
          </Link>
        </div>
      </div>
    </div>
  );
}
