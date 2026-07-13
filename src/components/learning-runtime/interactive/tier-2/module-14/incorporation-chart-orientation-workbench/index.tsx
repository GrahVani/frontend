"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Building2,
  CheckSquare,
  Moon,
  RotateCcw,
  ShieldCheck,
  Square,
  Sun,
  Users,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ClaimCategory = "classical" | "modern" | "fabrication";
type ScenarioChoice = "acceptable" | "fabrication" | null;
type CarryOverKey = "houses" | "dignities" | "cross-chart" | "past-life" | "soul-purpose" | "jiva";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const PURPLE = "#6B5AA8";

const CLAIMS: { id: string; text: string; category: ClaimCategory; explanation: string }[] = [
  {
    id: "c1",
    text: "A beginning-moment chart is built by the standard natal-chart-construction method.",
    category: "classical",
    explanation: "T1-23 23.3.3: a muhūrta-chart follows the standard natal construction.",
  },
  {
    id: "c2",
    text: "Muhūrta doctrine applies specifically to the moment a business is launched.",
    category: "classical",
    explanation: "T1-23 23.4.2: vyāpāra-ārambha-muhūrta addresses business-launch timing.",
  },
  {
    id: "c3",
    text: "The incorporation chart can be read prospectively, year by year, as the company's natal-equivalent chart.",
    category: "modern",
    explanation: "This ongoing, natal-equivalent reading is this curriculum's own disclosed modern extension.",
  },
  {
    id: "c4",
    text: "Ancient Vedic astrologers read merchant guilds' incorporation charts for centuries using exactly this technique.",
    category: "fabrication",
    explanation: "No verified classical source in this curriculum supports this specific claim; it invents an ancient pedigree.",
  },
];

const CARRY_OVER_ITEMS: { key: CarryOverKey; label: string; carries: boolean; explanation: string }[] = [
  { key: "houses", label: "Houses and house meanings", carries: true, explanation: "The twelve houses and their classical significations apply to any natal-style chart." },
  { key: "dignities", label: "Sign dignities (own, exalt, debility, enemy)", carries: true, explanation: "Dignity is a mechanical property of a graha in a sign; it applies unchanged." },
  { key: "cross-chart", label: "House-overlay and cross-conjunction", carries: true, explanation: "These are geometric comparisons between two charts; no human-specific context is required." },
  { key: "past-life", label: "Past-life karma interpretation", carries: false, explanation: "Presupposes an individual jīva traversing lives — a company has no such entity." },
  { key: "soul-purpose", label: "Soul purpose or spiritual trajectory", carries: false, explanation: "Requires a soul; a legal entity does not have one in the classical sense." },
  { key: "jiva", label: "Jīva-specific techniques", carries: false, explanation: "Anything tied to individual incarnation is outside the company-chart scope." },
];

const MC6_PLACEMENTS = [
  { house: 4, graha: "Saturn", dignity: "exalted", color: GREEN, icon: <ShieldCheck size={14} /> },
  { house: 5, graha: "Moon", dignity: "debilitated", color: VERMILION, icon: <Moon size={14} /> },
  { house: 7, graha: "Mars", dignity: "exalted", color: GREEN, icon: <Users size={14} /> },
  { house: 11, graha: "Sun", dignity: "enemy-sign", color: GOLD, icon: <Sun size={14} /> },
];

export function IncorporationChartOrientationWorkbench() {
  const [classifications, setClassifications] = useState<Record<string, ClaimCategory | null>>({});
  const [carryOver, setCarryOver] = useState<Record<CarryOverKey, boolean | null>>({
    houses: null,
    dignities: null,
    "cross-chart": null,
    "past-life": null,
    "soul-purpose": null,
    jiva: null,
  });
  const [scenarioChoice, setScenarioChoice] = useState<ScenarioChoice>(null);
  const [commitments, setCommitments] = useState({ classical: false, scope: false, honest: false });

  const allClassified = CLAIMS.every((c) => classifications[c.id] !== undefined);
  const allCarryOverAnswered = CARRY_OVER_ITEMS.every((i) => carryOver[i.key] !== null);
  const allCarryOverCorrect = CARRY_OVER_ITEMS.every((i) => carryOver[i.key] === i.carries);
  const allCommitted = commitments.classical && commitments.scope && commitments.honest;

  const setClaimCategory = (id: string, category: ClaimCategory) => {
    setClassifications((prev) => ({ ...prev, [id]: category }));
  };

  const setCarryOverAnswer = (key: CarryOverKey, answer: boolean) => {
    setCarryOver((prev) => ({ ...prev, [key]: answer }));
  };

  const toggleCommitment = (key: keyof typeof commitments) => {
    setCommitments((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const reset = () => {
    setClassifications({});
    setCarryOver({
      houses: null,
      dignities: null,
      "cross-chart": null,
      "past-life": null,
      "soul-purpose": null,
      jiva: null,
    });
    setScenarioChoice(null);
    setCommitments({ classical: false, scope: false, honest: false });
  };

  return (
    <div data-interactive="incorporation-chart-orientation-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      {/* Header */}
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Incorporation chart orientation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem" }}>
              Classical root, modern extension, honest scope
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Set the reading frame for company charts: name the genuine classical precedent, the disclosed modern extension, and what natal concepts do not carry over.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      {/* Claim sorter + MC6 */}
      <div style={workbenchDiagramLayoutStyle as CSSProperties}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <p style={eyebrowStyle}>Classical / modern / fabrication</p>
          <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
            Sort each claim by source
          </h3>
          <div style={{ display: "grid", gap: "0.65rem" }}>
            {CLAIMS.map((claim) => {
              const selected = classifications[claim.id];
              return (
                <div
                  key={claim.id}
                  style={{
                    padding: "0.75rem",
                    borderRadius: 8,
                    border: `1px solid ${selected ? categoryColor(selected) : HAIRLINE}`,
                    background: selected ? `${categoryColor(selected)}06` : SURFACE,
                  }}
                >
                  <p style={{ margin: 0, color: INK_PRIMARY, fontSize: "0.9rem", lineHeight: 1.55 }}>{claim.text}</p>
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.55rem", flexWrap: "wrap" }}>
                    {(["classical", "modern", "fabrication"] as ClaimCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setClaimCategory(claim.id, cat)}
                        aria-pressed={selected === cat}
                        style={smallChipStyle(selected === cat, categoryColor(cat))}
                      >
                        {cat === "classical" ? "Classical" : cat === "modern" ? "Modern extension" : "Fabrication"}
                      </button>
                    ))}
                  </div>
                  {selected && (
                    <div
                      style={{
                        marginTop: "0.55rem",
                        padding: "0.55rem",
                        borderRadius: 6,
                        background: selected === "fabrication" ? `${VERMILION}10` : `${GREEN}10`,
                        border: `1px solid ${selected === "fabrication" ? VERMILION : GREEN}`,
                        color: selected === "fabrication" ? VERMILION : GREEN,
                        fontSize: "0.85rem",
                      }}
                    >
                      {selected === claim.category ? (
                        <span>{claim.explanation}</span>
                      ) : (
                        <span>
                          Not quite. This claim belongs under{" "}
                          <strong style={{ fontWeight: 600 }}>{claim.category === "classical" ? "Classical" : claim.category === "modern" ? "Modern extension" : "Fabrication"}</strong>
                          . {claim.explanation}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {allClassified && CLAIMS.every((c) => classifications[c.id] === c.category) && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BadgeCheck size={18} aria-hidden="true" />
                <span style={{ fontWeight: 600 }}>All claims sorted correctly.</span>
              </div>
            </div>
          )}
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Chart MC6 — Meridian Labs" icon={<Building2 size={18} />} color={PURPLE}>
            <Mc6Wheel />
            <p style={bodyTextStyle}>
              Incorporated 18 April 2015, Bengaluru. Deliberately mixed: real structural strength alongside real volatility.
            </p>
          </Panel>

          <Panel title="Citation honesty" icon={<BookOpen size={18} />} color={BLUE}>
            <p style={bodyTextStyle}>
              A genuine classical root combined with a disclosed modern extension is more defensible than a fabricated ancient lineage.
            </p>
          </Panel>
        </section>
      </div>

      {/* Carry-over exercise + scenario */}
      <div style={workbenchTwoColumnStyle as CSSProperties}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>What carries over?</p>
          <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
            Natal technique → company chart
          </h3>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {CARRY_OVER_ITEMS.map((item) => {
              const answer = carryOver[item.key];
              const correct = answer === item.carries;
              return (
                <div
                  key={item.key}
                  style={{
                    padding: "0.65rem",
                    borderRadius: 8,
                    border: `1px solid ${answer !== null ? (correct ? GREEN : VERMILION) : HAIRLINE}`,
                    background: answer !== null ? (correct ? `${GREEN}06` : `${VERMILION}06`) : SURFACE,
                  }}
                >
                  <div style={{ color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>{item.label}</div>
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.45rem" }}>
                    <button
                      type="button"
                      onClick={() => setCarryOverAnswer(item.key, true)}
                      aria-pressed={answer === true}
                      style={smallChipStyle(answer === true, GREEN)}
                    >
                      Carries over
                    </button>
                    <button
                      type="button"
                      onClick={() => setCarryOverAnswer(item.key, false)}
                      aria-pressed={answer === false}
                      style={smallChipStyle(answer === false, VERMILION)}
                    >
                      Does not carry over
                    </button>
                  </div>
                  {answer !== null && (
                    <div
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.45rem",
                        borderRadius: 6,
                        background: correct ? `${GREEN}10` : `${VERMILION}10`,
                        color: correct ? GREEN : VERMILION,
                        fontSize: "0.8rem",
                      }}
                    >
                      {item.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {allCarryOverAnswered && allCarryOverCorrect && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <BadgeCheck size={18} aria-hidden="true" />
                <span style={{ fontWeight: 600 }}>All carry-over decisions are correct.</span>
              </div>
            </div>
          )}
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Citation scenario</p>
          <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
            Evaluate this claim
          </h3>
          <div
            style={{
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px dashed ${HAIRLINE}`,
              background: SURFACE,
              color: INK_SECONDARY,
              fontSize: "0.95rem",
              lineHeight: 1.55,
            }}
          >
            &quot;Ancient Vedic astrologers used exactly this technique to read merchant guilds&apos; charts for centuries.&quot;
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => setScenarioChoice("acceptable")}
              aria-pressed={scenarioChoice === "acceptable"}
              style={smallChipStyle(scenarioChoice === "acceptable", GREEN)}
            >
              Acceptable claim
            </button>
            <button
              type="button"
              onClick={() => setScenarioChoice("fabrication")}
              aria-pressed={scenarioChoice === "fabrication"}
              style={smallChipStyle(scenarioChoice === "fabrication", VERMILION)}
            >
              Fabrication
            </button>
          </div>

          {scenarioChoice === "acceptable" && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}`, color: VERMILION, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                <AlertTriangle size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                <span>
                  This overclaims. No verified classical source in this curriculum supports the specific ongoing-reading technique or merchant-guild practice. The honest statement separates the classical root from the modern extension.
                </span>
              </div>
            </div>
          )}
          {scenarioChoice === "fabrication" && (
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                <BadgeCheck size={18} aria-hidden="true" style={{ flexShrink: 0 }} />
                <span>
                  Correct. The claim invents an ancient pedigree. The defensible framing: T1-23 gives a genuine classical root, and the ongoing company-chart reading is a disclosed modern extension.
                </span>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Commitment */}
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Orientation commitment</p>
        <h3 style={{ margin: "0.15rem 0 0.65rem", color: INK_PRIMARY, fontSize: "1.2rem" }}>
          Check each discipline before proceeding
        </h3>
        <div style={workbenchTwoColumnStyle as CSSProperties}>
          <CommitmentRow
            checked={commitments.classical}
            onClick={() => toggleCommitment("classical")}
            label="I will distinguish the classical precedent from the disclosed modern extension."
          />
          <CommitmentRow
            checked={commitments.scope}
            onClick={() => toggleCommitment("scope")}
            label="I will apply only natal techniques that do not presuppose an individual jīva."
          />
          <CommitmentRow
            checked={commitments.honest}
            onClick={() => toggleCommitment("honest")}
            label="I will describe MC6's mixed profile honestly, without smoothing over volatility."
          />
        </div>
        {allCommitted && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}`, color: GREEN, fontSize: "0.9rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <BadgeCheck size={18} aria-hidden="true" />
              <span style={{ fontWeight: 600 }}>Orientation complete. You are ready for the founder-incorporation overlay.</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function categoryColor(category: ClaimCategory): string {
  return category === "classical" ? GREEN : category === "modern" ? BLUE : VERMILION;
}

function Mc6Wheel() {
  const [hovered, setHovered] = useState<number | null>(null);
  const positions: Record<number, { x: number; y: number }> = {
    1: { x: 100, y: 100 }, 2: { x: 55, y: 80 }, 3: { x: 35, y: 45 },
    4: { x: 60, y: 20 }, 5: { x: 100, y: 10 }, 6: { x: 140, y: 20 },
    7: { x: 165, y: 45 }, 8: { x: 145, y: 80 }, 9: { x: 125, y: 115 },
    10: { x: 100, y: 145 }, 11: { x: 75, y: 115 }, 12: { x: 35, y: 115 },
  };

  return (
    <div style={{ textAlign: "center" }}>
      <svg viewBox="0 0 200 170" style={{ width: "100%", maxWidth: 240, height: "auto" }}>
        <circle cx="100" cy="85" r="70" fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
        {Array.from({ length: 12 }).map((_, i) => {
          const h = i + 1;
          const pos = positions[h];
          const placement = MC6_PLACEMENTS.find((p) => p.house === h);
          return (
            <g key={h}>
              <line x1={100} y1={85} x2={pos.x} y2={pos.y} stroke={HAIRLINE} strokeWidth={1} opacity={0.5} />
              <circle
                cx={pos.x}
                cy={pos.y}
                r={placement ? 16 : 10}
                fill={placement ? `${placement.color}20` : SURFACE}
                stroke={placement ? placement.color : HAIRLINE}
                strokeWidth={placement ? 2 : 1}
                style={{ cursor: placement ? "pointer" : "default" }}
                onMouseEnter={() => placement && setHovered(placement.house)}
                onMouseLeave={() => setHovered(null)}
              />
              <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={placement ? 8 : 7} fontWeight={600} fill={placement ? placement.color : INK_PRIMARY}>
                {h}
              </text>
              {placement && (
                <g transform={`translate(${pos.x + 12}, ${pos.y - 12})`}>
                  {placement.icon}
                </g>
              )}
            </g>
          );
        })}
      </svg>
      {hovered ? (
        <div style={{ marginTop: "0.55rem", padding: "0.55rem", borderRadius: 6, background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontSize: "0.85rem" }}>
          {(() => {
            const p = MC6_PLACEMENTS.find((x) => x.house === hovered)!;
            return (
              <span>
                <strong style={{ color: p.color, fontWeight: 600 }}>{p.graha}</strong> in the {p.house}th house — {p.dignity}.
              </span>
            );
          })()}
        </div>
      ) : (
        <div style={{ marginTop: "0.55rem", color: INK_MUTED, fontSize: "0.8rem" }}>
          Hover a highlighted house to see the placement.
        </div>
      )}
    </div>
  );
}

function CommitmentRow({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.65rem",
        width: "100%",
        padding: "0.65rem",
        borderRadius: 6,
        border: `1px solid ${checked ? GREEN : HAIRLINE}`,
        background: checked ? `${GREEN}08` : SURFACE,
        color: INK_PRIMARY,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          borderRadius: 4,
          border: `1px solid ${checked ? GREEN : HAIRLINE}`,
          background: checked ? GREEN : SURFACE,
          color: "#fff",
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        {checked ? <CheckSquare size={14} aria-hidden="true" /> : <Square size={14} aria-hidden="true" style={{ color: INK_MUTED }} />}
      </span>
      <span style={{ fontSize: "0.9rem", fontWeight: 500, lineHeight: 1.45 }}>{label}</span>
    </button>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, borderColor: color }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.65rem" }}>
        <span style={{ color }}>{icon}</span>
        <p style={{ margin: 0, color, fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
      </div>
      {children}
    </section>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.75rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  fontSize: "0.85rem",
  lineHeight: 1.55,
};

function buttonStyle(primary: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${primary ? color : HAIRLINE}`,
    background: primary ? color : SURFACE,
    color: primary ? "#fff" : color,
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.3rem",
    padding: "0.35rem 0.6rem",
    borderRadius: 999,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}12` : SURFACE,
    color: active ? color : INK_PRIMARY,
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}
