"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { AlertTriangle, CheckCircle2, Info, RotateCcw, Scale, ShieldAlert, Sparkles } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

type Sign = (typeof SIGNS)[number];
type Dignity = "own" | "exalted" | "mula" | "friendly" | "neutral" | "debilitated";
type HouseCategory = "kendra" | "trikona" | "upachaya" | "other";

const LORDS: Record<Sign, string> = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const DIGNITY_META: Record<Dignity, { label: string; color: string; strong: boolean }> = {
  own: { label: "Own sign", color: GREEN, strong: true },
  exalted: { label: "Exalted", color: GREEN, strong: true },
  mula: { label: "Mūlatrikoṇa", color: GREEN, strong: true },
  friendly: { label: "Friendly sign", color: BLUE, strong: false },
  neutral: { label: "Neutral sign", color: INK_MUTED, strong: false },
  debilitated: { label: "Debilitated", color: VERMILION, strong: false },
};

const HOUSE_CATEGORY_META: Record<HouseCategory, { label: string; color: string; acceptable: boolean }> = {
  kendra: { label: "Kendra", color: GREEN, acceptable: true },
  trikona: { label: "Trikoṇa", color: GREEN, acceptable: true },
  upachaya: { label: "Upachaya", color: BLUE, acceptable: false },
  other: { label: "Other", color: INK_MUTED, acceptable: false },
};

function signIndex(sign: Sign): number {
  return SIGNS.indexOf(sign);
}

function houseFromLagna(sign: Sign, lagna: Sign): number {
  return ((signIndex(sign) - signIndex(lagna) + 12) % 12) + 1;
}

function isKendraOrTrikona(house: number): boolean {
  return [1, 4, 5, 7, 9, 10].includes(house);
}

function houseCategory(house: number): HouseCategory {
  if ([1, 4, 7, 10].includes(house)) return "kendra";
  if ([1, 5, 9].includes(house)) return "trikona";
  if ([3, 6, 10, 11].includes(house)) return "upachaya";
  return "other";
}

function SignWheel({
  lagna,
  ninthSign,
  ninthLordSign,
  lagnaLordSign,
}: {
  lagna: Sign;
  ninthSign: Sign;
  ninthLordSign: Sign;
  lagnaLordSign: Sign;
}) {
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;

  const lagnaIx = signIndex(lagna);
  const ninthIx = signIndex(ninthSign);
  const ninthLordIx = signIndex(ninthLordSign);
  const lagnaLordIx = signIndex(lagnaLordSign);

  function coords(index: number, radius: number) {
    const angle = ((index - lagnaIx) * 30 - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  }

  return (
    <svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Launch moment chart showing lagna, ninth house, and lord placements" style={{ width: "100%", maxWidth: 320 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={HAIRLINE} strokeWidth={1} />
      {SIGNS.map((_, i) => {
        const a = ((i - lagnaIx) * 30 - 90) * (Math.PI / 180);
        const x1 = cx + (r - 8) * Math.cos(a);
        const y1 = cy + (r - 8) * Math.sin(a);
        const x2 = cx + r * Math.cos(a);
        const y2 = cy + r * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK_MUTED} strokeWidth={1} />;
      })}
      {SIGNS.map((sign, i) => {
        const pos = coords(i, r - 22);
        const isLagna = i === lagnaIx;
        const isNinth = i === ninthIx;
        const fill = isLagna ? `${PURPLE}18` : isNinth ? `${GREEN}18` : "transparent";
        const stroke = isLagna ? PURPLE : isNinth ? GREEN : HAIRLINE;
        return (
          <g key={sign}>
            <circle cx={pos.x} cy={pos.y} r={16} fill={fill} stroke={stroke} strokeWidth={isLagna || isNinth ? 2 : 1} />
            <text x={pos.x} y={pos.y + 3} textAnchor="middle" fontSize={8} fill={isLagna || isNinth ? INK_PRIMARY : INK_SECONDARY} fontWeight={600}>
              {sign.slice(0, 3)}
            </text>
          </g>
        );
      })}
      <polygon points={`${cx},${cy - r - 8} ${cx - 5},${cy - r + 4} ${cx + 5},${cy - r + 4}`} fill={PURPLE} />
      <text x={cx} y={cy - r - 14} textAnchor="middle" fontSize={9} fill={PURPLE} fontWeight={600}>
        Lagna
      </text>
      {(() => {
        const pos = coords(ninthLordIx, r - 55);
        return (
          <g>
            <circle cx={pos.x} cy={pos.y} r={10} fill={SURFACE} stroke={GOLD} strokeWidth={2} />
            <text x={pos.x} y={pos.y + 3} textAnchor="middle" fontSize={7} fill={GOLD} fontWeight={700}>
              9L
            </text>
          </g>
        );
      })()}
      {(() => {
        const pos = coords(lagnaLordIx, r - 55);
        return (
          <g>
            <circle cx={pos.x} cy={pos.y} r={10} fill={SURFACE} stroke={BLUE} strokeWidth={2} />
            <text x={pos.x} y={pos.y + 3} textAnchor="middle" fontSize={7} fill={BLUE} fontWeight={700}>
              LL
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

function ToggleGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { key: T; label: string; color: string }[];
  onChange: (key: T) => void;
}) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          aria-pressed={value === opt.key}
          onClick={() => onChange(opt.key)}
          style={{
            padding: "0.3rem 0.55rem",
            borderRadius: 6,
            border: `1px solid ${value === opt.key ? opt.color : HAIRLINE}`,
            background: value === opt.key ? `${opt.color}15` : "transparent",
            color: value === opt.key ? opt.color : INK_SECONDARY,
            fontSize: "0.78rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function LaunchMomentWealthYogaWorkbench() {
  const [lagna, setLagna] = useState<Sign>("Virgo");
  const [ninthDignity, setNinthDignity] = useState<Dignity>("own");
  const [ninthPlacement, setNinthPlacement] = useState<Sign>("Taurus");
  const [lagnaLordDignity, setLagnaLordDignity] = useState<Dignity>("own");
  const [lagnaLordPlacement, setLagnaLordPlacement] = useState<Sign>("Gemini");

  const ninthSign = useMemo(() => SIGNS[(signIndex(lagna) + 8) % 12], [lagna]);
  const ninthLord = LORDS[ninthSign];
  const lagnaLord = LORDS[lagna];

  const ninthLordHouse = houseFromLagna(ninthPlacement, lagna);

  const ninthLordStrong = DIGNITY_META[ninthDignity].strong;
  const ninthLordAcceptableHouse = isKendraOrTrikona(ninthLordHouse);
  const lagnaLordStrong = DIGNITY_META[lagnaLordDignity].strong;

  const structuralEcho = ninthLordStrong && ninthLordAcceptableHouse && lagnaLordStrong;

  function loadAnanya() {
    setLagna("Virgo");
    setNinthDignity("own");
    setNinthPlacement("Taurus");
    setLagnaLordDignity("own");
    setLagnaLordPlacement("Gemini");
  }

  function handleReset() {
    loadAnanya();
  }

  return (
    <div data-interactive="launch-moment-wealth-yoga-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Wealth-yoga structure in the launch-moment chart</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.25rem", fontWeight: 600 }}>
              {`Read the launch-moment's own chart through T1-14's Lakṣmī-yoga structure`}
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`This workbench checks the moment's own 9th lord and lagna lord. It never claims to activate or create anyone's natal yoga.`}
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            borderRadius: 4,
            background: `${VERMILION}10`,
            color: VERMILION,
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <ShieldAlert size={10} />
          Consumer-protection note: Lakṣmī-yoga is not a ritual-purchase product (T2-05 §4.4)
        </div>
      </section>

      <div
        style={{
          ...cardStyle,
          borderColor: `${VERMILION}50`,
          background: `${VERMILION}08`,
          fontSize: "0.85rem",
          color: INK_SECONDARY,
          lineHeight: 1.6,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontWeight: 600, color: VERMILION }}>
          <AlertTriangle size={14} />
          Boundary discipline
        </span>
        {` A favourable reading here describes the launch-moment's own chart, not the founder's permanent natal fortune. This lesson does not cultivate, activate, or create a natal Lakṣmī-yoga.`}
      </div>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Launch-moment chart</p>
          <SignWheel lagna={lagna} ninthSign={ninthSign} ninthLordSign={ninthPlacement} lagnaLordSign={lagnaLordPlacement} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "center" }}>
            <LegendDot color={PURPLE} label="Lagna" />
            <LegendDot color={GREEN} label="9th house" />
            <LegendDot color={GOLD} label="9th lord" />
            <LegendDot color={BLUE} label="Lagna lord" />
          </div>
          <button type="button" onClick={loadAnanya} style={{ ...buttonStyle(false, PURPLE), alignSelf: "center" }}>
            <Sparkles size={14} />
            Load Ananya Rao preset
          </button>
        </section>

        <section style={{ ...cardStyle, flex: "2 1 400px", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: INK_PRIMARY }}>Launch lagna</span>
            <select value={lagna} onChange={(e) => setLagna(e.target.value as Sign)} style={selectStyle}>
              {SIGNS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
            <div style={{ fontSize: "0.8rem", color: INK_MUTED, marginBottom: "0.25rem" }}>Computed from lagna</div>
            <div style={{ fontSize: "0.9rem", color: INK_PRIMARY }}>
              9th house: <strong style={{ color: GREEN, fontWeight: 600 }}>{ninthSign}</strong> — lord: <strong style={{ color: GREEN, fontWeight: 600 }}>{ninthLord}</strong>
            </div>
            <div style={{ fontSize: "0.9rem", color: INK_PRIMARY, marginTop: "0.15rem" }}>
              Lagna lord: <strong style={{ color: PURPLE, fontWeight: 600 }}>{lagnaLord}</strong>
            </div>
          </div>

          <CriterionPanel
            title="9th lord structural check"
            planet={ninthLord}
            lagna={lagna}
            sign={ninthPlacement}
            setSign={setNinthPlacement}
            dignity={ninthDignity}
            setDignity={setNinthDignity}
            requireKendraTrikona
          />

          <CriterionPanel
            title="Lagna lord strength check"
            planet={lagnaLord}
            lagna={lagna}
            sign={lagnaLordPlacement}
            setSign={setLagnaLordPlacement}
            dignity={lagnaLordDignity}
            setDignity={setLagnaLordDignity}
          />

          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: 8,
              border: `1px solid ${structuralEcho ? GREEN : GOLD}`,
              background: structuralEcho ? `${GREEN}10` : `${GOLD}10`,
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            {structuralEcho ? <CheckCircle2 size={22} color={GREEN} /> : <Info size={22} color={GOLD} />}
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 600, color: structuralEcho ? GREEN : GOLD }}>
                {structuralEcho ? "Moment-chart structural echo" : "No structural echo"}
              </div>
              <div style={{ fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.55 }}>
                {structuralEcho
                  ? `The launch-moment's own chart structurally echoes T1-14's Lakṣmī-yoga pattern. Report this as one favourable moment-indicator only.`
                  : `The moment-chart does not echo the pattern. This is not a failure of the founder's own fortune — it is simply a less-favourable moment by this indicator.`}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.65rem" }}>
        <MistakeCard
          title="'Activating' the founder's own Lakṣmī-yoga"
          body="Never tell a client that a muhūrta will activate or create their natal Lakṣmī-yoga. That framing is explicitly forbidden by T2-05's consumer-protection doctrine."
        />
        <MistakeCard
          title="Conflating natal yoga with moment-chart echo"
          body="A natal Lakṣmī-yoga is a permanent birth-chart feature. A launch-moment echo is a temporary, moment-specific auspiciousness-indicator. The criteria are the same; the objects are different."
        />
      </div>
    </div>
  );
}

function CriterionPanel({
  title,
  planet,
  lagna,
  sign,
  setSign,
  dignity,
  setDignity,
  requireKendraTrikona,
}: {
  title: string;
  planet: string;
  lagna: Sign;
  sign: Sign;
  setSign: (s: Sign) => void;
  dignity: Dignity;
  setDignity: (d: Dignity) => void;
  requireKendraTrikona?: boolean;
}) {
  const strong = DIGNITY_META[dignity].strong;
  const house = houseFromLagna(sign, lagna);
  const acceptableHouse = requireKendraTrikona ? isKendraOrTrikona(house) : true;
  const ok = strong && acceptableHouse;
  const cat = houseCategory(house);

  return (
    <div style={{ ...cardStyle, borderColor: ok ? GREEN : HAIRLINE, background: ok ? `${GREEN}08` : SURFACE }}>
      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: ok ? GREEN : INK_PRIMARY, marginBottom: "0.5rem" }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <span style={{ fontSize: "0.78rem", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{planet} dignity</span>
        <ToggleGroup
          value={dignity}
          onChange={setDignity}
          options={[
            { key: "own", label: "Own", color: GREEN },
            { key: "exalted", label: "Exalted", color: GREEN },
            { key: "mula", label: "Mūla", color: GREEN },
            { key: "friendly", label: "Friendly", color: BLUE },
            { key: "neutral", label: "Neutral", color: INK_MUTED },
            { key: "debilitated", label: "Debilitated", color: VERMILION },
          ]}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginTop: "0.65rem" }}>
        <span style={{ fontSize: "0.78rem", color: INK_MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{planet} placement</span>
        <select value={sign} onChange={(e) => setSign(e.target.value as Sign)} style={selectStyle}>
          {SIGNS.map((s) => {
            const h = houseFromLagna(s, lagna);
            return (
              <option key={s} value={s}>
                {s} — house {h}
              </option>
            );
          })}
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: INK_SECONDARY }}>
          <span>From lagna:</span>
          <span style={{ fontWeight: 600, color: ok ? GREEN : GOLD }}>
            House {house} — {HOUSE_CATEGORY_META[cat].label}
          </span>
        </div>
      </div>
    </div>
  );
}

function MistakeCard({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ ...cardStyle, borderColor: `${VERMILION}50`, background: `${VERMILION}08` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.35rem" }}>
        <Scale size={12} />
        Common mistake
      </div>
      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: INK_PRIMARY, marginBottom: "0.25rem" }}>{title}</div>
      <div style={{ fontSize: "0.8rem", color: INK_SECONDARY, lineHeight: 1.55 }}>{body}</div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.72rem", color: INK_SECONDARY }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      {label}
    </span>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const buttonStyle = (active: boolean, color: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.45rem 0.85rem",
  borderRadius: 6,
  border: `1px solid ${active ? color : HAIRLINE}`,
  background: active ? `${color}15` : "transparent",
  color: active ? color : INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
  cursor: "pointer",
});

const selectStyle: CSSProperties = {
  width: "100%",
  padding: "0.45rem 0.6rem",
  borderRadius: 6,
  border: `1px solid ${HAIRLINE}`,
  background: "transparent",
  color: INK_PRIMARY,
  fontSize: "0.85rem",
  fontWeight: 500,
  appearance: "none",
  cursor: "pointer",
};
