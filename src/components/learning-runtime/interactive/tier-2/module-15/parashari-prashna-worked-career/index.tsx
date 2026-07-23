"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Gem,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  Timer,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type KarakaMode = "saturn" | "sun";
type JupiterMode = "enemy" | "friendly";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const GOLD = "#B88421";
const VERMILION = "var(--gl-vermilion-accent)";

const HOUSES = [
  { house: 1, sign: "Sag", planets: "Ketu" },
  { house: 2, sign: "Cap", planets: "Mars, Saturn" },
  { house: 3, sign: "Aqu", planets: "" },
  { house: 4, sign: "Pis", planets: "" },
  { house: 5, sign: "Ari", planets: "" },
  { house: 6, sign: "Tau", planets: "" },
  { house: 7, sign: "Gem", planets: "Rahu" },
  { house: 8, sign: "Can", planets: "Moon" },
  { house: 9, sign: "Leo", planets: "" },
  { house: 10, sign: "Vir", planets: "Mercury, Jupiter" },
  { house: 11, sign: "Lib", planets: "Venus" },
  { house: 12, sign: "Sco", planets: "Sun" },
];

export function ParashariPrashnaWorkedCareer() {
  const [karakaMode, setKarakaMode] = useState<KarakaMode>("saturn");
  const [jupiterMode, setJupiterMode] = useState<JupiterMode>("enemy");
  const [nameCaveat, setNameCaveat] = useState(true);
  const [neutralKetu, setNeutralKetu] = useState(true);
  const [showVenusWindow, setShowVenusWindow] = useState(true);
  const [noPlainYes, setNoPlainYes] = useState(true);

  const government = karakaMode === "sun";
  const jupiterClean = jupiterMode === "friendly";
  const ready = nameCaveat && neutralKetu && showVenusWindow && noPlainYes;

  const verdict = useMemo(() => {
    if (government) return "Primary tier becomes mixed: Mercury stays strong, but Sun in the 12th complicates the government-post variant.";
    if (jupiterClean) return "Favourable with a cleaner secondary tier: Mercury and Saturn agree, and Jupiter no longer supplies the main caveat.";
    return "Favourable with caveat: Mercury and Saturn give a strong foundation; Jupiter in enemy sign names the complication.";
  }, [government, jupiterClean]);

  const feedback = useMemo(() => {
    if (!nameCaveat) return "Repair: do not hide Jupiter's enemy-sign weakness. It is the named secondary caveat.";
    if (!neutralKetu) return "Repair: Saturn-Ketu is timing-neutral here, not a forced positive or negative signal.";
    if (!showVenusWindow) return "Repair: Saturn-Venus is the clearer support window because Venus is strong in the 11th.";
    if (!noPlainYes) return "Repair: this is favourable-with-caveat, not a flat yes.";
    return verdict;
  }, [nameCaveat, neutralKetu, noPlainYes, showVenusWindow, verdict]);

  return (
    <div data-interactive="parashari-prashna-worked-career" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "start" }}>
          <div>
            <p style={eyebrowStyle}>Worked Parashari prashna career case</p>
            <h2 style={headingStyle}>Strong 10th foundation, one named complication, timing opens after Ketu</h2>
            <p style={bodyStyle}>
              Rebuild the Sagittarius-lagna chart and test how karaka choice, Jupiter dignity, and dasha timing change the final professional wording.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setKarakaMode("saturn");
              setJupiterMode("enemy");
              setNameCaveat(true);
              setNeutralKetu(true);
              setShowVenusWindow(true);
              setNoPlainYes(true);
            }}
            style={softButtonStyle}
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 620px" }}>
          <p style={eyebrowStyle}>Sagittarius lagna whole-sign chart</p>
          <ChartDiagram karakaMode={karakaMode} jupiterMode={jupiterMode} />
        </section>

        <section style={{ ...cardStyle, flex: "1 1 320px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: government ? VERMILION : GREEN }}>
            {government ? <Sun size={16} /> : <BriefcaseBusiness size={16} />}
            <p style={eyebrowStyle}>{government ? "Government post variant" : "General service question"}</p>
          </div>
          <h3 style={panelTitleStyle}>{government ? "Mercury strong; Sun mixed" : "Mercury strong; Saturn strong"}</h3>
          <p style={bodyStyle}>{verdict}</p>
          <div style={{ ...noticeStyle(government ? VERMILION : GREEN), marginTop: "1rem" }}>
            <Gem size={18} />
            <span>{government ? "Sun in friendly Scorpio helps, but the 12th house makes the karaka line mixed." : "Saturn in own Capricorn supports the general service karaka line."}</span>
          </div>
        </section>
      </div>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Five-line evidence</p>
          <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.85rem" }}>
            <EvidenceRow label="1 House-lord Mercury" state="Strongly favourable" body="18 Virgo: moolatrikona, occupying the 10th itself." color={GREEN} />
            <EvidenceRow label="2 10th occupants" state={jupiterClean ? "Favourable" : "Mixed caveat"} body={jupiterClean ? "Jupiter's dignity is repaired in this toggle mode." : "Jupiter is benefic by nature, weakened by enemy-sign Virgo."} color={jupiterClean ? GREEN : GOLD} />
            <EvidenceRow label="3 Aspects on 10th" state="Absent" body="No graha drishti lands on the 10th; absence is reported honestly." color={GOLD} />
            <EvidenceRow label="4 Karaka" state={government ? "Mixed" : "Favourable"} body={government ? "Sun: friendly sign, but 12th-house placement." : "Saturn: own sign Capricorn in the 2nd."} color={government ? GOLD : GREEN} />
            <EvidenceRow label="5 Dasha timing" state="Later support" body="Saturn-Ketu is quiet; Saturn-Venus activates strong 11th-house Venus." color={BLUE} />
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Sensitivity switches</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.85rem" }}>
            <button type="button" onClick={() => setKarakaMode("saturn")} aria-pressed={karakaMode === "saturn"} style={choiceButtonStyle(karakaMode === "saturn", GREEN)}>
              <BriefcaseBusiness size={16} />
              <span><span style={{ display: "block", fontWeight: 500 }}>General position: Saturn</span><span style={smallTextStyle}>Keeps the primary tier cleanly favourable.</span></span>
            </button>
            <button type="button" onClick={() => setKarakaMode("sun")} aria-pressed={karakaMode === "sun"} style={choiceButtonStyle(karakaMode === "sun", VERMILION)}>
              <Sun size={16} />
              <span><span style={{ display: "block", fontWeight: 500 }}>Government post: Sun</span><span style={smallTextStyle}>Changes the karaka line to mixed.</span></span>
            </button>
            <button type="button" onClick={() => setJupiterMode(jupiterClean ? "enemy" : "friendly")} style={choiceButtonStyle(jupiterClean, BLUE)}>
              <Sparkles size={16} />
              <span><span style={{ display: "block", fontWeight: 500 }}>Toggle Jupiter dignity</span><span style={smallTextStyle}>{jupiterClean ? "Friendly mode: caveat reduced." : "Enemy Virgo: caveat visible."}</span></span>
            </button>
          </div>
        </div>
      </section>

      <section style={twoColumnStyle}>
        <div style={cardStyle}>
          <p style={eyebrowStyle}>Timing window</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.85rem" }}>
            <TimelineRow title="Now: Saturn-Ketu" body="1.9 months remaining; Ketu is neither house-lord nor karaka, so timing is quiet." color={GOLD} icon={<Timer size={16} />} />
            <TimelineRow title="Next: Saturn-Venus" body="Roughly 38 months; Venus is own sign in the 11th, a supporting house." color={BLUE} icon={<Clock3 size={16} />} />
            <TimelineRow title="Mahadasha frame" body="Saturn remains the broader karaka-period container." color={GREEN} icon={<BadgeCheck size={16} />} />
          </div>
        </div>

        <div style={cardStyle}>
          <p style={eyebrowStyle}>Professional wording safeguards</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.8rem" }}>
            <ToggleRow checked={nameCaveat} onChange={setNameCaveat} label="Name Jupiter's caveat" body="Benefic nature is weakened by enemy-sign dignity." icon={<AlertTriangle size={16} />} />
            <ToggleRow checked={neutralKetu} onChange={setNeutralKetu} label="Keep Saturn-Ketu neutral" body="Do not force the shadow sub-period into a yes/no signal." icon={<ShieldCheck size={16} />} />
            <ToggleRow checked={showVenusWindow} onChange={setShowVenusWindow} label="Show Saturn-Venus opening" body="A strong 11th-house occupant becomes dasha-active." icon={<Clock3 size={16} />} />
            <ToggleRow checked={noPlainYes} onChange={setNoPlainYes} label="Do not flatten to plain yes" body="Report favourable foundation, complication, and timing shape." icon={<BadgeCheck size={16} />} />
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          {ready ? <BadgeCheck size={22} color={GREEN} /> : <AlertTriangle size={22} color={VERMILION} />}
          <div>
            <p style={eyebrowStyle}>Complete worked verdict</p>
            <h3 style={{ ...panelTitleStyle, color: ready ? GREEN : VERMILION }}>{ready ? "Favourable with caveat, strengthening after the current sub-period" : "Repair the worked-case reporting"}</h3>
            <p style={bodyStyle}>{feedback}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ParashariPrashnaWorkedCareer;

function ChartDiagram({ karakaMode, jupiterMode }: { karakaMode: KarakaMode; jupiterMode: JupiterMode }) {
  return (
    <svg viewBox="0 0 820 470" role="img" aria-label="Worked Parashari prashna career chart diagram" style={{ width: "100%", minHeight: 370, marginTop: "0.85rem" }}>
      <rect x="10" y="10" width="800" height="450" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <text x="410" y="44" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="500">Career question: Sagittarius lagna, 10th house Virgo</text>
      {HOUSES.map((item, index) => {
        const x = 70 + (index % 6) * 113;
        const y = 78 + Math.floor(index / 6) * 92;
        const isCareer = item.house === 10;
        const isSupport = [6, 10, 11].includes(item.house);
        const isNegate = [5, 9, 12].includes(item.house);
        const stroke = isCareer ? GREEN : isSupport ? BLUE : isNegate ? VERMILION : HAIRLINE;
        const fill = isCareer ? softFill(GREEN) : isSupport ? softFill(BLUE) : isNegate ? softFill(VERMILION) : "#FFFFFF";
        return (
          <g key={item.house}>
            <rect x={x} y={y} width="88" height="62" rx="8" fill={fill} stroke={stroke} strokeWidth={isCareer ? 1.8 : 1.1} />
            <text x={x + 44} y={y + 19} textAnchor="middle" fill={INK_PRIMARY} fontSize="10.5" fontWeight="500">H{item.house} {item.sign}</text>
            <text x={x + 44} y={y + 39} textAnchor="middle" fill={item.planets ? INK_SECONDARY : INK_MUTED} fontSize="8.8">{item.planets || "empty"}</text>
          </g>
        );
      })}
      <CasePill x={98} y={300} label="Primary lord" value="Mercury strong" color={GREEN} />
      <CasePill x={274} y={300} label="Karaka" value={karakaMode === "saturn" ? "Saturn strong" : "Sun mixed"} color={karakaMode === "saturn" ? GREEN : GOLD} />
      <CasePill x={450} y={300} label="Secondary caveat" value={jupiterMode === "enemy" ? "Jupiter weak" : "Jupiter repaired"} color={jupiterMode === "enemy" ? GOLD : GREEN} />
      <CasePill x={626} y={300} label="Timing" value="Saturn-Venus" color={BLUE} />
      <path d="M142 266 C250 248, 570 248, 680 266" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="6 7" />
      <rect x="222" y="400" width="376" height="34" rx="8" fill="#F7F0E1" stroke={GOLD} strokeWidth="1.2" />
      <text x="410" y="422" textAnchor="middle" fill={GOLD} fontSize="11.5" fontWeight="500">Do not compress texture into a flat yes</text>
    </svg>
  );
}

function CasePill({ x, y, label, value, color }: { x: number; y: number; label: string; value: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width="132" height="66" rx="8" fill={softFill(color)} stroke={color} />
      <text x={x + 66} y={y + 24} textAnchor="middle" fill={color} fontSize="10.5" fontWeight="500">{label}</text>
      <text x={x + 66} y={y + 44} textAnchor="middle" fill={INK_MUTED} fontSize="9.2">{value}</text>
    </g>
  );
}

function EvidenceRow({ label, state, body, color }: { label: string; state: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, background: softFill(color), padding: "0.7rem" }}>
      <p style={{ margin: 0, color, fontSize: "0.84rem", fontWeight: 500 }}>{label}: {state}</p>
      <p style={{ ...smallTextStyle, margin: "0.25rem 0 0" }}>{body}</p>
    </div>
  );
}

function TimelineRow({ title, body, color, icon }: { title: string; body: string; color: string; icon: ReactNode }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: 8, background: softFill(color), padding: "0.75rem", display: "flex", gap: "0.6rem", alignItems: "start" }}>
      <span style={{ color }}>{icon}</span>
      <span>
        <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{title}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
    </div>
  );
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? ACCENT : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={{ marginLeft: "auto", accentColor: ACCENT }} />
    </label>
  );
}

function softFill(color: string) {
  if (color.startsWith("#")) return `${color}18`;
  return "rgba(184, 132, 33, 0.12)";
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-card-shadow-soft)",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  fontSize: "0.76rem",
  fontWeight: 600,
  letterSpacing: 0,
  textTransform: "uppercase",
};

const headingStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.35rem",
  fontWeight: 600,
  lineHeight: 1.25,
};

const panelTitleStyle: CSSProperties = {
  margin: "0.25rem 0 0",
  color: INK_PRIMARY,
  fontSize: "1.05rem",
  fontWeight: 600,
  lineHeight: 1.3,
};

const bodyStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  maxWidth: 920,
};

const smallTextStyle: CSSProperties = {
  color: INK_MUTED,
  fontSize: "0.82rem",
  lineHeight: 1.45,
};

const softButtonStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "#FFFFFF",
  color: INK_SECONDARY,
  padding: "0.55rem 0.8rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  cursor: "pointer",
  fontWeight: 500,
};

function choiceButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? softFill(color) : "#FFFFFF",
    color: active ? color : INK_SECONDARY,
    padding: "0.7rem",
    cursor: "pointer",
    display: "flex",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? ACCENT : HAIRLINE}`,
    borderRadius: 8,
    background: checked ? "#F7F0E1" : "#FFFFFF",
    padding: "0.7rem",
    display: "flex",
    gap: "0.65rem",
    alignItems: "center",
    cursor: "pointer",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}`,
    borderRadius: 8,
    background: softFill(color),
    color,
    padding: "0.75rem",
    display: "flex",
    alignItems: "start",
    gap: "0.55rem",
    lineHeight: 1.45,
    fontSize: "0.9rem",
  };
}

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1rem",
};
