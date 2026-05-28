'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { comparatorData, ZodiacSign } from './data';

type ViewMode = 'tropical' | 'sidereal' | 'comparative';

/* ─── Ayanamsa calculation ─── */
function calcAyanamsa(year: number) {
  return Math.max(0, (year - 285) / 72);
}

/* ─── SVG Zodiac Wheel ─── */
function ZodiacWheel({
  signs,
  ayanamsa,
  viewMode,
  onSignClick,
}: {
  signs: ZodiacSign[];
  ayanamsa: number;
  viewMode: ViewMode;
  onSignClick: (sign: ZodiacSign) => void;
}) {
  const CX = 260;
  const CY = 260;

  /* Radii */
  const R_OUTER_RING = 230;
  const R_SIDEREAL = 210;
  const R_TROPICAL = viewMode === 'comparative' ? 155 : 210;
  const R_INNER = viewMode === 'comparative' ? 110 : 140;
  const R_HUB = 70;

  const showSidereal = viewMode === 'sidereal' || viewMode === 'comparative';
  const showTropical = viewMode === 'tropical' || viewMode === 'comparative';

  /* Build arc segments */
  function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
    const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startDeg));
    const y1 = cy + r * Math.sin(toRad(startDeg));
    const x2 = cx + r * Math.cos(toRad(endDeg));
    const y2 = cy + r * Math.sin(toRad(endDeg));
    return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
  }

  function labelPos(cx: number, cy: number, r: number, midDeg: number) {
    const rad = ((midDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  /* Element colour tints (very soft) */
  const elementTint: Record<string, string> = {
    Fire: 'rgba(194,130,32,0.18)',
    Earth: 'rgba(58,140,90,0.14)',
    Air: 'rgba(79,111,168,0.14)',
    Water: 'rgba(122,62,74,0.14)',
  };
  const elementStroke: Record<string, string> = {
    Fire: 'rgba(194,130,32,0.50)',
    Earth: 'rgba(58,140,90,0.40)',
    Air: 'rgba(79,111,168,0.40)',
    Water: 'rgba(122,62,74,0.40)',
  };

  const tropicalOffset = viewMode === 'comparative' ? -ayanamsa : 0;

  return (
    <svg viewBox="0 0 520 520" className="w-full h-auto" style={{ maxWidth: 480, display: 'block', margin: '0 auto' }}>
      <defs>
        <radialGradient id="ztc-hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5C842" stopOpacity={0.20} />
          <stop offset="100%" stopColor="#C9A24D" stopOpacity={0} />
        </radialGradient>
        <filter id="ztc-softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6B4423" floodOpacity="0.18" />
        </filter>
      </defs>

      {/* Ambient background */}
      <circle cx={CX} cy={CY} r={R_OUTER_RING + 20} fill="url(#ztc-hubGlow)" />

      {/* Outer decorative ring */}
      <circle cx={CX} cy={CY} r={R_OUTER_RING} fill="none" stroke="#C9A24D" strokeWidth={1.4} opacity={0.45} />
      <circle cx={CX} cy={CY} r={R_OUTER_RING - 5} fill="none" stroke="#C9A24D" strokeWidth={0.5} opacity={0.30} strokeDasharray="3 3" />

      {/* ── Sidereal ring ── */}
      {showSidereal && (
        <g>
          <circle cx={CX} cy={CY} r={R_SIDEREAL} fill="none" stroke="rgba(79,111,168,0.35)" strokeWidth={1.4} />
          {signs.map((sign, i) => {
            const start = i * 30;
            const end = (i + 1) * 30;
            const midR = viewMode === 'comparative' ? (R_SIDEREAL + R_TROPICAL + 20) / 2 : R_SIDEREAL * 0.72;
            const pos = labelPos(CX, CY, midR, start + 15);
            return (
              <g key={`sid-${sign.id}`}>
                <path
                  d={arcPath(CX, CY, R_SIDEREAL, start, end)}
                  fill={elementTint[sign.element] || 'transparent'}
                  stroke={elementStroke[sign.element] || 'rgba(79,111,168,0.25)'}
                  strokeWidth={0.8}
                  style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
                  onClick={() => onSignClick(sign)}
                />
                {/* Radial divider */}
                <line
                  x1={CX}
                  y1={CY}
                  x2={CX + R_SIDEREAL * Math.cos(((start - 90) * Math.PI) / 180)}
                  y2={CY + R_SIDEREAL * Math.sin(((start - 90) * Math.PI) / 180)}
                  stroke="rgba(79,111,168,0.25)"
                  strokeWidth={0.6}
                />
                {/* Label badge */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={viewMode === 'comparative' ? 10 : 13}
                  fill="var(--gl-card-surface-solid, #FFF9F0)"
                  stroke="var(--gl-gold-hairline, rgba(156,122,47,0.30))"
                  strokeWidth={0.8}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSignClick(sign)}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--gl-ink-primary, #3E2A1F)"
                  fontSize={viewMode === 'comparative' ? 9 : 11}
                  fontWeight={600}
                  style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif', cursor: 'pointer' }}
                  onClick={() => onSignClick(sign)}
                  transform={`rotate(${start + 15}, ${pos.x}, ${pos.y})`}
                >
                  {sign.name.substring(0, 3).toUpperCase()}
                </text>
              </g>
            );
          })}
          {/* Sidereal legend dot */}
          {viewMode === 'comparative' && (
            <g>
              <circle cx={CX - 54} cy={CY + R_OUTER_RING + 14} r={4} fill="rgba(79,111,168,0.50)" />
              <text x={CX - 44} y={CX + R_OUTER_RING + 18} fill="var(--gl-ink-muted, #4F351F)" fontSize={10} fontWeight={600} style={{ fontFamily: 'var(--font-sans), sans-serif' }}>
                Sidereal (Fixed Stars)
              </text>
            </g>
          )}
        </g>
      )}

      {/* ── Tropical ring ── */}
      {showTropical && (
        <g transform={`rotate(${tropicalOffset}, ${CX}, ${CY})`}>
          <circle cx={CX} cy={CY} r={R_TROPICAL} fill="none" stroke="rgba(194,130,32,0.40)" strokeWidth={1.4} />
          {signs.map((sign, i) => {
            const start = i * 30;
            const end = (i + 1) * 30;
            const midR = viewMode === 'comparative' ? (R_TROPICAL + R_INNER + 10) / 2 : R_TROPICAL * 0.72;
            const pos = labelPos(CX, CY, midR, start + 15);
            return (
              <g key={`trop-${sign.id}`}>
                <path
                  d={arcPath(CX, CY, R_TROPICAL, start, end)}
                  fill={viewMode === 'comparative' ? `${elementTint[sign.element] || 'transparent'}` : elementTint[sign.element] || 'transparent'}
                  stroke="rgba(194,130,32,0.25)"
                  strokeWidth={0.6}
                  style={{ cursor: 'pointer', transition: 'fill 0.2s ease' }}
                  onClick={() => onSignClick(sign)}
                />
                <line
                  x1={CX}
                  y1={CY}
                  x2={CX + R_TROPICAL * Math.cos(((start - 90) * Math.PI) / 180)}
                  y2={CY + R_TROPICAL * Math.sin(((start - 90) * Math.PI) / 180)}
                  stroke="rgba(194,130,32,0.25)"
                  strokeWidth={0.6}
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={viewMode === 'comparative' ? 9 : 13}
                  fill="var(--gl-card-surface-solid, #FFF9F0)"
                  stroke="var(--gl-gold-hairline, rgba(156,122,47,0.30))"
                  strokeWidth={0.8}
                  style={{ cursor: 'pointer' }}
                  onClick={() => onSignClick(sign)}
                />
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--gl-ink-primary, #3E2A1F)"
                  fontSize={viewMode === 'comparative' ? 8.5 : 11}
                  fontWeight={600}
                  style={{ fontFamily: 'var(--font-sans), system-ui, sans-serif', cursor: 'pointer' }}
                  onClick={() => onSignClick(sign)}
                  transform={`rotate(${start + 15}, ${pos.x}, ${pos.y})`}
                >
                  {sign.name.substring(0, 3).toUpperCase()}
                </text>
              </g>
            );
          })}
          {/* Tropical legend dot */}
          {viewMode === 'comparative' && (
            <g transform={`rotate(${-tropicalOffset}, ${CX}, ${CY})`}>
              <circle cx={CX + 54} cy={CY + R_OUTER_RING + 14} r={4} fill="rgba(194,130,32,0.55)" />
              <text x={CX + 64} y={CX + R_OUTER_RING + 18} fill="var(--gl-ink-muted, #4F351F)" fontSize={10} fontWeight={600} style={{ fontFamily: 'var(--font-sans), sans-serif' }}>
                Tropical (Seasons)
              </text>
            </g>
          )}
        </g>
      )}

      {/* Inner ring */}
      <circle cx={CX} cy={CY} r={R_INNER} fill="none" stroke="rgba(156,122,47,0.30)" strokeWidth={0.8} />

      {/* ── Center hub ── */}
      <circle cx={CX} cy={CY} r={R_HUB + 10} fill="url(#ztc-hubGlow)" />
      <circle cx={CX} cy={CY} r={R_HUB} fill="rgba(255,252,240,0.92)" stroke="rgba(156,122,47,0.45)" strokeWidth={1.8} filter="url(#ztc-softShadow)" />
      <circle cx={CX} cy={CY} r={R_HUB - 8} fill="none" stroke="rgba(156,122,47,0.20)" strokeWidth={0.6} />

      {/* Hub text */}
      <text x={CX} y={CY - 14} textAnchor="middle" fill="var(--gl-ink-muted, #4F351F)" fontSize={9} fontWeight={700} letterSpacing={2} style={{ fontFamily: 'var(--font-sans), sans-serif', textTransform: 'uppercase' as const }}>
        AYANĀṂŚA
      </text>
      <text x={CX} y={CY + 16} textAnchor="middle" fill="var(--gl-gold-accent, #9C7A2F)" fontSize={26} fontWeight={700} style={{ fontFamily: 'var(--font-cormorant), serif' }}>
        {calcAyanamsa(2024).toFixed(1)}°
      </text>
    </svg>
  );
}

/* ─── Main component ─── */
export default function ZodiacTraditionComparator() {
  const [viewMode, setViewMode] = useState<ViewMode>('comparative');
  const [year, setYear] = useState<number>(2024);
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);

  const ayanamsa = useMemo(() => calcAyanamsa(year), [year]);

  const tabs: { id: ViewMode; label: string; icon: string }[] = [
    { id: 'tropical', label: 'Tropical', icon: '☉' },
    { id: 'comparative', label: 'Compare', icon: '⇄' },
    { id: 'sidereal', label: 'Sidereal', icon: '✦' },
  ];

  return (
    <div className="my-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* ─── Header strip ─── */}
      <header
        className="gl-surface-twilight-glass"
        style={{
          padding: '16px 22px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '16px',
          alignItems: 'center',
          borderLeft: '4px solid var(--gl-ch3-indigo, #4F6FA8)',
        }}
      >
        <div>
          <p style={{
            fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em',
            color: 'var(--gl-ink-muted, #4F351F)', fontWeight: 700,
            fontFamily: 'var(--font-sans), system-ui, sans-serif', marginBottom: '4px',
          }}>
            Zodiac Reference Frame
          </p>
          <p style={{
            fontFamily: 'var(--font-cormorant), serif', fontWeight: 500, fontSize: '22px',
            color: 'var(--gl-ch3-indigo, #4F6FA8)', lineHeight: 1.2,
          }}>
            Sidereal vs Tropical Comparator
          </p>
          <p style={{
            fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic', fontSize: '13.5px',
            color: 'var(--gl-ink-secondary, #4A3020)', marginTop: '2px',
          }}>
            Move through history, see the ecosystem
          </p>
        </div>

        {/* Ayanamsa badge */}
        <div style={{
          display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
          padding: '10px 18px', borderRadius: '12px',
          background: 'rgba(156,122,47,0.10)', border: '1px solid rgba(156,122,47,0.30)',
        }}>
          <span style={{
            fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.16em',
            color: 'var(--gl-ink-muted, #4F351F)', fontWeight: 700,
            fontFamily: 'var(--font-sans), sans-serif', marginBottom: '2px',
          }}>
            Ayanāṃśa
          </span>
          <span style={{
            fontFamily: 'var(--font-cormorant), serif', fontSize: '28px',
            fontWeight: 700, color: 'var(--gl-gold-accent, #9C7A2F)', lineHeight: 1,
          }}>
            {ayanamsa.toFixed(1)}°
          </span>
        </div>
      </header>

      {/* ─── Main two-column panel ─── */}
      <div
        className="gl-surface-twilight-glass"
        style={{
          padding: '0',
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          overflow: 'hidden',
        }}
      >
        {/* LEFT — Tabs + Wheel */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex', gap: '6px', marginBottom: '20px',
            background: 'rgba(156,122,47,0.08)', borderRadius: '999px',
            padding: '4px', border: '1px solid rgba(156,122,47,0.18)',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '6px', padding: '8px 14px', borderRadius: '999px',
                  fontSize: '11.5px', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-sans), system-ui, sans-serif',
                  cursor: 'pointer', transition: 'all 250ms cubic-bezier(0.32,0.72,0.24,1)',
                  background: viewMode === tab.id ? 'var(--gl-ch3-indigo, #4F6FA8)' : 'transparent',
                  color: viewMode === tab.id ? '#FFFCF0' : 'var(--gl-ink-muted, #4F351F)',
                  border: viewMode === tab.id ? '1px solid var(--gl-ch3-indigo, #4F6FA8)' : '1px solid transparent',
                  boxShadow: viewMode === tab.id ? '0 2px 8px rgba(79,111,168,0.25)' : 'none',
                }}
              >
                <span style={{ fontSize: '14px' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Wheel */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ZodiacWheel
              signs={comparatorData.signs}
              ayanamsa={ayanamsa}
              viewMode={viewMode}
              onSignClick={setSelectedSign}
            />
          </div>
        </div>

        {/* RIGHT — Controls + Info */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          borderLeft: '1px solid rgba(156,122,47,0.20)',
          background: 'rgba(255,252,240,0.40)',
        }}>
          {/* Title */}
          <div style={{ padding: '24px 24px 16px' }}>
            <h3 style={{
              fontFamily: 'var(--font-cormorant), serif', fontSize: '26px', fontWeight: 500,
              color: 'var(--gl-ch3-indigo, #4F6FA8)', marginBottom: '6px',
            }}>
              Zodiac Traditions
            </h3>
            <p style={{
              fontSize: '13px', color: 'var(--gl-ink-secondary, #4A3020)',
              lineHeight: 1.65, fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
            }}>
              Compare the seasonal (Tropical) and star-based (Sidereal) zodiacs to visualize the precession of the equinoxes.
            </p>
          </div>

          {/* Time scrubber */}
          <div style={{
            padding: '16px 24px',
            background: 'rgba(156,122,47,0.06)',
            borderTop: '1px solid rgba(156,122,47,0.15)',
            borderBottom: '1px solid rgba(156,122,47,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px' }}>⏳</span>
                <span style={{
                  fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.16em',
                  color: 'var(--gl-ch3-indigo, #4F6FA8)', fontWeight: 700,
                  fontFamily: 'var(--font-sans), system-ui, sans-serif',
                }}>
                  Time Travel
                </span>
              </div>
              <span style={{
                fontFamily: 'var(--font-cormorant), serif', fontSize: '24px',
                fontWeight: 700, color: 'var(--gl-gold-accent, #9C7A2F)',
              }}>
                {year} <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gl-ink-muted, #4F351F)' }}>CE</span>
              </span>
            </div>

            <input
              type="range"
              min={285}
              max={2024}
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              style={{
                width: '100%', cursor: 'pointer',
                accentColor: 'var(--gl-gold-accent, #9C7A2F)',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{
                fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em',
                color: 'var(--gl-ink-muted, #4F351F)', fontWeight: 700,
                fontFamily: 'var(--font-sans), sans-serif',
              }}>
                285 CE (Aligned)
              </span>
              <span style={{
                fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.14em',
                color: 'var(--gl-ink-muted, #4F351F)', fontWeight: 700,
                fontFamily: 'var(--font-sans), sans-serif',
              }}>
                Present Day
              </span>
            </div>
          </div>

          {/* Info panel */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              {selectedSign ? (
                <motion.div
                  key={`sign-${selectedSign.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  style={{ padding: '24px', overflowY: 'auto', height: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <h4 style={{
                        fontFamily: 'var(--font-cormorant), serif', fontSize: '26px', fontWeight: 500,
                        color: 'var(--gl-ch3-indigo, #4F6FA8)', lineHeight: 1.2,
                      }}>
                        {selectedSign.name}
                      </h4>
                      <span style={{
                        fontSize: '13px', color: 'var(--gl-ink-muted, #4F351F)',
                        fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
                      }}>
                        {selectedSign.sanskritName}
                      </span>
                    </div>
                    <span style={{
                      display: 'inline-flex', padding: '4px 12px', borderRadius: '999px',
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                      background: 'rgba(156,122,47,0.10)', border: '1px solid rgba(156,122,47,0.25)',
                      color: 'var(--gl-gold-accent, #9C7A2F)',
                      fontFamily: 'var(--font-sans), sans-serif',
                    }}>
                      {selectedSign.element} · {selectedSign.modality}
                    </span>
                  </div>

                  <div style={{ width: '32px', height: '3px', borderRadius: '999px', background: 'var(--gl-gold-accent, #9C7A2F)', opacity: 0.35, marginBottom: '16px' }} />

                  <p style={{
                    fontSize: '14px', color: 'var(--gl-ink-secondary, #4A3020)',
                    lineHeight: 1.75, fontFamily: 'var(--font-cormorant), serif',
                    marginBottom: '20px',
                  }}>
                    {selectedSign.description}
                  </p>

                  <button
                    onClick={() => setSelectedSign(null)}
                    className="gl-clickable"
                    style={{
                      width: '100%', padding: '10px 18px', borderRadius: '10px',
                      background: 'rgba(156,122,47,0.08)', border: '1px solid rgba(156,122,47,0.25)',
                      color: 'var(--gl-ch3-indigo, #4F6FA8)', fontSize: '12px',
                      fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                      cursor: 'pointer', fontFamily: 'var(--font-sans), system-ui, sans-serif',
                      transition: 'all 250ms cubic-bezier(0.32,0.72,0.24,1)',
                    }}
                  >
                    ← Back to Overview
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  style={{ padding: '24px', overflowY: 'auto', height: '100%' }}
                >
                  <p style={{
                    fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.18em',
                    color: 'var(--gl-gold-accent, #9C7A2F)', fontWeight: 700,
                    fontFamily: 'var(--font-sans), system-ui, sans-serif', marginBottom: '10px',
                  }}>
                    Philosophical Context
                  </p>

                  <AnimatePresence mode="wait">
                    {viewMode === 'tropical' && (
                      <motion.p key="trop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ fontSize: '14px', color: 'var(--gl-ink-secondary, #4A3020)', lineHeight: 1.75, fontFamily: 'var(--font-cormorant), serif' }}>
                        {comparatorData.content.tropicalPhilosophy}
                      </motion.p>
                    )}
                    {viewMode === 'sidereal' && (
                      <motion.p key="sid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ fontSize: '14px', color: 'var(--gl-ink-secondary, #4A3020)', lineHeight: 1.75, fontFamily: 'var(--font-cormorant), serif' }}>
                        {comparatorData.content.siderealPhilosophy}
                      </motion.p>
                    )}
                    {viewMode === 'comparative' && (
                      <motion.div key="comp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <p style={{ fontSize: '14px', color: 'var(--gl-ink-secondary, #4A3020)', lineHeight: 1.75, fontFamily: 'var(--font-cormorant), serif' }}>
                          {comparatorData.content.ayanamsaExplanation}
                        </p>
                        <div style={{
                          padding: '14px 16px', borderRadius: '10px',
                          background: 'rgba(156,122,47,0.08)',
                          border: '1px solid rgba(156,122,47,0.22)',
                          borderLeft: '3px solid var(--gl-gold-accent, #9C7A2F)',
                        }}>
                          <p style={{
                            fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em',
                            color: 'var(--gl-gold-accent, #9C7A2F)', fontWeight: 700,
                            fontFamily: 'var(--font-sans), sans-serif', marginBottom: '6px',
                          }}>
                            Astrological Impact
                          </p>
                          <p style={{
                            fontSize: '13px', color: 'var(--gl-ink-primary, #3E2A1F)',
                            lineHeight: 1.65, fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
                          }}>
                            Because of Ayanāṃśa, your sun sign in Vedic (Sidereal) astrology is often one entire sign &quot;behind&quot; your Western (Tropical) sun sign!
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── Tip bar ─── */}
      <div
        style={{
          padding: '10px 16px', borderRadius: '10px',
          background: 'rgba(156,122,47,0.08)', border: '1px solid rgba(156,122,47,0.22)',
          display: 'flex', alignItems: 'center', gap: '10px',
        }}
      >
        <span style={{ fontSize: '16px' }}>🌀</span>
        <p style={{
          fontSize: '12.5px', color: 'var(--gl-ink-secondary, #4A3020)',
          lineHeight: 1.55, fontFamily: 'var(--font-cormorant), serif', fontStyle: 'italic',
        }}>
          <strong>Tip:</strong> Click any sign on the wheel for details. Drag the Time Travel slider to watch the Tropical zodiac drift relative to the fixed Sidereal zodiac.
        </p>
      </div>
    </div>
  );
}
