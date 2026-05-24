/**
 * §1 Cold Open — the full-bleed hook, Phase C-Reformed.
 *
 * The lesson opens cinematically: a large faint Devanāgarī character behind
 * the title carries the lesson's central word (ज्योतिष), gold-leaf top and
 * bottom filigree frames the canvas, the title cascades in display Cormorant
 * with Sanskrit subtitle, the hook prose drops in below with a gold dropcap.
 */

import { MarkdownContent } from "../MarkdownContent";
import { DropCap } from "../typography";
import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";

interface ColdOpenProps {
  frontMatter: LessonFrontMatter;
  section: LessonSection;
}

export function ColdOpen({ frontMatter: fm, section }: ColdOpenProps) {
  const trimmed = section.body.trim();
  const firstChar = trimmed.charAt(0);
  const rest = trimmed.slice(1);
  const firstParagraph = rest.split("\n\n")[0];
  const remaining = rest.split("\n\n").slice(1).join("\n\n");

  // Pick the first Devanāgarī word from the title for the backdrop.
  const backdropDeva = (fm.titleDevanagari ?? "ज्योतिष").split(/[\s—:]/)[0] || "ज्योतिष";

  return (
    <section
      id={`sec-${section.number}`}
      aria-labelledby={`sec-${section.number}-h`}
      className="py-5"
      style={{
        scrollMarginTop: "120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Backdrop layer — giant translucent Devanāgarī behind the title */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 0,
        }}
      >
        <span
          lang="sa"
          style={{
            fontFamily: "var(--font-devanagari), serif",
            fontSize: "clamp(220px, 28vw, 360px)",
            color: "#9C7A2F",
            opacity: 0.06,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            userSelect: "none",
          }}
        >
          {backdropDeva}
        </span>
      </div>

      {/* Soft warm radial light over the backdrop */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(244, 199, 123, 0.18) 0%, rgba(232, 168, 92, 0.06) 50%, transparent 80%)",
        }}
      />

      <div className="mx-auto" style={{ maxWidth: "820px", position: "relative", zIndex: 1 }}>
        {/* Top filigree frame */}
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(to right, transparent 0%, rgba(156, 122, 47, 0.30) 30%, rgba(201, 162, 77, 0.65) 50%, rgba(156, 122, 47, 0.30) 70%, transparent 100%)",
            }}
          />
          <svg width="46" height="14" viewBox="0 0 46 14" role="presentation">
            <g fill="#9C7A2F">
              <path d="M 4 7 L 8 4 L 12 7 L 8 10 Z" opacity="0.55" />
              <circle cx="23" cy="7" r="3.5" />
              <circle cx="23" cy="7" r="1.5" fill="#FFF9F0" />
              <path d="M 34 7 L 38 4 L 42 7 L 38 10 Z" opacity="0.55" />
            </g>
          </svg>
          <span
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(to left, transparent 0%, rgba(156, 122, 47, 0.30) 30%, rgba(201, 162, 77, 0.65) 50%, rgba(156, 122, 47, 0.30) 70%, transparent 100%)",
            }}
          />
        </div>

        {/* Eyebrow + tier/chapter context */}
        <p
          className="text-center"
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.20em",
            color: "#9C7A2F",
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            marginBottom: "16px",
          }}
        >
          Tier {fm.tier} · Module {fm.module} · Chapter {fm.chapter} · Lesson {fm.sequence}
        </p>

        {/* Devanāgarī subtitle line */}
        {fm.titleDevanagari && (
          <p
            lang="sa"
            className="text-center mb-4"
            style={{
              fontFamily: "var(--font-devanagari), serif",
              fontSize: "26px",
              lineHeight: 1.5,
              color: "#9C7A2F",
              fontWeight: 500,
            }}
          >
            {fm.titleDevanagari}
          </p>
        )}

        {/* Main English title — display Cormorant */}
        <h1
          id={`sec-${section.number}-h`}
          className="text-center"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 500,
            fontSize: "clamp(40px, 5.5vw, 60px)",
            lineHeight: 1.08,
            letterSpacing: "0.003em",
            color: "var(--gl-ink-primary)",
            marginBottom: "12px",
          }}
        >
          {fm.title}
        </h1>

        {/* Subtitle */}
        {fm.subtitle && (
          <p
            className="text-center mb-12"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "22px",
              color: "#A23A1E",
              lineHeight: 1.5,
              maxWidth: "560px",
              margin: "0 auto 40px",
            }}
          >
            {fm.subtitle}
          </p>
        )}

        {/* Bottom filigree frame */}
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "48px",
            opacity: 0.6,
          }}
        >
          <span
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(to right, transparent, rgba(156, 122, 47, 0.45) 50%, transparent)",
              maxWidth: "200px",
            }}
          />
          <svg width="14" height="14" viewBox="0 0 14 14" role="presentation">
            <circle cx="7" cy="7" r="2.5" fill="#9C7A2F" />
            <circle cx="7" cy="7" r="1" fill="#FFF9F0" />
          </svg>
          <span
            style={{
              flex: 1,
              height: "1px",
              background:
                "linear-gradient(to left, transparent, rgba(156, 122, 47, 0.45) 50%, transparent)",
              maxWidth: "200px",
            }}
          />
        </div>

        {/* Hook prose card — twilight glass with gold dropcap */}
        <div
          className="gl-surface-twilight-glass"
          style={{
            padding: "32px 40px",
            maxWidth: "640px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "21px",
              lineHeight: 1.7,
              color: "var(--gl-ink-primary)",
            }}
          >
            <DropCap letter={firstChar} />
            <span>{firstParagraph}</span>
            {remaining && (
              <div style={{ marginTop: "16px", fontSize: "20px" }}>
                <MarkdownContent>{remaining}</MarkdownContent>
              </div>
            )}
          </div>
        </div>

        {/* Scroll cue */}
        <div className="text-center mt-12">
          <a
            href={`#sec-2`}
            className="inline-flex flex-col items-center gap-2"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "14px",
              color: "var(--gl-ink-muted)",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            <span>begin the journey</span>
            <span
              aria-hidden="true"
              style={{
                width: "1px",
                height: "32px",
                background: "linear-gradient(to bottom, #9C7A2F, transparent)",
              }}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
