"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  MapPinned,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type LensKey = "lagna" | "al" | "occupancy";
type MistakeKey = "tie" | "karaka" | "verdict";

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

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

const ELEMENT_COLORS: Record<string, string> = {
  fire: VERMILION,
  earth: GREEN,
  air: AMBER,
  water: BLUE,
};

const PLANETS = [
  { key: "venus", label: "Venus", short: "Ve", degree: 25, color: GOLD, role: "Ātmakāraka (AK)" },
  { key: "sun", label: "Sun", short: "Su", degree: 20, color: VERMILION, role: "Amātyakāraka (AmK)" },
  { key: "mars", label: "Mars", short: "Ma", degree: 15, color: VERMILION, role: "Bhrātṛkāraka (BK)" },
  { key: "mercury", label: "Mercury", short: "Me", degree: 10, color: GREEN, role: "Tied ranks 4–6" },
  { key: "jupiter", label: "Jupiter", short: "Ju", degree: 10, color: GREEN, role: "Tied ranks 4–6" },
  { key: "saturn", label: "Saturn", short: "Sa", degree: 10, color: PURPLE, role: "Tied ranks 4–6" },
  { key: "moon", label: "Moon", short: "Mo", degree: 4.75, color: BLUE, role: "Dārākāraka (DK)" },
] as const;

const LAGNA_IDX = 3; // Cancer
const LORD_IDX = 8; // Moon in Sagittarius

const LENSES: Record<LensKey, { label: string; color: string; icon: ReactNode; house: string; reading: string }> = {
  lagna: {
    label: "From Lagna",
    color: BLUE,
    icon: <MapPinned size={18} aria-hidden="true" />,
    house: "9th house",
    reading: "Dharma, fortune, higher learning, father — not the marriage-specific 7th.",
  },
  al: {
    label: "From Ārūḍha Lagna",
    color: AMBER,
    icon: <Eye size={18} aria-hidden="true" />,
    house: "11th house",
    reading: "Visible gains and network — expansive, but not a marriage-specific reading.",
  },
  occupancy: {
    label: "Occupancy",
    color: GREEN,
    icon: <Sparkles size={18} aria-hidden="true" />,
    house: "Jupiter in Pisces",
    reading: "Jupiter is Kavya’s naisargika husband-kāraka, physically present in the running sign.",
  },
};

const MISTAKES: Record<MistakeKey, { label: string; offText: string }> = {
  tie: {
    label: "The Chāra Kāraka tie is bounded to ranks 4–6",
    offText: "Warning: the tie does not affect Ātmakāraka or Dārākāraka. Moon is unambiguously DK.",
  },
  karaka: {
    label: "Naisargika and Chāra Kāraka are different, both legitimate systems",
    offText: "Warning: Jupiter (naisargika) and Moon (Dārākāraka) answer different questions; neither is wrong.",
  },
  verdict: {
    label: "Do not force a clean convergence or divergence verdict",
    offText: "Warning: the three Pisces readings give three different kinds of answer. A layered verdict is legitimate.",
  },
};

function houseFrom(startIdx: number, endIdx: number) {
  return ((endIdx - startIdx + 12) % 12) + 1;
}

function stepForward(startIdx: number, steps: number) {
  return (startIdx + steps) % 12;
}

export function CaraCrossReferenceDivergenceWorkbench() {
  const [activeLens, setActiveLens] = useState<LensKey>("lagna");
  const [showException, setShowException] = useState(false);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    tie: true,
    karaka: true,
    verdict: true,
  });

  const alComputation = useMemo(() => {
    const lagnaSign = SIGNS[LAGNA_IDX];
    const lordSign = SIGNS[LORD_IDX];
    const count = houseFrom(LAGNA_IDX, LORD_IDX);
    const landingIndex = stepForward(LORD_IDX, count - 1);
    const landingSign = SIGNS[landingIndex];
    const landingHouse = houseFrom(LAGNA_IDX, landingIndex);
    const exceptionApplies = landingHouse === 1 || landingHouse === 7;
    const finalIndex = exceptionApplies ? stepForward(landingIndex, 9) : landingIndex;
    return { lagna: lagnaSign, lord: `Moon in ${lordSign}`, count, landing: landingSign, landingHouse, exceptionApplies, finalSign: SIGNS[finalIndex] };
  }, []);

  const hypothetical = useMemo(() => {
    // Hypothetical chart where the exception applies: Libra Lagna, Venus in Aries.
    // Count from Libna to Aries = 7; count 7 from Aries lands on Libra (7th from Lagna); shift 10 -> Cancer.
    const hypoLagnaIdx = 6; // Libra
    const hypoLordIdx = 0; // Venus in Aries
    const hypoCount = houseFrom(hypoLagnaIdx, hypoLordIdx);
    const hypoLandingIdx = stepForward(hypoLordIdx, hypoCount - 1);
    const hypoLandingHouse = houseFrom(hypoLagnaIdx, hypoLandingIdx);
    const hypoFinalIdx = stepForward(hypoLandingIdx, 9);
    return {
      lagna: SIGNS[hypoLagnaIdx],
      lord: `Venus in ${SIGNS[hypoLordIdx]}`,
      count: hypoCount,
      landing: SIGNS[hypoLandingIdx],
      landingHouse: hypoLandingHouse,
      exceptionApplies: true,
      finalSign: SIGNS[hypoFinalIdx],
    };
  }, []);

  const activeComp = showException ? hypothetical : alComputation;
  const allHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setActiveLens("lagna");
    setShowException(false);
    setMistakes({ tie: true, karaka: true, verdict: true });
  }

  return (
    <div data-interactive="cara-cross-reference-divergence-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Cross-reference & divergence handling</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Read Kavya’s Pisces Cara MD through Lagna, AL, and kāraka
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compute the Ārūḍha Lagna, inspect three different readings of the same Cara sign, and hold the honest mixed verdict.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Ārūḍha Lagna stepper</p>
              <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.2rem", fontWeight: 600 }}>
                {showException ? "Hypothetical exception" : "Kavya’s AL = Taurus"}
              </h3>
            </div>
            <button
              type="button"
              aria-pressed={showException}
              onClick={() => setShowException((v) => !v)}
              style={buttonStyle(showException, PURPLE)}
            >
              {showException ? "Show Kavya" : "Show 1st/7th exception"}
            </button>
          </div>
          <AlSvg computation={activeComp} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.55rem", marginTop: "0.5rem" }}>
            <MiniFact icon={<MapPinned size={16} />} title="Lagna" body={activeComp.lagna} color={BLUE} />
            <MiniFact icon={<Sparkles size={16} />} title="Lagna lord" body={activeComp.lord} color={AMBER} />
            <MiniFact icon={<Scale size={16} />} title="Count" body={`${activeComp.count} houses`} color={GOLD} />
            <MiniFact icon={<Target size={16} />} title="Landing" body={`${activeComp.landing} (${activeComp.landingHouse === 1 ? "1st" : activeComp.landingHouse === 7 ? "7th" : `${ordinal(activeComp.landingHouse)} from Lagna`})`} color={activeComp.exceptionApplies ? VERMILION : GREEN} />
          </div>
          {activeComp.exceptionApplies && (
            <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: 8, background: `${VERMILION}0F`, border: `1px solid ${VERMILION}55`, color: INK_SECONDARY, lineHeight: 1.55 }}>
              Exception applies: the landing sign is the {ordinal(activeComp.landingHouse)} from Lagna, so shift ten houses forward.
              Final Ārūḍha Lagna = <strong style={{ color: VERMILION, fontWeight: 600 }}>{activeComp.finalSign}</strong>.
            </div>
          )}
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 300px" }}>
          <Panel title="How the exception works" icon={<ShieldCheck size={18} />} color={PURPLE}>
            <p style={bodyTextStyle}>
              Count inclusively from Lagna to the lord’s sign, then count the same number again from the lord.
            </p>
            <p style={bodyTextStyle}>
              If the landing sign is the 1st or 7th from Lagna, shift it ten houses forward. Kavya lands on Taurus (11th), so no shift is needed.
            </p>
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Reading Pisces through three lenses</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.65rem" }}>
          {(Object.keys(LENSES) as LensKey[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={activeLens === key}
              onClick={() => setActiveLens(key)}
              style={smallChipStyle(activeLens === key, LENSES[key].color)}
            >
              {LENSES[key].icon}
              <span style={{ marginLeft: "0.35rem" }}>{LENSES[key].label}</span>
            </button>
          ))}
        </div>
        <PiscesSvg activeLens={activeLens} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(LENSES) as LensKey[]).map((key) => (
            <div
              key={key}
              onClick={() => setActiveLens(key)}
              style={{
                padding: "0.75rem",
                borderRadius: 8,
                border: `1px solid ${activeLens === key ? LENSES[key].color : HAIRLINE}`,
                background: activeLens === key ? `${LENSES[key].color}10` : SURFACE,
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: LENSES[key].color, fontWeight: 700 }}>
                {LENSES[key].icon} {LENSES[key].label}
              </div>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.88rem" }}>
                <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{LENSES[key].house}:</strong> {LENSES[key].reading}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...cardStyle, background: `${AMBER}0A`, borderColor: `${AMBER}88` }}>
        <p style={eyebrowStyle}>Honest verdict</p>
        <h3 style={{ margin: "0.15rem 0 0", color: AMBER, fontSize: "1.18rem", fontWeight: 600 }}>
          Layered — neither clean convergence nor clean divergence
        </h3>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.65 }}>
          The Lagna frame says dharma, the AL frame says gains/network, and occupancy says the husband-kāraka is present.
          These are three different kinds of answer. Forcing them into a single “yes” or “no” would misrepresent what the chart actually produces.
        </p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Chāra Kāraka ranking by degree-within-sign</p>
        <CharaKarakaSvg />
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
          Mercury, Jupiter, and Saturn are tied at exactly 10.00°. The tie is bounded to ranks 4–6 and does not affect
          Venus (Ātmakāraka) or Moon (Dārākāraka). Moon as DK is a genuinely new finding: this module’s earlier tools could not speak to Moon/Moon antardaśā.
        </p>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const on = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !on }))}
                style={togglePanelStyle(on, on ? GREEN : VERMILION)}
              >
                {on ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 700 }}>{MISTAKES[key].label}</strong>
                  <span>{on ? " — discipline held." : ` ${MISTAKES[key].offText}`}</span>
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
            ? "All discipline commitments are held. The mixed Jaimini findings can be reported honestly."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>

      <div style={twoColumnStyle}>
        <section style={{ ...cardStyle, background: `${VERMILION}0A`, borderColor: `${VERMILION}44` }}>
          <p style={eyebrowStyle}>Scope limit 1</p>
          <h3 style={{ margin: "0.15rem 0 0", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
            Rāśi-dṛṣṭi and argala not applied
          </h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            Their full rule-sets belong to T1-17 Chapters 3 and 5, not verified for this module. Approximating them from Parāśarī graha-dṛṣṭi would misrepresent Jaimini.
          </p>
        </section>
        <section style={{ ...cardStyle, background: `${VERMILION}0A`, borderColor: `${VERMILION}44` }}>
          <p style={eyebrowStyle}>Scope limit 2</p>
          <h3 style={{ margin: "0.15rem 0 0", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
            Upapada Lagna not applied
          </h3>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
            The marriage-specific Ārūḍha would refine the reading, but its full treatment was not verified here. The general AL is used instead, with the limit named plainly.
          </p>
        </section>
      </div>
    </div>
  );
}

function AlSvg({ computation }: { computation: { lagna: string; lord: string; count: number; landing: string; landingHouse: number; exceptionApplies: boolean; finalSign: string } }) {
  return (
    <svg viewBox="0 0 560 170" role="img" aria-label="Arudha Lagna computation" style={{ width: "100%", maxHeight: 220, margin: "0.5rem auto 0.75rem", display: "block" }}>
      <rect x="20" y="30" width="120" height="90" rx="8" fill={`${BLUE}12`} stroke={BLUE} strokeWidth="2" />
      <text x="80" y="65" textAnchor="middle" fill={BLUE} fontSize="13" fontWeight={700}>Lagna</text>
      <text x="80" y="88" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight={600}>{computation.lagna}</text>
      <text x="80" y="108" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={600}>{computation.lord}</text>

      <line x1="140" y1="75" x2="190" y2="75" stroke={HAIRLINE} strokeWidth="2" />
      <text x="165" y="67" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={700}>{computation.count}h</text>

      <rect x="190" y="30" width="120" height="90" rx="8" fill={`${AMBER}12`} stroke={AMBER} strokeWidth="2" />
      <text x="250" y="65" textAnchor="middle" fill={AMBER} fontSize="13" fontWeight={700}>Landing</text>
      <text x="250" y="88" textAnchor="middle" fill={INK_PRIMARY} fontSize="15" fontWeight={600}>{computation.landing}</text>
      <text x="250" y="108" textAnchor="middle" fill={computation.exceptionApplies ? VERMILION : GREEN} fontSize="11" fontWeight={700}>
        {computation.exceptionApplies ? "Exception!" : "No exception"}
      </text>

      <line x1="310" y1="75" x2="360" y2="75" stroke={HAIRLINE} strokeWidth="2" strokeDasharray={computation.exceptionApplies ? undefined : "6 4"} />
      {computation.exceptionApplies && <text x="335" y="67" textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight={700}>+10</text>}

      <rect x="360" y="30" width="120" height="90" rx="8" fill={`${PURPLE}12`} stroke={PURPLE} strokeWidth="3" />
      <text x="420" y="65" textAnchor="middle" fill={PURPLE} fontSize="13" fontWeight={700}>Final AL</text>
      <text x="420" y="92" textAnchor="middle" fill={INK_PRIMARY} fontSize="18" fontWeight={600}>{computation.finalSign}</text>

      <text x="280" y="150" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>
        {computation.exceptionApplies
          ? "Landing on 1st or 7th from Lagna triggers the 10-house forward shift."
          : "Landing sign is not 1st or 7th from Lagna, so it becomes the AL."}
      </text>
    </svg>
  );
}

function PiscesSvg({ activeLens }: { activeLens: LensKey }) {
  return (
    <svg viewBox="0 0 560 260" role="img" aria-label="Pisces Cara mahadasha read through three lenses" style={{ width: "100%", maxHeight: 280, margin: "0.75rem auto 0.5rem", display: "block" }}>
      <rect x="210" y="80" width="140" height="120" rx="8" fill={`${ELEMENT_COLORS.water}18`} stroke={ELEMENT_COLORS.water} strokeWidth="3" />
      <text x="280" y="120" textAnchor="middle" fill={ELEMENT_COLORS.water} fontSize="15" fontWeight={700}>Pisces</text>
      <text x="280" y="145" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>Cara MD</text>
      <text x="280" y="165" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>age 29–41</text>

      {/* From Lagna */}
      <line x1="60" y1="140" x2="210" y2="140" stroke={activeLens === "lagna" ? BLUE : HAIRLINE} strokeWidth={activeLens === "lagna" ? 4 : 2} strokeLinecap="round" />
      <circle cx="60" cy="140" r="36" fill={`${BLUE}12`} stroke={BLUE} strokeWidth="2" />
      <text x="60" y="135" textAnchor="middle" fill={BLUE} fontSize="12" fontWeight={700}>Lagna</text>
      <text x="60" y="150" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>Cancer</text>
      <text x="135" y="132" textAnchor="middle" fill={activeLens === "lagna" ? BLUE : INK_MUTED} fontSize="12" fontWeight={700}>9th house</text>

      {/* From AL */}
      <line x1="500" y1="60" x2="350" y2="100" stroke={activeLens === "al" ? AMBER : HAIRLINE} strokeWidth={activeLens === "al" ? 4 : 2} strokeLinecap="round" />
      <circle cx="500" cy="60" r="36" fill={`${AMBER}12`} stroke={AMBER} strokeWidth="2" />
      <text x="500" y="55" textAnchor="middle" fill={AMBER} fontSize="12" fontWeight={700}>AL</text>
      <text x="500" y="70" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>Taurus</text>
      <text x="440" y="70" textAnchor="middle" fill={activeLens === "al" ? AMBER : INK_MUTED} fontSize="12" fontWeight={700}>11th</text>

      {/* Occupancy */}
      <circle cx="280" cy="230" r="30" fill={`${GREEN}12`} stroke={GREEN} strokeWidth={activeLens === "occupancy" ? 4 : 2} />
      <text x="280" y="226" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={700}>Jupiter</text>
      <text x="280" y="242" textAnchor="middle" fill={INK_SECONDARY} fontSize="10" fontWeight={600}>occupant</text>
      <line x1="280" y1="200" x2="280" y2="200" stroke={GREEN} strokeWidth="0" />
    </svg>
  );
}

function CharaKarakaSvg() {
  const maxDeg = 25;
  const barHeight = 26;
  const gap = 10;
  const left = 110;
  const right = 520;
  const scale = (right - left) / maxDeg;

  return (
    <svg viewBox="0 0 560 280" role="img" aria-label="Chara Karaka ranking with bounded tie" style={{ width: "100%", maxHeight: 320, margin: "0.75rem auto 0.5rem", display: "block" }}>
      {PLANETS.map((p, idx) => {
        const y = 30 + idx * (barHeight + gap);
        const width = p.degree * scale;
        const isTied = p.degree === 10;
        const label = isTied ? "Tied ranks 4–6" : p.role;
        return (
          <g key={p.key}>
            <text x="100" y={y + barHeight / 2 + 4} textAnchor="end" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>{p.label}</text>
            <rect x={left} y={y} width={Math.max(4, width)} height={barHeight} rx="4" fill={`${p.color}22`} stroke={p.color} strokeWidth={isTied ? 2 : 1.5} />
            <text x={left + width + 8} y={y + barHeight / 2 + 4} fill={INK_SECONDARY} fontSize="11" fontWeight={600}>{p.degree.toFixed(2)}°</text>
            <text x={left + width + 70} y={y + barHeight / 2 + 4} fill={isTied ? AMBER : p.color} fontSize="11" fontWeight={700}>{label}</text>
          </g>
        );
      })}
      {/* Tie bracket */}
      <path d="M 95 122 Q 80 145 95 168" fill="none" stroke={AMBER} strokeWidth="2" />
      <text x="72" y="148" textAnchor="middle" fill={AMBER} fontSize="10" fontWeight={700} transform="rotate(-90 72 148)">tie</text>
      <text x="280" y="250" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={600}>Moon is unambiguously Dārākāraka; Venus is unambiguously Ātmakāraka</text>
    </svg>
  );
}

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.65rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.35, fontSize: "0.82rem" }}>{body}</p>
    </div>
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
    display: "inline-flex",
    alignItems: "center",
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

const twoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
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
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
