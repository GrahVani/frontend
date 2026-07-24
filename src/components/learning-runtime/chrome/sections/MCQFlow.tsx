/**
 * §10 MCQ Flow — full mastery gate per v0.2 §12.
 *
 * State machine:
 *  - idle              "Begin the quiz" button (when not on cooldown)
 *  - cooldown          countdown screen with missed-question review
 *  - answering         one question per screen with right/wrong feedback
 *  - completed-pass    Dawn Accent "Mastered." celebration
 *
 * Persists attempt history and cooldown timestamp via the progress store
 * (zustand + localStorage). Per v0.2 §12.6 server-side enforcement is
 * additionally required when learning-service is wired in B6.
 */

"use client";

import { useState, useEffect } from "react";
import { Check, X, FileQuestion, ChevronRight, Clock, RotateCcw } from "lucide-react";
import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";
import type { McqBank, McqQuestion } from "@/lib/learning-runtime/mcq-types";
import { useProgressStore, COOLDOWN_HOURS, PASS_THRESHOLD } from "@/lib/learning-runtime/progress-store";
import { submitLessonQuiz, type QuizAnswer } from "@/lib/api/learning";
import { getUserIdFromCurrentToken } from "@/lib/api/jwt";
import { ApiError } from "@/lib/api/core";
import { enqueueMutation } from "@/lib/learning-runtime/mutation-queue";
import { Citation } from "../reading";
import { renderInline } from "../lib/inline-markdown";
import { useTutorStore } from "@/store/useTutorStore";

interface MCQFlowProps {
  section: LessonSection;
  frontMatter: LessonFrontMatter;
  bank: McqBank | null;
}

type FlowPhase = "idle" | "cooldown" | "answering" | "completed-pass";

export function MCQFlow({ section, frontMatter: fm, bank }: MCQFlowProps) {
  const lessonSlug = fm.slug;
  const recordAttempt = useProgressStore((s) => s.recordAttempt);
  const resetLesson = useProgressStore((s) => s.resetLesson);
  const isOnCooldown = useProgressStore((s) => s.isOnCooldown);
  const cooldownRemainingMs = useProgressStore((s) => s.cooldownRemainingMs);
  const lesson = useProgressStore((s) => s.lessons[lessonSlug]);
  const setQuizAttemptContext = useTutorStore((s) => s.setQuizAttemptContext);

  const [phase, setPhase] = useState<FlowPhase>("idle");
  const [currentIdx, setCurrentIdx] = useState(0);
  /** Per-question chosen-option id. */
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // Hydrate phase from store after mount so SSR doesn't differ from CSR
  useEffect(() => {
    setHydrated(true);
    if (!bank) {
      setPhase("idle");
      return;
    }
    if (isOnCooldown(lessonSlug)) {
      setPhase("cooldown");
    } else if (lesson?.masteryStatus === "Mastered") {
      setPhase("completed-pass");
    } else {
      setPhase("idle");
    }
  }, [lessonSlug, bank, isOnCooldown, lesson?.masteryStatus]);

  if (!bank || bank.questions.length === 0) {
    return (
      <section
        id={`sec-${section.number}`}
        className="mx-auto py-5"
        style={{ maxWidth: "880px", scrollMarginTop: "120px" }}
      >
        <SectionHeader number={section.number} title={section.title} />
        <div className="gl-surface-twilight-glass p-8 text-center">
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "18px",
              color: "var(--gl-ink-muted)",
            }}
          >
            MCQ bank not loaded for this lesson.
          </p>
        </div>
      </section>
    );
  }

  const startQuiz = () => {
    setCurrentIdx(0);
    setSelections({});
    setPhase("answering");
  };

  const handlePracticeAgain = () => {
    resetLesson(lessonSlug);
    setCurrentIdx(0);
    setSelections({});
    setShowReview(false);
    setPhase("idle");
  };

  const finishQuiz = async () => {
    // Compute local grade so we can: (a) seed the store optimistically, (b)
    // fall back gracefully if the server is unreachable.
    const wrong: string[] = [];
    let correct = 0;
    const failedQuestionsData: Array<{ question: string; chosenAnswer: string; correctAnswer: string; }> = [];

    for (const q of bank.questions) {
      const chosen = selections[q.id];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (chosen && correctOpt && chosen === correctOpt.id) {
        correct += 1;
      } else {
        wrong.push(q.id);
        const chosenOpt = q.options.find((o) => o.id === chosen);
        failedQuestionsData.push({
          question: q.stem,
          chosenAnswer: chosenOpt?.text || "No answer chosen",
          correctAnswer: correctOpt?.text || "Unknown correct answer",
        });
      }
    }
    const localScorePct = Math.round((correct / bank.questions.length) * 100);

    const quizContext = {
      score: localScorePct,
      totalQuestions: bank.questions.length,
      failedQuestions: failedQuestionsData
    };
    setQuizAttemptContext(quizContext);

    // Optimistic local write so the UI doesn't stall on the round-trip.
    recordAttempt(lessonSlug, localScorePct, wrong);

    // Server submission — authoritative grader.
    const userId = getUserIdFromCurrentToken();
    if (!userId) {
      // No identity → keep local-only behavior.
      setPhase(localScorePct >= PASS_THRESHOLD * 100 ? "completed-pass" : "cooldown");
      return;
    }

    // Build server-shaped answer payload from selections.
    const answers: QuizAnswer[] = bank.questions.map((q) => ({
      questionId: q.id,
      answer: selections[q.id] ?? "",
      timeSpentSeconds: 0,
    }));

    try {
      const result = await submitLessonQuiz(lessonSlug, { userId, answers });
      // Server is the source of truth — reconcile mastery decision back into the store.
      // If the server says we passed AND the store says we didn't (or vice versa),
      // re-record with the server's verdict so UI matches authoritative state.
      const serverScore = result.score;
      const serverWrong = result.questionResults.filter((qr) => !qr.isCorrect).map((qr) => qr.questionId);
      if (Math.abs(serverScore - localScorePct) > 0.5 || result.passed !== localScorePct >= PASS_THRESHOLD * 100) {
        recordAttempt(lessonSlug, serverScore, serverWrong);
      }
      setPhase(result.passed ? "completed-pass" : "cooldown");
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        // Server-enforced cooldown — surface it.
        setPhase("cooldown");
        return;
      }
      // Server unreachable — enqueue for later sync, then degrade UI to local grade.
      enqueueMutation({
        kind: "submit-lesson",
        slug: lessonSlug,
        payload: { userId, answers },
        enqueuedAt: Date.now(),
        attempts: 0,
      });
      setPhase(localScorePct >= PASS_THRESHOLD * 100 ? "completed-pass" : "cooldown");
    }
  };

  return (
    <section
      id={`sec-${section.number}`}
      aria-labelledby={`sec-${section.number}-h`}
      className="mx-auto py-5"
      style={{ maxWidth: "880px", scrollMarginTop: "120px" }}
    >
      <SectionHeader number={section.number} title={section.title} />

      {!hydrated && (
        <div className="gl-surface-twilight-glass p-8 text-center" style={{ minHeight: "240px" }}>
          <p style={{ color: "var(--gl-ink-muted)", fontStyle: "italic" }}>Loading…</p>
        </div>
      )}

      {hydrated && phase === "idle" && (
        <IdleScreen
          bank={bank}
          attemptCount={lesson?.attempts.length ?? 0}
          onStart={startQuiz}
        />
      )}

      {hydrated && phase === "cooldown" && (
        <CooldownScreen
          bank={bank}
          remainingMs={cooldownRemainingMs(lessonSlug)}
          lastAttempt={lesson?.attempts[lesson.attempts.length - 1]}
        />
      )}

      {hydrated && phase === "answering" && (
        <AnsweringScreen
          bank={bank}
          currentIdx={currentIdx}
          selections={selections}
          onSelect={(qid, oid) => setSelections((s) => ({ ...s, [qid]: oid }))}
          onNext={() => {
            if (currentIdx + 1 >= bank.questions.length) {
              void finishQuiz();
            } else {
              setCurrentIdx(currentIdx + 1);
            }
          }}
        />
      )}

      {hydrated && phase === "completed-pass" && lesson && (
        showReview ? (
          <ReviewScreen
            bank={bank}
            onBack={() => setShowReview(false)}
            onPracticeAgain={handlePracticeAgain}
          />
        ) : (
          <PassScreen
            bank={bank}
            lastAttempt={lesson.attempts[lesson.attempts.length - 1]}
            onPracticeAgain={handlePracticeAgain}
            onReview={() => setShowReview(true)}
          />
        )
      )}
    </section>
  );
}

function SectionHeader({}: { number?: string; title?: string }) {
  // Practice uses Śani indigo accent per Reform-2.
  return (
    <header className="mb-6 text-center">
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            color: "#2C2C3E",
          }}
        >
          <FileQuestion size={16} />
        </span>
        <span
          style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "0.16em",
            color: "#2C2C3E",
            fontWeight: 700,
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Practice
        </span>
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "32px",
            height: "1px",
            background: "linear-gradient(to right, #2C2C3E, transparent)",
            marginLeft: "4px",
          }}
        />
      </div>
      <h2
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "26px",
          fontWeight: 500,
          color: "var(--gl-ink-primary)",
          lineHeight: 1.2,
        }}
      >
        Test what you know
      </h2>
    </header>
  );
}

/* ───────────────── Idle ─────────────────────────────────────── */

function IdleScreen({
  bank,
  attemptCount,
  onStart,
}: {
  bank: McqBank;
  attemptCount: number;
  onStart: () => void;
}) {
  return (
    <div className="gl-surface-twilight-glass p-10 text-center flex flex-col items-center gap-4">
      <FileQuestion size={36} style={{ color: "var(--gl-gold-accent)" }} />
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "22px",
          fontWeight: 500,
          color: "var(--gl-ink-primary)",
          lineHeight: 1.4,
        }}
      >
        {attemptCount === 0
          ? `Test yourself with ${bank.questions.length} questions.`
          : `Retake the quiz · ${bank.questions.length} questions`}
      </p>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          fontSize: "15px",
          color: "var(--gl-ink-secondary)",
          lineHeight: 1.7,
          textAlign: "left",
          maxWidth: "440px",
        }}
      >
        <li style={{ display: "flex", gap: "10px", marginBottom: "4px" }}>
          <span style={{ color: "var(--gl-gold-accent)" }}>·</span>
          <span>
            Each question explains{" "}
            <em style={{ fontFamily: "var(--font-cormorant), serif" }}>why right is right</em> and{" "}
            <em style={{ fontFamily: "var(--font-cormorant), serif" }}>why each wrong is wrong</em>.
          </span>
        </li>
        <li style={{ display: "flex", gap: "10px", marginBottom: "4px" }}>
          <span style={{ color: "var(--gl-gold-accent)" }}>·</span>
          <span>Score 80% or more to mark this lesson mastered.</span>
        </li>
        <li style={{ display: "flex", gap: "10px" }}>
          <span style={{ color: "var(--gl-gold-accent)" }}>·</span>
          <span>If you don&apos;t pass, the next attempt unlocks in {COOLDOWN_HOURS} hours.</span>
        </li>
      </ul>
      <button
        onClick={onStart}
        className="gl-clickable"
        style={{
          marginTop: "8px",
          padding: "12px 32px",
          background: "linear-gradient(135deg, var(--gl-dawn-from) 0%, var(--gl-dawn-to) 100%)",
          color: "var(--gl-ink-on-dawn-primary)",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: 600,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          cursor: "pointer",
          boxShadow: "0 8px 32px rgba(232, 168, 92, 0.20)",
          transition: "all 150ms cubic-bezier(0.32, 0.72, 0.24, 1)",
        }}
      >
        Begin the quiz
      </button>
    </div>
  );
}

/* ───────────────── Answering ─────────────────────────────── */

const SHANI_INDIGO = "#3A4B7C";

function AnsweringScreen({
  bank,
  currentIdx,
  selections,
  onSelect,
  onNext,
}: {
  bank: McqBank;
  currentIdx: number;
  selections: Record<string, string>;
  onSelect: (questionId: string, optionId: string) => void;
  onNext: () => void;
}) {
  const q = bank.questions[currentIdx];
  const chosenId = selections[q.id];
  const chosenOption = chosenId ? q.options.find((o) => o.id === chosenId) ?? null : null;
  const correctOption = q.options.find((o) => o.isCorrect) ?? null;
  const isChecked = chosenId !== undefined;
  const isCorrect = isChecked && chosenOption?.isCorrect === true;

  const [submitted, setSubmitted] = useState(false);

  // Reset submitted state when question changes
  useEffect(() => {
    setSubmitted(false);
  }, [currentIdx]);

  const handleCheck = () => {
    if (!chosenId) return;
    setSubmitted(true);
  };

  const handleContinue = () => {
    setSubmitted(false);
    onNext();
  };

  return (
    <div>
      {/* Progress dot strip + metadata pill — visual replacement for the text "Question X of N" */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div
          role="progressbar"
          aria-valuenow={currentIdx + 1}
          aria-valuemin={1}
          aria-valuemax={bank.questions.length}
          aria-label={`Question ${currentIdx + 1} of ${bank.questions.length}`}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          {bank.questions.map((_, i) => {
            const isPast = i < currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <span
                key={i}
                aria-hidden="true"
                style={{
                  width: isCurrent ? "22px" : "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: isCurrent
                    ? SHANI_INDIGO
                    : isPast
                      ? `${SHANI_INDIGO}88`
                      : `${SHANI_INDIGO}26`,
                  transition: "all 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                }}
              />
            );
          })}
        </div>
        <span
          style={{
            fontSize: "14px",
            color: "var(--gl-ink-muted)",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            letterSpacing: "0.06em",
          }}
        >
          {currentIdx + 1} <span style={{ opacity: 0.5 }}>of</span> {bank.questions.length}
        </span>
        {(q.bloomLevel || q.difficulty) && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "999px",
              background: `${SHANI_INDIGO}14`,
              border: `1px solid ${SHANI_INDIGO}33`,
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: SHANI_INDIGO,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontWeight: 600,
            }}
          >
            {q.bloomLevel ?? ""}
            {q.bloomLevel && q.difficulty && <span style={{ opacity: 0.5 }}>·</span>}
            <span style={{ fontWeight: 500 }}>{q.difficulty ?? ""}</span>
          </span>
        )}
      </div>

      {/* Practice scroll panel — corner ornaments + top filigree, like the contract */}
      <div
        className="gl-surface-twilight-glass"
        style={{
          padding: "32px 36px 28px",
          position: "relative",
          overflow: "hidden",
          minHeight: "400px",
        }}
      >
        {/* Top filigree */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "12px",
            left: "32px",
            right: "32px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              flex: 1,
              height: "1px",
              background: `linear-gradient(to right, transparent, ${SHANI_INDIGO}55 50%, transparent)`,
            }}
          />
          <svg width="24" height="8" viewBox="0 0 24 8" role="presentation">
            <g fill={SHANI_INDIGO}>
              <circle cx="3" cy="4" r="1.4" opacity="0.5" />
              <circle cx="12" cy="4" r="2" />
              <circle cx="12" cy="4" r="0.8" fill="#FFF9F0" />
              <circle cx="21" cy="4" r="1.4" opacity="0.5" />
            </g>
          </svg>
          <span
            style={{
              flex: 1,
              height: "1px",
              background: `linear-gradient(to left, transparent, ${SHANI_INDIGO}55 50%, transparent)`,
            }}
          />
        </div>

        <PracticeCornerOrnament accent={SHANI_INDIGO} corner="tl" />
        <PracticeCornerOrnament accent={SHANI_INDIGO} corner="tr" />
        <PracticeCornerOrnament accent={SHANI_INDIGO} corner="bl" />
        <PracticeCornerOrnament accent={SHANI_INDIGO} corner="br" />

        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-ink-primary)",
            lineHeight: 1.4,
            marginTop: "16px",
            marginBottom: "20px",
            letterSpacing: "0.003em",
          }}
        >
          {renderInline(q.stem)}
        </p>
        {q.stemDevanagari && (
          <p
            lang="sa"
            style={{
              fontFamily: "var(--font-devanagari), serif",
              fontSize: "22px",
              color: "var(--gl-ink-secondary)",
              marginBottom: "16px",
              lineHeight: 1.5,
            }}
          >
            {q.stemDevanagari}
          </p>
        )}

        {/* Decorative rule with central dot */}
        <div
          aria-hidden="true"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            margin: "0 auto 24px",
            maxWidth: "180px",
            opacity: 0.6,
          }}
        >
          <span
            style={{
              flex: 1,
              height: "1px",
              background: `linear-gradient(to right, transparent, ${SHANI_INDIGO}66)`,
            }}
          />
          <span
            style={{
              width: "5px",
              height: "5px",
              borderRadius: "50%",
              background: SHANI_INDIGO,
            }}
          />
          <span
            style={{
              flex: 1,
              height: "1px",
              background: `linear-gradient(to left, transparent, ${SHANI_INDIGO}66)`,
            }}
          />
        </div>

        <div className="space-y-3">
          {q.options.map((opt) => (
            <OptionCard
              key={opt.id}
              option={opt}
              selected={chosenId === opt.id}
              submitted={submitted}
              correctOptionId={correctOption?.id ?? null}
              disabled={submitted}
              onClick={() => !submitted && onSelect(q.id, opt.id)}
            />
          ))}
        </div>

        {/* Feedback after submission */}
        {submitted && (
          <ExplanationCard
            question={q}
            chosenOption={chosenOption}
            isCorrect={isCorrect}
          />
        )}

        {/* Action row — full-width primary CTA + remaining counter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "24px",
            paddingTop: "18px",
            borderTop: "1px solid rgba(156, 122, 47, 0.18)",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "14px",
              color: "var(--gl-ink-muted)",
              margin: 0,
            }}
          >
            {bank.questions.length - currentIdx - 1 === 0
              ? "last question"
              : `${bank.questions.length - currentIdx - 1} question${bank.questions.length - currentIdx - 1 === 1 ? "" : "s"} after this`}
          </p>
          <button
            onClick={submitted ? handleContinue : handleCheck}
            disabled={!isChecked}
            className="gl-clickable"
            style={{
              padding: "11px 30px",
              background: !isChecked
                ? "rgba(58, 75, 124, 0.08)"
                : submitted
                  ? `linear-gradient(135deg, ${SHANI_INDIGO} 0%, #2C3A66 100%)`
                  : `linear-gradient(135deg, ${SHANI_INDIGO} 0%, #2C3A66 100%)`,
              color: !isChecked ? "var(--gl-ink-muted)" : "#FFF9F0",
              border: !isChecked ? `1px solid ${SHANI_INDIGO}33` : "none",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              cursor: isChecked ? "pointer" : "not-allowed",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 150ms cubic-bezier(0.32, 0.72, 0.24, 1)",
              boxShadow: !isChecked ? "none" : `0 4px 14px ${SHANI_INDIGO}33`,
            }}
          >
            {submitted ? (currentIdx + 1 >= bank.questions.length ? "Finish" : "Continue") : "Check answer"}
            <ChevronRight size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Corner gold/indigo arc ornament — same pattern as Scholar's Contract, recoloured. */
function PracticeCornerOrnament({
  accent,
  corner,
}: {
  accent: string;
  corner: "tl" | "tr" | "bl" | "br";
}) {
  const pos: React.CSSProperties = {
    position: "absolute",
    width: "28px",
    height: "28px",
    pointerEvents: "none",
  };
  if (corner === "tl") {
    pos.top = "6px";
    pos.left = "6px";
  } else if (corner === "tr") {
    pos.top = "6px";
    pos.right = "6px";
    pos.transform = "scaleX(-1)";
  } else if (corner === "bl") {
    pos.bottom = "6px";
    pos.left = "6px";
    pos.transform = "scaleY(-1)";
  } else {
    pos.bottom = "6px";
    pos.right = "6px";
    pos.transform = "scale(-1, -1)";
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" style={pos}>
      <g fill="none" stroke={accent} strokeWidth="0.9" strokeLinecap="round" opacity="0.5">
        <path d="M 2 12 Q 2 2 12 2" />
        <circle cx="2" cy="2" r="0.9" fill={accent} stroke="none" opacity="0.7" />
      </g>
    </svg>
  );
}

// Inline-markdown rendering now lives in ../lib/inline-markdown (shared).

function OptionCard({
  option,
  selected,
  submitted,
  correctOptionId: _correctOptionId,
  disabled,
  onClick,
}: {
  option: McqQuestion["options"][number];
  selected: boolean;
  submitted: boolean;
  correctOptionId: string | null;
  disabled: boolean;
  onClick: () => void;
}) {
  const isThisCorrect = option.isCorrect;
  const showAsCorrect = submitted && isThisCorrect;
  const showAsWrongSelected = submitted && selected && !isThisCorrect;
  const showAsDimmed = submitted && !selected && !isThisCorrect;
  const isSelectedIdle = selected && !submitted;

  // Color resolution per state
  const accentHex = showAsCorrect
    ? "#3A8C5A"
    : showAsWrongSelected
      ? "#A23A1E"
      : isSelectedIdle
        ? SHANI_INDIGO
        : "rgba(156, 122, 47, 0.40)";
  const sealBg = showAsCorrect
    ? "#3A8C5A"
    : showAsWrongSelected
      ? "#A23A1E"
      : isSelectedIdle
        ? SHANI_INDIGO
        : "rgba(255, 252, 240, 0.95)";
  const sealLetter = showAsCorrect || showAsWrongSelected || isSelectedIdle
    ? "#FFF9F0"
    : SHANI_INDIGO;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className="gl-clickable"
      style={{
        display: "block",
        width: "100%",
        textAlign: "left",
        padding: "14px 18px 14px 14px",
        background:
          showAsCorrect
            ? "rgba(58, 140, 90, 0.06)"
            : showAsWrongSelected
              ? "rgba(162, 58, 30, 0.06)"
              : isSelectedIdle
                ? `${SHANI_INDIGO}0E`
                : "rgba(255, 249, 234, 0.55)",
        border: `1px solid ${accentHex}`,
        borderLeft: isSelectedIdle || showAsCorrect || showAsWrongSelected
          ? `3px solid ${accentHex}`
          : `1px solid ${accentHex}`,
        borderRadius: "12px",
        cursor: disabled ? "default" : "pointer",
        opacity: showAsDimmed ? 0.5 : 1,
        transition: "all 150ms cubic-bezier(0.32, 0.72, 0.24, 1)",
        boxShadow: isSelectedIdle
          ? `0 2px 8px ${SHANI_INDIGO}22`
          : showAsCorrect
            ? "0 2px 8px rgba(58, 140, 90, 0.16)"
            : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        {/* Letter seal — circular badge */}
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: sealBg,
            border: `1.5px solid ${accentHex}`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            color: sealLetter,
            transition: "all 150ms cubic-bezier(0.32, 0.72, 0.24, 1)",
            transform: isSelectedIdle ? "scale(1.05)" : "scale(1)",
            boxShadow: isSelectedIdle ? `0 2px 6px ${SHANI_INDIGO}33` : "none",
          }}
        >
          {option.id}
        </span>

        <span
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "16px",
            lineHeight: 1.65,
            color: "var(--gl-ink-primary)",
            flex: 1,
          }}
        >
          {renderInline(option.text)}
        </span>

        {showAsCorrect && (
          <Check size={18} strokeWidth={2.5} style={{ color: "#3A8C5A", flexShrink: 0 }} />
        )}
        {showAsWrongSelected && (
          <X size={18} strokeWidth={2.5} style={{ color: "#A23A1E", flexShrink: 0 }} />
        )}
      </div>
    </button>
  );
}

function ExplanationCard({
  question,
  chosenOption,
  isCorrect,
}: {
  question: McqQuestion;
  chosenOption: McqQuestion["options"][number] | null;
  isCorrect: boolean;
}) {
  const correct = question.options.find((o) => o.isCorrect);
  if (!correct) return null;

  return (
    <div
      className="mt-6 p-5 rounded-lg"
      role="region"
      aria-live="polite"
      style={{
        background: isCorrect ? "rgba(58, 140, 90, 0.06)" : "rgba(200, 65, 46, 0.06)",
        borderLeft: `3px solid ${isCorrect ? "#3A8C5A" : "var(--gl-vermilion-accent)"}`,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "20px",
          color: isCorrect ? "#3A8C5A" : "var(--gl-vermilion-accent)",
          marginBottom: "12px",
        }}
      >
        {isCorrect ? "Why this is right" : "Why this is wrong — and where right was"}
      </h3>

      {!isCorrect && chosenOption && (
        <div className="mb-4 pb-4" style={{ borderBottom: "1px dashed var(--gl-gold-hairline)" }}>
          <p
            style={{ color: "var(--gl-vermilion-accent)", letterSpacing: "0.12em", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px", fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            Your answer · {chosenOption.id}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "16px",
              lineHeight: 1.7,
              color: "var(--gl-ink-primary)",
            }}
          >
            {renderInline(chosenOption.explanation)}
          </p>
        </div>
      )}

      <p
        style={{ color: "#3A8C5A", letterSpacing: "0.12em", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", marginBottom: "6px", fontFamily: "var(--font-sans), system-ui, sans-serif" }}
      >
        The correct answer · {correct.id}
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "16px",
          lineHeight: 1.7,
          color: "var(--gl-ink-primary)",
          marginBottom: "12px",
        }}
      >
        {renderInline(correct.explanation)}
      </p>

      {question.primarySources.length > 0 && (
        <ul className="pt-3 border-t" style={{ borderColor: "var(--gl-gold-hairline)", listStyle: "none", padding: 0 }}>
          <p
            style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.16em", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", marginBottom: "8px", fontFamily: "var(--font-sans), system-ui, sans-serif" }}
          >
            Sources
          </p>
          {question.primarySources.map((s, i) => (
            <Citation key={`p-${i}`} reference={s.ref} note={s.note} isPrimary />
          ))}
          {question.modernSources.map((s, i) => (
            <Citation key={`m-${i}`} reference={s.ref} note={s.note} />
          ))}
        </ul>
      )}
    </div>
  );
}

/* ───────────────── Review screen ───────────────────────────── */

function ReviewScreen({
  bank,
  onBack,
  onPracticeAgain,
}: {
  bank: McqBank;
  onBack: () => void;
  onPracticeAgain: () => void;
}) {
  return (
    <div>
      {/* Header */}
      <div
        className="gl-surface-dawn p-6 text-center mb-4"
        style={{ borderRadius: "14px" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "28px",
            fontWeight: 500,
            color: "var(--gl-ink-on-dawn-primary)",
            marginBottom: "4px",
          }}
        >
          Review Mode
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "16px",
            color: "var(--gl-ink-on-dawn-primary)",
            opacity: 0.72,
          }}
        >
          All questions shown with correct answers and explanations.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{
              background: "var(--gl-card-surface-solid, #FFF9F0)",
              color: "var(--gl-ink-primary)",
              border: "1.5px solid var(--gl-gold-hairline)",
              cursor: "pointer",
            }}
          >
            <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />
            Back to Results
          </button>
          <button
            onClick={onPracticeAgain}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{
              background: "var(--gl-card-surface-solid, #FFF9F0)",
              color: "var(--gl-ink-primary)",
              border: "1.5px solid var(--gl-gold-hairline)",
              cursor: "pointer",
            }}
          >
            <RotateCcw size={16} />
            Practice Again
          </button>
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-6">
        {bank.questions.map((q, idx) => {
          const correctOption = q.options.find((o) => o.isCorrect) ?? null;
          return (
            <div
              key={q.id}
              className="gl-surface-twilight-glass"
              style={{
                padding: "28px 32px 24px",
                position: "relative",
                overflow: "hidden",
                borderRadius: "14px",
              }}
            >
              {/* Question number badge */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="inline-flex items-center justify-center text-xs font-bold"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: SHANI_INDIGO,
                    color: "#fff",
                  }}
                >
                  {idx + 1}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    color: SHANI_INDIGO,
                    fontWeight: 600,
                  }}
                >
                  {q.bloomLevel ?? ""}
                  {q.bloomLevel && q.difficulty && (
                    <span style={{ opacity: 0.5, margin: "0 4px" }}>·</span>
                  )}
                  <span style={{ fontWeight: 500 }}>{q.difficulty ?? ""}</span>
                </span>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "22px",
                  fontWeight: 500,
                  color: "var(--gl-ink-primary)",
                  lineHeight: 1.4,
                  marginBottom: "16px",
                }}
              >
                {renderInline(q.stem)}
              </p>
              {q.stemDevanagari && (
                <p
                  lang="sa"
                  style={{
                    fontFamily: "var(--font-devanagari), serif",
                    fontSize: "18px",
                    color: "var(--gl-ink-secondary)",
                    marginBottom: "16px",
                    lineHeight: 1.5,
                  }}
                >
                  {q.stemDevanagari}
                </p>
              )}

              <div className="space-y-2.5">
                {q.options.map((opt) => (
                  <div
                    key={opt.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: `1px solid ${opt.isCorrect ? "#3A8C5A" : "rgba(156, 122, 47, 0.35)"}`,
                      background: opt.isCorrect
                        ? "rgba(58, 140, 90, 0.06)"
                        : "rgba(255, 249, 234, 0.55)",
                      opacity: opt.isCorrect ? 1 : 0.6,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background: opt.isCorrect ? "#3A8C5A" : "rgba(255, 252, 240, 0.95)",
                        border: `1.5px solid ${opt.isCorrect ? "#3A8C5A" : "rgba(156, 122, 47, 0.40)"}`,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: opt.isCorrect ? "#FFF9F0" : SHANI_INDIGO,
                      }}
                    >
                      {opt.id}
                    </span>
                    <span
                      style={{
                        fontFamily:
                          "var(--font-sans), system-ui, sans-serif",
                        fontSize: "15px",
                        lineHeight: 1.6,
                        color: "var(--gl-ink-primary)",
                        flex: 1,
                      }}
                    >
                      {renderInline(opt.text)}
                    </span>
                    {opt.isCorrect && (
                      <Check
                        size={18}
                        strokeWidth={2.5}
                        style={{ color: "#3A8C5A", flexShrink: 0 }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Explanation */}
              {correctOption && (
                <div
                  className="mt-4 p-4 rounded-lg"
                  style={{
                    background: "rgba(58, 140, 90, 0.06)",
                    borderLeft: "3px solid #3A8C5A",
                  }}
                >
                  <p
                    style={{
                      color: "#3A8C5A",
                      letterSpacing: "0.12em",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      marginBottom: "6px",
                      fontFamily:
                        "var(--font-sans), system-ui, sans-serif",
                    }}
                  >
                    Correct answer · {correctOption.id}
                  </p>
                  <p
                    style={{
                      fontFamily:
                        "var(--font-sans), system-ui, sans-serif",
                      fontSize: "15px",
                      lineHeight: 1.7,
                      color: "var(--gl-ink-primary)",
                    }}
                  >
                    {renderInline(correctOption.explanation)}
                  </p>
                </div>
              )}

              {q.primarySources.length > 0 && (
                <ul
                  className="pt-3 mt-3 border-t"
                  style={{
                    borderColor: "var(--gl-gold-hairline)",
                    listStyle: "none",
                    padding: 0,
                  }}
                >
                  <p
                    style={{
                      color: "var(--gl-ink-muted)",
                      letterSpacing: "0.16em",
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      marginBottom: "8px",
                      fontFamily:
                        "var(--font-sans), system-ui, sans-serif",
                    }}
                  >
                    Sources
                  </p>
                  {q.primarySources.map((s, i) => (
                    <Citation key={`p-${i}`} reference={s.ref} note={s.note} />
                  ))}
                  {q.modernSources.map((s, i) => (
                    <Citation
                      key={`m-${i}`}
                      reference={s.ref}
                      note={s.note}
                    />
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────── Pass screen ─────────────────────────────── */

function PassScreen({
  bank,
  lastAttempt,
  onPracticeAgain,
  onReview,
}: {
  bank: McqBank;
  lastAttempt: import("@/lib/learning-runtime/progress-store").AttemptRecord | undefined;
  onPracticeAgain: () => void;
  onReview: () => void;
}) {
  const score = lastAttempt?.scorePct ?? 100;
  const correct = bank.questions.length - (lastAttempt?.wrongQuestionIds.length ?? 0);

  return (
    <div className="gl-surface-dawn p-10 text-center">
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "44px",
          fontWeight: 500,
          color: "var(--gl-ink-on-dawn-primary)",
          marginBottom: "8px",
          lineHeight: 1.1,
        }}
      >
        Mastered.
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "22px",
          color: "var(--gl-ink-on-dawn-primary)",
          opacity: 0.82,
          marginBottom: "16px",
        }}
      >
        You scored {correct} of {bank.questions.length} ({score}%).
      </p>
      {lastAttempt && lastAttempt.wrongQuestionIds.length > 0 && (
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "15px",
            color: "var(--gl-ink-on-dawn-primary)",
            opacity: 0.72,
            maxWidth: "440px",
            margin: "0 auto",
            lineHeight: 1.5,
          }}
        >
          The {lastAttempt.wrongQuestionIds.length} {lastAttempt.wrongQuestionIds.length === 1 ? "question" : "questions"} you missed will return to you in spaced repetition over the coming days.
        </p>
      )}

      <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={onReview}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
          style={{
            background: "var(--gl-card-surface-solid, #FFF9F0)",
            color: "var(--gl-ink-primary)",
            border: "1.5px solid var(--gl-gold-hairline)",
            cursor: "pointer",
          }}
        >
          <FileQuestion size={16} />
          Review Answers
        </button>
        <button
          onClick={onPracticeAgain}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
          style={{
            background: "var(--gl-card-surface-solid, #FFF9F0)",
            color: "var(--gl-ink-primary)",
            border: "1.5px solid var(--gl-gold-hairline)",
            cursor: "pointer",
          }}
        >
          <RotateCcw size={16} />
          Practice Again
        </button>
      </div>
    </div>
  );
}

/* ───────────────── Cooldown screen ─────────────────────────── */

function CooldownScreen({
  bank,
  remainingMs,
  lastAttempt,
}: {
  bank: McqBank;
  remainingMs: number;
  lastAttempt: import("@/lib/learning-runtime/progress-store").AttemptRecord | undefined;
}) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const remaining = Math.max(0, remainingMs - (now - (lastAttempt?.attemptedAt ?? now)));
  const score = lastAttempt?.scorePct ?? 0;
  const correct = bank.questions.length - (lastAttempt?.wrongQuestionIds.length ?? 0);
  const wrongQuestions = (lastAttempt?.wrongQuestionIds ?? [])
    .map((qid) => bank.questions.find((q) => q.id === qid))
    .filter((q): q is McqQuestion => q !== undefined);

  return (
    <div className="gl-surface-twilight-glass p-8">
      <div className="flex items-center gap-3 justify-center mb-3">
        <Clock size={28} style={{ color: "var(--gl-dawn-to)" }} />
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "36px",
            fontWeight: 500,
            color: "var(--gl-ink-primary)",
            lineHeight: 1.1,
          }}
        >
          Not yet.
        </p>
      </div>
      <p
        className="text-center"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "20px",
          color: "var(--gl-ink-secondary)",
          marginBottom: "20px",
        }}
      >
        You scored {correct} of {bank.questions.length} ({score}%). Mastery requires 80% or higher.
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "16px",
          lineHeight: 1.65,
          color: "var(--gl-ink-primary)",
          maxWidth: "560px",
          margin: "0 auto 24px",
          textAlign: "left",
        }}
      >
        This is not a setback. The questions you missed are the exact ones worth returning to. Use the next {COOLDOWN_HOURS} hours to re-read the sections most relevant to those misses (highlighted below).
      </p>

      <div
        className="text-center mb-6 p-4 rounded-lg"
        style={{
          background: "rgba(232, 199, 114, 0.08)",
          border: "1px solid var(--gl-gold-hairline)",
          maxWidth: "440px",
          margin: "0 auto 24px",
        }}
      >
        <p
          className="text-xs uppercase mb-1"
          style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.10em" }}
        >
          Next attempt available in
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "30px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          {formatCountdown(remaining)}
        </p>
      </div>

      {wrongQuestions.length > 0 && (
        <div>
          <p
            className="text-xs uppercase mb-3 text-center"
            style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.10em" }}
          >
            Questions to revisit
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {wrongQuestions.map((q) => {
              const correct = q.options.find((o) => o.isCorrect);
              return (
                <li
                  key={q.id}
                  className="mb-3 p-3 rounded"
                  style={{
                    background: "rgba(255, 249, 234, 0.65)",
                    borderLeft: "2px solid var(--gl-vermilion-accent)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-cormorant), serif",
                      fontWeight: 500,
                      fontSize: "16px",
                      lineHeight: 1.5,
                      color: "var(--gl-ink-primary)",
                      marginBottom: "8px",
                    }}
                  >
                    {renderInline(q.stem)}
                  </p>
                  {correct && (
                    <p
                      style={{
                        color: "var(--gl-ink-secondary)",
                        fontSize: "16px",
                        lineHeight: 1.65,
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                      }}
                    >
                      <span style={{ color: "#3A8C5A", fontWeight: 600 }}>Right answer · {correct.id}:</span> {renderInline(correct.text)}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00h 00m 00s";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}
function pad(n: number): string {
  return n.toString().padStart(2, "0");
}
