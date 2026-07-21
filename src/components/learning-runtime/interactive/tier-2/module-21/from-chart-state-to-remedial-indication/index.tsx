"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Layers,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type GrahaKey = "saturn" | "jupiter" | "sun" | "mercury" | "custom";
type RoleKey = "benefic" | "yogakaraka" | "malefic";
type DignityKey = "strong" | "weak";
type IndicationKey = "strengthen" | "pacify" | "no-action";
type CommitmentKey = "debilityAlone" | "kendraAlone" | "dashaPriority";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const MUTED_HEX = "#5C4A2A";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const INDICATION_META: Record<IndicationKey, { label: string; color: string; detail: string }> = {
  strengthen: { label: "Strengthen", color: GREEN, detail: "Functional benefic currently under-delivering; amplify its helpful rays." },
  pacify: { label: "Pacify", color: VERMILION, detail: "Functional malefic currently weak or afflicted; appease without amplifying." },
  "no-action": { label: "No action indicated", color: MUTED_HEX, detail: "Either axis reads strong, or the graha is not currently warranting remedial attention." },
};

const ROLES: Record<RoleKey, { label: string; detail: string }> = {
  yogakaraka: { label: "Yogakāraka", detail: "Rules a kendra and a trikoṇa together (narrow, specific pairings)." },
  benefic: { label: "Functional benefic", detail: "Rules a trikoṇa (5th or 9th), regardless of natural character." },
  malefic: { label: "Functional malefic", detail: "Rules only kendra, dusthana, maraka, or upachaya without a trikoṇa." },
};

const DIGNITIES: Record<DignityKey, { label: string; detail: string }> = {
  strong: { label: "Strong / supported", detail: "Own sign, exalted, friendly sign, or benefic-aspected." },
  weak: { label: "Weak / afflicted", detail: "Debilitated, enemy sign, dusthana placement, or malefic-aspected." },
};

const CHART_STATE_INPUTS = [
  { label: "Sign and dignity", detail: "Which sign and what dignity state?" },
  { label: "House", detail: "Which house from Lagna?" },
  { label: "House-lordship classification", detail: "kendra / trikoṇa / dusthana / maraka / upachaya" },
  { label: "Aspects received", detail: "Benefic, malefic, mixed, or none?" },
  { label: "Daśā/antardaśā activation", detail: "Is the graha currently live in the predictive period?" },
];

const GRAHAS: Record<Exclude<GrahaKey, "custom">, {
  label: string;
  devanagari: string;
  short: string;
  color: string;
  sign: string;
  dignity: string;
  house: string;
  lordship: string;
  role: RoleKey;
  dignityState: DignityKey;
  aspects: string;
  dasha: string;
  dashaActive: boolean;
}> = {
  saturn: {
    label: "Saturn (Śani)",
    devanagari: "शनिः",
    short: "Sa",
    color: BLUE,
    sign: "Aries",
    dignity: "Debilitated",
    house: "6th (dusthana)",
    lordship: "3rd, 4th (kendra only)",
    role: "malefic",
    dignityState: "weak",
    aspects: "None",
    dasha: "Mahādaśā lord",
    dashaActive: true,
  },
  jupiter: {
    label: "Jupiter (Guru)",
    devanagari: "गुरुः",
    short: "Ju",
    color: GOLD,
    sign: "Gemini",
    dignity: "Enemy's sign",
    house: "8th (dusthana)",
    lordship: "2nd, 5th (trikoṇa)",
    role: "benefic",
    dignityState: "weak",
    aspects: "None",
    dasha: "Antardaśā lord",
    dashaActive: true,
  },
  sun: {
    label: "Sun (Sūrya)",
    devanagari: "सूर्यः",
    short: "Su",
    color: VERMILION,
    sign: "Leo",
    dignity: "Own sign",
    house: "10th (kendra)",
    lordship: "10th (kendra only)",
    role: "malefic",
    dignityState: "strong",
    aspects: "None",
    dasha: "Not currently active",
    dashaActive: false,
  },
  mercury: {
    label: "Mercury (Budha)",
    devanagari: "बुधः",
    short: "Me",
    color: GREEN,
    sign: "Virgo",
    dignity: "Exalted",
    house: "11th (upachaya)",
    lordship: "8th, 11th (no trikoṇa)",
    role: "malefic",
    dignityState: "strong",
    aspects: "None",
    dasha: "Not currently active",
    dashaActive: false,
  },
};

const COMMITMENTS: Record<CommitmentKey, { label: string; heldText: string; releasedText: string }> = {
  debilityAlone: {
    label: "Debility alone does not determine direction",
    heldText: "Held: debilitation is an Axis-2 fact only; it must be paired with Axis-1 functional role.",
    releasedText: "Warning: 'debilitated, therefore strengthen' would prescribe a gemstone for Rohan's Saturn.",
  },
  kendraAlone: {
    label: "Kendra-lordship alone is not yogakāraka status",
    heldText: "Held: yogakāraka requires kendra and trikoṇa together; kendra-only lordship leaves a functional malefic.",
    releasedText: "Warning: calling Saturn a yogakāraka because it rules the 4th would misclassify it as a benefic.",
  },
  dashaPriority: {
    label: "Daśā activation sets priority, not direction",
    heldText: "Held: the same chart-state can be dormant or urgent depending on current daśā activation.",
    releasedText: "Warning: ignoring daśā flattens all weak grahas into equally urgent prescriptions.",
  },
};

function classify(role: RoleKey, dignity: DignityKey): IndicationKey {
  if (role === "benefic" || role === "yogakaraka") {
    return dignity === "weak" ? "strengthen" : "no-action";
  }
  return dignity === "weak" ? "pacify" : "no-action";
}

function QuadrantSvg({ role, dignity }: { role: RoleKey; dignity: DignityKey }) {
  const activeIndication = classify(role, dignity);
  const cellW = 230;
  const cellH = 110;
  const marginLeft = 110;
  const marginTop = 16;

  const cells: { role: RoleKey; dignity: DignityKey; x: number; y: number; label: string }[] = [
    { role: "benefic", dignity: "strong", x: 0, y: 0, label: "No action" },
    { role: "benefic", dignity: "weak", x: 0, y: cellH, label: "Strengthen" },
    { role: "malefic", dignity: "strong", x: cellW, y: 0, label: "No action" },
    { role: "malefic", dignity: "weak", x: cellW, y: cellH, label: "Pacify" },
  ];

  return (
    <svg
      viewBox="0 0 580 280"
      role="img"
      aria-label="Two-axis classification quadrant: functional role by dignity state"
      style={{ width: "100%", maxHeight: 300, margin: "0.4rem auto 0.85rem", display: "block" }}
    >
      <rect x="12" y="12" width="556" height="256" rx="8" fill={`${GOLD}0D`} stroke={HAIRLINE} />

      {/* Axis labels */}
      <text x="30" y="28" fill={INK_MUTED} fontSize="11" fontWeight={600}>
        Functional role →
      </text>
      <text x="30" y="42" fill={INK_MUTED} fontSize="10">
        (Axis 1)
      </text>
      <text x="520" y="28" textAnchor="end" fill={INK_MUTED} fontSize="11" fontWeight={600}>
        Malefic / Yogakāraka
      </text>
      <text x="520" y="42" textAnchor="end" fill={INK_MUTED} fontSize="10">
        right column
      </text>

      <text x="20" y="140" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600} transform="rotate(-90 20 140)">
        Dignity state →
      </text>
      <text x="36" y="140" textAnchor="middle" fill={INK_MUTED} fontSize="10" transform="rotate(-90 36 140)">
        (Axis 2)
      </text>
      <text x="20" y="250" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600} transform="rotate(-90 20 250)">
        Weak / afflicted
      </text>

      {/* Grid lines */}
      <line x1={marginLeft + cellW} y1={marginTop} x2={marginLeft + cellW} y2={marginTop + cellH * 2} stroke={HAIRLINE} strokeWidth="2" />
      <line x1={marginLeft} y1={marginTop + cellH} x2={marginLeft + cellW * 2} y2={marginTop + cellH} stroke={HAIRLINE} strokeWidth="2" />

      {/* Cells */}
      {cells.map((cell) => {
        const isActive = cell.role === role && cell.dignity === dignity;
        const indication = classify(cell.role, cell.dignity);
        const color = INDICATION_META[indication].color;
        return (
          <g key={`${cell.role}-${cell.dignity}`}>
            <rect
              x={marginLeft + cell.x}
              y={marginTop + cell.y}
              width={cellW}
              height={cellH}
              fill={isActive ? `${color}18` : "transparent"}
              stroke={isActive ? color : HAIRLINE}
              strokeWidth={isActive ? 3 : 1}
              rx={6}
            />
            <text
              x={marginLeft + cell.x + cellW / 2}
              y={marginTop + cell.y + cellH / 2 + 5}
              textAnchor="middle"
              fill={isActive ? color : INK_SECONDARY}
              fontSize={isActive ? 15 : 13}
              fontWeight={600}
            >
              {cell.label}
            </text>
            {isActive && (
              <text
                x={marginLeft + cell.x + cellW / 2}
                y={marginTop + cell.y + cellH / 2 + 24}
                textAnchor="middle"
                fill={color}
                fontSize="10"
                fontWeight={600}
              >
                active
              </text>
            )}
          </g>
        );
      })}

      {/* Active marker */}
      <circle
        cx={marginLeft + (role === "malefic" ? cellW : 0) + cellW / 2}
        cy={marginTop + (dignity === "weak" ? cellH : 0) + cellH / 2}
        r="42"
        fill="none"
        stroke={INDICATION_META[activeIndication].color}
        strokeWidth="2"
        strokeDasharray="6 4"
      />
    </svg>
  );
}

export function FromChartStateToRemedialIndication() {
  const [graha, setGraha] = useState<GrahaKey>("saturn");
  const [customRole, setCustomRole] = useState<RoleKey>("benefic");
  const [customDignity, setCustomDignity] = useState<DignityKey>("weak");
  const [dashaActive, setDashaActive] = useState(true);
  const [commitments, setCommitments] = useState<Record<CommitmentKey, boolean>>({
    debilityAlone: true,
    kendraAlone: true,
    dashaPriority: true,
  });

  const g = graha === "custom" ? null : GRAHAS[graha];
  const role = g ? g.role : customRole;
  const dignity = g ? g.dignityState : customDignity;
  const indication = classify(role, dignity);
  const isDashaActive = g ? g.dashaActive : dashaActive;

  const allCommitmentsHeld = Object.values(commitments).every(Boolean);

  function reset() {
    setGraha("saturn");
    setCustomRole("benefic");
    setCustomDignity("weak");
    setDashaActive(true);
    setCommitments({ debilityAlone: true, kendraAlone: true, dashaPriority: true });
  }

  return (
    <div data-interactive="from-chart-state-to-remedial-indication" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 21 · Chart-state → indication</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              From chart-state to remedial indication
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Use the two-axis test to turn five chart-state facts into a defensible strengthen / pacify / no-action call.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>The five chart-state inputs</p>
          <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.15rem", fontWeight: 600 }}>
            Gather all five before classifying
          </h3>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.65rem" }}>
            {CHART_STATE_INPUTS.map((input, index) => (
              <div key={input.label} style={{ display: "flex", alignItems: "start", gap: "0.55rem", padding: "0.55rem", borderRadius: 8, border: `1px solid ${HAIRLINE}` }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: GOLD, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                  {index + 1}
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: INK_PRIMARY }}>{input.label}</div>
                  <div style={{ color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.45 }}>{input.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Two-axis test</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Functional role × dignity state
          </h3>
          <QuadrantSvg role={role} dignity={dignity} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.55rem" }}>
            <MiniFact icon={<ShieldCheck size={16} />} title="Axis 1" body="Functional role from house-lordship" color={BLUE} />
            <MiniFact icon={<Activity size={16} />} title="Axis 2" body="Dignity-state (strong vs weak)" color={PURPLE} />
            <MiniFact icon={<Zap size={16} />} title="Result" body={INDICATION_META[indication].label} color={INDICATION_META[indication].color} />
          </div>
        </section>
      </div>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Select a graha</p>
          <h3 style={{ margin: "0.15rem 0 0", color: g ? g.color : GOLD, fontSize: "1.2rem", fontWeight: 600 }}>
            {g ? `${g.label} · ${g.devanagari}` : "Custom graha"}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
            {(Object.keys(GRAHAS) as Exclude<GrahaKey, "custom">[]).map((key) => {
              const item = GRAHAS[key];
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={graha === key}
                  onClick={() => setGraha(key)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    border: `1px solid ${graha === key ? item.color : HAIRLINE}`,
                    borderRadius: 8,
                    background: graha === key ? `${item.color}12` : "transparent",
                    color: graha === key ? item.color : INK_SECONDARY,
                    padding: "0.55rem 0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ width: 22, height: 22, borderRadius: "50%", background: item.color, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff" }}>
                    {item.short}
                  </span>
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              aria-pressed={graha === "custom"}
              onClick={() => setGraha("custom")}
              style={buttonStyle(graha === "custom", GOLD)}
            >
              Custom
            </button>
          </div>

          {g && (
            <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.85rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.55rem" }}>
                <MiniFact icon={<Layers size={16} />} title="Sign" body={`${g.sign} · ${g.dignity}`} color={BLUE} />
                <MiniFact icon={<Layers size={16} />} title="House" body={g.house} color={PURPLE} />
                <MiniFact icon={<ShieldCheck size={16} />} title="Lordship" body={g.lordship} color={GREEN} />
                <MiniFact icon={<Sparkles size={16} />} title="Aspects" body={g.aspects} color={GOLD} />
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, background: `${g.color}0F`, border: `1px solid ${g.color}44`, color: INK_SECONDARY, lineHeight: 1.5 }}>
                <span style={{ fontWeight: 600, color: g.color }}>Daśā status:</span> {g.dasha}
              </div>
            </div>
          )}

          {graha === "custom" && (
            <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
              <Panel title="Axis 1: functional role" icon={<ShieldCheck size={18} />} color={BLUE}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {(Object.keys(ROLES) as RoleKey[]).map((r) => (
                    <button key={r} type="button" aria-pressed={customRole === r} onClick={() => setCustomRole(r)} style={smallChipStyle(customRole === r, BLUE)}>
                      {ROLES[r].label}
                    </button>
                  ))}
                </div>
                <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{ROLES[customRole].detail}</p>
              </Panel>
              <Panel title="Axis 2: dignity state" icon={<Activity size={18} />} color={PURPLE}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {(Object.keys(DIGNITIES) as DignityKey[]).map((d) => (
                    <button key={d} type="button" aria-pressed={customDignity === d} onClick={() => setCustomDignity(d)} style={smallChipStyle(customDignity === d, PURPLE)}>
                      {DIGNITIES[d].label}
                    </button>
                  ))}
                </div>
                <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{DIGNITIES[customDignity].detail}</p>
              </Panel>
            </div>
          )}
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px", alignContent: "start" }}>
          <Panel title="Classification result" icon={<Zap size={18} />} color={INDICATION_META[indication].color}>
            <div
              style={{
                padding: "0.85rem",
                borderRadius: 8,
                background: `${INDICATION_META[indication].color}12`,
                border: `1px solid ${INDICATION_META[indication].color}55`,
                color: INDICATION_META[indication].color,
                fontWeight: 600,
                fontSize: "1.1rem",
              }}
            >
              {INDICATION_META[indication].label}
            </div>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{INDICATION_META[indication].detail}</p>
            {indication !== "no-action" && (
              <div style={{ marginTop: "0.65rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button type="button" aria-pressed={isDashaActive} onClick={() => g ? null : setDashaActive((v) => !v)} style={togglePanelStyle(isDashaActive, GOLD)}>
                  {isDashaActive ? <CheckCircle2 size={16} aria-hidden="true" /> : <ShieldAlert size={16} aria-hidden="true" />}
                  <span>
                    <span style={{ fontWeight: 600 }}>Daśā active</span>
                    <span> — {isDashaActive ? "This indication is currently urgent / timely." : "This indication is present but not currently pressing."}</span>
                  </span>
                </button>
              </div>
            )}
          </Panel>

          <Panel title="Reasoning chain" icon={<Layers size={18} />} color={GOLD}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              {g ? (
                <>
                  <span style={{ fontWeight: 600, color: BLUE }}>{ROLES[role].label}</span> because {g.lordship.toLowerCase()}.
                  {" "}<span style={{ fontWeight: 600, color: PURPLE }}>{DIGNITIES[dignity].label}</span> because {g.dignity.toLowerCase()} in {g.house.toLowerCase()}.
                  {" "}Result: <span style={{ fontWeight: 600, color: INDICATION_META[indication].color }}>{INDICATION_META[indication].label}</span>.
                </>
              ) : (
                <>
                  <span style={{ fontWeight: 600, color: BLUE }}>{ROLES[role].label}</span> meets{" "}
                  <span style={{ fontWeight: 600, color: PURPLE }}>{DIGNITIES[dignity].label}</span> →{" "}
                  <span style={{ fontWeight: 600, color: INDICATION_META[indication].color }}>{INDICATION_META[indication].label}</span>.
                </>
              )}
            </p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          Common reasoning mistakes
        </h3>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(COMMITMENTS) as CommitmentKey[]).map((key) => {
            const held = commitments[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setCommitments((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <span style={{ fontWeight: 600 }}>{COMMITMENTS[key].label}</span>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? COMMITMENTS[key].heldText : COMMITMENTS[key].releasedText}</span>
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
            background: allCommitmentsHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allCommitmentsHeld ? GREEN : VERMILION}55`,
            color: allCommitmentsHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allCommitmentsHeld
            ? "All discipline commitments are held. The two-axis test is being applied cleanly."
            : `${Object.keys(COMMITMENTS).length - Object.values(commitments).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
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

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
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

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
