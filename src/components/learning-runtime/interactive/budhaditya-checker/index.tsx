"use client";

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";
const GREEN = "#2F7D55";
const RED = "#A8412B";
const AMBER = "#f59e0b";

const PRESETS = [
  { label: "Clean ~13°", sunDeg: 4, offset: 13, retro: false },
  { label: "Combust ~3°", sunDeg: 4, offset: 3, retro: false },
  { label: "Borderline ~10°", sunDeg: 4, offset: 10, retro: false },
  { label: "Different sign +28°", sunDeg: 4, offset: 28, retro: false },
  { label: "Retro clean ~8°", sunDeg: 4, offset: 8, retro: true },
];

const RESULTS = [
  { icon: "🧠", label: "Intelligence", text: "Sharp, analytical, Sun-lit Mercury." },
  { icon: "🗣️", label: "Eloquence", text: "Articulate speech, scholarship, teaching." },
  { icon: "🏛️", label: "Recognition", text: "Authority or esteem through intellect." },
];

const EXAMPLES = [
  { label: "Clean", deg: "~13°", outcome: "Strong Budhāditya", note: "in-sign but outside the combustion orb" },
  { label: "Combust", deg: "~3°", outcome: "Qualified", note: "deeply combust — brilliance with caveat" },
  { label: "Borderline", deg: "~10°", outcome: "Convention-dependent", note: "disclose your orb; read with care" },
];

export function BudhadityaChecker() {
  const [sunDeg, setSunDeg] = useState(4);
  const [offset, setOffset] = useState(13);
  const [retro, setRetro] = useState(false);

  const mercLon = sunDeg + offset;
  const sameSign = mercLon >= 0 && mercLon < 30;
  const gap = Math.abs(offset);
  const orb = retro ? 7 : 14;
  const combust = sameSign && gap < orb;
  const deeply = sameSign && gap < 5;

  const verdict = useMemo(() => {
    if (!sameSign) {
      return {
        icon: "✗",
        title: "No Budhāditya",
        color: RED,
        detail: `Mercury is ${mercLon < 0 ? "before" : "past"} the sign boundary (${mercLon < 0 ? mercLon : `+${mercLon - 30}`}°). Mercury and the Sun are no longer in the same rāśi, so the yoga does not form.`,
      };
    }
    if (deeply) {
      return {
        icon: "△",
        title: "Budhāditya — deeply combust",
        color: RED,
        detail: `Mercury and the Sun share the sign, but Mercury is only ${gap}° from the Sun — deeply within the combustion orb (~${orb}°${retro ? " because retrograde" : ""}). The intellect-promise is present but markedly qualified.`,
      };
    }
    if (combust) {
      return {
        icon: "△",
        title: "Budhāditya — combust",
        color: AMBER,
        detail: `Mercury and the Sun share the sign, but Mercury is ${gap}° from the Sun — inside the ~${orb}° combustion orb${retro ? " (retrograde tightens the orb)" : ""}. The yoga is real; read it with the combustion caveat.`,
      };
    }
    return {
      icon: "✓",
      title: "Budhāditya — clean",
      color: GREEN,
      detail: `Mercury and the Sun share the sign AND Mercury is ${gap}° away — outside the ~${orb}° orb. This is the strongest form: in-sign but uncombust. The clean window is narrow.`,
    };
  }, [sameSign, deeply, combust, gap, orb, retro, mercLon]);

  const applyPreset = (p: typeof PRESETS[number]) => {
    setSunDeg(p.sunDeg);
    setOffset(p.offset);
    setRetro(p.retro);
  };

  return (
    <div data-interactive="budhaditya-checker" style={{ padding: "16px", borderRadius: "14px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>

      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Budha-Āditya</IAST> Checker — Same Sign and the Combustion Paradox
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
          <IAST>Budha-Āditya</IAST> = Mercury and the Sun in the same sign. Then check Mercury&apos;s distance from the Sun: outside the combustion orb it is clean; inside, it is qualified, not destroyed.
        </p>
      </div>

      {/* Controls */}
      <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <Control label="Sun at">
            <input type="range" min={0} max={29} step={1} value={sunDeg} onChange={e => setSunDeg(Number(e.target.value))} style={{ width: "140px", accentColor: GOLD }} aria-label="Sun degree in sign" />
            <strong style={{ color: GOLD, fontSize: "14px", minWidth: "36px" }}>{sunDeg}°</strong>
          </Control>
          <Control label="Mercury offset">
            <input type="range" min={-25} max={25} step={1} value={offset} onChange={e => setOffset(Number(e.target.value))} style={{ width: "140px", accentColor: GOLD }} aria-label="Mercury offset from Sun" />
            <strong style={{ color: GOLD, fontSize: "14px", minWidth: "42px" }}>{offset > 0 ? `+${offset}` : offset}°</strong>
          </Control>
          <button
            type="button"
            aria-pressed={retro}
            onClick={() => setRetro(r => !r)}
            style={{
              border: `1px solid ${retro ? GOLD : "rgba(156,122,47,0.25)"}`,
              borderRadius: "5px",
              background: retro ? `${GOLD}10` : "rgba(156,122,47,0.06)",
              color: retro ? GOLD_DEEP : INK_SECONDARY,
              padding: "4px 8px",
              fontSize: "10px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Mercury retrograde {retro ? "ON (orb ~7°)" : "OFF (orb ~14°)"}
          </button>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", alignItems: "center" }}>
          <span style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Try</span>
          {PRESETS.map(p => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              style={{
                fontSize: "9px",
                fontWeight: 700,
                padding: "3px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(156,122,47,0.2)",
                background: "rgba(156,122,47,0.06)",
                color: GOLD_DEEP,
                cursor: "pointer",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main two-column layout */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>

        {/* Left — visual ruler + learning panels */}
        <div style={{ flex: "1 1 320px", minWidth: "280px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <h4 style={{ margin: 0, fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Sign ruler — 0° to 30°</h4>
            <SignRuler sunDeg={sunDeg} mercLon={mercLon} sameSign={sameSign} orb={orb} combust={combust} deeply={deeply} />
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "9px", color: INK_MUTED }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: GOLD }} /> Sun</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} /> Mercury</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><span style={{ width: "12px", height: "8px", borderRadius: "2px", background: `${AMBER}25`, border: `1px solid ${AMBER}` }} /> Combustion band</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><span style={{ width: "12px", height: "8px", borderRadius: "2px", background: `${GREEN}18`, border: `1px solid ${GREEN}` }} /> Clean window</span>
            </div>
          </div>

          {/* Results register */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>What the yoga promises (when clean)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {RESULTS.map(r => (
                <div key={r.label} style={{ display: "flex", gap: "6px", fontSize: "10px", lineHeight: "1.4" }}>
                  <span style={{ fontSize: "12px", flexShrink: 0 }}>{r.icon}</span>
                  <span><strong style={{ color: INK_PRIMARY }}>{r.label}</strong> — <span style={{ color: INK_SECONDARY }}>{r.text}</span></span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "6px", paddingTop: "6px", borderTop: "1px solid rgba(156,122,47,0.1)", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
              Combustion qualifies — it never simply destroys. A deeply combust Mercury may give brilliance that is less outwardly recognised or more bound to the Sun&apos;s authority.
            </div>
          </div>

          {/* Worked examples */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "6px" }}>Worked examples from the lesson</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {EXAMPLES.map(ex => (
                <div key={ex.label} style={{ display: "flex", gap: "8px", alignItems: "baseline", fontSize: "10px", padding: "4px 6px", borderRadius: "4px", background: "rgba(156,122,47,0.04)" }}>
                  <span style={{ fontWeight: 900, color: GOLD_DEEP, minWidth: "55px" }}>{ex.label}</span>
                  <span style={{ fontWeight: 800, color: INK_PRIMARY, minWidth: "38px" }}>{ex.deg}</span>
                  <span style={{ color: INK_SECONDARY }}>{ex.outcome} <span style={{ color: INK_MUTED }}>— {ex.note}</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — status + verdict + protocol */}
        <div style={{ flex: "1 1 260px", minWidth: "240px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Status cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))", gap: "6px" }}>
            <StatusCard label="Same sign?" value={sameSign ? "yes" : "no"} ok={sameSign} />
            <StatusCard label="Sun–Mercury gap" value={`${gap}°`} ok={!combust && sameSign} />
            <StatusCard label="Combust?" value={!sameSign ? "—" : deeply ? "deeply" : combust ? "yes" : "no"} ok={sameSign && !combust} />
          </div>

          {/* Verdict */}
          <div style={{ background: `${verdict.color}10`, border: `1.2px solid ${verdict.color}`, borderRadius: "10px", padding: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
              <span style={{ fontSize: "16px" }}>{verdict.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: 800, color: verdict.color }}>{verdict.title}</span>
            </div>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>{verdict.detail}</p>
          </div>

          {/* Honest-handling protocol */}
          <div style={{ background: "#ffffff", padding: "10px", borderRadius: "8px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", marginBottom: "5px" }}>Honest-handling protocol</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <ProtocolStep n={1} text="Detect — confirm Mercury and the Sun share the same rāśi." />
              <ProtocolStep n={2} text={`Check Mercury's distance — compare to the ~${orb}° combustion orb${retro ? " (retrograde tightens it)" : ""}.`} />
              <ProtocolStep n={3} text="Read clean or qualified — disclose the combustion convention you are using." />
              <ProtocolStep n={4} text="Weigh the whole chart — dignity, daśā, and house modify the result." />
            </div>
          </div>

          {/* Module-close reminder */}
          <div style={{ background: `${AMBER}08`, border: `1px solid ${AMBER}`, borderRadius: "8px", padding: "10px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>🕊️</span>
            <p style={{ margin: 0, fontSize: "10px", lineHeight: "1.45", color: INK_SECONDARY }}>
              <strong style={{ color: AMBER }}>Assess, don't announce.</strong> A yoga is a condition to evaluate — for dignity, combustion, affliction, and doctrine — never a verdict to declare.
            </p>
          </div>

          {/* Source footer */}
          <div style={{ background: SURFACE_MANUSCRIPT, border: "1px solid rgba(156,122,47,0.12)", borderRadius: "8px", padding: "8px", fontSize: "9px", color: INK_MUTED, lineHeight: "1.4" }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST>; <IAST>Phaladīpikā</IAST> (Mantreśvara). Combustion orbs vary by lineage (~12–14° direct, tighter when retrograde). Disclose which convention you follow. Cross-ref: Module 5 (combustion/astaṅgata).
          </div>
        </div>
      </div>
    </div>
  );
}

function Control({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <span style={{ fontSize: "10px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>{label}</span>
      {children}
    </span>
  );
}

function StatusCard({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div style={{ background: "#ffffff", border: "1px solid rgba(156,122,47,0.1)", borderRadius: "6px", padding: "6px", textAlign: "center" }}>
      <div style={{ fontSize: "8px", fontWeight: 800, color: INK_MUTED, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: "12px", fontWeight: 900, color: ok ? GREEN : INK_SECONDARY, marginTop: "2px" }}>{value}</div>
    </div>
  );
}

function ProtocolStep({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: "flex", gap: "6px", fontSize: "10px", lineHeight: "1.4" }}>
      <span style={{ fontWeight: 900, color: GOLD, flexShrink: 0 }}>{n}.</span>
      <span style={{ color: INK_SECONDARY }}>{text}</span>
    </div>
  );
}

function SignRuler({ sunDeg, mercLon, sameSign, orb, combust, deeply }: {
  sunDeg: number;
  mercLon: number;
  sameSign: boolean;
  orb: number;
  combust: boolean;
  deeply: boolean;
}) {
  const width = 360;
  const height = 150;
  const pad = 24;
  const trackY = 68;
  const scale = (width - 2 * pad) / 30;

  const x = (deg: number) => pad + deg * scale;
  const sunX = x(sunDeg);
  const mercX = x(mercLon);

  // Combustion band clipped to the visible sign strip
  const bandLeft = Math.max(pad, x(sunDeg - orb));
  const bandRight = Math.min(width - pad, x(sunDeg + orb));
  const deepLeft = Math.max(pad, x(sunDeg - 5));
  const deepRight = Math.min(width - pad, x(sunDeg + 5));

  // Clean-window edges (in-sign but outside combustion)
  const cleanLeft = pad;
  const cleanRight = width - pad;

  // Off-strip indicator
  const mercOffLeft = mercLon < 0;
  const mercOffRight = mercLon >= 30;
  const mercVisualX = mercOffLeft ? pad : mercOffRight ? width - pad : mercX;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
      {/* Sign strip background */}
      <rect x={pad} y={trackY - 16} width={width - 2 * pad} height={32} rx={6} fill="rgba(156,122,47,0.06)" stroke="rgba(156,122,47,0.18)" strokeWidth={1} />

      {/* Clean-window zones (in-sign but outside combustion band) */}
      {sameSign && bandRight > bandLeft && (
        <>
          <rect x={cleanLeft} y={trackY - 16} width={bandLeft - cleanLeft} height={32} fill={`${GREEN}10`} stroke={GREEN} strokeWidth={1} strokeDasharray="3 2" />
          <rect x={bandRight} y={trackY - 16} width={cleanRight - bandRight} height={32} fill={`${GREEN}10`} stroke={GREEN} strokeWidth={1} strokeDasharray="3 2" />
        </>
      )}

      {/* Degree ticks */}
      {Array.from({ length: 31 }, (_, i) => i).map(d => (
        <line key={d} x1={x(d)} y1={trackY - (d % 5 === 0 ? 16 : 10)} x2={x(d)} y2={trackY + (d % 5 === 0 ? 16 : 10)} stroke="rgba(156,122,47,0.25)" strokeWidth={d % 5 === 0 ? 1 : 0.5} />
      ))}

      {/* Tick labels */}
      {[0, 5, 10, 15, 20, 25, 30].map(d => (
        <text key={d} x={x(d)} y={trackY + 28} textAnchor="middle" style={{ fontSize: "8px", fontWeight: 800, fill: INK_MUTED }}>{d}°</text>
      ))}

      {/* Combustion band */}
      {bandRight > bandLeft && (
        <rect x={bandLeft} y={trackY - 16} width={bandRight - bandLeft} height={32} fill={`${AMBER}18`} stroke={AMBER} strokeWidth={1} />
      )}

      {/* Deep combustion band */}
      {deepRight > deepLeft && (
        <rect x={deepLeft} y={trackY - 16} width={deepRight - deepLeft} height={32} fill={`${RED}15`} stroke={RED} strokeWidth={1} strokeDasharray="3 2" />
      )}

      {/* Sign boundary markers */}
      <line x1={pad} y1={trackY - 20} x2={pad} y2={trackY + 20} stroke={GOLD_DEEP} strokeWidth={2} />
      <line x1={width - pad} y1={trackY - 20} x2={width - pad} y2={trackY + 20} stroke={GOLD_DEEP} strokeWidth={2} />
      <text x={pad} y={trackY - 26} textAnchor="middle" style={{ fontSize: "8px", fontWeight: 900, fill: GOLD_DEEP }}>0°</text>
      <text x={width - pad} y={trackY - 26} textAnchor="middle" style={{ fontSize: "8px", fontWeight: 900, fill: GOLD_DEEP }}>30°</text>

      {/* Zone labels */}
      {bandRight > bandLeft && (
        <text x={(bandLeft + bandRight) / 2} y={trackY - 22} textAnchor="middle" style={{ fontSize: "8px", fontWeight: 800, fill: AMBER }}>combustion orb ~{orb}°</text>
      )}
      {deepRight > deepLeft && (
        <text x={(deepLeft + deepRight) / 2} y={trackY + 5} textAnchor="middle" style={{ fontSize: "7px", fontWeight: 800, fill: RED }}>deep &lt;5°</text>
      )}

      {/* Sun marker */}
      <g>
        <circle cx={sunX} cy={trackY} r={11} fill="#ffffff" stroke={GOLD} strokeWidth={3} />
        <text x={sunX} y={trackY + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "13px", fontWeight: 900, fill: GOLD }}>☉</text>
        <text x={sunX} y={trackY - 22} textAnchor="middle" style={{ fontSize: "8px", fontWeight: 800, fill: GOLD }}>Sun</text>
      </g>

      {/* Mercury marker */}
      <g>
        <circle
          cx={mercVisualX}
          cy={trackY}
          r={11}
          fill="#ffffff"
          stroke={sameSign ? (combust ? AMBER : "#10b981") : RED}
          strokeWidth={3}
        />
        <text x={mercVisualX} y={trackY + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "13px", fontWeight: 900, fill: sameSign ? (combust ? AMBER : "#10b981") : RED }}>☿</text>
        <text x={mercVisualX} y={trackY + 24} textAnchor="middle" style={{ fontSize: "8px", fontWeight: 800, fill: sameSign ? (combust ? AMBER : "#10b981") : RED }}>
          {mercOffLeft ? "< 0°" : mercOffRight ? "> 30°" : `${Math.round(mercLon)}°`}
        </text>
      </g>

      {/* Off-strip arrows */}
      {mercOffLeft && (
        <path d={`M ${mercVisualX + 14} ${trackY} L ${mercVisualX + 22} ${trackY - 5} L ${mercVisualX + 22} ${trackY + 5} Z`} fill={RED} />
      )}
      {mercOffRight && (
        <path d={`M ${mercVisualX - 14} ${trackY} L ${mercVisualX - 22} ${trackY - 5} L ${mercVisualX - 22} ${trackY + 5} Z`} fill={RED} />
      )}

      {/* Gap dimension line */}
      {sameSign && Math.abs(mercLon - sunDeg) > 1.5 && (
        <g>
          <line x1={Math.min(sunX, mercVisualX)} y1={trackY + 40} x2={Math.max(sunX, mercVisualX)} y2={trackY + 40} stroke={INK_MUTED} strokeWidth={1} />
          <line x1={sunX} y1={trackY + 37} x2={sunX} y2={trackY + 43} stroke={INK_MUTED} strokeWidth={1} />
          <line x1={mercVisualX} y1={trackY + 37} x2={mercVisualX} y2={trackY + 43} stroke={INK_MUTED} strokeWidth={1} />
          <text x={(sunX + mercVisualX) / 2} y={trackY + 52} textAnchor="middle" style={{ fontSize: "8px", fontWeight: 800, fill: INK_MUTED }}>{Math.round(Math.abs(mercLon - sunDeg))}° gap</text>
        </g>
      )}
    </svg>
  );
}
