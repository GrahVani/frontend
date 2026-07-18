/**
 * Grahvani Learning — Layout primitives (Phase C-Reformed).
 * Mirrors §11.2 + §13 + §16 of frontend/docs/learning-module/00-design-constitution.md (v0.3 reformed).
 *
 * - <LessonShell>          3-column canvas (left rail + main + right marginalia)
 * - <LessonJourneyRail>    rich lesson-journey (imported from sibling file)
 * - <MuteToggle>           sound on/off (§7)
 * - <DawnCelebration>      mastery celebration surface placeholder
 * - <MasteryCelebration>   full §13.2 three-phase choreography (bloom + hold + recede)
 * - <OfflineChip>          persistent offline indicator (§16.5)
 */

"use client";

import { useEffect, useState, useRef, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Volume2, VolumeX, WifiOff } from "lucide-react";
import { isSoundMuted, setSoundMuted } from "@/design-tokens/grahvani-learning";
import { useProgressStore } from "@/lib/learning-runtime/progress-store";
import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";
import { LessonJourneyRail } from "./LessonJourneyRail";
import { SectionAwareMarginalia } from "./SectionAwareMarginalia";
import { TutorPanel } from "@/components/learning-runtime/tutor/TutorPanel";
import { useTutorStore } from "@/store/useTutorStore";
import { generateRecommendation } from "@/lib/learning-runtime/interactive/guidance-engine";

interface LessonShellProps {
  sections: LessonSection[];
  canonicalPath: string;
  frontMatter: LessonFrontMatter;
  children: ReactNode;
  /** Optional marginalia for the right column — per-section pull-quotes, term gloss, etc. */
  marginalia?: ReactNode;
}

export function LessonShell({
  sections,
  canonicalPath,
  frontMatter,
  children,
  marginalia,
}: LessonShellProps) {
  const lessonSlug = frontMatter.slug;
  const markSectionViewed = useProgressStore((s) => s.markSectionViewed);
  const lesson = useProgressStore((s) => s.lessons[lessonSlug]);

  const [activeSectionNumber, setActiveSectionNumber] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const previousCompletedAt = useRef<number | null>(null);

  // IntersectionObserver — track which section is currently in view; mark as viewed.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observers: IntersectionObserver[] = [];
    sections.forEach((s) => {
      const el = document.getElementById(`sec-${s.number}`);
      if (!el) return;
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSectionNumber(s.number);
            markSectionViewed(lessonSlug, s.number);
          }
        },
        { rootMargin: "-25% 0px -55% 0px", threshold: 0 },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, [sections, lessonSlug, markSectionViewed]);

  const syncLessonContext = useTutorStore((s) => s.syncLessonContext);
  const setCurrentLesson = useTutorStore((s) => s.setCurrentLesson);
  const setCurrentSection = useTutorStore((s) => s.setCurrentSection);
  const setInteractive = useTutorStore((s) => s.setInteractive);
  const clearLessonContext = useTutorStore((s) => s.clearLessonContext);

  // Sync lesson metadata to store
  useEffect(() => {
    syncLessonContext({
      slug: frontMatter.slug,
      title: frontMatter.title,
      learningOutcomes: frontMatter.learningOutcomes,
      prerequisites: frontMatter.prerequisites,
    });
    setCurrentLesson(frontMatter.slug);

    if (frontMatter.interactive?.enabled && frontMatter.interactive?.componentType) {
      setInteractive(frontMatter.interactive.componentType);
    } else {
      setInteractive(null);
    }

    return () => {
      clearLessonContext();
    };
  }, [frontMatter, syncLessonContext, setCurrentLesson, setInteractive, clearLessonContext]);

  // Sync current section scroll updates
  useEffect(() => {
    setCurrentSection(activeSectionNumber);

    // If active section has an interactive or is flagship (§7), update currentInteractive
    if (activeSectionNumber === "7" && frontMatter.interactive?.enabled && frontMatter.interactive?.componentType) {
      setInteractive(frontMatter.interactive.componentType);
    } else if (activeSectionNumber === "4" && frontMatter.interactive?.enabled && frontMatter.interactive?.componentType) {
      setInteractive(frontMatter.interactive.componentType);
    }
  }, [activeSectionNumber, frontMatter, setCurrentSection, setInteractive]);

  // Synchronize AI Tutor Guidance recommendations
  const setTutorRecommendation = useTutorStore((s) => s.setTutorRecommendation);
  const lessonContext = useTutorStore((s) => s.lessonContext);
  const interactiveContext = useTutorStore((s) => s.interactiveContext);
  const interactionState = useTutorStore((s) => s.interactionState);
  const sectionsViewed = lesson?.sectionsViewed || [];

  useEffect(() => {
    const rec = generateRecommendation(
      lessonContext,
      interactiveContext,
      interactionState,
      sectionsViewed,
      activeSectionNumber,
      sections
    );
    setTutorRecommendation(rec);
  }, [
    lessonContext,
    interactiveContext,
    interactionState,
    sectionsViewed,
    activeSectionNumber,
    sections,
    setTutorRecommendation
  ]);

  useEffect(() => {
    const current = lesson?.lessonCompletedAt ?? null;
    if (previousCompletedAt.current === null && current !== null) {
      if (Date.now() - current < 10000) {
        setShowCelebration(true);
      }
    }
    previousCompletedAt.current = current;
  }, [lesson?.lessonCompletedAt]);

  return (
    <div className="gl-surface-night min-h-screen" style={{ position: "relative" }}>
      {/* Top chrome — bridges Grahvani's brand header into the lesson canvas.
          top: 56px sits the bar directly below the fixed 56px-tall GRAHVANI
          brand header (h-14, z-50) so the bar is always visible and the lesson
          body underneath never disappears UNDER the brand header. */}
      <div
        style={{
          position: "sticky",
          top: "56px",
          zIndex: 10,
          background: "linear-gradient(180deg, rgba(255, 249, 234, 0.95) 0%, rgba(250, 239, 216, 0.88) 100%)",
          backdropFilter: "blur(16px) saturate(140%)",
          WebkitBackdropFilter: "blur(16px) saturate(140%)",
          boxShadow:
            "0 1px 0 rgba(255, 255, 255, 0.55) inset, 0 6px 24px rgba(62, 42, 31, 0.06), 0 -1px 0 rgba(139, 90, 43, 0.16) inset",
          borderBottom: "1px solid rgba(156, 122, 47, 0.20)",
        }}
      >
        <div
          className="mx-auto px-6 py-3 flex items-center justify-between"
          style={{ maxWidth: "1440px" }}
        >
          <div className="flex items-center gap-3">
            <Link
              href="/learn/design-sanity"
              className="text-sm hover:underline"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontWeight: 500,
                color: "var(--gl-ink-secondary)",
              }}
            >
              Learn
            </Link>
            <span style={{ color: "var(--gl-ink-muted)", fontSize: "14px" }}>·</span>
            <span
              style={{
                fontSize: "14px",
                color: "var(--gl-ink-muted)",
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
              }}
            >
              Tier {frontMatter.tier} · Module {frontMatter.module} · Chapter {frontMatter.chapter} · Lesson {frontMatter.sequence}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <OfflineChip />
            <span
              className="text-xs hidden lg:inline"
              style={{
                color: "var(--gl-ink-muted)",
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                opacity: 0.7,
                letterSpacing: "0.05em",
              }}
            >
              {frontMatter.title.split(":")[0]}
            </span>
            <MuteToggle />
          </div>
        </div>
      </div>

      {/* 3-column canvas — rail · main · marginalia.
          Grid CSS lives in BOTH src/app/globals.css (long-term home) and the
          inline <style> below (guaranteed delivery — Turbopack's CSS HMR can
          silently stall, so we keep the inline rules as belt-and-suspenders).
          Both copies must stay in sync if column widths change. */}
      <style>{`
        .gl-lesson-canvas {
          margin-left: auto;
          margin-right: auto;
          max-width: 1520px;
          padding: 28px 24px 64px;
        }
        .gl-lesson-grid {
          display: grid;
          gap: 32px;
          grid-template-columns: minmax(0, 1fr);
        }
        @media (min-width: 1024px) {
          .gl-lesson-grid {
            grid-template-columns: 218px minmax(0, 1fr);
            gap: 32px;
          }
        }
        @media (min-width: 1280px) {
          .gl-lesson-grid {
            grid-template-columns: 218px minmax(0, 1fr) 244px;
            gap: 36px;
          }
        }
        @media (min-width: 1536px) {
          .gl-lesson-grid {
            grid-template-columns: 224px minmax(0, 1fr) 252px;
            gap: 40px;
          }
        }
      `}</style>
      <div className="gl-lesson-canvas">
        <div className="gl-lesson-grid">
          {/* Left — Lesson Journey */}
          <aside
            className="hidden lg:block"
            style={{ position: "sticky", top: "116px", alignSelf: "flex-start", maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}
          >
            <LessonJourneyRail
              sections={sections}
              frontMatter={frontMatter}
              activeSectionNumber={activeSectionNumber}
            />
          </aside>

          {/* Main */}
          <main style={{ minWidth: 0 }}>{children}</main>

          {/* Right marginalia (XL only) — section-aware per Reform-8 */}
          <aside
            className="hidden xl:block"
            style={{ position: "sticky", top: "116px", alignSelf: "flex-start", maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}
          >
            {marginalia ?? (
              <SectionAwareMarginalia
                sections={sections}
                frontMatter={frontMatter}
                activeSectionNumber={activeSectionNumber}
              />
            )}
          </aside>
        </div>
      </div>

      {showCelebration && (
        <MasteryCelebration
          frontMatter={frontMatter}
          onDismiss={() => setShowCelebration(false)}
        />
      )}

      <TutorPanel lessonSlug={lessonSlug} sections={sections} />
    </div>
  );
}

/** Default right-column marginalia — placeholder until Reform-8 lands rich content per section. */
function DefaultMarginalia({
  frontMatter,
  activeSectionNumber,
}: {
  frontMatter: LessonFrontMatter;
  activeSectionNumber: string | null;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Lesson opening quote */}
      <div
        style={{
          padding: "16px 18px",
          background: "linear-gradient(180deg, rgba(255, 249, 234, 0.92) 0%, rgba(250, 239, 216, 0.85) 100%)",
          border: "1px solid rgba(156, 122, 47, 0.30)",
          borderRadius: "12px",
          boxShadow:
            "0 1px 0 rgba(255, 255, 255, 0.65) inset, 0 4px 12px rgba(62, 42, 31, 0.06)",
          position: "relative",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "10%",
            right: "10%",
            top: "-1px",
            height: "2px",
            background: "linear-gradient(to right, transparent, #A23A1E 30%, #C8412E 50%, #A23A1E 70%, transparent)",
            borderRadius: "999px",
          }}
        />
        <p
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#A23A1E",
            fontWeight: 700,
            marginBottom: "8px",
          }}
        >
          The eye of the Veda
        </p>
        <p
          lang="sa-Latn"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "20px",
            color: "var(--gl-ink-primary)",
            lineHeight: 1.4,
            marginBottom: "6px",
          }}
        >
          vedasya cakṣuḥ
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "15px",
            color: "var(--gl-ink-primary)",
            lineHeight: 1.55,
            fontWeight: 500,
          }}
        >
          The eye of the Veda — the metaphor Pāṇinīya Śikṣā gives to Jyotiṣa. Every other Vedāṅga is a sense-organ; Jyotiṣa is the one that sees time.
        </p>
      </div>

      {/* You are reading */}
      <div
        style={{
          padding: "14px 16px",
          background: "transparent",
          border: "1px dashed rgba(156, 122, 47, 0.30)",
          borderRadius: "10px",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--gl-ink-secondary)",
            fontWeight: 700,
            marginBottom: "6px",
          }}
        >
          You are reading
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "15px",
            color: "var(--gl-ink-primary)",
            fontStyle: "italic",
            lineHeight: 1.55,
            fontWeight: 500,
          }}
        >
          {activeSectionNumber ? `Section ${activeSectionNumber} of this lesson.` : "Loading your position…"}
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "var(--gl-ink-secondary)",
            marginTop: "6px",
            lineHeight: 1.55,
            fontWeight: 500,
          }}
        >
          Marginalia for each section land in Reform-8: pull-quotes, term glossary, source attribution, key-takeaway stickers.
        </p>
      </div>

      {/* Brand seal */}
      <div style={{ textAlign: "center", padding: "12px 0", opacity: 0.6 }}>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "14px",
            color: "var(--gl-ink-muted)",
            letterSpacing: "0.10em",
          }}
        >
          Grahvani · Tier {frontMatter.tier}
        </p>
        <p
          lang="sa"
          style={{
            fontFamily: "var(--font-devanagari), serif",
            fontSize: "14px",
            color: "var(--gl-gold-accent)",
            marginTop: "2px",
          }}
        >
          ज्योतिषं वेदस्य चक्षुः
        </p>
      </div>
    </div>
  );
}

export function MuteToggle() {
  const [muted, setMuted] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMuted(isSoundMuted());
    setHydrated(true);
  }, []);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Enable sound" : "Mute sound"}
      className="gl-clickable hover:border-[var(--gl-gold-accent)] hover:text-[var(--gl-gold-accent)]"
      style={{
        background: "transparent",
        border: "1px solid rgba(156, 122, 47, 0.30)",
        borderRadius: "50%",
        width: "32px",
        height: "32px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--gl-ink-secondary)",
        cursor: "pointer",
        opacity: hydrated ? 1 : 0,
      }}
    >
      {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
    </button>
  );
}

export function OfflineChip() {
  const [online, setOnline] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setOnline(navigator.onLine);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  if (!hydrated || online) return null;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "999px",
        background: "rgba(200, 65, 46, 0.15)",
        border: "1px solid rgba(200, 65, 46, 0.40)",
        fontSize: "14px",
        color: "var(--gl-ink-secondary)",
        fontFamily: "var(--font-cormorant), serif",
        fontStyle: "italic",
      }}
      role="status"
      aria-label="You are offline"
    >
      <WifiOff size={12} />
      Offline
    </div>
  );
}

interface DawnCelebrationProps {
  heading: string;
  subheading?: string;
}

export function DawnCelebration({ heading, subheading }: DawnCelebrationProps) {
  return (
    <div
      className="gl-surface-dawn p-10 text-center my-8"
      style={{ maxWidth: "640px", margin: "32px auto" }}
    >
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "40px",
          fontWeight: 500,
          color: "var(--gl-ink-on-dawn-primary)",
          marginBottom: subheading ? "8px" : 0,
          lineHeight: 1.2,
        }}
      >
        {heading}
      </p>
      {subheading && (
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "20px",
            fontStyle: "italic",
            color: "var(--gl-ink-on-dawn-primary)",
            opacity: 0.78,
          }}
        >
          {subheading}
        </p>
      )}
    </div>
  );
}

interface MasteryCelebrationProps {
  frontMatter: LessonFrontMatter;
  onDismiss: () => void;
}

function MasteryCelebration({ frontMatter, onDismiss }: MasteryCelebrationProps) {
  const [phase, setPhase] = useState<"bloom" | "hold" | "recede" | "done">("bloom");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("hold"), 500);
    const t2 = setTimeout(() => setPhase("recede"), 1100);
    const t3 = setTimeout(() => setPhase("done"), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(onDismiss, 100);
      return () => clearTimeout(t);
    }
  }, [phase, onDismiss]);

  const visible = phase !== "done";
  const opacity = phase === "bloom" ? 1 : phase === "hold" ? 1 : 0;
  const overlayOpacity = phase === "bloom" ? 0.18 : phase === "hold" ? 0.20 : 0;

  return (
    <div
      role="dialog"
      aria-live="assertive"
      aria-label={`Lesson mastered: ${frontMatter.title}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 250ms cubic-bezier(0.65, 0, 0.35, 1)",
        opacity,
      }}
      onClick={() => setPhase("done")}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(244, 199, 123, 0.55) 0%, rgba(232, 168, 92, 0.32) 40%, rgba(250, 239, 216, 0.92) 100%)",
          opacity: overlayOpacity * 5,
          transition: "opacity 400ms cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      />
      <div
        style={{
          position: "relative",
          textAlign: "center",
          padding: "48px 64px",
          maxWidth: "560px",
          transform: phase === "bloom" ? "scale(0.96)" : "scale(1)",
          transition: "transform 400ms cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        <Image
          src="/assets/learning/mandala-lesson-complete.svg"
          alt="Lesson mastered mandala mark"
          width={96}
          height={96}
          style={{
            display: "block",
            margin: "0 auto 24px",
            opacity: phase === "bloom" ? 0.6 : 1,
            transition: "opacity 400ms cubic-bezier(0.65, 0, 0.35, 1)",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "48px",
            fontWeight: 500,
            color: "var(--gl-ink-primary)",
            lineHeight: 1.1,
            marginBottom: "12px",
            letterSpacing: "0.005em",
          }}
        >
          Lesson mastered.
        </p>
        {frontMatter.titleDevanagari && (
          <p
            lang="sa"
            style={{
              fontFamily: "var(--font-devanagari), serif",
              fontSize: "20px",
              color: "var(--gl-gold-accent)",
              marginBottom: "4px",
              lineHeight: 1.5,
            }}
          >
            {frontMatter.titleDevanagari}
          </p>
        )}
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "22px",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.4,
          }}
        >
          {frontMatter.title}
        </p>
        <p
          className="mt-6 text-sm italic"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-muted)",
          }}
        >
          Tap anywhere to continue
        </p>
      </div>
    </div>
  );
}
