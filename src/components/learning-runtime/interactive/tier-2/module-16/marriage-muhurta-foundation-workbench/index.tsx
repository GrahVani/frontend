"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  Crown,
  Heart,
  Info,
  RotateCcw,
  Sparkles,
  XCircle,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

type LimbStatus = "favoured" | "acceptable" | "neutral" | "avoided";
type Strength = "strong" | "mixed" | "weak";
type CriterionKey = "dignity" | "house" | "combustion" | "aspect";
type PlanetKey = "jupiter" | "venus";

interface LimbCheck {
  limb: string;
  value: string;
  status: LimbStatus;
  rule: string;
}

const LIMB_CHECKS: LimbCheck[] = [
  { limb: "Tithi", value: "Pūrṇā", status: "favoured", rule: "Pūrṇā (5/10/15) and Bhadrā (2/7/12) favoured; Riktā avoided" },
  { limb: "Vāra", value: "Wednesday", status: "acceptable", rule: "Friday most favoured; Thursday favoured; Sun/Mon/Wed acceptable; Tue/Sat avoided" },
  { limb: "Nakṣatra", value: "Rohiṇī", status: "favoured", rule: "Sthira class and Rohiṇī especially favoured; Ugra/Tīkṣṇa and Bharaṇī avoided" },
  { limb: "Yoga", value: "Sādhya", status: "neutral", rule: "Saubhāgya and Prīti favoured; Vyatīpāta and Vaidhṛti avoided" },
  { limb: "Karaṇa", value: "Bava", status: "favoured", rule: "Bava and Kaulava favoured; Viṣṭi/Bhadrā-mukha avoided; Bhadrā-puccha not a wedding exception" },
];

const CRITERIA: { key: CriterionKey; label: string }[] = [
  { key: "dignity", label: "Sign dignity" },
  { key: "house", label: "House placement" },
  { key: "combustion", label: "Non-combust" },
  { key: "aspect", label: "Aspect environment" },
];

const PLANET_DATA: Record<PlanetKey, { label: string; default: Record<CriterionKey, Strength>; details: Record<CriterionKey, string> }> = {
  jupiter: {
    label: "Jupiter",
    default: { dignity: "strong", house: "strong", combustion: "strong", aspect: "strong" },
    details: {
      dignity: "Exalted in Cancer",
      house: "9th house — trikoṇa",
      combustion: "137° from Sun; non-combust",
      aspect: "Benefic aspect environment",
    },
  },
  venus: {
    label: "Venus",
    default: { dignity: "strong", house: "weak", combustion: "strong", aspect: "mixed" },
    details: {
      dignity: "Friendly sign (Capricorn)",
      house: "3rd house — neither kendra nor trikoṇa",
      combustion: "38° from Sun; non-combust",
      aspect: "Mostly benefic, one neutral contact",
    },
  },
};

const STATUS_COLOR: Record<LimbStatus, string> = {
  favoured: GREEN,
  acceptable: BLUE,
  neutral: GOLD,
  avoided: VERMILION,
};

const STRENGTH_COLOR: Record<Strength, string> = {
  strong: GREEN,
  mixed: GOLD,
  weak: VERMILION,
};

function nextStrength(s: Strength): Strength {
  if (s === "strong") return "mixed";
  if (s === "mixed") return "weak";
  return "strong";
}

export function MarriageMuhurtaFoundationWorkbench() {
  const [jupiter, setJupiter] = useState<Record<CriterionKey, Strength>>(PLANET_DATA.jupiter.default);
  const [venus, setVenus] = useState<Record<CriterionKey, Strength>>(PLANET_DATA.venus.default);
  const [showBhadrāContrast, setShowBhadrāContrast] = useState(false);

  const jupiterWeak = useMemo(() => Object.values(jupiter).some((s) => s === "weak"), [jupiter]);
  const venusWeak = useMemo(() => Object.values(venus).some((s) => s === "weak"), [venus]);
  const gateOpen = !(jupiterWeak && venusWeak);

  const pañcāṅgaClear = LIMB_CHECKS.every((c) => c.status !== "avoided");
  const overallClear = pañcāṅgaClear && gateOpen;

  const reset = () => {
    setJupiter(PLANET_DATA.jupiter.default);
    setVenus(PLANET_DATA.venus.default);
    setShowBhadrāContrast(false);
  };

  return (
    <div data-interactive="marriage-muhurta-foundation-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Marriage muhūrta foundation workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Re-screen Candidate 3 at wedding-specific depth
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Apply the wedding-specific pañcāṅga table and the Jupiter-Venus gate. Toggle each criterion to see when the gate closes and why Candidate 3 clears this layer.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Classical source distinction</p>
        <SourceSvg />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.75rem", marginTop: "0.75rem" }}>
          <MiniFact icon={<BookOpen size={16} />} title="Muhūrta-Cintāmaṇi" body="General muhūrta compendium; Chapter 8 is its most-developed wedding chapter. Doctrine here is drawn from T1-23's own verified read." color={BLUE} />
          <MiniFact icon={<Heart size={16} />} title="Vivāha Vṛndāvana" body="Dedicated classical text for marriage muhūrta. Named as marriage-muhūrta's own dedicated authority; no verse-level claims made without independent verification." color={PURPLE} />
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Wedding-specific pañcāṅga re-screen</p>
              <h3 style={{ margin: "0.15rem 0 0", color: pañcāṅgaClear ? GREEN : VERMILION, fontSize: "1.2rem", fontWeight: 600 }}>
                {pañcāṅgaClear ? "No wedding-specific disqualification" : "Disqualification found"}
              </h3>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", color: INK_MUTED }}>
              <Info size={14} aria-hidden="true" />
              Candidate 3 · 11 Nov · Meera &amp; Arjun
            </span>
          </div>
          <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Limb</th>
                  <th style={thStyle}>Candidate value</th>
                  <th style={thStyle}>Wedding rule</th>
                  <th style={thStyle}>Result</th>
                </tr>
              </thead>
              <tbody>
                {LIMB_CHECKS.map((row) => (
                  <tr key={row.limb}>
                    <td style={tdStyle}><strong style={{ fontWeight: 600, color: INK_PRIMARY }}>{row.limb}</strong></td>
                    <td style={tdStyle}>{row.value}</td>
                    <td style={{ ...tdStyle, color: INK_SECONDARY, fontSize: "0.82rem" }}>{row.rule}</td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: 4, background: STATUS_COLOR[row.status] + "15", color: STATUS_COLOR[row.status], border: "1px solid " + STATUS_COLOR[row.status], textTransform: "capitalize" }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <GateSvg gateOpen={gateOpen} jupiterWeak={jupiterWeak} venusWeak={venusWeak} />
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Jupiter-Venus gate" icon={<Crown size={18} />} color={gateOpen ? GREEN : VERMILION}>
            <p style={bodyTextStyle}>
              Both planets must independently clear sign-dignity, house-placement, non-combustion and aspect-environment. The candidate is ruled out only when <strong style={{ fontWeight: 600 }}>both</strong> are weak together.
            </p>
            <div style={{ marginTop: "0.55rem", padding: "0.55rem", borderRadius: 6, border: "1px solid " + (gateOpen ? GREEN : VERMILION), background: (gateOpen ? GREEN : VERMILION) + "10" }}>
              <p style={{ margin: 0, color: gateOpen ? GREEN : VERMILION, fontWeight: 600 }}>
                {gateOpen ? "Gate open — candidate passes" : "Gate closed — both planets weak"}
              </p>
            </div>
          </Panel>

          <Panel title="Jupiter" icon={<Sparkles size={18} />} color={jupiterWeak ? VERMILION : GREEN}>
            <PlanetControls planet="jupiter" state={jupiter} onChange={setJupiter} />
          </Panel>

          <Panel title="Venus" icon={<Heart size={18} />} color={venusWeak ? VERMILION : GOLD}>
            <PlanetControls planet="venus" state={venus} onChange={setVenus} />
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Event-scoped exception: Bhadrā-puccha</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.65rem" }}>
          <button type="button" aria-pressed={!showBhadrāContrast} onClick={() => setShowBhadrāContrast(false)} style={smallChipStyle(!showBhadrāContrast, GOLD)}>
            Wedding view
          </button>
          <button type="button" aria-pressed={showBhadrāContrast} onClick={() => setShowBhadrāContrast(true)} style={smallChipStyle(showBhadrāContrast, VERMILION)}>
            Surgery contrast
          </button>
        </div>
        <div style={{ padding: "0.75rem", borderRadius: 8, border: "1px solid " + (showBhadrāContrast ? VERMILION : GREEN), background: (showBhadrāContrast ? VERMILION : GREEN) + "08" }}>
          <p style={{ margin: 0, color: showBhadrāContrast ? VERMILION : GREEN, fontWeight: 600 }}>
            {showBhadrāContrast ? "Bhadrā-puccha is a genuine exception for surgery" : "Bhadrā-puccha is NOT an exception for wedding"}
          </p>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
            {showBhadrāContrast
              ? "Surgery's incisive-action logic makes Bhadrā-puccha favourable there. The same logic has no bearing on marriage."
              : "For weddings, Bhadrā-puccha remains avoided. Event-type exceptions never generalise across categories."}
          </p>
        </div>
      </section>

      <section style={{ ...cardStyle, borderColor: overallClear ? `${GREEN}66` : `${VERMILION}66`, background: overallClear ? `${GREEN}0F` : `${VERMILION}0F` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          {overallClear ? <CheckCircle2 size={22} color={GREEN} aria-hidden="true" /> : <XCircle size={22} color={VERMILION} aria-hidden="true" />}
          <p style={{ margin: 0, color: overallClear ? GREEN : VERMILION, fontWeight: 600, fontSize: "1.1rem" }}>
            {overallClear ? "Candidate 3 clears the wedding-specific foundation layer" : "Candidate 3 fails the wedding-specific foundation layer"}
          </p>
        </div>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {overallClear
            ? "The pañcāṅga re-check finds no disqualification, and the Jupiter-Venus gate is open because Jupiter is unambiguously strong. This is the honest, corrected finding: the gate clears, but Venus's 3rd-house placement remains a real limitation Lesson 16.2.4 will revisit."
            : "At least one disqualifying condition is active. In the default state only the gate can close this layer; try weakening Jupiter to see the gate fail when both planets become weak."}
        </p>
      </section>
    </div>
  );
}

function PlanetControls({
  planet,
  state,
  onChange,
}: {
  planet: PlanetKey;
  state: Record<CriterionKey, Strength>;
  onChange: (value: Record<CriterionKey, Strength>) => void;
}) {
  const data = PLANET_DATA[planet];
  return (
    <div style={{ display: "grid", gap: "0.55rem" }}>
      {CRITERIA.map((c) => {
        const strength = state[c.key];
        const color = STRENGTH_COLOR[strength];
        return (
          <button
            key={c.key}
            type="button"
            onClick={() => onChange({ ...state, [c.key]: nextStrength(strength) })}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: "0.5rem",
              alignItems: "center",
              textAlign: "left",
              border: `1px solid ${color}`,
              borderRadius: 8,
              background: color + "10",
              padding: "0.55rem 0.7rem",
              cursor: "pointer",
            }}
          >
            <span style={{ color: INK_PRIMARY }}>
              <span style={{ display: "block", fontSize: "0.78rem", color: INK_MUTED, fontWeight: 700, textTransform: "uppercase" }}>{c.label}</span>
              <span style={{ display: "block", fontSize: "0.85rem", color: INK_SECONDARY, marginTop: 2 }}>{data.details[c.key]}</span>
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.15rem 0.45rem", borderRadius: 4, background: color + "20", color, border: "1px solid " + color, textTransform: "capitalize" }}>
              {strength}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function SourceSvg() {
  return (
    <svg viewBox="0 0 640 160" role="img" aria-label="Classical source distinction for marriage muhurta" style={{ width: "100%", maxHeight: 180, display: "block" }}>
      <rect x="30" y="30" width="280" height="100" rx="8" fill={`${BLUE}10`} stroke={BLUE} strokeWidth="2" />
      <text x="170" y="60" textAnchor="middle" fill={BLUE} fontSize="14" fontWeight={700}>Muhūrta-Cintāmaṇi</text>
      <text x="170" y="82" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>General muhūrta compendium</text>
      <text x="170" y="102" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Chapter 8 = wedding-specific depth</text>

      <rect x="330" y="30" width="280" height="100" rx="8" fill={`${PURPLE}10`} stroke={PURPLE} strokeWidth="2" />
      <text x="470" y="60" textAnchor="middle" fill={PURPLE} fontSize="14" fontWeight={700}>Vivāha Vṛndāvana</text>
      <text x="470" y="82" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>Dedicated marriage-muhūrta text</text>
      <text x="470" y="102" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Named as dedicated authority</text>

      <path d="M 310 80 L 330 80" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 4" />
      <text x="320" y="122" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Both inform the tradition</text>
    </svg>
  );
}

function GateSvg({ gateOpen, jupiterWeak, venusWeak }: { gateOpen: boolean; jupiterWeak: boolean; venusWeak: boolean }) {
  return (
    <svg viewBox="0 0 640 220" role="img" aria-label="Jupiter Venus gate" style={{ width: "100%", maxHeight: 240, marginTop: "0.85rem", display: "block" }}>
      <rect x="20" y="30" width="280" height="140" rx="8" fill={jupiterWeak ? `${VERMILION}10` : `${GREEN}10`} stroke={jupiterWeak ? VERMILION : GREEN} strokeWidth="2" />
      <text x="160" y="60" textAnchor="middle" fill={jupiterWeak ? VERMILION : GREEN} fontSize="14" fontWeight={700}>Jupiter</text>
      <text x="160" y="85" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>Exalted · 9th house · Non-combust</text>
      <text x="160" y="108" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>{jupiterWeak ? "At least one criterion weak" : "All criteria strong"}</text>
      {jupiterWeak && <AlertTriangleIcon x={160} y={140} />}

      <rect x="340" y="30" width="280" height="140" rx="8" fill={venusWeak ? `${VERMILION}10` : `${GOLD}10`} stroke={venusWeak ? VERMILION : GOLD} strokeWidth="2" />
      <text x="480" y="60" textAnchor="middle" fill={venusWeak ? VERMILION : GOLD} fontSize="14" fontWeight={700}>Venus</text>
      <text x="480" y="85" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>Friendly sign · 3rd house · Non-combust</text>
      <text x="480" y="108" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight={600}>{venusWeak ? "At least one criterion weak" : "No disqualifying weakness"}</text>
      {venusWeak && <AlertTriangleIcon x={480} y={140} />}

      <path d="M 300 100 L 340 100" stroke={gateOpen ? GREEN : VERMILION} strokeWidth={gateOpen ? 5 : 3} />
      <rect x="270" y="80" width="60" height="40" rx={6} fill={gateOpen ? GREEN : VERMILION} />
      <text x="300" y="105" textAnchor="middle" fill="#fff" fontSize="11" fontWeight={700}>{gateOpen ? "OPEN" : "CLOSED"}</text>
      <text x="300" y="145" textAnchor="middle" fill={gateOpen ? GREEN : VERMILION} fontSize="12" fontWeight={700}>{gateOpen ? "Both not weak together" : "Both planets weak"}</text>
    </svg>
  );
}

function AlertTriangleIcon({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x - 10} ${y})`}>
      <polygon points="10,0 20,18 0,18" fill={VERMILION} />
      <text x="10" y="14" textAnchor="middle" fill="#fff" fontSize="10" fontWeight={700}>!</text>
    </g>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35, fontSize: "0.85rem" }}>{body}</p>
    </div>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8, background: active ? color : "transparent", color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem", fontWeight: 600, cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY, padding: "0.48rem 0.68rem", fontWeight: 600, cursor: "pointer",
  };
}

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" };
const bodyTextStyle: CSSProperties = { margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" };

const thStyle: CSSProperties = { textAlign: "left", padding: "0.55rem 0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" };
const tdStyle: CSSProperties = { padding: "0.55rem 0.45rem", borderBottom: `1px solid ${HAIRLINE}`, verticalAlign: "top" };
