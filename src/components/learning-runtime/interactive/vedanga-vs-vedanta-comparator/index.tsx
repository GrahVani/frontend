/**
 * Vedāṅga ↔ Vedānta Comparator — Scholar's Discrimination Table.
 *
 * Redesigned 2026-05-22: the prior "two-empty-bays + card-tray-below" layout
 * reserved ~400px of cream just for drop targets that were empty by definition.
 * Replaced with a single elevated panel, one row per source text. Each row
 * holds the text on the left and a pair of tradition-toggle pills on the
 * right. Click a pill to commit a placement. Correct → row settles with a
 * coloured badge + brief categorical note (e.g. "Vedāṅga · grammar"). Wrong
 * → pill briefly flushes vermilion + hint slides below the row + the row
 * stays open for another attempt.
 *
 * No empty drop zones. The discrimination interaction is encoded in *choice*,
 * not in spatial destination. The committed state is its own micro-reveal
 * — the row collapses to ~30px and the next-unplaced row visually leads.
 */

"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { renderInline } from "../../chrome/lib/inline-markdown";

type Tradition = "vedanga" | "vedanta";

const VEDANGA_HEX = "#3A8C5A";
const VEDANTA_HEX = "#3A6B8C";
const VERMILION_HEX = "#A23A1E";

interface CardData {
  id: string;
  text: string;
  correct: Tradition;
  /** Short categorical label revealed after correct placement (e.g. "grammar"). */
  category: string;
  /** Hint shown on wrong placement. */
  hint: string;
}

const CARDS: CardData[] = [
  {
    id: "panini-grammar",
    text: "Pāṇini's Aṣṭādhyāyī",
    correct: "vedanga",
    category: "grammar (Vyākaraṇa)",
    hint: "Grammar is one of the six Vedāṅgas — a supporting discipline, not the philosophy at the Veda's end.",
  },
  {
    id: "lagadha-jyotisha",
    text: "Lagadha's Vedāṅga Jyotiṣa",
    correct: "vedanga",
    category: "celestial motion (Jyotiṣa)",
    hint: "The earliest surviving Indian Jyotiṣa text — note the word 'Vedāṅga' is literally in the title.",
  },
  {
    id: "brihadaranyaka",
    text: "The Bṛhadāraṇyaka Upaniṣad",
    correct: "vedanta",
    category: "Upaniṣadic philosophy",
    hint: "An Upaniṣad — the culmination of the Veda's philosophical inquiry. Vedānta means 'end of the Veda'.",
  },
  {
    id: "shankara-bsb",
    text: "Śaṅkara's Brahma-Sūtra-Bhāṣya",
    correct: "vedanta",
    category: "Vedāntic commentary",
    hint: "A commentary on the Brahma-Sūtras — classical Vedāntic literature, not a Vedāṅga discipline.",
  },
  {
    id: "paniniya-shiksha",
    text: "Pāṇinīya Śikṣā",
    correct: "vedanga",
    category: "phonetics (Śikṣā)",
    hint: "A phonetics manual — Śikṣā is one of the six Vedāṅgas.",
  },
  {
    id: "yaska-nirukta",
    text: "Yāska's Nirukta",
    correct: "vedanga",
    category: "etymology (Nirukta)",
    hint: "An etymological text — Nirukta is one of the six Vedāṅgas.",
  },
];

interface RowState {
  placedAs: Tradition | null;
  wrongFlash: Tradition | null;
  hint: string | null;
}

export function VedangaVsVedantaComparator() {
  const [rows, setRows] = useState<Record<string, RowState>>(() =>
    Object.fromEntries(CARDS.map((c) => [c.id, { placedAs: null, wrongFlash: null, hint: null }])),
  );

  const placedCount = Object.values(rows).filter((r) => r.placedAs !== null).length;
  const allDone = placedCount === CARDS.length;

  const choose = (cardId: string, choice: Tradition) => {
    const card = CARDS.find((c) => c.id === cardId);
    if (!card) return;
    if (rows[cardId].placedAs !== null) return; // locked
    if (card.correct === choice) {
      setRows((prev) => ({
        ...prev,
        [cardId]: { placedAs: choice, wrongFlash: null, hint: null },
      }));
    } else {
      setRows((prev) => ({
        ...prev,
        [cardId]: { placedAs: null, wrongFlash: choice, hint: card.hint },
      }));
      setTimeout(() => {
        setRows((prev) => ({
          ...prev,
          [cardId]: { ...prev[cardId], wrongFlash: null },
        }));
      }, 360);
    }
  };

  return (
    <div className="my-4" aria-label="Vedāṅga versus Vedānta discrimination table">
      <article
        className="gl-surface-twilight-glass"
        style={{ padding: "20px 24px 18px", position: "relative" }}
      >
        {/* Header strip — the contract */}
        <header
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "12px",
            paddingBottom: "12px",
            borderBottom: "1px solid rgba(156, 122, 47, 0.20)",
            marginBottom: "8px",
          }}
        >
          <div>
            <p
              className="text-xs uppercase"
              style={{
                color: "var(--gl-ink-muted)",
                letterSpacing: "0.18em",
                fontWeight: 700,
                marginBottom: "2px",
              }}
            >
              Discrimination
            </p>
            <p
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
                fontSize: "16px",
                color: "var(--gl-ink-secondary)",
                lineHeight: 1.4,
              }}
            >
              Place each text into its tradition.
            </p>
          </div>
          <div
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "14.5px",
              color: "var(--gl-ink-muted)",
              textAlign: "right",
              flexShrink: 0,
            }}
            aria-live="polite"
          >
            {placedCount}/{CARDS.length} placed
          </div>
        </header>

        {/* Rows */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {CARDS.map((card, i) => (
            <Row
              key={card.id}
              card={card}
              state={rows[card.id]}
              onChoose={(c) => choose(card.id, c)}
              showDivider={i < CARDS.length - 1}
            />
          ))}
        </ul>
      </article>

      {/* All-correct ceremony */}
      {allDone && (
        <div
          className="mt-4 gl-surface-dawn p-5 text-center"
          role="status"
        >
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "22px",
              color: "var(--gl-ink-on-dawn-primary)",
              marginBottom: "2px",
            }}
          >
            All six placed correctly.
          </p>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "16px",
              color: "var(--gl-ink-on-dawn-primary)",
              opacity: 0.78,
            }}
          >
            Vedāṅga is the limb. Vedānta is the end. Two different categories of text.
          </p>
        </div>
      )}
    </div>
  );
}

/** A single row — text on the left, pill pair on the right, or settled-badge state. */
function Row({
  card,
  state,
  onChoose,
  showDivider,
}: {
  card: CardData;
  state: RowState;
  onChoose: (c: Tradition) => void;
  showDivider: boolean;
}) {
  const placed = state.placedAs !== null;
  const placedHex = state.placedAs === "vedanga" ? VEDANGA_HEX : VEDANTA_HEX;
  const placedLabel = state.placedAs === "vedanga" ? "Vedāṅga" : "Vedānta";

  return (
    <li
      style={{
        borderBottom: showDivider ? "1px solid rgba(156, 122, 47, 0.14)" : "none",
        padding: "10px 0",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "16px",
          alignItems: "center",
          minHeight: "36px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "16px",
            color: placed ? "var(--gl-ink-primary)" : "var(--gl-ink-primary)",
            opacity: placed ? 0.85 : 1,
            lineHeight: 1.35,
          }}
        >
          {renderInline(card.text)}
          {placed && (
            <span
              style={{
                fontFamily: "var(--font-sans), system-ui, sans-serif",
                fontStyle: "normal",
                fontSize: "13.5px",
                color: placedHex,
                marginLeft: "10px",
                letterSpacing: "0.04em",
              }}
            >
              · {card.category}
            </span>
          )}
        </p>

        {placed ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 12px",
              borderRadius: "999px",
              background: `${placedHex}18`,
              border: `1px solid ${placedHex}55`,
              fontSize: "13.5px",
              fontWeight: 700,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: placedHex,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
            }}
          >
            <Check size={12} strokeWidth={2.5} />
            {placedLabel}
          </span>
        ) : (
          <div style={{ display: "inline-flex", gap: "6px", flexShrink: 0 }}>
            <Pill
              label="Vedāṅga"
              accentHex={VEDANGA_HEX}
              wrongFlash={state.wrongFlash === "vedanga"}
              onClick={() => onChoose("vedanga")}
            />
            <Pill
              label="Vedānta"
              accentHex={VEDANTA_HEX}
              wrongFlash={state.wrongFlash === "vedanta"}
              onClick={() => onChoose("vedanta")}
            />
          </div>
        )}
      </div>

      {state.hint && !placed && (
        <p
          role="alert"
          style={{
            marginTop: "6px",
            paddingLeft: "12px",
            borderLeft: `2px solid ${VERMILION_HEX}`,
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "13.5px",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.5,
          }}
        >
          {state.hint}
        </p>
      )}
    </li>
  );
}

function Pill({
  label,
  accentHex,
  wrongFlash,
  onClick,
}: {
  label: string;
  accentHex: string;
  wrongFlash: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Place as ${label}`}
      style={{
        padding: "5px 14px",
        borderRadius: "999px",
        background: wrongFlash
          ? `${VERMILION_HEX}18`
          : "transparent",
        border: wrongFlash
          ? `1px solid ${VERMILION_HEX}`
          : `1px solid ${accentHex}55`,
        color: wrongFlash ? VERMILION_HEX : accentHex,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        fontSize: "13.5px",
        fontWeight: 700,
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 160ms cubic-bezier(0.32, 0.72, 0.24, 1)",
        transform: wrongFlash ? "translateX(-2px)" : "none",
      }}
      onMouseEnter={(e) => {
        if (wrongFlash) return;
        (e.currentTarget as HTMLButtonElement).style.background = `${accentHex}14`;
      }}
      onMouseLeave={(e) => {
        if (wrongFlash) return;
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
      }}
    >
      {label}
    </button>
  );
}
