"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BookOpen, Calculator, CircleDot, HelpCircle, Info, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import { IAST } from "@/components/learning-runtime/interactive/../chrome/typography";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
] as const;

const SIGN_LORD: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

interface Preset {
  label: string;
  sun: number;
  moon: number;
  lagna: number;
  isDay: boolean;
  varsaLagna: number;
  partner: string;
}

const PRESETS: Record<string, Preset> = {
  kavya: {
    label: "Kavya — day birth",
    sun: 110,
    moon: 15,
    lagna: 280,
    isDay: true,
    varsaLagna: 280,
    partner: "Venus"
  },
  meera: {
    label: "Meera — night birth",
    sun: 260,
    moon: 80,
    lagna: 320,
    isDay: false,
    varsaLagna: 320,
    partner: "Mars"
  }
};

const PUNYA_HOUSE_THEMES: Record<number, string> = {
  1: "Auspiciousness manifesting in personal effort, wellbeing, and self-expression.",
  2: "Fortune through speech, family resources, and nourishing stability.",
  3: "Merit-bearing initiatives in writing, short travels, and sibling circles.",
  4: "Good karma expressing through home, property, and inner contentment.",
  5: "Auspicious context for creativity, learning, and matters concerning children.",
  6: "Fortune through discipline, service, and overcoming daily obstacles.",
  7: "Good karma in partnerships, contracts, and public dealings.",
  8: "Auspiciousness through research, inheritance, or transformative work.",
  9: "Merit ripening through teachers, pilgrimage, and dharmic alignment.",
  10: "Public career context is favored; recognition comes to visible action.",
  11: "Gains, social expansion, and fulfillment of aims are supported.",
  12: "Spiritual retreat, charity, and foreign connections carry positive charge."
};

function normalize(value: number): number {
  let v = value % 360;
  if (v < 0) v += 360;
  return v;
}

function signName(deg: number): string {
  return SIGNS[Math.floor(normalize(deg) / 30) % 12];
}

function lordName(deg: number): string {
  return SIGN_LORD[signName(deg)] ?? "—";
}

function houseFrom(deg: number, lagna: number): number {
  const sahamSign = Math.floor(normalize(deg) / 30);
  const lagnaSign = Math.floor(normalize(lagna) / 30);
  return ((sahamSign - lagnaSign + 12) % 12) + 1;
}

function formatDeg(deg: number): string {
  const d = normalize(deg);
  const s = Math.floor(d / 30);
  const rest = d - s * 30;
  const degInSign = Math.floor(rest);
  const minutes = Math.floor((rest - degInSign) * 60);
  const seconds = Math.round((((rest - degInSign) * 60) - minutes) * 60);
  return `${degInSign}° ${SIGNS[s % 12]} ${minutes}′ ${seconds}″`;
}

function computePunya(sun: number, moon: number, lagna: number, isDay: boolean): number {
  return isDay
    ? normalize(moon - sun + lagna)
    : normalize(sun - moon + lagna);
}

function computeVivahaA(lagna: number, venus: number, jupiter: number): number {
  return normalize(lagna + venus - jupiter);
}

function computeVivahaB(venus: number, saturn: number, lagna: number): number {
  return normalize(venus - saturn + lagna);
}

function computeVivahaC(venus: number, saturn: number, lagna: number, add30: boolean): number {
  return normalize(venus - saturn + lagna + (add30 ? 30 : 0));
}

export function SahamsOperationalDepthWorkbench() {
  const [tab, setTab] = useState<"punya" | "gap" | "vivaha">("punya");

  // Punya calculator state
  const [punyaPreset, setPunyaPreset] = useState<string>("custom");
  const [isDay, setIsDay] = useState<boolean>(true);
  const [sun, setSun] = useState<number>(110);
  const [moon, setMoon] = useState<number>(15);
  const [lagna, setLagna] = useState<number>(280);
  const [varsaLagna, setVarsaLagna] = useState<number>(280);

  // Vivaha state
  const [vLagna, setVLagna] = useState<number>(280);
  const [vVenus, setVVenus] = useState<number>(45);
  const [vJupiter, setVJupiter] = useState<number>(190);
  const [vSaturn, setVSaturn] = useState<number>(300);
  const [vAdd30, setVAdd30] = useState<boolean>(true);

  const punya = useMemo(
    () => computePunya(sun, moon, lagna, isDay),
    [sun, moon, lagna, isDay]
  );
  const punyaHouse = useMemo(() => houseFrom(punya, varsaLagna), [punya, varsaLagna]);
  const punyaLord = useMemo(() => lordName(punya), [punya]);

  function applyPreset(key: string) {
    setPunyaPreset(key);
    if (key !== "custom") {
      const p = PRESETS[key];
      setIsDay(p.isDay);
      setSun(p.sun);
      setMoon(p.moon);
      setLagna(p.lagna);
      setVarsaLagna(p.varsaLagna);
    }
  }

  function updatePunyaField(field: "sun" | "moon" | "lagna" | "varsaLagna", value: number) {
    setPunyaPreset("custom");
    if (field === "sun") setSun(value);
    else if (field === "moon") setMoon(value);
    else if (field === "lagna") setLagna(value);
    else setVarsaLagna(value);
  }

  function inputRow(label: string, value: number, onChange: (v: number) => void, hint: string) {
    return (
      <div key={label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <label style={{ fontSize: "12px", color: INK_SECONDARY, fontWeight: 600 }}>{label}</label>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="number"
            min={0}
            max={360}
            step={1}
            value={Math.round(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{
              width: "80px",
              padding: "8px 10px",
              borderRadius: "8px",
              border: "1px solid rgba(156, 122, 47, 0.25)",
              background: "#fff",
              color: INK_PRIMARY,
              fontSize: "13px"
            }}
          />
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={Math.round(value)}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ flex: 1, accentColor: GOLD }}
          />
        </div>
        <span style={{ fontSize: "11px", color: INK_MUTED }}>{hint}</span>
      </div>
    );
  }

  const cardSurface = {
    background: "var(--gl-card-surface-solid, #ffffff)",
    border: "1px solid var(--gl-gold-hairline, rgba(156, 122, 47, 0.2))",
    borderRadius: "12px",
    padding: "16px"
  };

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "14px",
        background: "rgba(255, 253, 246, 0.85)",
        border: "1px solid rgba(156, 122, 47, 0.2)",
        boxShadow: "0 10px 40px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "18px"
      }}
      data-interactive="sahams-operational-depth-workbench"
    >
      <div style={{ borderBottom: "1px solid rgba(156, 122, 47, 0.15)", paddingBottom: "14px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 17 — Chapter 3 — Lesson 1
        </span>
        <h3 style={{ fontSize: "22px", fontWeight: 600, color: INK_PRIMARY, margin: "6px 0 0", fontFamily: "var(--font-cormorant), serif" }}>
          The 12 Major Sahams Revisited at Operational Depth
        </h3>
        <p style={{ fontSize: "13.5px", color: INK_SECONDARY, margin: "4px 0 0", lineHeight: "1.45" }}>
          Push Punya Saham to full formulaic detail. Leave Vidya and Yashas as ingredient-only. Map Vivaha Saham source conflicts honestly.
        </p>
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {[
          { key: "punya", label: "Punya Saham", icon: Sparkles },
          { key: "gap", label: "Vidya / Yashas gaps", icon: AlertTriangle },
          { key: "vivaha", label: "Vivaha conflicts", icon: Users }
        ].map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              style={{
                flex: 1,
                minWidth: "150px",
                height: "46px",
                borderRadius: "8px",
                background: active ? GOLD_DEEP : "#ffffff",
                color: active ? "#ffffff" : INK_SECONDARY,
                border: `1.5px solid ${active ? GOLD_DEEP : "rgba(156, 122, 47, 0.15)"}`,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 150ms ease"
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "punya" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ ...cardSurface }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <Calculator size={16} color={GOLD} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: INK_PRIMARY }}>Punya Saham calculator</span>
            </div>
            <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>
              Day birth: <IAST>(Moon − Sun + Lagna) mod 360°</IAST>.{" "}
              Night birth: <IAST>(Sun − Moon + Lagna) mod 360°</IAST>.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              { key: "kavya", label: "Kavya", note: "day" },
              { key: "meera", label: "Meera", note: "night" },
              { key: "custom", label: "Custom", note: "build your own" }
            ].map(({ key, label, note }) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: `1.5px solid ${punyaPreset === key ? GOLD_DEEP : "rgba(156, 122, 47, 0.2)"}`,
                  background: punyaPreset === key ? "rgba(156, 122, 47, 0.08)" : "#ffffff",
                  color: punyaPreset === key ? GOLD_DEEP : INK_SECONDARY,
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {label} <span style={{ fontWeight: 400, color: INK_MUTED }}>({note})</span>
              </button>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "16px",
              ...cardSurface
            }}
          >
            {inputRow("Sun longitude", sun, (v) => updatePunyaField("sun", v), "Reference: daily light / sect marker")}
            {inputRow("Moon longitude", moon, (v) => updatePunyaField("moon", v), "Reference: fluctuating life-mind")}
            {inputRow("Birth lagna", lagna, (v) => updatePunyaField("lagna", v), "Formula anchor")}
            {inputRow("Varṣa lagna", varsaLagna, (v) => updatePunyaField("varsaLagna", v), "House-count anchor")}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "13px", color: INK_SECONDARY }}>Birth sect:</span>
            {[
              { key: true, label: "Day" },
              { key: false, label: "Night" }
            ].map(({ key, label }) => (
              <button
                key={label}
                onClick={() => {
                  setIsDay(key);
                  setPunyaPreset("custom");
                }}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: `1.5px solid ${isDay === key ? GOLD_DEEP : "rgba(156, 122, 47, 0.2)"}`,
                  background: isDay === key ? GOLD_DEEP : "#ffffff",
                  color: isDay === key ? "#ffffff" : INK_SECONDARY,
                  fontSize: "12.5px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            <div style={{ ...cardSurface, borderLeft: `4px solid ${GOLD}` }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>Computed Punya Saham</span>
              <div style={{ fontSize: "20px", fontWeight: 600, marginTop: "6px" }}>{formatDeg(punya)}</div>
              <div style={{ fontSize: "13px", color: INK_SECONDARY, marginTop: "4px" }}>
                Lord: <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>{punyaLord}</span>
              </div>
              <div style={{ fontSize: "13px", color: INK_SECONDARY, marginTop: "2px" }}>
                From Varṣa lagna: <span style={{ color: INK_PRIMARY, fontWeight: 600 }}>house {punyaHouse}</span>
              </div>
            </div>

            <div style={{ ...cardSurface, borderLeft: `4px solid ${GREEN}` }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GREEN, letterSpacing: "0.1em", textTransform: "uppercase" }}>Operational reading</span>
              <div style={{ fontSize: "13.5px", color: INK_PRIMARY, marginTop: "6px", lineHeight: "1.5" }}>
                {PUNYA_HOUSE_THEMES[punyaHouse]}
              </div>
              <p style={{ fontSize: "12px", color: INK_MUTED, margin: "10px 0 0", lineHeight: "1.45" }}>
                The saham describes favorable ambient context, not a guaranteed outcome. Convergence with the Varṣeśa or Ithasala patterns is required for stronger timing.
              </p>
            </div>
          </div>

          {(punyaPreset === "kavya" || punyaPreset === "meera") && (
            <div style={{ ...cardSurface, background: "rgba(47, 125, 85, 0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <BookOpen size={16} color={GREEN} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: INK_PRIMARY }}>Worked example: {PRESETS[punyaPreset].label}</span>
              </div>
              <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>
                Punya falls in the <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>{punyaHouse}th house</strong>, lorded by{" "}
                <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>{punyaLord}</strong>.
                {" "}
                {punyaPreset === "kavya"
                  ? "Here Venus (the Varṣeśa / Ithasala partner) adds convergence to the 10th-house career context."
                  : "Here the Sun as 7th-house lord brings partnership and contract themes to the fore; link to the annual Varṣeśa for timing."}
              </p>
            </div>
          )}

          <div style={{ ...cardSurface, display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={16} color={GOLD} />
              <span style={{ fontSize: "13px", fontWeight: 600 }}>Zodiac strip</span>
            </div>
            <ZodiacStrip points={[
              { deg: sun, label: "Sun", color: RED },
              { deg: moon, label: "Moon", color: AMBER },
              { deg: lagna, label: "Lagna", color: INK_SECONDARY },
              { deg: punya, label: "Punya", color: GREEN }
            ]} />
          </div>
        </div>
      )}

      {tab === "gap" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ ...cardSurface, borderLeft: `4px solid ${AMBER}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <AlertTriangle size={18} color={AMBER} />
              <span style={{ fontSize: "14px", fontWeight: 600, color: INK_PRIMARY }}>Disclosed ingredient-only gap</span>
            </div>
            <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0, lineHeight: "1.55" }}>
              The foundation lesson names the planets that make up Vidyā and Yashas Sahams, but it does not publish the exact canonical formula or day/night reversal order.
              Tājika source texts disagree on component order and on whether the reversal mirrors Punya literally or uses a separate rule. Do not invent a number.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
            <div style={{ ...cardSurface }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <BookOpen size={16} color={GOLD} />
                <span style={{ fontSize: "13px", fontWeight: 600 }}>Vidyā Saham</span>
              </div>
              <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>
                Ingredients: <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>Mercury, Sun, Lagna</strong>.
              </p>
              <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: "8px 0 0", lineHeight: "1.5" }}>
                Domain: scholarship, examinations, knowledge acquisition.
              </p>
              <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", background: "rgba(217, 119, 6, 0.08)" }}>
                <span style={{ fontSize: "12px", color: AMBER, fontWeight: 600 }}>Formula status:</span>
                <p style={{ fontSize: "12px", color: INK_SECONDARY, margin: "4px 0 0" }}>
                  Day/night order not confirmed in this curriculum. Compute only if you cite a specific external authority.
                </p>
              </div>
            </div>

            <div style={{ ...cardSurface }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <Sparkles size={16} color={GOLD} />
                <span style={{ fontSize: "13px", fontWeight: 600 }}>Yashas Saham</span>
              </div>
              <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>
                Ingredients: <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>Jupiter, Sun, Lagna</strong>.
              </p>
              <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: "8px 0 0", lineHeight: "1.5" }}>
                Domain: public reputation, recognition, social standing.
              </p>
              <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", background: "rgba(217, 119, 6, 0.08)" }}>
                <span style={{ fontSize: "12px", color: AMBER, fontWeight: 600 }}>Formula status:</span>
                <p style={{ fontSize: "12px", color: INK_SECONDARY, margin: "4px 0 0" }}>
                  Ingredient list only; operational computation not yet standardized.
                </p>
              </div>
            </div>
          </div>

          <div style={{ ...cardSurface }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <ShieldCheck size={16} color={GREEN} />
              <span style={{ fontSize: "13px", fontWeight: 600 }}>Pedagogical discipline</span>
            </div>
            <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>
              Honest astrology software should mark incomplete formulas as gaps rather than silently picking one source. This preserves trust and invites deeper textual research.
            </p>
          </div>
        </div>
      )}

      {tab === "vivaha" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ ...cardSurface, borderLeft: `4px solid ${RED}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <Users size={18} color={RED} />
              <span style={{ fontSize: "14px", fontWeight: 600, color: INK_PRIMARY }}>Vivaha Saham — source conflict viewer</span>
            </div>
            <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0, lineHeight: "1.55" }}>
              The marriage saham has no single accepted formula. Three versions circulate in Tājika literature and modern commentary. Show them side by side instead of choosing one silently.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
            {[
              {
                key: "A",
                formula: "Lagna + Venus − Jupiter",
                desc: "Anchor the partnership point on the rising sign, move by Venus toward Jupiter's offset.",
                value: computeVivahaA(vLagna, vVenus, vJupiter)
              },
              {
                key: "B",
                formula: "Venus − Saturn + Lagna",
                desc: "Use Venus against Saturn (contraction, obligation) then re-anchor to Lagna.",
                value: computeVivahaB(vVenus, vSaturn, vLagna)
              },
              {
                key: "C",
                formula: "Venus − Saturn + Lagna (+30° conditionally)",
                desc: "Same as B, with some authorities adding 30° under a specified condition.",
                value: computeVivahaC(vVenus, vSaturn, vLagna, vAdd30)
              }
            ].map(({ key, formula, desc, value }) => (
              <div key={key} style={{ ...cardSurface, borderTop: `4px solid ${key === "C" ? AMBER : GOLD}` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.1em", textTransform: "uppercase" }}>Source {key}</span>
                  <span style={{ fontSize: "11px", color: INK_MUTED }}>{formula}</span>
                </div>
                <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>{desc}</p>
                <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", background: "rgba(156, 122, 47, 0.08)" }}>
                  <span style={{ fontSize: "11px", color: INK_MUTED }}>Current inputs yield</span>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: INK_PRIMARY }}>{formatDeg(value)}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ ...cardSurface }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <Calculator size={16} color={GOLD} />
              <span style={{ fontSize: "13px", fontWeight: 600 }}>Conflict inputs</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              {[
                { label: "Lagna", value: vLagna, set: setVLagna },
                { label: "Venus", value: vVenus, set: setVVenus },
                { label: "Jupiter", value: vJupiter, set: setVJupiter },
                { label: "Saturn", value: vSaturn, set: setVSaturn }
              ].map(({ label, value, set }) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontSize: "11px", color: INK_SECONDARY, fontWeight: 600 }}>{label}</label>
                  <input
                    type="number"
                    min={0}
                    max={360}
                    step={1}
                    value={Math.round(value)}
                    onChange={(e) => set(Number(e.target.value))}
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      border: "1px solid rgba(156, 122, 47, 0.25)",
                      background: "#fff",
                      color: INK_PRIMARY,
                      fontSize: "13px"
                    }}
                  />
                </div>
              ))}
            </div>
            <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                id="add30"
                type="checkbox"
                checked={vAdd30}
                onChange={(e) => setVAdd30(e.target.checked)}
                style={{ accentColor: GOLD }}
              />
              <label htmlFor="add30" style={{ fontSize: "13px", color: INK_SECONDARY, cursor: "pointer" }}>
                Apply Source C conditional +30°
              </label>
            </div>
          </div>

          <div style={{ ...cardSurface, background: "rgba(162, 58, 30, 0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <HelpCircle size={16} color={RED} />
              <span style={{ fontSize: "13px", fontWeight: 600 }}>Why this matters</span>
            </div>
            <p style={{ fontSize: "13px", color: INK_SECONDARY, margin: 0, lineHeight: "1.5" }}>
              A client report that picks one marriage-saham formula without disclosure can shift timing advice by an entire sign. Operational depth means surfacing the conflict and letting the astrologer choose consciously from source evidence.
            </p>
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: INK_MUTED }}>
        <Info size={14} />
        <span>House meanings are contextual, not deterministic. Always cross-check with Varṣeśa, Munthā, and Ithasala analysis.</span>
      </div>
    </div>
  );
}

function ZodiacStrip({ points }: { points: { deg: number; label: string; color: string }[] }) {
  const scale = (deg: number) => (normalize(deg) / 360) * 100;
  return (
    <div style={{ position: "relative", height: "52px", borderRadius: "8px", background: "rgba(156, 122, 47, 0.08)", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, display: "flex" }}>
        {SIGNS.map((s, i) => (
          <div
            key={s}
            style={{
              flex: 1,
              borderRight: i === 11 ? "none" : "1px solid rgba(156, 122, 47, 0.12)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              paddingBottom: "4px",
              fontSize: "9px",
              color: INK_MUTED,
              textTransform: "uppercase",
              letterSpacing: "0.02em"
            }}
          >
            {s.slice(0, 3)}
          </div>
        ))}
      </div>
      {points.map((p) => {
        const left = scale(p.deg);
        return (
          <div
            key={p.label}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "4px",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <CircleDot size={14} color={p.color} fill={p.color} />
            <span style={{ fontSize: "10px", fontWeight: 600, color: p.color, whiteSpace: "nowrap", marginTop: "2px" }}>{p.label}</span>
          </div>
        );
      })}
    </div>
  );
}
