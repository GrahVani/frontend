"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  CheckCircle2,
  Info,
  RefreshCcw,
  Scale,
  XCircle,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHADOW = "var(--gl-shadow-soft)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";


type Picture = "reassuring" | "concerning";

const REWRITE_OPTIONS = [
  {
    label: "Your longevity computation came out favourably and your maraka lords are unafflicted, so you don't need to worry about health risks.",
    correct: false,
    feedback: "Names specific findings and converts reassurance into a guarantee — both violate the disclosure discipline.",
  },
  {
    label: "Your chart doesn't show anything that specifically concerns me. I'd still always encourage the basics: regular checkups and taking real symptoms seriously.",
    correct: true,
    feedback: "Correct — universal, undated, proactive guidance that would be appropriate regardless of the underlying finding.",
  },
  {
    label: "The classical methods disagree too much to say anything useful, so let's not discuss health at all.",
    correct: false,
    feedback: "Dismissing the topic is not necessary. General proactive guidance is still useful and honest.",
  },
];

const MISTAKES = [
  {
    label: "Letting a reassuring picture loosen the disclosure discipline",
    wrong: "Because Chart H1's findings are favourable, client-facing language names specific findings (\"your longevity computation came out favourably\").",
    right: "The register is identical regardless of valence — reassurance is delivered in the same undated, unspecific, universal terms as any other finding.",
  },
  {
    label: "Treating \"no configuration matched\" as a stronger claim than it is",
    wrong: "\"No Bālāriṣṭa configuration matched\" is communicated or internally treated as \"no risk of any kind exists.\"",
    right: "The finding is that nothing in this module's risk-timing apparatus raises concern — never a claim that no risk of any kind exists.",
  },
  {
    label: "Skipping the \"what would concern look like\" exercise",
    wrong: "A learner masters the discipline only for reassuring charts, never testing it against a hypothetically concerning case.",
    right: "Work through the hypothetical deliberately — confirm that the client-facing register would not change even in the concerning case, only the practitioner's private calibration.",
  },
];

const LAYERS = {
  reassuring: [
    {
      layer: "Bālāriṣṭa configurations",
      chapter: "Chapter 2",
      finding: "No match among the eight major configurations — Moon unafflicted, own sign.",
      tone: "reassuring",
    },
    {
      layer: "Longevity computation",
      chapter: "Chapter 3",
      finding: "Three figures genuinely disagree (Piṇḍāyu 70.9y, Aṁśāyu 68.3y, Naisargikāyu 56.7y); none cluster short. The classically-selected primary is the outlier.",
      tone: "mixed",
    },
    {
      layer: "Maraka structural picture",
      chapter: "Chapter 4",
      finding: "Unamplified: 2nd lord Moon in own sign, 7th lord Jupiter exalted, conjunct, unassociated with dusthāna lords; 8th lord Saturn debilitated but neecha-bhaṅga cancelled.",
      tone: "reassuring",
    },
  ],
  concerning: [
    {
      layer: "Bālāriṣṭa configurations",
      chapter: "Chapter 2",
      finding: "A major configuration matches, with fewer than two or three of the seven cancellation conditions present.",
      tone: "concerning",
    },
    {
      layer: "Longevity computation",
      chapter: "Chapter 3",
      finding: "The classically-selected primary method produces a short figure; the other two methods do not strongly contradict it.",
      tone: "concerning",
    },
    {
      layer: "Maraka structural picture",
      chapter: "Chapter 4",
      finding: "A natural malefic maraka lord, afflicted, conjunct or exchanged with a dusthāna lord; 8th lord weak and linked to the primary marakas.",
      tone: "concerning",
    },
  ],
};

export function MarakaSynthesisWorkbench() {
  const [picture, setPicture] = useState<Picture>("reassuring");
  const [rewriteSelection, setRewriteSelection] = useState<number | null>(null);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const reset = () => {
    setPicture("reassuring");
    setRewriteSelection(null);
    setOpenMistakes({});
  };

  const toggleMistake = (index: number) => setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  return (
    <div data-interactive="maraka-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Maraka synthesis workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.35rem", fontWeight: 600 }}>
              Hold three chapters together, then speak in the universal register
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              Chart H1&apos;s Bālāriṣṭa, longevity, and maraka findings produce a reassuring internal picture. The client-facing language stays the same whether that picture is reassuring or concerning.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Synthesis layers</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
          Three independent techniques, one internal picture
        </h3>
        <SynthesisSvg picture={picture} />
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {LAYERS[picture].map((row) => (
            <div key={row.layer} style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "0.75rem", padding: "0.6rem 0.75rem", borderRadius: 6, border: `1px solid ${row.tone === "reassuring" ? GREEN : row.tone === "mixed" ? GOLD : VERMILION}44`, background: `${row.tone === "reassuring" ? GREEN : row.tone === "mixed" ? GOLD : VERMILION}08` }}>
              <div>
                <p style={{ margin: 0, color: row.tone === "reassuring" ? GREEN : row.tone === "mixed" ? GOLD : VERMILION, fontWeight: 600 }}>{row.layer}</p>
                <p style={{ margin: "0.15rem 0 0", fontSize: "0.78rem", color: INK_MUTED, fontWeight: 500 }}>{row.chapter}</p>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>{row.finding}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Picture toggle</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Compare the actual chart with a hypothetical concerning case
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <button type="button" aria-pressed={picture === "reassuring"} onClick={() => setPicture("reassuring")} style={smallChipStyle(picture === "reassuring", GREEN)}>
            Chart H1 — reassuring
          </button>
          <button type="button" aria-pressed={picture === "concerning"} onClick={() => setPicture("concerning")} style={smallChipStyle(picture === "concerning", VERMILION)}>
            Hypothetical — concerning
          </button>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, background: picture === "reassuring" ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${picture === "reassuring" ? GREEN : VERMILION}55` }}>
          <p style={{ margin: 0, color: picture === "reassuring" ? GREEN : VERMILION, fontWeight: 500 }}>
            {picture === "reassuring" ? "Internal calibration: low vigilance" : "Internal calibration: heightened vigilance"}
          </p>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 400 }}>
            {picture === "reassuring"
              ? "Nothing in the risk-timing apparatus raises particular concern. The practitioner privately holds a modestly more relaxed baseline."
              : "Multiple layers converge toward concern. The practitioner privately takes the chart more seriously — but the client-facing register still does not change."}
          </p>
        </div>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Client-facing language</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GREEN, fontSize: "1.1rem", fontWeight: 600 }}>
          The same response for both pictures
        </h3>
        <div style={{ padding: "0.75rem", borderRadius: 8, background: `${GREEN}10`, border: `1px solid ${GREEN}55` }}>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontWeight: 400 }}>
            &quot;Your chart doesn&apos;t show anything that specifically concerns me — I&apos;d still always encourage the basics: regular checkups, taking real symptoms seriously rather than dismissing them, the same things I&apos;d tell anyone.&quot;
          </p>
        </div>
        <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
          This sentence is appropriate whether the internal picture is reassuring or concerning. The register does not change; only the practitioner&apos;s private attentiveness does.
        </p>
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Statement rewriter</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
          Choose the correctly framed response
        </h3>
        <div style={{ padding: "0.75rem", borderRadius: 8, background: `${VERMILION}10`, border: `1px solid ${VERMILION}55`, marginBottom: "0.65rem" }}>
          <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500 }}>
            Harmful statement: &quot;Your longevity computation came out favourably and your maraka lords are unafflicted, so you&apos;re not at risk.&quot;
          </p>
        </div>
        <div style={{ display: "grid", gap: "0.45rem" }}>
          {REWRITE_OPTIONS.map((option, index) => {
            const isSelected = rewriteSelection === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setRewriteSelection(index)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "0.6rem 0.75rem",
                  borderRadius: 6,
                  border: `1px solid ${isSelected ? (option.correct ? GREEN : VERMILION) : HAIRLINE}`,
                  background: isSelected ? (option.correct ? `${GREEN}10` : `${VERMILION}10`) : "transparent",
                  cursor: "pointer",
                  color: INK_PRIMARY,
                  fontWeight: 400,
                }}
              >
                <span style={{ display: "flex", alignItems: "start", gap: "0.5rem" }}>
                  {isSelected ? (
                    option.correct ? <CheckCircle2 size={16} style={{ color: GREEN, flexShrink: 0 }} /> : <XCircle size={16} style={{ color: VERMILION, flexShrink: 0 }} />
                  ) : (
                    <span style={{ width: 16, height: 16, borderRadius: "50%", border: `1px solid ${HAIRLINE}`, flexShrink: 0 }} />
                  )}
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
        {rewriteSelection !== null && (
          <div style={{ marginTop: "0.6rem", padding: "0.6rem 0.75rem", borderRadius: 6, background: REWRITE_OPTIONS[rewriteSelection].correct ? `${GREEN}10` : `${VERMILION}10`, border: `1px solid ${REWRITE_OPTIONS[rewriteSelection].correct ? GREEN : VERMILION}55`, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
            {REWRITE_OPTIONS[rewriteSelection].feedback}
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Three ways the synthesis is mishandled
        </h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {MISTAKES.map((item, index) => {
            const open = openMistakes[index];
            return (
              <div key={index} style={{ border: `1px solid ${open ? VERMILION : HAIRLINE}`, borderRadius: 8, background: open ? `${VERMILION}0D` : SURFACE, padding: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => toggleMistake(index)}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", color: INK_PRIMARY, fontWeight: 500 }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Info size={15} aria-hidden="true" style={{ color: open ? VERMILION : INK_MUTED }} />
                    {item.label}
                  </span>
                </button>
                {open && (
                  <div style={{ marginTop: "0.6rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                    <p style={{ margin: 0, color: VERMILION }}>
                      <span style={{ fontWeight: 600 }}>Overclaim:</span> {item.wrong}
                    </p>
                    <p style={{ margin: "0.35rem 0 0" }}>
                      <span style={{ fontWeight: 600, color: GREEN }}>Honest reading:</span> {item.right}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ ...panelStyle, background: `${BLUE}0A` }}>
        <div style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
          <Scale size={20} aria-hidden="true" style={{ color: BLUE, flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, color: BLUE, fontWeight: 600 }}>The hard discipline</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              A favourable picture is where over-claiming is easiest to rationalise — and therefore most important to resist. Reassurance does not earn precision.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function SynthesisSvg({ picture }: { picture: Picture }) {
  const colors = picture === "reassuring" ? [GREEN, GOLD, GREEN] : [VERMILION, VERMILION, VERMILION];
  return (
    <svg viewBox="0 0 360 120" role="img" aria-label="Three-layer synthesis diagram">
      <rect x="20" y="30" width="90" height="60" rx="6" fill={`${colors[0]}18`} stroke={colors[0]} />
      <text x="65" y="55" textAnchor="middle" fill={colors[0]} fontSize="10" fontWeight={600}>Bālāriṣṭa</text>
      <text x="65" y="75" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={400}>Chapter 2</text>

      <rect x="135" y="30" width="90" height="60" rx="6" fill={`${colors[1]}18`} stroke={colors[1]} />
      <text x="180" y="55" textAnchor="middle" fill={colors[1]} fontSize="10" fontWeight={600}>Āyur</text>
      <text x="180" y="75" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={400}>Chapter 3</text>

      <rect x="250" y="30" width="90" height="60" rx="6" fill={`${colors[2]}18`} stroke={colors[2]} />
      <text x="295" y="55" textAnchor="middle" fill={colors[2]} fontSize="10" fontWeight={600}>Maraka</text>
      <text x="295" y="75" textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={400}>Chapter 4</text>

      <line x1="110" y1="60" x2="135" y2="60" stroke={HAIRLINE} strokeWidth={1} />
      <line x1="225" y1="60" x2="250" y2="60" stroke={HAIRLINE} strokeWidth={1} />

      <text x="180" y="110" textAnchor="middle" fill={picture === "reassuring" ? GREEN : VERMILION} fontSize="11" fontWeight={600}>
        {picture === "reassuring" ? "Internal picture: reassuring" : "Internal picture: concerning"}
      </text>
    </svg>
  );
}

function buttonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

const panelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: SHADOW,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.76rem",
  fontWeight: 600,
};
