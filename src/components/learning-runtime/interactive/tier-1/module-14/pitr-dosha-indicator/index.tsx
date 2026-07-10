"use client";

/**
 * Pitṛ-Doṣa Indicator -- Lesson 14.6.4 Interactive
 *
 * Section 7 interactive: surfaces chart signatures and the remedial framework.
 * Sun/Rahu/Saturn/9th-lord controls + signature cards + remedy panel + honest limits.
 */

import { useState, useMemo } from "react";
import { IAST, Devanagari } from '@/components/learning-runtime/interactive/../chrome/typography';
import { checkPitrDosha, REMEDIES, PRESETS } from "./data";
import type { SignatureResult } from "./data";
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  Sparkles,
  Heart,
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

/* --- SVG: Signature gauge --- */

function SignatureGauge({ primary, corroborating }: { primary: number; corroborating: number }) {
  const w = 400;
  const h = 80;
  const cx = w / 2;
  const totalSlots = 6;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" style={{ maxHeight: 90 }}>
      <text x={cx} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK_SECONDARY}>
        Signature count: {primary} primary + {corroborating} corroborating
      </text>

      {/* Slots */}
      {Array.from({ length: totalSlots }, (_, i) => {
        const filled = i < primary + corroborating;
        const isPrimary = i < primary;
        const x = cx - (totalSlots * 22) / 2 + i * 22 + 11;
        return (
          <g key={i}>
            <circle
              cx={x}
              cy={44}
              r={8}
              fill={filled ? (isPrimary ? VERMILION : AMBER) : SURFACE}
              stroke={filled ? (isPrimary ? VERMILION : AMBER) : HAIRLINE}
              strokeWidth={1.5}
              opacity={filled ? 0.8 : 0.4}
            />
          </g>
        );
      })}

      <g transform={`translate(${cx - 60}, 64)`}>
        <circle cx={6} cy={5} r={6} fill={VERMILION} opacity={0.8} />
        <text x={18} y={9} fontSize={8} fill={INK_SECONDARY}>Primary</text>
        <circle cx={65} cy={5} r={6} fill={AMBER} opacity={0.8} />
        <text x={77} y={9} fontSize={8} fill={INK_SECONDARY}>Corroborating</text>
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

/* --- Signature card --- */

function SignatureCard({ sig }: { sig: SignatureResult }) {
  const isPrimary = sig.weight === "primary";
  return (
    <div
      className="rounded-md p-2.5 space-y-1"
      style={{
        background: sig.met ? (isPrimary ? `${VERMILION}08` : `${AMBER}06`) : "transparent",
        border: `1px solid ${sig.met ? (isPrimary ? VERMILION : AMBER) : HAIRLINE}`,
        borderLeft: `3px solid ${sig.met ? (isPrimary ? VERMILION : AMBER) : INK_MUTED}`,
      }}
    >
      <div className="flex items-center gap-1.5">
        {sig.met ? (
          <CheckCircle2 size={12} style={{ color: isPrimary ? VERMILION : AMBER, flexShrink: 0 }} />
        ) : (
          <XCircle size={12} style={{ color: INK_MUTED, flexShrink: 0 }} />
        )}
        <span className="text-xs font-semibold" style={{ color: sig.met ? INK_SECONDARY : INK_MUTED }}>
          {sig.label}
        </span>
        <span
          className="text-xs font-bold ml-auto px-1.5 py-0.5 rounded"
          style={{
            background: isPrimary ? `${VERMILION}12` : `${AMBER}10`,
            color: isPrimary ? VERMILION : AMBER,
          }}
        >
          {isPrimary ? "Primary" : "Corroborating"}
        </span>
      </div>
      <div className="text-xs pl-5" style={{ color: INK_MUTED }}>{sig.detail}</div>
    </div>
  );
}

/* --- Main component --- */

export function PitrDoshaIndicator() {
  const [sunHouse, setSunHouse] = useState(9);
  const [rahuHouse, setRahuHouse] = useState(9);
  const [saturnHouse, setSaturnHouse] = useState(3);
  const [ninthLordHouse, setNinthLordHouse] = useState(9);
  const [ketuWithNinthLord, setKetuWithNinthLord] = useState(true);
  const [maleficsInNinth, setMaleficsInNinth] = useState(true);
  const [fatherDifficulties, setFatherDifficulties] = useState(true);

  const result = useMemo(
    () => checkPitrDosha(sunHouse, rahuHouse, saturnHouse, 9, ninthLordHouse, ketuWithNinthLord, maleficsInNinth, fatherDifficulties),
    [sunHouse, rahuHouse, saturnHouse, ninthLordHouse, ketuWithNinthLord, maleficsInNinth, fatherDifficulties],
  );

  function applyPreset(key: string) {
    const preset = PRESETS.find((p) => p.key === key);
    if (!preset) return;
    setSunHouse(preset.sunHouse);
    setRahuHouse(preset.rahuHouse);
    setSaturnHouse(preset.saturnHouse);
    setNinthLordHouse(preset.ninthLordHouse);
    setKetuWithNinthLord(preset.ketuWithNinthLord);
    setMaleficsInNinth(preset.maleficsInNinth);
    setFatherDifficulties(preset.fatherDifficulties);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Heart size={22} style={{ color: GOLD_ACCENT }} />
        <div>
          <h3 className="text-lg font-semibold" style={{ color: INK_PRIMARY }}>
            <IAST>Pitṛ-Doṣa</IAST> Indicator
          </h3>
          <p className="text-sm" style={{ color: INK_MUTED }}>
            Chart signatures and remedial framework. Interpretive, not rigid.
          </p>
        </div>
      </div>

      {/* Controls + Presets */}
      <div className="rounded-lg p-4 space-y-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: GOLD_ACCENT }} />
            <span className="text-sm font-semibold" style={{ color: INK_PRIMARY }}>Chart Setup</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESETS.map((preset) => (
              <button
                key={preset.key}
                onClick={() => applyPreset(preset.key)}
                className="px-2 py-1.5 rounded-md text-xs font-semibold"
                style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={() => applyPreset("strong")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold"
              style={{ background: "transparent", border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}
            >
              <RotateCcw size={12} />
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <label className="space-y-1">
            <span className="text-xs font-semibold" style={{ color: "#D99622" }}>Sun house</span>
            <select value={sunHouse} onChange={(e) => setSunHouse(Number(e.target.value))} className="w-full rounded-md px-2 py-1.5 text-sm" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>H{i + 1}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold" style={{ color: "#5A5C68" }}>Rahu house</span>
            <select value={rahuHouse} onChange={(e) => setRahuHouse(Number(e.target.value))} className="w-full rounded-md px-2 py-1.5 text-sm" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>H{i + 1}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold" style={{ color: "#5A5A6E" }}>Saturn house</span>
            <select value={saturnHouse} onChange={(e) => setSaturnHouse(Number(e.target.value))} className="w-full rounded-md px-2 py-1.5 text-sm" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>H{i + 1}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-semibold" style={{ color: "#C8A456" }}>9th lord house</span>
            <select value={ninthLordHouse} onChange={(e) => setNinthLordHouse(Number(e.target.value))} className="w-full rounded-md px-2 py-1.5 text-sm" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY }}>
              {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>H{i + 1}</option>)}
            </select>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <ToggleRow label="9th lord conjunct Ketu / Rahu" checked={ketuWithNinthLord} onChange={setKetuWithNinthLord} />
          <ToggleRow label="Malefics in the 9th house" checked={maleficsInNinth} onChange={setMaleficsInNinth} />
          <ToggleRow label="Father-related life difficulties" checked={fatherDifficulties} onChange={setFatherDifficulties} />
        </div>
      </div>

      {/* Gauge + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <SignatureGauge primary={result.primaryCount} corroborating={result.corroboratingCount} />
        </div>

        <div
          className="rounded-lg p-4 space-y-3"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${result.severityColor}` }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>
              <IAST>Pitṛ-Doṣa</IAST> Result
            </h4>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full" style={{ background: `${result.severityColor}15`, color: result.severityColor }}>
              {result.severityLabel}
            </span>
          </div>
          <div className="text-xs space-y-1" style={{ color: INK_SECONDARY }}>
            <div>Primary signatures: <strong>{result.primaryCount}</strong></div>
            <div>Corroborating: <strong>{result.corroboratingCount}</strong></div>
          </div>
          {result.notes.length > 0 && (
            <div className="space-y-1 pt-1">
              {result.notes.map((n, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <Info size={11} style={{ color: AMBER, marginTop: 2, flexShrink: 0 }} />
                  <span className="text-xs" style={{ color: INK_SECONDARY }}>{n}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Signatures */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ChevronRight size={16} style={{ color: GOLD_ACCENT }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Signature Checklist</h4>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {result.signatures.map((sig) => (
            <SignatureCard key={sig.key} sig={sig} />
          ))}
        </div>
      </div>

      {/* Remedial framework */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Heart size={16} style={{ color: GREEN }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Remedial Framework</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {REMEDIES.map((r) => (
            <div key={r.key} className="rounded-lg p-3 space-y-1.5" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `3px solid ${GREEN}` }}>
              <div className="text-xs font-bold" style={{ color: GREEN }}>{r.label}</div>
              <div className="text-xs" style={{ color: INK_SECONDARY }}>{r.detail}</div>
              <div className="text-xs" style={{ color: INK_MUTED }}>Source: {r.source}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Honest limits */}
      <div className="rounded-lg p-4 space-y-2" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderLeft: `4px solid ${AMBER}` }}>
        <div className="flex items-center gap-2">
          <Info size={14} style={{ color: AMBER }} />
          <span className="text-xs font-bold" style={{ color: AMBER }}>Honest Limits</span>
        </div>
        <p className="text-xs" style={{ color: INK_SECONDARY }}>
          <IAST>Pitṛ-Doṣa</IAST> belongs more to <strong>smṛti / Purāṇic ancestral-rite tradition</strong> than to strict BPHS horoscopy.
          Its chart signatures are <strong>interpretive conventions</strong>, not a single classical rule.
          Handle it respectfully, <strong>without fatalism, never as a catastrophe to be paid away</strong>.
          The remedies are meaningful as <strong>acts of remembrance and ethical repair</strong>, not as transactional fear-relief.
        </p>
      </div>

      {/* Common mistakes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} style={{ color: AMBER }} />
          <h4 className="text-sm font-bold" style={{ color: INK_PRIMARY }}>Common Mistakes</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { title: "Treating as rigid classical doṣa", text: "Signatures are interpretive conventions rooted in smṛti/ritual. There is no single canonical definition." },
            { title: "Transactional remedy framing", text: "Never sell rites to 'remove' doom. Frame śrāddha and pind-dāna as remembrance and ethical repair." },
            { title: "Fatalism", text: "Never predict inescapable misfortune. Apply the de-fearmongering discipline: respect without catastrophe." },
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
