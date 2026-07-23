"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  Ban,
  BookOpen,
  CheckCircle2,
  Compass,
  RefreshCcw,
  ShieldAlert,
  Timer,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";

type Tier = "none" | "weak" | "weak-moderate" | "moderate-strong" | "strong";

interface Finding {
  id: string;
  source: string;
  label: string;
  text: string;
  framework?: "classical" | "kp" | "modern";
}

const THEME_FINDINGS: Finding[] = [
  {
    id: "structural",
    source: "Chapter 1",
    label: "9th-house structural strength",
    text: "Jupiter rules and occupies Pisces in the 9th; Mercury’s debilitation is neecha-bhaṅga-cancelled; the 12-9-3 arc’s lordship converges here.",
    framework: "classical",
  },
  {
    id: "rahu",
    source: "Chapter 2",
    label: "Rāhu’s reinforced 12th-house fit",
    text: "Rāhu occupies Gemini in the 12th, aspected only by own-sign Mars — a reinforced-fit placement for foreign-boundary themes.",
    framework: "classical",
  },
  {
    id: "modern",
    source: "Chapter 3",
    label: "Modern-compilation patterns (2 of 7 fire)",
    text: "12th lord in the 9th and Rāhu in the 12th fire cleanly; strong 4th house held as genuine texture, not a veto.",
    framework: "modern",
  },
  {
    id: "kp12",
    source: "Chapter 3",
    label: "KP 12th-cusp conditional-favourable",
    text: "12th-cusp sub-lord Mercury is a significator of 12/9/3, giving a CONDITIONAL-leaning-favourable reading.",
    framework: "kp",
  },
];

const COUNTER_NOTES: Finding[] = [
  {
    id: "kp9no",
    source: "Chapter 3",
    label: "KP 9th-cusp NO",
    text: "9th-cusp sub-lord Ketu is not a significator of 12/9/3 — a clean divergence from the classical 9th-house strength.",
  },
  {
    id: "strong4",
    source: "Chapter 3",
    label: "Strong 4th-house counter-note",
    text: "Venus is own-sign in the 4th — a strong home-base signal reported as texture, not an absolute block.",
  },
];

const TIMING_FINDINGS: Finding[] = [
  {
    id: "mercury-bhukti",
    source: "Chapter 4.1",
    label: "Venus MD → Mercury bhukti",
    text: "Age 29.38–32.21 (~2028–2031). Mercury rules the 12th and 3rd and occupies the 9th — the richest single timing indicator in the sweep.",
  },
  {
    id: "jupiter-bhukti",
    source: "Chapter 4.1",
    label: "Sun MD → Jupiter bhukti",
    text: "Age 35.43–36.23 (~2034). Jupiter is the 9th’s own kāraka for higher learning — a second, more study-focused candidate window.",
  },
];

const TIER_META: Record<
  Tier,
  { label: string; color: string; description: string }
> = {
  none: { label: "No signal", color: INK_MUTED, description: "No active evidence for this track." },
  weak: { label: "Weak", color: VERMILION, description: "One thin or indirect line of evidence." },
  "weak-moderate": {
    label: "Weak-to-Moderate",
    color: GOLD,
    description: "A real but uncorroborated indicator; watch, not predict.",
  },
  "moderate-strong": {
    label: "Moderate-to-Strong",
    color: BLUE,
    description: "Multiple independent methods converge; disclosed counter-notes remain.",
  },
  strong: {
    label: "Strong",
    color: GREEN,
    description: "Broad, clean convergence with minimal counter-evidence.",
  },
};

const DISCIPLINE_STATEMENTS = [
  {
    key: "collapse",
    label: "A Moderate-to-Strong theme-confidence also raises the timing-confidence to the same tier.",
    correction:
      "Theme and timing are different questions. Strength in one does not transfer to the other.",
  },
  {
    key: "stack",
    label: "Three agreeing frameworks triple the theme-confidence.",
    correction:
      "Cross-framework convergence is reported, not stacked. The theme tier is capped at Moderate-to-Strong here.",
  },
  {
    key: "fabricate",
    label: "If transit data is missing, a plausible transit can be invented to support the timing call.",
    correction:
      "Unavailable confirmation is never fabricated. The timing tier stays honestly lower.",
  },
] as const;

export function StudyAbroadThemeTimingSynthesis() {
  const [themeActive, setThemeActive] = useState<Record<string, boolean>>({
    structural: true,
    rahu: true,
    modern: true,
    kp12: true,
  });

  const [timingActive, setTimingActive] = useState<Record<string, boolean>>({
    "mercury-bhukti": true,
    "jupiter-bhukti": true,
  });

  const [fabricateAttempt, setFabricateAttempt] = useState(false);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    collapse: false,
    stack: false,
    fabricate: false,
  });

  function toggleTheme(id: string) {
    setThemeActive((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleTiming(id: string) {
    setTimingActive((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function attemptFabricate() {
    setFabricateAttempt(true);
    setTimeout(() => setFabricateAttempt(false), 3500);
  }

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setThemeActive({ structural: true, rahu: true, modern: true, kp12: true });
    setTimingActive({ "mercury-bhukti": true, "jupiter-bhukti": true });
    setFabricateAttempt(false);
    setMistakes({ collapse: false, stack: false, fabricate: false });
  }

  const themeVerdict = useMemo<Tier>(() => {
    const active = THEME_FINDINGS.filter((f) => themeActive[f.id]);
    const frameworks = new Set(active.map((f) => f.framework).filter(Boolean));
    if (active.length === 0) return "none";
    if (active.length === 1 && frameworks.size <= 1) return "weak-moderate";
    if (frameworks.size >= 2) return "moderate-strong";
    return "weak-moderate";
  }, [themeActive]);

  const timingVerdict = useMemo<Tier>(() => {
    const activeCount = TIMING_FINDINGS.filter((f) => timingActive[f.id]).length;
    if (activeCount === 0) return "none";
    // One or more daśā windows, but no transit corroboration; capped at weak-moderate.
    return "weak-moderate";
  }, [timingActive]);

  const liveAnswer = useMemo(() => {
    const themeMeta = TIER_META[themeVerdict];
    const timingMeta = TIER_META[timingVerdict];
    return `Is foreign study a live theme for you? The answer is ${themeMeta.label.toLowerCase()}. We have a genuinely strong 9th-house structure, a reinforced Rāhu-in-12th placement, two modern-compilation patterns that fire cleanly, and a KP 12th-cusp reading that leans favourable — three different methods landing in a similar direction. Those counter-notes (the KP 9th-cusp NO and the strong 4th house) are real and disclosed, but they do not erase the overall favourable-leaning picture.

When specifically should you pursue it? That is a softer call — ${timingMeta.label.toLowerCase()}. The period around age 29–32 stands out as the most interesting daśā window, and there is a second, more study-focused window around age 35–36. Both are real candidate windows, but without a separately computed transit corroboration I would treat them as the most promising windows to watch and plan around, not as guaranteed dates.`;
  }, [themeVerdict, timingVerdict]);

  return (
    <div
      data-interactive="study-abroad-theme-timing-synthesis"
      style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}
    >
      <section style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={eyebrowStyle}>Chart T1 — Study-abroad synthesis</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: BLUE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Theme-confidence vs. timing-confidence splitter
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Toggle the module&apos;s findings and watch the two confidence tracks stay separate. Theme and timing answer different questions.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Compass size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p style={eyebrowStyle}>The two-track frame</p>
        </div>
        <svg viewBox="0 0 640 130" style={{ width: "100%", height: "auto", marginTop: "0.75rem" }} aria-label="Two independent tracks: theme confidence asks is this a live theme, timing confidence asks is this the window">
          <rect x="80" y="20" width="220" height="80" rx="8" fill={`${BLUE}${"10"}`} stroke={BLUE} strokeWidth="1.5" />
          <text x="190" y="48" textAnchor="middle" fontSize="12" fill={INK_PRIMARY} fontWeight={600}>
            Theme confidence
          </text>
          <text x="190" y="68" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>
            Is this a live theme at all?
          </text>
          <text x="190" y="88" textAnchor="middle" fontSize="10" fill={INK_MUTED}>
            structural · pattern · KP
          </text>

          <rect x="340" y="20" width="220" height="80" rx="8" fill={`${GOLD}${"10"}`} stroke={GOLD} strokeWidth="1.5" />
          <text x="450" y="48" textAnchor="middle" fontSize="12" fill={INK_PRIMARY} fontWeight={600}>
            Timing confidence
          </text>
          <text x="450" y="68" textAnchor="middle" fontSize="10" fill={INK_SECONDARY}>
            Is this the specific window?
          </text>
          <text x="450" y="88" textAnchor="middle" fontSize="10" fill={INK_MUTED}>
            daśā · transit (unavailable)
          </text>

          <line x1="300" y1="60" x2="340" y2="60" stroke={HAIRLINE} strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="320" y="55" textAnchor="middle" fontSize="9" fill={INK_MUTED}>
            separate
          </text>
        </svg>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <BookOpen size={18} style={{ color: BLUE }} aria-hidden="true" />
            <p style={eyebrowStyle}>Theme-level evidence</p>
          </div>
          <p
            style={{
              margin: "0.4rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.55,
            }}
          >
            Toggle methods. Cross-framework convergence is reported, not stacked.
          </p>
          {THEME_FINDINGS.map((f) => {
            const active = themeActive[f.id];
            return (
              <div
                key={f.id}
                style={{
                  marginTop: "0.65rem",
                  border: `1px solid ${active ? BLUE : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${BLUE}${"08"}` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    cursor: "pointer",
                    color: INK_PRIMARY,
                    fontWeight: 600,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleTheme(f.id)}
                  />
                  <span>
                    {f.label}{" "}
                    <span style={{ color: INK_MUTED, fontWeight: 400 }}>({f.source})</span>
                  </span>
                </label>
                {active ? (
                  <p
                    style={{
                      margin: "0.45rem 0 0",
                      color: INK_SECONDARY,
                      fontSize: "0.85rem",
                      lineHeight: 1.55,
                    }}
                  >
                    {f.text}
                  </p>
                ) : null}
              </div>
            );
          })}

          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px dashed ${VERMILION}`,
              background: `${VERMILION}${"06"}`,
            }}
          >
            <p style={{ ...eyebrowStyle, color: VERMILION }}>Disclosed counter-notes</p>
            <ul
              style={{
                margin: "0.45rem 0 0",
                paddingLeft: "1.2rem",
                color: INK_SECONDARY,
                fontSize: "0.85rem",
                lineHeight: 1.55,
              }}
            >
              {COUNTER_NOTES.map((n) => (
                <li key={n.id} style={{ margin: "0.3rem 0" }}>
                  <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{n.label}:</strong>{" "}
                  {n.text}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div style={{ display: "grid", gap: "1rem" }}>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Timer size={18} style={{ color: GOLD }} aria-hidden="true" />
              <p style={eyebrowStyle}>Timing-level evidence</p>
            </div>
            <p
              style={{
                margin: "0.4rem 0 0",
                color: INK_SECONDARY,
                fontSize: "0.88rem",
                lineHeight: 1.55,
              }}
            >
              Toggle candidate daśā windows. Transit confirmation is unavailable.
            </p>
            {TIMING_FINDINGS.map((f) => {
              const active = timingActive[f.id];
              return (
                <div
                  key={f.id}
                  style={{
                    marginTop: "0.65rem",
                    border: `1px solid ${active ? GOLD : HAIRLINE}`,
                    borderRadius: 8,
                    background: active ? `${GOLD}${"08"}` : "transparent",
                    padding: "0.75rem",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "start",
                      gap: "0.55rem",
                      cursor: "pointer",
                      color: INK_PRIMARY,
                      fontWeight: 600,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleTiming(f.id)}
                    />
                    <span>
                      {f.label}{" "}
                      <span style={{ color: INK_MUTED, fontWeight: 400 }}>({f.source})</span>
                    </span>
                  </label>
                  {active ? (
                    <p
                      style={{
                        margin: "0.45rem 0 0",
                        color: INK_SECONDARY,
                        fontSize: "0.85rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {f.text}
                    </p>
                  ) : null}
                </div>
              );
            })}

            <button
              type="button"
              onClick={attemptFabricate}
              style={{
                ...buttonStyle(false, VERMILION),
                marginTop: "0.75rem",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Ban size={15} aria-hidden="true" />
              Attempt to add fabricated transit confirmation
            </button>
            {fabricateAttempt ? (
              <p
                style={{
                  margin: "0.65rem 0 0",
                  color: VERMILION,
                  fontSize: "0.86rem",
                  lineHeight: 1.5,
                }}
              >
                <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                Refused: unavailable confirmation is not fabricated. Timing-confidence stays capped at Weak-to-Moderate.
              </p>
            ) : null}
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Confidence meters</p>
            <ConfidenceMeter label="Theme confidence" tier={themeVerdict} cap="moderate-strong" />
            <ConfidenceMeter label="Timing confidence" tier={timingVerdict} cap="weak-moderate" />
            {themeVerdict === "moderate-strong" &&
            new Set(THEME_FINDINGS.filter((f) => themeActive[f.id]).map((f) => f.framework)).size >= 3 ? (
              <p
                style={{
                  margin: "0.65rem 0 0",
                  color: BLUE,
                  fontSize: "0.86rem",
                  lineHeight: 1.5,
                }}
              >
                <CheckCircle2 size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                Three frameworks agree, but the meter is capped at Moderate-to-Strong — corroboration is reported, not stacked.
              </p>
            ) : null}
          </section>
        </div>
      </div>

      <section
        style={{
          ...cardStyle,
          borderColor: `${BLUE}${"66"}`,
          background: `${BLUE}${"06"}`,
        }}
      >
        <p style={eyebrowStyle}>Live client-facing answer</p>
        <div
          style={{
            marginTop: "0.55rem",
            padding: "1rem",
            borderRadius: 8,
            background: SURFACE,
            border: `1px solid ${HAIRLINE}`,
            color: INK_SECONDARY,
            fontSize: "0.92rem",
            lineHeight: 1.65,
            whiteSpace: "pre-line",
          }}
        >
          {liveAnswer}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            fontSize: "0.88rem",
            lineHeight: 1.5,
          }}
        >
          Mark each false statement to reveal the correction.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {DISCIPLINE_STATEMENTS.map((s) => {
            const active = mistakes[s.key];
            return (
              <div
                key={s.key}
                style={{
                  border: `1px solid ${active ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${VERMILION}${"0A"}` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    color: INK_SECONDARY,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleMistake(s.key)}
                  />
                  <span>{s.label}</span>
                </label>
                {active ? (
                  <p
                    style={{
                      margin: "0.55rem 0 0",
                      color: VERMILION,
                      fontSize: "0.86rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
                    {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function ConfidenceMeter({
  label,
  tier,
  cap,
}: {
  label: string;
  tier: Tier;
  cap: Tier;
}) {
  const meta = TIER_META[tier];
  const capMeta = TIER_META[cap];
  const order: Tier[] = ["none", "weak", "weak-moderate", "moderate-strong", "strong"];
  const index = order.indexOf(tier);
  const segments = order.length - 1;

  return (
    <div style={{ marginTop: "0.75rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.35rem",
        }}
      >
        <span style={{ color: INK_PRIMARY, fontWeight: 600, fontSize: "0.88rem" }}>{label}</span>
        <span
          style={{
            color: meta.color,
            fontWeight: 600,
            fontSize: "0.88rem",
          }}
        >
          {meta.label}
        </span>
      </div>
      <div style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
        {Array.from({ length: segments }).map((_, i) => {
          const filled = i <= index - 1;
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                background: filled ? meta.color : `${INK_MUTED}${"25"}`,
              }}
            />
          );
        })}
      </div>
      <p
        style={{
          margin: "0.4rem 0 0",
          color: INK_SECONDARY,
          fontSize: "0.82rem",
          lineHeight: 1.5,
        }}
      >
        {meta.description} Cap: {capMeta.label}.
      </p>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
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
