"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  ClipboardList,
  Eye,
  GitCompare,
  ListChecks,
  LockKeyhole,
  RefreshCw,
  Route,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type LensKey = "tie" | "space" | "hedge" | "order";
type BatchMode = "module" | "small" | "biased";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const VERMILION = "var(--gl-vermilion-accent)";

const STATEMENTS = [
  "13.3.4 two-stream statement",
  "13.4.4 three-stream statement",
  "13.5.5 five-stream statement",
  "13.7.3 marriage synthesis",
  "13.7.4 career synthesis",
  "13.7.5 health synthesis",
];

const LENSES: Record<LensKey, { label: string; title: string; clean: string; risk: string; icon: ReactNode; color: string }> = {
  tie: {
    label: "Tie-breaking",
    title: "Who wins genuine divergences?",
    clean: "0 resolutions toward either Parashari or KP across four live divergences.",
    risk: "Repeatedly letting one stream win would be the strongest bias signal.",
    icon: <GitCompare size={16} />,
    color: GREEN,
  },
  space: {
    label: "Space",
    title: "Who receives prominence?",
    clean: "Space follows rank, stakes, structural depth, and directionality.",
    risk: "One stream receiving extra space regardless of rank would be suspicious.",
    icon: <Scale size={16} />,
    color: BLUE,
  },
  hedge: {
    label: "Hedge language",
    title: "Are streams softened or sharpened unfairly?",
    clean: "Each stream keeps its own native vocabulary: graded Parashari, margin-qualified KP.",
    risk: "A stream softened beyond its method or sharpened beyond its evidence would be bias.",
    icon: <Eye size={16} />,
    color: ACCENT,
  },
  order: {
    label: "Stream order",
    title: "Is first consulted the same as privileged?",
    clean: "Parashari is first for procedural reasons, while tie-breaking remains even.",
    risk: "Order becomes bias only if it creates evidentiary privilege in outcomes.",
    icon: <Route size={16} />,
    color: VERMILION,
  },
};

const LENS_ORDER: LensKey[] = ["tie", "space", "hedge", "order"];

export function StreamOrientationSelfAuditTool() {
  const [batchMode, setBatchMode] = useState<BatchMode>("module");
  const [lens, setLens] = useState<LensKey>("order");
  const [proceduralDistinction, setProceduralDistinction] = useState(true);
  const [snapshotFraming, setSnapshotFraming] = useState(true);
  const [useSingleReading, setUseSingleReading] = useState(false);

  const batchSize = batchMode === "small" || useSingleReading ? 2 : batchMode === "biased" ? 10 : 6;
  const canRun = batchSize >= 3 && !useSingleReading;
  const biased = batchMode === "biased";
  const selectedLens = LENSES[lens];

  const auditStatus = useMemo(() => {
    if (!canRun) {
      return {
        label: "batch too small",
        color: VERMILION,
        text: "The audit refuses to run below three statements because a single case cannot reveal a pattern.",
      };
    }
    if (biased) {
      return {
        label: "pattern found",
        color: VERMILION,
        text: "Hypothetical batch: KP wins 9 of 10 divergences. Treat this as data for recalibration, not self-accusation.",
      };
    }
    if (!proceduralDistinction) {
      return {
        label: "order lens needs repair",
        color: VERMILION,
        text: "Parashari-first order is procedural. Do not treat order alone as evidence of favouritism.",
      };
    }
    if (!snapshotFraming) {
      return {
        label: "snapshot warning",
        color: VERMILION,
        text: "A clean audit is not a permanent certificate. It is a repeatable check on a current batch.",
      };
    }
    return {
      label: "clean snapshot",
      color: GREEN,
      text: "No stream chauvinism evidence found in this six-statement batch; the stream-order lens is handled with the procedural-versus-evidentiary distinction.",
    };
  }, [biased, canRun, proceduralDistinction, snapshotFraming]);

  return (
    <div data-interactive="stream-orientation-self-audit-tool" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Stream-orientation self-audit</p>
            <h2 style={headingStyle}>Audit a batch for favouritism patterns a single reading cannot show</h2>
            <p style={bodyStyle}>
              Run the four lenses across the module&apos;s six worked statements, then separate procedural order from evidentiary privilege.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setBatchMode("module");
              setLens("order");
              setProceduralDistinction(true);
              setSnapshotFraming(true);
              setUseSingleReading(false);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Batch gate</p>
        <div style={batchGridStyle}>
          <BatchButton active={batchMode === "module" && !useSingleReading} color={GREEN} title="Default six-statement batch" body="This module's own six worked statements." onClick={() => { setBatchMode("module"); setUseSingleReading(false); }} />
          <BatchButton active={batchMode === "small" || useSingleReading} color={VERMILION} title="Too small to audit" body="Two or fewer statements cannot answer a pattern question." onClick={() => { setBatchMode("small"); setUseSingleReading(false); }} />
          <BatchButton active={batchMode === "biased" && !useSingleReading} color={VERMILION} title="Hypothetical biased batch" body="Ten statements where KP wins 9 divergences." onClick={() => { setBatchMode("biased"); setUseSingleReading(false); }} />
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 540px" }}>
          <p style={eyebrowStyle}>Four-lens audit board</p>
          <AuditDiagram lens={lens} canRun={canRun} biased={biased} proceduralDistinction={proceduralDistinction} />
          <div style={lensGridStyle}>
            {LENS_ORDER.map((key) => (
              <button key={key} type="button" aria-pressed={lens === key} onClick={() => setLens(key)} style={lensButtonStyle(lens === key, LENSES[key].color)} disabled={!canRun}>
                {LENSES[key].icon}
                {LENSES[key].label}
              </button>
            ))}
          </div>
        </section>

        <section style={{ ...cardStyle, flex: "1 1 310px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: canRun ? selectedLens.color : VERMILION }}>
            {canRun ? selectedLens.icon : <LockKeyhole size={16} />}
            <p style={eyebrowStyle}>{canRun ? selectedLens.label : "Minimum batch"}</p>
          </div>
          <h3 style={panelTitleStyle}>{canRun ? selectedLens.title : "Audit paused"}</h3>
          <p style={bodyStyle}>{canRun ? (biased ? selectedLens.risk : selectedLens.clean) : "Load at least three statements before interpreting stream orientation. A single reading is for direct review, not batch audit."}</p>
          <div style={{ ...noticeStyle(auditStatus.color), marginTop: "1rem" }}>
            {auditStatus.color === GREEN ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{auditStatus.label}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Statements in scope</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.8rem" }}>
            {STATEMENTS.map((item, index) => {
              const visible = canRun && batchMode === "module";
              return (
                <div key={item} style={statementRowStyle(visible)}>
                  <span style={stepNumberStyle}>{index + 1}</span>
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Guardrails</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow
              checked={!useSingleReading}
              onChange={(checked) => setUseSingleReading(!checked)}
              label="Do not run on one statement"
              body="Use peer/direct review for a single difficult case."
              icon={<LockKeyhole size={16} />}
            />
            <ToggleRow
              checked={proceduralDistinction}
              onChange={setProceduralDistinction}
              label="Separate order from privilege"
              body="Parashari-first is procedural unless outcomes show preference."
              icon={<Route size={16} />}
              disabled={!canRun}
            />
            <ToggleRow
              checked={snapshotFraming}
              onChange={setSnapshotFraming}
              label="Frame clean result as a snapshot"
              body="No bias found now is not a permanent clearance."
              icon={<ShieldCheck size={16} />}
              disabled={!canRun}
            />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <ListChecks size={20} color={auditStatus.color} style={{ flex: "0 0 auto", marginTop: "0.15rem" }} />
          <div>
            <p style={eyebrowStyle}>Audit result</p>
            <h3 style={{ ...panelTitleStyle, color: auditStatus.color }}>{auditStatus.label}</h3>
            <p style={bodyStyle}>{auditStatus.text}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StreamOrientationSelfAuditTool;

function AuditDiagram({ lens, canRun, biased, proceduralDistinction }: { lens: LensKey; canRun: boolean; biased: boolean; proceduralDistinction: boolean }) {
  const centerColor = canRun ? (biased || !proceduralDistinction ? VERMILION : GREEN) : VERMILION;
  return (
    <svg viewBox="0 0 780 400" role="img" aria-label="Four lens stream orientation self audit" style={{ width: "100%", minHeight: 330, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="760" height="380" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <rect x="66" y="52" width="168" height="58" rx="8" fill={canRun ? "#E8F5E9" : "#F9E8E3"} stroke={canRun ? GREEN : VERMILION} strokeWidth="2" />
      <text x="150" y="76" textAnchor="middle" fill={canRun ? GREEN : VERMILION} fontSize="14" fontWeight="500">Batch size</text>
      <text x="150" y="96" textAnchor="middle" fill={INK_SECONDARY} fontSize="12">{canRun ? ">= 3 statements" : "too small"}</text>
      {LENS_ORDER.map((key, index) => {
        const active = lens === key && canRun;
        const x = 150 + index * 160;
        const y = index % 2 === 0 ? 190 : 246;
        return (
          <g key={key}>
            <path d={`M ${x} ${y + 44} C 360 330, 580 330, 655 284`} fill="none" stroke={active ? LENSES[key].color : HAIRLINE} strokeWidth={active ? 2.5 : 1.2} strokeDasharray={active ? undefined : "6 7"} />
            <rect x={x - 62} y={y - 34} width="124" height="68" rx="8" fill={active ? softFill(LENSES[key].color) : SURFACE} stroke={active ? LENSES[key].color : HAIRLINE} strokeWidth={active ? 2 : 1} />
            <text x={x} y={y - 5} textAnchor="middle" fill={active ? LENSES[key].color : INK_MUTED} fontSize="12" fontWeight="500">{LENSES[key].label}</text>
            <text x={x} y={y + 15} textAnchor="middle" fill={INK_MUTED} fontSize="10">{key === "tie" ? "0 wins" : key === "order" ? "procedural?" : "rank-based"}</text>
          </g>
        );
      })}
      <circle cx="700" cy="276" r="45" fill={softFill(centerColor)} stroke={centerColor} strokeWidth="3" />
      <text x="700" y="270" textAnchor="middle" fill={centerColor} fontSize="15" fontWeight="500">{biased ? "Pattern" : canRun ? "Result" : "Paused"}</text>
      <text x="700" y="292" textAnchor="middle" fill={INK_SECONDARY} fontSize="11">{biased ? "recalibrate" : canRun ? "snapshot" : "need batch"}</text>
    </svg>
  );
}

function BatchButton({ active, color, title, body, onClick }: { active: boolean; color: string; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={batchButtonStyle(active, color)}>
      <span style={{ display: "flex", gap: "0.48rem", alignItems: "center", color }}>
        {active ? <BadgeCheck size={16} /> : <ClipboardList size={16} />}
        <span style={{ fontWeight: 500 }}>{title}</span>
      </span>
      <span style={smallTextStyle}>{body}</span>
    </button>
  );
}

function ToggleRow({ checked, onChange, label, body, icon, disabled }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode; disabled?: boolean }) {
  return (
    <label style={toggleStyle(checked, Boolean(disabled))}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} disabled={disabled} />
    </label>
  );
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

const batchGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 230px), 1fr))",
  gap: "0.7rem",
  marginTop: "0.8rem",
};

const lensGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(132px, 1fr))",
  gap: "0.5rem",
  marginTop: "0.85rem",
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

const stepNumberStyle: CSSProperties = {
  width: "1.35rem",
  height: "1.35rem",
  borderRadius: 999,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: `1px solid ${HAIRLINE}`,
  fontSize: "0.78rem",
  flex: "0 0 auto",
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

function batchButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : SURFACE,
    padding: "0.78rem",
    textAlign: "left",
    display: "grid",
    gap: "0.3rem",
    cursor: "pointer",
    font: "inherit",
  };
}

function lensButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    ...softButtonStyle,
    justifyContent: "center",
    borderColor: active ? color : HAIRLINE,
    background: active ? softFill(color) : SURFACE,
    color: active ? INK_PRIMARY : INK_SECONDARY,
    opacity: active || color ? 1 : 0.6,
  };
}

function statementRowStyle(active: boolean): CSSProperties {
  return {
    border: `1px solid ${active ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(ACCENT) : SURFACE,
    color: active ? INK_PRIMARY : INK_MUTED,
    padding: "0.62rem 0.7rem",
    display: "flex",
    alignItems: "center",
    gap: "0.62rem",
    fontSize: "0.9rem",
  };
}

function toggleStyle(checked: boolean, disabled: boolean): CSSProperties {
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
    opacity: disabled ? 0.58 : 1,
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
