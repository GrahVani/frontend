"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  CheckCircle2,
  Info,
  RefreshCcw,
  Scale,
  Sparkles,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHADOW = "var(--gl-shadow-soft)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const MUTED_FILL = "#F7F1E7";

type PlanetKey = "sun" | "moon" | "mars" | "mercury" | "jupiter" | "venus" | "saturn";
type OverrideA = "off" | "on";

const CHART_H1_DEGREES: Record<PlanetKey, number> = {
  mars: 20,
  saturn: 18,
  moon: 15,
  sun: 12,
  mercury: 10,
  jupiter: 8,
  venus: 5,
};

const PLANETS: Record<PlanetKey, { label: string; short: string; color: string }> = {
  mars: { label: "Mars", short: "Ma", color: VERMILION },
  saturn: { label: "Saturn", short: "Sa", color: PURPLE },
  moon: { label: "Moon", short: "Mo", color: BLUE },
  sun: { label: "Sun", short: "Su", color: GOLD },
  mercury: { label: "Mercury", short: "Me", color: GREEN },
  jupiter: { label: "Jupiter", short: "Ju", color: GREEN },
  venus: { label: "Venus", short: "Ve", color: GOLD },
};

const PLANET_ORDER: PlanetKey[] = ["mars", "saturn", "moon", "sun", "mercury", "jupiter", "venus"];

const SIGNS = [
  { key: "ari", label: "Aries", lord: "mars" as PlanetKey },
  { key: "tau", label: "Taurus", lord: "venus" as PlanetKey },
  { key: "gem", label: "Gemini", lord: "mercury" as PlanetKey },
  { key: "can", label: "Cancer", lord: "moon" as PlanetKey },
  { key: "leo", label: "Leo", lord: "sun" as PlanetKey },
  { key: "vir", label: "Virgo", lord: "mercury" as PlanetKey },
  { key: "lib", label: "Libra", lord: "venus" as PlanetKey },
  { key: "sco", label: "Scorpio", lord: "mars" as PlanetKey },
  { key: "sag", label: "Sagittarius", lord: "jupiter" as PlanetKey },
  { key: "cap", label: "Capricorn", lord: "saturn" as PlanetKey },
  { key: "aqu", label: "Aquarius", lord: "saturn" as PlanetKey },
  { key: "pis", label: "Pisces", lord: "jupiter" as PlanetKey },
];

function signOffset(fromIndex: number, offset: number) {
  return (fromIndex + offset) % 12;
}

function lordOfHouse(fromSignIndex: number, offset: number) {
  return SIGNS[signOffset(fromSignIndex, offset - 1)].lord;
}

export function RudraMaheshvaraWorkbench() {
  const [degrees, setDegrees] = useState<Record<PlanetKey, number>>({ ...CHART_H1_DEGREES });
  const [overrideA, setOverrideA] = useState<OverrideA>("off");
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const reset = () => {
    setDegrees({ ...CHART_H1_DEGREES });
    setOverrideA("off");
    setOpenMistakes({});
  };

  const toggleMistake = (index: number) => setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const ranked = useMemo(() => {
    return [...PLANET_ORDER].sort((a, b) => degrees[b] - degrees[a]);
  }, [degrees]);

  const ak = ranked[0];
  const akSignIndex = 2; // Gemini for Chart H1's Mars (AK)
  const akSign = SIGNS[akSignIndex];

  const secondLord: PlanetKey = "moon"; // 2nd from Gemini = Cancer
  const eighthLord: PlanetKey = "saturn"; // 8th from Gemini = Capricorn
  const rudra = "moon" as PlanetKey;

  const eighthFromAk = lordOfHouse(akSignIndex, 8);
  const sixthFromAk = lordOfHouse(akSignIndex, 6);
  const twelfthFromAk = lordOfHouse(akSignIndex, 12);

  const maheshvaraAPlanet = overrideA === "on" ? twelfthFromAk : eighthFromAk;

  return (
    <div data-interactive="rudra-maheshvara-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Rudra-Maheśvara workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem", fontWeight: 600 }}>
              Apply Jaimini&apos;s longevity significators to Chart H1
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900, fontWeight: 400 }}>
              Compute the Ātmakāraka, identify Rudra, and apply both documented Maheśvara procedures. The honest teaching point is how to hold a finding when one procedure resolves and the other does not.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, PURPLE)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Step 1 — Ātmakāraka</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Highest degree-within-sign among the seven grahas
        </h3>
        <AkSvg degrees={degrees} ak={ak} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
          {PLANET_ORDER.map((key) => (
            <div key={key} style={{ border: `1px solid ${key === ak ? PLANETS[key].color : HAIRLINE}`, borderRadius: 8, background: key === ak ? `${PLANETS[key].color}10` : "transparent", padding: "0.55rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: PLANETS[key].color, fontWeight: 600 }}>{PLANETS[key].label}</span>
                <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 500 }}>{key === "sun" || key === "moon" ? "day/time luminary" : "graha"}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.35rem" }}>
                <input
                  type="number"
                  min={0}
                  max={29.999}
                  step={0.001}
                  value={degrees[key]}
                  onChange={(e) => setDegrees((prev) => ({ ...prev, [key]: Number.parseFloat(e.target.value) || 0 }))}
                  style={{ width: "100%", padding: "0.35rem 0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: "transparent", color: INK_PRIMARY, fontWeight: 400 }}
                />
                <span style={{ color: INK_MUTED, fontSize: "0.85rem" }}>°</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${PLANETS[ak].color}10`, border: `1px solid ${PLANETS[ak].color}55` }}>
          <p style={{ margin: 0, color: PLANETS[ak].color, fontWeight: 500 }}>
            {ak === "mars" ? "Chart H1: Mars holds the highest degree → Mars is the Ātmakāraka." : `With these degrees, ${PLANETS[ak].label} holds the highest degree → ${PLANETS[ak].label} is the Ātmakāraka.`}
          </p>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Step 2 — Rudra</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
          Stronger of the 2nd-lord and 8th-lord from the lagna
        </h3>
        <RudraSvg />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
          <div style={{ border: `1px solid ${PLANETS[secondLord].color}44`, borderRadius: 8, background: `${PLANETS[secondLord].color}10`, padding: "0.75rem" }}>
            <p style={{ margin: 0, color: PLANETS[secondLord].color, fontWeight: 600 }}>2nd from lagna: Cancer</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontWeight: 400 }}>Lord: Moon, in own sign — strongest classical dignity.</p>
          </div>
          <div style={{ border: `1px solid ${PLANETS[eighthLord].color}44`, borderRadius: 8, background: `${PLANETS[eighthLord].color}10`, padding: "0.75rem" }}>
            <p style={{ margin: 0, color: PLANETS[eighthLord].color, fontWeight: 600 }}>8th from lagna: Capricorn</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontWeight: 400 }}>Lord: Saturn, debilitated in Aries (neecha-bhaṅga cancelled).</p>
          </div>
        </div>
        <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${PLANETS[rudra].color}10`, border: `1px solid ${PLANETS[rudra].color}55` }}>
          <p style={{ margin: 0, color: PLANETS[rudra].color, fontWeight: 500 }}>
            Rudra = {PLANETS[rudra].label}. Moon&apos;s own-sign dignity clearly outweighs Saturn&apos;s cancelled debilitation. The documented affliction override for the weaker candidate does not apply.
          </p>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Step 3a — Maheśvara Procedure A</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
            Lord of the 8th from AK, with override checks
          </h3>
          <MaheshvaraASvg overrideA={overrideA} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.75rem" }}>
            <button type="button" aria-pressed={overrideA === "off"} onClick={() => setOverrideA("off")} style={smallChipStyle(overrideA === "off", BLUE)}>
              Primary rule
            </button>
            <button type="button" aria-pressed={overrideA === "on"} onClick={() => setOverrideA("on")} style={smallChipStyle(overrideA === "on", VERMILION)}>
              Override (a)
            </button>
          </div>
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${PLANETS[maheshvaraAPlanet].color}10`, border: `1px solid ${PLANETS[maheshvaraAPlanet].color}55` }}>
            <p style={{ margin: 0, color: PLANETS[maheshvaraAPlanet].color, fontWeight: 500 }}>
              {overrideA === "off"
                ? `AK in ${akSign.label} → 8th = ${SIGNS[signOffset(akSignIndex, 7)].label} → Maheśvara = ${PLANETS[eighthFromAk].label}. Override (a) does not apply: ${PLANETS[eighthFromAk].label} is in Aries, not the 8th-from-AK.`
                : `Override (a) applied: the 8th-from-AK lord is placed in the 8th-from-AK, so Maheśvara = 12th-from-AK lord ${PLANETS[twelfthFromAk].label}. (This is not Chart H1's actual situation.)`}
            </p>
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
            Override (b) — Rāhu/Ketu in 1st or 8th from AK — cannot be checked for Chart H1 because this module&apos;s seven-graha computations do not include node positions.
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Step 3b — Maheśvara Procedure B</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
            Confirm 8th-from-AK lord only if exalted or own-sign
          </h3>
          <MaheshvaraBSvg />
          <div style={{ display: "grid", gap: "0.55rem", marginTop: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", padding: "0.55rem 0.75rem", borderRadius: 6, border: `1px solid ${PLANETS[sixthFromAk].color}44`, background: `${PLANETS[sixthFromAk].color}10` }}>
              <span style={{ color: PLANETS[sixthFromAk].color, fontWeight: 600 }}>6th from AK: {PLANETS[sixthFromAk].label}</span>
              <span style={{ color: INK_SECONDARY, fontWeight: 400 }}>enemy sign</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", padding: "0.55rem 0.75rem", borderRadius: 6, border: `1px solid ${PLANETS[eighthFromAk].color}44`, background: `${PLANETS[eighthFromAk].color}10` }}>
              <span style={{ color: PLANETS[eighthFromAk].color, fontWeight: 600 }}>8th from AK: {PLANETS[eighthFromAk].label}</span>
              <span style={{ color: INK_SECONDARY, fontWeight: 400 }}>debilitated (cancelled)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", padding: "0.55rem 0.75rem", borderRadius: 6, border: `1px solid ${PLANETS[twelfthFromAk].color}44`, background: `${PLANETS[twelfthFromAk].color}10` }}>
              <span style={{ color: PLANETS[twelfthFromAk].color, fontWeight: 600 }}>12th from AK: {PLANETS[twelfthFromAk].label}</span>
              <span style={{ color: INK_SECONDARY, fontWeight: 400 }}>enemy sign</span>
            </div>
          </div>
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GOLD}10`, border: `1px solid ${GOLD}55` }}>
            <p style={{ margin: 0, color: GOLD, fontWeight: 500 }}>
              Procedure B does not resolve cleanly. None of the three candidates is clearly strongest; all are in some classical difficulty.
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Step 4 — Confidence calibration</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.1rem", fontWeight: 600 }}>
          State what resolves and what does not
        </h3>
        <ConfidenceSvg />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "0.75rem", marginTop: "0.75rem" }}>
          <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}10`, padding: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: GREEN, fontWeight: 600 }}>
              <CheckCircle2 size={16} aria-hidden="true" />
              Rudra = {PLANETS[rudra].label}
            </div>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>Clean result. Moon&apos;s own-sign dignity gives a clear winner.</p>
          </div>
          <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}10`, padding: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: GOLD, fontWeight: 600 }}>
              <Scale size={16} aria-hidden="true" />
              Maheśvara = {PLANETS[eighthFromAk].label} (moderate)
            </div>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>Procedure A resolves cleanly; Procedure B does not. Hold with moderate, stated confidence.</p>
          </div>
        </div>
      </section>

      <section style={{ ...cardStyle, background: `${GREEN}0A` }}>
        <div style={{ display: "flex", alignItems: "start", gap: "0.6rem" }}>
          <Sparkles size={20} aria-hidden="true" style={{ color: GREEN, flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, color: GREEN, fontWeight: 600 }}>Genuine convergence — internal confidence only</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              Chapter 4 found Moon as the 2nd-lord maraka by Parāśarī house-lordship. This chapter independently finds Moon as Rudra by Jaimini strength-comparison. Two structurally different systems converge on the same planet. This may modestly increase internal confidence; it is never disclosed as a finding or treated as proof.
            </p>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.1rem", fontWeight: 600 }}>
          Three ways this application is mishandled
        </h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {[
            {
              label: "Comparing planets by absolute longitude instead of degree-within-sign for AK",
              wrong: "A learner compares full 0-360° longitudes rather than 0-30° degree-within-sign, producing a wrong AK.",
              right: "AK compares degree-within-sign only. For Chart H1, Mars at 20° in Gemini beats Saturn at 18° in Aries.",
            },
            {
              label: "Forcing a single confident Maheśvara answer without flagging Procedure B's ambiguity",
              wrong: "Reporting Maheśvara = Saturn with the same confidence as the clean Rudra finding, without noting that Procedure B does not confirm it cleanly.",
              right: "Hold Saturn with moderate, stated confidence: Procedure A resolves; Procedure B produces three-way ambiguity.",
            },
            {
              label: "Treating the Rudra-Maraka convergence as proof rather than increased internal confidence",
              wrong: "Reading the agreement that Moon is both Rudra and Chapter 4's 2nd-lord maraka as a client-disclosable certainty.",
              right: "Convergence across systems modestly increases internal confidence only. It is never a finding and never proof.",
            },
          ].map((item, index) => {
            const open = openMistakes[index];
            return (
              <div key={index} style={{ border: `1px solid ${open ? VERMILION : HAIRLINE}`, borderRadius: 8, background: open ? `${VERMILION}0D` : SURFACE, padding: "0.75rem" }}>
                <button type="button" onClick={() => toggleMistake(index)} style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", color: INK_PRIMARY, fontWeight: 500 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Info size={15} aria-hidden="true" style={{ color: open ? VERMILION : INK_MUTED }} />
                    {item.label}
                  </span>
                </button>
                {open && (
                  <div style={{ marginTop: "0.6rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                    <p style={{ margin: 0, color: VERMILION }}>
                      <span style={{ fontWeight: 600 }}>Overclaim:</span> {item.wrong}
                    </p>
                    <p style={{ margin: "0.35rem 0 0" }}>
                      <span style={{ fontWeight: 600, color: GREEN }}>Honest reading:</span> {item.right}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function AkSvg({ degrees, ak }: { degrees: Record<PlanetKey, number>; ak: PlanetKey }) {
  const sorted = PLANET_ORDER.map((key) => ({ key, ...PLANETS[key], degree: degrees[key] }));
  const maxDegree = Math.max(...sorted.map((p) => p.degree));
  return (
    <svg viewBox="0 0 560 170" role="img" aria-label="Atmakaraka degree ranking for Chart H1">
      <rect x="24" y="20" width="512" height="130" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      {sorted.map((planet, index) => {
        const isAk = planet.key === ak;
        const barHeight = Math.max(12, (planet.degree / maxDegree) * 56);
        const x = 52 + index * 66;
        return (
          <g key={planet.key} transform={`translate(${x} 90)`}>
            <rect x="0" y={-barHeight} width="44" height={barHeight} rx="6" fill={isAk ? GREEN : planet.color} opacity={isAk ? 1 : 0.75} stroke={isAk ? INK_PRIMARY : "none"} strokeWidth={isAk ? 2 : 0} />
            <text x="22" y={-barHeight - 8} textAnchor="middle" fill={isAk ? GREEN : INK_MUTED} fontSize="11" fontWeight={600}>{planet.degree}°</text>
            <text x="22" y="20" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>{planet.short}</text>
            {isAk && <text x="22" y="36" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight={600}>AK</text>}
          </g>
        );
      })}
      <text x="280" y="150" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={500}>Highest degree-within-sign becomes the Ātmakāraka</text>
    </svg>
  );
}

function RudraSvg() {
  return (
    <svg viewBox="0 0 560 220" role="img" aria-label="Rudra strength comparison for Chart H1">
      <rect x="24" y="30" width="512" height="160" rx="8" fill={`${VERMILION}0F`} stroke={HAIRLINE} />
      <circle cx="145" cy="110" r="52" fill={`${PLANETS.moon.color}22`} stroke={PLANETS.moon.color} strokeWidth={4} />
      <text x="145" y="100" textAnchor="middle" fill={PLANETS.moon.color} fontSize="14" fontWeight={600}>2nd lord</text>
      <text x="145" y="120" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>Moon</text>
      <text x="145" y="138" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={500}>own sign</text>
      <circle cx="415" cy="110" r="42" fill={`${PLANETS.saturn.color}18`} stroke={PLANETS.saturn.color} strokeWidth={3} />
      <text x="415" y="100" textAnchor="middle" fill={PLANETS.saturn.color} fontSize="14" fontWeight={600}>8th lord</text>
      <text x="415" y="120" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>Saturn</text>
      <text x="415" y="138" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={500}>debilitated (cancelled)</text>
      <path d="M 197 110 C 255 110, 305 110, 363 110" fill="none" stroke={PLANETS.moon.color} strokeWidth={5} strokeLinecap="round" />
      <polygon points="350,100 365,110 350,120" fill={PLANETS.moon.color} />
      <text x="280" y="90" textAnchor="middle" fill={PLANETS.moon.color} fontSize="13" fontWeight={600}>stronger</text>
    </svg>
  );
}

function MaheshvaraASvg({ overrideA }: { overrideA: OverrideA }) {
  const radius = 78;
  const cx = 160;
  const cy = 120;
  const akIndex = 2; // Gemini
  return (
    <svg viewBox="0 0 560 240" role="img" aria-label="Maheshvara Procedure A">
      <rect x="24" y="20" width="512" height="200" rx="8" fill={`${BLUE}0F`} stroke={HAIRLINE} />
      {Array.from({ length: 12 }, (_, i) => {
        const sign = SIGNS[(akIndex + i) % 12];
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const isAk = i === 0;
        const isEighth = i === 7;
        const isTwelfth = overrideA === "on" && i === 11;
        return (
          <g key={sign.key}>
            <circle cx={x} cy={y} r={20} fill={isAk ? `${GOLD}22` : isEighth ? `${BLUE}22` : isTwelfth ? `${VERMILION}22` : MUTED_FILL} stroke={isAk ? GOLD : isEighth ? BLUE : isTwelfth ? VERMILION : HAIRLINE} strokeWidth={isAk || isEighth || isTwelfth ? 3 : 1} />
            <text x={x} y={y - 3} textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>{sign.label.slice(0, 3)}</text>
            <text x={x} y={y + 9} textAnchor="middle" fill={PLANETS[sign.lord].color} fontSize="9" fontWeight={500}>{PLANETS[sign.lord].short}</text>
          </g>
        );
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" fill={GOLD} fontSize="12" fontWeight={600}>AK</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={500}>Gemini</text>
      <g transform="translate(320 80)">
        <rect x="0" y="0" width="180" height="90" rx="6" fill={overrideA === "on" ? `${VERMILION}10` : `${BLUE}10`} stroke={overrideA === "on" ? VERMILION : BLUE} />
        <text x="90" y="28" textAnchor="middle" fill={overrideA === "on" ? VERMILION : BLUE} fontSize="13" fontWeight={600}>{overrideA === "on" ? "Override (a) active" : "Primary rule"}</text>
        <text x="90" y="52" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>{overrideA === "on" ? `Maheśvara = ${PLANETS.venus.label}` : `Maheśvara = ${PLANETS.saturn.label}`}</text>
        <text x="90" y="74" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={500}>{overrideA === "on" ? "12th-from-AK lord" : "8th-from-AK lord"}</text>
      </g>
    </svg>
  );
}

function MaheshvaraBSvg() {
  return (
    <svg viewBox="0 0 560 220" role="img" aria-label="Maheshvara Procedure B three candidate comparison">
      <rect x="24" y="30" width="512" height="160" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />
      <circle cx="115" cy="110" r="42" fill={`${PLANETS.mars.color}18`} stroke={PLANETS.mars.color} strokeWidth={3} />
      <text x="115" y="102" textAnchor="middle" fill={PLANETS.mars.color} fontSize="13" fontWeight={600}>6th from AK</text>
      <text x="115" y="120" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>Mars</text>
      <text x="115" y="136" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={500}>enemy sign</text>
      <circle cx="280" cy="110" r="42" fill={`${PLANETS.saturn.color}18`} stroke={PLANETS.saturn.color} strokeWidth={3} />
      <text x="280" y="102" textAnchor="middle" fill={PLANETS.saturn.color} fontSize="13" fontWeight={600}>8th from AK</text>
      <text x="280" y="120" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>Saturn</text>
      <text x="280" y="136" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={500}>debilitated</text>
      <circle cx="445" cy="110" r="42" fill={`${PLANETS.venus.color}18`} stroke={PLANETS.venus.color} strokeWidth={3} />
      <text x="445" y="102" textAnchor="middle" fill={PLANETS.venus.color} fontSize="13" fontWeight={600}>12th from AK</text>
      <text x="445" y="120" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>Venus</text>
      <text x="445" y="136" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={500}>enemy sign</text>
      <text x="280" y="185" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight={600}>No candidate is clearly strongest — Procedure B is ambiguous</text>
    </svg>
  );
}

function ConfidenceSvg() {
  return (
    <svg viewBox="0 0 560 120" role="img" aria-label="Confidence calibration">
      <rect x="24" y="20" width="512" height="80" rx="8" fill={`${BLUE}0F`} stroke={HAIRLINE} />
      <rect x="40" y="40" width="220" height="40" rx="6" fill={`${GREEN}22`} stroke={GREEN} />
      <text x="150" y="56" textAnchor="middle" fill={GREEN} fontSize="12" fontWeight={600}>Rudra = Moon</text>
      <text x="150" y="72" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={500}>clean, high confidence</text>
      <rect x="300" y="40" width="220" height="40" rx="6" fill={`${GOLD}22`} stroke={GOLD} />
      <text x="410" y="56" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight={600}>Maheśvara = Saturn</text>
      <text x="410" y="72" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={500}>moderate, Procedure B ambiguous</text>
    </svg>
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

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: SHADOW,
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.76rem",
  fontWeight: 600,
};
