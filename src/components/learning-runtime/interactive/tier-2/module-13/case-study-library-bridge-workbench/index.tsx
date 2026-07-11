"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpenCheck,
  ClipboardCheck,
  Compass,
  FileText,
  GitCompare,
  Library,
  RefreshCw,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ComponentKey = "sequence" | "statement" | "confidence" | "commitment" | "ethics" | "audit";
type FrameKey = "t2-13" | "bridge" | "t2-22";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const COMPONENTS: Record<ComponentKey, { label: string; short: string; taught: string; applied: string; icon: ReactNode; color: string }> = {
  sequence: {
    label: "Six-step sequence",
    short: "Route, Weight, Classify, Check, Resolve, Rank",
    taught: "T2-13 made the order repeatable on Chart MD1 across four capstone questions.",
    applied: "T2-22 asks the same order to hold when a new chart has no known answer waiting.",
    icon: <SlidersHorizontal size={16} />,
    color: ACCENT,
  },
  statement: {
    label: "Six-section statement",
    short: "Evidence becomes a defensible written answer",
    taught: "T2-13 practiced the document shape until findings, confidence, and caveats stayed separate.",
    applied: "T2-22 uses that shape as the case-study response form, not as a new template lesson.",
    icon: <FileText size={16} />,
    color: BLUE,
  },
  confidence: {
    label: "Confidence-tier framing",
    short: "Language must match what Check earned",
    taught: "T2-13 replaced false unity and vague hedging with earned confidence tiers.",
    applied: "T2-22 tests whether confidence still stays exact when convergence is not pre-known.",
    icon: <Scale size={16} />,
    color: GREEN,
  },
  commitment: {
    label: "Ceiling and floor",
    short: "Avoid both overclaiming and underclaiming",
    taught: "T2-13 named overclaiming and underclaiming as twin failures under uncertainty.",
    applied: "T2-22 makes the learner commit honestly before comparing against worked solutions.",
    icon: <ClipboardCheck size={16} />,
    color: VERMILION,
  },
  ethics: {
    label: "Ethical frame",
    short: "Guardrail first, not closing formality",
    taught: "T2-13 placed ethical framing at the start of sensitive synthesis work.",
    applied: "T2-22 keeps the same governing frame while the chart content changes case by case.",
    icon: <ShieldCheck size={16} />,
    color: GREEN,
  },
  audit: {
    label: "Self-audit habit",
    short: "Check stream orientation across a batch",
    taught: "T2-13 turned neutrality into a repeatable audit instead of a one-time intention.",
    applied: "T2-22 lets that audit reveal whether a practitioner favors a stream across many cases.",
    icon: <Compass size={16} />,
    color: ACCENT,
  },
};

const COMPONENT_ORDER: ComponentKey[] = ["sequence", "statement", "confidence", "commitment", "ethics", "audit"];

export function CaseStudyLibraryBridgeWorkbench() {
  const [active, setActive] = useState<ComponentKey>("sequence");
  const [frame, setFrame] = useState<FrameKey>("bridge");
  const [transferMethod, setTransferMethod] = useState(true);
  const [practiceGround, setPracticeGround] = useState(true);
  const [correctPlan, setCorrectPlan] = useState(true);
  const [unknownAnswer, setUnknownAnswer] = useState(true);

  const selected = COMPONENTS[active];
  const bridgeReady = transferMethod && practiceGround && correctPlan && unknownAnswer;

  const bridgeStatement = useMemo(() => {
    if (!transferMethod) return "Repair: Chart MD1's findings were the vehicle. The portable content is the six-part discipline.";
    if (!practiceGround) return "Repair: T2-22 applies the discipline to new cases. It is not a module promising a seventh step.";
    if (!correctPlan) return "Repair: a case-study library needs many charts. A bank of one would only imitate the future tool.";
    if (!unknownAnswer) return "Repair: the next challenge is losing the quiet safety net of known answers.";
    return "Bridge ready: carry the six transferable components forward, leave MD1's specific findings behind, and treat T2-22 as applied practice on charts whose answers are not known in advance.";
  }, [correctPlan, practiceGround, transferMethod, unknownAnswer]);

  return (
    <div data-interactive="case-study-library-bridge-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>T2-13 to T2-22 bridge</p>
            <h2 style={headingStyle}>Move the discipline forward, not the old answers</h2>
            <p style={bodyStyle}>
              Use the bridge map to separate what transfers from this module from what must be discovered fresh in case-study-library practice.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setActive("sequence");
              setFrame("bridge");
              setTransferMethod(true);
              setPracticeGround(true);
              setCorrectPlan(true);
              setUnknownAnswer(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 560px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", flexWrap: "wrap", alignItems: "center" }}>
            <p style={eyebrowStyle}>One-chart method to many-chart practice</p>
            <div style={segmentedStyle}>
              <FrameButton frame={frame} target="t2-13" onSelect={setFrame} label="T2-13" />
              <FrameButton frame={frame} target="bridge" onSelect={setFrame} label="Bridge" />
              <FrameButton frame={frame} target="t2-22" onSelect={setFrame} label="T2-22" />
            </div>
          </div>
          <BridgeDiagram active={active} frame={frame} bridgeReady={bridgeReady} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: selected.color }}>
            {selected.icon}
            <p style={eyebrowStyle}>{selected.label}</p>
          </div>
          <h3 style={panelTitleStyle}>{selected.short}</h3>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.8rem" }}>
            <InfoBlock icon={<BookOpenCheck size={16} />} label="T2-13 taught" body={selected.taught} color={ACCENT} />
            <InfoBlock icon={<Library size={16} />} label="T2-22 applies" body={selected.applied} color={BLUE} />
          </div>
          <div style={{ ...noticeStyle(bridgeReady ? GREEN : VERMILION), marginTop: "1rem" }}>
            {bridgeReady ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{bridgeReady ? "transfer discipline is clean" : "bridge needs repair"}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Transferable discipline</p>
          <div style={componentGridStyle}>
            {COMPONENT_ORDER.map((key) => (
              <button key={key} type="button" onClick={() => setActive(key)} aria-pressed={active === key} style={componentButtonStyle(active === key, COMPONENTS[key].color)}>
                <span style={{ color: COMPONENTS[key].color }}>{COMPONENTS[key].icon}</span>
                <span>
                  <span style={{ display: "block", fontWeight: 500 }}>{COMPONENTS[key].label}</span>
                  <span style={smallTextStyle}>{COMPONENTS[key].short}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Bridge guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow
              checked={transferMethod}
              onChange={setTransferMethod}
              label="Transfer method, not MD1 findings"
              body="Saturn, Moon, Maheshvara, and polarity examples do not become answers for new charts."
              icon={<GitCompare size={16} />}
            />
            <ToggleRow
              checked={practiceGround}
              onChange={setPracticeGround}
              label="Treat T2-22 as practice ground"
              body="It applies the completed discipline to fresh material rather than teaching a new doctrine."
              icon={<Library size={16} />}
            />
            <ToggleRow
              checked={correctPlan}
              onChange={setCorrectPlan}
              label="Correct the case-library plan"
              body="The real library belongs where there are many cases, not a single-chart module."
              icon={<BookOpenCheck size={16} />}
            />
            <ToggleRow
              checked={unknownAnswer}
              onChange={setUnknownAnswer}
              label="Keep the unknown answer visible"
              body="The next test is running the same discipline without a quiet safety net."
              icon={<Compass size={16} />}
            />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {bridgeReady ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Bridge statement</p>
            <h3 style={{ ...panelTitleStyle, color: bridgeReady ? GREEN : VERMILION }}>
              {bridgeReady ? "Ready for T2-22 case-study practice" : "Repair before entering the library"}
            </h3>
            <p style={bodyStyle}>{bridgeStatement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CaseStudyLibraryBridgeWorkbench;

function BridgeDiagram({ active, frame, bridgeReady }: { active: ComponentKey; frame: FrameKey; bridgeReady: boolean }) {
  const selected = COMPONENTS[active];
  const focusX = frame === "t2-13" ? 150 : frame === "bridge" ? 390 : 630;
  const focusColor = frame === "t2-13" ? ACCENT : frame === "bridge" ? GREEN : BLUE;

  return (
    <svg viewBox="0 0 780 430" role="img" aria-label="Bridge from T2-13 discipline to T2-22 case-study practice" style={{ width: "100%", minHeight: 340, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="410" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 205 170 C 275 120, 315 120, 360 170" fill="none" stroke={HAIRLINE} strokeWidth="2.5" />
      <path d="M 420 170 C 465 120, 505 120, 575 170" fill="none" stroke={HAIRLINE} strokeWidth="2.5" />
      <Node x={150} y={175} label="T2-13" body="one chart in depth" color={ACCENT} active={frame === "t2-13"} icon="1" />
      <Node x={390} y={175} label="Bridge" body="six components transfer" color={GREEN} active={frame === "bridge"} icon="6" />
      <Node x={630} y={175} label="T2-22" body="many charts, fresh answers" color={BLUE} active={frame === "t2-22"} icon="?" />
      <path d={`M ${focusX} 240 L ${focusX} 278`} stroke={focusColor} strokeWidth="3" strokeLinecap="round" />
      <rect x={focusX - 122} y="278" width="244" height="70" rx="8" fill={softFill(focusColor)} stroke={focusColor} strokeWidth="2" />
      <text x={focusX} y="304" textAnchor="middle" fill={focusColor} fontSize="14" fontWeight="500">{selected.label}</text>
      <text x={focusX} y="326" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{frameCopy(frame)}</text>
      {COMPONENT_ORDER.map((key, index) => {
        const x = 132 + index * 103;
        const item = COMPONENTS[key];
        const isActive = key === active;
        return (
          <g key={key}>
            <circle cx={x} cy="382" r="22" fill={isActive ? softFill(item.color) : SURFACE} stroke={isActive ? item.color : HAIRLINE} strokeWidth={isActive ? 2.2 : 1.1} />
            <text x={x} y="388" textAnchor="middle" fill={isActive ? item.color : INK_MUTED} fontSize="13" fontWeight="500">{index + 1}</text>
          </g>
        );
      })}
      <circle cx="720" cy="64" r="24" fill={bridgeReady ? "#E8F5E9" : "#F9E8E3"} stroke={bridgeReady ? GREEN : VERMILION} strokeWidth="2" />
      <text x="720" y="70" textAnchor="middle" fill={bridgeReady ? GREEN : VERMILION} fontSize="18" fontWeight="500">{bridgeReady ? "OK" : "!"}</text>
    </svg>
  );
}

function Node({ x, y, label, body, color, active, icon }: { x: number; y: number; label: string; body: string; color: string; active: boolean; icon: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="62" fill={active ? softFill(color) : SURFACE} stroke={active ? color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} />
      <circle cx={x} cy={y - 28} r="15" fill={active ? color : softFill(color)} stroke={color} strokeWidth="1.5" />
      <text x={x} y={y - 23} textAnchor="middle" fill={active ? SURFACE : color} fontSize="12" fontWeight="500">{icon}</text>
      <text x={x} y={y + 4} textAnchor="middle" fill={active ? color : INK_PRIMARY} fontSize="15" fontWeight="500">{label}</text>
      <text x={x} y={y + 26} textAnchor="middle" fill={INK_MUTED} fontSize="11">{body}</text>
    </g>
  );
}

function FrameButton({ frame, target, onSelect, label }: { frame: FrameKey; target: FrameKey; onSelect: (frame: FrameKey) => void; label: string }) {
  const active = frame === target;
  return (
    <button type="button" aria-pressed={active} onClick={() => onSelect(target)} style={frameButtonStyle(active)}>
      {label}
    </button>
  );
}

function InfoBlock({ icon, label, body, color }: { icon: ReactNode; label: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}55`, borderRadius: 8, background: softFill(color), padding: "0.75rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color }}>
        {icon}
        <span style={{ fontSize: "0.84rem", fontWeight: 500 }}>{label}</span>
      </div>
      <p style={smallTextStyle}>{body}</p>
    </div>
  );
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}

function frameCopy(frame: FrameKey): string {
  if (frame === "t2-13") return "taught and demonstrated";
  if (frame === "t2-22") return "applied to new cases";
  return "portable discipline";
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  boxShadow: "var(--gl-shadow-soft)",
  padding: "1rem",
};

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

const componentGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
  gap: "0.65rem",
  marginTop: "0.85rem",
};

const segmentedStyle: CSSProperties = {
  display: "inline-grid",
  gridTemplateColumns: "repeat(3, minmax(72px, 1fr))",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  overflow: "hidden",
  background: SURFACE,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: 0,
  fontSize: "0.78rem",
  fontWeight: 500,
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  lineHeight: 1.25,
  fontWeight: 500,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.4rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  lineHeight: 1.3,
  fontWeight: 500,
};

const bodyStyle: CSSProperties = {
  margin: "0.5rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.94rem",
};

const smallTextStyle: CSSProperties = {
  margin: "0.2rem 0 0",
  color: INK_MUTED,
  lineHeight: 1.4,
  fontSize: "0.84rem",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.58rem 0.72rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
  fontWeight: 500,
};

function frameButtonStyle(active: boolean): CSSProperties {
  return {
    border: 0,
    borderRight: `1px solid ${HAIRLINE}`,
    background: active ? softFill(ACCENT) : SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
    padding: "0.55rem 0.7rem",
    minHeight: 38,
    cursor: "pointer",
    font: "inherit",
    fontSize: "0.86rem",
    fontWeight: 500,
  };
}

function componentButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    color: INK_PRIMARY,
    padding: "0.72rem",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    font: "inherit",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: checked ? softFill(ACCENT) : SURFACE,
    color: checked ? INK_PRIMARY : INK_MUTED,
    padding: "0.7rem",
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    gap: "0.62rem",
    alignItems: "center",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 8,
    background: softFill(color),
    color,
    padding: "0.7rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    fontWeight: 500,
  };
}

function softFill(color: string): string {
  if (color === ACCENT) return "#FDF4E3";
  if (color === GREEN) return "#E8F5E9";
  if (color === BLUE) return "#E3EEF9";
  if (color === VERMILION) return "#F9E8E3";
  return SURFACE;
}
