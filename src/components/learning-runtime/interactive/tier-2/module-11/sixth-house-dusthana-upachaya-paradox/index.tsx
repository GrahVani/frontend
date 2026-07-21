"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  GraduationCap,
  RefreshCcw,
  Scale,
  ShieldAlert,
  Swords,
  XCircle,
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
const PURPLE = "#6B5AA8";

type Face = "dusthana" | "upachaya" | "both";
type CaseKey = "mars" | "saturn";
type FactorKey = "malefic" | "own-sign" | "lordship";

const FACTORS: Record<
  FactorKey,
  {
    label: string;
    mars: boolean;
    saturn: boolean;
    marsText: string;
    saturnText: string;
  }
> = {
  malefic: {
    label: "Upachaya-malefic rule",
    mars: true,
    saturn: true,
    marsText:
      "Mars is a natural malefic in an upachaya house, so its pressure converts into fighting capacity.",
    saturnText:
      "Saturn is a natural malefic in an upachaya house, so its pressure converts into durable, patient capacity.",
  },
  "own-sign": {
    label: "Own-sign dignity",
    mars: false,
    saturn: true,
    marsText: "Not applicable to the T1 Mars-in-6th worked example.",
    saturnText:
      "Saturn occupies Aquarius, its own sign, so the pressure is exercised from a position of genuine classical strength.",
  },
  lordship: {
    label: "6th lordship",
    mars: false,
    saturn: true,
    marsText: "Not applicable to the T1 Mars-in-6th worked example.",
    saturnText:
      "Saturn rules the 6th house it occupies, unifying the house’s governing intelligence with its principal occupant.",
  },
};

const DISCIPLINE_STATEMENTS = [
  {
    key: "every-dusthana",
    label: "The upachaya rule applies to every dusthāna equally.",
    correction:
      "Only the 6th house is both dusthāna and upachaya. The 8th and 12th are dusthānas but not upachayas, so they do not carry this time-improves-it mechanism.",
  },
  {
    key: "guarantee",
    label: "Chart L1’s strong Saturn-in-6th guarantees the native will win any dispute.",
    correction:
      "Structural capacity is not a guaranteed outcome. Effort, timing, evidence, counsel, and procedure still matter.",
  },
  {
    key: "two-yes",
    label: "The three converging structural factors in Chart L1 are the same as a two-yes daśā-reliability finding.",
    correction:
      "This is a structural-capacity reading. The two-yes framework answers a different daśā-timing question, addressed separately in Chapters 2 and 4.",
  },
] as const;

const SCENARIO_OPTIONS = [
  {
    label: "Yes — the early loss means the case is lost.",
    verdict: "absolutist-despair",
    feedback:
      "This is premature despair. The 6th house’s upachaya nature means an early setback does not, by itself, decide the final outcome.",
  },
  {
    label: "No — Saturn in the 6th guarantees you will win.",
    verdict: "absolutist-victory",
    feedback:
      "This is premature guaranteed-victory. Structural capacity is genuine, but it is not a guarantee; effort, timing, and real-world factors still matter.",
  },
  {
    label:
      "An early loss is not a final verdict; the 6th can improve with sustained effort, but that is capacity, not a guarantee.",
    verdict: "disciplined",
    feedback:
      "Correct. The upachaya doctrine lets you acknowledge the setback honestly while also explaining the structural reason the matter may still shift with persistent, disciplined effort.",
  },
];

export function SixthHouseDusthanaUpachayaParadox() {
  const [face, setFace] = useState<Face>("both");
  const [selectedCase, setSelectedCase] = useState<CaseKey>("saturn");
  const [selectedFactor, setSelectedFactor] = useState<FactorKey | null>(null);
  const [scenarioChoice, setScenarioChoice] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "every-dusthana": false,
    guarantee: false,
    "two-yes": false,
  });

  const activeFactor = selectedFactor ?? "malefic";
  const factorData = FACTORS[activeFactor];

  const synthesis = useMemo(() => {
    const base =
      "The 6th house is the only house that is both dusthāna (difficult) and upachaya (growing with effort).";
    const caseLine =
      selectedCase === "mars"
        ? "Mars-in-6th (T1’s example) builds strength through decisive confrontation."
        : "Chart L1’s Saturn-in-6th (own sign, as lord) builds strength through sustained, disciplined persistence.";
    const limit =
      "This is structural capacity, not a guarantee — and not a daśā-timing two-yes finding.";
    return `${base} ${caseLine} ${limit}`;
  }, [selectedCase]);

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setFace("both");
    setSelectedCase("saturn");
    setSelectedFactor(null);
    setScenarioChoice(null);
    setMistakes({ "every-dusthana": false, guarantee: false, "two-yes": false });
  }

  return (
    <div
      data-interactive="sixth-house-dusthana-upachaya-paradox"
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
            <p style={eyebrowStyle}>Chart L1 — 6th house paradox</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: VERMILION,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Dusthāna AND Upachaya: the improving-with-effort paradox
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 920,
              }}
            >
              Explore why the 6th house&apos;s dual nature means an early litigation setback is not,
              by itself, evidence that the final outcome is already decided.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>The 6th house&apos;s dual classification</p>
          <ParadoxWheel face={face} />
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "0.65rem",
            }}
          >
            <button
              type="button"
              aria-pressed={face === "dusthana"}
              onClick={() => setFace("dusthana")}
              style={buttonStyle(face === "dusthana", VERMILION)}
            >
              <XCircle size={15} aria-hidden="true" />
              Dusthāna
            </button>
            <button
              type="button"
              aria-pressed={face === "upachaya"}
              onClick={() => setFace("upachaya")}
              style={buttonStyle(face === "upachaya", GREEN)}
            >
              <CheckCircle2 size={15} aria-hidden="true" />
              Upachaya
            </button>
            <button
              type="button"
              aria-pressed={face === "both"}
              onClick={() => setFace("both")}
              style={buttonStyle(face === "both", BLUE)}
            >
              <Scale size={15} aria-hidden="true" />
              Both together
            </button>
          </div>
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${face === "dusthana" ? VERMILION : face === "upachaya" ? GREEN : BLUE}`,
              background:
                face === "dusthana"
                  ? `${VERMILION}${"0A"}`
                  : face === "upachaya"
                    ? `${GREEN}${"0A"}`
                    : `${BLUE}${"0A"}`,
            }}
          >
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              {face === "dusthana" &&
                "The 6th is a dusthāna: it brings enemies, debts, disease, and the stress of contests. An early loss is real and must not be dismissed."}
              {face === "upachaya" &&
                "The 6th is an upachaya: malefics here convert pressure into drive, effort, and durability. A difficult opening can strengthen over time."}
              {face === "both" &&
                "The 6th is the only house that carries both labels at once. That is why an early setback in litigation is not, by the house’s own nature, a final verdict — but also not a promise of effortless victory."}
            </p>
          </div>
          <p
            style={{
              margin: "0.65rem 0 0",
              color: INK_MUTED,
              fontSize: "0.82rem",
              lineHeight: 1.5,
            }}
          >
            Compare: the 8th and 12th are dusthānas but not upachayas — they do not share this
            time-improves-it mechanism.
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Worked example comparison</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.88rem",
              lineHeight: 1.55,
            }}
          >
            Toggle the case and click each structural factor to see how the same doctrine reads
            differently for Mars (T1 example) and Saturn (Chart L1).
          </p>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "0.65rem",
            }}
          >
            <button
              type="button"
              aria-pressed={selectedCase === "mars"}
              onClick={() => setSelectedCase("mars")}
              style={buttonStyle(selectedCase === "mars", VERMILION)}
            >
              <Swords size={15} aria-hidden="true" />
              T1 Mars-in-6th
            </button>
            <button
              type="button"
              aria-pressed={selectedCase === "saturn"}
              onClick={() => setSelectedCase("saturn")}
              style={buttonStyle(selectedCase === "saturn", PURPLE)}
            >
              <Clock size={15} aria-hidden="true" />
              Chart L1 Saturn-in-6th
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gap: "0.55rem",
              marginTop: "0.85rem",
            }}
          >
            {(Object.keys(FACTORS) as FactorKey[]).map((key) => {
              const factor = FACTORS[key];
              const applies = selectedCase === "mars" ? factor.mars : factor.saturn;
              const active = activeFactor === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedFactor(key)}
                  style={{
                    ...togglePanelStyle(active, applies ? GREEN : VERMILION),
                    textAlign: "left",
                    opacity: applies ? 1 : 0.85,
                  }}
                >
                  <span>{applies ? <CheckCircle2 size={18} /> : <XCircle size={18} />}</span>
                  <span>
                    <strong style={{ fontWeight: 600, display: "block" }}>{factor.label}</strong>
                    <span style={{ fontSize: "0.84rem", opacity: 0.9 }}>
                      {applies ? "Applies here" : "Does not apply here"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "0.85rem",
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${selectedCase === "mars" ? VERMILION : PURPLE}`,
              background:
                selectedCase === "mars" ? `${VERMILION}${"08"}` : `${PURPLE}${"08"}`,
            }}
          >
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              <strong style={{ fontWeight: 600, color: selectedCase === "mars" ? VERMILION : PURPLE }}>
                {selectedCase === "mars" ? "Mars signature: " : "Saturn signature: "}
              </strong>
              {selectedCase === "mars"
                ? factorData.marsText
                : factorData.saturnText}
            </p>
          </div>
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Client scenario — early loss</p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            A client has just lost a preliminary motion. Their 6th-house malefic is in reasonable
            dignity. They ask: “Does this mean I am going to lose the whole case?”
          </p>
          <div
            style={{
              display: "grid",
              gap: "0.6rem",
              marginTop: "0.75rem",
            }}
          >
            {SCENARIO_OPTIONS.map((option, index) => {
              const chosen = scenarioChoice === index;
              const feedback = chosen ? option.verdict : null;
              const color = feedback === "disciplined" ? GREEN : feedback ? VERMILION : INK_SECONDARY;
              return (
                <div key={index}>
                  <button
                    type="button"
                    aria-pressed={chosen}
                    onClick={() => setScenarioChoice(index)}
                    style={{
                      display: "flex",
                      alignItems: "start",
                      gap: "0.55rem",
                      width: "100%",
                      textAlign: "left",
                      border: `1px solid ${chosen ? color : HAIRLINE}`,
                      borderRadius: 8,
                      background: chosen ? `${color}${"0A"}` : "transparent",
                      color: chosen ? color : INK_SECONDARY,
                      padding: "0.75rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ marginTop: 2 }}>
                      {chosen ? (
                        feedback === "disciplined" ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <AlertTriangle size={16} />
                        )
                      ) : (
                        <span
                          style={{
                            display: "inline-block",
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: `1px solid ${HAIRLINE}`,
                          }}
                        />
                      )}
                    </span>
                    {option.label}
                  </button>
                  {chosen ? (
                    <p
                      style={{
                        margin: "0.45rem 0 0",
                        paddingLeft: "1.4rem",
                        color,
                        fontSize: "0.86rem",
                        lineHeight: 1.55,
                      }}
                    >
                      {option.feedback}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: PURPLE }}>
            <GraduationCap size={18} aria-hidden="true" />
            <p style={eyebrowStyle}>Composed paraphrase</p>
          </div>
          <p
            style={{
              margin: "0.55rem 0 0",
              color: INK_PRIMARY,
              fontSize: "1.05rem",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            śanaiḥ śanaiḥ śaniḥ svasthāne vṛddhiṃ karoti yatnataḥ.
          </p>
          <p
            style={{
              margin: "0.45rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            “Slowly, slowly — Saturn, in its own place, produces growth through effort.”
          </p>
          <p
            style={{
              margin: "0.75rem 0 0",
              color: INK_MUTED,
              fontSize: "0.82rem",
              lineHeight: 1.5,
            }}
          >
            This composed pedagogical line ties Saturn&apos;s own gradual nature to the upachaya rule:
            growth comes krameṇa — gradually — through sustained effort.
          </p>
        </section>
      </div>

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

      <section
        style={{
          ...cardStyle,
          borderColor: `${GREEN}66`,
          background: `${GREEN}${"0A"}`,
        }}
      >
        <p style={eyebrowStyle}>Live synthesis</p>
        <h3
          style={{
            margin: "0.15rem 0 0",
            color: GREEN,
            fontSize: "1.15rem",
            fontWeight: 600,
          }}
        >
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" />{" "}
          {selectedCase === "mars" ? "Mars-in-6th reading" : "Chart L1 Saturn-in-6th reading"}
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {synthesis}
        </p>
      </section>
    </div>
  );
}

function ParadoxWheel({ face }: { face: Face }) {
  const cx = 150;
  const cy = 150;
  const r = 95;
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const showDusthana = face === "dusthana" || face === "both";
  const showUpachaya = face === "upachaya" || face === "both";

  return (
    <svg
      viewBox="0 0 720 340"
      role="img"
      aria-label="Twelve-house wheel with the 6th house highlighted as both dusthana and upachaya"
      style={{ width: "100%", minHeight: 340, display: "block", marginTop: "0.55rem" }}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={2} />
      {houses.map((house) => {
        const angle = ((house - 1) / 12) * 2 * Math.PI - Math.PI / 2;
        const x1 = cx + (r - 18) * Math.cos(angle);
        const y1 = cy + (r - 18) * Math.sin(angle);
        const x2 = cx + r * Math.cos(angle);
        const y2 = cy + r * Math.sin(angle);
        const isSixth = house === 6;
        return (
          <g key={house}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isSixth ? VERMILION : HAIRLINE} strokeWidth={isSixth ? 3 : 1.5} />
            <circle
              cx={cx + (r - 34) * Math.cos(angle)}
              cy={cy + (r - 34) * Math.sin(angle)}
              r={isSixth ? 16 : 10}
              fill={isSixth ? `${VERMILION}${"18"}` : SURFACE}
              stroke={isSixth ? VERMILION : HAIRLINE}
              strokeWidth={isSixth ? 2 : 1}
            />
            <text
              x={cx + (r - 34) * Math.cos(angle)}
              y={cy + (r - 34) * Math.sin(angle)}
              textAnchor="middle"
              dominantBaseline="central"
              fill={isSixth ? VERMILION : INK_SECONDARY}
              fontSize={isSixth ? 13 : 10}
              fontWeight={600}
            >
              {house}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={38} fill={SURFACE} stroke={HAIRLINE} strokeWidth={1.5} />
      <text x={cx} y={cy - 6} textAnchor="middle" fill={INK_PRIMARY} fontSize={14} fontWeight={600}>
        6th house
      </text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill={INK_MUTED} fontSize={10} fontWeight={600}>
        Aquarius
      </text>

      {(face === "dusthana" || face === "both") && (
        <path
          d={`M ${cx - 60} ${cy + 20} A 70 70 0 0 1 ${cx + 60} ${cy + 20}`}
          fill="none"
          stroke={VERMILION}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.85}
        />
      )}
      {(face === "upachaya" || face === "both") && (
        <path
          d={`M ${cx - 60} ${cy + 32} A 82 82 0 0 0 ${cx + 60} ${cy + 32}`}
          fill="none"
          stroke={GREEN}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.85}
        />
      )}

      {(face === "dusthana" || face === "both") && (
        <g transform={`translate(${cx - 88}, ${cy + 42})`}>
          <rect x={0} y={0} width={76} height={24} rx={6} fill={`${VERMILION}${"15"}`} stroke={VERMILION} />
          <text x={38} y={16} textAnchor="middle" fill={VERMILION} fontSize={10} fontWeight={600}>
            dusthāna
          </text>
        </g>
      )}
      {(face === "upachaya" || face === "both") && (
        <g transform={`translate(${cx + 12}, ${cy + 50})`}>
          <rect x={0} y={0} width={76} height={24} rx={6} fill={`${GREEN}${"15"}`} stroke={GREEN} />
          <text x={38} y={16} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>
            upachaya
          </text>
        </g>
      )}

      <rect x="0" y="0" width="720" height="340" fill={SURFACE} />
      <rect x="18" y="18" width="684" height="304" rx="12" fill={`${GOLD}${"06"}`} stroke={HAIRLINE} />

      <rect
        x="250"
        y="86"
        width="220"
        height="140"
        rx="18"
        fill={SURFACE}
        stroke={face === "both" ? BLUE : face === "dusthana" ? VERMILION : GREEN}
        strokeWidth="3"
      />
      <circle cx="360" cy="118" r="24" fill={`${BLUE}${"12"}`} stroke={BLUE} strokeWidth="2" />
      <text x="360" y="126" textAnchor="middle" fill={BLUE} fontSize="24" fontWeight={700}>
        6
      </text>
      <text x="360" y="164" textAnchor="middle" fill={INK_PRIMARY} fontSize="22" fontWeight={700}>
        6th house
      </text>
      <text x="360" y="194" textAnchor="middle" fill={INK_SECONDARY} fontSize="17" fontWeight={600}>
        Aquarius
      </text>

      <line x1="250" y1="156" x2="188" y2="156" stroke={showDusthana ? VERMILION : HAIRLINE} strokeWidth="3" strokeLinecap="round" />
      <rect
        x="42"
        y="96"
        width="150"
        height="120"
        rx="12"
        fill={showDusthana ? `${VERMILION}${"10"}` : SURFACE}
        stroke={showDusthana ? VERMILION : HAIRLINE}
        strokeWidth="2"
        opacity={showDusthana ? 1 : 0.55}
      />
      <text x="117" y="132" textAnchor="middle" fill={showDusthana ? VERMILION : INK_MUTED} fontSize="18" fontWeight={700}>
        Dusthana
      </text>
      <text x="117" y="160" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight={600}>
        pressure
      </text>
      <text x="117" y="184" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight={600}>
        conflict
      </text>

      <line x1="470" y1="156" x2="532" y2="156" stroke={showUpachaya ? GREEN : HAIRLINE} strokeWidth="3" strokeLinecap="round" />
      <rect
        x="528"
        y="96"
        width="150"
        height="120"
        rx="12"
        fill={showUpachaya ? `${GREEN}${"10"}` : SURFACE}
        stroke={showUpachaya ? GREEN : HAIRLINE}
        strokeWidth="2"
        opacity={showUpachaya ? 1 : 0.55}
      />
      <text x="603" y="132" textAnchor="middle" fill={showUpachaya ? GREEN : INK_MUTED} fontSize="18" fontWeight={700}>
        Upachaya
      </text>
      <text x="603" y="160" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight={600}>
        improves
      </text>
      <text x="603" y="184" textAnchor="middle" fill={INK_SECONDARY} fontSize="14" fontWeight={600}>
        with effort
      </text>

      <text x="360" y="270" textAnchor="middle" fill={face === "both" ? BLUE : INK_MUTED} fontSize="16" fontWeight={700}>
        {face === "both"
          ? "Read both labels together: difficulty can become capacity."
          : face === "dusthana"
            ? "This view highlights the problem-pressure side."
            : "This view highlights growth through sustained effort."}
      </text>
    </svg>
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
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"0F"}` : "transparent",
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
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
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
