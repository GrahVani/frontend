"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BookOpen,
  CheckCircle2,
  Eye,
  MapPinned,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";

type DignityKey = "exalted" | "own" | "friendly" | "neutral" | "enemy" | "debilitated";
type ConditionKey = "supportive" | "mixed" | "stressed";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"] as const;

const DIGNITIES: Record<DignityKey, { label: string; color: string; verdict: "strong" | "mixed" | "stressed"; reading: string }> = {
  exalted: { label: "Exalted", color: GREEN, verdict: "strong", reading: "very strong; the PK's theme is empowered" },
  own: { label: "Own sign", color: GREEN, verdict: "strong", reading: "strong; the PK's nature is at home" },
  friendly: { label: "Friendly sign", color: BLUE, verdict: "strong", reading: "supportive; familiar ground" },
  neutral: { label: "Neutral sign", color: GOLD, verdict: "mixed", reading: "mixed; no special help or hindrance" },
  enemy: { label: "Enemy sign", color: VERMILION, verdict: "stressed", reading: "strained; working against the sign's grain" },
  debilitated: { label: "Debilitated", color: VERMILION, verdict: "stressed", reading: "deeply stressed unless neecha-bhanga applies" },
};

function houseCategory(house: number) {
  if ([1, 4, 7, 10, 5, 9].includes(house)) return { label: "kendra / koṇa", color: GREEN, verdict: "strong" as const, reading: "structurally strong; the theme is well-integrated" };
  if ([6, 8, 12].includes(house)) return { label: "dusthāna", color: VERMILION, verdict: "stressed" as const, reading: "a stress placement to weigh against relief" };
  return { label: "upachaya / other", color: GOLD, verdict: "mixed" as const, reading: "mixed; context-dependent" };
}

function conditionData(key: ConditionKey) {
  const map = {
    supportive: { label: "Supportive", color: GREEN, reading: "reinforces the saṁtāna indication" },
    mixed: { label: "Mixed", color: GOLD, reading: "adds context, not a separate verdict" },
    stressed: { label: "Stressed", color: VERMILION, reading: "a factor to weigh, never a foreclosure" },
  };
  return map[key];
}

export function PkPlacementNavamshaWorkbench() {
  const [pkHouse, setPkHouse] = useState(5);
  const [d1Dignity, setD1Dignity] = useState<DignityKey>("own");
  const [neechaBhanga, setNeechaBhanga] = useState(false);
  const [beneficAspect, setBeneficAspect] = useState(true);
  const [maleficAspect, setMaleficAspect] = useState(false);
  const [d9Dignity, setD9Dignity] = useState<DignityKey>("own");
  const [karakamshaSign, setKarakamshaSign] = useState(1);
  const [fifthFromPk, setFifthFromPk] = useState<ConditionKey>("supportive");
  const [fifthFromKl, setFifthFromKl] = useState<ConditionKey>("supportive");
  const [fifthSupportive, setFifthSupportive] = useState(true);
  const [d7Supportive, setD7Supportive] = useState(true);
  const [jupiterStrong, setJupiterStrong] = useState(true);
  const [honestMixed, setHonestMixed] = useState(true);

  const d1Cat = houseCategory(pkHouse);
  const d1DignityData = DIGNITIES[d1Dignity];
  const d9DignityData = DIGNITIES[d9Dignity];

  const d1Verdict = useMemo(() => {
    if (d1Dignity === "debilitated" && !neechaBhanga) return "stressed" as const;
    if (maleficAspect && !beneficAspect) {
      if (d1Cat.verdict === "strong") return "mixed" as const;
      return "stressed" as const;
    }
    if (d1Cat.verdict === "stressed" && (beneficAspect || d1DignityData.verdict === "strong" || d1DignityData.verdict === "mixed")) return "mixed" as const;
    if (d1Cat.verdict === "strong" && d1DignityData.verdict === "stressed") return "mixed" as const;
    if (d1Cat.verdict === "stressed" || d1DignityData.verdict === "stressed") return "stressed" as const;
    if (d1Cat.verdict === "mixed" || d1DignityData.verdict === "mixed") return "mixed" as const;
    return "strong" as const;
  }, [beneficAspect, d1Cat.verdict, d1Dignity, d1DignityData.verdict, maleficAspect, neechaBhanga]);

  const d9Verdict = d9DignityData.verdict;

  const crossChart = useMemo(() => {
    if (d1Verdict === d9Verdict) return d1Verdict;
    if (d1Verdict === "stressed" || d9Verdict === "stressed") return "mixed";
    return "mixed";
  }, [d1Verdict, d9Verdict]);

  const jaiminiLayers = [d1Verdict, d9Verdict, fifthFromPk, fifthFromKl].map((layer) => {
    if (layer === "strong" || layer === "supportive") return 1;
    if (layer === "mixed") return 0;
    return -1;
  });
  const jaiminiScore = jaiminiLayers.reduce<number>((sum, value) => sum + value, 0);
  const convergenceCount = [fifthSupportive, d7Supportive, jupiterStrong].filter(Boolean).length + (jaiminiScore >= 2 ? 1 : 0);
  const warning = !honestMixed;

  const synthesis = useMemo(() => {
    if (!honestMixed) {
      return "Turn on 'Report mixed pictures honestly' before giving a reading. A stressed-D1/strong-D9 (or vice versa) PK must be named as mixed, not forced into a clean verdict.";
    }
    const d1Text = `D1: PK in house ${pkHouse} (${d1Cat.label}), ${d1DignityData.label}${d1Dignity === "debilitated" && neechaBhanga ? " with neecha-bhanga relief" : ""}.`;
    const aspectText = beneficAspect && maleficAspect
      ? "Both benefic and malefic aspects land on the PK; weigh which is stronger."
      : beneficAspect
        ? "A benefic aspect supports the PK."
        : maleficAspect
          ? "A malefic aspect stresses the PK."
          : "No strong aspect testimony is toggled.";
    const d9Text = `D9: PK in ${d9DignityData.label} — ${d9DignityData.reading}.`;
    const crossText = crossChart === "strong"
      ? "D1 and D9 converge on a strong picture."
      : crossChart === "stressed"
        ? "D1 and D9 both show stress."
        : "D1 and D9 give a mixed picture; report both sides honestly.";
    const fifthPkText = `5th-from-PK is ${conditionData(fifthFromPk).label.toLowerCase()}.`;
    const klText = `5th-from-Karakāṁśa (${SIGNS[karakamshaSign - 1]}) is ${conditionData(fifthFromKl).label.toLowerCase()}.`;
    const otherText = `${convergenceCount > 2 ? "Multiple" : "Few"} saṁtāna registers align across Parāśari and Jaimini.`;
    return `${d1Text} ${aspectText} ${d9Text} ${crossText} ${fifthPkText} ${klText} ${otherText}`;
  }, [beneficAspect, crossChart, d1Cat, d1Dignity, d1DignityData, d9DignityData, fifthFromPk, fifthFromKl, honestMixed, karakamshaSign, maleficAspect, neechaBhanga, pkHouse, convergenceCount]);

  function reset() {
    setPkHouse(5);
    setD1Dignity("own");
    setNeechaBhanga(false);
    setBeneficAspect(true);
    setMaleficAspect(false);
    setD9Dignity("own");
    setKarakamshaSign(1);
    setFifthFromPk("supportive");
    setFifthFromKl("supportive");
    setFifthSupportive(true);
    setD7Supportive(true);
    setJupiterStrong(true);
    setHonestMixed(true);
  }

  return (
    <div data-interactive="pk-placement-navamsha-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>PK placement and navāṁśa</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.32rem", fontWeight: 600 }}>
              Read the children-significator in D1, D9, and against the Karakāṁśa
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Layer the PK&apos;s house, dignity, aspects, 5th-from-PK, D9 condition, and 5th-from-Karakāṁśa — then weigh genuine convergence, not just the number of layers checked.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Layer diagram</p>
              <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : crossChart === "strong" ? GREEN : crossChart === "stressed" ? VERMILION : GOLD, fontSize: "1.15rem", fontWeight: 600 }}>
                {warning ? "Honesty guard off" : crossChart === "strong" ? "Convergent D1-D9" : crossChart === "stressed" ? "Stressed both charts" : "Mixed D1-D9 picture"}
              </h3>
            </div>
            <strong style={{ color: jaiminiScore >= 2 ? GREEN : jaiminiScore <= -2 ? VERMILION : GOLD, fontWeight: 600 }}>
              Jaimini score {jaiminiScore}
            </strong>
          </div>
          <LayerDiagram
            pkHouse={pkHouse}
            d1Dignity={d1Dignity}
            d1Verdict={d1Verdict}
            d9Dignity={d9Dignity}
            d9Verdict={d9Verdict}
            karakamshaSign={karakamshaSign}
            fifthFromPk={fifthFromPk}
            fifthFromKl={fifthFromKl}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<MapPinned size={16} />} title="D1 placement" body={`House ${pkHouse} — ${d1Cat.label}`} color={d1Cat.color} />
            <MiniFact icon={<Sparkles size={16} />} title="D9 dignity" body={d9DignityData.label} color={d9DignityData.color} />
            <MiniFact icon={<Target size={16} />} title="Cross-chart" body={crossChart} color={crossChart === "strong" ? GREEN : crossChart === "stressed" ? VERMILION : GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="D1 placement" icon={<MapPinned size={18} />} color={d1Cat.color}>
            <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
              <span>PK house from Lagna</span>
              <input type="range" min={1} max={12} step={1} value={pkHouse} onChange={(e) => setPkHouse(Number(e.target.value))} style={{ accentColor: d1Cat.color, width: "100%" }} aria-label="PK house" />
              <span style={{ color: d1Cat.color, fontWeight: 600 }}>House {pkHouse} — {d1Cat.label}</span>
            </label>
            <p style={bodyTextStyle}>{d1Cat.reading}.</p>
          </Panel>

          <Panel title="D1 dignity" icon={<Scale size={18} />} color={d1DignityData.color}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={d1Dignity === key} onClick={() => setD1Dignity(key)} style={smallChipStyle(d1Dignity === key, DIGNITIES[key].color)}>
                  {DIGNITIES[key].label}
                </button>
              ))}
            </div>
            <p style={bodyTextStyle}>{d1DignityData.reading}.</p>
            {d1Dignity === "debilitated" ? (
              <button type="button" aria-pressed={neechaBhanga} onClick={() => setNeechaBhanga((v) => !v)} style={{ ...togglePanelStyle(neechaBhanga, GREEN), marginTop: "0.75rem" }}>
                <ShieldCheck size={18} aria-hidden="true" />
                <span>
                  <span style={{ display: "block", fontWeight: 600 }}>Neecha-bhanga applies</span>
                  <span>{neechaBhanga ? "Cancellation relief is counted before reading debilitation at face value." : "Check cancellation factors before settling the dignity."}</span>
                </span>
              </button>
            ) : null}
          </Panel>

          <Panel title="Aspects on the PK" icon={<Eye size={18} />} color={maleficAspect && !beneficAspect ? VERMILION : GREEN}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <button type="button" aria-pressed={beneficAspect} onClick={() => setBeneficAspect((v) => !v)} style={smallChipStyle(beneficAspect, GREEN)}>
                Benefic aspect
              </button>
              <button type="button" aria-pressed={maleficAspect} onClick={() => setMaleficAspect((v) => !v)} style={smallChipStyle(maleficAspect, VERMILION)}>
                Malefic aspect
              </button>
            </div>
            <p style={bodyTextStyle}>
              {beneficAspect && maleficAspect
                ? "Both influences are present; weigh which is stronger and whether relief is available."
                : beneficAspect
                  ? "A benefic influence supports the significator."
                  : maleficAspect
                    ? "A malefic influence stresses the significator."
                    : "Toggle the aspect testimony you see in the chart."}
            </p>
          </Panel>
        </section>
      </div>

      <div style={responsiveThreeColumnStyle}>
        <Panel title="D9 navāṁśa" icon={<Sparkles size={18} />} color={d9DignityData.color}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {(Object.keys(DIGNITIES) as DignityKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={d9Dignity === key} onClick={() => setD9Dignity(key)} style={smallChipStyle(d9Dignity === key, DIGNITIES[key].color)}>
                {DIGNITIES[key].label}
              </button>
            ))}
          </div>
          <p style={bodyTextStyle}>{d9DignityData.reading}.</p>
        </Panel>

        <Panel title="5th-from-PK" icon={<Target size={18} />} color={conditionData(fifthFromPk).color}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {(["supportive", "mixed", "stressed"] as ConditionKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={fifthFromPk === key} onClick={() => setFifthFromPk(key)} style={smallChipStyle(fifthFromPk === key, conditionData(key).color)}>
                {conditionData(key).label}
              </button>
            ))}
          </div>
          <p style={bodyTextStyle}>{conditionData(fifthFromPk).reading}.</p>
        </Panel>

        <Panel title="5th-from-Karakāṁśa" icon={<BookOpen size={18} />} color={conditionData(fifthFromKl).color}>
          <label style={{ display: "grid", gap: "0.35rem", color: INK_SECONDARY }}>
            <span>Karakāṁśa sign (AK in D9)</span>
            <select value={karakamshaSign} onChange={(e) => setKarakamshaSign(Number(e.target.value))} style={selectStyle}>
              {SIGNS.map((sign, index) => (
                <option key={sign} value={index + 1}>
                  {sign}
                </option>
              ))}
            </select>
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.65rem" }}>
            {(["supportive", "mixed", "stressed"] as ConditionKey[]).map((key) => (
              <button key={key} type="button" aria-pressed={fifthFromKl === key} onClick={() => setFifthFromKl(key)} style={smallChipStyle(fifthFromKl === key, conditionData(key).color)}>
                {conditionData(key).label}
              </button>
            ))}
          </div>
          <p style={bodyTextStyle}>{conditionData(fifthFromKl).reading}.</p>
        </Panel>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Other saṁtāna registers</p>
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            <ConvergenceToggle active={fifthSupportive} icon={<CheckCircle2 size={18} />} title="D1 5th house / lord" body={fifthSupportive ? "Supportive" : "Not supportive"} onClick={() => setFifthSupportive((v) => !v)} />
            <ConvergenceToggle active={d7Supportive} icon={<CheckCircle2 size={18} />} title="D7 saṁtāna varga" body={d7Supportive ? "Supportive" : "Not supportive"} onClick={() => setD7Supportive((v) => !v)} />
            <ConvergenceToggle active={jupiterStrong} icon={<CheckCircle2 size={18} />} title="D1 Jupiter strong" body={jupiterStrong ? "Strong" : "Stressed"} onClick={() => setJupiterStrong((v) => !v)} />
          </div>
          <div style={{ marginTop: "0.85rem", padding: "0.75rem", borderRadius: 8, background: `${convergenceCount >= 3 ? GREEN : convergenceCount >= 2 ? GOLD : VERMILION}${"12"}`, border: `1px solid ${convergenceCount >= 3 ? GREEN : convergenceCount >= 2 ? GOLD : VERMILION}` }}>
            <p style={{ margin: 0, color: convergenceCount >= 3 ? GREEN : convergenceCount >= 2 ? GOLD : VERMILION, fontWeight: 600 }}>
              {convergenceCount} of 4 saṁtāna registers align
            </p>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Reading discipline</p>
          <button type="button" aria-pressed={honestMixed} onClick={() => setHonestMixed((v) => !v)} style={togglePanelStyle(honestMixed, honestMixed ? GREEN : VERMILION)}>
            <Scale size={18} aria-hidden="true" />
            <span>
              <span style={{ display: "block", fontWeight: 600 }}>Report mixed pictures honestly</span>
              <span>{honestMixed ? "A stressed-D1/strong-D9 PK is named as mixed, not forced to good or bad." : "Warning: do not collapse a mixed D1-D9 picture into a clean verdict."}</span>
            </span>
          </button>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: warning ? `${VERMILION}${"66"}` : `${GREEN}${"66"}`, background: warning ? `${VERMILION}${"0F"}` : `${GREEN}${"0F"}` }}>
        <p style={eyebrowStyle}>Synthesis</p>
        <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : GREEN, fontSize: "1.15rem", fontWeight: 600 }}>
          {warning ? "Discipline warning" : crossChart === "strong" ? "Convergent Jaimini picture" : crossChart === "stressed" ? "Stressed Jaimini picture" : "Mixed Jaimini picture"}
        </h3>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{synthesis}</p>
      </section>
    </div>
  );
}

function LayerDiagram({
  pkHouse,
  d1Dignity,
  d1Verdict,
  d9Dignity,
  d9Verdict,
  karakamshaSign,
  fifthFromPk,
  fifthFromKl,
}: {
  pkHouse: number;
  d1Dignity: DignityKey;
  d1Verdict: "strong" | "mixed" | "stressed";
  d9Dignity: DignityKey;
  d9Verdict: "strong" | "mixed" | "stressed";
  karakamshaSign: number;
  fifthFromPk: ConditionKey;
  fifthFromKl: ConditionKey;
}) {
  const d1Color = verdictColor(d1Verdict);
  const d9Color = verdictColor(d9Verdict);
  const fifthPkColor = conditionData(fifthFromPk).color;
  const fifthKlColor = conditionData(fifthFromKl).color;
  const crossColor = d1Verdict === d9Verdict ? d1Color : GOLD;
  const fifthFromPkHouse = ((pkHouse + 4 - 1) % 12) + 1;
  const fifthFromKlHouse = ((karakamshaSign + 4 - 1) % 12) + 1;

  return (
    <svg viewBox="0 0 560 320" role="img" aria-label="PK placement, D9, and Karakamsha layer diagram" style={{ width: "100%", maxHeight: 360, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <rect x="14" y="14" width="532" height="292" rx="8" fill={`${GOLD}${"0F"}`} stroke={HAIRLINE} />

      {/* D1 PK */}
      <circle cx="130" cy="110" r="52" fill={`${d1Color}${"18"}`} stroke={d1Color} strokeWidth="4" />
      <text x="130" y="102" textAnchor="middle" fill={d1Color} fontSize="15" fontWeight="600">D1 PK</text>
      <text x="130" y="123" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">House {pkHouse}</text>
      <text x="130" y="141" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="600">{DIGNITIES[d1Dignity].label}</text>

      {/* D9 PK */}
      <circle cx="430" cy="110" r="52" fill={`${d9Color}${"18"}`} stroke={d9Color} strokeWidth="4" />
      <text x="430" y="102" textAnchor="middle" fill={d9Color} fontSize="15" fontWeight="600">D9 PK</text>
      <text x="430" y="123" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="600">{DIGNITIES[d9Dignity].label}</text>
      <text x="430" y="141" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="600">refinement</text>

      {/* Cross-chart arrows */}
      <path d="M 182 100 C 250 70, 310 70, 378 100" fill="none" stroke={crossColor} strokeWidth="4" strokeLinecap="round" />
      <path d="M 182 120 C 250 150, 310 150, 378 120" fill="none" stroke={crossColor} strokeWidth="4" strokeLinecap="round" />
      <text x="280" y="78" textAnchor="middle" fill={crossColor} fontSize="12" fontWeight="600">
        {d1Verdict === d9Verdict ? "converge" : "mixed"}
      </text>

      {/* 5th-from-PK */}
      <circle cx="80" cy="240" r="40" fill={`${fifthPkColor}${"18"}`} stroke={fifthPkColor} strokeWidth="3" />
      <text x="80" y="234" textAnchor="middle" fill={fifthPkColor} fontSize="13" fontWeight="600">5th from PK</text>
      <text x="80" y="252" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">House {fifthFromPkHouse}</text>
      <path d="M 100 200 C 90 220, 90 220, 85 230" fill="none" stroke={fifthPkColor} strokeWidth="3" strokeLinecap="round" />

      {/* Karakamsha */}
      <circle cx="360" cy="240" r="40" fill={`${PURPLE}${"18"}`} stroke={PURPLE} strokeWidth="3" />
      <text x="360" y="234" textAnchor="middle" fill={PURPLE} fontSize="12" fontWeight="600">Karakāṁśa</text>
      <text x="360" y="252" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">{SIGNS[karakamshaSign - 1]}</text>

      {/* 5th-from-KL */}
      <circle cx="480" cy="240" r="40" fill={`${fifthKlColor}${"18"}`} stroke={fifthKlColor} strokeWidth="3" />
      <text x="480" y="234" textAnchor="middle" fill={fifthKlColor} fontSize="13" fontWeight="600">5th from KL</text>
      <text x="480" y="252" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight="600">House {fifthFromKlHouse}</text>
      <path d="M 400 240 L 440 240" fill="none" stroke={fifthKlColor} strokeWidth="3" strokeLinecap="round" />

      <text x="280" y="298" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="600">
        D1 house/dignity give promise; D9 refines; 5th-from-PK and 5th-from-KL are cross-checks
      </text>
    </svg>
  );
}

function verdictColor(verdict: "strong" | "mixed" | "stressed") {
  return verdict === "strong" ? GREEN : verdict === "stressed" ? VERMILION : GOLD;
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}${"44"}`, borderRadius: 8, background: `${color}${"0F"}`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function ConvergenceToggle({ active, icon, title, body, onClick }: { active: boolean; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, active ? GREEN : VERMILION)}>
      <span style={{ color: active ? GREEN : VERMILION }}>{active ? icon : <XCircle size={18} />}</span>
      <span>
        <span style={{ display: "block", fontWeight: 600 }}>{title}</span>
        <span>{body}</span>
      </span>
    </button>
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
    padding: "0.48rem 0.68rem",
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
    background: active ? `${color}${"14"}` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}${"12"}` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
    fontWeight: 400,
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
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const responsiveThreeColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const selectStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_PRIMARY,
  padding: "0.45rem 0.6rem",
  fontWeight: 400,
};
