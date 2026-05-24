/**
 * §12 Continuation — bibliography + next-lesson ceremony.
 * Per design constitution §9.5.
 */

import Link from "next/link";
import { Bibliography } from "../reading";
import { SectionHeader } from "../SectionHeader";
import { presentationFor } from "../../lib/section-meta";
import { ArrowRight } from "lucide-react";
import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";

interface ContinuationProps {
  section: LessonSection;
  frontMatter: LessonFrontMatter;
}

export function Continuation({ section, frontMatter: fm }: ContinuationProps) {
  // Try to derive next lesson's URL from postrequisites (first entry).
  const nextSlug = fm.postrequisites[0];
  // postrequisites take the canonical-path form: "tier-1/module-1/chapter-1/lesson-02-…"
  // We strip the trailing slug part and reduce lesson-NN-* to just lesson-NN.
  const nextHref = nextSlug ? toCanonicalUrl(nextSlug) : null;

  return (
    <section
      id={`sec-${section.number}`}
      aria-labelledby={`sec-${section.number}-h`}
      className="mx-auto py-5"
      style={{ maxWidth: "880px", scrollMarginTop: "120px" }}
    >
      <div className="mb-6 text-center">
        {(() => {
          const pres = presentationFor(section);
          return (
            <SectionHeader
              eyebrow={pres.eyebrow}
              title={pres.embodiedTitle}
              accentHex={pres.accentHex}
              ornament={<ArrowRight size={16} />}
              align="center"
              size="compact"
            />
          );
        })()}
      </div>

      <Bibliography
        primary={fm.primarySources}
        modern={fm.modernSources}
      />

      {/* Ornament + label divider — between sources and next-lesson ceremony */}
      <div
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          margin: "36px auto 28px",
          maxWidth: "420px",
        }}
      >
        <span
          style={{
            flex: 1,
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(156, 122, 47, 0.45) 50%, rgba(232, 168, 92, 0.65))",
          }}
        />
        <svg width="14" height="14" viewBox="0 0 14 14">
          <g fill="#C9A24D">
            <circle cx="7" cy="7" r="3" />
            <circle cx="7" cy="7" r="1.2" fill="#FFF9F0" />
          </g>
        </svg>
        <span
          style={{
            flex: 1,
            height: "1px",
            background:
              "linear-gradient(to left, transparent, rgba(156, 122, 47, 0.45) 50%, rgba(232, 168, 92, 0.65))",
          }}
        />
      </div>

      {/* Next-lesson ceremony — elevated card with arrow CTA */}
      {nextHref ? (
        <article
          className="gl-surface-twilight-glass"
          style={{
            padding: "32px 40px 30px",
            textAlign: "center",
            position: "relative",
            maxWidth: "680px",
            margin: "0 auto",
            background:
              "linear-gradient(180deg, rgba(252, 230, 184, 0.40) 0%, rgba(244, 199, 123, 0.22) 100%), rgba(255, 252, 240, 0.92)",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "#9C7A2F",
              fontWeight: 700,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              marginBottom: "12px",
            }}
          >
            Now you are ready for
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "30px",
              fontWeight: 500,
              color: "var(--gl-ink-primary)",
              marginBottom: "24px",
              lineHeight: 1.25,
              letterSpacing: "0.003em",
            }}
          >
            {humaniseSlug(nextSlug)}
          </p>
          <Link
            href={nextHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "13px 30px",
              background: "linear-gradient(135deg, var(--gl-dawn-from) 0%, var(--gl-dawn-to) 100%)",
              color: "var(--gl-ink-on-dawn-primary)",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              textDecoration: "none",
              boxShadow: "0 8px 24px rgba(232, 168, 92, 0.28)",
              transition: "all 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
            }}
          >
            Begin the next lesson
            <ArrowRight size={15} strokeWidth={2.5} />
          </Link>
        </article>
      ) : (
        <p
          className="text-center"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "17px",
            color: "var(--gl-ink-muted)",
          }}
        >
          No next-lesson link declared in this lesson&apos;s front matter.
        </p>
      )}
    </section>
  );
}

/** "tier-1/module-1/chapter-1/lesson-02-the-six-vedangas-and-their-relationship"
 *  → "/learn/tier-1/module-1/chapter-1/lesson-2"
 */
function toCanonicalUrl(slug: string): string {
  const parts = slug.split("/");
  const cleaned = parts.map((p) => {
    const m = p.match(/^(tier|module|chapter|lesson)-(\d+)/);
    if (m) {
      // Strip leading zeros: lesson-02 → lesson-2
      return `${m[1]}-${parseInt(m[2], 10)}`;
    }
    return p;
  });
  return `/learn/${cleaned.slice(0, 4).join("/")}`;
}

/** Humanise the lesson slug for display: "lesson-02-the-six-vedangas-..." → "The Six Vedāṅgas and Their Relationship". */
function humaniseSlug(slug: string | undefined): string {
  if (!slug) return "Next lesson";
  const last = slug.split("/").pop() ?? "";
  const cleaned = last.replace(/^lesson-\d+-/, "").replace(/-/g, " ");
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}
