"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  BookOpen,
  Calculator,
  ChevronDown,
  ChevronUp,
  GitCompare,
  GraduationCap,
  Heart,
  Info,
  Moon,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Swords,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn" | "rahu" | "ketu";
type PairKey = "anshBhavna" | "manual";
type Relationship = "friend" | "neutral" | "enemy";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const VERMILION = "var(--gl-vermilion-accent)";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const NAKSHATRAS = [
  { name: "Aśvinī", lord: "ketu", start: 0 },
  { name: "Bharaṇī", lord: "venus", start: 13.3333 },
  { name: "Kṛttikā", lord: "sun", start: 26.6667 },
  { name: "Rohiṇī", lord: "moon", start: 40 },
  { name: "Mṛgaśīrṣa", lord: "mars", start: 53.3333 },
  { name: "Ārdrā", lord: "rahu", start: 66.6667 },
  { name: "Punarvasu", lord: "jupiter", start: 80 },
  { name: "Puṣya", lord: "saturn", start: 93.3333 },
  { name: "Āśleṣā", lord: "mercury", start: 106.6667 },
  { name: "Maghā", lord: "ketu", start: 120 },
  { name: "Pūrvaphalgunī", lord: "venus", start: 133.3333 },
  { name: "Uttaraphalgunī", lord: "sun", start: 146.6667 },
  { name: "Hasta", lord: "moon", start: 160 },
  { name: "Citrā", lord: "mars", start: 173.3333 },
  { name: "Svātī", lord: "rahu", start: 186.6667 },
  { name: "Viśākhā", lord: "jupiter", start: 200 },
  { name: "Anurādhā", lord: "saturn", start: 213.3333 },
  { name: "Jyeṣṭhā", lord: "mercury", start: 226.6667 },
  { name: "Mūla", lord: "ketu", start: 240 },
  { name: "Pūrvāṣāḍhā", lord: "venus", start: 253.3333 },
  { name: "Uttarāṣāḍhā", lord: "sun", start: 266.6667 },
  { name: "Śravaṇa", lord: "moon", start: 280 },
  { name: "Dhaniṣṭhā", lord: "mars", start: 293.3333 },
  { name: "Śatabhiṣaj", lord: "rahu", start: 306.6667 },
  { name: "Pūrvabhādrapadā", lord: "jupiter", start: 320 },
  { name: "Uttarabhadrapadā", lord: "saturn", start: 333.3333 },
  { name: "Revatī", lord: "mercury", start: 346.6667 },
];

const VIMSHOTTARI_YEARS: Record<PlanetKey, number> = {
  ketu: 7,
  venus: 20,
  sun: 6,
  moon: 10,
  mars: 7,
  rahu: 18,
  jupiter: 16,
  saturn: 19,
  mercury: 17,
};

const TOTAL_VIMSHOTTARI_YEARS = 120;
const NAKSHATRA_WIDTH = 13.3333;

const PLANETS: Record<PlanetKey, { label: string; short: string; color: string }> = {
  sun: { label: "Sun", short: "Su", color: "#D97706" },
  moon: { label: "Moon", short: "Mo", color: "#356CAB" },
  mars: { label: "Mars", short: "Ma", color: "#A23A1E" },
  mercury: { label: "Mercury", short: "Me", color: "#2F7D55" },
  jupiter: { label: "Jupiter", short: "Ju", color: "#B88421" },
  venus: { label: "Venus", short: "Ve", color: "#9C27B0" },
  saturn: { label: "Saturn", short: "Sa", color: "#6B5AA8" },
  rahu: { label: "Rahu", short: "Ra", color: "#374151" },
  ketu: { label: "Ketu", short: "Ke", color: "#795548" },
};

const GRAHA_MAITRI: Record<PlanetKey, { friends: PlanetKey[]; enemies: PlanetKey[]; neutral: PlanetKey[] }> = {
  sun: { friends: ["moon", "mars", "jupiter"], enemies: ["venus", "saturn"], neutral: ["mercury"] },
  moon: { friends: ["sun", "mercury"], enemies: [], neutral: ["mars", "jupiter", "venus", "saturn"] },
  mars: { friends: ["sun", "moon", "jupiter"], enemies: ["mercury"], neutral: ["venus", "saturn"] },
  mercury: { friends: ["sun", "venus"], enemies: ["moon"], neutral: ["mars", "jupiter", "saturn"] },
  jupiter: { friends: ["sun", "moon", "mars"], enemies: ["mercury", "venus"], neutral: ["saturn"] },
  venus: { friends: ["mercury", "saturn"], enemies: ["sun", "moon"], neutral: ["mars", "jupiter"] },
  saturn: { friends: ["mercury", "venus"], enemies: ["sun", "moon", "mars"], neutral: ["jupiter"] },
  rahu: { friends: ["venus", "saturn"], enemies: ["sun", "moon", "mars"], neutral: ["mercury", "jupiter"] },
  ketu: { friends: ["sun", "mars"], enemies: ["moon", "mercury"], neutral: ["jupiter", "venus", "saturn"] },
};

const VIMSHOTTARI_ORDER: PlanetKey[] = ["ketu", "venus", "sun", "moon", "mars", "rahu", "jupiter", "saturn", "mercury"];

function getSubLord(nakshatraLord: PlanetKey, offsetDegrees: number): { planet: PlanetKey; start: number; end: number } {
  const startIndex = VIMSHOTTARI_ORDER.indexOf(nakshatraLord);
  let currentStart = 0;
  for (let i = 0; i < 9; i++) {
    const planet = VIMSHOTTARI_ORDER[(startIndex + i) % 9];
    const width = (VIMSHOTTARI_YEARS[planet] / TOTAL_VIMSHOTTARI_YEARS) * NAKSHATRA_WIDTH;
    const end = currentStart + width;
    if (offsetDegrees < end || i === 8) {
      return { planet, start: currentStart, end };
    }
    currentStart = end;
  }
  return { planet: nakshatraLord, start: 0, end: NAKSHATRA_WIDTH };
}

function computeMoonData(signIndex: number, degrees: number, minutes: number) {
  const absoluteLongitude = signIndex * 30 + degrees + minutes / 60;
  const nakshatraIndex = Math.floor(absoluteLongitude / NAKSHATRA_WIDTH) % 27;
  const nakshatra = NAKSHATRAS[nakshatraIndex];
  const offset = absoluteLongitude - nakshatra.start;
  const subLord = getSubLord(nakshatra.lord as PlanetKey, offset);
  return { absoluteLongitude, nakshatra, offset, subLord };
}

function relationshipOf(source: PlanetKey, target: PlanetKey): Relationship {
  const data = GRAHA_MAITRI[source];
  if (data.friends.includes(target)) return "friend";
  if (data.enemies.includes(target)) return "enemy";
  return "neutral";
}

function relationshipLabel(source: PlanetKey, target: PlanetKey): string {
  const forward = relationshipOf(source, target);
  const reverse = relationshipOf(target, source);
  const forwardText = forward === "friend" ? "friend" : forward === "enemy" ? "enemy" : "neutral";
  const reverseText = reverse === "friend" ? "friend" : reverse === "enemy" ? "enemy" : "neutral";
  return `${PLANETS[source].label} sees ${PLANETS[target].label} as ${forwardText}; ${PLANETS[target].label} sees ${PLANETS[source].label} as ${reverseText}.`;
}

export function KpMoonSubLordSynastryWorkbench() {
  const [pairKey, setPairKey] = useState<PairKey>("anshBhavna");
  const [anshSign, setAnshSign] = useState(2); // Cancer
  const [anshDeg, setAnshDeg] = useState(12);
  const [anshMin, setAnshMin] = useState(30);
  const [bhavnaSign, setBhavnaSign] = useState(1); // Taurus
  const [bhavnaDeg, setBhavnaDeg] = useState(18);
  const [bhavnaMin, setBhavnaMin] = useState(0);
  const [showBothStrips, setShowBothStrips] = useState(true);
  const [symmetricView, setSymmetricView] = useState(false);
  const [mislabelKp, setMislabelKp] = useState(false);
  const [softenFinding, setSoftenFinding] = useState(false);
  const [showCancelQuestion, setShowCancelQuestion] = useState(false);

  const ansh = useMemo(() => computeMoonData(anshSign, anshDeg, anshMin), [anshSign, anshDeg, anshMin]);
  const bhavna = useMemo(() => computeMoonData(bhavnaSign, bhavnaDeg, bhavnaMin), [bhavnaSign, bhavnaDeg, bhavnaMin]);

  const sourceSubLord = ansh.subLord.planet;
  const targetSubLord = bhavna.subLord.planet;
  const forwardRel = relationshipOf(sourceSubLord, targetSubLord);
  const reverseRel = relationshipOf(targetSubLord, sourceSubLord);
  const isMixed = forwardRel === "enemy" && reverseRel !== "enemy";
  const isFriendly = forwardRel === "friend" && reverseRel === "friend";

  const honestStatement = isMixed
    ? `${PLANETS[sourceSubLord].label} holds ${PLANETS[targetSubLord].label} as an enemy, while ${PLANETS[targetSubLord].label} remains neutral toward ${PLANETS[sourceSubLord].label}. This is a mixed finding, reported honestly.`
    : isFriendly
      ? `Both Moon sub-lords are mutually friendly: ${PLANETS[sourceSubLord].label} and ${PLANETS[targetSubLord].label} see each other as friends.`
      : relationshipLabel(sourceSubLord, targetSubLord);

  const softenedStatement = isMixed
    ? `The two Moon sub-lords show some tension, but the overall emotional connection can still be considered broadly workable.`
    : honestStatement;

  const resetToPreset = () => {
    setPairKey("anshBhavna");
    setAnshSign(2);
    setAnshDeg(12);
    setAnshMin(30);
    setBhavnaSign(1);
    setBhavnaDeg(18);
    setBhavnaMin(0);
    setShowBothStrips(true);
    setSymmetricView(false);
    setMislabelKp(false);
    setSoftenFinding(false);
    setShowCancelQuestion(false);
  };

  return (
    <div data-interactive="kp-moon-sub-lord-synastry-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>KP Moon sub-lord synastry</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 500 }}>
              Compare each Moon&apos;s own sub-lord, honestly
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The sub-lord computation is KP doctrine. The cross-chart Moon application is this curriculum&apos;s own disclosed synthesis.
            </p>
          </div>
          <button type="button" onClick={resetToPreset} style={softButtonStyle}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Chart pair</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
          <button type="button" aria-pressed={pairKey === "anshBhavna"} onClick={() => setPairKey("anshBhavna")} style={smallChipStyle(pairKey === "anshBhavna", BLUE)}>
            MC1 Ansh + MC2 Bhavna
          </button>
          <button type="button" aria-pressed={pairKey === "manual"} onClick={() => setPairKey("manual")} style={smallChipStyle(pairKey === "manual", PURPLE)}>
            Manual pair
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <MoonCard
          title="MC1 (Ansh)"
          sign={anshSign}
          deg={anshDeg}
          min={anshMin}
          onSign={setAnshSign}
          onDeg={setAnshDeg}
          onMin={setAnshMin}
          data={ansh}
          editable={pairKey === "manual"}
        />
        <MoonCard
          title="MC2 (Bhavna)"
          sign={bhavnaSign}
          deg={bhavnaDeg}
          min={bhavnaMin}
          onSign={setBhavnaSign}
          onDeg={setBhavnaDeg}
          onMin={setBhavnaMin}
          data={bhavna}
          editable={pairKey === "manual"}
        />
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Proportional sub-division</p>
            <h3 style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "1.15rem", fontWeight: 500 }}>
              Where each Moon sits inside its nakṣatra
            </h3>
          </div>
          <button type="button" aria-pressed={showBothStrips} onClick={() => setShowBothStrips((v) => !v)} style={smallChipStyle(showBothStrips, ACCENT)}>
            {showBothStrips ? "Show both strips" : "Show one strip"}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: showBothStrips ? "repeat(auto-fit, minmax(min(100%, 420px), 1fr))" : "1fr", gap: "1rem", marginTop: "0.85rem" }}>
          <SubLordStrip title="Ansh's Moon" data={ansh} />
          {showBothStrips ? <SubLordStrip title="Bhavna's Moon" data={bhavna} /> : null}
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Graha-maitri between sub-lords</p>
              <h3 style={{ margin: "0.15rem 0 0", color: isMixed ? VERMILION : isFriendly ? GREEN : ACCENT, fontSize: "1.15rem", fontWeight: 500 }}>
                {PLANETS[sourceSubLord].label} → {PLANETS[targetSubLord].label}
              </h3>
            </div>
            <button type="button" aria-pressed={symmetricView} onClick={() => setSymmetricView((v) => !v)} style={smallChipStyle(symmetricView, VERMILION)}>
              {symmetricView ? "Popular symmetric view" : "Classical asymmetric view"}
            </button>
          </div>
          <GrahaMaitriGrid source={sourceSubLord} target={targetSubLord} symmetric={symmetricView} />
          <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            {relationshipLabel(sourceSubLord, targetSubLord)}
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Citation honesty check</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button type="button" aria-pressed={!mislabelKp} onClick={() => setMislabelKp(false)} style={togglePanelStyle(!mislabelKp, GREEN)}>
              <ShieldCheck size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 600 }}>Honest label</strong>
                <span>The cross-chart Moon application is this curriculum&apos;s own disclosed synthesis.</span>
              </span>
            </button>
            <button type="button" aria-pressed={mislabelKp} onClick={() => setMislabelKp(true)} style={togglePanelStyle(mislabelKp, VERMILION)}>
              <AlertTriangle size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 600 }}>Mislabel as verbatim KP</strong>
                <span>Shows the citation-honesty mistake this lesson warns against.</span>
              </span>
            </button>
          </div>
          {mislabelKp ? (
            <div style={{ ...noticeStyle(VERMILION), marginTop: "0.85rem" }}>
              <AlertTriangle size={18} />
              <span>Citation error: this cross-chart application is not independently verified in a named KP Reader volume. State it as this curriculum&apos;s own synthesis.</span>
            </div>
          ) : null}
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Reading practice</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button type="button" aria-pressed={!softenFinding} onClick={() => setSoftenFinding(false)} style={togglePanelStyle(!softenFinding, GREEN)}>
              <Scale size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 600 }}>Report finding honestly</strong>
                <span>Name the actual directional relationship, including when it is mixed.</span>
              </span>
            </button>
            <button type="button" aria-pressed={softenFinding} onClick={() => setSoftenFinding(true)} style={togglePanelStyle(softenFinding, VERMILION)}>
              <Heart size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 600 }}>Soften the finding</strong>
                <span>Demonstrates the common mistake of rounding a mixed result into a nicer narrative.</span>
              </span>
            </button>
          </div>
          <div style={{ ...noticeStyle(softenFinding ? VERMILION : GREEN), marginTop: "0.85rem" }}>
            {softenFinding ? <AlertTriangle size={18} /> : <BadgeCheck size={18} />}
            <span>{softenFinding ? softenedStatement : honestStatement}</span>
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Axis independence</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <button type="button" aria-pressed={!showCancelQuestion} onClick={() => setShowCancelQuestion(false)} style={togglePanelStyle(!showCancelQuestion, GREEN)}>
              <BadgeCheck size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 600 }}>Read each axis at its own tier</strong>
                <span>A mixed KP sub-lord finding does not cancel a Strong Mars-Saturn convergence.</span>
              </span>
            </button>
            <button type="button" aria-pressed={showCancelQuestion} onClick={() => setShowCancelQuestion(true)} style={togglePanelStyle(showCancelQuestion, VERMILION)}>
              <GitCompare size={18} aria-hidden="true" />
              <span>
                <strong style={{ fontWeight: 600 }}>Ask &quot;does this cancel the strong finding?&quot;</strong>
                <span>Shows why that is usually the wrong question.</span>
              </span>
            </button>
          </div>
          {showCancelQuestion ? (
            <div style={{ ...noticeStyle(VERMILION), marginTop: "0.85rem" }}>
              <Info size={18} />
              <span>No. The Mars-Saturn convergence and the Moon-sub-lord finding sit on different axes and do not mechanically offset each other. Report each at its own tier.</span>
            </div>
          ) : null}
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${GREEN}66`, background: `${GREEN}0F` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <GraduationCap size={22} color={GREEN} />
          <div>
            <p style={eyebrowStyle}>Confidence tier</p>
            <h3 style={{ margin: "0.15rem 0 0", color: GREEN, fontSize: "1.1rem", fontWeight: 500 }}>
              Weak-to-Moderate
            </h3>
            <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              This is a single technique, disclosed as this curriculum&apos;s own extension of KP doctrine, with no further corroboration. It is reported at its own earned tier and does not dilute stronger findings on unrelated axes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function MoonCard({
  title,
  sign,
  deg,
  min,
  onSign,
  onDeg,
  onMin,
  data,
  editable,
}: {
  title: string;
  sign: number;
  deg: number;
  min: number;
  onSign: (v: number) => void;
  onDeg: (v: number) => void;
  onMin: (v: number) => void;
  data: ReturnType<typeof computeMoonData>;
  editable: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const signs = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];

  return (
    <section style={{ ...cardStyle, flex: "1 1 320px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p style={eyebrowStyle}>{title}</p>
          <h3 style={{ margin: "0.15rem 0 0", color: PLANETS[data.subLord.planet].color, fontSize: "1.15rem", fontWeight: 500 }}>
            Moon sub-lord: {PLANETS[data.subLord.planet].label}
          </h3>
        </div>
        <Moon size={22} color={PLANETS.moon.color} />
      </div>

      {editable ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.85rem" }}>
          <select value={sign} onChange={(e) => onSign(Number(e.target.value))} style={inputStyle} aria-label="Sign">
            {signs.map((s, i) => (
              <option key={s} value={i}>{s}</option>
            ))}
          </select>
          <input type="number" min={0} max={29} value={deg} onChange={(e) => onDeg(Math.min(29, Math.max(0, Number(e.target.value))))} style={{ ...inputStyle, width: 70 }} aria-label="Degrees" />
          <span style={{ color: INK_MUTED, alignSelf: "center" }}>°</span>
          <input type="number" min={0} max={59} value={min} onChange={(e) => onMin(Math.min(59, Math.max(0, Number(e.target.value))))} style={{ ...inputStyle, width: 70 }} aria-label="Minutes" />
          <span style={{ color: INK_MUTED, alignSelf: "center" }}>′</span>
        </div>
      ) : (
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY }}>
          {signs[sign]} {deg}°{min.toString().padStart(2, "0")}′
        </p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.55rem", marginTop: "0.85rem" }}>
        <MiniFact icon={<Calculator size={16} />} title="Longitude" body={`${data.absoluteLongitude.toFixed(2)}°`} color={BLUE} />
        <MiniFact icon={<Sparkles size={16} />} title="Nakṣatra" body={data.nakshatra.name} color={ACCENT} />
        <MiniFact icon={<BookOpen size={16} />} title="Lord" body={PLANETS[data.nakshatra.lord as PlanetKey].label} color={PURPLE} />
        <MiniFact icon={<Swords size={16} />} title="Sub-lord" body={PLANETS[data.subLord.planet].label} color={PLANETS[data.subLord.planet].color} />
      </div>

      <button type="button" onClick={() => setExpanded((v) => !v)} style={{ ...softButtonStyle, marginTop: "0.85rem" }}>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {expanded ? "Hide computation" : "Show computation"}
      </button>

      {expanded ? (
        <div style={{ marginTop: "0.75rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
          <p>Absolute longitude = sign {sign * 30}° + {deg}° + {min}′ = {data.absoluteLongitude.toFixed(4)}°.</p>
          <p>Nakṣatra index = {data.absoluteLongitude.toFixed(4)} ÷ 13.3333 = {Math.floor(data.absoluteLongitude / NAKSHATRA_WIDTH).toFixed(4)} → {data.nakshatra.name}, lord {PLANETS[data.nakshatra.lord as PlanetKey].label}.</p>
          <p>Offset into nakṣatra = {data.offset.toFixed(4)}°. Proportional Vimśottari division starting from {PLANETS[data.nakshatra.lord as PlanetKey].label} places this in the {PLANETS[data.subLord.planet].label} sub-lord segment.</p>
        </div>
      ) : null}
    </section>
  );
}

function SubLordStrip({ title, data }: { title: string; data: ReturnType<typeof computeMoonData> }) {
  const segments = useMemo(() => {
    const startIndex = VIMSHOTTARI_ORDER.indexOf(data.nakshatra.lord as PlanetKey);
    return VIMSHOTTARI_ORDER.reduce<{ planet: PlanetKey; start: number; end: number; width: number }[]>((acc, _, i) => {
      const planet = VIMSHOTTARI_ORDER[(startIndex + i) % 9];
      const width = (VIMSHOTTARI_YEARS[planet] / TOTAL_VIMSHOTTARI_YEARS) * NAKSHATRA_WIDTH;
      const start = acc.length === 0 ? 0 : acc[acc.length - 1].end;
      acc.push({ planet, start, end: start + width, width });
      return acc;
    }, []);
  }, [data.nakshatra.lord]);

  const markerPercent = (data.offset / NAKSHATRA_WIDTH) * 100;

  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.85rem", background: SURFACE }}>
      <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase" }}>{title}</p>
      <p style={{ margin: "0.35rem 0 0.75rem", color: INK_SECONDARY }}>
        {data.nakshatra.name} · offset {data.offset.toFixed(2)}° · sub-lord {PLANETS[data.subLord.planet].label}
      </p>
      <svg viewBox="0 0 600 90" role="img" aria-label={`Sub-lord strip for ${title}`} style={{ width: "100%", display: "block" }}>
        {segments.map((seg) => {
          const x = (seg.start / NAKSHATRA_WIDTH) * 600;
          const w = (seg.width / NAKSHATRA_WIDTH) * 600;
          const isActive = data.subLord.planet === seg.planet;
          return (
            <g key={seg.planet}>
              <rect x={x} y={20} width={w} height={40} fill={isActive ? `${PLANETS[seg.planet].color}44` : `${PLANETS[seg.planet].color}1A`} stroke={isActive ? PLANETS[seg.planet].color : HAIRLINE} strokeWidth={isActive ? 2 : 1} />
              <text x={x + w / 2} y={45} textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={isActive ? 600 : 500}>{PLANETS[seg.planet].short}</text>
            </g>
          );
        })}
        <line x1={markerPercent * 6} y1={12} x2={markerPercent * 6} y2={68} stroke={VERMILION} strokeWidth="3" strokeLinecap="round" />
        <polygon points={`${markerPercent * 6 - 5},12 ${markerPercent * 6 + 5},12 ${markerPercent * 6},5`} fill={VERMILION} />
        <text x={markerPercent * 6} y={82} textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight={600}>Moon at {data.offset.toFixed(2)}°</text>
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginTop: "0.55rem" }}>
        {segments.map((seg) => (
          <span key={seg.planet} style={{ fontSize: "0.78rem", color: seg.planet === data.subLord.planet ? PLANETS[seg.planet].color : INK_MUTED, fontWeight: seg.planet === data.subLord.planet ? 600 : 400 }}>
            {PLANETS[seg.planet].label} {seg.width.toFixed(2)}°
          </span>
        ))}
      </div>
    </div>
  );
}

function GrahaMaitriGrid({ source, target, symmetric }: { source: PlanetKey; target: PlanetKey; symmetric: boolean }) {
  const planets: PlanetKey[] = ["sun", "moon", "mars", "mercury", "jupiter", "venus", "saturn"];

  function cellOf(row: PlanetKey, col: PlanetKey): Relationship {
    if (symmetric) {
      const forward = relationshipOf(row, col);
      const reverse = relationshipOf(col, row);
      if (forward === "enemy" || reverse === "enemy") return "enemy";
      if (forward === "friend" && reverse === "friend") return "friend";
      return "neutral";
    }
    return relationshipOf(row, col);
  }

  return (
    <div style={{ marginTop: "0.85rem", overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: `1px solid ${HAIRLINE}`, padding: "0.4rem", color: INK_MUTED, fontWeight: 500, textAlign: "left" }}>Source ↓ / Target →</th>
            {planets.map((p) => (
              <th key={p} style={{ borderBottom: `1px solid ${HAIRLINE}`, padding: "0.4rem", color: p === target ? PLANETS[p].color : INK_MUTED, fontWeight: p === target ? 600 : 500 }}>
                {PLANETS[p].short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {planets.map((row) => (
            <tr key={row}>
              <td style={{ borderBottom: `1px solid ${HAIRLINE}`, padding: "0.4rem", color: row === source ? PLANETS[row].color : INK_PRIMARY, fontWeight: row === source ? 600 : 500 }}>
                {PLANETS[row].short}
              </td>
              {planets.map((col) => {
                const rel = cellOf(row, col);
                const isActive = row === source && col === target;
                return (
                  <td key={col} style={{ borderBottom: `1px solid ${HAIRLINE}`, padding: "0.4rem", textAlign: "center", background: isActive ? `${relColor(rel)}22` : "transparent" }}>
                    <span style={{ color: relColor(rel), fontWeight: isActive ? 600 : 500 }}>{relSymbol(rel)}</span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", gap: "1rem", marginTop: "0.55rem", fontSize: "0.8rem", color: INK_SECONDARY }}>
        <span><span style={{ color: GREEN, fontWeight: 600 }}>F</span> friend</span>
        <span><span style={{ color: INK_MUTED, fontWeight: 600 }}>N</span> neutral</span>
        <span><span style={{ color: VERMILION, fontWeight: 600 }}>E</span> enemy</span>
      </div>
    </div>
  );
}

function relColor(rel: Relationship): string {
  if (rel === "friend") return GREEN;
  if (rel === "enemy") return VERMILION;
  return INK_MUTED;
}

function relSymbol(rel: Relationship): string {
  if (rel === "friend") return "F";
  if (rel === "enemy") return "E";
  return "N";
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 500,
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

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}55`,
    borderRadius: 8,
    background: `${color}14`,
    color,
    padding: "0.75rem",
    display: "flex",
    gap: "0.5rem",
    alignItems: "start",
    fontWeight: 500,
    lineHeight: 1.45,
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))",
  gap: "1rem",
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.45rem",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.55rem 0.75rem",
  background: SURFACE,
  color: INK_PRIMARY,
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.9rem",
  fontWeight: 500,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: ACCENT,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  fontSize: "0.78rem",
  fontWeight: 600,
};

const inputStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "0.45rem 0.55rem",
  background: SURFACE,
  color: INK_PRIMARY,
  font: "inherit",
  fontSize: "0.9rem",
};

export default KpMoonSubLordSynastryWorkbench;
