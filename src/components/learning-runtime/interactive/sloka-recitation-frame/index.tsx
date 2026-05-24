/**
 * Śloka Recitation Frame — B. Visualiser.
 * Spec: curriculum/interactive-specs/sloka-recitation-frame.md
 *
 * Pāṇinīya Śikṣā 41-42 in three registers on Manuscript Cream.
 * Tap a Devanāgarī word → IAST highlights, English gloss appears in the margin.
 * Long-press → etymology card slides up.
 *
 * Audio playback hook is reserved (no recordings shipped in B4); the toggle
 * is hidden when no audio asset is available.
 */

"use client";

import { useState } from "react";
import {
  SLOKA_WORDS,
  SLOKA_DEVANAGARI,
  SLOKA_IAST,
  SLOKA_ENGLISH,
  SLOKA_SOURCE,
  SLOKA_TRANSLATOR,
  type WordGloss,
} from "./data";

export function SlokaRecitationFrame() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [etymologyIdx, setEtymologyIdx] = useState<number | null>(null);
  // Long-press timer
  const [pressTimer, setPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const active = activeIdx !== null ? SLOKA_WORDS[activeIdx] : null;
  const etymology = etymologyIdx !== null ? SLOKA_WORDS[etymologyIdx] : null;

  const handlePress = (idx: number) => {
    setActiveIdx(idx);
    const t = setTimeout(() => {
      setEtymologyIdx(idx);
    }, 600);
    setPressTimer(t);
  };

  const handleRelease = () => {
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <figure className="gl-surface-manuscript relative" style={{ marginTop: 0, marginBottom: 0 }}>
      <figcaption
        className="text-xs uppercase mb-3"
        style={{
          color: "var(--gl-ink-on-cream-muted)",
          letterSpacing: "0.08em",
        }}
      >
        {SLOKA_SOURCE}
      </figcaption>

      {/* Devanāgarī line — interactive words */}
      <div
        lang="sa"
        style={{
          fontFamily: "var(--font-devanagari), serif",
          fontSize: "32px",
          lineHeight: 1.55,
          color: "var(--gl-ink-on-cream-primary)",
          marginBottom: "16px",
        }}
      >
        {renderInteractiveDevanagari(activeIdx, handlePress, handleRelease)}
      </div>

      {/* IAST — full transliteration with active-word underline */}
      <p
        lang="sa-Latn"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontWeight: 500,
          fontSize: "20px",
          lineHeight: 1.5,
          color: "var(--gl-ink-on-cream-secondary)",
          marginBottom: "16px",
          whiteSpace: "pre-line",
        }}
      >
        {renderInteractiveIast(activeIdx)}
      </p>

      {/* English translation */}
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "19px",
          lineHeight: 1.55,
          color: "var(--gl-ink-on-cream-primary)",
          marginBottom: "12px",
        }}
      >
        {SLOKA_ENGLISH}
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "16px",
          lineHeight: 1.5,
          color: "var(--gl-ink-on-cream-secondary)",
        }}
      >
        {SLOKA_TRANSLATOR}
      </p>

      {/* Active-word gloss card */}
      {active && !etymology && (
        <div
          className="mt-6 p-4 rounded-lg"
          style={{
            background: "rgba(168, 130, 30, 0.10)",
            borderLeft: "3px solid var(--gl-gold-on-cream)",
          }}
          aria-live="polite"
        >
          <p
            className="text-xs uppercase mb-1"
            style={{ color: "var(--gl-ink-on-cream-muted)", letterSpacing: "0.08em" }}
          >
            Gloss
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "16px",
              fontStyle: "italic",
              color: "var(--gl-ink-on-cream-primary)",
              marginBottom: "4px",
            }}
          >
            <span style={{ fontFamily: "var(--font-devanagari)", fontStyle: "normal", marginRight: "8px" }}>
              {active.devanagari}
            </span>
            · {active.iast}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "16px",
              color: "var(--gl-ink-on-cream-primary)",
              lineHeight: 1.55,
            }}
          >
            {active.gloss}
          </p>
          {active.etymology && (
            <p
              className="text-xs italic mt-2"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                color: "var(--gl-ink-on-cream-muted)",
              }}
            >
              Hold the word to see etymology.
            </p>
          )}
        </div>
      )}

      {/* Etymology expanded card */}
      {etymology && (
        <div
          className="mt-6 p-4 rounded-lg relative"
          style={{
            background: "rgba(168, 130, 30, 0.18)",
            border: "1px solid rgba(168, 130, 30, 0.50)",
          }}
          role="dialog"
          aria-label={`Etymology of ${etymology.iast}`}
        >
          <button
            onClick={() => {
              setEtymologyIdx(null);
              setActiveIdx(null);
            }}
            aria-label="Close etymology"
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "transparent",
              border: "none",
              fontSize: "16px",
              color: "var(--gl-ink-on-cream-muted)",
              cursor: "pointer",
            }}
          >
            ×
          </button>
          <p
            className="text-xs uppercase mb-2"
            style={{ color: "var(--gl-gold-on-cream)", letterSpacing: "0.10em" }}
          >
            Etymology
          </p>
          <p
            style={{
              fontFamily: "var(--font-devanagari), serif",
              fontSize: "22px",
              color: "var(--gl-ink-on-cream-primary)",
              marginBottom: "4px",
            }}
          >
            {etymology.devanagari}
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "17px",
              color: "var(--gl-ink-on-cream-secondary)",
              marginBottom: "10px",
            }}
          >
            {etymology.iast}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "16px",
              color: "var(--gl-ink-on-cream-primary)",
              lineHeight: 1.55,
              marginBottom: "6px",
            }}
          >
            {etymology.gloss}
          </p>
          {etymology.etymology && (
            <p
              className="text-sm italic"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                color: "var(--gl-ink-on-cream-muted)",
                lineHeight: 1.55,
              }}
            >
              {etymology.etymology}
            </p>
          )}
        </div>
      )}

      <p
        className="mt-4"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          fontSize: "14.5px",
          lineHeight: 1.5,
          color: "var(--gl-ink-on-cream-secondary)",
          opacity: 0.88,
        }}
      >
        Tap a Devanāgarī word for a gloss. Hold a word to see its etymology.
      </p>

      {/* Hidden lines for accessibility — full IAST and English already shown above */}
      <span style={{ display: "none" }} lang="sa">
        {SLOKA_DEVANAGARI}
      </span>
      <span style={{ display: "none" }} lang="sa-Latn">
        {SLOKA_IAST}
      </span>
    </figure>
  );
}

/** Render the Devanāgarī line with each word from SLOKA_WORDS as a tappable span. */
function renderInteractiveDevanagari(
  activeIdx: number | null,
  onPress: (idx: number) => void,
  onRelease: () => void,
) {
  return (
    <>
      {SLOKA_WORDS.map((w, idx) => {
        const isActive = activeIdx === idx;
        // Insert a line break after the 8th word — matches the source śloka structure.
        const lineBreak = idx === 8;
        return (
          <span key={idx}>
            {lineBreak && <br />}
            <button
              onClick={() => onPress(idx)}
              onMouseDown={() => onPress(idx)}
              onMouseUp={onRelease}
              onMouseLeave={onRelease}
              onTouchStart={() => onPress(idx)}
              onTouchEnd={onRelease}
              aria-label={`Tap to gloss: ${w.iast} — ${w.gloss}`}
              aria-pressed={isActive}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                margin: "0 6px 0 0",
                color: "inherit",
                font: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
                textDecorationStyle: isActive ? "solid" : "dotted",
                textDecorationColor: isActive ? "var(--gl-vermilion-on-cream)" : "rgba(168, 130, 30, 0.45)",
                textDecorationThickness: isActive ? "1.8px" : "1px",
                textUnderlineOffset: "6px",
                transition: "all 200ms cubic-bezier(0.32, 0.72, 0.24, 1)",
              }}
            >
              {w.devanagari}
            </button>
          </span>
        );
      })}
    </>
  );
}

/** Render the IAST line with the active word vermilion-underlined for sync. */
function renderInteractiveIast(activeIdx: number | null) {
  const firstLine = SLOKA_WORDS.slice(0, 8);
  const secondLine = SLOKA_WORDS.slice(8);
  return (
    <>
      {firstLine.map((w, idx) => (
        <WordSpan key={idx} word={w} active={activeIdx === idx} />
      ))}
      {" |"}
      <br />
      {secondLine.map((w, idx) => {
        const realIdx = idx + 8;
        return <WordSpan key={realIdx} word={w} active={activeIdx === realIdx} />;
      })}
      {" ||"}
    </>
  );
}

function WordSpan({ word, active }: { word: WordGloss; active: boolean }) {
  return (
    <span
      style={{
        textDecoration: active ? "underline" : "none",
        textDecorationColor: "var(--gl-vermilion-on-cream)",
        textDecorationThickness: "1.5px",
        textUnderlineOffset: "4px",
        marginRight: "6px",
      }}
    >
      {word.iast}
    </span>
  );
}
