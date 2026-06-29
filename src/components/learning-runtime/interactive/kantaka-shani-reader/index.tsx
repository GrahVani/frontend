"use client";

import { useState, useMemo } from "react";
import { ShieldCheck, AlertTriangle, Sparkles } from "lucide-react";
import { IAST } from "../../chrome/typography";
import { RASHIS, polarToCartesian, describeArc } from "../rashi-data";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";
const GREEN = "#2F7D55";
const BLUE = "#3b82f6";
const AMBER = "#f59e0b";
const RED = "#A8412B";
const SATURN_DARK = "#7c2d12";

const SHORT_SIGNS = ["ARI", "TAU", "GEM", "CAN", "LEO", "VIR", "LIB", "SCO", "SAG", "CAP", "AQU", "PIS"];

const PHASES = [
  { key: "mother", label: "Mother", iast: "Mātṛ-Bhāva", start: 0, end: 0.5, icon: "👩" },
  { key: "home", label: "Home", iast: "Gṛha-Sthāna", start: 0.5, end: 1.0, icon: "🏡" },
  { key: "contentment", label: "Sanctuary", iast: "Sukha-Sthāna", start: 1.0, end: 1.5, icon: "💖" },
  { key: "property", label: "Property", iast: "Bhūmi-Kṣetra", start: 1.5, end: 2.0, icon: "🔑" },
  { key: "vehicles", label: "Vehicles", iast: "Vāhana-Śālā", start: 2.0, end: 2.5, icon: "🚗" },
];

const THEMES = [
  { icon: "🏡", label: "Home", text: "Domestic life, relocation, household repairs" },
  { icon: "👩", label: "Mother", text: "Maternal health, caregiving, emotional roots" },
  { icon: "🔑", label: "Property", text: "Land, real estate, inheritance, leases" },
  { icon: "🚗", label: "Vehicles", text: "Conveyances, travel delays, maintenance" },
  { icon: "💖", label: "Happiness", text: "Inner contentment, sleep, emotional foundation" },
];

const CANCELLATIONS = [
  { key: "jupiterAspect", label: "Jupiter aspects Saturn", value: 35 },
  { key: "strong4thLord", label: "Strong natal 4th-lord", value: 20 },
  { key: "benefics4th", label: "Benefics in natal 4th", value: 15 },
];

const WORKED_EXAMPLES = [
  { label: "Locating it", text: "Moon in Leo → Kantaka Śani in Scorpio (4th from Leo)." },
  { label: "A theme", text: "Relocation or property decision surfaces during the 2.5-year transit." },
  { label: "Cancellation", text: "Jupiter aspecting transit Saturn eases the pressure." },
];

export function KantakaShaniReader() {
  const [moonSignNum, setMoonSignNum] = useState<number>(5);
  const [jupiterAspect, setJupiterAspect] = useState<boolean>(false);
  const [strong4thLord, setStrong4thLord] = useState<boolean>(false);
  const [benefics4th, setBenefics4th] = useState<boolean>(false);
  const [transitYear, setTransitYear] = useState<number>(1.2);
  const [selectedZone, setSelectedZone] = useState<string>("home");

  const kantakaSignNum = useMemo(() => ((moonSignNum + 3 - 1) % 12) + 1, [moonSignNum]);
  const moonRashi = useMemo(() => RASHIS.find(r => r.number === moonSignNum) || RASHIS[0], [moonSignNum]);
  const kantakaRashi = useMemo(() => RASHIS.find(r => r.number === kantakaSignNum) || RASHIS[0], [kantakaSignNum]);

  const activePhase = useMemo(() => {
    return PHASES.find(p => transitYear >= p.start && transitYear < p.end) || PHASES[PHASES.length - 1];
  }, [transitYear]);

  const saturnProgress = useMemo(() => (transitYear / 2.5) * 100, [transitYear]);

  const zoneData = useMemo(() => ({
    mother: {
      sanskrit: "Mātṛ-Bhāva",
      descUnstable: "Saturn pressures mother's health and emotional harmony — distance, communication gaps, or heavy caregiving duties.",
      descStable: "Jupiter's aspect and a strong 4th lord protect maternal health and establish structured emotional grounding.",
      remedy: "Support maternal figures; dedicate time to listening and ancestral honoring.",
      statusText: (stable: boolean) => stable ? "Graceful Bond" : "Maternal Pressures"
    },
    home: {
      sanskrit: "Gṛha-Sthāna",
      descUnstable: "Friction in domestic life, unexpected repairs, or sudden relocation demands disrupt your safe space.",
      descStable: "Domestic life stabilizes; relocations or home improvements lead to solid, long-term foundations.",
      remedy: "Maintain Vastu order in the West quadrant; keep a calm domestic atmosphere; organize living spaces.",
      statusText: (stable: boolean) => stable ? "Secure Sanctuary" : "Domestic Friction"
    },
    property: {
      sanskrit: "Bhūmi-Kṣetra",
      descUnstable: "Delays in title deeds, inheritance disputes, and financial outlays for property maintenance.",
      descStable: "Structured property growth; patience leads to solid, appreciating assets and leases.",
      remedy: "Double-check property paperwork; avoid speculative land purchases; give charity to laborers.",
      statusText: (stable: boolean) => stable ? "Solid Assets" : "Property Delays"
    },
    vehicles: {
      sanskrit: "Vāhana-Śālā",
      descUnstable: "Frequent breakdowns, travel delays, accident risks, and high mechanical maintenance expenses.",
      descStable: "Protected conveyances; travels are disciplined, well-planned, and mechanical issues are avoided.",
      remedy: "Drive defensively; perform timely servicing; chant Hanuman Chālīsā before travel.",
      statusText: (stable: boolean) => stable ? "Safe Conveyance" : "Maintenance Overhead"
    },
    contentment: {
      sanskrit: "Sukha-Sthāna",
      descUnstable: "Restlessness, emotional dry spells, sleeplessness, and a constant feeling of psychological burden.",
      descStable: "Quiet contentment, resilience, emotional containment, and meditative stability despite pressure.",
      remedy: "Practice evening breathwork; maintain a sleep journal; allocate 15 minutes of silent reflection daily.",
      statusText: (stable: boolean) => stable ? "Deep Peace" : "Restless Mind"
    }
  }), []);

  const stability = useMemo(() => {
    let score = 30;
    const breakdown: { label: string; value: number }[] = [];
    if (jupiterAspect) { score += 35; breakdown.push({ label: "Jupiter aspect", value: 35 }); }
    if (strong4thLord) { score += 20; breakdown.push({ label: "Strong 4th lord", value: 20 }); }
    if (benefics4th) { score += 15; breakdown.push({ label: "Benefics in 4th", value: 15 }); }
    score = Math.min(100, score);
    let status = "";
    let color = "";
    if (score >= 80) { status = "Stably Anchored"; color = GREEN; }
    else if (score >= 55) { status = "Supported / Workable"; color = BLUE; }
    else { status = "Domestic Pressure"; color = RED; }
    return { score, status, color, breakdown };
  }, [jupiterAspect, strong4thLord, benefics4th]);

  const activeZone = zoneData[selectedZone as keyof typeof zoneData] || zoneData.home;
  const isStable = stability.score >= 55;
  const statusDesc = isStable ? activeZone.descStable : activeZone.descUnstable;

  return (
    <div data-interactive="kantaka-shani-reader" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Kaṇṭaka Śani</IAST> Reader — Saturn in the 4th from the Moon
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          The "thorn Saturn" transit pressures home, mother, property, vehicles, and inner happiness. Less intense than <IAST>sāḍhe-sātī</IAST>, and softened by Jupiter&apos;s aspect and 4th-house strength.
        </p>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
        <SignSelect label="Moon sign" value={moonSignNum} onChange={setMoonSignNum} />
        <Toggle checked={jupiterAspect} onChange={setJupiterAspect} label="Jupiter aspects Saturn (+35%)" />
        <Toggle checked={strong4thLord} onChange={setStrong4thLord} label="Strong 4th lord (+20%)" />
        <Toggle checked={benefics4th} onChange={setBenefics4th} label="Benefics in natal 4th (+15%)" />
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Transit year</span>
          <input type="range" min={0} max={2.5} step={0.1} value={transitYear} onChange={e => setTransitYear(parseFloat(e.target.value))} style={{ width: "120px", accentColor: GOLD }} />
          <span style={{ fontSize: "12px", fontWeight: 900, color: GOLD, minWidth: "46px" }}>{transitYear.toFixed(1)} / 2.5</span>
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>

        {/* Left — wheel + reference */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", alignSelf: "flex-start" }}>4th-from-Moon wheel</h4>
            <KantakaWheel moonSign={moonSignNum} kantakaSign={kantakaSignNum} jupiterAspect={jupiterAspect} />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "9px", color: INK_MUTED, marginTop: "6px" }}>
              <LegendDot color={SATURN_DARK} label="Saturn (thorn)" />
              <LegendDot color={GOLD} label="Moon" />
              <LegendDot color={RED} label="4th from Moon" />
              {jupiterAspect && <LegendDot color={AMBER} label="Jupiter ray" />}
            </div>
          </div>

          {/* Themes reference */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>4th-house themes pressed by Kaṇṭaka Śani</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {THEMES.map(t => (
                <div key={t.label} style={{ display: "flex", gap: "6px", fontSize: "10px", lineHeight: "1.4" }}>
                  <span style={{ fontSize: "12px", flexShrink: 0 }}>{t.icon}</span>
                  <span><strong style={{ color: INK_PRIMARY }}>{t.label}</strong> — <span style={{ color: INK_SECONDARY }}>{t.text}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "8px" }}>2.5-year transit phases</div>
            <div style={{ position: "relative", padding: "0 4px" }}>
              <div style={{ height: "3px", background: "rgba(0,0,0,0.06)", borderRadius: "2px", position: "relative", margin: "14px 0 6px" }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${saturnProgress}%`, background: GOLD, borderRadius: "2px", transition: "width 0.3s ease" }} />
                <div style={{ position: "absolute", left: `calc(${saturnProgress}% - 8px)`, top: "-6px", width: "16px", height: "16px", borderRadius: "50%", background: stability.color, border: "2px solid #ffffff", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8px", color: "#ffffff", transition: "left 0.3s ease" }}>♄</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {PHASES.map(p => {
                  const isActive = activePhase.key === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setSelectedZone(p.key)}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", background: "none", border: "none", padding: "3px 2px", cursor: "pointer", flex: 1, opacity: isActive ? 1 : 0.55 }}
                    >
                      <span style={{ fontSize: "12px" }}>{p.icon}</span>
                      <span style={{ fontSize: "8px", fontWeight: isActive ? 800 : 600, color: selectedZone === p.key ? GOLD_DEEP : INK_SECONDARY, whiteSpace: "nowrap" }}>{p.label}</span>
                      {isActive && <span style={{ width: "100%", height: "2px", background: GOLD, borderRadius: "1px", marginTop: "1px" }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right — stability + zone + education */}
        <div style={{ flex: "1 1 280px", minWidth: "260px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Stability index */}
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <h4 style={{ margin: 0, fontSize: "12px", fontWeight: 800, color: INK_PRIMARY }}>Stability Index</h4>
              <span style={{ fontSize: "14px", fontWeight: 900, color: stability.color }}>{stability.score}%</span>
            </div>
            <div style={{ width: "100%", height: "10px", background: "rgba(0,0,0,0.05)", borderRadius: "5px", overflow: "hidden", marginBottom: "6px" }}>
              <div style={{ width: `${stability.score}%`, height: "100%", background: stability.color, borderRadius: "5px", transition: "width 0.3s ease" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "6px" }}>
              {stability.score >= 55 ? <ShieldCheck size={13} color={stability.color} /> : <AlertTriangle size={13} color={stability.color} />}
              <span style={{ fontSize: "10px", fontWeight: 800, color: stability.color, textTransform: "uppercase" }}>{stability.status}</span>
            </div>
            {stability.breakdown.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {stability.breakdown.map((b, i) => (
                  <span key={i} style={{ fontSize: "9px", color: INK_SECONDARY, background: "rgba(156,122,47,0.06)", padding: "2px 6px", borderRadius: "3px" }}>+{b.value}% {b.label}</span>
                ))}
              </div>
            )}
          </div>

          {/* Zone readout */}
          <div style={{ background: `${stability.color}08`, border: `1.2px solid ${stability.color}`, borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
              <div>
                <h4 style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: GOLD_DEEP }}>
                  {PHASES.find(p => p.key === selectedZone)?.icon} {PHASES.find(p => p.key === selectedZone)?.label}
                </h4>
                <span style={{ fontSize: "10px", color: INK_MUTED, fontStyle: "italic" }}>(<IAST>{activeZone.sanskrit}</IAST>)</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "3px" }}>
                <span style={{ fontSize: "9px", fontWeight: 800, color: isStable ? GREEN : RED, background: isStable ? `${GREEN}10` : `${RED}10`, padding: "2px 6px", borderRadius: "4px" }}>
                  {activeZone.statusText(isStable)}
                </span>
                {activePhase.key === selectedZone && (
                  <span style={{ fontSize: "8px", fontWeight: 800, color: GOLD, background: `${AMBER}10`, padding: "1px 5px", borderRadius: "3px", border: `1px solid ${AMBER}` }}>
                    Active phase
                  </span>
                )}
              </div>
            </div>
            <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.5", color: INK_SECONDARY }}>{statusDesc}</p>
            <div style={{ padding: "8px", borderRadius: "6px", background: "#ffffff", border: "1px solid rgba(156,122,47,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "3px" }}>
                <Sparkles size={10} color={GOLD} />
                <span style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Supportive action</span>
              </div>
              <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.4", color: INK_PRIMARY }}>{activeZone.remedy}</p>
            </div>
          </div>

          {/* Worked examples */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Worked examples</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {WORKED_EXAMPLES.map(ex => (
                <div key={ex.label} style={{ display: "flex", gap: "6px", fontSize: "10px", padding: "4px 6px", borderRadius: "4px", background: "rgba(156,122,47,0.04)" }}>
                  <span style={{ fontWeight: 900, color: GOLD_DEEP, minWidth: "80px" }}>{ex.label}</span>
                  <span style={{ color: INK_SECONDARY }}>{ex.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Source footer */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Source:</strong> Classical gochara — <IAST>Kaṇṭaka Śani</IAST> pressures the <IAST>Bandhu Sthāna</IAST> (4th from Moon). Jupiter&apos;s aspect converts the thorn into discipline. Less intense than <IAST>sāḍhe-sātī</IAST>.
          </div>
        </div>
      </div>
    </div>
  );
}

function SignSelect({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
      <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>{label}</span>
      <select value={value} onChange={e => onChange(Number(e.target.value))} style={{ border: "1px solid rgba(156,122,47,0.25)", borderRadius: "5px", background: "#ffffff", color: INK_PRIMARY, padding: "4px 5px", fontSize: "11px", fontWeight: 700, minWidth: "100px" }}>
        {RASHIS.map(r => <option key={r.number} value={r.number}>{r.nameEnglish} (<IAST>{r.nameIAST}</IAST>)</option>)}
      </select>
    </span>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", color: checked ? GOLD_DEEP : INK_SECONDARY, cursor: "pointer", fontWeight: checked ? 800 : 600 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ accentColor: GOLD }} />
      {label}
    </label>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

function KantakaWheel({ moonSign, kantakaSign, jupiterAspect }: {
  moonSign: number;
  kantakaSign: number;
  jupiterAspect: boolean;
}) {
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const R = 110;

  const coords = useMemo(() => {
    const c: Record<number, { start: number; end: number; mid: number }> = {};
    for (let i = 1; i <= 12; i++) {
      const start = (i - 1) * 30;
      const end = start + 30;
      c[i] = { start, end, mid: start + 15 };
    }
    return c;
  }, []);

  const planetPos = (sign: number, radius: number) => {
    const mid = coords[sign].mid;
    return polarToCartesian(cx, cy, radius, mid);
  };

  const moonPt = planetPos(moonSign, 26);
  const kantakaPt = planetPos(kantakaSign, 54);

  // Jupiter is shown aspecting Saturn from the 10th from Moon (opposite Kantaka) for visual simplicity
  const jupiterSign = ((kantakaSign + 5) % 12) || 12;
  const jupiterPt = planetPos(jupiterSign, 38);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", maxWidth: "100%" }}>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(156,122,47,0.18)" strokeWidth={1.5} />

      {/* Slice backgrounds */}
      {RASHIS.map(r => {
        const { start, end } = coords[r.number];
        const isKantaka = r.number === kantakaSign;
        const isMoon = r.number === moonSign;
        return (
          <path
            key={`slice-${r.number}`}
            d={describeArc(cx, cy, R - 1, start, end)}
            fill={isKantaka ? RED : isMoon ? GOLD : "transparent"}
            fillOpacity={isKantaka ? 0.08 : isMoon ? 0.06 : 0}
            stroke="rgba(156,122,47,0.08)"
            strokeWidth={1}
          />
        );
      })}

      {/* Slice lines */}
      {RASHIS.map(r => {
        const { start } = coords[r.number];
        const outer = polarToCartesian(cx, cy, R, start);
        return <line key={`line-${r.number}`} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke="rgba(156,122,47,0.12)" strokeWidth={1} />;
      })}

      {/* Sign labels */}
      {RASHIS.map(r => {
        const { mid } = coords[r.number];
        const pEng = polarToCartesian(cx, cy, 94, mid);
        const pDev = polarToCartesian(cx, cy, 80, mid);
        return (
          <g key={`lbl-${r.number}`}>
            <text x={pEng.x} y={pEng.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8.5px", fontWeight: 800, fill: INK_PRIMARY }}>{SHORT_SIGNS[r.number - 1]}</text>
            <text x={pDev.x} y={pDev.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7.5px", fill: INK_MUTED }}>{r.nameDevanagari}</text>
          </g>
        );
      })}

      {/* Kantaka arc band */}
      {(() => {
        const { start, end } = coords[kantakaSign];
        return (
          <path
            d={describeArc(cx, cy, R - 5, start, end)}
            fill="none"
            stroke={RED}
            strokeWidth={5}
            strokeLinecap="butt"
            opacity={0.4}
          />
        );
      })()}

      {/* Jupiter aspect ray */}
      {jupiterAspect && (
        <>
          <line x1={jupiterPt.x} y1={jupiterPt.y} x2={kantakaPt.x} y2={kantakaPt.y} stroke={AMBER} strokeWidth={2.5} strokeDasharray="4 3" opacity={0.9} />
          <circle cx={(jupiterPt.x + kantakaPt.x) / 2} cy={(jupiterPt.y + kantakaPt.y) / 2} r={8} fill={AMBER} stroke="#ffffff" strokeWidth={1.5} />
          <text x={(jupiterPt.x + kantakaPt.x) / 2} y={(jupiterPt.y + kantakaPt.y) / 2 + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "7px", fill: "#ffffff" }}>🛡️</text>
        </>
      )}

      {/* Center hub */}
      <circle cx={cx} cy={cy} r={14} fill="#ffffff" stroke="rgba(156,122,47,0.2)" strokeWidth={1} />

      {/* Moon marker */}
      <g>
        <circle cx={moonPt.x} cy={moonPt.y} r={9} fill={GOLD} stroke="#ffffff" strokeWidth={1.5} />
        <text x={moonPt.x} y={moonPt.y + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fill: "#ffffff" }}>☽</text>
      </g>

      {/* Saturn / Kantaka marker */}
      <g>
        <circle cx={kantakaPt.x} cy={kantakaPt.y} r={11} fill={SATURN_DARK} stroke="#ffffff" strokeWidth={1.5} />
        <text x={kantakaPt.x} y={kantakaPt.y + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "10px", fill: "#ffffff", fontWeight: 700 }}>♄</text>
      </g>

      {/* Jupiter marker */}
      {jupiterAspect && (
        <g>
          <circle cx={jupiterPt.x} cy={jupiterPt.y} r={10} fill={GOLD_DEEP} stroke="#ffffff" strokeWidth={1.5} />
          <text x={jupiterPt.x} y={jupiterPt.y + 0.5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fill: "#ffffff", fontWeight: 700 }}>♃</text>
        </g>
      )}
    </svg>
  );
}
