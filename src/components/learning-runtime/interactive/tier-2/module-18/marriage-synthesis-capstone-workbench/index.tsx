"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  MessageSquareQuote,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type RowKey = "moon" | "mars" | "rahu" | "jupiter" | "saturn" | "mercury" | "ketu" | "venus" | "sun";
type Disclosure = "omit" | "brief" | "detailed";
type PrecisionMode = "window" | "clock";
type MistakeKey = "chapterMustAdd" | "dwellDispute" | "noInformation";
type FindingKey = "jupiter" | "sun" | "mercury" | "moon" | "saturn" | "mars" | "venus" | "rahuKetu" | "ashtottari" | "yogini" | "conditionals";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const AMBER = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";
const GOLD_TINT = "#FFF8E8";
const GREEN_TINT = "#EAF4EE";
const BLUE_TINT = "#EAF0F8";
const VERMILION_TINT = "#FDEBE6";
const PURPLE_TINT = "#F1EEFA";
const MUTED_TINT = "#F4EFE4";

const ROWS: Record<RowKey, { label: string; ch13: string; ch4: string; ch5: string; total: string; tier: string; tierColor: string; note: string }> = {
  moon: { label: "Moon/Moon", ch13: "— (unevaluated)", ch4: "Dārākāraka self-rule (1)", ch5: "none", total: "1", tier: "Weak", tierColor: AMBER, note: "Moon itself as spouse-significator gives one structural reason." },
  mars: { label: "Moon/Mars", ch13: "0", ch4: "none", ch5: "none", total: "0", tier: "None", tierColor: INK_MUTED, note: "No marriage karaka and no 7th-cusp relationship." },
  rahu: { label: "Moon/Rāhu", ch13: "— (excluded)", ch4: "— (excluded)", ch5: "—", total: "—", tier: "Excluded", tierColor: INK_MUTED, note: "Not evaluable by this module's tools." },
  jupiter: { label: "Moon/Jupiter", ch13: "kāraka (1)", ch4: "none", ch5: "none", total: "1", tier: "Weak", tierColor: AMBER, note: "Jupiter is Kavya's husband-karaka; one genuine indicator." },
  saturn: { label: "Moon/Saturn", ch13: "ownership (≤1 partial)", ch4: "none", ch5: "none", total: "≤1", tier: "Weak / partial", tierColor: AMBER, note: "Ownership of the 7th cusp is real but weaker than aspect/occupation." },
  mercury: { label: "Moon/Mercury", ch13: "cusp-aspect (1)", ch4: "none", ch5: "none", total: "1", tier: "Weak", tierColor: AMBER, note: "Mercury aspects the 7th cusp; one structural indicator." },
  ketu: { label: "Moon/Ketu", ch13: "— (excluded)", ch4: "— (excluded)", ch5: "—", total: "—", tier: "Excluded", tierColor: INK_MUTED, note: "Not evaluable by this module's tools." },
  venus: { label: "Moon/Venus", ch13: "0", ch4: "none", ch5: "none", total: "0", tier: "None", tierColor: INK_MUTED, note: "Romance-domain karaka but not the specific marriage-karaka; no 7th-cusp link." },
  sun: { label: "Moon/Sun", ch13: "cusp-aspect (1)", ch4: "none", ch5: "none", total: "1", tier: "Weak", tierColor: AMBER, note: "Sun aspects the 7th cusp; one structural indicator." },
};

const ROW_ORDER: RowKey[] = ["moon", "mars", "rahu", "jupiter", "saturn", "mercury", "ketu", "venus", "sun"];

const FINDINGS: Record<FindingKey, { label: string; defaultChecked: boolean }> = {
  jupiter: { label: "Moon/Jupiter — husband-kāraka (Weak)", defaultChecked: true },
  sun: { label: "Moon/Sun — cusp-aspect (Weak)", defaultChecked: true },
  mercury: { label: "Moon/Mercury — cusp-aspect (Weak)", defaultChecked: true },
  moon: { label: "Moon/Moon — dārākāraka self-rule (Weak)", defaultChecked: true },
  saturn: { label: "Moon/Saturn — 7th-cusp ownership (partial)", defaultChecked: true },
  mars: { label: "Moon/Mars — no signal", defaultChecked: false },
  venus: { label: "Moon/Venus — no signal", defaultChecked: false },
  rahuKetu: { label: "Rāhu/Ketu periods — unevaluated", defaultChecked: true },
  ashtottari: { label: "Aṣṭottarī — genuinely disputed status", defaultChecked: true },
  yogini: { label: "Yoginī — condition-free but no age-timeline", defaultChecked: true },
  conditionals: { label: "Five recognition-level conditionals — outside verified computation", defaultChecked: true },
};

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  chapterMustAdd: {
    label: "Chapter 5 does not have to change the table",
    heldText: "Held: the unchanged table is the honest, traceable consequence of disclosed scope decisions.",
    releasedText: "Warning: a capstone chapter can legitimately add nothing if earlier limits already bound what it can compute.",
  },
  dwellDispute: {
    label: "Name Aṣṭottarī's dispute briefly, not at length",
    heldText: "Held: proportionate disclosure keeps the disputed check from becoming the centre of the conversation.",
    releasedText: "Warning: over-explaining a technical dispute to a client can confuse rather than help.",
  },
  noInformation: {
    label: "A field of Weak-tier findings is not 'no information'",
    heldText: "Held: a mapped, bounded set of weak possibilities is real, usable information.",
    releasedText: "Warning: collapsing 'no Moderate/Strong signal' into 'I found nothing' misrepresents the honest result.",
  },
};

export function MarriageSynthesisCapstoneWorkbench() {
  const [selectedRow, setSelectedRow] = useState<RowKey>("jupiter");
  const [scopes, setScopes] = useState({ conditionals: true, yoginiBalance: true, ashtottariDispute: true });
  const [disclosure, setDisclosure] = useState<Disclosure>("brief");
  const [precision, setPrecision] = useState<PrecisionMode>("window");
  const [findings, setFindings] = useState<Record<FindingKey, boolean>>(() =>
    Object.fromEntries(Object.entries(FINDINGS).map(([k, v]) => [k, v.defaultChecked])) as Record<FindingKey, boolean>
  );
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    chapterMustAdd: true,
    dwellDispute: true,
    noInformation: true,
  });

  const allScopesHeld = Object.values(scopes).every(Boolean);
  const allMistakesHeld = Object.values(mistakes).every(Boolean);

  const statement = useMemo(() => buildStatement({ findings, disclosure, precision }), [findings, disclosure, precision]);

  function reset() {
    setSelectedRow("jupiter");
    setScopes({ conditionals: true, yoginiBalance: true, ashtottariDispute: true });
    setDisclosure("brief");
    setPrecision("window");
    setFindings(Object.fromEntries(Object.entries(FINDINGS).map(([k, v]) => [k, v.defaultChecked])) as Record<FindingKey, boolean>);
    setMistakes({ chapterMustAdd: true, dwellDispute: true, noInformation: true });
  }

  function toggleFinding(key: FindingKey) {
    setFindings((f) => ({ ...f, [key]: !f[key] }));
  }

  return (
    <div data-interactive="marriage-synthesis-capstone-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 18 capstone synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Marriage-question synthesis builder
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Assemble five chapters of honest work into a single client-ready account. Chapter 5 adds no new row; the precision lies in stating exactly what the evidence supports.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <p style={eyebrowStyle}>Section 4.1 synthesis table</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            No antardaśā reaches the two-yes / Moderate threshold
          </h3>
          <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", minWidth: 560 }}>
              <thead>
                <tr style={{ background: GOLD_TINT }}>
                  <th style={thStyle}>Antardaśā</th>
                  <th style={thStyle}>Ch 1-3</th>
                  <th style={thStyle}>Ch 4</th>
                  <th style={thStyle}>Ch 5</th>
                  <th style={thStyle}>Total</th>
                  <th style={thStyle}>Tier</th>
                </tr>
              </thead>
              <tbody>
                {ROW_ORDER.map((key) => {
                  const row = ROWS[key];
                  const active = key === selectedRow;
                  return (
                    <tr
                      key={key}
                      onClick={() => setSelectedRow(key)}
                      style={{ background: active ? GOLD_TINT : "transparent", cursor: "pointer" }}
                    >
                      <td style={tdStyle}><span style={{ fontWeight: active ? 600 : 400 }}>{row.label}</span></td>
                      <td style={tdStyle}>{row.ch13}</td>
                      <td style={tdStyle}>{row.ch4}</td>
                      <td style={tdStyle}>{row.ch5}</td>
                      <td style={tdStyle}>{row.total}</td>
                      <td style={tdStyle}><span style={{ color: row.tierColor, fontWeight: 600 }}>{row.tier}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}`, background: GOLD_TINT }}>
            <div style={{ color: GOLD, fontWeight: 600, marginBottom: "0.35rem" }}>{ROWS[selectedRow].label}</div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>{ROWS[selectedRow].note}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 320px" }}>
          <Panel title="Why Chapter 5 adds nothing" icon={<ShieldCheck size={18} />} color={BLUE}>
            <ScopeToggle
              label="Five conditionals held at recognition depth"
              active={scopes.conditionals}
              onClick={() => setScopes((s) => ({ ...s, conditionals: !s.conditionals }))}
            />
            <ScopeToggle
              label="Yoginī has no birth-balance formula"
              active={scopes.yoginiBalance}
              onClick={() => setScopes((s) => ({ ...s, yoginiBalance: !s.yoginiBalance }))}
            />
            <ScopeToggle
              label="Aṣṭottarī is disputed / lacks balance formula"
              active={scopes.ashtottariDispute}
              onClick={() => setScopes((s) => ({ ...s, ashtottariDispute: !s.ashtottariDispute }))}
            />
            <div
              style={{
                marginTop: "0.65rem",
                padding: "0.55rem 0.75rem",
                borderRadius: 8,
                background: allScopesHeld ? GREEN_TINT : VERMILION_TINT,
                border: `1px solid ${allScopesHeld ? GREEN : VERMILION}`,
                color: allScopesHeld ? GREEN : VERMILION,
                fontWeight: 600,
              }}
            >
              {allScopesHeld
                ? "All three scope decisions are in place → Chapter 5 correctly adds no new row."
                : "A scope decision is released. If that limit were removed, the table might wrongly appear to need a Chapter 5 update."}
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Five-chapter flow</p>
        <ChapterFlowSvg />
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Chapters 1-4 build the table row by row. Chapter 5’s contribution is the honest judgment that its own tools cannot sharpen any cell further — a real conclusion, not an absence of work.
        </p>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <p style={eyebrowStyle}>Synthesis statement builder</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Choose what belongs in the final account
          </h3>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            {(Object.keys(FINDINGS) as FindingKey[]).map((key) => (
              <label key={key} style={{ display: "flex", alignItems: "start", gap: "0.55rem", cursor: "pointer", color: INK_SECONDARY }}>
                <input
                  type="checkbox"
                  checked={findings[key]}
                  onChange={() => toggleFinding(key)}
                  style={{ marginTop: "0.2rem" }}
                />
                <span>{FINDINGS[key].label}</span>
              </label>
            ))}
          </div>

          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.85rem" }}>
            <div>
              <p style={{ ...eyebrowStyle, marginBottom: "0.45rem" }}>Aṣṭottarī disclosure</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(["omit", "brief", "detailed"] as Disclosure[]).map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={disclosure === d}
                    onClick={() => setDisclosure(d)}
                    style={smallChipStyle(disclosure === d, d === "omit" ? INK_MUTED : d === "brief" ? BLUE : PURPLE)}
                  >
                    {d === "omit" ? "Omit" : d === "brief" ? "Name briefly" : "Explain in detail"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p style={{ ...eyebrowStyle, marginBottom: "0.45rem" }}>Precision discipline</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(["window", "clock"] as PrecisionMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={precision === m}
                    onClick={() => setPrecision(m)}
                    style={smallChipStyle(precision === m, m === "window" ? GREEN : VERMILION)}
                  >
                    {m === "window" ? "Window (honest)" : "Clock-time (overclaim)"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px", borderColor: precision === "clock" ? VERMILION : GREEN, background: precision === "clock" ? VERMILION_TINT : GREEN_TINT }}>
          <p style={eyebrowStyle}>Live client-ready statement</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: precision === "clock" ? VERMILION : GREEN, marginBottom: "0.65rem" }}>
            <MessageSquareQuote size={18} aria-hidden="true" />
            <span style={{ fontWeight: 600 }}>{precision === "clock" ? "Overclaim warning" : "Honest synthesis"}</span>
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.65, whiteSpace: "pre-line" }}>{statement}</p>
          {precision === "clock" && (
            <p style={{ margin: "0.75rem 0 0", color: VERMILION, lineHeight: 1.55 }}>
              Clock-time precision is not supported by daśā-based timing alone. Switch back to window language to keep the statement honest.
            </p>
          )}
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const held = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 600 }}>{MISTAKES[key].label}</strong>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? MISTAKES[key].heldText : MISTAKES[key].releasedText}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allMistakesHeld ? GREEN_TINT : VERMILION_TINT,
            border: `1px solid ${allMistakesHeld ? GREEN : VERMILION}`,
            color: allMistakesHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allMistakesHeld
            ? "All discipline commitments are held. The synthesis is proportionate and honest."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function buildStatement({ findings, disclosure, precision }: { findings: Record<FindingKey, boolean>; disclosure: Disclosure; precision: PrecisionMode }) {
  const parts: string[] = [];
  parts.push("Looking across everything I can honestly check for your marriage timing — your planetary daśā sequence, cusp relationships, kāraka indications, sign-based daśā, and the further conditional daśās available in the tradition — here is where that leaves us.");

  const weak: string[] = [];
  if (findings.jupiter) weak.push("the period ruled by your husband-kāraka");
  if (findings.moon) weak.push("your own period at the start of this decade, tied to your chart-specific spouse-significator");
  if (findings.sun) weak.push("a period whose ruler aspects your marriage house");
  if (findings.mercury) weak.push("another period whose ruler aspects your marriage house");
  if (weak.length > 0) {
    parts.push(`Four periods carry one genuine, independently-computed reason to watch them: ${weak.join(", ")}.`);
  }
  if (findings.saturn) {
    parts.push("A fifth period carries a related but weaker reason through ownership of the marriage house.");
  }
  if (findings.mars && findings.venus) {
    parts.push("Two other periods carry no marriage-relevant signal by these checks.");
  } else {
    if (findings.mars) parts.push("The Moon/Mars period carries no marriage-relevant signal.");
    if (findings.venus) parts.push("The Moon/Venus period carries no marriage-relevant signal.");
  }
  if (findings.rahuKetu) {
    parts.push("The Rāhu and Ketu periods were not evaluable with the tools used in this module.");
  }

  if (disclosure !== "omit" && findings.ashtottari) {
    if (disclosure === "brief") {
      parts.push("I checked Aṣṭottarī and found that whether it even applies depends on a genuine, unresolved textual question — I am naming this rather than hiding it or relying on it.");
    } else {
      parts.push("I checked Aṣṭottarī and found that whether it applies to your chart depends on which of two sourceable readings of BPHS 49 is used. One reading does not trigger for your chart; the other does. I cannot independently verify which is correct at the precision needed, so I am naming the dispute rather than adopting the version that produces a more convenient answer.");
    }
  }

  if (findings.yogini) {
    parts.push("Yoginī is freely applicable, but without a verified birth-balance formula its starting period cannot be mapped to a specific age.");
  }
  if (findings.conditionals) {
    parts.push("The remaining conditional daśās were held at recognition depth and do not add antardaśā-level detail here.");
  }

  if (precision === "window") {
    parts.push("None of this reaches the confidence I would need to name one specific window as more likely than the others. What I can honestly offer is a small set of periods worth attention rather than a single, confident date — and if you want to sharpen this further, your Navāṁśa chart and transits closer to any of these windows would be the next real steps.");
  } else {
    parts.push("Based on this work, the marriage event is predicted for [specific date].");
  }

  return parts.join("\n\n");
}

function ChapterFlowSvg() {
  const boxes = [
    { x: 20, label: "Ch 1-3", lines: ["Vimśottarī +", "cusp/kāraka"], color: BLUE },
    { x: 146, label: "Ch 4", lines: ["Cara + Sthira", "cross-check"], color: PURPLE },
    { x: 272, label: "Ch 5.1", lines: ["Recognition", "scope"], color: AMBER },
    { x: 398, label: "Ch 5.2", lines: ["Aṣṭottarī /", "Yoginī"], color: GREEN },
    { x: 524, label: "Ch 5.3", lines: ["No new row", "honest synthesis"], color: VERMILION },
  ];
  return (
    <svg viewBox="0 0 650 145" role="img" aria-label="Five chapter synthesis flow" style={{ width: "100%", maxHeight: 185, margin: "0.55rem auto 0.25rem", display: "block" }}>
      {boxes.map((b, i) => (
        <g key={b.label}>
          <rect x={b.x} y="18" width="106" height="64" rx="8" fill={tintForColor(b.color)} stroke={b.color} strokeWidth="2" />
          <text x={b.x + 53} y="38" textAnchor="middle" fill={b.color} fontSize="11" fontWeight={600}>{b.label}</text>
          {b.lines.map((line, lineIndex) => (
            <text key={line} x={b.x + 53} y={lineIndex === 0 ? 56 : 70} textAnchor="middle" fill={INK_SECONDARY} fontSize="8.5" fontWeight={600}>
              {line}
            </text>
          ))}
          {i < boxes.length - 1 && (
            <>
              <line x1={b.x + 106} y1="50" x2={boxes[i + 1].x - 8} y2="50" stroke={HAIRLINE} strokeWidth="2" />
              <polygon points={`${boxes[i + 1].x - 8},50 ${boxes[i + 1].x - 14},46 ${boxes[i + 1].x - 14},54`} fill={HAIRLINE} />
            </>
          )}
        </g>
      ))}
      <text x="325" y="116" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Chapter 5’s conclusion is that its own limits prevent a sharper finding</text>
    </svg>
  );
}

function ScopeToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{
        display: "grid",
        gridTemplateColumns: "24px 1fr",
        gap: "0.65rem",
        alignItems: "start",
        textAlign: "left",
        width: "100%",
        border: `1px solid ${active ? GREEN : HAIRLINE}`,
        borderRadius: 8,
        background: active ? GREEN_TINT : "transparent",
        color: active ? GREEN : INK_SECONDARY,
        padding: "0.65rem",
        marginTop: "0.5rem",
        cursor: "pointer",
      }}
    >
      {active ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
      <span>{label}</span>
    </button>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? tintForColor(color) : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

function tintForColor(color: string): string {
  switch (color) {
    case BLUE:
      return BLUE_TINT;
    case GREEN:
      return GREEN_TINT;
    case GOLD:
    case AMBER:
      return GOLD_TINT;
    case VERMILION:
      return VERMILION_TINT;
    case PURPLE:
      return PURPLE_TINT;
    default:
      return MUTED_TINT;
  }
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const thStyle: CSSProperties = {
  padding: "0.55rem 0.65rem",
  textAlign: "left",
  color: INK_MUTED,
  fontWeight: 700,
  borderBottom: `1px solid ${HAIRLINE}`,
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem 0.65rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_SECONDARY,
};
