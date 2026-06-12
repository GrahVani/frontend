"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
  GraduationCap,
  MessageCircle,
  Pencil,
  RotateCcw,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import {
  SCENARIO_ITEMS,
  REWRITE_ITEMS,
  LINEAGE_CARDS,
  EPISTEMIC_POSITIONS,
  GEOGRAPHY_FACTS,
} from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const LAL_KITAB_COLOR = "#A87830";
const LAL_KITAB_DEEP = "#7A5212";

type TabKey = "scenarios" | "rewrite" | "lineages" | "epistemic";

const TABS: { key: TabKey; label: string; icon: ReactNode }[] = [
  { key: "scenarios", label: "Scenarios", icon: <MessageCircle size={16} /> },
  { key: "rewrite", label: "Rewrite lab", icon: <Pencil size={16} /> },
  { key: "lineages", label: "Lineages & reach", icon: <Globe size={16} /> },
  { key: "epistemic", label: "Epistemic map", icon: <GraduationCap size={16} /> },
];

export function LalKitabStatusAndEthicsExplorer() {
  const [activeTab, setActiveTab] = useState<TabKey>("scenarios");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("scenarios");
  };

  return (
    <div data-interactive="lal-kitab-status-and-ethics-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 18.1.4 — Modern Practitioners & Status</p>
            <h2 style={{ margin: "0.2rem 0 0", color: LAL_KITAB_COLOR, fontSize: "1.35rem" }}>
              Lal Kitab — Status, Ethics & Honest Practice
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Practise honest client responses, rewrite over-claims, explore lineages, and map the epistemic landscape.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Tab strip */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            aria-pressed={activeTab === tab.key}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              border: `1px solid ${activeTab === tab.key ? LAL_KITAB_COLOR : HAIRLINE}`,
              borderRadius: 8,
              background: activeTab === tab.key ? LAL_KITAB_COLOR : "transparent",
              color: activeTab === tab.key ? "#fff" : INK_SECONDARY,
              padding: "0.52rem 0.85rem",
              fontWeight: 850,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div key={resetKey}>
        {activeTab === "scenarios" && <ScenariosTab />}
        {activeTab === "rewrite" && <RewriteTab />}
        {activeTab === "lineages" && <LineagesTab />}
        {activeTab === "epistemic" && <EpistemicTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Scenarios Tab ───────────────────────── */

function ScenariosTab() {
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const choose = (id: number, label: string) => {
    setAnswers((prev) => ({ ...prev, [id]: label }));
    setRevealed((prev) => ({ ...prev, [id]: true }));
  };

  const correctCount = SCENARIO_ITEMS.filter(
    (s) => {
      const chosenLabel = answers[s.id];
      const chosenOpt = s.options.find((o) => o.label === chosenLabel);
      return chosenOpt?.isCorrect ?? false;
    }
  ).length;
  const allDone = SCENARIO_ITEMS.every(
    (s) => answers[s.id] !== undefined && answers[s.id] !== null
  );

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Client scenario responder</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
              Choose the honest response for each client interaction.
            </p>
          </div>
          {allDone && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: correctCount === SCENARIO_ITEMS.length ? GREEN : GOLD, fontWeight: 950, fontSize: "0.9rem" }}>
              {correctCount === SCENARIO_ITEMS.length ? <CheckCircle2 size={18} /> : <MessageCircle size={18} />}
              {correctCount} / {SCENARIO_ITEMS.length} correct
            </div>
          )}
        </div>
      </div>

      {SCENARIO_ITEMS.map((item) => {
        const chosen = answers[item.id];
        const show = revealed[item.id];
        const chosenOpt = item.options.find((o) => o.label === chosen);
        const isCorrect = chosenOpt?.isCorrect ?? false;

        return (
          <article key={item.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_MUTED, fontWeight: 900, fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <MessageCircle size={14} />
              Scenario {item.id}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>{item.context}</p>
            <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.95rem", fontStyle: "italic", lineHeight: 1.55 }}>
              &ldquo;{item.clientSays.replace(/"/g, "")}&rdquo;
            </p>

            <div style={{ display: "grid", gap: "0.45rem" }}>
              {item.options.map((opt) => {
                const active = chosen === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => choose(item.id, opt.label)}
                    disabled={show}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      textAlign: "left",
                      border: `1px solid ${active ? (opt.isCorrect ? GREEN : VERMILION) : HAIRLINE}`,
                      borderRadius: 8,
                      background: active ? (opt.isCorrect ? `${GREEN}0D` : `${VERMILION}0D`) : "transparent",
                      color: INK_PRIMARY,
                      padding: "0.6rem 0.75rem",
                      fontWeight: active ? 850 : 700,
                      cursor: "pointer",
                      lineHeight: 1.5,
                      opacity: show && !active ? 0.55 : 1,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: active ? (opt.isCorrect ? GREEN : VERMILION) : HAIRLINE,
                        color: active ? "#fff" : INK_SECONDARY,
                        fontWeight: 950,
                        fontSize: "0.8rem",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {opt.label}
                    </span>
                    <span style={{ fontSize: "0.88rem" }}>{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {show && (
              <div
                style={{
                  border: `1px solid ${isCorrect ? GREEN : VERMILION}44`,
                  borderRadius: 8,
                  background: `${isCorrect ? GREEN : VERMILION}0D`,
                  padding: "0.65rem",
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "flex-start",
                }}
              >
                {isCorrect ? (
                  <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
                ) : (
                  <XCircle size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />
                )}
                <div>
                  <div style={{ fontWeight: 950, color: isCorrect ? GREEN : VERMILION, fontSize: "0.88rem" }}>
                    {isCorrect ? "Correct" : "This response fails the discipline"}
                  </div>
                  <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{item.discipline}</p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

/* ───────────────────────── Rewrite Tab ───────────────────────── */

function RewriteTab() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Rewrite lab</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Each card shows a dishonest or over-promising statement. Click to reveal the honest rewrite and the flaw it fixes.
        </p>
      </div>

      {REWRITE_ITEMS.map((item) => {
        const isOpen = openId === item.id;
        return (
          <article
            key={item.id}
            style={{
              border: `1px solid ${HAIRLINE}`,
              borderLeft: `4px solid ${isOpen ? VERMILION : HAIRLINE}`,
              borderRadius: "0 8px 8px 0",
              background: SURFACE,
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : item.id)}
              aria-expanded={isOpen}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                padding: "0.85rem 1rem",
                cursor: "pointer",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
              }}
            >
              <div>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.08em", color: VERMILION, fontWeight: 900, marginBottom: "0.3rem" }}>
                  Dishonest / over-promising
                </div>
                <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.93rem", fontStyle: "italic", lineHeight: 1.5 }}>
                  &ldquo;{item.dishonest}&rdquo;
                </p>
              </div>
              <span style={{ color: VERMILION, flexShrink: 0 }}>{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
            </button>

            {isOpen && (
              <div style={{ padding: "0 1rem 1rem", display: "grid", gap: "0.6rem" }}>
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${VERMILION}0A`, border: `1px solid ${VERMILION}33` }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: VERMILION, fontWeight: 900, marginBottom: "0.3rem" }}>
                    The flaw
                  </div>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.87rem" }}>{item.flaw}</p>
                </div>
                <div style={{ padding: "0.75rem", borderRadius: 8, background: `${GREEN}0A`, border: `1px solid ${GREEN}33` }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: GREEN, fontWeight: 900, marginBottom: "0.3rem" }}>
                    Honest rewrite
                  </div>
                  <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontSize: "0.9rem" }}>
                    &ldquo;{item.honest}&rdquo;
                  </p>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

/* ───────────────────────── Lineages Tab ───────────────────────── */

function LineagesTab() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Lineages & reach</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Lal Kitab is carried by plural lineages with no central authority, and practised across North India and the diaspora.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem" }}>
        {LINEAGE_CARDS.map((card) => {
          const isOpen = openSlug === card.slug;
          return (
            <article
              key={card.slug}
              style={{
                border: `1px solid ${LAL_KITAB_COLOR}44`,
                borderLeft: `4px solid ${LAL_KITAB_COLOR}`,
                borderRadius: "0 8px 8px 0",
                background: SURFACE,
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => setOpenSlug(isOpen ? null : card.slug)}
                aria-expanded={isOpen}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  padding: "0.85rem 1rem",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                }}
              >
                <div style={{ fontWeight: 950, color: LAL_KITAB_DEEP, fontSize: "1rem" }}>{card.title}</div>
                <span style={{ color: LAL_KITAB_COLOR, flexShrink: 0 }}>{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 1rem 1rem" }}>
                  <p style={{ margin: "0 0 0.6rem", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "0.88rem" }}>{card.description}</p>
                  <ul style={{ margin: 0, padding: "0 0 0 1.2rem", display: "grid", gap: "0.35rem" }}>
                    {card.characteristics.map((c, i) => (
                      <li key={i} style={{ color: INK_PRIMARY, fontSize: "0.87rem", lineHeight: 1.5 }}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={{ ...eyebrowStyle, marginBottom: "0.6rem" }}>Geographic reach</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.55rem" }}>
          {GEOGRAPHY_FACTS.map((g, i) => (
            <div key={i} style={{ border: `1px solid ${BLUE}33`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.7rem" }}>
              <div style={{ fontWeight: 950, color: BLUE, fontSize: "0.9rem" }}>{g.region}</div>
              <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.45 }}>{g.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Epistemic Tab ───────────────────────── */

function EpistemicTab() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <p style={eyebrowStyle}>Epistemic map</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Where does Lal Kitab sit on the spectrum of astrological authority? Click each position to explore.
        </p>
      </div>

      {/* Spectrum bar */}
      <div
        style={{
          display: "flex",
          borderRadius: 8,
          overflow: "hidden",
          border: `1px solid ${HAIRLINE}`,
        }}
      >
        {EPISTEMIC_POSITIONS.map((pos, i) => {
          const isSelected = selectedIdx === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIdx(i)}
              style={{
                flex: 1,
                padding: "0.85rem 0.5rem",
                background: isSelected ? pos.color : `${pos.color}18`,
                color: isSelected ? "#fff" : pos.color,
                border: "none",
                borderRight: i < EPISTEMIC_POSITIONS.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                cursor: "pointer",
                fontWeight: 950,
                fontSize: "0.85rem",
                textAlign: "center",
              }}
            >
              {pos.label}
            </button>
          );
        })}
      </div>

      {selectedIdx !== null && (
        <div
          style={{
            border: `1px solid ${EPISTEMIC_POSITIONS[selectedIdx].color}44`,
            borderLeft: `4px solid ${EPISTEMIC_POSITIONS[selectedIdx].color}`,
            borderRadius: "0 8px 8px 0",
            background: `${EPISTEMIC_POSITIONS[selectedIdx].color}0D`,
            padding: "1rem",
          }}
        >
          <div style={{ fontWeight: 950, color: EPISTEMIC_POSITIONS[selectedIdx].color, fontSize: "1.05rem", marginBottom: "0.4rem" }}>
            {EPISTEMIC_POSITIONS[selectedIdx].label}
          </div>
          <p style={{ margin: "0 0 0.5rem", color: INK_PRIMARY, lineHeight: 1.65, fontSize: "0.93rem" }}>
            {EPISTEMIC_POSITIONS[selectedIdx].text}
          </p>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
            <strong>Examples:</strong> {EPISTEMIC_POSITIONS[selectedIdx].examples}
          </p>
        </div>
      )}

      {/* Honest position banner */}
      <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}0D`, padding: "1rem", display: "flex", gap: "0.6rem", alignItems: "flex-start" }}>
        <ShieldAlert size={20} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 950, color: GREEN, fontSize: "0.95rem", marginBottom: "0.3rem" }}>
            The honest position
          </div>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontSize: "0.9rem" }}>
            Lal Kitab sits firmly in the <strong style={{ color: LAL_KITAB_DEEP }}>folk-empirical</strong> position. This does not make it inferior to scriptural-classical traditions, nor does it make it a substitute for them. It is a different methodological commitment — observation-based and practically oriented — and it is legitimate within its own framework.
          </p>
          <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
            Refuse the over-confident verdict in <em>both</em> directions: neither dress it up as ancient śāstra nor scoff at it for lacking one.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Shared styles ───────────────────────── */

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
