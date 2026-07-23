"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  CheckCircle2,
  MessageCircle,
  RotateCcw,
  Scale,
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

type TabKey = "facts" | "classifier" | "script";

const FACTS = [
  {
    key: "name",
    label: "Full name",
    text: "Pre-Conception and Pre-Natal Diagnostic Techniques (Prohibition of Sex Selection) Act, 1994",
  },
  {
    key: "amendment",
    label: "Amended",
    text: "2003, following the Supreme Court proceedings in CEHAT v. Union of India",
  },
  {
    key: "section6",
    label: "Section 6",
    text: "Prohibits sex-determination techniques at registered medical facilities",
  },
  {
    key: "section5",
    label: "Section 5",
    text: "Prohibits any person, by any means, from communicating the sex of a foetus",
  },
  {
    key: "penalty",
    label: "Penalties",
    text: "Up to 5 years imprisonment and ₹1 lakh fine; cognizable, non-bailable, non-compoundable",
  },
];

const REQUESTS = [
  {
    id: "r1",
    text: "Will it be a boy or a girl?",
    isGender: true,
    explain: "A direct request for foetal sex. Refuse categorically.",
  },
  {
    id: "r2",
    text: "Just between us — what does the chart suggest about gender? I won’t tell anyone.",
    isGender: true,
    explain: "Confidential framing does not remove the legal or ethical boundary.",
  },
  {
    id: "r3",
    text: "Hypothetically, what is the gender balance of children I might have someday?",
    isGender: true,
    explain: "The curriculum applies the same categorical refusal to hypothetical future-child gender.",
  },
  {
    id: "r4",
    text: "Is there a supportive window for planning a family?",
    isGender: false,
    explain: "A timing question, not a request for gender prediction.",
  },
  {
    id: "r5",
    text: "I heard Mars in the 5th means a son. Can you confirm?",
    isGender: true,
    explain: "Any confirmation of a gender rule is still a gender-prediction refusal.",
  },
  {
    id: "r6",
    text: "What does the chart show about the pregnancy going well overall?",
    isGender: false,
    explain: "A general saṁtāna question that does not ask for gender.",
  },
];

const SCRIPT_OPTIONS = [
  {
    id: "s1",
    text: "I understand the curiosity, and I’m not going to make you feel bad for asking.",
    good: true,
  },
  {
    id: "s2",
    text: "I can tell you privately if you promise not to tell anyone.",
    good: false,
    why: "Confidentiality is not a loophole; the refusal is categorical.",
  },
  {
    id: "s3",
    text: "Under Indian law, communicating a foetus’s likely sex is a serious offence regardless of who says it or how privately.",
    good: true,
  },
  {
    id: "s4",
    text: "Astrology cannot reliably determine foetal sex, so I’d be giving you a guess dressed up as a prediction.",
    good: true,
  },
  {
    id: "s5",
    text: "Hypothetical questions are different, so I can answer those.",
    good: false,
    why: "The policy is categorical; it does not depend on whether a pregnancy currently exists.",
  },
  {
    id: "s6",
    text: "I’m glad to talk with you about the chart’s genuine indications for the pregnancy going well.",
    good: true,
  },
];

const MYTHS = [
  {
    id: "m1",
    statement: "The PCPNDT Act only applies to doctors and ultrasound clinics.",
    isTrue: false,
    explain: "Section 5 is written broadly: any person, by any means, may not communicate a foetus’s sex.",
  },
  {
    id: "m2",
    statement: "A confidential, off-the-record answer is legally safe.",
    isTrue: false,
    explain: "Section 5 does not depend on who else might find out; the communication itself is prohibited.",
  },
  {
    id: "m3",
    statement: "Penalties are minor administrative fines.",
    isTrue: false,
    explain: "Violations carry up to five years imprisonment and a ₹1 lakh fine, and are non-bailable.",
  },
  {
    id: "m4",
    statement: "The refusal is only needed in jurisdictions with a PCPNDT-style law.",
    isTrue: false,
    explain: "The curriculum’s refusal is jurisdiction-independent, grounded in documented harm and accuracy limits.",
  },
];

export function PcpndtRefusalTrainer() {
  const [tab, setTab] = useState<TabKey>("facts");
  const [requestCalls, setRequestCalls] = useState<Record<string, boolean | null>>({});
  const [scriptSelection, setScriptSelection] = useState<string[]>([]);
  const [showClassifierFeedback, setShowClassifierFeedback] = useState(false);
  const [showScriptFeedback, setShowScriptFeedback] = useState(false);
  const [pledge, setPledge] = useState(false);

  const classifierCorrect = useMemo(() => {
    return REQUESTS.every((r) => requestCalls[r.id] === r.isGender);
  }, [requestCalls]);

  const scriptFeedback = useMemo(() => {
    const selectedGood = SCRIPT_OPTIONS.filter(
      (o) => o.good && scriptSelection.includes(o.id),
    );
    const missingGood = SCRIPT_OPTIONS.filter(
      (o) => o.good && !scriptSelection.includes(o.id),
    );
    const wrongSelected = SCRIPT_OPTIONS.filter(
      (o) => !o.good && scriptSelection.includes(o.id),
    );
    return { selectedGood, missingGood, wrongSelected };
  }, [scriptSelection]);

  function setRequestCall(id: string, call: boolean) {
    setRequestCalls((prev) => ({ ...prev, [id]: call }));
    setShowClassifierFeedback(false);
  }

  function toggleScript(id: string) {
    setScriptSelection((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setShowScriptFeedback(false);
  }

  function resetAll() {
    setTab("facts");
    setRequestCalls({});
    setScriptSelection([]);
    setShowClassifierFeedback(false);
    setShowScriptFeedback(false);
    setPledge(false);
  }

  return (
    <div
      data-interactive="pcpndt-refusal-trainer"
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
            <p style={eyebrowStyle}>PCPNDT Act and gender-prediction refusal</p>
            <h2
              style={{
                margin: "0.2rem 0 0",
                color: VERMILION,
                fontSize: "1.28rem",
                fontWeight: 600,
              }}
            >
              A categorical boundary, not a calculation
            </h2>
            <p
              style={{
                margin: "0.45rem 0 0",
                color: INK_SECONDARY,
                lineHeight: 1.55,
                maxWidth: 900,
              }}
            >
              This trainer does not predict gender — it practises recognising gender-prediction requests, stating the PCPNDT boundary, and building a firm, kind refusal script.
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
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "0.55rem",
            marginTop: "0.65rem",
          }}
        >
          {[
            { key: "facts", label: "Act facts", icon: <BookOpen size={16} /> },
            { key: "classifier", label: "Request classifier", icon: <Scale size={16} /> },
            { key: "script", label: "Refusal script", icon: <MessageCircle size={16} /> },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={tab === t.key}
              onClick={() => setTab(t.key as TabKey)}
              style={tabButtonStyle(tab === t.key, VERMILION)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {tab === "facts" ? (
        <FactsTab />
      ) : tab === "classifier" ? (
        <ClassifierTab
          requestCalls={requestCalls}
          setRequestCall={setRequestCall}
          showFeedback={showClassifierFeedback}
          setShowFeedback={setShowClassifierFeedback}
          allCorrect={classifierCorrect}
        />
      ) : (
        <ScriptTab
          scriptSelection={scriptSelection}
          toggleScript={toggleScript}
          showFeedback={showScriptFeedback}
          setShowFeedback={setShowScriptFeedback}
          feedback={scriptFeedback}
          pledge={pledge}
          setPledge={setPledge}
        />
      )}
    </div>
  );
}

function FactsTab() {
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>PCPNDT Act at a glance</p>
          <div style={{ display: "grid", gap: "0.6rem", marginTop: "0.65rem" }}>
            {FACTS.map((f) => (
              <div
                key={f.key}
                style={{
                  border: `1px solid ${HAIRLINE}`,
                  borderRadius: 8,
                  padding: "0.75rem",
                }}
              >
                <p style={{ margin: 0, color: BLUE, fontWeight: 600 }}>{f.label}</p>
                <p
                  style={{
                    margin: "0.35rem 0 0",
                    color: INK_SECONDARY,
                    lineHeight: 1.45,
                  }}
                >
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Why it reaches astrological practice</p>
          <BoundarySvg />
          <p
            style={{
              margin: "0.75rem 0 0",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            Section 5 is not limited to doctors. Its &quot;any person, any means&quot; language is why an astrologer communicating a foetus&apos;s sex falls within the Act&apos;s scope in India.
          </p>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Myth or fact?</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.65rem" }}>
          {MYTHS.map((m) => (
            <MythCard key={m.id} myth={m} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MythCard({
  myth,
}: {
  myth: {
    id: string;
    statement: string;
    isTrue: boolean;
    explain: string;
  };
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div
      style={{
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 8,
        padding: "0.85rem",
      }}
    >
      <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.5 }}>{myth.statement}</p>
      {!revealed ? (
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.65rem" }}>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            style={smallChipStyle(false, GREEN)}
          >
            Fact
          </button>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            style={smallChipStyle(false, VERMILION)}
          >
            Myth
          </button>
        </div>
      ) : (
        <div
          style={{
            marginTop: "0.65rem",
            padding: "0.65rem",
            borderRadius: 8,
            border: `1px solid ${myth.isTrue ? GREEN : VERMILION}${"44"}`,
            background: `${myth.isTrue ? GREEN : VERMILION}${"0A"}`,
          }}
        >
          <p
            style={{
              margin: 0,
              color: myth.isTrue ? GREEN : VERMILION,
              fontWeight: 600,
            }}
          >
            {myth.isTrue ? "Fact" : "Myth"}
          </p>
          <p
            style={{
              margin: "0.3rem 0 0",
              color: INK_SECONDARY,
              fontSize: "0.9rem",
              lineHeight: 1.45,
            }}
          >
            {myth.explain}
          </p>
        </div>
      )}
    </div>
  );
}

function ClassifierTab({
  requestCalls,
  setRequestCall,
  showFeedback,
  setShowFeedback,
  allCorrect,
}: {
  requestCalls: Record<string, boolean | null>;
  setRequestCall: (id: string, call: boolean) => void;
  showFeedback: boolean;
  setShowFeedback: (v: boolean) => void;
  allCorrect: boolean;
}) {
  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Request classifier</p>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.55,
        }}
      >
        For each client question, decide whether it is a gender-prediction request that must be refused. The same refusal applies regardless of wording.
      </p>
      <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
        {REQUESTS.map((r) => {
          const call = requestCalls[r.id];
          const answered = call !== undefined && call !== null;
          const correct = call === r.isGender;
          return (
            <div
              key={r.id}
              style={{
                border: `1px solid ${answered ? (correct ? GREEN : VERMILION) : HAIRLINE}${"44"}`,
                borderRadius: 8,
                background: answered
                  ? `${correct ? GREEN : VERMILION}${"0A"}`
                  : SURFACE,
                padding: "0.85rem",
              }}
            >
              <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.5 }}>
                &quot;{r.text}&quot;
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "0.65rem",
                }}
              >
                <button
                  type="button"
                  aria-pressed={call === true}
                  onClick={() => setRequestCall(r.id, true)}
                  style={smallChipStyle(call === true, VERMILION)}
                >
                  Refuse — gender request
                </button>
                <button
                  type="button"
                  aria-pressed={call === false}
                  onClick={() => setRequestCall(r.id, false)}
                  style={smallChipStyle(call === false, GREEN)}
                >
                  Not a gender request
                </button>
              </div>
              {showFeedback && answered ? (
                <p
                  style={{
                    margin: "0.55rem 0 0",
                    color: correct ? GREEN : VERMILION,
                    fontSize: "0.9rem",
                    lineHeight: 1.45,
                  }}
                >
                  {correct ? "Correct. " : "Not quite. "}
                  {r.explain}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "0.85rem" }}>
        <button
          type="button"
          onClick={() => setShowFeedback(true)}
          style={buttonStyle(false, GREEN)}
        >
          Check classifications
        </button>
      </div>
      {showFeedback ? (
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
              ? "All classifications are correct."
              : "Some classifications need review."}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function ScriptTab({
  scriptSelection,
  toggleScript,
  showFeedback,
  setShowFeedback,
  feedback,
  pledge,
  setPledge,
}: {
  scriptSelection: string[];
  toggleScript: (id: string) => void;
  showFeedback: boolean;
  setShowFeedback: (v: boolean) => void;
  feedback: {
    selectedGood: typeof SCRIPT_OPTIONS;
    missingGood: typeof SCRIPT_OPTIONS;
    wrongSelected: typeof SCRIPT_OPTIONS;
  };
  pledge: boolean;
  setPledge: (v: boolean) => void;
}) {
  const allGood =
    feedback.missingGood.length === 0 && feedback.wrongSelected.length === 0;

  return (
    <section style={cardStyle}>
      <p style={eyebrowStyle}>Refusal script builder</p>
      <p
        style={{
          margin: "0.35rem 0 0",
          color: INK_SECONDARY,
          lineHeight: 1.55,
        }}
      >
        Build a firm, kind refusal for a direct gender-prediction request. Include both the legal boundary and the principled reason; exclude any sentence that creates a loophole.
      </p>
      <div
        style={{
          display: "grid",
          gap: "0.55rem",
          marginTop: "0.75rem",
        }}
      >
        {SCRIPT_OPTIONS.map((o) => {
          const selected = scriptSelection.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleScript(o.id)}
              style={{
                ...sentenceButtonStyle(),
                borderColor: selected
                  ? o.good
                    ? GREEN
                    : VERMILION
                  : HAIRLINE,
                background: selected
                  ? `${o.good ? GREEN : VERMILION}${"0A"}`
                  : "transparent",
                color: selected
                  ? o.good
                    ? GREEN
                    : VERMILION
                  : INK_SECONDARY,
              }}
            >
              <span style={{ flexShrink: 0 }}>
                {selected ? (
                  o.good ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )
                ) : (
                  <span style={{ color: INK_MUTED }}>○</span>
                )}
              </span>
              <span>{o.text}</span>
            </button>
          );
        })}
      </div>

      {scriptSelection.length > 0 ? (
        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.75rem",
            borderRadius: 8,
            border: `1px solid ${HAIRLINE}`,
            background: `${BLUE}${"06"}`,
          }}
        >
          <p style={{ margin: 0, color: BLUE, fontWeight: 600 }}>
            Your script so far
          </p>
          <ol
            style={{
              margin: "0.5rem 0 0",
              paddingLeft: "1.2rem",
              color: INK_SECONDARY,
              lineHeight: 1.6,
            }}
          >
            {scriptSelection.map((id) => (
              <li key={id}>
                {SCRIPT_OPTIONS.find((o) => o.id === id)?.text}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div style={{ marginTop: "0.85rem" }}>
        <button
          type="button"
          onClick={() => setShowFeedback(true)}
          style={buttonStyle(false, GREEN)}
        >
          Check script
        </button>
      </div>

      {showFeedback ? (
        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.85rem",
            borderRadius: 8,
            border: `1px solid ${allGood ? GREEN : VERMILION}${"66"}`,
            background: `${allGood ? GREEN : VERMILION}${"0A"}`,
          }}
        >
          <p
            style={{
              margin: 0,
              color: allGood ? GREEN : VERMILION,
              fontWeight: 600,
            }}
          >
            {allGood
              ? "Your script includes the required elements and avoids loopholes."
              : "Some required pieces are missing or a loophole was included."}
          </p>
          {feedback.missingGood.length > 0 ? (
            <div style={{ marginTop: "0.65rem" }}>
              <p style={{ margin: 0, color: VERMILION, fontWeight: 600 }}>
                Missing
              </p>
              <ul
                style={{
                  margin: "0.3rem 0 0",
                  paddingLeft: "1.2rem",
                  color: INK_SECONDARY,
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                }}
              >
                {feedback.missingGood.map((o) => (
                  <li key={o.id}>{o.text}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {feedback.wrongSelected.length > 0 ? (
            <div style={{ marginTop: "0.65rem" }}>
              <p style={{ margin: 0, color: VERMILION, fontWeight: 600 }}>
                Sentences that weaken the refusal
              </p>
              <ul
                style={{
                  margin: "0.3rem 0 0",
                  paddingLeft: "1.2rem",
                  color: INK_SECONDARY,
                  fontSize: "0.9rem",
                  lineHeight: 1.5,
                }}
              >
                {feedback.wrongSelected.map((o) => (
                  <li key={o.id}>
                    {o.text} — {o.why}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <label
        style={{
          display: "flex",
          alignItems: "start",
          gap: "0.6rem",
          marginTop: "0.95rem",
          padding: "0.75rem",
          borderRadius: 8,
          border: `1px solid ${pledge ? GREEN : HAIRLINE}`,
          background: pledge ? `${GREEN}${"0A"}` : "transparent",
          cursor: "pointer",
          color: INK_SECONDARY,
        }}
      >
        <input
          type="checkbox"
          checked={pledge}
          onChange={(e) => setPledge(e.target.checked)}
        />
        <span>
          I will never predict or communicate foetal or future-child gender, in any jurisdiction, regardless of legal permissiveness.
        </span>
      </label>
    </section>
  );
}

function BoundarySvg() {
  return (
    <svg
      viewBox="0 0 340 220"
      role="img"
      aria-label="PCPNDT Section 5 boundary covering any person and any means"
      style={{
        width: "100%",
        maxHeight: 260,
        margin: "0.4rem auto 0",
        display: "block",
      }}
    >
      <rect
        x="10"
        y="10"
        width="320"
        height="200"
        rx="10"
        fill={`${VERMILION}${"05"}`}
        stroke={HAIRLINE}
      />
      {/* Shield */}
      <path
        d="M170 40 C 170 40, 130 55, 130 90 C 130 135, 170 165, 170 165 C 170 165, 210 135, 210 90 C 210 55, 170 40, 170 40 Z"
        fill={`${VERMILION}${"14"}`}
        stroke={VERMILION}
        strokeWidth="3"
      />
      <text
        x="170"
        y="95"
        textAnchor="middle"
        fill={VERMILION}
        fontSize="12"
        fontWeight="600"
      >
        Section 5
      </text>
      <text
        x="170"
        y="112"
        textAnchor="middle"
        fill={INK_PRIMARY}
        fontSize="9"
        fontWeight="600"
      >
        any person
      </text>
      <text
        x="170"
        y="126"
        textAnchor="middle"
        fill={INK_PRIMARY}
        fontSize="9"
        fontWeight="600"
      >
        any means
      </text>

      {/* Incoming arrows */}
      <g>
        <line x1="88" y1="95" x2="125" y2="100" stroke={INK_MUTED} strokeWidth="2" strokeDasharray="4 2" />
        <text x="28" y="90" textAnchor="start" fill={INK_SECONDARY} fontSize="9" fontWeight="600">
          astrologer
        </text>
      </g>
      <g>
        <line x1="96" y1="132" x2="125" y2="115" stroke={INK_MUTED} strokeWidth="2" strokeDasharray="4 2" />
        <text x="28" y="137" textAnchor="start" fill={INK_SECONDARY} fontSize="9" fontWeight="600">
          <tspan x="28" dy="0">words / signs</tspan>
          <tspan x="28" dy="12">/ gestures</tspan>
        </text>
      </g>

      {/* Bounce-back arrows */}
      <path d="M220 95 Q 260 90, 280 70" fill="none" stroke={VERMILION} strokeWidth="2" markerEnd="url(#arrowhead)" />
      <path d="M220 110 Q 260 120, 280 140" fill="none" stroke={VERMILION} strokeWidth="2" markerEnd="url(#arrowhead2)" />
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill={VERMILION} />
        </marker>
        <marker id="arrowhead2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <polygon points="0 0, 8 4, 0 8" fill={VERMILION} />
        </marker>
      </defs>
      <text x="285" y="65" fill={VERMILION} fontSize="9" fontWeight="600">
        refused
      </text>
      <text x="285" y="155" fill={VERMILION} fontSize="9" fontWeight="600">
        refused
      </text>
    </svg>
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
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function sentenceButtonStyle(): CSSProperties {
  return {
    display: "flex",
    alignItems: "start",
    gap: "0.55rem",
    textAlign: "left",
    border: `1px solid ${HAIRLINE}`,
    borderRadius: 8,
    background: "transparent",
    color: INK_SECONDARY,
    padding: "0.7rem",
    fontSize: "0.9rem",
    fontWeight: 400,
    cursor: "pointer",
    lineHeight: 1.4,
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
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
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
