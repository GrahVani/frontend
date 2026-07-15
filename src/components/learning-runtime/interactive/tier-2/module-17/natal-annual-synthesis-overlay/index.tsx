"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  CheckCircle2,
  Copy,
  RefreshCw,
  Scale,
  XCircle
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type NativeKey = "kavya" | "meera";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";
const AMBER = "#D97706";

const PLANET_COLORS: Record<string, string> = {
  Sun: VERMILION, Moon: BLUE, Mars: VERMILION, Mercury: GREEN,
  Jupiter: GOLD, Venus: GREEN, Saturn: PURPLE, Rahu: PURPLE, Ketu: AMBER
};

interface Bhukti {
  lord: string;
  startAge: number;
  endAge: number;
  years: number;
}

const KAVYA_BHUKTIS: Bhukti[] = [
  { lord: "Sun", startAge: 24.506, endAge: 24.806, years: 0.3 },
  { lord: "Moon", startAge: 24.806, endAge: 25.306, years: 0.5 },
  { lord: "Mars", startAge: 25.306, endAge: 25.656, years: 0.35 },
  { lord: "Rahu", startAge: 25.656, endAge: 26.556, years: 0.9 },
  { lord: "Jupiter", startAge: 26.556, endAge: 27.356, years: 0.8 },
  { lord: "Saturn", startAge: 27.356, endAge: 28.306, years: 0.95 },
  { lord: "Mercury", startAge: 28.306, endAge: 29.156, years: 0.85 },
  { lord: "Ketu", startAge: 29.156, endAge: 29.506, years: 0.35 },
  { lord: "Venus", startAge: 29.506, endAge: 30.506, years: 1.0 }
];

const KAVYA_MUDDA: { planet: string; startDay: number; endDay: number }[] = [
  { planet: "Venus", startDay: 1, endDay: 60 },
  { planet: "Sun", startDay: 61, endDay: 78 },
  { planet: "Moon", startDay: 79, endDay: 108 },
  { planet: "Mars", startDay: 109, endDay: 129 },
  { planet: "Rahu", startDay: 130, endDay: 183 },
  { planet: "Jupiter", startDay: 184, endDay: 231 },
  { planet: "Saturn", startDay: 232, endDay: 288 },
  { planet: "Mercury", startDay: 289, endDay: 339 },
  { planet: "Ketu", startDay: 340, endDay: 360 }
];

const INDEPENDENCE_CHECKS = [
  { system: "Tājika Varṣeśa", input: "Aspect-qualification to varṣa-lagna; illustrative Pañcavargīya-bala edge", dependsOnOthers: false },
  { system: "Tājika Ithasāla", input: "Deeptāṁśa orb-scan of annual planetary longitudes", dependsOnOthers: false },
  { system: "Natal Vimśottarī bhukti", input: "Natal Moon nakṣatra and elapsed time from birth balance", dependsOnOthers: false }
];

export function NatalAnnualSynthesisOverlay() {
  const [native, setNative] = useState<NativeKey>("kavya");
  const [showBoundary, setShowBoundary] = useState(false);
  const [copied, setCopied] = useState(false);

  const summaryText = useMemo(() => {
    if (native === "kavya") {
      return "Kavya's varṣa-praveśa moment (age 30.0) falls in Sun mahādaśā, Venus bhukti. Venus is also the Tājika Varṣeśa and the exact applying Ithasāla partner — three independent systems converging on the same planet.";
    }
    return "Meera's chart lacks natal Moon data, so dasha-timing convergence is unavailable. Her natal Lagna-lord (Venus) equals her year-25 Muntha-pati (Venus) — a structural sign-lordship overlap that needs only the natal Lagna.";
  }, [native]);

  function copySummary() {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div data-interactive="natal-annual-synthesis-overlay" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Natal-annual synthesis overlay</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Compare natal Vimśottarī timing with Tājika annual layers
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              See how Kavya&apos;s natal bhukti and annual layers converge on Venus, and how Meera&apos;s minimal natal data still supports a different, genuine integration.
            </p>
          </div>
          <button type="button" onClick={() => { setNative("kavya"); setShowBoundary(false); setCopied(false); }} style={buttonStyle(false, GOLD)}>
            <RefreshCw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Select native</p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button type="button" aria-pressed={native === "kavya"} onClick={() => { setNative("kavya"); setShowBoundary(false); }} style={smallChipStyle(native === "kavya", GREEN)}>
            Kavya — three-system convergence
          </button>
          <button type="button" aria-pressed={native === "meera"} onClick={() => { setNative("meera"); setShowBoundary(false); }} style={smallChipStyle(native === "meera", BLUE)}>
            Meera — structural overlap
          </button>
        </div>
      </section>

      {native === "kavya" ? (
        <>
          <section style={{ ...cardStyle, borderLeft: `4px solid ${GREEN}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Three-system convergence</p>
                <h3 style={{ margin: "0.15rem 0 0", color: GREEN, fontSize: "1.2rem" }}>Venus appears in three independent computations</h3>
              </div>
              <button type="button" onClick={copySummary} style={buttonStyle(false, GOLD)}>
                {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem", marginTop: "0.75rem" }}>
              {[
                { label: "Tājika Varṣeśa", finding: "Venus is year-lord", color: GOLD },
                { label: "Tājika Ithasāla", finding: "Venus is applying partner to Sun", color: VERMILION },
                { label: "Natal Vimśottarī", finding: "Sun MD, Venus bhukti at age 30.0", color: BLUE }
              ].map((item) => (
                <div key={item.label} style={{ padding: "0.75rem", borderRadius: "8px", border: `1px solid ${item.color}`, background: `${item.color}0A` }}>
                  <div style={{ color: item.color, fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>{item.label}</div>
                  <div style={{ color: INK_PRIMARY, fontWeight: 600, marginTop: "0.25rem" }}>{item.finding}</div>
                </div>
              ))}
            </div>
          </section>

          <div style={workbenchTwoColumnStyle}>
            <section style={cardStyle}>
              <p style={eyebrowStyle}>Natal timeline — Kavya age 24.5 to 30.6</p>
              <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                Sun mahādaśā, subdivided into nine bhuktis. Age 30.0 (varṣa-praveśa) falls inside Sun/Venus.
              </p>
              <BhuktiTimeline bhuktis={KAVYA_BHUKTIS} markAge={30.0} />
              <div style={{ display: "grid", gap: "0.45rem", marginTop: "0.75rem" }}>
                {KAVYA_BHUKTIS.map((b) => (
                  <div key={b.lord} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.6rem", borderRadius: "6px", background: b.lord === "Venus" ? `${PLANET_COLORS.Venus}15` : "transparent", border: `1px solid ${b.lord === "Venus" ? PLANET_COLORS.Venus : HAIRLINE}` }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontWeight: b.lord === "Venus" ? 700 : 600, color: INK_PRIMARY }}>
                      <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: PLANET_COLORS[b.lord] }} />
                      Sun/{b.lord}
                    </span>
                    <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>{b.startAge.toFixed(3)}–{b.endAge.toFixed(3)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section style={cardStyle}>
              <p style={eyebrowStyle}>Tājika annual timeline — 360-day year</p>
              <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
                Annual layers. Venus is Varṣeśa and governs days 1–60 of the Mudda-daśā sequence.
              </p>
              <AnnualTimeline />
              <div style={{ display: "grid", gap: "0.45rem", marginTop: "0.75rem" }}>
                {[
                  { label: "Varṣeśa", value: "Venus", note: "year-lord" },
                  { label: "Muntha-pati", value: "Jupiter", note: "secondary thread" },
                  { label: "Ithasāla partner", value: "Venus", note: "applying to Sun" },
                  { label: "Punya-pati", value: "Venus", note: "10th house" }
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.6rem", borderRadius: "6px", background: item.value === "Venus" ? `${PLANET_COLORS.Venus}10` : "transparent", border: `1px solid ${item.value === "Venus" ? PLANET_COLORS.Venus : HAIRLINE}` }}>
                    <span style={{ color: INK_SECONDARY, fontSize: "0.85rem" }}>{item.label}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 600, color: item.value === "Venus" ? PLANET_COLORS.Venus : INK_PRIMARY }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: PLANET_COLORS[item.value] }} />
                      {item.value}
                      <span style={{ color: INK_MUTED, fontSize: "0.75rem" }}>({item.note})</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Independence check</p>
            <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
              A convergence is only meaningful if the systems are independent. Each uses a different input and method.
            </p>
            <div style={{ display: "grid", gap: "0.55rem" }}>
              {INDEPENDENCE_CHECKS.map((check) => (
                <div key={check.system} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", padding: "0.65rem 0.85rem", borderRadius: "8px", border: `1px solid ${GREEN}`, background: `${GREEN}08` }}>
                  <div>
                    <div style={{ color: INK_PRIMARY, fontWeight: 600 }}>{check.system}</div>
                    <div style={{ color: INK_SECONDARY, fontSize: "0.85rem", marginTop: "0.15rem" }}>{check.input}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: GREEN, fontWeight: 700, fontSize: "0.85rem" }}>
                    <CheckCircle2 size={16} />
                    Independent
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div style={workbenchTwoColumnStyle}>
            <section style={{ ...cardStyle, borderLeft: `4px solid ${PURPLE}` }}>
              <p style={eyebrowStyle}>What the natal chart promises</p>
              <p style={{ margin: "0 0 0.55rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
                From Kavya&apos;s Cancer lagna, Venus rules Taurus (11th) and Libra (4th), and sits in Leo (2nd). This is the natal promise the annual convergence can activate.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {["4th lord — home/property", "11th lord — gains/income", "2nd house — family wealth/speech"].map((tag) => (
                  <span key={tag} style={{ padding: "0.25rem 0.55rem", borderRadius: "999px", background: `${PURPLE}15`, color: PURPLE, fontSize: "0.75rem", fontWeight: 700 }}>{tag}</span>
                ))}
              </div>
            </section>

            <section style={{ ...cardStyle, borderLeft: `4px solid ${AMBER}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                <p style={{ ...eyebrowStyle, margin: 0 }}>Mudda-daśā boundary finding</p>
                <button type="button" aria-pressed={showBoundary} onClick={() => setShowBoundary((v) => !v)} style={smallChipStyle(showBoundary, AMBER)}>
                  {showBoundary ? "Hide" : "Show"}
                </button>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                Kavya&apos;s natal mahādaśā change (Sun → Moon) falls near the Mudda-daśā Rāhu/Jupiter boundary. The exact side depends on the day-length convention used to convert 0.506 years.
              </p>
              {showBoundary && (
                <div style={{ marginTop: "0.65rem", padding: "0.65rem 0.85rem", borderRadius: "8px", background: `${AMBER}10`, border: `1px solid ${AMBER}40` }}>
                  <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.6 }}>
                    365.25-day conversion → day 184.8 (Jupiter period). 360-day stylisation → day 182.2 (Rāhu period). The disagreement straddles the boundary; report the sensitivity rather than a false single answer.
                  </p>
                </div>
              )}
            </section>
          </div>
        </>
      ) : (
        <>
          <section style={{ ...cardStyle, borderLeft: `4px solid ${BLUE}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <p style={eyebrowStyle}>Meera&apos;s differently-shaped integration</p>
                <h3 style={{ margin: "0.15rem 0 0", color: BLUE, fontSize: "1.2rem" }}>Structural sign-lordship overlap</h3>
              </div>
              <button type="button" onClick={copySummary} style={buttonStyle(false, GOLD)}>
                {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
              Meera&apos;s chart was built with natal Lagna and natal Sun only — enough for solar-return construction but not for a natal Vimśottarī cascade, which needs natal Moon&apos;s nakṣatra. A different kind of integration is still available.
            </p>
          </section>

          <div style={workbenchTwoColumnStyle}>
            <section style={{ ...cardStyle, borderTop: `4px solid ${VERMILION}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <XCircle size={18} color={VERMILION} />
                <p style={{ ...eyebrowStyle, margin: 0 }}>Not available for Meera</p>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                Dasha-timing convergence requires natal Moon/nakṣatra to set the starting daśā lord. Meera&apos;s chart never specified a natal Moon, so no mahādaśā-bhukti sequence can be computed.
              </p>
            </section>

            <section style={{ ...cardStyle, borderTop: `4px solid ${GREEN}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <CheckCircle2 size={18} color={GREEN} />
                <p style={{ ...eyebrowStyle, margin: 0 }}>Available for Meera</p>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
                Structural sign-lordship overlap requires only the natal Lagna. Meera&apos;s natal Lagna is Libra, lord Venus. Her year-25 Muntha-pati is also Venus.
              </p>
            </section>
          </div>

          <section style={{ ...cardStyle, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={eyebrowStyle}>Structural overlap diagram</p>
            <svg viewBox="0 0 520 180" role="img" aria-label="Meera's natal Lagna lord and Muntha-pati both point to Venus" style={{ width: "100%", maxHeight: 220, marginTop: "0.5rem" }}>
              <rect x="20" y="20" width="480" height="140" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />

              <circle cx="110" cy="90" r="46" fill={`${PURPLE}18`} stroke={PURPLE} strokeWidth="3" />
              <text x="110" y="82" textAnchor="middle" fill={PURPLE} fontSize="13" fontWeight={700}>Natal Lagna</text>
              <text x="110" y="102" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>Libra</text>

              <circle cx="410" cy="90" r="46" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="3" />
              <text x="410" y="82" textAnchor="middle" fill={BLUE} fontSize="13" fontWeight={700}>Muntha-pati</text>
              <text x="410" y="102" textAnchor="middle" fill={INK_PRIMARY} fontSize="12" fontWeight={600}>year 25</text>

              <path d="M 156 90 C 220 50, 300 50, 364 90" fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" />
              <path d="M 156 90 C 220 130, 300 130, 364 90" fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" />

              <circle cx="260" cy="140" r="32" fill={`${PLANET_COLORS.Venus}22`} stroke={PLANET_COLORS.Venus} strokeWidth="3" />
              <text x="260" y="138" textAnchor="middle" fill={PLANET_COLORS.Venus} fontSize="14" fontWeight={700}>Venus</text>
              <text x="260" y="154" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={600}>same planet</text>
            </svg>
          </section>
        </>
      )}

      <section style={{ ...cardStyle, borderLeft: `4px solid ${GOLD}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
          <Scale size={18} color={GOLD} />
          <p style={{ ...eyebrowStyle, margin: 0 }}>Convergence discipline</p>
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
          Convergence raises confidence in a theme, not certainty about a specific event. A chart&apos;s available natal data determines which kind of natal-annual integration it can support — not whether any integration is possible.
        </p>
      </section>
    </div>
  );
}

function BhuktiTimeline({ bhuktis, markAge }: { bhuktis: Bhukti[]; markAge: number }) {
  const start = bhuktis[0].startAge;
  const end = bhuktis[bhuktis.length - 1].endAge;
  const total = end - start;
  return (
    <div style={{ position: "relative", height: "44px", borderRadius: "8px", background: "rgba(156, 122, 47, 0.06)", overflow: "hidden", display: "flex" }}>
      {bhuktis.map((b) => {
        const width = ((b.endAge - b.startAge) / total) * 100;
        const highlighted = markAge >= b.startAge && markAge <= b.endAge;
        return (
          <div
            key={b.lord}
            style={{
              width: `${width}%`,
              height: "100%",
              background: highlighted ? `${PLANET_COLORS[b.lord]}55` : `${PLANET_COLORS[b.lord]}22`,
              borderRight: `1px solid ${HAIRLINE}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "24px"
            }}
          >
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: PLANET_COLORS[b.lord] }}>{b.lord.slice(0, 3)}</span>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: `${((markAge - start) / total) * 100}%`,
          top: 0,
          bottom: 0,
          width: "3px",
          background: VERMILION,
          transform: "translateX(-50%)"
        }}
      />
    </div>
  );
}

function AnnualTimeline() {
  const total = 360;
  return (
    <div style={{ position: "relative", height: "44px", borderRadius: "8px", background: "rgba(156, 122, 47, 0.06)", overflow: "hidden", display: "flex" }}>
      {KAVYA_MUDDA.map((p) => {
        const width = ((p.endDay - p.startDay + 1) / total) * 100;
        return (
          <div
            key={p.planet}
            style={{
              width: `${width}%`,
              height: "100%",
              background: p.planet === "Venus" ? `${PLANET_COLORS[p.planet]}55` : `${PLANET_COLORS[p.planet]}22`,
              borderRight: `1px solid ${HAIRLINE}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "20px"
            }}
          >
            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: PLANET_COLORS[p.planet] }}>{p.planet.slice(0, 3)}</span>
          </div>
        );
      })}
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
    cursor: "pointer"
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
    cursor: "pointer"
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem"
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase"
};
