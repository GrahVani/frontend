"use client";

/**
 * Kemadruma + Sade Sati Recap -- Lesson 14.6.5 Interactive
 *
 * Brings both doṣas into one recap surface:
 *   - Kemadruma: Moon + 2nd/12th check + cancellation checklist
 *   - Sade Sati: Moon + Saturn positions + phase detection
 *   - De-fearmongering discipline panel (always visible)
 */

import { useState, useMemo } from "react";
import { IAST } from "../../chrome/typography";
import {
  checkKemadruma,
  checkSadeSati,
  KEMADRUMA_CANCELLATIONS,
  PRESETS,
} from "./data";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Moon,
  CircleDot,
  Shield,
} from "lucide-react";

/* --- Design tokens --- */

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.18))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const INK_PRIMARY = "var(--gl-ink-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-muted, #8A7E5E)";
const GOLD_ACCENT = "var(--gl-gold-accent, #9C7A2F)";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#C8841E";
const BLUE = "#3B82F6";
const PURPLE = "#8B5CF6";

/* --- SVG helpers --- */

function houseXY(cx: number, cy: number, r: number, house: number) {
  const angleDeg = (house - 1) * 30 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

/** Kemadruma diagram: 12-house circle. Moon at its house. 2nd and 12th highlighted. */
function KemadrumaDiagram({ moonHouse, h2Empty, h12Empty }: { moonHouse: number; h2Empty: boolean; h12Empty: boolean }) {
  const w = 280;
  const h = 315;
  const cx = w / 2;
  const cy = h / 2;
  const r = 95;
  const h2 = moonHouse === 12 ? 1 : moonHouse + 1;
  const h12 = moonHouse === 1 ? 12 : moonHouse - 1;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 315 }}>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 32} fill="none" stroke={HAIRLINE} strokeWidth={0.8} strokeDasharray="3 3" />

      {/* House tick marks */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = houseXY(cx, cy, r, i + 1);
        const b = houseXY(cx, cy, r - 8, i + 1);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={HAIRLINE} strokeWidth={1} />;
      })}

      {/* Highlight 2nd and 12th from Moon */}
      {[h2, h12].map((target) => {
        const pos = houseXY(cx, cy, r - 16, target);
        const isEmpty = target === h2 ? h2Empty : h12Empty;
        return (
          <g key={target}>
            <circle cx={pos.x} cy={pos.y} r={14} fill={isEmpty ? `${VERMILION}18` : `${GREEN}18`} stroke={isEmpty ? VERMILION : GREEN} strokeWidth={1.5} />
            <text x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={700} fill={isEmpty ? VERMILION : GREEN}>{isEmpty ? "E" : "O"}</text>
          </g>
        );
      })}

      {/* Moon */}
      {(() => {
        const m = houseXY(cx, cy, r - 16, moonHouse);
        return (
          <g>
            <circle cx={m.x} cy={m.y} r={14} fill={`${AMBER}22`} stroke={AMBER} strokeWidth={2} />
            <text x={m.x} y={m.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={800} fill={AMBER}>Ch</text>
          </g>
        );
      })()}

      {/* House numbers */}
      {Array.from({ length: 12 }, (_, i) => {
        const pos = houseXY(cx, cy, r + 14, i + 1);
        return (
          <text key={i} x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill={INK_MUTED}>{i + 1}</text>
        );
      })}

      {/* Legend */}
      <g transform={`translate(35, ${h - 34})`}>
        <circle cx={6} cy={5} r={5} fill={`${AMBER}22`} stroke={AMBER} strokeWidth={1.5} />
        <text x={16} y={9} fontSize={8} fill={INK_SECONDARY}>Moon</text>
        <circle cx={65} cy={5} r={5} fill={`${VERMILION}18`} stroke={VERMILION} strokeWidth={1.5} />
        <text x={75} y={9} fontSize={8} fill={INK_SECONDARY}>Empty</text>
        <circle cx={125} cy={5} r={5} fill={`${GREEN}18`} stroke={GREEN} strokeWidth={1.5} />
        <text x={135} y={9} fontSize={8} fill={INK_SECONDARY}>Occupied</text>
      </g>
    </svg>
  );
}

/** Sade Sati diagram: 12-house circle. Moon + Saturn. 12-1-2 band highlighted when active. */
function SadeSatiDiagram({ moonHouse, saturnHouse }: { moonHouse: number; saturnHouse: number }) {
  const w = 280;
  const h = 315;
  const cx = w / 2;
  const cy = h / 2;
  const r = 95;

  const h12 = moonHouse === 1 ? 12 : moonHouse - 1;
  const h1 = moonHouse;
  const h2 = moonHouse === 12 ? 1 : moonHouse + 1;
  const inBand = saturnHouse === h12 || saturnHouse === h1 || saturnHouse === h2;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 315 }}>
      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r - 32} fill="none" stroke={HAIRLINE} strokeWidth={0.8} strokeDasharray="3 3" />

      {/* 12-1-2 band highlight */}
      {inBand && [h12, h1, h2].map((target) => {
        const pos = houseXY(cx, cy, r - 16, target);
        const color = target === h12 ? BLUE : target === h1 ? PURPLE : AMBER;
        return (
          <g key={target}>
            <circle cx={pos.x} cy={pos.y} r={22} fill={`${color}10`} stroke={color} strokeWidth={1.5} strokeDasharray="4 2" opacity={0.6} />
          </g>
        );
      })}

      {/* House tick marks */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = houseXY(cx, cy, r, i + 1);
        const b = houseXY(cx, cy, r - 8, i + 1);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={HAIRLINE} strokeWidth={1} />;
      })}

      {/* Moon */}
      {(() => {
        const m = houseXY(cx, cy, r - 16, moonHouse);
        return (
          <g>
            <circle cx={m.x} cy={m.y} r={13} fill={`${AMBER}22`} stroke={AMBER} strokeWidth={2} />
            <text x={m.x} y={m.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={800} fill={AMBER}>Ch</text>
          </g>
        );
      })()}

      {/* Saturn */}
      {(() => {
        const s = houseXY(cx, cy, r - 16, saturnHouse);
        return (
          <g>
            <circle cx={s.x} cy={s.y} r={13} fill={SURFACE} stroke={INK_MUTED} strokeWidth={2} />
            <text x={s.x} y={s.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={9} fontWeight={800} fill={INK_SECONDARY}>Sa</text>
          </g>
        );
      })()}

      {/* House numbers */}
      {Array.from({ length: 12 }, (_, i) => {
        const pos = houseXY(cx, cy, r + 14, i + 1);
        return (
          <text key={i} x={pos.x} y={pos.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill={INK_MUTED}>{i + 1}</text>
        );
      })}

      {/* Legend */}
      <g transform={`translate(26, ${h - 34})`}>
        <circle cx={6} cy={5} r={5} fill={`${AMBER}22`} stroke={AMBER} strokeWidth={1.5} />
        <text x={16} y={9} fontSize={8} fill={INK_SECONDARY}>Moon</text>
        <circle cx={65} cy={5} r={5} fill={SURFACE} stroke={INK_MUTED} strokeWidth={1.5} />
        <text x={75} y={9} fontSize={8} fill={INK_SECONDARY}>Saturn</text>
        <circle cx={125} cy={5} r={5} fill="none" stroke={PURPLE} strokeWidth={1.5} strokeDasharray="3 2" />
        <text x={135} y={9} fontSize={8} fill={INK_SECONDARY}>Sade Sati band</text>
      </g>
    </svg>
  );
}

/* --- Toggle helper --- */

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer select-none">
      <span className="text-xs" style={{ color: INK_SECONDARY }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors"
        style={{ background: checked ? GREEN : HAIRLINE }}
        aria-pressed={checked}
      >
        <span className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform" style={{ transform: checked ? "translateX(14px)" : "translateX(2px)", marginTop: 3 }} />
      </button>
    </label>
  );
}

/* --- Main component --- */

export function KemadrumaSadesatiRecap() {
  const [moonHouse, setMoonHouse] = useState(1);
  const [planetInH2, setPlanetInH2] = useState(false);
  const [planetInH12, setPlanetInH12] = useState(false);
  const [cancellationKeys, setCancellationKeys] = useState<string[]>(["kendra-lagna", "dignified-moon"]);
  const [saturnHouse, setSaturnHouse] = useState(5);

  const kResult = useMemo(
    () => checkKemadruma(moonHouse, planetInH2, planetInH12, cancellationKeys),
    [moonHouse, planetInH2, planetInH12, cancellationKeys],
  );

  const sResult = useMemo(
    () => checkSadeSati(moonHouse, saturnHouse),
    [moonHouse, saturnHouse],
  );

  function toggleCancellation(key: string) {
    setCancellationKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function applyPreset(key: string) {
    const preset = PRESETS.find((p) => p.key === key);
    if (!preset) return;
    setMoonHouse(preset.moonHouse);
    setPlanetInH2(preset.planetInH2);
    setPlanetInH12(preset.planetInH12);
    setCancellationKeys(preset.cancellationKeys);
    setSaturnHouse(preset.saturnHouse);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Kemadruma</IAST> + <IAST>Sāḍhe-Sātī</IAST> Recap
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Two cancellation-rich doṣas revisited under the de-fearmongering discipline.
          </p>
        </div>
      </div>

      {/* Presets */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold" style={{ color: INK_MUTED }}>Presets:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.key}
            onClick={() => applyPreset(preset.key)}
            className="px-2.5 py-1.5 rounded-md text-xs font-semibold"
            style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => applyPreset("both-clear")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
          style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {/* Shared Moon control */}
      <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2 mb-2">
          <Moon size={14} style={{ color: AMBER }} />
          <span className="text-xs font-bold" style={{ color: INK_PRIMARY }}>Natal Moon house (shared)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 12 }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setMoonHouse(i + 1)}
              className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
              style={{
                background: moonHouse === i + 1 ? `${AMBER}18` : "transparent",
                border: `1.5px solid ${moonHouse === i + 1 ? AMBER : HAIRLINE}`,
                color: moonHouse === i + 1 ? AMBER : INK_SECONDARY,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* === Kemadruma column === */}
        <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <Moon size={16} style={{ color: AMBER }} />
            <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
              <IAST>Kemadruma</IAST>
            </h4>
          </div>

          {/* Diagram */}
          <KemadrumaDiagram moonHouse={moonHouse} h2Empty={kResult.h2Empty} h12Empty={kResult.h12Empty} />

          {/* Toggles */}
          <div className="space-y-2">
            <ToggleRow label={`Planet in H${moonHouse === 12 ? 1 : moonHouse + 1} (2nd from Moon)`} checked={planetInH2} onChange={setPlanetInH2} />
            <ToggleRow label={`Planet in H${moonHouse === 1 ? 12 : moonHouse - 1} (12th from Moon)`} checked={planetInH12} onChange={setPlanetInH12} />
          </div>

          {/* Result */}
          <div
            className="rounded-md p-3 space-y-2"
            style={{
              background: `${kResult.severityColor}08`,
              border: `1px solid ${kResult.severityColor}`,
              borderLeft: `3px solid ${kResult.severityColor}`,
            }}
          >
            <div className="flex items-center gap-2">
              {kResult.severity === "cancelled" || kResult.severity === "none" ? (
                <CheckCircle2 size={14} style={{ color: kResult.severityColor }} />
              ) : (
                <AlertTriangle size={14} style={{ color: kResult.severityColor }} />
              )}
              <span className="text-xs font-bold" style={{ color: kResult.severityColor }}>{kResult.severityLabel}</span>
            </div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>{kResult.note}</div>
          </div>

          {/* Cancellations */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold" style={{ color: INK_SECONDARY }}>Cancellation check (any one cancels):</div>
            {KEMADRUMA_CANCELLATIONS.map((c) => {
              const met = cancellationKeys.includes(c.key);
              return (
                <button
                  key={c.key}
                  onClick={() => toggleCancellation(c.key)}
                  className="w-full text-left rounded-md px-2.5 py-1.5 flex items-start gap-2 transition-colors"
                  style={{
                    background: met ? `${GREEN}08` : "transparent",
                    border: `1px solid ${met ? GREEN : HAIRLINE}`,
                    color: met ? GREEN : INK_SECONDARY,
                  }}
                >
                  <span className="text-xs font-bold mt-0.5">{met ? "☑" : "☐"}</span>
                  <span className="text-xs font-medium">{c.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* === Sade Sati column === */}
        <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center gap-2">
            <CircleDot size={16} style={{ color: INK_MUTED }} />
            <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
              <IAST>Sāḍhe-Sātī</IAST>
            </h4>
          </div>

          {/* Diagram */}
          <SadeSatiDiagram moonHouse={moonHouse} saturnHouse={saturnHouse} />

          {/* Saturn selector */}
          <div>
            <div className="text-xs font-bold mb-1.5" style={{ color: INK_SECONDARY }}>Saturn transit house</div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 12 }, (_, i) => {
                const h = i + 1;
                const isActive = h === saturnHouse;
                return (
                  <button
                    key={h}
                    onClick={() => setSaturnHouse(h)}
                    className="w-9 h-9 rounded-md text-xs font-bold transition-colors"
                    style={{
                      background: isActive ? `${INK_MUTED}18` : "transparent",
                      border: `1.5px solid ${isActive ? INK_MUTED : HAIRLINE}`,
                      color: isActive ? INK_MUTED : INK_SECONDARY,
                    }}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Phase result */}
          <div
            className="rounded-md p-3 space-y-2"
            style={{
              background: `${sResult.phaseColor}08`,
              border: `1px solid ${sResult.phaseColor}`,
              borderLeft: `3px solid ${sResult.phaseColor}`,
            }}
          >
            <div className="flex items-center gap-2">
              {sResult.inSadeSati ? (
                <AlertTriangle size={14} style={{ color: sResult.phaseColor }} />
              ) : (
                <CheckCircle2 size={14} style={{ color: sResult.phaseColor }} />
              )}
              <span className="text-xs font-bold" style={{ color: sResult.phaseColor }}>{sResult.phaseLabel}</span>
            </div>
            <div className="text-xs" style={{ color: INK_SECONDARY }}>{sResult.phaseDetail}</div>
            {sResult.notes.length > 0 && (
              <div className="space-y-1 pt-1">
                {sResult.notes.map((n, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <Info size={10} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
                    <span className="text-xs" style={{ color: INK_SECONDARY }}>{n}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* De-fearmongering discipline */}
      <div className="rounded-lg p-4 space-y-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${GREEN}` }}>
        <div className="flex items-center gap-2">
          <Shield size={16} style={{ color: GREEN }} />
          <span className="text-sm font-bold" style={{ color: GREEN }}>De-Fearmongering Discipline</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Identify precisely", text: "Name the doṣa correctly. Kemadruma = empty 2nd/12th from Moon. Sade Sati = Saturn over 12-1-2 from Moon." },
            { title: "Check cancellations / phases", text: "Kemadruma: most charts cancel. Sade Sati: three distinct phases with different textures. Never skip this step." },
            { title: "Frame as maturation", text: "Both are pressure + growth. Not doom. Not automatic disaster. Pressure builds endurance." },
            { title: "Refuse fatalism", text: "Never sell fear. Never predict inescapable misfortune. Never frame remedies as fear-relief transactions." },
          ].map((item, i) => (
            <div key={i} className="rounded-md p-2.5 space-y-1" style={{ border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${GREEN}` }}>
              <div className="text-xs font-bold" style={{ color: GREEN }}>{item.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{item.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Reading Kemadruma as uncancelled", text: "Most charts have at least one cancellation. Always check before mentioning the doṣa." },
            { title: "Treating Sade Sati as blanket doom", text: "It is 7.5 years of phased maturation. Each phase has different texture. Never blanket-predict disaster." },
            { title: "Skipping the discipline", text: "Both doṣas are textbook cases for de-fearmongering. Apply the discipline every time." },
          ].map((m, i) => (
            <div key={i} className="rounded-lg p-3 space-y-1.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${AMBER}` }}>
              <div className="text-xs font-bold" style={{ color: AMBER }}>{m.title}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{m.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
