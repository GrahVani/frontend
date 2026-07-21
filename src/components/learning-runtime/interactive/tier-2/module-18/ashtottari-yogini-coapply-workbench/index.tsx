"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Scale,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TriggerVersion = "A" | "B";
type MistakeKey = "preferTrigger" | "yoginiCondition" | "exactAge";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const AMBER = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const ASHTOTTARI = [
  { key: "sun", label: "Sun", years: 6, color: VERMILION },
  { key: "moon", label: "Moon", years: 15, color: BLUE },
  { key: "mars", label: "Mars", years: 8, color: VERMILION },
  { key: "mercury", label: "Mercury", years: 17, color: GREEN },
  { key: "saturn", label: "Saturn", years: 10, color: PURPLE },
  { key: "jupiter", label: "Jupiter", years: 19, color: GREEN },
  { key: "rahu", label: "Rāhu", years: 12, color: PURPLE },
  { key: "venus", label: "Venus", years: 21, color: GOLD },
];

const YOGINIS = [
  { key: "mangala", label: "Maṅgalā", planet: "Moon", years: 1, color: BLUE },
  { key: "pingala", label: "Piṅgalā", planet: "Sun", years: 2, color: VERMILION },
  { key: "dhanya", label: "Dhanyā", planet: "Jupiter", years: 3, color: GREEN },
  { key: "bhramari", label: "Bhrāmari", planet: "Mars", years: 4, color: VERMILION },
  { key: "bhadrika", label: "Bhadrikā", planet: "Mercury", years: 5, color: GREEN },
  { key: "ulka", label: "Ulkā", planet: "Saturn", years: 6, color: PURPLE },
  { key: "siddha", label: "Siddhā", planet: "Venus", years: 7, color: GOLD },
  { key: "sankata", label: "Saṅkaṭā", planet: "Rāhu", years: 8, color: PURPLE },
];

const NAKSHATRAS = [
  "Aśvinī", "Bharaṇī", "Kṛttikā", "Rohiṇī", "Mṛgaśīrṣa", "Ārdrā", "Punarvasu", "Puṣya", "Āśleṣā",
  "Maghā", "Pūrvaphālgunī", "Uttaraphālgunī", "Hasta", "Citrā", "Svātī", "Viśākhā", "Anurādhā", "Jyeṣṭhā",
  "Mūla", "Pūrvāṣāḍhā", "Uttarāṣāḍhā", "Śravaṇa", "Dhaniṣṭhā", "Śatabhiṣaj", "Pūrvabhādrapadā", "Uttarabhādrapadā", "Revatī",
];

const MISTAKES: Record<MistakeKey, { label: string; heldText: string; releasedText: string }> = {
  preferTrigger: {
    label: "Do not prefer Version B just because it triggers",
    heldText: "Held: the dispute is reported honestly; neither reading is adopted for convenience.",
    releasedText: "Warning: choosing the reading that gives a usable answer hides the genuine textual variance.",
  },
  yoginiCondition: {
    label: "Do not invent an applicability condition for Yoginī",
    heldText: "Held: Yoginī is condition-free and can be consulted freely as a supplement.",
    releasedText: "Warning: Yoginī has no gating condition; analogy with Aṣṭottarī is over-generalisation.",
  },
  exactAge: {
    label: "Do not compute an exact age-timeline beyond the verified rule",
    heldText: "Held: the module stops at selection depth; exact birth-balance is a disclosed scope limit.",
    releasedText: "Warning: the proportional-remaining rule is not supplied by T1-10 10.5.2/10.5.3; inventing it would exceed the declared depth.",
  },
};

export function AshtottariYoginiCoapplyWorkbench() {
  const [triggerVersion, setTriggerVersion] = useState<TriggerVersion>("A");
  const [selectedNakshatra, setSelectedNakshatra] = useState<number>(18); // 0-based index; Mūla = 19
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    preferTrigger: true,
    yoginiCondition: true,
    exactAge: true,
  });

  const kavyaResult = triggerVersion === "A"
    ? { triggers: false, reason: "Rāhu is in the 12th from Lagna, not a kendra." }
    : { triggers: true, reason: "Rāhu is 7 signs from the Lagna-lord Moon, a kendra/trikoṇa relation." };

  const yoginiIndex = useMemo(() => {
    const n = selectedNakshatra + 1; // 1-based nakṣatra number
    const raw = (n + 3) % 8;
    return raw === 0 ? 7 : raw - 1; // 0-based Yoginī index
  }, [selectedNakshatra]);
  const activeYogini = YOGINIS[yoginiIndex];

  const allHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setTriggerVersion("A");
    setSelectedNakshatra(18);
    setMistakes({ preferTrigger: true, yoginiCondition: true, exactAge: true });
  }

  return (
    <div data-interactive="ashtottari-yogini-coapply-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Aṣṭottarī–Yoginī co-apply</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Two verified structures, one honest dispute, one freely available supplement
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Aṣṭottarī is condition-gated and genuinely disputed; Yoginī is condition-free. Both are held at the module’s selection-criteria depth and used alongside Vimśottarī.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Aṣṭottarī trigger for Kavya</p>
          <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
            Which reading of the Rāhu-relation condition applies?
          </h3>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              aria-pressed={triggerVersion === "A"}
              onClick={() => setTriggerVersion("A")}
              style={buttonStyle(triggerVersion === "A", BLUE)}
            >
              Version A: Rāhu in kendra from Lagna
            </button>
            <button
              type="button"
              aria-pressed={triggerVersion === "B"}
              onClick={() => setTriggerVersion("B")}
              style={buttonStyle(triggerVersion === "B", PURPLE)}
            >
              Version B: Rāhu in kendra/trikoṇa from Lagna-lord
            </button>
          </div>
          <TriggerMapSvg version={triggerVersion} />
          <div
            style={{
              marginTop: "0.75rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${kavyaResult.triggers ? GREEN : VERMILION}55`,
              background: kavyaResult.triggers ? `${GREEN}12` : `${VERMILION}12`,
              color: kavyaResult.triggers ? GREEN : VERMILION,
            }}
          >
            <strong style={{ fontWeight: 600 }}>{kavyaResult.triggers ? "Triggers" : "Does not trigger"}</strong>
            <span> — {kavyaResult.reason}</span>
          </div>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {triggerVersion === "A"
              ? "Version A removes Aṣṭottarī from candidacy for Kavya. Report this result honestly; do not jump to Version B for convenience."
              : "Version B makes Aṣṭottarī a candidate for Kavya. This does not resolve the dispute; it simply reports what this reading says."}
          </p>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 300px" }}>
          <Panel title="Aṣṭottarī structure" icon={<Scale size={18} />} color={AMBER}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
              108-year cycle across 8 planets (Ketu excluded). The name itself encodes 108 = 27 nakṣatras × 4 pādas.
            </p>
            <AshtottariCycleSvg />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 90px), 1fr))", gap: "0.5rem", marginTop: "0.65rem" }}>
              {ASHTOTTARI.map((p) => (
                <div key={p.key} style={{ border: `1px solid ${p.color}44`, borderRadius: 8, padding: "0.55rem", background: `${p.color}0F` }}>
                  <div style={{ color: p.color, fontWeight: 600 }}>{p.label}</div>
                  <div style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>{p.years}y</div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Yoginī structure and starting point</p>
        <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
          No applicability condition — choose a Janma-nakṣatra to see the starting Yoginī
        </h3>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          <label htmlFor="nakshatra-select" style={{ color: INK_SECONDARY }}>Janma-nakṣatra:</label>
          <select
            id="nakshatra-select"
            value={selectedNakshatra}
            onChange={(e) => setSelectedNakshatra(Number(e.target.value))}
            style={{
              background: SURFACE,
              color: INK_PRIMARY,
              border: `1px solid ${HAIRLINE}`,
              borderRadius: 8,
              padding: "0.45rem 0.75rem",
              fontWeight: 600,
            }}
          >
            {NAKSHATRAS.map((name, idx) => (
              <option key={name} value={idx}>{idx + 1}. {name}</option>
            ))}
          </select>
          <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>(Kavya: Mūla, 19)</span>
        </div>
        <YoginiRingSvg activeIndex={yoginiIndex} />
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.75rem",
            borderRadius: 8,
            border: `1px solid ${activeYogini.color}55`,
            background: `${activeYogini.color}12`,
            color: activeYogini.color,
          }}
        >
          <strong style={{ fontWeight: 600 }}>
            ({selectedNakshatra + 1} + 3) mod 8 = {yoginiIndex + 1}
          </strong>
          <span> — starting Yoginī is <strong style={{ fontWeight: 600 }}>{activeYogini.label}</strong> ({activeYogini.planet}, {activeYogini.years} years).</span>
        </div>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Because Yoginī carries no special applicability condition, Kavya’s Ulkā/Saturn/6-year period is simply available as a supplement — no gating check is required.
        </p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Co-application with Vimśottarī</p>
        <DepthComparisonSvg />
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Vimśottarī supplies the exact birth-balance calculation; Aṣṭottarī and Yoginī do not in the T1-10 sources used here. The module therefore reports Aṣṭottarī’s candidacy and Yoginī’s starting period without inventing a precise age-timeline.
        </p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const held = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={held}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !held }))}
                style={togglePanelStyle(held, held ? GREEN : VERMILION)}
              >
                {held ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 600 }}>{MISTAKES[key].label}</strong>
                  <span style={{ color: held ? INK_SECONDARY : VERMILION }}> — {held ? MISTAKES[key].heldText : MISTAKES[key].releasedText}</span>
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
            background: allHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allHeld ? GREEN : VERMILION}55`,
            color: allHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allHeld
            ? "All discipline commitments are held. The co-application stays within the module’s selection-criteria depth."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function TriggerMapSvg({ version }: { version: TriggerVersion }) {
  // Simplified 12-house wheel. Lagna at top (house 1), Moon in 6th, Rahu in 12th.
  const cx = 280;
  const cy = 150;
  const r = 110;
  const labelR = 86;
  const houses = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    return { x: cx + labelR * Math.cos(angle), y: cy + labelR * Math.sin(angle), label: i + 1 };
  });

  const lagnaPos = houses[0];
  const moonPos = houses[5];
  const rahuPos = houses[11];

  return (
    <svg viewBox="0 0 560 320" role="img" aria-label="Kavya trigger condition house map" style={{ width: "100%", maxHeight: 320, margin: "0.65rem auto 0.25rem", display: "block" }}>
      <circle cx={cx} cy={cy} r={r} fill="transparent" stroke={HAIRLINE} strokeWidth="1.5" />
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke={HAIRLINE} strokeWidth="1" />;
      })}
      {houses.map((h) => (
        <text key={h.label} x={h.x} y={h.y + 4} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>{h.label}</text>
      ))}

      {/* Lagna marker */}
      <circle cx={lagnaPos.x} cy={lagnaPos.y - 22} r={16} fill={`${BLUE}18`} stroke={BLUE} strokeWidth="2" />
      <text x={lagnaPos.x} y={lagnaPos.y - 18} textAnchor="middle" fill={BLUE} fontSize="11" fontWeight={600}>Lg</text>

      {/* Moon marker */}
      <circle cx={moonPos.x} cy={moonPos.y + 22} r={16} fill={`${BLUE}18`} stroke={BLUE} strokeWidth="2" />
      <text x={moonPos.x} y={moonPos.y + 26} textAnchor="middle" fill={BLUE} fontSize="11" fontWeight={600}>Mo</text>

      {/* Rahu marker */}
      <circle cx={rahuPos.x} cy={rahuPos.y - 22} r={16} fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth="2" />
      <text x={rahuPos.x} y={rahuPos.y - 18} textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight={600}>Ra</text>

      {version === "A" ? (
        <>
          {/* Kendra set from Lagna: houses 1,4,7,10 */}
          {[0, 3, 6, 9].map((i) => {
            const h = houses[i];
            const dx = h.x - cx;
            const dy = h.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nx = cx + (r + 14) * (dx / dist);
            const ny = cy + (r + 14) * (dy / dist);
            return <circle key={i} cx={nx} cy={ny} r={6} fill={GREEN} />;
          })}
          <line x1={lagnaPos.x} y1={lagnaPos.y - 38} x2={rahuPos.x} y2={rahuPos.y - 38} stroke={VERMILION} strokeWidth="3" strokeDasharray="6 4" />
          <text x={cx} y={cy + r + 34} textAnchor="middle" fill={VERMILION} fontSize="13" fontWeight={600}>Rāhu is not in a kendra from Lagna</text>
        </>
      ) : (
        <>
          {/* Kendra/trikona set from Moon: 1st,4th,5th,7th,9th,10th relative to Moon */}
          {[0, 3, 4, 6, 8, 9].map((offset) => {
            const idx = (5 + offset) % 12;
            const h = houses[idx];
            const dx = h.x - moonPos.x;
            const dy = h.y - moonPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const nx = moonPos.x + (labelR - 14) * (dx / dist);
            const ny = moonPos.y + (labelR - 14) * (dy / dist);
            return <circle key={offset} cx={nx} cy={ny} r={6} fill={GREEN} />;
          })}
          <path d={`M ${moonPos.x} ${moonPos.y + 22} Q ${(moonPos.x + rahuPos.x) / 2} ${cy + 80} ${rahuPos.x} ${rahuPos.y - 38}`} fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" />
          <text x={cx} y={cy + r + 34} textAnchor="middle" fill={GREEN} fontSize="13" fontWeight={600}>Rāhu is 7 signs from Moon — kendra/trikoṇa relation</text>
        </>
      )}
    </svg>
  );
}

function AshtottariCycleSvg() {
  const cx = 140;
  const cy = 105;
  const r = 78;
  return (
    <svg viewBox="0 0 280 210" role="img" aria-label="Ashtottari 108 year planetary cycle" style={{ width: "100%", maxHeight: 210, margin: "0.55rem auto 0", display: "block" }}>
      <circle cx={cx} cy={cy} r={r} fill={`${GOLD}0A`} stroke={HAIRLINE} strokeWidth="1.5" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={GOLD} fontSize="18" fontWeight={600}>108</text>
      {ASHTOTTARI.map((p, i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        return (
          <g key={p.key}>
            <circle cx={x} cy={y} r={20} fill={`${p.color}12`} stroke={p.color} strokeWidth="2" />
            <text x={x} y={y - 2} textAnchor="middle" fill={p.color} fontSize="10" fontWeight={600}>{p.label}</text>
            <text x={x} y={y + 10} textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight={600}>{p.years}</text>
          </g>
        );
      })}
      <text x={cx} y={200} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Sun→Moon→Mars→Mercury→Saturn→Jupiter→Rāhu→Venus</text>
    </svg>
  );
}

function YoginiRingSvg({ activeIndex }: { activeIndex: number }) {
  const cx = 280;
  const cy = 150;
  const r = 110;
  return (
    <svg viewBox="0 0 560 300" role="img" aria-label="Yogini 36 year cycle" style={{ width: "100%", maxHeight: 300, margin: "0.65rem auto 0.25rem", display: "block" }}>
      <circle cx={cx} cy={cy} r={r} fill="transparent" stroke={HAIRLINE} strokeWidth="1.5" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={GOLD} fontSize="18" fontWeight={600}>36</text>
      {YOGINIS.map((y, i) => {
        const angle = (i * 45 - 90) * (Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const yp = cy + r * Math.sin(angle);
        const active = i === activeIndex;
        return (
          <g key={y.key}>
            <circle cx={x} cy={yp} r={active ? 32 : 26} fill={active ? `${y.color}20` : `${y.color}0F`} stroke={y.color} strokeWidth={active ? 3 : 2} />
            <text x={x} y={yp - 4} textAnchor="middle" fill={y.color} fontSize={active ? 12 : 10} fontWeight={600}>{y.label}</text>
            <text x={x} y={yp + 9} textAnchor="middle" fill={INK_SECONDARY} fontSize={active ? 11 : 9} fontWeight={600}>{y.planet} {y.years}y</text>
          </g>
        );
      })}
    </svg>
  );
}

function DepthComparisonSvg() {
  const lanes = [
    { label: "Vimśottarī", total: 120, computed: "Full birth-balance & age-timeline", color: BLUE, stopAt: 100 },
    { label: "Aṣṭottarī", total: 108, computed: "Candidacy only (selection depth)", color: AMBER, stopAt: 35 },
    { label: "Yoginī", total: 36, computed: "Starting period only (selection depth)", color: GREEN, stopAt: 25 },
  ];
  const max = 120;
  return (
    <svg viewBox="0 0 560 220" role="img" aria-label="Depth comparison of Vimshottari, Ashtottari and Yogini" style={{ width: "100%", maxHeight: 220, margin: "0.55rem auto 0.25rem", display: "block" }}>
      {lanes.map((lane, i) => {
        const y = 45 + i * 60;
        const w = (lane.total / max) * 480;
        const stopW = (lane.stopAt / max) * 480;
        return (
          <g key={lane.label}>
            <text x="20" y={y + 20} fill={INK_PRIMARY} fontSize="13" fontWeight={600}>{lane.label}</text>
            <rect x="100" y={y} width={w} height="28" rx="6" fill={`${lane.color}12`} stroke={lane.color} strokeWidth="1.5" />
            <rect x="100" y={y} width={stopW} height="28" rx="6" fill={`${lane.color}30`} />
            <text x={100 + w + 10} y={y + 20} fill={INK_SECONDARY} fontSize="12" fontWeight={600}>{lane.total} years</text>
            <text x="100" y={y + 45} fill={INK_MUTED} fontSize="11" fontWeight={600}>{lane.computed}</text>
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

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
