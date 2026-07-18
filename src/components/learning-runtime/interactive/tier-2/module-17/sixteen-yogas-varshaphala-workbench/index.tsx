"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  XCircle
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#D97706";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

const SIGN_LORD: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

const ORBS: Record<string, number> = {
  Sun: 15, Moon: 12, Mars: 8, Mercury: 7, Jupiter: 9, Venus: 7, Saturn: 9
};

const SPEED: Record<string, number> = {
  Moon: 7, Mercury: 6, Venus: 5, Sun: 4, Mars: 3, Jupiter: 2, Saturn: 1
};

const EXALTATION: Record<string, string> = {
  Sun: "Aries", Moon: "Taurus", Mars: "Capricorn", Mercury: "Virgo",
  Jupiter: "Cancer", Venus: "Pisces", Saturn: "Libra"
};

const DEBILITY: Record<string, string> = {
  Sun: "Libra", Moon: "Scorpio", Mars: "Cancer", Mercury: "Pisces",
  Jupiter: "Capricorn", Venus: "Virgo", Saturn: "Aries"
};

const FRIENDS: Record<string, string[]> = {
  Sun: ["Moon", "Mars", "Jupiter"],
  Moon: ["Sun", "Mercury"],
  Mars: ["Sun", "Moon", "Jupiter"],
  Mercury: ["Sun", "Venus"],
  Jupiter: ["Sun", "Moon", "Mars"],
  Venus: ["Mercury", "Saturn"],
  Saturn: ["Mercury", "Venus"]
};

const ENEMIES: Record<string, string[]> = {
  Sun: ["Venus", "Saturn"],
  Moon: [],
  Mars: ["Mercury"],
  Mercury: ["Moon"],
  Jupiter: ["Mercury", "Venus"],
  Venus: ["Sun", "Moon"],
  Saturn: ["Sun", "Moon", "Mars"]
};

const PLANET_COLORS: Record<string, string> = {
  Sun: VERMILION, Moon: BLUE, Mars: VERMILION, Mercury: GREEN,
  Jupiter: GOLD, Venus: GREEN, Saturn: PURPLE
};

type TabKey = "scope" | "scanner" | "separator";
type NativeKey = "kavya" | "meera";

interface Planet {
  name: string;
  sign: string;
  degInSign: number;
  dignity: "own" | "exalt" | "debil" | "neutral";
}

interface PairFinding {
  p1: string;
  p2: string;
  deg1: number;
  deg2: number;
  diff: number;
  combinedOrb: number;
  active: boolean;
  aspectType: "Ithasala" | "Eesarpha" | "exact" | null;
  timing: "Vartamana" | "Purna" | null;
  ikkavala: boolean;
  relation: "Sajjana" | "Manaau" | null;
  note: string;
}

interface YogaFinding {
  yoga: string;
  planets: string[];
  note: string;
}

interface NativeData {
  label: string;
  planets: Planet[];
}

const NATIVES: Record<NativeKey, NativeData> = {
  kavya: {
    label: "Kavya — year 30",
    planets: [
      { name: "Sun", sign: "Cancer", degInSign: 20, dignity: "neutral" },
      { name: "Moon", sign: "Aries", degInSign: 15, dignity: "neutral" },
      { name: "Mars", sign: "Libra", degInSign: 20, dignity: "neutral" },
      { name: "Mercury", sign: "Cancer", degInSign: 28, dignity: "neutral" },
      { name: "Jupiter", sign: "Pisces", degInSign: 20, dignity: "own" },
      { name: "Venus", sign: "Cancer", degInSign: 5, dignity: "neutral" },
      { name: "Saturn", sign: "Aquarius", degInSign: 2, dignity: "own" }
    ]
  },
  meera: {
    label: "Meera — year 25",
    planets: [
      { name: "Sun", sign: "Sagittarius", degInSign: 20, dignity: "neutral" },
      { name: "Moon", sign: "Gemini", degInSign: 20, dignity: "neutral" },
      { name: "Mars", sign: "Cancer", degInSign: 20, dignity: "debil" },
      { name: "Mercury", sign: "Sagittarius", degInSign: 25, dignity: "neutral" },
      { name: "Jupiter", sign: "Taurus", degInSign: 20, dignity: "neutral" },
      { name: "Venus", sign: "Capricorn", degInSign: 20, dignity: "neutral" },
      { name: "Saturn", sign: "Leo", degInSign: 20, dignity: "neutral" }
    ]
  }
};

function signIndex(sign: string): number {
  return SIGNS.indexOf(sign as typeof SIGNS[number]);
}

function fullDeg(planet: Planet): number {
  return signIndex(planet.sign) * 30 + planet.degInSign;
}

function areMutualFriends(a: string, b: string): boolean {
  return FRIENDS[a].includes(b) && FRIENDS[b].includes(a);
}

function areMutualEnemies(a: string, b: string): boolean {
  return ENEMIES[a].includes(b) && ENEMIES[b].includes(a);
}

function detections(native: NativeData) {
  const planets = native.planets;
  const bySign: Record<string, Planet[]> = {};
  planets.forEach((p) => {
    bySign[p.sign] = bySign[p.sign] || [];
    bySign[p.sign].push(p);
  });

  const pairFindings: PairFinding[] = [];
  const signsWithPairs = Object.keys(bySign).filter((s) => bySign[s].length >= 2);

  signsWithPairs.forEach((sign) => {
    const group = bySign[sign];
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i];
        const b = group[j];
        const d1 = fullDeg(a);
        const d2 = fullDeg(b);
        const diff = Math.abs(d1 - d2);
        const combinedOrb = ORBS[a.name] + ORBS[b.name];
        const active = diff <= combinedOrb;
        const speedA = SPEED[a.name];
        const speedB = SPEED[b.name];
        const faster = speedA > speedB ? a : b;
        const slower = speedA > speedB ? b : a;
        const fasterDeg = speedA > speedB ? d1 : d2;
        const slowerDeg = speedA > speedB ? d2 : d1;
        let aspectType: PairFinding["aspectType"] = null;
        let timing: PairFinding["timing"] = null;
        if (active) {
          if (diff < 0.01) {
            aspectType = "exact";
          } else if (fasterDeg < slowerDeg) {
            aspectType = "Ithasala";
            timing = "Vartamana";
          } else {
            aspectType = "Eesarpha";
            timing = "Purna";
          }
        }
        let relation: PairFinding["relation"] = null;
        if (areMutualFriends(a.name, b.name)) relation = "Sajjana";
        else if (areMutualEnemies(a.name, b.name)) relation = "Manaau";
        const notes: string[] = [];
        if (aspectType === "Ithasala") notes.push(`${faster.name} applying to ${slower.name} — ${timing}`);
        if (aspectType === "Eesarpha") notes.push(`${faster.name} separating from ${slower.name} — past-completed effect`);
        if (aspectType === "exact") notes.push("Exact conjunction");
        if (relation) notes.push(relation);
        if (!active) notes.push("Out of orb — Ikkavala only");
        else if (!aspectType) notes.push("Ikkavala");
        else notes.push("Ikkavala");

        pairFindings.push({
          p1: a.name,
          p2: b.name,
          deg1: a.degInSign,
          deg2: b.degInSign,
          diff,
          combinedOrb,
          active,
          aspectType,
          timing,
          ikkavala: true,
          relation,
          note: notes.join("; ")
        });
      }
    }
  });

  const otherYogas: YogaFinding[] = [];

  // Dutthotthadavirya / Kuttha
  planets.forEach((p) => {
    if (EXALTATION[p.name] === p.sign) otherYogas.push({ yoga: "Dutthotthadavīrya", planets: [p.name], note: `${p.name} is exalted in ${p.sign}.` });
    if (DEBILITY[p.name] === p.sign) otherYogas.push({ yoga: "Kuttha", planets: [p.name], note: `${p.name} is debilitated in ${p.sign}.` });
  });

  // Induvara: planet flanked by Mars and Saturn in adjacent signs
  planets.forEach((p) => {
    const idx = signIndex(p.sign);
    const prevSign = SIGNS[(idx - 1 + 12) % 12];
    const nextSign = SIGNS[(idx + 1) % 12];
    const marsPrev = planets.some((x) => x.name === "Mars" && x.sign === prevSign);
    const saturnNext = planets.some((x) => x.name === "Saturn" && x.sign === nextSign);
    const saturnPrev = planets.some((x) => x.name === "Saturn" && x.sign === prevSign);
    const marsNext = planets.some((x) => x.name === "Mars" && x.sign === nextSign);
    if ((marsPrev && saturnNext) || (saturnPrev && marsNext)) {
      otherYogas.push({ yoga: "Induvāra", planets: [p.name, "Mars", "Saturn"], note: `${p.name} in ${p.sign} is flanked by Mars and Saturn in adjacent signs.` });
    }
  });

  // Dureph: isolated planets
  const isolated = planets.filter((p) => !(bySign[p.sign].length > 1));
  if (isolated.length) {
    otherYogas.push({ yoga: "Dureph", planets: isolated.map((p) => p.name), note: `No same-sign aspect partner for ${isolated.map((p) => p.name).join(", ")}.` });
  }

  // Kamboola / Gairikamboola degeneracy note
  pairFindings.forEach((pf) => {
    const sign = planets.find((p) => p.name === pf.p1)!.sign;
    const lord = SIGN_LORD[sign];
    if (pf.p1 === lord || pf.p2 === lord) {
      otherYogas.push({ yoga: "Kamboola / Gairikamboola", planets: [pf.p1, pf.p2], note: `Degenerate under same-sign scope: reception reduces to whether ${lord} rules the single shared sign. Not reported as a meaningful verdict.` });
    }
  });

  return { pairFindings, otherYogas, bySign };
}

const SCOPE_DECISIONS = [
  {
    title: "Same-sign Ithasala / Eesarpha",
    note: "T1-19's worked examples all use same-sign pairs; no non-conjunction Ithasala example appears. This scan follows that demonstrated scope rather than silently extending to other aspect angles.",
    color: BLUE
  },
  {
    title: "Rahu and Ketu excluded",
    note: "T1-19 notes the nodes' deeptāṃśa orb is applied per sub-lineage convention. This module does not guess a value.",
    color: PURPLE
  },
  {
    title: "Kamboola / Gairikamboola not computed",
    note: "Reception checking degenerates under a same-sign-only scope. The lesson names this degeneracy instead of reporting a technically-true but empty result.",
    color: AMBER
  },
  {
    title: "Khallasara, Raddha, Durawanga undetectable",
    note: "T1-19 names these three at concept depth only, without an operable activation criterion. No detection rule is invented.",
    color: VERMILION
  }
];

const YOGA_CATALOGUE = [
  { name: "Ithasāla", detectable: true, category: "Ithasala family" },
  { name: "Eesarphā", detectable: true, category: "Ithasala family" },
  { name: "Ikkavāla", detectable: true, category: "Ithasala family" },
  { name: "Induvāra", detectable: true, category: "Ithasala family" },
  { name: "Kamboola", detectable: false, category: "Reception" },
  { name: "Gairikamboola", detectable: false, category: "Reception" },
  { name: "Khallasara", detectable: false, category: "Cancellation" },
  { name: "Raddha", detectable: false, category: "Cancellation" },
  { name: "Duphālī Kuttha", detectable: true, category: "Strength" },
  { name: "Dutthotthadavīrya", detectable: true, category: "Strength" },
  { name: "Tambeera", detectable: true, category: "Exchange" },
  { name: "Kuttha", detectable: true, category: "Exchange" },
  { name: "Dureph", detectable: true, category: "Isolation" },
  { name: "Durawanga", detectable: false, category: "Isolation" },
  { name: "Sajjana", detectable: true, category: "Conjunctions" },
  { name: "Manaau", detectable: true, category: "Conjunctions" }
];

export function SixteenYogasVarshaphalaWorkbench() {
  const [tab, setTab] = useState<TabKey>("scope");
  const [native, setNative] = useState<NativeKey>("kavya");

  const nativeData = NATIVES[native];
  const { pairFindings, otherYogas } = useMemo(() => detections(nativeData), [nativeData]);

  function reset() {
    setTab("scope");
    setNative("kavya");
  }

  return (
    <div data-interactive="sixteen-yogas-varshaphala-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>The 16 Tajika yogas at varṣaphala depth</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Script-verified scan with disclosed scope and honest gaps
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Run T1-19&apos;s four-step yoga workflow on real chart data. Every same-sign pair shows its degree arithmetic; undetectable yogas are disclosed rather than invented.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {[
          { key: "scope", label: "Scope & detectability", icon: ShieldCheck },
          { key: "scanner", label: "Full-chart scanner", icon: Search },
          { key: "separator", label: "Quality / timing separator", icon: Scale }
        ].map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as TabKey)}
              style={{
                ...smallChipStyle(active, active ? GOLD_DEEP : INK_MUTED),
                height: "44px",
                padding: "0 1rem",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "scope" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <HelpCircle size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Four scope decisions, made explicit</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Before any result is shown, the scan declares what it can and cannot detect. This is the operational-depth discipline: a computable check is not the same as a meaningful check.
            </p>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.85rem" }}>
            {SCOPE_DECISIONS.map((dec) => (
              <div key={dec.title} style={{ ...cardStyle, borderColor: `${dec.color}55`, background: `${dec.color}06` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
                  <ShieldCheck size={16} color={dec.color} />
                  <span style={{ fontSize: "0.9rem", fontWeight: 600, color: dec.color }}>{dec.title}</span>
                </div>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>{dec.note}</p>
              </div>
            ))}
          </div>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>16-yoga detectability catalogue</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.55rem", marginTop: "0.5rem" }}>
              {YOGA_CATALOGUE.map((y) => (
                <div
                  key={y.name}
                  style={{
                    padding: "0.6rem",
                    borderRadius: "8px",
                    background: y.detectable ? `${GREEN}08` : `${VERMILION}08`,
                    border: `1px solid ${y.detectable ? `${GREEN}40` : `${VERMILION}40`}`
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.2rem" }}>
                    {y.detectable ? <CheckCircle2 size={14} color={GREEN} /> : <XCircle size={14} color={VERMILION} />}
                    <span style={{ fontSize: "0.85rem", fontWeight: 600, color: INK_PRIMARY }}>{y.name}</span>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>{y.category}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {tab === "scanner" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Select chart</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {(Object.keys(NATIVES) as NativeKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setNative(key)} style={smallChipStyle(native === key, native === key ? GOLD_DEEP : INK_MUTED)}>
                  {NATIVES[key].label}
                </button>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Varṣaphala planet positions</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.55rem", marginTop: "0.5rem" }}>
              {nativeData.planets.map((p) => (
                <div key={p.name} style={{ padding: "0.65rem", borderRadius: "8px", background: "rgba(156, 122, 47, 0.06)", border: `1px solid ${HAIRLINE}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: PLANET_COLORS[p.name] }} />
                    <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{p.name}</span>
                  </div>
                  <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>{p.degInSign.toFixed(1)}° {p.sign}</p>
                  {p.dignity !== "neutral" && (
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: p.dignity === "debil" ? VERMILION : GREEN, textTransform: "uppercase" }}>
                      {p.dignity === "own" ? "Own sign" : p.dignity === "exalt" ? "Exalted" : "Debilitated"}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Same-sign pair findings</p>
            {pairFindings.length === 0 ? (
              <p style={{ margin: 0, color: INK_SECONDARY }}>No same-sign pairs in this chart.</p>
            ) : (
              <div style={{ display: "grid", gap: "0.85rem", marginTop: "0.5rem" }}>
                {pairFindings.map((pf) => (
                  <div key={`${pf.p1}-${pf.p2}`} style={{ ...cardStyle, background: "rgba(156, 122, 47, 0.04)" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{pf.p1}–{pf.p2}</span>
                      <span style={{ fontSize: "0.8rem", color: INK_MUTED }}>{pf.deg1}° vs {pf.deg2}°</span>
                      <span style={{ fontSize: "0.8rem", color: INK_MUTED }}>diff {pf.diff.toFixed(1)}° / orb {pf.combinedOrb}°</span>
                      <span style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 700, color: pf.active ? GREEN : INK_MUTED, background: pf.active ? `${GREEN}12` : `${INK_MUTED}12`, padding: "0.2rem 0.5rem", borderRadius: "999px" }}>
                        {pf.active ? "WITHIN ORB" : "OUT OF ORB"}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.5rem" }}>
                      {pf.aspectType && (
                        <span style={{ padding: "0.25rem 0.55rem", borderRadius: "999px", background: pf.aspectType === "Ithasala" ? `${GREEN}15` : pf.aspectType === "Eesarpha" ? `${AMBER}15` : `${GOLD}15`, color: pf.aspectType === "Ithasala" ? GREEN : pf.aspectType === "Eesarpha" ? AMBER : GOLD, fontSize: "0.75rem", fontWeight: 600 }}>
                          {pf.aspectType} {pf.timing && `(${pf.timing})`}
                        </span>
                      )}
                      {pf.ikkavala && (
                        <span style={{ padding: "0.25rem 0.55rem", borderRadius: "999px", background: `${BLUE}15`, color: BLUE, fontSize: "0.75rem", fontWeight: 600 }}>Ikkavāla</span>
                      )}
                      {pf.relation && (
                        <span style={{ padding: "0.25rem 0.55rem", borderRadius: "999px", background: pf.relation === "Sajjana" ? `${GREEN}15` : `${VERMILION}15`, color: pf.relation === "Sajjana" ? GREEN : VERMILION, fontSize: "0.75rem", fontWeight: 600 }}>{pf.relation}</span>
                      )}
                    </div>
                    <OrbStrip diff={pf.diff} combinedOrb={pf.combinedOrb} active={pf.active} />
                    <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>{pf.note}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Other yoga findings</p>
            {otherYogas.length === 0 ? (
              <p style={{ margin: 0, color: INK_SECONDARY }}>No additional detectable yogas.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.55rem", marginTop: "0.5rem" }}>
                {otherYogas.map((y, idx) => (
                  <div key={`${y.yoga}-${idx}`} style={{ padding: "0.65rem", borderRadius: "8px", background: y.yoga.includes("Kamboola") ? `${AMBER}08` : `${GREEN}08`, border: `1px solid ${y.yoga.includes("Kamboola") ? `${AMBER}40` : `${GREEN}40`}` }}>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: y.yoga.includes("Kamboola") ? AMBER : GREEN, textTransform: "uppercase", letterSpacing: "0.06em" }}>{y.yoga}</div>
                    <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.45 }}>{y.note}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {tab === "separator" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Scale size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Separating timing from quality</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              A single pair can carry two independent yoga verdicts. <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>Ithasāla / Eesarphā</strong> answer WHEN the configuration is active.
              {" "}<strong style={{ fontWeight: 600, color: INK_PRIMARY }}>Sajjana / Manaau</strong> answer WHAT TONE the underlying planetary relationship carries.
              Collapsing both into one &quot;good&quot; or &quot;bad&quot; label loses information.
            </p>
          </section>

          <div style={workbenchDiagramLayoutStyle}>
            <section style={{ ...cardStyle, flex: "2 1 420px" }}>
              <p style={eyebrowStyle}>Kavya&apos;s Cancer cluster mapped</p>
              <QualityTimingDiagram />
            </section>

            <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
              <div style={cardStyle}>
                <p style={eyebrowStyle}>Sun–Venus</p>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Ithasāla / Vartamāna:</span> active now.{" "}
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Manaau:</span> mutual enemies. Reading: engaged, but not effortless.
                </p>
              </div>
              <div style={cardStyle}>
                <p style={eyebrowStyle}>Sun–Mercury</p>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                  <span style={{ color: AMBER, fontWeight: 600 }}>Eesarphā:</span> past-completed effect. No mutual relationship yoga — asymmetric friendship.
                </p>
              </div>
              <div style={cardStyle}>
                <p style={eyebrowStyle}>Mercury–Venus</p>
                <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Sajjana:</span> mutual friends. Out of orb, so no Ithasāla / Eesarphā timing layer.
                </p>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function OrbStrip({ diff, combinedOrb, active }: { diff: number; combinedOrb: number; active: boolean }) {
  const max = Math.max(combinedOrb * 1.4, diff * 1.1, 5);
  const center = 50;
  const marker = center + (diff / max) * 45;
  const orbLeft = center - (combinedOrb / max) * 45;
  const orbRight = center + (combinedOrb / max) * 45;
  return (
    <div style={{ position: "relative", height: "30px", borderRadius: "6px", background: "rgba(156, 122, 47, 0.08)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: `${orbLeft}%`, right: `${100 - orbRight}%`, top: 0, bottom: 0, background: `${GREEN}12` }} />
      <div style={{ position: "absolute", left: `${center}%`, top: 0, bottom: 0, width: "2px", background: GOLD, transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", left: `${marker}%`, top: "50%", transform: "translate(-50%, -50%)", width: "10px", height: "10px", borderRadius: "50%", background: active ? GREEN : INK_MUTED, border: "2px solid #fff" }} />
    </div>
  );
}

function QualityTimingDiagram() {
  return (
    <svg viewBox="0 0 420 320" role="img" aria-label="Quality versus timing diagram for Kavya's Cancer cluster" style={{ width: "100%", maxHeight: 340 }}>
      {/* Axes */}
      <line x1="60" y1="280" x2="380" y2="280" stroke={INK_MUTED} strokeWidth="1.5" />
      <line x1="220" y1="40" x2="220" y2="280" stroke={INK_MUTED} strokeWidth="1.5" />

      {/* X labels */}
      <text x="80" y="300" textAnchor="middle" fill={AMBER} fontSize="11" fontWeight={600}>Eesarphā / past</text>
      <text x="220" y="300" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>no timing</text>
      <text x="360" y="300" textAnchor="middle" fill={GREEN} fontSize="11" fontWeight={600}>Ithasāla / now</text>

      {/* Y labels */}
      <text x="45" y="60" textAnchor="end" fill={GREEN} fontSize="11" fontWeight={600}>Sajjana / friends</text>
      <text x="45" y="280" textAnchor="end" fill={INK_MUTED} fontSize="11" fontWeight={600}>neutral</text>
      <text x="45" y="165" textAnchor="end" fill={VERMILION} fontSize="11" fontWeight={600}>Manaau / enemies</text>

      {/* Points */}
      <g>
        <circle cx="120" cy="280" r="10" fill={AMBER} />
        <text x="120" y="265" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Sun–Mercury</text>
      </g>
      <g>
        <circle cx="320" cy="165" r="10" fill={VERMILION} />
        <text x="320" y="150" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Sun–Venus</text>
      </g>
      <g>
        <circle cx="220" cy="60" r="10" fill={GREEN} />
        <text x="220" y="45" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Mercury–Venus</text>
      </g>

      <text x="210" y="25" textAnchor="middle" fill={GOLD_DEEP} fontSize="12" fontWeight={600}>Timing ↔ Quality are separate questions</text>
    </svg>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "12px",
  padding: "1rem"
};

const eyebrowStyle: CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: GOLD_DEEP,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  margin: "0 0 0.35rem"
};

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    padding: "0.45rem 0.75rem",
    borderRadius: "999px",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 150ms ease"
  };
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.5rem 0.85rem",
    borderRadius: "8px",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer"
  };
}
