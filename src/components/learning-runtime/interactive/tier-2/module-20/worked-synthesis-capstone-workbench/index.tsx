"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  CircleSlash,
  ClipboardList,
  Eye,
  FileText,
  GitMerge,
  Layers,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Target,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

type ShapeKey = "tie" | "independent" | "same-root" | "silence" | "non-discrimination" | "sourcing-boundary";
type CandidateKey = "A" | "B" | "C";

const SHAPE_META: Record<ShapeKey, { label: string; color: string; counts: boolean }> = {
  tie: { label: "Tie", color: GOLD, counts: false },
  independent: { label: "Independent discrimination", color: GREEN, counts: true },
  "same-root": { label: "Same-root (reliability only)", color: PURPLE, counts: false },
  silence: { label: "Silence", color: BLUE, counts: false },
  "non-discrimination": { label: "Non-discrimination", color: INK_MUTED, counts: false },
  "sourcing-boundary": { label: "Non-discrimination (sourcing boundary)", color: INK_MUTED, counts: false },
};

const ROWS: {
  chapter: string;
  method: string;
  shape: ShapeKey;
  a: string;
  b: string;
  c: string;
  detail: string;
}[] = [
  { chapter: "Ch2", method: "Events-based", shape: "tie", a: "tie", b: "tie", c: "EXCLUDED", detail: "Four-part matching test run twice. Candidate C's window could not explain a documented event and was excluded. A and B remained tied — a structural tie, not a failure." },
  { chapter: "Ch3", method: "Tattva-śuddhi", shape: "independent", a: "not favoured", b: "FAVOURED", c: "untouched", detail: "Elemental-compatibility reading across the whole chart, independent of events-based inputs. First independent-discrimination thread, favouring B." },
  { chapter: "Ch4", method: "KP RPP classical", shape: "tie", a: "tie", b: "tie", c: "untouched", detail: "Five-role Ruling Planets set. Tied completely across A, B, and C, but confirmed the method's general fit to Vikram's real events." },
  { chapter: "Ch4", method: "KP RPP sub-lord", shape: "independent", a: "not favoured", b: "FAVOURED", c: "untouched", detail: "Sixth, finer role for tie-breaking. Computed strictly from each candidate's Lagna degree. Second independent-discrimination thread, favouring B." },
  { chapter: "Ch5.1", method: "Praśna-derived", shape: "silence", a: "no signal", b: "no signal", c: "untouched", detail: "Consultation-moment chart Ruling Planets checked against every significant planet established so far. Touched none — an honest silence, not a gap." },
  { chapter: "Ch5.2", method: "Nāḍiāṁśa", shape: "same-root", a: "not favoured", b: "favoured", c: "untouched", detail: "Finest-resolution method (12′ divisions). Agrees with the sub-lord — but shares its exact input (the Lagna degree), so it is a reliability check, not a third vote." },
  { chapter: "Ch5.3", method: "Janma Tāra", shape: "non-discrimination", a: "same", b: "same", c: "same", detail: "Simplest classical method. Identical favourable result for all three candidates, since neither relevant nakṣatra varies across them." },
  { chapter: "Ch6", method: "D60", shape: "sourcing-boundary", a: "separable", b: "separable", c: "separable", detail: "All three candidates produce distinct ṣaṣṭyāṁśa indices: A = 50th of Virgo, B = 56th of Virgo, C = 2nd of Libra. Separability is confirmed; the fine benefic/malefic read is unavailable by curriculum sourcing policy." },
];

const CANDIDATES: Record<CandidateKey, { label: string; status: string; color: string; detail: string }> = {
  A: {
    label: "Candidate A · 05:48",
    status: "Live, honest alternative",
    color: BLUE,
    detail: "Not excluded. No method ever favoured A over B; several found nothing to say about it specifically.",
  },
  B: {
    label: "Candidate B · 06:00",
    status: "Favoured at moderate confidence",
    color: GREEN,
    detail: "Two independent threads (tattva-śuddhi, sub-lord), cross-checked for reliability by Nāḍiāṁśa and D60. Working rectified time.",
  },
  C: {
    label: "Candidate C · 06:12",
    status: "Excluded, Chapter 2",
    color: VERMILION,
    detail: "Excluded on clear, specific grounds — its window could not explain a documented event. Untouched by every subsequent chapter.",
  },
};

const FINAL_REPORT =
  "After a full seven-method rectification analysis: your birth-time window has been narrowed from three candidates to two, with the third (06:12) confidently ruled out early in the process based on a documented event it could not explain. Between the remaining two candidates (05:48 and 06:00), the evidence points consistently toward 06:00, and I'm treating that as your working birth time. I want to be precise about how confident that recommendation is: it rests on two genuinely independent lines of analysis that agree, cross-checked further by two additional methods that confirmed those findings' reliability without adding new grounds of their own, plus two further checks that had nothing to add either way — which, for those specific techniques applied to your specific chart, is an expected and normal outcome, not a gap in the work. In the vocabulary this profession uses for confidence, that adds up to a moderate indication — real and usable, not yet a full confirmation. If a new, precisely dated life event ever comes to light, we could test it against this finding and likely strengthen it further. Until then, 06:00 is what I recommend working from.";

export function WorkedSynthesisCapstoneWorkbench() {
  const [selectedRow, setSelectedRow] = useState<number | null>(0);
  const [d60ConfirmAttempt, setD60ConfirmAttempt] = useState(false);
  const [inflationAttempt, setInflationAttempt] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const honestCount = 2;
  const inflatedCount = 4;
  const displayCount = inflationAttempt ? inflatedCount : honestCount;
  const tier = inflationAttempt ? { label: "Strong indication", color: GREEN } : { label: "Moderate indication", color: GOLD };

  const selected = selectedRow !== null ? ROWS[selectedRow] : null;

  const reset = () => {
    setSelectedRow(0);
    setD60ConfirmAttempt(false);
    setInflationAttempt(false);
    setShowReport(false);
  };

  return (
    <div data-interactive="worked-synthesis-capstone-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked synthesis · capstone</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Assemble the full eight-row case file and issue the final, honest verdict
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Walk the complete six-chapter record, complete the D60 test within its sourcing boundary, and compute Vikram&apos;s final tier without inflation.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            <div>
              <p style={eyebrowStyle}>Complete case-file matrix</p>
              <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem", fontWeight: 600 }}>
                Eight rows, six chapters, seven named methods
              </h3>
            </div>
            <span style={{ color: tier.color, fontWeight: 600 }}>{tier.label}</span>
          </div>
          <MatrixSvg selectedRow={selectedRow} onSelect={setSelectedRow} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.65rem", marginTop: "0.85rem" }}>
            <MiniFact icon={<GitMerge size={16} />} title="Independent threads" body={String(displayCount)} color={tier.color} />
            <MiniFact icon={<Scale size={16} />} title="Confidence tier" body={tier.label} color={tier.color} />
            <MiniFact icon={<Layers size={16} />} title="Non-contributing rows" body="6" color={BLUE} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px", alignContent: "start" }}>
          <Panel title="Selected row" icon={<Eye size={18} />} color={selected ? SHAPE_META[selected.shape].color : GOLD}>
            {selected ? (
              <div style={{ display: "grid", gap: "0.55rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{selected.chapter} · {selected.method}</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: SHAPE_META[selected.shape].color }}>{SHAPE_META[selected.shape].label}</span>
                </div>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{selected.detail}</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.35rem", fontSize: "0.78rem", color: INK_MUTED }}>
                  <span>A: {selected.a}</span>
                  <span>B: {selected.b}</span>
                  <span>C: {selected.c}</span>
                </div>
              </div>
            ) : (
              <p style={{ margin: 0, color: INK_MUTED }}>Select a row in the matrix to read its detail.</p>
            )}
          </Panel>

          <button
            type="button"
            aria-pressed={inflationAttempt}
            onClick={() => setInflationAttempt((value) => !value)}
            style={togglePanelStyle(inflationAttempt, inflationAttempt ? VERMILION : GREEN)}
          >
            <ShieldAlert size={18} aria-hidden="true" />
            <span>
              <span style={{ fontWeight: 600, display: "block" }}>Attempt inflated count (colleague&apos;s error)</span>
              <span>{inflationAttempt ? "Tier becomes strong — wrong. Nāḍiāṁśa is same-root; D60 confirms separability only." : "Two threads agree — the honest count is 2, not 4."}</span>
            </span>
          </button>
        </section>
      </div>

      <div style={responsiveThreeColumnStyle}>
        <Panel title="D60 verification" icon={<ClipboardList size={18} />} color={BLUE}>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8 }}>
              <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>Candidate A</span>
              <span style={{ color: BLUE, fontSize: "0.85rem" }}>50th ṣaṣṭyāṁśa of Virgo</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8 }}>
              <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>Candidate B</span>
              <span style={{ color: BLUE, fontSize: "0.85rem" }}>56th ṣaṣṭyāṁśa of Virgo</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8 }}>
              <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>Candidate C</span>
              <span style={{ color: BLUE, fontSize: "0.85rem" }}>2nd ṣaṣṭyāṁśa of Libra</span>
            </div>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
              Separability confirmed — a real precondition-check. The fine benefic/malefic read is unavailable by curriculum sourcing policy.
            </p>
          </div>
          <button
            type="button"
            aria-pressed={d60ConfirmAttempt}
            onClick={() => setD60ConfirmAttempt((value) => !value)}
            style={{ ...togglePanelStyle(d60ConfirmAttempt, d60ConfirmAttempt ? VERMILION : BLUE), marginTop: "0.65rem" }}
          >
            <CircleSlash size={18} aria-hidden="true" />
            <span>
              <span style={{ fontWeight: 600, display: "block" }}>Attempt to mark D60 as &ldquo;confirming B&rdquo;</span>
              <span>{d60ConfirmAttempt ? "Refused. D60 confirms separability, not a discriminating read." : "Try it — the honest status is separability, not confirmation."}</span>
            </span>
          </button>
          {d60ConfirmAttempt ? (
            <div role="status" style={{ marginTop: "0.65rem", border: `1px solid ${VERMILION}55`, borderRadius: 8, background: `${VERMILION}10`, padding: "0.65rem 0.75rem", color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.85rem" }}>
              <strong style={{ color: VERMILION, fontWeight: 600 }}>Refused.</strong> D60&apos;s honest contribution is precondition-confirmation, not a third vote. Marking it as a confirmation would fabricate a finding this module&apos;s sourcing policy explicitly declined to produce.
            </div>
          ) : null}
        </Panel>

        <Panel title="Candidate status" icon={<Target size={18} />} color={GOLD}>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {(Object.keys(CANDIDATES) as CandidateKey[]).map((key) => {
              const candidate = CANDIDATES[key];
              return (
                <div key={key} style={{ border: `1px solid ${candidate.color}44`, borderRadius: 8, background: `${candidate.color}0F`, padding: "0.65rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 600, color: candidate.color }}>{candidate.label}</span>
                    <span style={{ fontSize: "0.78rem", fontWeight: 600, color: candidate.color }}>{candidate.status}</span>
                  </div>
                  <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.85rem" }}>{candidate.detail}</p>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="How to report the tier" icon={<ShieldCheck size={18} />} color={GREEN}>
          <div style={{ display: "grid", gap: "0.55rem", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
            <p style={{ margin: 0 }}><strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Tier:</strong> {tier.label} ({displayCount} independent threads).</p>
            <p style={{ margin: 0 }}><strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Threads:</strong> Chapter 3 tattva-śuddhi; Chapter 4 sub-lord.</p>
            <p style={{ margin: 0 }}><strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Cross-checks:</strong> Chapter 5.2 Nāḍiāṁśa (same-root); Chapter 6 D60 (separability).</p>
            <p style={{ margin: 0 }}><strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>Path to stronger:</strong> a new, precisely dated life event that independently discriminates toward B.</p>
          </div>
        </Panel>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Final client report</p>
            <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.2rem", fontWeight: 600 }}>
              The complete, professional rectification report
            </h3>
          </div>
          <button type="button" aria-pressed={showReport} onClick={() => setShowReport((value) => !value)} style={buttonStyle(showReport, GOLD)}>
            <FileText size={15} aria-hidden="true" />
            {showReport ? "Hide report" : "Show report"}
          </button>
        </div>
        {showReport ? (
          <div style={{ marginTop: "0.85rem", border: `1px solid ${GOLD}55`, borderRadius: 8, background: `${GOLD}0F`, padding: "1rem", color: INK_SECONDARY, lineHeight: 1.65, fontSize: "0.92rem" }}>
            <p style={{ margin: 0 }}>{FINAL_REPORT}</p>
            <p style={{ margin: "0.75rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>
              Final tally: 2 independent-discrimination threads, both favouring Candidate B, cross-checked twice for reliability, contradicted by nothing. Tier: moderate indication.
            </p>
          </div>
        ) : (
          <p style={{ margin: "0.65rem 0 0", color: INK_MUTED, lineHeight: 1.5 }}>
            The report names the working recommendation (06:00), its actual confidence level, the excluded alternative (06:12), the honest alternative still in play (05:48), and the specific kind of new evidence that could strengthen the finding.
          </p>
        )}
      </section>
    </div>
  );
}

function MatrixSvg({ selectedRow, onSelect }: { selectedRow: number | null; onSelect: (index: number | null) => void }) {
  return (
    <svg viewBox="0 0 560 250" role="img" aria-label="Eight-row case-file matrix from Chapters 2 through 6" style={{ width: "100%", maxHeight: 300, margin: "0.4rem auto 0.85rem", display: "block" }}>
      {ROWS.map((row, index) => {
        const y = 12 + index * 29;
        const meta = SHAPE_META[row.shape];
        const selected = selectedRow === index;
        return (
          <g key={index} style={{ cursor: "pointer" }} onClick={() => onSelect(selected ? null : index)}>
            <rect
              x="10"
              y={y}
              width="540"
              height="24"
              rx={6}
              fill={meta.color}
              fillOpacity={selected ? 0.20 : 0.08}
              stroke={selected ? meta.color : HAIRLINE}
              strokeWidth={selected ? 2 : 1}
            />
            <text x="18" y={y + 16} fill={INK_MUTED} fontSize="9.5" fontWeight="600">{row.chapter}</text>
            <text x="72" y={y + 16} fill={INK_PRIMARY} fontSize="10.5" fontWeight="600">{row.method}</text>
            <text x="210" y={y + 16} fill={meta.color} fontSize="9.5" fontWeight="600">{meta.label}</text>
            <text x="430" y={y + 16} fill={INK_SECONDARY} fontSize="9.5">{row.b === "FAVOURED" ? "B favoured" : row.c === "EXCLUDED" ? "C excluded" : row.b === "favoured" ? "B (same-root)" : "—"}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
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

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const responsiveThreeColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
