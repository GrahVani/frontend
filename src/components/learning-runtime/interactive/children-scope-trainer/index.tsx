"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  GraduationCap,
  HeartPulse,
  RotateCcw,
  Scale,
  ShieldCheck,
  Stethoscope,
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

type TabKey = "domains" | "test" | "map" | "throughline";
type DomainKey =
  | "fertility"
  | "genetics"
  | "obstetrics"
  | "paediatrics"
  | "mental"
  | "law";

const DOMAINS: {
  key: DomainKey;
  label: string;
  covers: string;
  referral: string;
  icon: React.ReactNode;
  color: string;
}[] = [
  {
    key: "fertility",
    label: "Fertility medicine",
    covers: "Diagnosing why conception hasn't occurred; IVF, IUI, hormonal evaluation",
    referral: "A fertility specialist / reproductive endocrinologist",
    icon: <Stethoscope size={18} />,
    color: BLUE,
  },
  {
    key: "genetics",
    label: "Genetics",
    covers: "Hereditary condition risk, carrier screening, inheritance-pattern analysis",
    referral: "A genetic counsellor",
    icon: <GraduationCap size={18} />,
    color: PURPLE,
  },
  {
    key: "obstetrics",
    label: "Obstetric care",
    covers: "Monitoring an existing pregnancy, prenatal health, delivery planning",
    referral: "An obstetrician / gynaecologist",
    icon: <HeartPulse size={18} />,
    color: VERMILION,
  },
  {
    key: "paediatrics",
    label: "Paediatrics",
    covers: "A living child's health, development, or medical symptoms",
    referral: "A paediatrician",
    icon: <ShieldCheck size={18} />,
    color: GREEN,
  },
  {
    key: "mental",
    label: "Mental health",
    covers: "Grief, anxiety, relationship strain connected to fertility or loss",
    referral: "A mental-health professional, grief counsellor, or perinatal specialist",
    icon: <Scale size={18} />,
    color: GOLD,
  },
  {
    key: "law",
    label: "Law",
    covers: "Gender-prediction legality; adoption and surrogacy legal frameworks",
    referral: "A qualified lawyer versed in the relevant area",
    icon: <Globe size={18} />,
    color: "#6B5AA8",
  },
];

const TEST_CASES = [
  {
    id: "t1",
    text: "My family has a history of a genetic condition. Can the chart tell whether my children will inherit it?",
    answer: "genetics",
    explain: "Inheritance of a hereditary condition is a genetics question, not an astrological one.",
  },
  {
    id: "t2",
    text: "We've been trying for two years. Should we start IVF this year?",
    answer: "fertility",
    explain: "Whether to begin IVF or any medical treatment is a fertility-medicine decision.",
  },
  {
    id: "t3",
    text: "What does the chart show about saṁtāna promise and general timing?",
    answer: "astrology",
    explain: "Tendencies, indications, and timing are within astrology's scope.",
  },
  {
    id: "t4",
    text: "My child has had a fever for five days. Can the chart say what's wrong?",
    answer: "paediatrics",
    explain: "A living child's medical symptoms belong to a paediatrician.",
  },
  {
    id: "t5",
    text: "We're considering surrogacy. What does the chart say about whether it will succeed?",
    answer: "law",
    explain: "Surrogacy involves legal frameworks; the practical questions go to a lawyer, and the chart cannot determine outcome.",
  },
  {
    id: "t6",
    text: "I can't sleep and feel overwhelmed most days since the loss. Can the chart help?",
    answer: "mental",
    explain: "Persistent mental-health symptoms call for a mental-health professional.",
  },
];

const THROUGHLINE = [
  {
    id: "th1",
    label: "Non-fatalism",
    body: "No verdict forecloses biological possibility.",
  },
  {
    id: "th2",
    label: "No count, no gender",
    body: "Categorical refusal, at any confidence level.",
  },
  {
    id: "th3",
    label: "Timing as trend",
    body: "Daśā and KP windows are never deadlines or guarantees.",
  },
  {
    id: "th4",
    label: "Mandatory routing by disclosure",
    body: "Medical routing is triggered by what the client says, not by the chart.",
  },
  {
    id: "th5",
    label: "Trauma-aware presence",
    body: "A distressed client's wellbeing outranks completing the reading.",
  },
  {
    id: "th6",
    label: "No karma-blame",
    body: "Never assign fault for pregnancy loss or any other outcome.",
  },
  {
    id: "th7",
    label: "Named scope referrals",
    body: "Name the specific professional whose domain the question has entered.",
  },
];

export function ChildrenScopeTrainer() {
  const [tab, setTab] = useState<TabKey>("domains");
  const [testCalls, setTestCalls] = useState<Record<string, DomainKey | "astrology" | null>>({});
  const [showTestFeedback, setShowTestFeedback] = useState(false);
  const [activeDomain, setActiveDomain] = useState<DomainKey | null>(null);
  const [throughlineDone, setThroughlineDone] = useState<Record<string, boolean>>({});

  const testCorrect = useMemo(() => {
    return TEST_CASES.every((c) => testCalls[c.id] === c.answer);
  }, [testCalls]);

  const throughlineComplete = useMemo(() => {
    return THROUGHLINE.every((t) => throughlineDone[t.id]);
  }, [throughlineDone]);

  function setTestCall(id: string, call: DomainKey | "astrology") {
    setTestCalls((prev) => ({ ...prev, [id]: call }));
    setShowTestFeedback(false);
  }

  function toggleThroughline(id: string) {
    setThroughlineDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function resetAll() {
    setTab("domains");
    setTestCalls({});
    setShowTestFeedback(false);
    setActiveDomain(null);
    setThroughlineDone({});
  }

  return (
    <div
      data-interactive="children-scope-trainer"
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
            <p style={eyebrowStyle}>Scope of competence — children questions</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: BLUE,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              Knowing where the chart&apos;s authority ends
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              Astrology reads tendencies, indications, and timing. When a question requires diagnosing, treating, or legally determining, it belongs to a named professional.
            </p>
          </div>
          <button type="button" onClick={resetAll} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Trainer sections</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "0.55rem",
            marginTop: "0.65rem",
          }}
        >
          {[
            { key: "domains", label: "Domain table", icon: <Stethoscope size={16} /> },
            { key: "test", label: "Decision test", icon: <Scale size={16} /> },
            { key: "map", label: "Scope map", icon: <Globe size={16} /> },
            { key: "throughline", label: "Throughline", icon: <CheckCircle2 size={16} /> },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={tab === t.key}
              onClick={() => setTab(t.key as TabKey)}
              style={tabButtonStyle(tab === t.key, BLUE)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {tab === "domains" ? (
        <DomainsTab />
      ) : tab === "test" ? (
        <TestTab
          calls={testCalls}
          setCall={setTestCall}
          showFeedback={showTestFeedback}
          setShowFeedback={() => setShowTestFeedback(true)}
          allCorrect={testCorrect}
        />
      ) : tab === "map" ? (
        <MapTab
          activeDomain={activeDomain}
          setActiveDomain={setActiveDomain}
        />
      ) : (
        <ThroughlineTab
          done={throughlineDone}
          toggle={toggleThroughline}
          complete={throughlineComplete}
        />
      )}
    </div>
  );
}

function DomainsTab() {
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Exceeding domains and correct referrals</p>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.55,
        }}
      >
        No chart substitutes for these professionals. The referral must be named specifically, not vaguely.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: "0.65rem",
          marginTop: "0.75rem",
        }}
      >
        {DOMAINS.map((d) => (
          <div
            key={d.key}
            style={{
              border: `1px solid ${d.color}${"44"}`,
              borderRadius: 8,
              background: `${d.color}${"0A"}`,
              padding: "0.85rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: d.color,
                fontWeight: 600,
              }}
            >
              {d.icon}
              {d.label}
            </div>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                fontSize: "0.9rem",
                lineHeight: 1.45,
              }}
            >
              <span style={{ color: INK_MUTED }}>Covers:</span> {d.covers}
            </p>
            <p
              style={{
                margin: "0.35rem 0 0",
                color: INK_PRIMARY,
                fontSize: "0.9rem",
                lineHeight: 1.45,
              }}
            >
              <span style={{ color: d.color }}>Refer to:</span> {d.referral}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestTab({
  calls,
  setCall,
  showFeedback,
  setShowFeedback,
  allCorrect,
}: {
  calls: Record<string, DomainKey | "astrology" | null>;
  setCall: (id: string, call: DomainKey | "astrology") => void;
  showFeedback: boolean;
  setShowFeedback: () => void;
  allCorrect: boolean;
}) {
  const options: { key: DomainKey | "astrology"; label: string; color: string }[] = [
    { key: "astrology", label: "Answer astrologically", color: GREEN },
    { key: "fertility", label: "Fertility specialist", color: BLUE },
    { key: "genetics", label: "Genetic counsellor", color: PURPLE },
    { key: "obstetrics", label: "Obstetrician", color: VERMILION },
    { key: "paediatrics", label: "Paediatrician", color: GREEN },
    { key: "mental", label: "Mental-health professional", color: GOLD },
    { key: "law", label: "Lawyer", color: "#6B5AA8" },
  ];

  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Decision test</p>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.55,
        }}
      >
        For each question, decide whether it can be answered astrologically or belongs to a specific professional domain.
      </p>
      <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
        {TEST_CASES.map((c) => {
          const call = calls[c.id];
          return (
            <div
              key={c.id}
              style={{
                border: `1px solid ${HAIRLINE}`,
                borderRadius: 8,
                padding: "0.85rem",
              }}
            >
              <p
                style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.5 }}
                dangerouslySetInnerHTML={{ __html: `&quot;${c.text}&quot;` }}
              />
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.45rem",
                  marginTop: "0.6rem",
                }}
              >
                {options.map((opt) => {
                  const selected = call === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setCall(c.id, opt.key)}
                      style={smallChipStyle(selected, opt.color)}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {showFeedback && call ? (
                <p
                  style={{
                    margin: "0.55rem 0 0",
                    color: call === c.answer ? GREEN : VERMILION,
                    fontSize: "0.9rem",
                    lineHeight: 1.45,
                  }}
                >
                  {call === c.answer ? "Correct. " : "Not quite. "}
                  {c.explain}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "0.85rem" }}>
        <button
          type="button"
          onClick={setShowFeedback}
          style={buttonStyle(false, GREEN)}
        >
          Check decisions
        </button>
      </div>
      {showFeedback ? <MiniFeedback allCorrect={allCorrect} /> : null}
    </section>
  );
}

function MapTab({
  activeDomain,
  setActiveDomain,
}: {
  activeDomain: DomainKey | null;
  setActiveDomain: (d: DomainKey | null) => void;
}) {
  const active = activeDomain ? DOMAINS.find((d) => d.key === activeDomain) : null;
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <section style={cardStyle}>
        <p style={eyebrowStyle}>Scope map</p>
        <p
          style={{
            margin: "0.35rem 0 0",
            color: INK_SECONDARY,
            lineHeight: 1.55,
          }}
        >
          Click any surrounding domain to see what it covers and where to refer. Astrology sits at the centre, reading tendencies and timing; it does not replace the surrounding professions.
        </p>
        <ScopeMapSvg activeDomain={activeDomain} onSelect={setActiveDomain} />
      </section>
      {active ? (
        <section
          style={{
            ...cardStyle,
            borderColor: `${active.color}${"66"}`,
            background: `${active.color}${"0A"}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: active.color,
              fontWeight: 600,
            }}
          >
            {active.icon}
            {active.label}
          </div>
          <p
            style={{
              margin: "0.45rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.5,
            }}
          >
            {active.covers}
          </p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_PRIMARY,
              fontWeight: 600,
            }}
          >
            Refer to: {active.referral}
          </p>
        </section>
      ) : null}
    </div>
  );
}

function ScopeMapSvg({
  activeDomain,
  onSelect,
}: {
  activeDomain: DomainKey | null;
  onSelect: (d: DomainKey | null) => void;
}) {
  const centre = { x: 280, y: 150 };
  const radius = 95;
  const domainNodes = DOMAINS.map((d, i) => {
    const angle = (i / DOMAINS.length) * Math.PI * 2 - Math.PI / 2;
    return {
      ...d,
      x: centre.x + radius * Math.cos(angle),
      y: centre.y + radius * Math.sin(angle),
    };
  });

  return (
    <svg
      viewBox="0 0 560 300"
      role="img"
      aria-label="Scope map: astrology at the centre surrounded by exceeding professional domains"
      style={{
        width: "100%",
        maxHeight: 360,
        margin: "0.6rem auto 0",
        display: "block",
      }}
    >
      <rect
        x="10"
        y="10"
        width="540"
        height="280"
        rx="10"
        fill={`${BLUE}${"05"}`}
        stroke={HAIRLINE}
      />
      {/* Astrology centre */}
      <circle
        cx={centre.x}
        cy={centre.y}
        r="52"
        fill={`${GREEN}${"16"}`}
        stroke={GREEN}
        strokeWidth="3"
      />
      <text
        x={centre.x}
        y={centre.y - 6}
        textAnchor="middle"
        fill={GREEN}
        fontSize="13"
        fontWeight="600"
      >
        Astrology
      </text>
      <text
        x={centre.x}
        y={centre.y + 12}
        textAnchor="middle"
        fill={INK_SECONDARY}
        fontSize="10"
        fontWeight="600"
      >
        tendencies · timing
      </text>

      {/* Domain nodes */}
      {domainNodes.map((d) => {
        const isActive = activeDomain === d.key;
        return (
          <g key={d.key} style={{ cursor: "pointer" }} onClick={() => onSelect(isActive ? null : d.key)}>
            <line
              x1={centre.x}
              y1={centre.y}
              x2={d.x}
              y2={d.y}
              stroke={isActive ? d.color : HAIRLINE}
              strokeWidth={isActive ? 3 : 1.5}
              strokeDasharray={isActive ? undefined : "4 3"}
            />
            <circle
              cx={d.x}
              cy={d.y}
              r={isActive ? 34 : 30}
              fill={`${d.color}${isActive ? "22" : "14"}`}
              stroke={d.color}
              strokeWidth={isActive ? 3 : 2}
            />
            <text
              x={d.x}
              y={d.y - 2}
              textAnchor="middle"
              fill={d.color}
              fontSize="10"
              fontWeight="600"
            >
              {d.label.split(" ")[0]}
            </text>
            <text
              x={d.x}
              y={d.y + 12}
              textAnchor="middle"
              fill={INK_SECONDARY}
              fontSize="9"
              fontWeight="600"
            >
              {d.label.split(" ").slice(1).join(" ") || ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ThroughlineTab({
  done,
  toggle,
  complete,
}: {
  done: Record<string, boolean>;
  toggle: (id: string) => void;
  complete: boolean;
}) {
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Module throughline</p>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.55,
        }}
      >
        A graduate of this module holds all seven commitments simultaneously, in every consultation. Toggle each one to affirm it.
      </p>
      <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
        {THROUGHLINE.map((t) => {
          const active = done[t.id];
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(t.id)}
              style={{
                ...toggleStyle(active, active ? GREEN : INK_MUTED),
                borderColor: active ? GREEN : HAIRLINE,
                background: active ? `${GREEN}${"0A"}` : "transparent",
              }}
            >
              <span style={{ color: active ? GREEN : INK_MUTED }}>
                {active ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
              </span>
              <span style={{ textAlign: "left" }}>
                <span style={{ display: "block", fontWeight: 600 }}>{t.label}</span>
                <span style={{ color: INK_SECONDARY, fontSize: "0.86rem" }}>
                  {t.body}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      {complete ? (
        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.85rem",
            borderRadius: 8,
            border: `1px solid ${GREEN}${"66"}`,
            background: `${GREEN}${"0A"}`,
          }}
        >
          <p
            style={{
              margin: 0,
              color: GREEN,
              fontWeight: 600,
              fontSize: "1.05rem",
            }}
          >
            All seven commitments affirmed.
          </p>
          <p
            style={{
              margin: "0.35rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            This is the closing discipline of the module: non-fatalism, no count or gender, timing as trend, disclosure-driven routing, trauma-aware presence, no karma-blame, and named scope referrals — held together, in every consultation.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function MiniFeedback({ allCorrect }: { allCorrect: boolean }) {
  return (
    <div
      style={{
        marginTop: "0.85rem",
        padding: "0.75rem",
        borderRadius: 8,
        border: `1px solid ${allCorrect ? GREEN : VERMILION}${"66"}`,
        background: `${allCorrect ? GREEN : VERMILION}${"0A"}`,
      }}
    >
      <p
        style={{
          margin: 0,
          color: allCorrect ? GREEN : VERMILION,
          fontWeight: 600,
        }}
      >
        {allCorrect
          ? "All decisions are correct."
          : "Some decisions need review."}
      </p>
    </div>
  );
}

function tabButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"12"}` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
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
    padding: "0.4rem 0.65rem",
    fontSize: "0.82rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"0A"}` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    cursor: "pointer",
    fontWeight: 400,
    width: "100%",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
