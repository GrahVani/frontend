"use client";

import { useMemo, useState } from "react";
import { Calculator, Moon, RotateCcw, Sun, TriangleAlert } from "lucide-react";

type DignityCue = "strong" | "mixed" | "weak";

interface Preset {
  label: string;
  tithi: number;
  note: string;
}

const TITHI_NAMES = [
  "Pratipada",
  "Dvitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dvadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima",
  "Pratipada",
  "Dvitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dvadashi",
  "Trayodashi",
  "Chaturdashi",
  "Amavasya",
];

const PRESETS: Preset[] = [
  { label: "New Moon", tithi: 30, note: "Moon minimum, Sun maximum" },
  { label: "Shukla Ashtami", tithi: 8, note: "First half-moon balance" },
  { label: "Purnima", tithi: 15, note: "Moon maximum, Sun minimum" },
  { label: "Krishna Ashtami", tithi: 23, note: "Second half-moon balance" },
  { label: "Lesson example", tithi: 12, note: "Bright half, Moon favoured" },
];

function clampVirupa(value: number) {
  return Math.max(0, Math.min(60, Math.round(value)));
}

function pakshaForTithi(tithi: number) {
  return tithi <= 15 ? "shukla" : "krishna";
}

function separationForTithi(tithi: number) {
  if (tithi <= 15) return tithi * 12;
  return 180 + (tithi - 15) * 12;
}

function moonBalaForTithi(tithi: number) {
  if (tithi <= 15) return clampVirupa((tithi / 15) * 60);
  return clampVirupa(((30 - tithi) / 15) * 60);
}

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function PakshabalaSlider() {
  const [tithi, setTithi] = useState(12);
  const [moonDignity, setMoonDignity] = useState<DignityCue>("mixed");
  const [sunDignity, setSunDignity] = useState<DignityCue>("mixed");

  const paksha = pakshaForTithi(tithi);
  const pakshaNumber = paksha === "shukla" ? tithi : tithi - 15;
  const separation = separationForTithi(tithi);
  const moonBala = moonBalaForTithi(tithi);
  const sunBala = 60 - moonBala;
  const total = moonBala + sunBala;
  const tithiName = TITHI_NAMES[tithi - 1] ?? "Tithi";
  const moonPoint = useMemo(() => polar(170, 170, 118, separation), [separation]);
  const phaseLabel = paksha === "shukla" ? "Shukla paksha / waxing" : "Krishna paksha / waning";

  const moonRead = moonBala >= 45 ? "Moon is phase-strong" : moonBala <= 15 ? "Moon is phase-weak" : "Moon is phase-moderate";
  const sunRead = sunBala >= 45 ? "Sun is phase-strong" : sunBala <= 15 ? "Sun is phase-weak" : "Sun is phase-moderate";

  const dignityWeight: Record<DignityCue, number> = { strong: 18, mixed: 0, weak: -18 };
  const combinedMoon = Math.max(0, Math.min(100, Math.round((moonBala / 60) * 70 + 15 + dignityWeight[moonDignity])));
  const combinedSun = Math.max(0, Math.min(100, Math.round((sunBala / 60) * 70 + 15 + dignityWeight[sunDignity])));

  return (
    <div
      data-interactive="pakshabala-slider"
      className="w-full"
      style={{
        background: "var(--gl-surface-card, #FFF9F0)",
        border: "1px solid var(--gl-gold-hairline)",
        borderRadius: "16px",
        padding: "20px",
      }}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase" style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.08em" }}>
            Paksha-bala slider
          </div>
          <h2 className="mt-1 text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            The lights trade 60 virupas across the lunar month
          </h2>
          <p className="mt-1 max-w-2xl text-sm" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.55 }}>
            Drag through the 30 tithis. The Moon peaks at full moon; the Sun peaks at new moon. Their paksha-bala always sums to 60.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setTithi(12);
            setMoonDignity("mixed");
            setSunDignity("mixed");
          }}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold"
          style={{ background: "transparent", color: "var(--gl-ink-secondary)", border: "1px solid var(--gl-gold-hairline)" }}
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setTithi(preset.tithi)}
            className="rounded-md px-3 py-2 text-left text-xs font-semibold"
            style={{
              background: tithi === preset.tithi ? "#336CA8" : "rgba(255,255,255,0.5)",
              color: tithi === preset.tithi ? "#fff" : "var(--gl-ink-secondary)",
              border: "1px solid var(--gl-gold-hairline)",
            }}
            title={preset.note}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(300px,0.95fr)_minmax(0,1.05fr)]">
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid var(--gl-gold-hairline)" }}>
          <svg viewBox="0 0 340 340" className="mx-auto h-auto w-full" style={{ maxWidth: "360px" }} role="img" aria-label="Sun Moon separation diagram">
            <defs>
              <filter id="pbShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#6B4423" floodOpacity="0.14" />
              </filter>
            </defs>
            <circle cx="170" cy="170" r="126" fill="#FFFDF7" stroke="var(--gl-gold-hairline)" />
            <path
              d={paksha === "shukla" ? "M 170 44 A 126 126 0 0 1 170 296" : "M 170 296 A 126 126 0 0 1 170 44"}
              fill="none"
              stroke={paksha === "shukla" ? "#D99622" : "#A44135"}
              strokeWidth="10"
              opacity="0.35"
            />
            <line x1="170" y1="170" x2="170" y2="52" stroke="#D99622" strokeWidth="2" strokeDasharray="5 5" />
            <line x1="170" y1="170" x2={moonPoint.x} y2={moonPoint.y} stroke="#6D7FA8" strokeWidth="2.5" />
            <circle cx="170" cy="170" r="32" fill="#FFF2BF" stroke="#D99622" strokeWidth="3" filter="url(#pbShadow)" />
            <text x="170" y="176" textAnchor="middle" fontSize="18" fontWeight="900" fill="#D99622">
              Su
            </text>
            <circle cx={moonPoint.x} cy={moonPoint.y} r="24" fill="#E9EEF8" stroke="#6D7FA8" strokeWidth="3" filter="url(#pbShadow)" />
            <text x={moonPoint.x} y={moonPoint.y + 5} textAnchor="middle" fontSize="15" fontWeight="900" fill="#6D7FA8">
              Mo
            </text>
            <text x="170" y="24" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--gl-ink-muted)">
              New moon axis
            </text>
            <text x="170" y="324" textAnchor="middle" fontSize="11" fontWeight="800" fill="var(--gl-ink-muted)">
              Full moon axis
            </text>
            <text x="170" y="112" textAnchor="middle" fontSize="12" fontWeight="800" fill={paksha === "shukla" ? "#9A6B12" : "#A44135"}>
              {separation} deg
            </text>
          </svg>

          <div className="mt-4">
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tithi}
              onChange={(event) => setTithi(Number(event.target.value))}
              className="w-full"
              aria-label="Select tithi"
              style={{ accentColor: paksha === "shukla" ? "#D99622" : "#A44135" }}
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-bold" style={{ color: paksha === "shukla" ? "#9A6B12" : "#A44135" }}>
                Tithi {tithi}: {paksha === "shukla" ? "Shukla" : "Krishna"} {pakshaNumber}/15 {tithiName}
              </span>
              <span className="rounded-md px-3 py-1.5 text-xs font-semibold" style={{ background: paksha === "shukla" ? "#FFF2BF" : "#F7D9D5", color: paksha === "shukla" ? "#8A650D" : "#A44135" }}>
                {phaseLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ background: "#FFFDF7", border: "1px solid var(--gl-gold-hairline)" }}>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
              <Calculator size={16} />
              Virupa calculation
            </div>
            <div className="mt-4 space-y-3">
              <BalaBar icon="moon" label="Moon paksha-bala" value={moonBala} color="#6D7FA8" />
              <BalaBar icon="sun" label="Sun paksha-bala" value={sunBala} color="#D99622" />
            </div>
            <div className="mt-4 rounded-lg p-3" style={{ background: total === 60 ? "#E7F4EC" : "#F7D9D5", border: `1px solid ${total === 60 ? "#8FC8A4" : "#D99A92"}` }}>
              <div className="text-sm font-bold" style={{ color: total === 60 ? "#2F7D55" : "#A44135" }}>
                Sum check: {moonBala} + {sunBala} = {total} virupas
              </div>
              <p className="mt-1 text-xs" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.5 }}>
                This inverse symmetry is the lights&apos; polarity expressed as arithmetic.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ReadingCard title="Moon reading" value={moonRead} detail={`Formula cue: Moon receives ${moonBala}/60 from this tithi.`} color="#6D7FA8" />
            <ReadingCard title="Sun reading" value={sunRead} detail={`Formula cue: Sun receives ${sunBala}/60 from this tithi.`} color="#D99622" />
          </div>

          <div className="rounded-xl p-4" style={{ background: "#EEF4FB", border: "1px solid #BFD2EA" }}>
            <div className="text-sm font-semibold" style={{ color: "#365A88" }}>
              Combine with dignity
            </div>
            <p className="mt-1 text-xs" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.5 }}>
              Paksha-bala is one strength component. Use these switches to feel how dignity can support or complicate the phase reading.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <DignitySwitch label="Moon dignity" value={moonDignity} onChange={setMoonDignity} />
              <DignitySwitch label="Sun dignity" value={sunDignity} onChange={setSunDignity} />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <ReadingCard title="Moon combined cue" value={`${combinedMoon}/100`} detail="Phase plus a simple dignity adjustment." color="#6D7FA8" />
              <ReadingCard title="Sun combined cue" value={`${combinedSun}/100`} detail="Phase plus a simple dignity adjustment." color="#D99622" />
            </div>
          </div>

          <div className="rounded-xl p-4" style={{ background: "#FFF8DC", border: "1px solid #E8C96A" }}>
            <div className="flex items-start gap-3">
              <TriangleAlert size={18} color="#B88719" />
              <p className="text-sm font-semibold" style={{ color: "#7A5A12", lineHeight: 1.55 }}>
                Do not read paksha-bala as the Moon&apos;s whole strength. Full shadbala comes later; this lesson isolates the phase component.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BalaBar({ icon, label, value, color }: { icon: "sun" | "moon"; label: string; value: number; color: string }) {
  const Icon = icon === "sun" ? Sun : Moon;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          <Icon size={15} color={color} />
          {label}
        </span>
        <span className="text-sm font-bold" style={{ color }}>
          {value} / 60
        </span>
      </div>
      <div className="h-4 overflow-hidden rounded-full" style={{ background: "#E8DFCF" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${(value / 60) * 100}%`, background: color }} />
      </div>
    </div>
  );
}

function ReadingCard({ title, value, detail, color }: { title: string; value: string; detail: string; color: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: `${color}12`, border: `1px solid ${color}40` }}>
      <div className="text-xs font-bold uppercase" style={{ color, letterSpacing: "0.06em" }}>
        {title}
      </div>
      <div className="mt-2 text-base font-bold" style={{ color: "var(--gl-ink-primary)" }}>
        {value}
      </div>
      <p className="mt-1 text-xs" style={{ color: "var(--gl-ink-muted)", lineHeight: 1.45 }}>
        {detail}
      </p>
    </div>
  );
}

function DignitySwitch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: DignityCue;
  onChange: (value: DignityCue) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-bold uppercase" style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.06em" }}>
        {label}
      </div>
      <div className="flex rounded-md" style={{ border: "1px solid #BFD2EA", overflow: "hidden" }}>
        {(["strong", "mixed", "weak"] as DignityCue[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className="flex-1 px-2 py-2 text-xs font-semibold capitalize"
            style={{
              background: value === option ? "#336CA8" : "#fff",
              color: value === option ? "#fff" : "var(--gl-ink-secondary)",
              borderRight: option === "weak" ? "none" : "1px solid #BFD2EA",
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
